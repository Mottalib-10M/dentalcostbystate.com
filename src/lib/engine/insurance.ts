/**
 * What a dental plan pays on one treatment, and what is left to the patient.
 *
 * In network, the dentist bills the plan's allowed amount and the patient owes the rest of that amount only.
 * Out of network, the plan pays its share of its own allowance (taken here as the in-network price) and the
 * dentist may bill the patient the gap up to the full charge (balance billing). The deductible comes off the
 * allowance first, the plan pays its coinsurance share of what is left, and the payment stops at the benefit
 * maximum still available this plan year. During a waiting period the plan pays nothing for that class.
 * Staging: the part held back by the maximum can be treated after the plan year renews, with a fresh maximum.
 */
export interface PlanInput {
  /** Estimated full dentist charge. */
  charge: number;
  /** Estimated in-network price (plan allowance). */
  allowed: number;
  insured: boolean;
  inNetwork: boolean;
  /** Share the plan pays for this class of service, 0 to 1. */
  planShare: number;
  /** Deductible still to meet this plan year. */
  deductibleLeft: number;
  /** False for classes the deductible does not apply to (diagnostic and preventive care in the example plan). */
  deductibleApplies?: boolean;
  /** Benefit maximum still available this plan year (or the orthodontic lifetime maximum). */
  maxLeft: number;
  /** Months of the waiting period for this class, and months already covered by the plan. */
  waitMonths: number;
  monthsCovered: number;
  /** Whole maximum of a new plan year, used for staging (0 = no staging). */
  nextYearMax: number;
  /** Deductible of a new plan year. */
  nextYearDeductible: number;
}
export interface PlanResult {
  /** Price the patient is billed in total (allowance in network, charge out of network or uninsured). */
  billed: number;
  planPays: number;
  youPay: number;
  deductibleUsed: number;
  coinsurance: number;
  /** Plan share lost to the maximum. */
  overMax: number;
  /** Balance billing above the plan allowance (out of network). */
  balanceBill: number;
  waiting: boolean;
  /** Plan payment if the part over the maximum is done after the plan year renews. */
  stagedExtra: number;
}

const pos = (x: number) => (Number.isFinite(x) && x > 0 ? x : 0);

export function planPays(i: PlanInput): PlanResult {
  const charge = pos(i.charge), allowed = Math.min(pos(i.allowed), charge || pos(i.allowed));
  if (!i.insured) return { billed: charge, planPays: 0, youPay: charge, deductibleUsed: 0, coinsurance: 0, overMax: 0, balanceBill: 0, waiting: false, stagedExtra: 0 };
  const billed = i.inNetwork ? allowed : charge;
  const balanceBill = i.inNetwork ? 0 : Math.max(0, charge - allowed);
  const share = Math.min(1, pos(i.planShare));
  const waiting = pos(i.waitMonths) > pos(i.monthsCovered);
  if (waiting) return { billed, planPays: 0, youPay: billed, deductibleUsed: 0, coinsurance: 0, overMax: 0, balanceBill, waiting, stagedExtra: 0 };
  const deductibleUsed = share > 0 && i.deductibleApplies !== false ? Math.min(pos(i.deductibleLeft), allowed) : 0;
  const base = allowed - deductibleUsed;
  const due = base * share;
  const paid = Math.min(due, pos(i.maxLeft));
  const overMax = due - paid;
  const coinsurance = base - due;
  let stagedExtra = 0;
  if (overMax > 0 && pos(i.nextYearMax) > 0) {
    // The part of the treatment the plan did not pay for this year, moved to the next plan year.
    const unpaidBase = overMax / (share || 1);
    const ded2 = Math.min(pos(i.nextYearDeductible), unpaidBase);
    stagedExtra = Math.min((unpaidBase - ded2) * share, pos(i.nextYearMax));
  }
  return { billed, planPays: paid, youPay: billed - paid, deductibleUsed, coinsurance, overMax, balanceBill, waiting, stagedExtra };
}
