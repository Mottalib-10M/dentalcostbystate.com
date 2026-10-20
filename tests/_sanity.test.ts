import { it } from 'vitest';
import { STATES, PROC_IDS, est } from '../src/lib/data';
it('table', () => {
  const head = ['ST', ...PROC_IDS.map((x) => x.slice(0, 7))];
  const rows = STATES.map((s) => [s.code + (s.ratios.adultCharge ? '' : '*'), ...PROC_IDS.map((id) => { const e = est(s, id); return e.ok ? String(Math.round(e.charge)) + (e.feePop === 'child' && id !== 'braces_teen' ? 'c' : '') : '-'; })]);
  console.log([head, ...rows].map((r) => r.map((c) => c.padStart(7)).join('')).join('\n'));
});
