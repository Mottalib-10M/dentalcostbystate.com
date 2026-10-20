/**
 * The calculators of the site, one entry per subject, rendered by components/calc/SpecTool.tsx (full tool)
 * and MiniSim.tsx (mini-simulator). Prices come from src/data/states.json through the engine
 * (lib/engine/estimate.ts), plan rules from lib/engine/insurance.ts, credit from lib/engine/finance.ts;
 * every default comes from params-2026.json. This file ships to the browser.
 */
import P from '../data/params-2026.json';
import STATES_RAW from '../data/states.json';
import type { ToolSpec, V, Input, ToolOut } from './tool-types';
import { formatMoney, formatPercent } from './format';
import { estimate as rawEstimate, median, type FeeState, type Pop, type Slot } from './engine/estimate';
import { planPays } from './engine/insurance';
import { amortize, deferred } from './engine/finance';

export const usd = (x: number) => `${x < -0.5 ? '-' : ''}${formatMoney(Math.abs(Math.round(x)), 0)}`;
export const pct = (x: number, d = 1) => formatPercent(x, d);
const n = (v: V, k: string) => Number(v[k]) || 0;
const s = (v: V, k: string) => String(v[k]);

interface Row extends FeeState { slug: string; effective: string; effective2024: string | null; program: string }
interface Proc { label: string; short: string; pop: Pop; cls: string; unit: string; slots: Slot[] }
const ST_ROWS = (STATES_RAW as unknown as Row[]).filter((x) => Object.keys(x.fees).length > 0).sort((a, b) => a.name.localeCompare(b.name));
const PR = P.procedures as unknown as Record<string, Proc>;
const CLS = P.classes as Record<string, { label: string; planShare: number }>;
const EX = P.examplePlan;
const UP = { charge: P.cpiDental.latest / P.cpiDental.chargesBase, priv: P.cpiDental.latest / P.cpiDental.privateBase };
const estimate = (st: FeeState, slots: Slot[], pop: Pop) => rawEstimate(st, slots, pop, UP);

/**
 * Outlier screen (method page, step 5): a state's estimate of a procedure is withheld when it is below half
 * or above twice the median of the states that price it (at least three). The ADA ratio is measured on a
 * basket of common codes; a state that pays one procedure on another basis (orthodontics by phase, a fee
 * that is a fraction of the usual one) would otherwise print a price several times off.
 */
export const SCREEN = { low: 0.5, high: 2, minStates: 3 };
const medCache: Record<string, number> = {};
function medianCharge(id: string): number {
  if (medCache[id] === undefined) {
    const xs = ST_ROWS.map((x) => estimate(x, PR[id].slots, PR[id].pop)).filter((e) => e.ok).map((e) => e.charge);
    medCache[id] = xs.length >= SCREEN.minStates ? median(xs) : 0;
  }
  return medCache[id];
}
export type Priced = ReturnType<typeof rawEstimate> & { outlier: boolean };
/** Estimate of a procedure in a state, after the outlier screen (outlier = true and ok = false when withheld). */
export function priceOf(st: FeeState, id: string): Priced {
  const p = PR[id], e = estimate(st, p.slots, p.pop);
  const m = e.ok ? medianCharge(id) : 0;
  if (e.ok && m > 0 && (e.charge < SCREEN.low * m || e.charge > SCREEN.high * m)) return { ...e, ok: false, outlier: true };
  return { ...e, outlier: false };
}
const DEF_STATE = ST_ROWS.find((x) => x.slug === 'california')?.slug ?? ST_ROWS[0]?.slug ?? '';
const ST = (slug: string) => ST_ROWS.find((x) => x.slug === slug) ?? ST_ROWS.find((x) => x.slug === DEF_STATE)!;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const longDate = (iso: string) => `${MONTHS[Number(iso.slice(5, 7)) - 1]} ${Number(iso.slice(8, 10))}, ${iso.slice(0, 4)}`;

/** Procedures that a state's schedule can price. */
const priced = (slug: string) => Object.keys(PR).filter((id) => priceOf(ST(slug), id).ok);
/** The preferred default state if it prices the procedure, else the first one (alphabetical) that does. */
const PREFERRED = ['new-york', 'pennsylvania', 'ohio', 'virginia'];
function firstPricing(id: string): string {
  for (const slug of PREFERRED) if (ST_ROWS.some((x) => x.slug === slug) && priceOf(ST(slug), id).ok) return slug;
  return ST_ROWS.find((x) => priceOf(x, id).ok)?.slug ?? DEF_STATE;
}
const procIn = (def: string, only?: string[]): Input => ({ kind: 'select', id: 'pr', label: 'Procedure', def, options: Object.keys(PR).filter((k) => !only || only.includes(k)).map((k) => ({ value: k, label: PR[k].short })) });
const stateIn = (def = DEF_STATE, label = 'State'): Input => ({ kind: 'select', id: 'sx', label, def, options: ST_ROWS.map((x) => ({ value: x.slug, label: x.name })) });
const COVER: Input = { kind: 'choice', id: 'cv', label: 'Dental insurance', def: 'in', options: [{ value: 'none', label: 'None' }, { value: 'in', label: 'In network' }, { value: 'out', label: 'Out of network' }] };
const SHARE: Input = { kind: 'select', id: 'pc', label: 'Plan pays, for this work', def: 'auto', options: [{ value: 'auto', label: 'As the example plan' }, ...[100, 90, 80, 70, 60, 50, 40, 0].map((x) => ({ value: String(x), label: `${x} %` }))], help: 'The coinsurance of its class in your benefit summary' };
const DED: Input = { id: 'dd', label: 'Deductible still to meet', def: EX.deductible, unit: '$', max: 10000 };
const MAXL: Input = { id: 'mx', label: 'Benefit maximum left', def: EX.annualMax, unit: '$', max: 100000, help: 'Yearly maximum minus what the plan already paid' };
const WAIT: Input[] = [
  { id: 'wm', label: 'Waiting period for this class', def: 0, unit: 'mo', max: 60, adv: true, help: `Example plan: ${EX.waitingMajorMonths} months for major services` },
  { id: 'mc', label: 'Months on the plan at treatment', def: 12, unit: 'mo', max: 600, adv: true },
  { kind: 'choice', id: 'sg', label: 'Split over two plan years', def: 'no', options: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }], adv: true },
];

/** Plan share of a procedure: the reader's choice, or the class of the example plan (adult orthodontics: not covered there). */
export function shareOf(procId: string, pc: string): number {
  if (pc !== 'auto') return Number(pc) / 100;
  const p = PR[procId];
  if (p.cls === 'ortho') return p.pop === 'child' ? 1 - EX.childOrthoMemberShare : 0;
  if (p.cls === 'cosmetic') return 0;
  const m = (EX.memberShare as Record<string, number>)[p.cls];
  return m === undefined ? CLS[p.cls].planShare : 1 - m;
}

function costCard(v: V, procId: string, slug: string): ToolOut {
  const st = ST(slug), p = PR[procId];
  const e = priceOf(st, procId);
  if (e.outlier) return { label: `${p.short} in ${st.name}`, value: 'Withheld', sub: `The ${st.name} Medicaid fee for this work gives an estimate below half or above twice the median of the other states, a sign the state pays it on another basis, so we do not publish it.`, rows: [] };
  if (!e.ok) {
    const alt = priced(slug).slice(0, 4).map((k) => PR[k].short.toLowerCase()).join('; ');
    return { label: `${p.short} in ${st.name}`, value: 'Not published', sub: `The ${st.name} Medicaid fee schedule we read has no fee for ${e.missing.join(', ')}, so we do not estimate it. Priced there: ${alt}.`, rows: [] };
  }
  const cv = s(v, 'cv');
  const share = shareOf(procId, s(v, 'pc'));
  const r = planPays({ charge: e.charge, allowed: e.allowed, insured: cv !== 'none', inNetwork: cv !== 'out', planShare: share, deductibleLeft: n(v, 'dd'), deductibleApplies: p.cls !== 'preventive', maxLeft: n(v, 'mx'), waitMonths: n(v, 'wm'), monthsCovered: n(v, 'mc'), nextYearMax: s(v, 'sg') === 'yes' ? EX.annualMax : 0, nextYearDeductible: EX.deductible });
  const rows: ToolOut['rows'] = [
    ['Estimated dentist charge (full fee)', usd(e.charge), e.charge],
    ['Estimated in-network price', usd(e.allowed), e.allowed],
  ];
  if (cv !== 'none') {
    rows.push([`Plan pays (${pct(share, 0)} after deductible)`, usd(r.planPays), r.planPays]);
    if (r.deductibleUsed) rows.push(['Deductible', usd(r.deductibleUsed)]);
    if (r.overMax > 0.5) rows.push(['Plan share lost to the maximum', usd(r.overMax)]);
    if (r.balanceBill > 0.5) rows.push(['Balance billed out of network', usd(r.balanceBill)]);
    if (r.stagedExtra > 0.5) rows.push(['Extra paid if finished next plan year', usd(r.stagedExtra)]);
  }
  rows.push([`${st.name} Medicaid fee, same codes (2024)`, usd(e.medicaid)]);
  const value = usd(r.youPay - (r.stagedExtra || 0));
  const sub = cv === 'none'
    ? `Typical full fee for ${p.short.toLowerCase()} (${p.unit}) in ${st.name}; an in-network price is about ${usd(e.allowed)}.`
    : r.waiting ? 'Still inside the waiting period: the plan pays nothing for this class yet.'
      : `${usd(r.billed)} billed, ${usd(r.planPays + (r.stagedExtra || 0))} paid by the plan${r.stagedExtra > 0.5 ? ' over two plan years' : ''}.`;
  return {
    label: `You pay for ${p.short.toLowerCase()} in ${st.name}`, value, sub, rows,
    table: { caption: `${st.program}, fee schedule in force on July 1, 2024 (edition of ${longDate(st.effective2024!)})`, headers: ['CDT code', 'Service', 'Count', 'Medicaid fee, 2024'], rows: e.lines.map((l) => [l.code, l.label, String(l.n), formatMoney(l.fee, Number.isInteger(l.fee) ? 0 : 2)]), align: ['l', 'l', 'r', 'r'] },
    note: `Estimate: ${st.name} Medicaid fee ÷ ${pct(e.rCharge, 1)} (Medicaid pay as a share of dentists' charges, ADA HPI 2024${e.feePop !== p.pop ? `; ${st.name} lists these codes for patients under 21 only, so its children's fees and children's ratio are used` : e.ratioPop !== p.pop ? `, ${e.ratioPop === 'child' ? "children's" : 'adult'} ratio as the state has no ${p.pop === 'adult' ? 'adult' : "children's"} figure` : ''}). Brought to ${MONTHS[Number(P.cpiDental.latestPeriod.slice(5, 7)) - 1]} ${P.cpiDental.latestPeriod.slice(0, 4)} with the dental services price index (BLS). Not a quote.`,
  };
}

export const SPECS: Record<string, (arg?: Record<string, number | string>) => ToolSpec> = {
  /* Procedure x state x plan -> what you pay */
  cost: (arg) => {
    // The state shown first prices the procedure shown first: a page never opens on "Not published".
    const pr = String(arg?.pr ?? 'crown');
    const sx = arg?.sx !== undefined ? String(arg.sx) : firstPricing(pr);
    return {
      inputs: [procIn(pr), stateIn(sx), COVER, SHARE, DED, MAXL, ...WAIT],
      run: (v) => costCard(v, s(v, 'pr'), s(v, 'sx')),
    };
  },
  /* One procedure across every state of the asset */
  states: () => ({
    inputs: [procIn('implant'), { kind: 'choice', id: 'bs', label: 'Price shown', def: 'charge', options: [{ value: 'charge', label: 'Full fee' }, { value: 'allowed', label: 'In network' }] }],
    run: (v) => {
      const id = s(v, 'pr'), p = PR[id], k = s(v, 'bs') === 'allowed' ? 'allowed' : 'charge';
      const rows = ST_ROWS.map((x) => ({ x, e: priceOf(x, id) })).filter((r) => r.e.ok).sort((a, b) => b.e[k] - a.e[k]);
      const med = median(rows.map((r) => r.e[k]));
      if (!rows.length) return { label: p.short, value: 'Not published', rows: [] };
      return {
        label: `${p.short}: median of ${rows.length} states, ${k === 'charge' ? 'full fee' : 'in-network price'}`, value: usd(med), sub: `From ${usd(rows[rows.length - 1].e[k])} in ${rows[rows.length - 1].x.name} to ${usd(rows[0].e[k])} in ${rows[0].x.name} (${p.unit}).`,
        rows: [['Highest: ' + rows[0].x.name, usd(rows[0].e[k]), rows[0].e[k]], ['Median', usd(med), med], ['Lowest: ' + rows[rows.length - 1].x.name, usd(rows[rows.length - 1].e[k]), rows[rows.length - 1].e[k]]],
        table: { headers: ['State', 'Full fee', 'In network', 'Medicaid fee, 2024'], rows: rows.map((r) => [r.x.name, usd(r.e.charge), usd(r.e.allowed), usd(r.e.medicaid)]), align: ['l', 'r', 'r', 'r'] },
        note: 'States whose Medicaid schedule lists every code of the procedure. Estimates, not quotes.',
      };
    },
  }),
  /* A quote in hand: what the plan pays */
  plan: () => ({
    inputs: [
      { id: 'q', label: 'Price on the treatment plan', def: 1200, unit: '$', max: 200000, help: 'In network: the plan-allowed amount on the estimate' },
      { kind: 'select', id: 'pc', label: 'Plan pays, for this class', def: '50', options: [100, 90, 80, 70, 60, 50, 40, 0].map((x) => ({ value: String(x), label: `${x} %` })) },
      DED, MAXL, ...WAIT,
    ],
    run: (v) => {
      const q = n(v, 'q');
      const r = planPays({ charge: q, allowed: q, insured: true, inNetwork: true, planShare: Number(s(v, 'pc')) / 100, deductibleLeft: n(v, 'dd'), maxLeft: n(v, 'mx'), waitMonths: n(v, 'wm'), monthsCovered: n(v, 'mc'), nextYearMax: s(v, 'sg') === 'yes' ? EX.annualMax : 0, nextYearDeductible: EX.deductible });
      return {
        label: 'Your share of the bill', value: usd(r.youPay - r.stagedExtra), sub: r.waiting ? 'Inside the waiting period: no benefit for this class yet.' : `The plan pays ${usd(r.planPays + r.stagedExtra)}.`,
        rows: [['Deductible', usd(r.deductibleUsed)], ['Your coinsurance', usd(r.coinsurance)], ['Plan share lost to the maximum', usd(r.overMax)], ...(r.stagedExtra > 0.5 ? [['Recovered by finishing next plan year', usd(r.stagedExtra)] as [string, string]] : [])],
        note: 'Ask the office for a predetermination: the plan states its own allowed amount and share before treatment.',
      };
    },
  }),
  /* Two procedures side by side in one state */
  versus: (arg) => {
    const a = String(arg?.a ?? 'implant'), b = String(arg?.b ?? 'bridge3');
    const both = [...PREFERRED, ...ST_ROWS.map((x) => x.slug)].find((slug) => ST_ROWS.some((x) => x.slug === slug) && priceOf(ST(slug), a).ok && priceOf(ST(slug), b).ok) ?? DEF_STATE;
    return {
      inputs: [stateIn(arg?.sx !== undefined ? String(arg.sx) : both), COVER, DED, MAXL],
      run: (v) => {
        const st = ST(s(v, 'sx'));
        const one = (id: string) => {
          const p = PR[id], e = priceOf(st, id);
          if (!e.ok) return null;
          const r = planPays({ charge: e.charge, allowed: e.allowed, insured: s(v, 'cv') !== 'none', inNetwork: s(v, 'cv') !== 'out', planShare: shareOf(id, 'auto'), deductibleLeft: n(v, 'dd'), deductibleApplies: p.cls !== 'preventive', maxLeft: n(v, 'mx'), waitMonths: 0, monthsCovered: 12, nextYearMax: 0, nextYearDeductible: 0 });
          return { p, e, r };
        };
        const A = one(a), B = one(b);
        if (!A || !B) return { label: `${PR[a].short} or ${PR[b].short.toLowerCase()} in ${st.name}`, value: 'Not published', sub: `The ${st.name} schedule lacks a code of ${!A ? PR[a].short.toLowerCase() : PR[b].short.toLowerCase()}.`, rows: [] };
        const d = A.r.youPay - B.r.youPay;
        return {
          label: `Difference you pay, ${A.p.short.toLowerCase()} against ${B.p.short.toLowerCase()}`, value: usd(Math.abs(d)), sub: `${d >= 0 ? B.p.short : A.p.short} costs you less in ${st.name}.`,
          rows: [[`${A.p.short}, you pay`, usd(A.r.youPay), A.r.youPay], [`${B.p.short}, you pay`, usd(B.r.youPay), B.r.youPay], [`${A.p.short}, full fee`, usd(A.e.charge), A.e.charge], [`${B.p.short}, full fee`, usd(B.e.charge), B.e.charge]],
          note: 'Same plan figures on both sides, plan share of the example plan. The choice of treatment belongs to you and your dentist.',
        };
      },
    };
  },
  /* Paying the bill over time */
  finance: () => ({
    inputs: [
      { id: 'a', label: 'Amount to spread', def: 3000, unit: '$', max: 200000 },
      { id: 'apr', label: 'APR', def: P.credit.cardAssessedInterest, unit: '%', max: 60, decimals: 2, help: `Average card rate on accounts charged interest, ${MONTHS[Number(P.credit.period.slice(5, 7)) - 1]} ${P.credit.period.slice(0, 4)} (Federal Reserve)` },
      { id: 'm', label: 'Months to repay', def: 24, unit: 'mo', max: 120 },
      { id: 'pm', label: 'Promotion length, deferred interest', def: 12, unit: 'mo', max: 60, adv: true },
      { id: 'pp', label: 'You pay each month during it', def: 200, unit: '$', max: 100000, adv: true },
    ],
    run: (v) => {
      const l = amortize(n(v, 'a'), n(v, 'apr'), n(v, 'm'));
      const d = deferred(n(v, 'a'), n(v, 'apr'), n(v, 'pm'), n(v, 'pp'));
      return {
        label: 'Monthly payment', value: usd(l.monthly), sub: `${usd(l.totalInterest)} of interest over ${Math.round(n(v, 'm'))} months.`,
        rows: [['Total repaid', usd(l.total), l.total], ['Interest', usd(l.totalInterest), l.totalInterest], ['Deferred-interest promotion: payment that clears it', usd(d.payoffMonthly)], ['Balance left at the end at your payment', usd(d.leftAtEnd)], ['Interest charged back if a balance is left', usd(d.backInterest)]],
        note: 'No lender is named or recommended. A deferred-interest plan charges the interest of the whole promotion if any balance remains.',
      };
    },
  }),
  /* How a yearly maximum shapes a big treatment */
  max: () => ({
    inputs: [
      { id: 'q', label: 'In-network price of the treatment', def: 6000, unit: '$', max: 200000 },
      { kind: 'select', id: 'pc', label: 'Plan pays, for this class', def: '50', options: [80, 70, 60, 50, 40].map((x) => ({ value: String(x), label: `${x} %` })) },
      { id: 'am', label: 'Yearly maximum', def: EX.annualMax, unit: '$', max: 20000 },
      { id: 'dd', label: 'Yearly deductible', def: EX.deductible, unit: '$', max: 5000 },
    ],
    run: (v) => {
      const q = n(v, 'q'), sh = Number(s(v, 'pc')) / 100, am = n(v, 'am'), dd = n(v, 'dd');
      const one = planPays({ charge: q, allowed: q, insured: true, inNetwork: true, planShare: sh, deductibleLeft: dd, maxLeft: am, waitMonths: 0, monthsCovered: 12, nextYearMax: am, nextYearDeductible: dd });
      const full = Math.max(0, q - dd) * sh;
      const years = am > 0 ? Math.max(1, Math.ceil(full / am)) : 0;
      return {
        label: 'Plan pays in one plan year', value: usd(one.planPays), sub: `${usd(q - one.planPays)} left to you if everything is done before the plan year renews.`,
        rows: [['Plan share without any maximum', usd(full), full], ['Paid in one year', usd(one.planPays), one.planPays], ['Paid if split over two years', usd(one.planPays + one.stagedExtra), one.planPays + one.stagedExtra], ['Plan years needed for the full share', years ? String(years) : 'n/a']],
        note: 'Splitting only works when the dentist agrees the work can wait; each new year can bring a new deductible.',
      };
    },
  }),
  /* Waiting period */
  waiting: () => ({
    inputs: [
      { id: 'wm', label: 'Waiting period in the policy', def: EX.waitingMajorMonths, unit: 'mo', max: 60 },
      { id: 'mc', label: 'Months covered at the planned date', def: 3, unit: 'mo', max: 600 },
      { id: 'q', label: 'In-network price of the work', def: 1500, unit: '$', max: 200000 },
      { kind: 'select', id: 'pc', label: 'Plan pays after the wait', def: '50', options: [80, 70, 60, 50, 40].map((x) => ({ value: String(x), label: `${x} %` })) },
    ],
    run: (v) => {
      const wait = n(v, 'wm'), mc = n(v, 'mc'), q = n(v, 'q'), sh = Number(s(v, 'pc')) / 100;
      const now = planPays({ charge: q, allowed: q, insured: true, inNetwork: true, planShare: sh, deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: wait, monthsCovered: mc, nextYearMax: 0, nextYearDeductible: 0 });
      const later = planPays({ charge: q, allowed: q, insured: true, inNetwork: true, planShare: sh, deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: wait, nextYearMax: 0, nextYearDeductible: 0 });
      const left = Math.max(0, Math.ceil(wait - mc));
      return {
        label: left ? 'Months to wait before the plan pays' : 'The waiting period is over', value: left ? String(left) : 'Covered',
        sub: left ? `Done now you pay ${usd(now.youPay)}; after the wait about ${usd(later.youPay)}.` : `You pay about ${usd(later.youPay)} with the example deductible and maximum.`,
        rows: [['You pay at the planned date', usd(now.youPay), now.youPay], ['You pay once the wait is over', usd(later.youPay), later.youPay], ['Saved by waiting', usd(now.youPay - later.youPay)]],
        note: 'Plans often waive the wait with proof of prior coverage (the example plan does). A dentist decides whether waiting is safe.',
      };
    },
  }),
};

/** A spec with its defaults overridden by `arg` (same keys as the input ids). */
export function getTool(kind: string, arg?: Record<string, number | string>): ToolSpec {
  const f = SPECS[kind];
  if (!f) throw new Error(`Unknown tool ${kind}`);
  const spec = f(arg);
  if (!arg) return spec;
  return { ...spec, inputs: spec.inputs.map((i) => (arg[i.id] === undefined ? i : ({ ...i, def: arg[i.id] } as typeof i))) };
}
export const TOOL_KINDS = Object.keys(SPECS);
