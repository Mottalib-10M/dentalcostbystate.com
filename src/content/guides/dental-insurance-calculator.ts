import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const EX = K.P.examplePlan;
const major = 1 - EX.memberShare.major;
const basic = 1 - EX.memberShare.basic;
const crown = K.spread('crown');
const fill = K.spread('filling');
// Worked cases with the plan engine and the example plan.
const base = { insured: true, inNetwork: true, deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: 0, nextYearDeductible: EX.deductible };
const cr = K.plan({ ...base, charge: crown.median, allowed: crown.medianAllowed, planShare: major });
const fi = K.plan({ ...base, charge: fill.median, allowed: fill.medianAllowed, planShare: basic });
const fiAfter = K.plan({ ...base, charge: fill.median, allowed: fill.medianAllowed, planShare: basic, deductibleLeft: 0 });
const out = K.plan({ ...base, inNetwork: false, charge: crown.median, allowed: crown.medianAllowed, planShare: 1 - EX.outOfNetworkMemberShare.major });
const big = Math.round((EX.annualMax * 4) / 100) * 100;
const bigR = K.plan({ ...base, charge: big, allowed: big, planShare: major });
const half = Math.round((EX.annualMax / 2) / 10) * 10;
const used = K.plan({ ...base, charge: crown.median, allowed: crown.medianAllowed, planShare: major, maxLeft: EX.annualMax - half, deductibleLeft: 0 });

export default defineGuide({
  id: 'dental-insurance-calculator',
  group: 'insurance',
  order: 20,
  slug: 'dental-insurance-calculator',
  nav: 'Dental insurance calculator',
  card: 'Type the price on a treatment plan: the deductible, the plan share and your part.',
  title: 'Dental Insurance Calculator 2026: What Your Plan Will Pay',
  description: `Dental insurance calculator for 2026: enter a treatment price, your deductible, coinsurance and yearly maximum to see what the plan pays and what you owe.`,
  h1: 'Dental insurance calculator: what the plan pays on a treatment, and what is left to you',
  intro: 'Type the price on your treatment plan and the terms of your coverage: the split between the plan and you updates as you go.',
  resume: `A dental plan pays in three steps, in this order. It first takes the deductible off the price it allows, ${K.usd(EX.deductible)} a year in the Covered California 2026 example plan used as the default here. It then pays its percentage for the class of the work: in that plan ${K.pct(basic, 0)} of basic services such as fillings and ${K.pct(major, 0)} of major services such as crowns, root canals and dentures. Finally it stops at the yearly maximum still available, ${K.usd(EX.annualMax)} in the example. On the median network price of a porcelain crown in the states priced here, ${K.usd(crown.medianAllowed)}, those steps give a plan payment of ${K.usd(cr.planPays)} and leave ${K.usd(cr.youPay)} to the patient. On a treatment of ${K.usd(big)}, the maximum binds: the plan pays ${K.usd(bigR.planPays)} and the rest is yours. Out of network, the dentist can also bill the gap between the full fee and what the plan allows. The calculator applies each step to your own figures.`,
  body: (h) => `
<h2>The three numbers the calculator needs</h2>
<p>Every dental benefit summary carries the same few terms, sometimes under different names. The deductible is the amount you pay each plan year before the plan starts sharing costs; many plans waive it for checkups and cleanings. The coinsurance, or plan percentage, is the share the plan pays once the deductible is met, and it depends on the class of the work. The annual maximum, also called the yearly benefit limit, is the most the plan pays in a plan year; once reached, everything else is yours until the year renews.</p>
<p>The calculator also asks for the benefit maximum still left, because a plan that already paid for two fillings in March has less room for a crown in October. If you do not know how much you have used, the plan's member statement or the explanation of benefits from your last visit gives it. The price to type is the one on the dentist's written treatment plan, ideally the network amount the plan allows rather than the office's full fee.</p>

<h2>A crown and a filling with the example plan</h2>
<p>Take the median network price of a crown in the states this site prices, ${K.usd(crown.medianAllowed)}, with the default plan. The ${K.usd(EX.deductible)} deductible comes off first, the plan pays ${K.pct(major, 0)} of what remains, and the result is under the maximum: ${K.usd(cr.planPays)} from the plan, ${K.usd(cr.youPay)} from you. A two-surface filling at its median network price of ${K.usd(fill.medianAllowed)} is basic work at ${K.pct(basic, 0)}: the plan pays ${K.usd(fi.planPays)} if the deductible is still open, or ${K.usd(fiAfter.planPays)} once it has been met earlier in the year.</p>
${h.table(['Case', 'Price allowed', 'Plan pays', 'You pay'], [
  ['Crown, network, deductible open', K.usd(crown.medianAllowed), K.usd(cr.planPays), K.usd(cr.youPay)],
  ['Filling, network, deductible open', K.usd(fill.medianAllowed), K.usd(fi.planPays), K.usd(fi.youPay)],
  ['Filling, network, deductible met', K.usd(fill.medianAllowed), K.usd(fiAfter.planPays), K.usd(fiAfter.youPay)],
  [`Crown, network, ${K.usd(half)} of the maximum already used`, K.usd(crown.medianAllowed), K.usd(used.planPays), K.usd(used.youPay)],
], 'Example plan: Covered California 2026 adult coinsurance plan. Median network prices of the states priced on this site.', ['l', 'r', 'r', 'r'])}
<p>The last line shows why the order of treatments in a year matters. With ${K.usd(half)} of the maximum already spent, only ${K.usd(EX.annualMax - half)} remains, so the same crown can leave you a larger share than it would at the start of the plan year.</p>
${h.mini('plan', { t: 'Try your own quote', p: ['q', 'pc'], d: { q: Math.round(crown.medianAllowed / 10) * 10, pc: '50' } })}

<h2>When the maximum decides the bill</h2>
<p>A yearly maximum turns a percentage into a ceiling. On a treatment of ${K.usd(big)} in network, half after the deductible would be ${K.usd((big - EX.deductible) * major)}, but the plan stops at ${K.usd(bigR.planPays)}, so you pay ${K.usd(bigR.youPay)}, far more than half. Implants, several crowns or a full set of dentures often reach that ceiling in one plan year. The ${h.a('dental-insurance-annual-maximum', 'annual maximum page')} shows how splitting the work over two plan years changes the result, when the dentist agrees it can wait.</p>

<h2>In network and out of network</h2>
<p>A network dentist has agreed to accept the plan's allowed amount as the full price, so you never owe more than your share of it. An office outside the network can bill its full fee; the plan still pays only its share of its own allowance, and you owe the rest. The example plan also pays smaller shares out of network: it leaves you ${K.pct(EX.outOfNetworkMemberShare.preventive, 0)} of preventive care instead of nothing, ${K.pct(EX.outOfNetworkMemberShare.basic, 0)} of basic work instead of ${K.pct(EX.memberShare.basic, 0)}. On a crown at the median full fee of ${K.usd(crown.median)}, going out of network leaves you ${K.usd(out.youPay)}, of which ${K.usd(out.balanceBill)} is the gap above the allowed amount. The ${h.a('dental-crown-cost', 'crown cost page')} gives the state ranges of both prices.</p>

<h2>The waiting period and the predetermination</h2>
<p>New members often wait before major services are covered: ${EX.waitingMajorMonths} months in the example plan, waived with proof of earlier coverage. During that time the plan pays nothing for the class, whatever the percentage says. The calculator has a field for it under "More options", and the ${h.a('dental-insurance-waiting-period', 'waiting period page')} works through the dates.</p>
<p>No calculator replaces the plan's own answer. Before a large treatment, the dental office can send the plan a predetermination, a request for a written estimate of what it will pay for the planned codes. It states the allowed amount, the class, the share and any limit such as frequency rules or an exclusion for a tooth missing before coverage began. Comparing that answer with the calculator shows at once which term differs from what you expected.</p>

<h2>What the calculator does not decide</h2>
<p>It sorts nothing into classes by itself: you choose the percentage from your benefit summary, because plans classify the same procedure differently. It does not check frequency limits, such as how often the same tooth can receive a new crown, nor the plan's rules on alternate treatments. And it says nothing about which treatment you need, which is for your dentist to judge. For prices without any plan, the ${h.a('dental-work-without-insurance', 'page on paying without insurance')} sets out the full fees.</p>
`,
  faqs: [
    { q: 'How do I calculate what my dental insurance will pay?', a: 'Start from the price the plan allows, subtract the deductible you still owe this year, and multiply the rest by the plan percentage for that class of service. If the result is above the yearly maximum still available, the plan pays only that maximum. Your share is the allowed price minus the plan payment, plus any balance billed out of network.' },
    { q: 'Does the dental deductible apply to every visit?', a: `It applies once per plan year, on the first covered services that are subject to it. Many plans do not apply it to exams and cleanings; the benefit summary says whether yours does. In the Covered California 2026 example it is ${K.usd(EX.deductible)} for an adult, and once it has been paid the plan shares the cost of covered work for the rest of that plan year.` },
    { q: 'What happens when I reach my dental plan maximum?', a: 'The plan stops paying for covered services until the plan year renews, and you pay the full allowed price of further work in network. Preventive care may still count against the maximum, depending on the plan. A new maximum starts with the new plan year, which is why some patients schedule a second phase of treatment after the renewal date.' },
    { q: 'Is an estimate from the dental office the same as what insurance pays?', a: 'Not always. The office estimates from the plan terms it knows, but the plan applies its own allowed amounts, frequency limits and exclusions when the claim arrives. A predetermination, requested by the office before treatment, is the plan written answer for the codes planned and is the closest thing to a firm figure before the work is done.' },
  ],
  tool: 'plan',
  toolArg: { q: Math.round(crown.medianAllowed / 10) * 10 },
  related: ['dental-insurance-coverage', 'dental-insurance-annual-maximum', 'dental-insurance-waiting-period', 'dental-crown-cost'],
  sources: ['covered_ca_2026', 'ada_hpi_2024', 'bls_cpi_dental'],
});
