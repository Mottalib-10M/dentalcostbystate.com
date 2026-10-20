import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const EX = K.P.examplePlan;
const C = K.P.classes;
const inShare = (m: number) => K.pct(1 - m, 0);
const chk = K.spread('checkup');
const fill = K.spread('filling');
const rc = K.spread('rootcanal_molar');
const ven = K.spread('veneer');
const base = { insured: true, inNetwork: true, deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: 0, nextYearDeductible: EX.deductible };
const one = (s: ReturnType<typeof K.spread>, share: number) => K.plan({ ...base, charge: s.median, allowed: s.medianAllowed, planShare: share });
const rChk = K.plan({ ...base, charge: chk.median, allowed: chk.medianAllowed, planShare: 1 - EX.memberShare.preventive, deductibleApplies: false });
const rFill = one(fill, 1 - EX.memberShare.basic);
const rRc = one(rc, 1 - EX.memberShare.major);

export default defineGuide({
  id: 'dental-insurance-coverage',
  group: 'insurance',
  order: 21,
  slug: 'dental-insurance-coverage',
  nav: 'What dental insurance covers',
  card: 'Preventive, basic and major classes, what each pays, in and out of network.',
  title: 'Dental Insurance Coverage 2026: What Plans Pay by Class',
  description: 'Dental insurance coverage in 2026: how plans sort work into preventive, basic and major classes, the share each pays in and out of network, and the child rules.',
  h1: 'What dental insurance covers: the classes of service and the share each one pays',
  intro: 'Pick a procedure and your state, then set the plan share for its class: the estimator shows the price, the plan payment and your part.',
  resume: `Dental plans do not pay one rate for everything. They sort each code into a class and pay a different share for each, a pattern often summed up as 100, 80, 50. In the Covered California 2026 adult coinsurance plan used as the example on this site, diagnostic and preventive care such as exams, cleanings and X-rays is paid at ${inShare(EX.memberShare.preventive)} in network, basic services such as fillings and periodontal maintenance at ${inShare(EX.memberShare.basic)}, and major services, a group that includes root canals, crowns, dentures, bridges, gum treatment other than maintenance and oral surgery, at ${inShare(EX.memberShare.major)}. Adult orthodontics is not covered, and cosmetic work such as veneers is outside the plan. Out of network the shares fall to ${inShare(EX.outOfNetworkMemberShare.preventive)}, ${inShare(EX.outOfNetworkMemberShare.basic)} and ${inShare(EX.outOfNetworkMemberShare.major)}. Everything is subject to a ${K.usd(EX.deductible)} deductible and a ${K.usd(EX.annualMax)} yearly maximum. Children have their own rules: a ${K.usd(EX.childDeductible)} deductible and an out-of-pocket limit of ${K.usd(EX.childOutOfPocketMax)}.`,
  body: (h) => `
<h2>Why plans pay by class</h2>
<p>A dental plan wants members to come for checkups, which are cheap and catch problems early, and it wants to limit what it spends on large restorations. Paying the first class in full and the last one at half does both. The class of a procedure is set by the plan's own list of codes, not by how serious the problem feels: a root canal, which saves a tooth, sits in the same class as a crown or a denture in many plans, including the example one.</p>
<p>Classes also explain why two quotes for the same tooth can leave very different bills. A large filling and a crown may both repair a broken molar, but the first is usually basic work and the second major work, so the plan's share drops when the treatment moves from one to the other. Asking the office which codes it plans to bill, and looking them up in the plan's class list, is the quickest way to know which percentage applies before the work begins.</p>
<p>The table gives the example plan's shares by class, in and out of network, as published by Covered California for 2026. Your plan may use other percentages and put some codes in another class, which is why the calculators let you choose the share yourself.</p>
${h.table(['Class', 'What it includes', 'Plan pays in network', 'Plan pays out of network'], [
  [C.preventive.label.split(' (')[0], 'Exams, cleanings, X-rays', inShare(EX.memberShare.preventive), inShare(EX.outOfNetworkMemberShare.preventive)],
  [C.basic.label.split(' (')[0], EX.basicIncludes, inShare(EX.memberShare.basic), inShare(EX.outOfNetworkMemberShare.basic)],
  [C.major.label.split(' (')[0], EX.majorIncludes, inShare(EX.memberShare.major), inShare(EX.outOfNetworkMemberShare.major)],
  [C.ortho.label, `Adults: ${EX.adultOrtho.toLowerCase()}. Children: ${EX.childOrthoNote.toLowerCase()}`, `Children: ${inShare(EX.childOrthoMemberShare)}`, 'n/a'],
  [C.cosmetic.label.split(' (')[0], 'Veneers and other work done for appearance', 'Not covered', 'Not covered'],
], 'Covered California 2026 dental benefit designs, adult coinsurance plan; orthodontics row from the children\'s design.', ['l', 'l', 'r', 'r'])}

<h2>Three procedures, three classes</h2>
<p>Run the median network prices of the states this site prices through the example plan and the classes show their effect. A checkup with exam, cleaning and bitewing X-rays costs about ${K.usd(chk.medianAllowed)} in network and the plan pays ${K.usd(rChk.planPays)} of it. A two-surface filling, basic work, costs about ${K.usd(fill.medianAllowed)}; with the deductible still open the plan pays ${K.usd(rFill.planPays)} and you pay ${K.usd(rFill.youPay)}. A molar root canal, major work, costs about ${K.usd(rc.medianAllowed)}; the plan pays ${K.usd(rRc.planPays)} and you pay ${K.usd(rRc.youPay)}.</p>
<p>The deductible counts once a year, so the first treatment of the year carries it and the next ones do not. In the example plan it applies to basic and major work only, so a checkup in network costs nothing even before the deductible is met; plans that charge it on preventive care say so in their benefit summary.</p>
${h.mini('cost', { t: 'Price and plan share of one procedure in your state', p: ['pr', 'sx'], d: { pr: 'rootcanal_molar' } })}

<h2>Out of network: two losses at once</h2>
<p>Leaving the network costs twice. The plan's share drops, as the table shows for preventive and basic work, and the dentist is free to bill the gap between the full fee and the plan's allowance, called balance billing. On a root canal the full fee median is ${K.usd(rc.median)} against ${K.usd(rc.medianAllowed)} in network, so the gap alone is ${K.usd(rc.median - rc.medianAllowed)} before any coinsurance. The ${h.a('dental-insurance-calculator', 'dental insurance calculator')} handles a quote from either kind of office.</p>

<h2>Children, orthodontics and cosmetic work</h2>
<p>Exchange plans write separate terms for children's dental care. In the example, a child's deductible is ${K.usd(EX.childDeductible)} and the family's out-of-pocket spending for a child stops at ${K.usd(EX.childOutOfPocketMax)} a year in network, a protection adult plans do not have. Orthodontics for children is covered at ${inShare(EX.childOrthoMemberShare)} only when it is medically necessary, a test the plan applies case by case; ordinary braces for alignment are paid by the family. The ${h.a('braces-cost', 'braces cost page')} prices a full treatment by state.</p>
<p>Adult orthodontics is not covered in the example plan, and many employer plans either exclude it or pay it up to a separate lifetime maximum. Veneers and whitening are cosmetic and outside almost every plan; the ${h.a('veneers-cost', 'veneers page')} gives their full price. When a plan pays for a crown on a tooth that also has a cosmetic reason for treatment, the class follows the code billed, not the reason.</p>

<h2>Limits that sit outside the classes</h2>
<p>Classes and shares are only part of a benefit summary. Frequency limits restrict how often a plan pays for the same service, for example cleanings in a year or a new crown on the same tooth. Waiting periods delay the major class for new members, ${EX.waitingMajorMonths} months in the example unless earlier coverage is shown; the ${h.a('dental-insurance-waiting-period', 'waiting period page')} explains them. And the yearly maximum caps the total whatever the class, as the ${h.a('dental-insurance-annual-maximum', 'annual maximum page')} shows. Reading those three clauses next to the class table gives a fair picture of what a plan will do with a given treatment plan. None of this says which treatment is right for you; that is your dentist's call.</p>
`,
  faqs: [
    { q: 'What is the 100 80 50 rule in dental insurance?', a: `It is shorthand for the usual class pattern: the plan pays all of preventive care, about 80 % of basic services such as fillings, and about half of major services such as crowns and root canals. The Covered California 2026 example follows it in network: ${inShare(EX.memberShare.preventive)}, ${inShare(EX.memberShare.basic)} and ${inShare(EX.memberShare.major)}. Each plan sets its own percentages, so check the benefit summary.` },
    { q: 'Is a root canal basic or major dental work?', a: 'It depends on the plan. Some plans list endodontics, which includes root canals, with basic services; others, including the Covered California 2026 design used on this site, place it with major services paid at half after the deductible. The plan code list or a predetermination tells you which class your plan uses for the specific code.' },
    { q: 'Does dental insurance cover cosmetic work like veneers?', a: 'Almost never. Veneers, whitening and other work done for appearance sit outside the covered classes of most plans, including the example one, so the patient pays the full price. If the same tooth needs a crown for a structural reason, the plan reviews the crown code under its own rules, separately from any cosmetic choice.' },
    { q: 'Why does a child have a different dental deductible?', a: `Exchange plans write separate terms for children, with a lower ceiling on what a family pays. In the Covered California 2026 example, a child's deductible is ${K.usd(EX.childDeductible)} and in-network out-of-pocket costs for a child stop at ${K.usd(EX.childOutOfPocketMax)} a year. Adult coverage in the same plan has a ${K.usd(EX.annualMax)} maximum instead.` },
  ],
  tool: 'cost',
  toolArg: { pr: 'filling' },
  related: ['dental-insurance-calculator', 'dental-insurance-annual-maximum', 'dental-insurance-waiting-period', 'cavity-filling-cost'],
  sources: ['covered_ca_2026', 'ada_hpi_2024', 'bls_cpi_dental'],
});
