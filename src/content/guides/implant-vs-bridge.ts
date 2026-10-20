import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const imp = K.spread('implant');
const br = K.spread('bridge3');
const both = imp.rows.filter((r) => br.rows.some((b) => b.s.code === r.s.code)).map((r) => ({ s: r.s, i: r.e, b: br.rows.find((x) => x.s.code === r.s.code)!.e }));
const names = both.map((x) => x.s.name);
const list = names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0] ?? 'none of the states read so far';
const ex = both[0];
const EX = K.P.examplePlan;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const pay = (charge: number, allowed: number, id: string) => K.plan({ charge, allowed, insured: true, inNetwork: true, planShare: K.shareOf(id, 'auto'), deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: 0, nextYearDeductible: 0 });
const pi = pay(imp.median, imp.medianAllowed, 'implant');
const pb = pay(br.median, br.medianAllowed, 'bridge3');
const gap = imp.median - br.median;
const loanI = K.loan(pi.youPay, K.P.credit.cardAllAccounts, 24);
const loanB = K.loan(pb.youPay, K.P.credit.cardAllAccounts, 24);

export default defineGuide({
  id: 'implant-vs-bridge',
  group: 'procedure',
  order: 14,
  slug: 'implant-vs-bridge',
  nav: 'Implant or bridge: the bills',
  card: 'One implant and a three-unit bridge priced side by side, with the same plan.',
  title: 'Implant vs Bridge Cost 2026: Two Bills Side by Side by State',
  description: `Implant vs bridge cost in 2026: one implant and a three-unit bridge priced from the same state fee schedules, before and after a dental plan. Prices only.`,
  h1: 'Implant or bridge: the two bills side by side, with the same plan',
  intro: 'Choose a state and your coverage: the calculator prices both ways of filling one gap and shows the difference you would pay.',
  resume: `One missing tooth can be replaced by an implant, three billed parts placed in the bone, or by a fixed bridge, a false tooth held by crowns on the two neighboring teeth. Priced the same way, from each state's Medicaid fee schedule and its 2024 ratio between Medicaid pay and dentists' charges, the implant has a median full fee of ${K.usd(imp.median)} across ${imp.n} ${imp.n === 1 ? 'state' : 'states'} and the three-unit bridge ${K.usd(br.median)} across ${br.n}, in ${cpi} dollars. With the Covered California 2026 example plan, which pays half of major work after the deductible up to ${K.usd(EX.annualMax)} a year, the patient's share of the network price comes to about ${K.usd(pi.youPay)} for the implant and ${K.usd(pb.youPay)} for the bridge. These are prices only: which treatment fits a mouth is a decision for the patient and a dentist, based on things no price list can see.`,
  body: (h) => `
<h2>What is compared</h2>
<p>The implant is the sum of three codes: the implant body (D6010), an abutment (D6057 or D6056) and the crown on it (D6058 or D6059). The bridge is a pontic (D6240 or D6245) and two retainer crowns (D6750, D6740 or D6790). Both replace a single tooth in the estimates. Work that often comes with either, such as an extraction, a bone graft, a scan, a buildup under a retainer or a temporary, is billed separately and left out of both sides, so the comparison is of the core work.</p>
<p>Both totals come from the same method. The site takes what a state's Medicaid program paid for each code on July 1, 2024, divides it by that state's ratio between Medicaid pay and dentists' charges published by the ADA Health Policy Institute, and carries the result to ${cpi} with the dental services price index of the Bureau of Labor Statistics. A procedure is priced only where the schedule lists all its codes.</p>

<h2>Where both can be priced</h2>
<p>Few Medicaid schedules list implants, and not all list bridges, so the side-by-side calculator works in ${both.length === 1 ? 'one state' : `${both.length} states`} for now: ${list}. ${ex ? `In ${ex.s.name}, the implant is estimated at ${K.usd(ex.i.charge)} and the bridge at ${K.usd(ex.b.charge)} before insurance.` : ''} Across all the states that price each one separately, the medians differ by ${K.usd(Math.abs(gap))}, with the ${gap >= 0 ? 'implant' : 'bridge'} costing more. The ${h.a('dental-implant-cost', 'implant page')} and the ${h.a('dental-bridge-cost', 'bridge page')} give each range.</p>
${h.table(['', 'Implant', 'Three-unit bridge'], [['Full fee, median', K.usd(imp.median), K.usd(br.median)], ['Network price, median', K.usd(imp.medianAllowed), K.usd(br.medianAllowed)], ['States priced', String(imp.n), String(br.n)], ['Teeth worked on', 'The gap only', 'The gap and its two neighbors']], `Estimates in ${cpi} dollars, from the states whose Medicaid fee schedules list every code.`, ['l', 'r', 'r'])}

<h2>How a plan treats each</h2>
<p>Most plans that cover either put both in the major class, so the share is the same; the difference comes from the price and from the yearly maximum. With the example plan's ${K.usd(EX.annualMax)} maximum, both treatments can exhaust a year's benefit, and the plan then pays the same capped amount whichever is chosen: here ${K.usd(pi.planPays)} for the implant and ${K.usd(pb.planPays)} for the bridge. The patient carries the rest, so the price gap passes almost entirely to the patient. Spreading the work over two plan years can add a second maximum; the ${h.a('dental-insurance-annual-maximum', 'annual maximum page')} computes it.</p>
<p>Plans also differ in what they agree to pay for. Some cover implants, some exclude them, and some pay only up to the price of a less costly alternative that would also replace the tooth, leaving the difference to the patient. A plan may refuse to replace a tooth that was missing before the coverage began. A predetermination, the plan's written answer before treatment, says how it will handle your case.</p>
${h.mini('cost', { t: 'Price one option alone in your state', p: ['pr', 'sx'], d: { pr: 'bridge3' } })}

<h2>What this page does not compare</h2>
<p>How long each option lasts, what it means for the neighboring teeth and the bone, and whether a mouth is suited to an implant at all are clinical questions. They depend on the patient's health, the bone, the gums and the state of the teeth next to the gap, and they are answered by a dentist after an exam. A cheaper bill today says nothing about which option fits, and this site does not rank them. It gives the two prices so that a quote for either can be read against the usual range in your state. If a dentist proposes both, asking for each quote with its codes, and for the plan's predetermination on each, puts the two real bills next to each other, which is the comparison this page can only approximate.</p>

<h2>Paying for either</h2>
<p>Both bills are large enough that patients often pay over time. Financing the patient's share computed above over 24 months at the Federal Reserve's average credit card rate of ${K.pct(K.P.credit.cardAllAccounts / 100, 2)} would cost about ${K.usd(loanI.monthly)} a month for the implant and ${K.usd(loanB.monthly)} for the bridge, with ${K.usd(loanI.totalInterest)} and ${K.usd(loanB.totalInterest)} of interest in total. The ${h.a('dental-financing', 'financing page')} runs any amount and shows what happens when a deferred interest promotion ends with a balance left.</p>
<p>Timing matters too. A new member of the example plan waits ${EX.waitingMajorMonths} months before major services are paid, unless earlier coverage is proven, and an implant is often placed in stages months apart, so its parts can fall in different plan years. The ${h.a('dental-insurance-waiting-period', 'waiting period page')} shows what doing the work before the end of the wait costs.</p>
`,
  faqs: [
    { q: 'Is an implant more expensive than a bridge?', a: `On the estimates of this site, the median single implant costs ${K.usd(imp.median)} and the median three-unit bridge ${K.usd(br.median)} before insurance, in ${cpi} dollars, across the states whose fee schedules list each. Extractions, grafts and buildups come on top of either. A quote from your dentist, code by code, is the only price for your own case.` },
    { q: 'Does insurance pay more for a bridge than for an implant?', a: 'Plans that cover both usually pay them at the same major services rate, so the share is similar. The yearly maximum often caps the payment for either, which leaves the price difference to the patient. Some plans exclude implants or pay only what a cheaper alternative would cost; a predetermination settles it before treatment.' },
    { q: 'Why can I compare both in only a few states?', a: 'Each estimate needs the state Medicaid fee for every code of the procedure. Most Medicaid schedules have no fee for implants and some have none for bridges, so only the states that list both give a side-by-side result. The site does not fill a missing fee with a guess.' },
  ],
  tool: 'versus',
  toolArg: { a: 'implant', b: 'bridge3', ...(ex ? { sx: ex.s.slug } : {}) },
  related: ['dental-implant-cost', 'dental-bridge-cost', 'dentures-cost', 'dental-insurance-annual-maximum'],
  sources: ['ada_hpi_2024', 'bls_cpi_dental', 'covered_ca_2026'],
});
