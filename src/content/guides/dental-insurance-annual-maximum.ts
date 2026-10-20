import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const EX = K.P.examplePlan;
const major = 1 - EX.memberShare.major;
const imp = K.spread('implant');
const dent = K.spread('denture_full');
const crown = K.spread('crown');
const base = { insured: true, inNetwork: true, deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: EX.annualMax, nextYearDeductible: EX.deductible };
// Threshold: the network price at which half after the deductible equals the maximum.
const threshold = EX.annualMax / major + EX.deductible;
const rDent = K.plan({ ...base, charge: dent.median, allowed: dent.medianAllowed, planShare: major });
const rImp = imp.n ? K.plan({ ...base, charge: imp.median, allowed: imp.medianAllowed, planShare: major }) : null;
const crowns3 = crown.medianAllowed * 3;
const r3 = K.plan({ ...base, charge: crown.median * 3, allowed: crowns3, planShare: major });
const r3full = Math.max(0, crowns3 - EX.deductible) * major;

export default defineGuide({
  id: 'dental-insurance-annual-maximum',
  group: 'insurance',
  order: 22,
  slug: 'dental-insurance-annual-maximum',
  nav: 'Annual maximum',
  card: 'Why a big treatment ends up mostly yours, and what splitting it over two years changes.',
  title: 'Dental Insurance Annual Maximum 2026: Limits and Splitting',
  description: `Dental insurance annual maximum in 2026: how the yearly limit caps what a plan pays on crowns, dentures and implants, and what two plan years can save.`,
  h1: 'The dental insurance annual maximum: the ceiling that decides large bills',
  intro: 'Enter the network price of a treatment, the plan share and your yearly maximum: the calculator shows what one plan year pays and what two would.',
  resume: `The annual maximum is the most a dental plan pays in one plan year, whatever the percentages say. In the Covered California 2026 example plan it is ${K.usd(EX.annualMax)} for an adult, with a ${K.usd(EX.deductible)} deductible and ${K.pct(major, 0)} paid on major work. At those terms the maximum starts to bind on any major treatment whose network price passes ${K.usd(threshold)}: beyond that point each extra dollar of treatment is paid entirely by the patient. Three crowns at the median network price of the states priced here, ${K.usd(crowns3)} together, would earn ${K.usd(r3full)} from the plan without a ceiling; with it, the plan pays ${K.usd(r3.planPays)}. Full dentures for both arches, about ${K.usd(dent.medianAllowed)} in network, leave the patient ${K.usd(rDent.youPay)}. When a dentist agrees part of the work can wait, finishing it after the plan year renews opens a second maximum: for those dentures, ${K.usd(rDent.stagedExtra)} more from the plan.`,
  body: (h) => `
<h2>A percentage with a ceiling</h2>
<p>Benefit summaries put the plan percentage in large type and the maximum in a line further down, but on any large treatment the maximum is the term that matters. The plan computes its share as usual, deductible first and then its percentage of the rest, and compares that share with the maximum still available. Whichever is lower is paid. The part of the share above the maximum is not carried over or paid later: it simply becomes the patient's.</p>
<p>The point at which the ceiling starts to bite can be worked out from three terms. With a ${K.usd(EX.deductible)} deductible, a ${K.pct(major, 0)} share and a ${K.usd(EX.annualMax)} maximum, the plan's share reaches the maximum at a network price of ${K.usd(threshold)}. Below that, the percentage decides; above it, the maximum does. For basic work paid at a higher share, the threshold is lower, because the plan's share grows faster.</p>
${h.table(['Treatment, network price', 'Plan share without ceiling', 'Plan pays in one year', 'You pay'], [
  [`Three crowns, ${K.usd(crowns3)}`, K.usd(r3full), K.usd(r3.planPays), K.usd(r3.youPay)],
  [`Full dentures, ${K.usd(dent.medianAllowed)}`, K.usd(Math.max(0, dent.medianAllowed - EX.deductible) * major), K.usd(rDent.planPays), K.usd(rDent.youPay)],
  ...(rImp ? [[`One implant, ${K.usd(imp.medianAllowed)}`, K.usd(Math.max(0, imp.medianAllowed - EX.deductible) * major), K.usd(rImp.planPays), K.usd(rImp.youPay)]] : []),
], `Median network prices of the states priced on this site; example plan: Covered California 2026, adult, ${K.pct(major, 0)} for major services.`, ['l', 'r', 'r', 'r'])}

<h2>Splitting a treatment over two plan years</h2>
<p>A plan year usually follows the calendar or the anniversary of enrollment. Work done before the renewal draws on this year's maximum; work done after draws on next year's, with a new deductible. When a treatment has natural stages, such as an implant placed now and crowned months later, or several crowns that are not all urgent, placing some stages after the renewal can double the plan's contribution. On the dentures in the table, the second year adds ${K.usd(rDent.stagedExtra)} once the new deductible is taken off.</p>
<p>The decision is clinical before it is financial. A tooth that needs treatment now should not wait for a renewal date, and only your dentist can say whether a stage can be delayed safely. The calculator below simply shows the money at stake, so the question can be asked with figures in hand.</p>
${h.mini('max', { t: 'One plan year or two', p: ['q', 'am'], d: { q: Math.round(dent.medianAllowed / 100) * 100 } })}

<h2>Why maximums bite harder than they used to</h2>
<p>Dental fees keep rising while many plans keep the same maximum year after year. The consumer price index for dental services rose ${K.pct(K.cpiChange, 1)} over the twelve months to ${K.month(K.P.cpiDental.latestPeriod)}, according to the ${h.src('bls_cpi_dental', 'Bureau of Labor Statistics')}. A maximum that does not move buys a little less treatment each year, and the threshold at which it starts to bind is reached by more ordinary treatment plans, such as two crowns or a root canal followed by a crown on the same tooth.</p>
<p>The effect is easy to miss because each visit looks reasonable on its own. A filling in the spring, a deep cleaning in the summer and a crown in the autumn may each fall under the percentage, while together they reach the ceiling before the year is out. Keeping a running total of what the plan has paid, from the explanation of benefits after each visit, avoids discovering the limit at the front desk.</p>

<h2>What counts against the maximum</h2>
<p>Plans differ on what draws down the maximum. In some, checkups and cleanings count against it, so a family that uses its preventive visits has less room left for a crown. Others leave preventive care outside the maximum. Orthodontics usually has its own lifetime maximum, separate from the yearly one, and children's coverage on the exchanges follows its own rules, with an out-of-pocket limit of ${K.usd(EX.childOutOfPocketMax)} a year for a child in the example plan. The member statement or explanation of benefits after each visit shows how much of the maximum is left.</p>

<h2>Comparing plans by their maximum</h2>
<p>When choosing a plan, the maximum and the premium belong in the same calculation. A plan with a higher maximum costs more each month; it pays off only for someone expecting large work. For a person who needs only checkups and the occasional filling, the maximum rarely binds and the class shares matter more. The ${h.a('dental-insurance-calculator', 'insurance calculator')} handles a single quote; the ${h.a('dental-insurance-coverage', 'coverage page')} explains the classes; and the ${h.a('dental-implant-cost', 'implant page')} shows the case where the maximum binds the hardest.</p>
<p>A plan that has already paid its maximum for the year still has value: network prices keep applying, so a member pays the plan's allowed amount rather than the full fee. On a crown at the median of the states priced here, that difference alone is ${K.usd(crown.median - crown.medianAllowed)}.</p>
`,
  faqs: [
    { q: 'What is a typical dental insurance annual maximum?', a: `Maximums are set plan by plan. The Covered California 2026 adult coinsurance plan, used as the example on this site, has ${K.usd(EX.annualMax)} a year with a ${K.usd(EX.deductible)} deductible. Employer plans publish theirs in the summary of benefits; a higher maximum generally comes with a higher premium, so it pays off mainly for people who expect large treatments.` },
    { q: 'Does unused dental maximum roll over to next year?', a: 'In most plans it does not: the maximum resets when the plan year renews, and what was not used is lost. A few plans offer a rollover feature that carries part of an unused amount forward if the member had a checkup during the year. The benefit summary says whether yours has one and how much it carries.' },
    { q: 'Can I split dental work between two calendar years to save money?', a: 'If the plan year follows the calendar and the dentist agrees that part of the treatment can safely wait, work done after the renewal draws on the new maximum, minus a new deductible. On large treatments this can add a second year of plan payments. The decision about timing belongs to the dentist; the calculator only shows the amounts.' },
    { q: 'Do I still get network prices after reaching my maximum?', a: 'Usually yes. A network dentist has agreed to the plan allowed amounts, and many plans keep those prices for members who have used up the maximum, so you pay the allowed price rather than the office full fee. Ask the office to confirm, as the rule is set by the network contract rather than by law.' },
  ],
  tool: 'max',
  toolArg: { q: Math.round(dent.medianAllowed / 100) * 100 },
  related: ['dental-insurance-calculator', 'dental-insurance-coverage', 'dentures-cost', 'dental-implant-cost'],
  sources: ['covered_ca_2026', 'ada_hpi_2024', 'bls_cpi_dental'],
});
