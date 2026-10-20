import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const sp = K.spread('checkup');
const range = sp.n > 1 ? `from ${K.usd(sp.lo!.e.charge)} in ${sp.lo!.s.name} to ${K.usd(sp.hi!.e.charge)} in ${sp.hi!.s.name}` : `${K.usd(sp.median)} in ${sp.rows[0]?.s.name}`;
const deep = K.spread('deepclean');
const EX = K.P.examplePlan;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const outShare = 1 - EX.outOfNetworkMemberShare.preventive;
const out = K.plan({ charge: sp.median, allowed: sp.medianAllowed, insured: true, inNetwork: false, planShare: outShare, deductibleLeft: 0, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: 0, nextYearDeductible: 0 });
const year = sp.median * 2;
const lines = sp.rows[0]?.e.lines ?? [];

export default defineGuide({
  id: 'teeth-cleaning-cost',
  group: 'procedure',
  order: 13,
  slug: 'teeth-cleaning-cost',
  nav: 'Teeth cleaning cost',
  card: 'A checkup visit, exam, cleaning and bitewing X-rays, by state and with a plan.',
  title: 'Teeth Cleaning Cost 2026: Checkup and X-Rays Price by State',
  description: `Teeth cleaning cost in 2026: a checkup with exam, adult cleaning and bitewing X-rays priced from state fee schedules, about ${K.usd(sp.median)} with no plan, often $0 in one.`,
  h1: 'Teeth cleaning cost: the checkup visit, with and without a dental plan',
  intro: 'Choose your state: the estimator prices the usual checkup visit, three codes on one bill, and what a plan leaves to you.',
  resume: `A routine dental visit for an adult is usually billed as three lines: a periodic exam (code D0120), a cleaning, called prophylaxis (D1110), and bitewing X-rays (D0274 for four films, or D0272 for two). Together they are estimated at a median ${K.usd(sp.median)} in ${cpi} dollars for a patient paying the full fee, ${range}, across the ${sp.n === 1 ? 'state' : `${sp.n} states`} whose Medicaid schedules list all three codes. A plan's network price for the same visit is about ${K.usd(sp.medianAllowed)}, and most plans pay preventive care in full in network: in the Covered California 2026 example plan the member's share of diagnostic and preventive services is ${K.pct(EX.memberShare.preventive, 0)}. Out of network the same plan leaves ${K.pct(EX.outOfNetworkMemberShare.preventive, 0)} to the member, plus any amount the office bills above the plan's allowance. Two visits a year at the median full fee come to about ${K.usd(year)}.`,
  body: (h) => `
<h2>What a checkup visit bills</h2>
<p>The exam is the dentist's look at teeth, gums and soft tissue; for a patient of record it is the periodic evaluation, D0120, and a first visit or a long absence may be billed as a comprehensive one, D0150, which usually costs more. The cleaning is D1110 for adults and D1120 for children. X-rays vary by visit: bitewings, which show the back teeth from above the gum, are often taken once a year, and a full set or a panoramic film every few years. The estimator prices a visit with bitewings; a visit without X-rays costs less, one with a full set more.</p>
${h.table(['Part of the visit', 'Code used'], lines.map((l) => [l.label, l.code]), 'Codes of the checkup priced by the estimator; when a state lists four bitewings it is used, otherwise two.', ['l', 'l'])}
<p>Fluoride, sealants, a periodontal charting or an oral cancer screening device can add lines. Plans pay some of them for children and not for adults, so asking which lines a visit will include is worthwhile for anyone paying alone.</p>

<h2>The checkup is the base of the ADA ratios</h2>
<p>All three codes of this visit are in the basket that the ADA Health Policy Institute used to compare Medicaid fees with dentists' charges in each state in 2024. The site divides each state's Medicaid fees for the visit, as they stood on July 1, 2024, by that state's ratio, then carries the result to ${cpi} with the price index for dental services. Because the ratio was measured on these very codes, the checkup estimate needs fewer assumptions than the price of a crown or an implant. The ${h.a('method', 'method page')} gives the details.</p>
${h.mini('states', { t: 'A checkup visit, state by state', p: ['bs'], d: { pr: 'checkup' } })}

<h2>With a dental plan</h2>
<p>Preventive care is the class plans pay most fully, because it is cheap and prevents larger claims. In the example plan, sold on California's exchange in 2026, diagnostic and preventive services in network carry no member share, and the deductible applies to basic and major work. Most plans limit the number of cleanings and exams to two a year and bitewings to one set a year; a third cleaning, or X-rays taken sooner than the plan allows, is billed to the patient. The plan's benefit summary gives those frequency limits.</p>
<p>Out of network the example plan pays ${K.pct(outShare, 0)} of its allowance, and the office can bill the rest of its own fee. At the median estimate the patient would then owe ${K.usd(out.youPay)} for a visit that costs nothing in network. Checking that a dentist is in the plan's network is the simplest saving on this page. The ${h.a('dental-insurance-coverage', 'coverage page')} explains classes and networks.</p>
${h.mini('cost', { t: 'Your checkup, in network, out of network or with no plan', p: ['sx', 'cv'], d: { pr: 'checkup', dd: 0 } })}

<h2>Children's checkups</h2>
<p>A child's visit uses the child cleaning code, D1120, and often adds fluoride varnish and sealants on the back teeth, which plans and Medicaid programs pay more readily for children than for adults. The estimator prices the adult visit; children's fees differ in many schedules. In the example plan, children's dental care sits under a separate set of rules, with a deductible of ${K.usd(EX.childDeductible)} and a yearly cap of ${K.usd(EX.childOutOfPocketMax)} on what the family pays for a child's covered care in network. Every state Medicaid program covers dental care for enrolled children, as the ${h.a('medicaid-dental-by-state', 'Medicaid dental page')} explains.</p>

<h2>A routine cleaning is not a deep cleaning</h2>
<p>When an exam finds gum disease, the dentist may propose scaling and root planing, a treatment billed per quadrant and paid at a lower share by most plans. Four quadrants have a median estimate of ${K.usd(deep.median)}, many times the price of a checkup. The ${h.a('deep-cleaning-cost', 'deep cleaning page')} prices it and shows how plans class it. Whether a mouth needs it is for the dentist to judge.</p>

<h2>Without a plan</h2>
<p>A patient without coverage pays the office's own fee for each line. Some offices offer a cash price for a checkup, and dental schools and community health centers often charge less; a public price list from the office or a written estimate before the visit gives a number to compare with the estimate for your state. Medicaid covers checkups for every enrolled child, while adult coverage depends on the state. The ${h.a('dental-work-without-insurance', 'page on paying without insurance')} goes through the options.</p>
`,
  faqs: [
    { q: 'How much is a dental cleaning and exam without insurance?', a: `A checkup visit with a periodic exam, an adult cleaning and bitewing X-rays has a median estimated full fee of ${K.usd(sp.median)} in ${cpi} dollars across the priced states. A first visit with a comprehensive exam or a full set of X-rays costs more, and a visit without X-rays costs less.` },
    { q: 'Are cleanings free with dental insurance?', a: `In network, most plans pay routine exams, cleanings and X-rays in full, up to a set number a year, often two cleanings and one set of bitewings. The Covered California 2026 example plan leaves the member ${K.pct(EX.memberShare.preventive, 0)} of preventive care in network. Out of network, or beyond the frequency limits, the patient pays part or all of the visit.` },
    { q: 'How often does a dental plan pay for cleanings?', a: 'The frequency is written in each plan, commonly two cleanings and two exams in a plan year, with bitewing X-rays once a year and a full set every few years. A visit beyond the limit is billed to the patient at the network price in network. Some plans pay extra cleanings for people with certain conditions; the benefit summary lists them.' },
  ],
  tool: 'cost',
  toolArg: { pr: 'checkup', dd: 0 },
  related: ['deep-cleaning-cost', 'cavity-filling-cost', 'dental-insurance-coverage', 'dental-work-without-insurance'],
  sources: ['ada_hpi_2024', 'bls_cpi_dental', 'covered_ca_2026', 'cms_dental'],
});
