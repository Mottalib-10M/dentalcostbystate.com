import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const sp = K.spread('filling');
const range = sp.n > 1 ? `from ${K.usd(sp.lo!.e.charge)} in ${sp.lo!.s.name} to ${K.usd(sp.hi!.e.charge)} in ${sp.hi!.s.name}` : `${K.usd(sp.median)} in ${sp.rows[0]?.s.name}`;
const crown = K.spread('crown');
const EX = K.P.examplePlan;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const share = K.shareOf('filling', 'auto');
const p = (ded: number) => K.plan({ charge: sp.median, allowed: sp.medianAllowed, insured: true, inNetwork: true, planShare: share, deductibleLeft: ded, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: 0, nextYearDeductible: 0 });
const first = p(EX.deductible);
const second = p(0);
const out = K.plan({ charge: sp.median, allowed: sp.medianAllowed, insured: true, inNetwork: false, planShare: 1 - EX.outOfNetworkMemberShare.basic, deductibleLeft: 0, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: 0, nextYearDeductible: 0 });

export default defineGuide({
  id: 'cavity-filling-cost',
  group: 'procedure',
  order: 12,
  slug: 'cavity-filling-cost',
  nav: 'Cavity filling cost',
  card: 'A two-surface tooth-colored filling on a back tooth, by state and with a plan.',
  title: 'Cavity Filling Cost 2026: Tooth-Colored Filling by State',
  description: `Cavity filling cost in 2026: a two-surface tooth-colored filling on a back tooth from state fee schedules, about ${K.usd(sp.median)} before insurance, and your plan share.`,
  h1: 'Cavity filling cost: a tooth-colored filling, before and after your plan',
  intro: 'Pick a state and your coverage: the estimator prices one common filling and shows the deductible and coinsurance on it.',
  resume: `The filling priced here is a common one, and one of the codes the ADA used to compare Medicaid pay with dentists' fees: a tooth-colored resin composite covering two surfaces of a back tooth, code D2392. Its typical full fee is estimated at a median ${K.usd(sp.median)} in ${cpi} dollars, ${range}, across the ${sp.n === 1 ? 'state' : `${sp.n} states`} whose Medicaid fee schedules list the code. A private plan's network price is lower, about ${K.usd(sp.medianAllowed)}. Fillings are basic services in most plans. The Covered California 2026 example plan pays ${K.pct(share, 0)} of basic work in network after a ${K.usd(EX.deductible)} deductible: on the first filling of the plan year the patient pays ${K.usd(first.youPay)}, because the deductible comes first, and on the next one ${K.usd(second.youPay)}. Fillings with one surface cost less and those with three or more cost more; front teeth and silver amalgam fillings have codes of their own.`,
  body: (h) => `
<h2>How fillings are coded and priced</h2>
<p>Every filling is billed by material, position and number of surfaces. A resin composite on a back tooth is D2391 for one surface, D2392 for two, D2393 for three and D2394 for four or more. Front teeth use D2330 to D2335, and silver amalgam fillings D2140 to D2161. The estimator prices D2392 because it is one of the codes the ADA Health Policy Institute put in the basket behind its 2024 state ratios, so the estimate rests on a code that the ratio itself measured.</p>
<p>A two-surface filling usually means the decay reached the side of the tooth as well as its biting surface. The office's quote shows the code, and a different number of surfaces moves the price in the obvious direction. Anesthetic is normally included; X-rays and the exam that found the cavity are separate lines.</p>
${h.table(['Code', 'Filling', 'Priced here'], [['D2391', 'Resin composite, one surface, back tooth', 'No'], ['D2392', 'Resin composite, two surfaces, back tooth', 'Yes'], ['D2393', 'Resin composite, three surfaces, back tooth', 'No'], ['D2150', 'Amalgam, two surfaces', 'No']], 'A few filling codes of the Current Dental Terminology.', ['l', 'l', 'l'])}

<h2>Why this estimate is one of the firmest on the site</h2>
<p>Every price here divides a state's Medicaid fee by that state's ratio between Medicaid pay and dentists' charges. The ratio is an average over a basket of common codes; for codes outside the basket, such as crowns or implants, Medicaid may pay a different fraction of the usual fee and the estimate carries that error. D2392 is inside the basket for both children and adults, and the state schedules read for this site list it widely, so the filling estimate needs fewer assumptions than most. The ${h.a('method', 'method page')} explains the basket and lists the schedules used.</p>
${h.mini('states', { t: 'A two-surface filling, state by state', p: ['bs'], d: { pr: 'filling' } })}

<h2>What a plan pays on a filling</h2>
<p>Plans put fillings in the basic class, between preventive care, often paid in full, and major work such as crowns. The example plan, Covered California's 2026 adult coinsurance plan, pays ${K.pct(share, 0)} of basic services in network once the ${K.usd(EX.deductible)} deductible is met, and ${K.pct(1 - EX.outOfNetworkMemberShare.basic, 0)} out of network. Its ${EX.waitingMajorMonths}-month waiting period applies to major services, not to fillings.</p>
<p>Three cases at the median estimate show how the bill moves. In network, first filling of the year: ${K.usd(first.youPay)} for the patient, of which ${K.usd(first.deductibleUsed)} is deductible. In network, deductible already met: ${K.usd(second.youPay)}. Out of network with the deductible met, the plan pays its share of its allowance and the office may bill the rest of its full fee, so the patient owes ${K.usd(out.youPay)}. Fillings rarely touch the yearly maximum of ${K.usd(EX.annualMax)} on their own, but they count against it, which matters if a crown or root canal follows in the same plan year.</p>
${h.mini('cost', { t: 'Your share of a filling, with your deductible', p: ['sx', 'dd'], d: { pr: 'filling' } })}

<h2>Fillings, crowns and what comes next</h2>
<p>A filling repairs part of a tooth; when too little of the tooth is left, a dentist may propose a crown instead, which is major work with a median estimate of ${K.usd(crown.median)} across ${crown.n} states. Which treatment a tooth needs is the dentist's call, and this site takes no side; the price gap simply explains why a small cavity treated early costs less than a large one. The ${h.a('dental-crown-cost', 'crown page')} prices that next step.</p>

<h2>Children's fillings</h2>
<p>The estimate describes an adult patient: it uses the adult fee of each schedule and the adult ratio when the state has one. Fees for children can differ, and many schedules list separate amounts by age. Coverage differs more. ${h.src('cms_dental', 'Federal Medicaid rules')} require dental benefits for every child enrolled in Medicaid, and separate CHIP programs must cover the dental services needed to prevent disease and promote oral health, so a child's filling is a covered service in every state program. For adults, each state decides, and the ${h.a('medicaid-dental-by-state', 'Medicaid dental page')} reports the level of adult coverage state by state. Private family plans often have a separate deductible for children; the example plan's is ${K.usd(EX.childDeductible)}.</p>

<h2>Without a plan</h2>
<p>A patient paying alone is billed the office's full fee unless it offers a cash price. Asking for the price of the code, and for the network price if the office belongs to any plan network, is a reasonable step before the visit. The ${h.a('dental-work-without-insurance', 'page on paying without insurance')} sets out the options, and the ${h.a('teeth-cleaning-cost', 'teeth cleaning page')} the cost of the checkups that find cavities while they are small.</p>
`,
  faqs: [
    { q: 'How much is a tooth-colored filling without insurance?', a: `A two-surface resin composite filling on a back tooth, code D2392, has a median estimated full fee of ${K.usd(sp.median)} in ${cpi} dollars across the priced states. One-surface fillings usually cost less and three-surface ones more. Front teeth and amalgam fillings use other codes, with prices of their own.` },
    { q: 'Does insurance cover cavity fillings?', a: `Nearly all dental plans cover fillings as basic services. The Covered California 2026 example pays ${K.pct(share, 0)} in network after a ${K.usd(EX.deductible)} deductible, so the patient pays the deductible on the first filling of the year and a share of the price on the rest. Out of network the share is lower and the office may bill above the plan's allowance.` },
    { q: 'Why does the number of surfaces change the price?', a: 'Each surface of the tooth that the filling covers is more work and more material, and the code records it. A cavity limited to the biting surface is a one-surface filling; one that reaches a side as well is two surfaces. The office decides the code after removing the decay, so the final bill can differ from the first estimate.' },
  ],
  tool: 'cost',
  toolArg: { pr: 'filling' },
  related: ['teeth-cleaning-cost', 'dental-crown-cost', 'dental-insurance-coverage', 'dental-insurance-calculator'],
  sources: ['ada_hpi_2024', 'bls_cpi_dental', 'covered_ca_2026', 'cms_dental'],
});
