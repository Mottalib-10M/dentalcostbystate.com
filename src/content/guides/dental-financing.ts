import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const C = K.P.credit;
const period = K.month(C.period);
const release = K.day(C.release);
const crown = K.spread('crown');
const dent = K.spread('denture_full');
const amt = Math.round(dent.median / 100) * 100 || Math.round((crown.median * 2) / 100) * 100;
const months = 24;
const card = K.loan(amt, C.cardAssessedInterest, months);
const loan = K.loan(amt, C.personalLoan24, months);
const promo = 12;
const clear = K.deferred(amt, C.cardAssessedInterest, promo, amt / promo);
const short = Math.round((amt / promo) * 0.8);
const miss = K.deferred(amt, C.cardAssessedInterest, promo, short);

export default defineGuide({
  id: 'dental-financing',
  group: 'paying',
  order: 31,
  slug: 'dental-financing',
  nav: 'Paying over time',
  card: 'Monthly payment, interest and the deferred interest trap, at the average rates.',
  title: 'Dental Financing 2026: Monthly Payment and Deferred Interest',
  description: `Dental financing in 2026: monthly payment and interest on a dental bill at the Federal Reserve's average card and loan rates, and how deferred interest works.`,
  h1: 'Paying a dental bill over time: the monthly payment, the interest and deferred interest',
  intro: 'Enter the amount, the rate and the length: the calculator gives the monthly payment, the interest, and what a deferred interest promotion costs if a balance is left.',
  resume: `Spreading a dental bill over time has a price, and it depends mostly on the rate. The Federal Reserve's G.19 release of ${release} puts the average rate on credit card accounts that paid interest at ${K.pct(C.cardAssessedInterest / 100, 2)} in ${period}, and the average rate on a ${months}-month personal loan from a commercial bank at ${K.pct(C.personalLoan24 / 100, 2)}. On a bill of ${K.usd(amt)}, close to the median full fee of full dentures in the states priced here, ${months} equal payments cost ${K.usd(card.monthly)} a month at the card rate, ${K.usd(card.totalInterest)} of interest in all, and ${K.usd(loan.monthly)} a month at the loan rate, ${K.usd(loan.totalInterest)} of interest. Deferred interest offers, common for medical and dental bills, charge no interest only if the whole balance is paid by the end of the promotion. Under Regulation Z, interest accrues from the start and is owed if any balance remains: paying ${K.usd(short)} a month for ${promo} months instead of ${K.usd(clear.payoffMonthly)} would leave ${K.usd(miss.leftAtEnd)} and bring back ${K.usd(miss.backInterest)} of interest at once.`,
  body: (h) => `
<h2>What the average rates are</h2>
<p>The Federal Reserve publishes the terms of consumer credit every month in its ${h.src('fed_g19', 'G.19 release')}. Two of its rates matter for a dental bill. The average rate on credit card accounts assessed interest, that is accounts that carry a balance, was ${K.pct(C.cardAssessedInterest / 100, 2)} in ${period}; the rate across all card accounts, including those paid in full each month, was ${K.pct(C.cardAllAccounts / 100, 2)}. The average rate on a ${months}-month personal loan from a commercial bank was ${K.pct(C.personalLoan24 / 100, 2)}. Your own rate depends on your credit history and the lender; these averages are a reference point, not an offer.</p>
<p>Rates have a large effect on dental bills because these bills are often paid over one or two years rather than five or ten. Over such short terms, a few points of rate change the monthly payment only a little but change the total interest noticeably, and fees for opening an account or paying late add to it. Reading the annual percentage rate and the total of payments on the agreement gives the true cost in one figure.</p>
<p>The calculator uses the card rate by default because many patients pay a large bill with a card, or with a card-like plan offered at the front desk. Change the rate to the one printed on your own agreement.</p>

<h2>Equal monthly payments</h2>
<p>A loan or a card balance repaid in equal monthly payments follows the standard amortization formula: each payment covers the month's interest on the balance and repays part of it. On ${K.usd(amt)} over ${months} months:</p>
${h.table(['Rate', 'Monthly payment', 'Total interest', 'Total repaid'], [
  [`Card accounts assessed interest, ${K.pct(C.cardAssessedInterest / 100, 2)}`, K.usd(card.monthly), K.usd(card.totalInterest), K.usd(card.total)],
  [`Personal loan, ${months} months, ${K.pct(C.personalLoan24 / 100, 2)}`, K.usd(loan.monthly), K.usd(loan.totalInterest), K.usd(loan.total)],
], `Federal Reserve G.19, rates of ${period}, release of ${release}.`, ['l', 'r', 'r', 'r'])}
<p>The difference between the two lines, ${K.usd(card.totalInterest - loan.totalInterest)}, is the cost of the higher rate on this amount. A shorter term lowers the total interest and raises the payment; a longer one does the reverse.</p>

<h2>How deferred interest works</h2>
<p>Many offers for medical and dental bills advertise no interest for a set number of months. Most of them are deferred interest offers, which Regulation Z defines in ${h.src('cfr_1026_16', '12 CFR 1026.16(h)')}: finance charges that accrue on a balance and that the consumer does not have to pay, or that are waived or refunded, only if the balance is paid in full by a specified date. The advertisement must state the period, and the words "if paid in full" must appear next to any "no interest" claim.</p>
<p>The key word is accrue. Interest is computed every month from the date of the purchase, at the account's rate, and kept aside. If the balance is paid in full by the end date, it disappears. If any amount is left, even a small one, the interest of the whole period is charged at once. The calculator's advanced fields compute both cases. On ${K.usd(amt)} with a ${promo}-month promotion at the card rate, paying ${K.usd(clear.payoffMonthly)} a month clears it with no interest. Paying ${K.usd(short)} a month leaves ${K.usd(miss.leftAtEnd)} at the end, and the interest that accrued meanwhile, ${K.usd(miss.backInterest)}, is added to it.</p>
${h.mini('finance', { t: 'Monthly payment on your bill', p: ['a', 'm'], d: { a: amt } })}

<h2>Payments in the last two months</h2>
<p>A card account often holds both a deferred interest balance and ordinary purchases. ${h.src('cfr_1026_53', '12 CFR 1026.53(b)')} sets how the issuer applies a payment above the minimum: during the two billing cycles just before the promotion ends, the excess must go first to the deferred interest balance. Outside that window, the issuer applies it under the general rule, and the consumer may ask for the excess to go to the deferred balance. Planning to clear the promotion in the last two months is therefore possible, but paying the same amount every month, as the calculator does, leaves no doubt.</p>

<h2>Before choosing a way to pay</h2>
<p>Three questions narrow the choice. Is the price itself right? The ${h.a('dental-costs-by-state', 'state comparison')} shows whether a quote is in the usual range, and a network price through a plan is often lower than the full fee. Does a plan pay part of it? The ${h.a('dental-insurance-calculator', 'insurance calculator')} gives the plan share, and the ${h.a('dental-insurance-annual-maximum', 'annual maximum page')} shows when splitting work over two plan years lowers the amount to finance. And can the office spread the bill itself? Some offices accept payments in installments without interest for part of a treatment; ask before signing any credit agreement. This site names no lender and is paid by none.</p>
`,
  faqs: [
    { q: 'What interest rate should I expect on dental financing?', a: `It depends on your credit and the product. As a reference, the Federal Reserve reported an average of ${K.pct(C.cardAssessedInterest / 100, 2)} on card accounts that paid interest in ${period}, and ${K.pct(C.personalLoan24 / 100, 2)} on ${months}-month personal loans from commercial banks. The rate in your own agreement is the one that counts; compare its total interest before signing.` },
    { q: 'What happens if I do not pay off a deferred interest balance in time?', a: 'The interest that accrued on the balance since the purchase date, at the account rate, is charged all at once on top of what remains. That is the difference between deferred interest and a true zero rate offer, where unpaid balances only start to bear interest from the end of the promotion. Dividing the amount by the number of months gives the payment that avoids it.' },
    { q: 'Is it better to use a personal loan or a card for dental work?', a: `At the Federal Reserve averages of ${period}, a ${months}-month personal loan cost less than a card balance that bears interest: on ${K.usd(amt)}, about ${K.usd(card.totalInterest - loan.totalInterest)} less in total interest. Your own offers may differ. A deferred interest plan costs nothing only if it is paid in full before the end date.` },
  ],
  tool: 'finance',
  toolArg: { a: amt },
  related: ['dental-work-without-insurance', 'dental-insurance-annual-maximum', 'dentures-cost', 'dental-costs-by-state'],
  sources: ['fed_g19', 'cfr_1026_16', 'cfr_1026_53', 'bls_cpi_dental'],
});
