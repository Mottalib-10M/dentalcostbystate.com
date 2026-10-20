import { describe, expect, it } from 'vitest';
import { estimate, feeOf, ratiosFor, median, type FeeState } from '../src/lib/engine/estimate';
import { planPays } from '../src/lib/engine/insurance';
import { amortize, deferred } from '../src/lib/engine/finance';
import P from '../src/data/params-2026.json';
import STATES from '../src/data/states.json';
import ADA from '../src/data/ada-ratios-2024.json';

const st: FeeState = {
  code: 'XX', name: 'Test',
  fees: { D6010: { all: 1000 }, D6057: { all: 300 }, D6058: { all: 700 }, D8080: { child: 2000 }, D1110: { adult: 60, child: 45 } },
  ratios: { childCharge: 0.4, adultCharge: 0.5, childPrivate: 0.8, adultPrivate: 0.625 },
};

describe('estimate', () => {
  it('sums the slots and scales by the ratios', () => {
    const e = estimate(st, P.procedures.implant.slots, 'adult');
    expect(e.ok).toBe(true);
    expect(e.medicaid).toBe(2000);
    expect(e.charge).toBeCloseTo(4000, 6);
    expect(e.allowed).toBeCloseTo(3200, 6);
  });
  it('uses the alternative code of a slot', () => {
    const s2 = { ...st, fees: { ...st.fees, D6057: undefined as never, D6056: { all: 200 } } };
    delete (s2.fees as Record<string, unknown>).D6057;
    const e = estimate(s2, P.procedures.implant.slots, 'adult');
    expect(e.lines.map((l) => l.code)).toEqual(['D6010', 'D6056', 'D6058']);
  });
  it('never guesses a missing fee', () => {
    const e = estimate(st, P.procedures.crown.slots, 'adult');
    expect(e.ok).toBe(false);
    expect(e.charge).toBe(0);
    expect(e.missing).toEqual(['D2740 or D2750']);
  });
  it('age-specific fees and ratios', () => {
    expect(feeOf(st, 'D1110', 'child')).toBe(45);
    expect(feeOf(st, 'D1110', 'adult')).toBe(60);
    expect(feeOf(st, 'D8080', 'adult')).toBeNull();
    const e = estimate(st, P.procedures.braces_teen.slots, 'child');
    expect(e.charge).toBeCloseTo(5000, 6);
  });
  it('falls back to the child ratio when the state has no adult ratio', () => {
    const s3 = { ...st, ratios: { ...st.ratios, adultCharge: null, adultPrivate: null } };
    expect(ratiosFor(s3, 'adult')).toEqual({ pop: 'child', charge: 0.4, priv: 0.8 });
  });
  it('adult procedure priced from children\'s fees when the state lists the codes for children only', () => {
    const kids: FeeState = { code: 'YY', name: 'Kids', fees: { D2740: { child: 300 } }, ratios: { childCharge: 0.5, adultCharge: null, childPrivate: 0.75, adultPrivate: null } };
    const e = estimate(kids, P.procedures.crown.slots, 'adult');
    expect(e.ok).toBe(true);
    expect(e.feePop).toBe('child');
    expect(e.ratioPop).toBe('child');
    expect(e.charge).toBeCloseTo(600, 6);
  });
  it('median', () => {
    expect(median([3, 1, 2])).toBe(2);
    expect(median([4, 1, 2, 3])).toBe(2.5);
    expect(median([])).toBe(0);
  });
});

const base = { charge: 4000, allowed: 3200, insured: true, inNetwork: true, planShare: 0.5, deductibleLeft: 50, maxLeft: 1500, waitMonths: 0, monthsCovered: 12, nextYearMax: 0, nextYearDeductible: 50 };
describe('insurance', () => {
  it('Covered California example: implant in network, max binds', () => {
    const r = planPays(base);
    // (3200 - 50) x 50 % = 1575, capped at 1500
    expect(r.planPays).toBe(1500);
    expect(r.overMax).toBeCloseTo(75, 6);
    expect(r.youPay).toBe(1700);
  });
  it('below the maximum', () => {
    const r = planPays({ ...base, allowed: 1000, charge: 1400 });
    expect(r.planPays).toBeCloseTo(475, 6);
    expect(r.youPay).toBeCloseTo(525, 6);
    expect(r.deductibleUsed).toBe(50);
  });
  it('out of network adds the balance bill', () => {
    const r = planPays({ ...base, inNetwork: false, allowed: 1000, charge: 1400 });
    expect(r.billed).toBe(1400);
    expect(r.balanceBill).toBe(400);
    expect(r.youPay).toBeCloseTo(925, 6);
  });
  it('waiting period: plan pays nothing', () => {
    const r = planPays({ ...base, waitMonths: 6, monthsCovered: 3 });
    expect(r.waiting).toBe(true);
    expect(r.planPays).toBe(0);
    expect(r.youPay).toBe(3200);
  });
  it('waiting period met exactly', () => {
    expect(planPays({ ...base, waitMonths: 6, monthsCovered: 6 }).waiting).toBe(false);
  });
  it('no insurance: full charge', () => {
    const r = planPays({ ...base, insured: false });
    expect(r.youPay).toBe(4000);
    expect(r.planPays).toBe(0);
  });
  it('preventive at 100 %: deductible does not apply when share is 0', () => {
    const r = planPays({ ...base, allowed: 200, charge: 250, planShare: 0 });
    expect(r.deductibleUsed).toBe(0);
    expect(r.youPay).toBe(200);
  });
  it('staging over two plan years', () => {
    const r = planPays({ ...base, allowed: 8000, charge: 10000, nextYearMax: 1500, nextYearDeductible: 50 });
    // year 1: (8000-50) x .5 = 3975 due, 1500 paid, 2475 over max -> base 4950 moved, year 2: (4950-50) x .5 = 2450, capped 1500
    expect(r.planPays).toBe(1500);
    expect(r.stagedExtra).toBe(1500);
  });
  it('no deductible on a class it does not apply to', () => {
    const r = planPays({ ...base, allowed: 200, charge: 250, planShare: 1, deductibleApplies: false });
    expect(r.deductibleUsed).toBe(0);
    expect(r.youPay).toBe(0);
  });
  it('maximum already used up', () => {
    expect(planPays({ ...base, maxLeft: 0 }).planPays).toBe(0);
  });
});

describe('finance', () => {
  it('amortization matches the textbook formula', () => {
    const l = amortize(3000, 21.19, 24);
    expect(l.monthly).toBeCloseTo(3000 * (0.2119 / 12) / (1 - (1 + 0.2119 / 12) ** -24), 9);
    expect(Math.round(l.monthly)).toBe(154);
    expect(l.totalInterest).toBeCloseTo(l.monthly * 24 - 3000, 6);
  });
  it('zero APR', () => {
    expect(amortize(1200, 0, 12).monthly).toBe(100);
  });
  it('deferred interest: paid in time costs nothing', () => {
    const d = deferred(2400, 26.99, 12, 200);
    expect(d.leftAtEnd).toBe(0);
    expect(d.backInterest).toBe(0);
  });
  it('deferred interest: a balance left brings back all accrued interest', () => {
    const d = deferred(2400, 24, 12, 150);
    expect(d.leftAtEnd).toBeCloseTo(600, 6);
    // accrued on 2400, 2250, ..., 750 at 2 % a month
    let acc = 0; for (let m = 0; m < 12; m++) acc += (2400 - 150 * m) * 0.02;
    expect(d.backInterest).toBeCloseTo(acc, 6);
  });
});

describe('data asset', () => {
  it('ADA ratios: national figures of the 2024 workbook', () => {
    expect(ADA.national.childCharge).toBe(0.392);
    expect(ADA.national.adultCharge).toBe(0.299);
    expect(ADA.states).toHaveLength(51);
  });
  it('every state file has a source, a date and fees', () => {
    for (const s of STATES as Array<{ code: string; url: string; effective: string; effective2024: string | null; url2024: string | null; fees: Record<string, unknown>; feesNow: Record<string, unknown> }>) {
      expect(s.url, s.code).toMatch(/^https:\/\//);
      expect(s.effective, s.code).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Object.keys(s.fees).length + Object.keys(s.feesNow).length, s.code).toBeGreaterThan(5);
      // A priced state carries the edition in force on July 1, 2024, never a later one.
      if (Object.keys(s.fees).length) { expect(s.effective2024! <= '2024-07-01', s.code).toBe(true); expect(s.url2024, s.code).toMatch(/^https:\/\//); }
    }
  });
});
