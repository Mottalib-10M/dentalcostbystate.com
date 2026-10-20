/**
 * Price of a procedure in one state, from that state's Medicaid fee schedule and the ADA Health Policy
 * Institute ratios of the same state (src/data/states.json, built by scripts/build-data.py).
 *
 *   Medicaid fee of the CDT codes that make the procedure
 *   ÷ (Medicaid fee-for-service as a share of average dentist charges)          = estimated dentist charge
 *   ÷ (Medicaid fee-for-service as a share of average private insurance payment) = estimated in-network price
 *
 * Both ratios describe Medicaid fees collected through July 2024, dentist charges of April 2023 to March 2024
 * and private payments of the second quarter of 2024. So the fees divided are the schedule in force on
 * July 1, 2024, and the result is carried to today with the consumer price index for dental services
 * (`uplift`, from params-2026.json > cpiDental).
 *
 * A procedure is a list of slots; each slot accepts alternative codes (the first one present in the schedule
 * is used) and a count. A slot that no code of the schedule fills makes the estimate unavailable: the site never
 * guesses a missing fee.
 */
export type Pop = 'adult' | 'child';
export interface Ratios { childCharge: number | null; adultCharge: number | null; childPrivate: number | null; adultPrivate: number | null }
export interface FeeState {
  code: string; name: string;
  /** CDT code -> fee in dollars for all ages, or by age group. */
  fees: Record<string, { all?: number; adult?: number; child?: number }>;
  ratios: Ratios;
}
/** Price-index factors from the ADA windows to today: dentist charges, private payments. */
export interface Uplift { charge: number; priv: number }
const NO_UPLIFT: Uplift = { charge: 1, priv: 1 };
export interface Slot { codes: string[]; n: number; label: string }
export interface Line { code: string; label: string; n: number; fee: number }
export interface Estimate {
  ok: boolean;
  /** Medicaid fee-for-service total of the codes used. */
  medicaid: number;
  /** Estimated average dentist charge today (full fee, before any network discount). */
  charge: number;
  /** Estimated average in-network price today (what a private dental plan allows). */
  allowed: number;
  /** The same two estimates in dollars of the ADA windows (2023-2024), before the price index. */
  charge24: number; allowed24: number;
  lines: Line[];
  missing: string[];
  /** Ratio population actually used: the procedure's own, or the other one when the state has no figure for it. */
  ratioPop: Pop | null;
  /** Age group of the fees used: the procedure's own, or children's when the state pays the codes for children only. */
  feePop: Pop;
  rCharge: number; rPrivate: number;
}

export function feeOf(st: FeeState, code: string, pop: Pop): number | null {
  const f = st.fees[code];
  if (!f) return null;
  const v = f[pop] ?? f.all ?? null;
  return typeof v === 'number' && v > 0 ? v : null;
}

export function ratiosFor(st: FeeState, pop: Pop): { pop: Pop; charge: number; priv: number } | null {
  const r = st.ratios;
  const own = pop === 'adult' ? [r.adultCharge, r.adultPrivate] : [r.childCharge, r.childPrivate];
  if (own[0] && own[1]) return { pop, charge: own[0], priv: own[1] };
  const other: Pop = pop === 'adult' ? 'child' : 'adult';
  const o = other === 'adult' ? [r.adultCharge, r.adultPrivate] : [r.childCharge, r.childPrivate];
  if (o[0] && o[1]) return { pop: other, charge: o[0], priv: o[1] };
  return null;
}

/**
 * An adult procedure in a state that lists the codes for children only (Texas, for instance, where Medicaid
 * pays comprehensive dental care to people under 21) is priced from the children's fees and the children's
 * ratio of the same state: fee and ratio always describe the same group of patients.
 */
export function estimate(st: FeeState, slots: Slot[], pop: Pop, up: Uplift = NO_UPLIFT): Estimate {
  const own = estimateFor(st, slots, pop, pop, up);
  if (own.ok || pop === 'child') return own;
  const kids = estimateFor(st, slots, 'child', 'child', up);
  return kids.ok ? kids : own;
}

function estimateFor(st: FeeState, slots: Slot[], pop: Pop, feePop: Pop, up: Uplift): Estimate {
  const lines: Line[] = [];
  const missing: string[] = [];
  for (const s of slots) {
    let found = false;
    for (const c of s.codes) {
      const fee = feeOf(st, c, feePop);
      if (fee !== null) { lines.push({ code: c, label: s.label, n: s.n, fee }); found = true; break; }
    }
    if (!found) missing.push(s.codes.join(' or '));
  }
  const r = ratiosFor(st, pop);
  const medicaid = lines.reduce((a, l) => a + l.fee * l.n, 0);
  if (missing.length || !r) return { ok: false, medicaid, charge: 0, allowed: 0, charge24: 0, allowed24: 0, lines, missing, ratioPop: r?.pop ?? null, feePop, rCharge: r?.charge ?? 0, rPrivate: r?.priv ?? 0 };
  return { ok: true, medicaid, charge: (medicaid / r.charge) * up.charge, allowed: (medicaid / r.priv) * up.priv, charge24: medicaid / r.charge, allowed24: medicaid / r.priv, lines, missing, ratioPop: r.pop, feePop, rCharge: r.charge, rPrivate: r.priv };
}

/** Median of a list (average of the two middle values for an even count). */
export function median(xs: number[]): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}
