import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const SLUG = 'missouri';
const st = K.S(SLUG);
const r = st.ratios;
const must = (id: string) => { const e = K.est(SLUG, id); if (!e.ok) throw new Error(`${SLUG}: ${id} not priced`); return e; };
const crown = must('crown');
const molar = must('rootcanal_molar');
const dent = must('denture_full');
const bridge = must('bridge3');
const check = must('checkup');
const nat = K.ADA.national;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const implantNow = st.feesNow.D6010?.all ?? 0;

export default defineState({
  slug: SLUG,
  title: 'Dental Costs Missouri 2026: Crown, Bridge and Denture Prices',
  description: `Dental costs in Missouri for 2026: crowns, root canals, bridges and dentures estimated from the MO HealthNet dental fee schedule, with or without a dental plan.`,
  intro: `Missouri has no adult ratio in the ADA's 2024 study, so its estimates rest on the children's ratio, the one measured on the same schedule; a crown comes to ${K.usd(crown.charge)}.`,
  resume: `A porcelain crown is estimated at ${K.usd(crown.charge)} in Missouri, a molar root canal at ${K.usd(molar.charge)}, a three-unit bridge at ${K.usd(bridge.charge)} and a full set of upper and lower dentures at ${K.usd(dent.charge)}, in ${cpi} dollars before any dental plan; a checkup with cleaning and X-rays comes to ${K.usd(check.charge)}. The base is the MO HealthNet dental fee schedule, which prints one fee per code for all ages. The American Dental Association's 2024 study gives Missouri a ratio for children only: it classed the state's adult Medicaid dental benefit as ${st.adultBenefit.toLowerCase()} care and measured no adult figure. The children's ratio is high, ${K.pct(r.childCharge!, 1)} of what dentists charge against ${K.pct(nat.childCharge, 1)} nationally, which says that Missouri's fees sit close to the market and the estimates sit close to them.`,
  body: (h) => `
<h2>One fee for every age, one ratio for children</h2>
<p>The ${h.ext(st.url, 'MO HealthNet dental fee schedule')} is a spreadsheet replaced every month. It lists a single rate per code, with no separate column for adults, and gives each rate its own effective date. Most of the rates used here took effect in July 2022, a few in July 2024, so they were all in force on July 1, 2024, the date up to which the ADA collected Medicaid fees. Codes whose rate changed later are left out of the estimate, because the earlier rate could not be recovered.</p>
<p>The ratio is the other half of the division. Where a state has an adult ratio the site uses it for adult procedures; Missouri has none, so the children's ratio is used for every procedure, with a note in the estimator. The children's basket of the ADA, exams, cleanings, X-rays, fillings and extractions, is close to the adult one, and the fee schedule is the same for both age groups, which keeps the estimate consistent.</p>
${h.mini('cost', { t: 'A Missouri procedure with or without a plan', p: ['pr', 'cv'], d: { sx: SLUG, pr: 'crown' } })}
<h2>Implants: a code added after the 2024 window</h2>
<p>Missouri's current schedule lists the implant body, code D6010, at ${K.usd(implantNow)}, with a rate effective in March 2025. Since that rate did not exist in July 2024, no implant estimate is made for the state. Implant crowns, codes D6058 and D6059, are marked non-covered in the same file. The ${h.a('dental-implant-cost', 'implant page')} prices the states whose 2024 schedules list all three parts.</p>
<h2>Where Missouri's fees stand</h2>
<p>A high ratio means a small step from the Medicaid fee to the estimated charge. Missouri paid ${K.usd(st.fees.D2740?.all ?? 0)} for a porcelain crown in 2024; divided by its ratio and carried to ${cpi}, that becomes ${K.usd(crown.charge)}. In a state with a ratio near the national figure, the same fee would have produced a much larger estimate. The ${h.a('dental-costs-by-state', 'state comparison')} sets Missouri against the other states, procedure by procedure, and the ${h.a('dentures-cost', 'dentures page')} explains what a complete set includes.</p>
<p>Most MO HealthNet members receive dental care through managed care plans whose rates are not published; the fee schedule is the public reference for the program's fee-for-service side, which is what the ADA measured.</p>
`,
  faqs: [
    { q: 'How much does a crown cost in Missouri?', a: `A porcelain crown is estimated at ${K.usd(crown.charge)} before insurance in Missouri and about ${K.usd(crown.allowed)} at a typical network price, in ${cpi} dollars. The figure divides the MO HealthNet fee for code D2740 by Missouri's ratio from the ADA's 2024 study. A buildup or a root canal before the crown is billed separately.` },
    { q: 'Why does Missouri use a children\'s ratio for adult prices?', a: `The ADA's 2024 study measured an adult ratio only in states with at least a limited adult dental benefit, and it classed Missouri's adult benefit as ${st.adultBenefit.toLowerCase()} care. Missouri's schedule prints the same fee for all ages, so the children's ratio, measured on that schedule, is the closest available measure. The estimator says so next to each result.` },
    { q: 'How much do full dentures cost in Missouri?', a: `A complete upper and lower set is estimated at ${K.usd(dent.charge)} before insurance in Missouri, from the MO HealthNet fees for codes D5110 and D5120. A dental plan that treats dentures as major work usually pays about half after its deductible, up to its yearly maximum, which a full set can exceed on its own.` },
  ],
  related: ['dental-crown-cost', 'dentures-cost', 'dental-implant-cost', 'medicaid-dental-by-state'],
});
