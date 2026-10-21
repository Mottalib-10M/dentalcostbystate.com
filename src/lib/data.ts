/**
 * The data asset (scripts/build-data.py): one row per state whose Medicaid dental fee schedule was read,
 * with the ADA Health Policy Institute ratios of that state, and the ratios of all 51 jurisdictions.
 * `fees` = schedule in force on July 1, 2024 (what the estimates divide); `feesNow` = schedule in force today.
 */
import STATES_RAW from '../data/states.json';
import ADA_RAW from '../data/ada-ratios-2024.json';
import P from '../data/params-2026.json';
import { feeOf, median, type FeeState, type Pop, type Slot, type Uplift } from './engine/estimate';
import { priceOf, type Priced } from './tool-specs';

export interface StateRow extends FeeState {
  slug: string; program: string; title: string; url: string; page: string; effective: string; retrieved: string;
  url2024: string | null; effective2024: string | null;
  adultBenefit: string;
  feesNow: FeeState['fees'];
}
export interface AdaRow { code: string; name: string; childCharge: number; adultCharge: number | null; childPrivate: number; adultPrivate: number | null; adultBenefit: string }
export interface Procedure { label: string; short: string; pop: Pop; cls: string; unit: string; slots: Slot[] }

/** Dental services CPI (BLS), from the ADA windows to the latest month. */
export const UPLIFT: Uplift = { charge: P.cpiDental.latest / P.cpiDental.chargesBase, priv: P.cpiDental.latest / P.cpiDental.privateBase };

export const ALL_STATES = (STATES_RAW as unknown as StateRow[]).slice().sort((a, b) => a.name.localeCompare(b.name));
/** States the site prices: those with the schedule in force on July 1, 2024. */
export const STATES = ALL_STATES.filter((s) => Object.keys(s.fees).length > 0);
export const ADA = ADA_RAW as unknown as { national: Omit<AdaRow, 'code' | 'name'>; states: AdaRow[] };
export const PROCS = P.procedures as unknown as Record<string, Procedure>;
export const PROC_IDS = Object.keys(PROCS);

export const stateBySlug = (slug: string) => { const s = STATES.find((x) => x.slug === slug); if (!s) throw new Error(`Unknown state ${slug}`); return s; };
export const stateByCode = (code: string) => { const s = STATES.find((x) => x.code === code); if (!s) throw new Error(`Unknown state ${code}`); return s; };
export const proc = (id: string) => { const p = PROCS[id]; if (!p) throw new Error(`Unknown procedure ${id}`); return p; };

/** Estimate after the outlier screen of tool-specs.ts (the same function the calculators use). */
export const est = (st: StateRow, id: string): Priced => { proc(id); return priceOf(st, id); };
/** What the state's Medicaid program pays today for the same codes (current schedule), or null. */
export function medicaidNow(st: StateRow, id: string): number | null {
  const e = est(st, id);
  if (!e.ok) return null;
  let t = 0;
  for (const l of e.lines) { const f = feeOf({ ...st, fees: st.feesNow }, l.code, e.feePop); if (f === null) return null; t += f * l.n; }
  return t;
}

/** Every state where the procedure can be priced, with its estimate. */
export function across(id: string) {
  return STATES.map((s) => ({ s, e: est(s, id) })).filter((x) => x.e.ok);
}
/** Median, lowest and highest estimated charge across the states that publish every code of the procedure. */
export function spread(id: string) {
  const rows = across(id);
  const charges = rows.map((r) => r.e.charge), allowed = rows.map((r) => r.e.allowed);
  const lo = rows.reduce((a, r) => (!a || r.e.charge < a.e.charge ? r : a), null as null | (typeof rows)[number]);
  const hi = rows.reduce((a, r) => (!a || r.e.charge > a.e.charge ? r : a), null as null | (typeof rows)[number]);
  return { n: rows.length, median: median(charges), medianAllowed: median(allowed), lo, hi, rows };
}
