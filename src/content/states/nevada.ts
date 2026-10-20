import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const SLUG = 'nevada';
const st = K.S(SLUG);
const r = st.ratios;
const must = (id: string) => { const e = K.est(SLUG, id); if (!e.ok) throw new Error(`${SLUG}: ${id} not priced`); return e; };
const teen = must('braces_teen');
const adult = must('braces_adult');
const crown = must('crown');
const dent = must('denture_full');
const veneer = must('veneer');
const fill = must('filling');
const fee = (c: string) => st.fees[c]?.all ?? st.fees[c]?.adult ?? st.fees[c]?.child ?? 0;
const nat = K.ADA.national;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const loan = K.loan(adult.charge, K.P.credit.personalLoan24, 24);

export default defineState({
  slug: SLUG,
  title: 'Dental Costs Nevada 2026: Braces, Crown and Veneer Prices',
  description: 'Dental costs in Nevada for 2026: braces for teens and adults, crowns, dentures and veneers priced from the Nevada Medicaid dentist rate schedule, with a plan.',
  intro: `Nevada's Medicaid schedule lists both teenage and adult orthodontics, so braces can be priced for either: ${K.usd(teen.charge)} for a teenager before insurance.`,
  resume: `Comprehensive braces are estimated at ${K.usd(teen.charge)} for a teenager and ${K.usd(adult.charge)} for an adult in Nevada, a porcelain crown at ${K.usd(crown.charge)}, a full set of dentures at ${K.usd(dent.charge)} and a porcelain veneer at ${K.usd(veneer.charge)}, in ${cpi} dollars before any plan. The base is the Nevada Medicaid reimbursement schedule for dentists, one rate per code for all ages, every rate read here dated from January 1, 2024, the last comprehensive review, and unchanged since. The ADA's 2024 study classed Nevada's adult dental benefit as emergency care only and gave the state a ratio for children: Medicaid paid ${K.pct(r.childCharge!, 1)} of what Nevada dentists charge for children's care, against ${K.pct(nat.childCharge, 1)} nationally. That ratio is used for every procedure, adult ones included.`,
  body: (h) => `
<h2>One rate review, still in force</h2>
<p>The ${h.ext(st.url, 'Nevada Medicaid schedule for dentists')} states the date from which each rate applies, and every code this site reads begins on ${K.day(st.effective2024!)}. The edition of July 2026 is therefore also the schedule of July 2024, the month up to which the ADA collected Medicaid fees, and the estimate and today's Medicaid fee start from the same amounts. The schedule also says that codes listed at zero are paid at a share of the dentist's usual charges; none of the codes priced here is in that case.</p>
<p>One common code is missing from the file: the periodic exam, D0120. Without it a routine checkup cannot be priced, and the Nevada price list has no checkup line. A new patient exam and cleanings are listed, so the ${h.a('teeth-cleaning-cost', 'cleaning page')} uses other states for the visit as a whole.</p>
${h.mini('cost', { t: 'A Nevada procedure, with or without a plan', p: ['pr', 'cv'], d: { sx: SLUG, pr: 'braces_adult', cv: 'none' } })}
<h2>Braces at two ages</h2>
<p>Nevada lists code D8080 for adolescents and D8090 for adults, at ${K.usd(fee('D8080'))} and ${K.usd(fee('D8090'))}. Divided by the children's ratio, the only one the ADA gives for Nevada, and carried to ${cpi}, they become ${K.usd(teen.charge)} and ${K.usd(adult.charge)}. Clear aligners are billed under the same comprehensive codes, which is why the ${h.a('invisalign-cost', 'aligner page')} quotes these figures rather than a brand price. Many plans exclude adult orthodontics, the Covered California example among them; spread over 24 months with a personal loan at the Federal Reserve's average rate of ${K.pct(K.P.credit.personalLoan24 / 100, 2)}, the adult figure would cost ${K.usd(loan.monthly)} a month.</p>
<h2>Veneers and fillings</h2>
<p>Nevada also lists the porcelain veneer, D2962, which most schedules leave out because it is cosmetic: ${K.usd(veneer.charge)} a tooth here, a price plans rarely share. A two-surface filling on a back tooth comes to ${K.usd(fill.charge)}. Most Nevada Medicaid members receive dental care through a dental benefits administrator; the schedule used here is the fee-for-service one.</p>
`,
  faqs: [
    { q: 'How much do braces cost in Nevada?', a: `About ${K.usd(teen.charge)} for comprehensive treatment of a teenager and ${K.usd(adult.charge)} for an adult, before insurance, in ${cpi} dollars. The figures divide Nevada Medicaid's rates for codes D8080 and D8090 by the state's children's ratio from the ADA's 2024 study. Records, retainers and some follow-up visits can be billed in addition.` },
    { q: 'Have Nevada Medicaid dental rates changed since 2024?', a: `Not for the codes this site reads. Each one carries a rate begin date of ${K.day(st.effective2024!)}, the last comprehensive review, and the July 2026 schedule prints the same amounts. Coverage for adults was widened in July 2026, according to the notes of the schedule, but that changes who is covered, not the rates.` },
    { q: 'What does a porcelain veneer cost in Nevada?', a: `About ${K.usd(veneer.charge)} per tooth before insurance, estimated from the Nevada Medicaid rate for code D2962. Veneers are usually treated as cosmetic, and plans such as the Covered California example pay nothing toward them, so the full fee is what most patients pay. Several teeth are often treated together.` },
  ],
  related: ['braces-cost', 'invisalign-cost', 'veneers-cost', 'dental-costs-by-state'],
});
