import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const ids = ['checkup', 'filling', 'crown', 'rootcanal_molar', 'extraction', 'denture_full'];
const rows = ids.map((id) => ({ id, p: K.PR(id), s: K.spread(id) })).filter((r) => r.s.n > 0);
const gapShare = (r: (typeof rows)[number]) => 1 - r.s.medianAllowed / r.s.median;
const crown = K.spread('crown');
const check = K.spread('checkup');
const EX = K.P.examplePlan;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const avgGap = rows.reduce((a, r) => a + gapShare(r), 0) / (rows.length || 1);
const loan = K.loan(crown.median, K.P.credit.personalLoan24, 24);
const card = K.loan(crown.median, K.P.credit.cardAllAccounts, 24);

export default defineGuide({
  id: 'dental-work-without-insurance',
  group: 'insurance',
  order: 25,
  slug: 'dental-work-without-insurance',
  nav: 'Dental work without insurance',
  card: 'Full fees by procedure and state, and the ways an uninsured bill gets smaller.',
  title: 'Dental Work Without Insurance 2026: Full Prices by State',
  description: `Dental work without insurance in 2026: full fees for fillings, crowns and root canals by state from public fee schedules, and how uninsured patients pay less.`,
  h1: 'Dental work without insurance: the full fee, and how to pay less of it',
  intro: 'Pick the procedure and your state: the estimator is set to no insurance and gives the typical full fee an office bills.',
  resume: `A patient with no dental plan is billed the office's full fee, which is higher than the price a plan negotiates for its members. On the estimates of this site, built from state Medicaid fee schedules and the ADA Health Policy Institute's 2024 ratios, a checkup with cleaning and X-rays has a median full fee of ${K.usd(check.median)} and a porcelain crown ${K.usd(crown.median)}, in ${cpi} dollars. For the same procedures, the network price that private plans allow is lower by about ${K.pct(avgGap, 0)} on average across the procedures listed below, a gap that uninsured patients pay in full. The bill can still shrink: asking the office for its cash price or a payment plan, choosing a dental school or a community health center, checking whether Medicaid covers adults in your state, and comparing a plan's yearly cost with the work you expect. None of these changes what treatment you need, which is a matter for a dentist.`,
  body: (h) => `
<h2>What uninsured patients are billed</h2>
<p>Every dental office keeps a list of its own fees, often called its usual fees. Insured patients rarely pay them: the plan has agreed a lower amount with dentists in its network, and the patient owes a share of that lower amount. A patient without a plan has no such agreement behind them, so the office's list applies unless it offers something else. The full fee is what the estimator shows when the coverage is set to none.</p>
${h.table(['Procedure', 'Full fee, median', 'Network price, median', 'Gap'], rows.map((r) => [r.p.short, K.usd(r.s.median), K.usd(r.s.medianAllowed), K.pct(gapShare(r), 0)]), `Estimates in ${cpi} dollars across the states whose Medicaid schedules list every code of the procedure.`, ['l', 'r', 'r', 'r'])}
<p>The gap is not the same everywhere. It comes from two ratios that the ADA measured in each state, Medicaid pay against dentists' charges and against private plan payments, so it is wider where plans pay dentists much less than their list prices. The ${h.a('dental-costs-by-state', 'state comparison')} shows the full fee and the network price side by side for each state.</p>
${h.mini('states', { t: 'Full fee or network price, state by state', p: ['pr', 'bs'], d: { pr: 'crown' } })}

<p>Insured patients meet the full fee too, in two situations. Out of network, the plan pays its share of its own allowance and the office may bill the difference up to its list price. And once a plan's yearly maximum is used, ${K.usd(EX.annualMax)} in the example plan from Covered California, further work that year is paid by the patient, often at the network price if the office stays bound by its network agreement, otherwise at the full fee. The estimator's out of network option shows the first case.</p>

<h2>Ways the bill gets smaller</h2>
<p><strong>Ask for the cash price before the visit.</strong> Some offices give patients who pay at the time of service a lower price than their list, or a written fee for each code. Asking for the codes and the price of each is the simplest way to compare offices and to read a quote against the estimate for your state.</p>
<p><strong>Dental schools and community health centers.</strong> Treatment by students under supervision in a dental school, and care at federally funded health centers that set fees by income, usually cost less than private offices, at the price of longer visits or waiting lists. Local health departments can say which ones exist near you.</p>
<p><strong>Medicaid and CHIP.</strong> Every state Medicaid program covers dental care for enrolled children, and separate CHIP programs must cover the dental services needed to prevent disease, as ${h.src('cms_dental', 'the federal Medicaid agency')} explains. For adults, each state decides, and some cover only emergencies. The ${h.a('medicaid-dental-by-state', 'Medicaid dental page')} gives the level reported for each state.</p>
<p><strong>Medicare.</strong> Original Medicare does not pay for routine cleanings, fillings or extractions, according to ${h.src('medicare_dental', 'Medicare.gov')}; it covers dental services only in narrow cases tied to certain medical treatments. Some Medicare Advantage plans include dental benefits, with limits of their own.</p>
<p><strong>A plan bought for the work ahead.</strong> An individual dental plan costs a monthly premium and usually pays preventive care first, basic work next and major work only after a waiting period. Comparing a year of premiums with what the plan would pay on the work you expect is a matter of arithmetic, which the ${h.a('dental-insurance-calculator', 'insurance calculator')} does; the ${h.a('dental-insurance-waiting-period', 'waiting period page')} shows why a plan bought for a crown next month may pay nothing for it.</p>
${h.mini('plan', { t: 'What a plan would pay on a quote', p: ['q', 'pc'], d: { q: Math.round(crown.medianAllowed / 100) * 100, pc: '50' } })}

<h2>Paying over time</h2>
<p>Offices may offer payment plans, and lenders offer cards and loans for medical and dental bills. The cost depends on the rate. A crown at the median full fee of ${K.usd(crown.median)}, repaid over 24 months, costs about ${K.usd(loan.monthly)} a month at the average rate of a 24-month personal loan from commercial banks, ${K.pct(K.P.credit.personalLoan24 / 100, 2)}, and about ${K.usd(card.monthly)} at the average credit card rate, ${K.pct(K.P.credit.cardAllAccounts / 100, 2)}, both from the Federal Reserve's ${h.src('fed_g19', 'G.19 release')}. Promotions that charge no interest if paid in full can bring back all the interest of the period when a balance remains; the ${h.a('dental-financing', 'financing page')} computes both cases.</p>

<h2>What stays the same</h2>
<p>Paying less should not change what is done. A dentist decides what a tooth needs; the patient decides whether to go ahead, with the price in hand. Delaying care to save money is a choice to discuss with the dentist, who can say what waiting may mean for a given tooth. This page gives prices and ways to pay, not advice about treatment.</p>
`,
  faqs: [
    { q: 'How much does a dental visit cost without insurance?', a: `A routine checkup with an exam, a cleaning and bitewing X-rays has a median estimated full fee of ${K.usd(check.median)} in ${cpi} dollars across the states priced on this site. A first visit with a full set of X-rays costs more. Fillings, crowns and other treatment found at the exam are billed on top, at the office's own fees.` },
    { q: 'Do dentists charge uninsured patients more?', a: 'Uninsured patients are billed the office\'s full list fee, while insured patients pay a share of the lower amount their plan negotiated with network dentists. On our estimates the network price is well below the full fee for every procedure. Some offices offer cash prices or payment plans to patients without coverage; asking before treatment costs nothing.' },
    { q: 'Where can I get cheaper dental care without insurance?', a: 'Dental schools, where students treat patients under supervision, and community health centers that set fees by income usually charge less than private offices. Children may qualify for Medicaid or CHIP, which cover dental care in every state; adult Medicaid dental benefits depend on the state. A local health department can point to nearby options.' },
  ],
  tool: 'cost',
  toolArg: { cv: 'none', pr: 'crown' },
  related: ['dental-insurance-calculator', 'dental-financing', 'medicaid-dental-by-state', 'teeth-cleaning-cost'],
  sources: ['ada_hpi_2024', 'cms_dental', 'medicare_dental', 'fed_g19', 'bls_cpi_dental'],
});
