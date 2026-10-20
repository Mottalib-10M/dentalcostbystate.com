/**
 * Writing kit (CONTRIBUTING-PAGES.md): every figure written in a page comes from here, never typed by hand.
 *   K.P                  params-2026.json (example plan, credit rates, dental CPI, ADA baskets, sources)
 *   K.STATES, K.S(slug)  the states whose Medicaid dental fee schedule was read (states.json)
 *   K.ADA                ADA HPI 2024 ratios of all 51 jurisdictions and the national figures
 *   K.PR(id)             a procedure of params (label, CDT slots, class)
 *   K.est(slug, id)      estimate of a procedure in a state (charge, in-network price, Medicaid fee, lines)
 *   K.spread(id)         the same procedure across every priced state (median, lowest, highest, rows)
 *   K.tool(kind, args)   runs a calculator of tool-specs.ts and returns its result card
 *   engine               K.plan (planPays), K.loan (amortize), K.deferred, K.shareOf
 *   formats              K.usd, K.pct, K.num, K.dec, K.day (2026-04-30 -> April 30, 2026), K.month (2026-08 -> August 2026)
 */
import P from '../data/params-2026.json';
import { STATES, ADA, PROCS, PROC_IDS, stateBySlug, stateByCode, proc, est, across, spread } from './data';
import { usd, pct, getTool, longDate, shareOf } from './tool-specs';
import { formatNumber, formatDecimal } from './format';
import { planPays } from './engine/insurance';
import { amortize, deferred } from './engine/finance';
import type { V } from './tool-types';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function tool(kind: string, args: V = {}) {
  const spec = getTool(kind);
  const v: V = { ...Object.fromEntries(spec.inputs.map((i) => [i.id, i.def])), ...args };
  return spec.run(v);
}
/** Twelve-month change of the CPI for dental services (BLS), as a share. */
const cpiChange = P.cpiDental.latest / P.cpiDental.yearAgo - 1;

export const KIT = {
  P, STATES, ADA, PROCS, PROC_IDS, S: stateBySlug, SC: stateByCode, PR: proc,
  est: (slug: string, id: string) => est(stateBySlug(slug), id), across, spread, tool,
  plan: planPays, loan: amortize, deferred, shareOf, cpiChange,
  usd, pct, num: (x: number) => formatNumber(x, 0), dec: (x: number, d = 1) => formatDecimal(x, d), day: longDate,
  month: (ym: string) => `${MONTHS[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`,
};
export type Kit = typeof KIT;
