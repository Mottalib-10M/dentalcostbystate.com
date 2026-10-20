import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const sp = K.spread('veneer');
const names = sp.rows.map((r) => r.s.name);
const list = names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0];
const range = sp.n > 1 ? `between ${K.usd(sp.lo!.e.charge)} in ${sp.lo!.s.name} and ${K.usd(sp.hi!.e.charge)} in ${sp.hi!.s.name}` : `${K.usd(sp.median)} in ${list}`;
const crown = K.spread('crown');
const cpi = K.month(K.P.cpiDental.latestPeriod);
const share = K.shareOf('veneer', 'auto');
const six = sp.median * 6;
const loan = K.loan(six, K.P.credit.cardAllAccounts, 24);

export default defineGuide({
  id: 'veneers-cost',
  group: 'procedure',
  order: 10,
  slug: 'veneers-cost',
  nav: 'Veneers cost',
  card: 'A porcelain veneer per tooth, by state, and why plans rarely pay for it.',
  title: 'Veneers Cost 2026: Porcelain Veneer Price per Tooth by State',
  description: `Veneers cost in 2026: a porcelain veneer priced per tooth from state fee schedules, about ${K.usd(sp.median)} before insurance, and why dental plans seldom pay for it.`,
  h1: 'Veneers cost: one porcelain veneer, tooth by tooth and state by state',
  intro: 'Choose a state: the estimator prices one laboratory-made porcelain veneer, then multiply by the number of teeth in your plan.',
  resume: `One porcelain veneer made in a dental laboratory, code D2962, is estimated at a median ${K.usd(sp.median)} per tooth in ${cpi} dollars, ${range}, in the ${sp.n === 1 ? 'state' : `${sp.n} states`} whose Medicaid fee schedules list the code. Veneers are usually placed on several front teeth at once, so a smile of six veneers at that median comes to about ${K.usd(six)}. The estimate is a typical full fee; a dental plan's network price would be lower, about ${K.usd(sp.medianAllowed)} a tooth, but plans that call veneers cosmetic pay nothing toward them, which is why the estimator's default plan share for this procedure is ${K.pct(share, 0)}. When a veneer repairs a broken or damaged tooth, a plan may treat it as restorative work instead; only its benefit summary or a predetermination says so. Composite veneers built up in the chair use other codes and are not priced here.`,
  body: (h) => `
<h2>What the code covers</h2>
<p>A veneer is a thin shell bonded to the front of a tooth. The code priced here, D2962, is a labial veneer of porcelain or ceramic made by a laboratory, the kind most offices mean when they quote veneers. It covers the shell and its bonding on one tooth. Preparation visits, impressions or scans, temporaries and a mock-up are often included in an office's price, but some offices list a wax-up or a consultation separately, so a line-by-line quote is the useful document to compare.</p>
<p>Two other codes exist for veneers: D2960, a resin veneer built directly on the tooth, and D2961, a resin veneer made by a laboratory. They cost less than porcelain in most offices, and few public schedules list them, so the site does not estimate them.</p>
${h.table(['Code', 'Veneer type', 'Priced here'], [['D2960', 'Resin, built in the chair', 'No'], ['D2961', 'Resin, made by a laboratory', 'No'], ['D2962', 'Porcelain or ceramic, made by a laboratory', 'Yes']], 'Current Dental Terminology codes for labial veneers.', ['l', 'l', 'l'])}

<h2>Why so few states can be priced</h2>
<p>The site builds every price from a state's Medicaid dental fee schedule, divided by the state's ratio between Medicaid pay and dentists' charges as measured by the ADA Health Policy Institute in 2024. Medicaid programs pay for veneers rarely, since they cover treatment rather than appearance, and a schedule without a fee for D2962 gives nothing to divide. Of the ${K.STATES.length} schedules read for the site, ${sp.n === 1 ? 'one lists' : `${sp.n} list`} the code: ${list}. Where a schedule lists it, the program may limit it to particular cases, but the fee still measures what it pays for the work, which is all the estimate needs.</p>
${h.mini('states', { t: 'One porcelain veneer in the states that list it', p: ['bs'], d: { pr: 'veneer' } })}

<h2>Veneer or crown: two different jobs, two prices</h2>
<p>A crown covers the whole tooth; a veneer covers its front face. The crown is priced in more states, with a median of ${K.usd(crown.median)} across ${crown.n}, and plans that cover crowns treat them as major work with a real payment. The two are not interchangeable: a dentist chooses between them from the state of the tooth, and this site does not weigh in on that choice. What the prices show is that a cosmetic plan on many front teeth can cost more than a single crown on a damaged tooth, and that the plan pays very differently.</p>

<h2>Insurance and veneers</h2>
<p>Dental plans divide work into classes and pay a share by class. Cosmetic work usually sits outside every class, so the plan's share is zero and the yearly maximum is untouched. That is the default of the estimator for veneers. If a dentist documents that a veneer restores a fractured or decayed tooth, some plans pay it as a restorative service; type your plan's percentage into the calculator to see the result, and ask the plan for a predetermination before the work starts. The ${h.a('dental-insurance-coverage', 'coverage page')} explains how classes are set.</p>
<p>A plan that pays nothing toward a veneer can still matter. Some network agreements require the dentist to charge members the plan's network price even for services the plan does not cover, while others leave the office free to bill its full fee. The difference is real: at the median estimate, the network price is ${K.usd(sp.medianAllowed)} a tooth against a full fee of ${K.usd(sp.median)}. Asking the office which price applies to a member, before the first appointment, costs nothing and can change the total of a multi-tooth plan.</p>
${h.mini('cost', { t: 'One veneer in your state, with or without a plan', p: ['sx', 'pc'], d: { pr: 'veneer' } })}

<h2>Paying for several veneers</h2>
<p>Because a cosmetic treatment is usually paid in full by the patient, it is often spread over time. Six veneers at the median estimate, about ${K.usd(six)}, repaid over 24 months at the Federal Reserve's average credit card rate of ${K.pct(K.P.credit.cardAllAccounts / 100, 2)} would cost about ${K.usd(loan.monthly)} a month and ${K.usd(loan.totalInterest)} of interest in total. Deferred interest offers can cost far more if any balance remains at the end; the ${h.a('dental-financing', 'financing page')} works through both cases.</p>

<h2>Reading a quote</h2>
<p>An estimate is a state average for one code, not the price of a treatment plan. Offices that specialize in cosmetic work, ceramics from particular laboratories and work in large cities all push prices above the average. The quote should say how many veneers, which code, what is included and what happens if a veneer chips or comes off. Compare the per-tooth price with the estimate for your state; a large gap is a reason to ask what the extra pays for.</p>
`,
  faqs: [
    { q: 'How much does one porcelain veneer cost in 2026?', a: `In the states whose Medicaid schedules list code D2962, one laboratory-made porcelain veneer is estimated at a median ${K.usd(sp.median)} per tooth before any plan, in ${cpi} dollars. Prices in cosmetic practices and large cities often run higher. Multiply by the number of teeth in the treatment plan for the total.` },
    { q: 'Does dental insurance pay for veneers?', a: 'Usually not when they are placed to change the look of healthy teeth, since plans treat that as cosmetic work and exclude it. When a veneer restores a broken or decayed tooth, some plans pay it as restorative work at their basic or major rate. Only the plan can confirm it, through a predetermination before treatment.' },
    { q: 'How many veneers do people usually get?', a: `It depends on the smile and on what the dentist proposes; treatment plans often cover the front teeth that show when smiling, such as six or eight on the upper arch. The total is simply the price per tooth times the count, about ${K.usd(six)} for six at the median estimate, plus any separate consultation or mock-up fee.` },
  ],
  tool: 'cost',
  toolArg: { pr: 'veneer', cv: 'none' },
  related: ['dental-crown-cost', 'dental-financing', 'dental-insurance-coverage', 'dental-work-without-insurance'],
  sources: ['ada_hpi_2024', 'bls_cpi_dental', 'fed_g19', 'covered_ca_2026'],
});
