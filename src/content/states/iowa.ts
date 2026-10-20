import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const SLUG = 'iowa';
const st = K.S(SLUG);
const r = st.ratios;
const must = (id: string) => { const e = K.est(SLUG, id); if (!e.ok) throw new Error(`${SLUG}: ${id} not priced`); return e; };
const imp = must('implant');
const bridge = must('bridge3');
const wisdom = must('wisdom4');
const deep = must('deepclean');
const surg = must('extraction_surgical');
const priced = K.PROC_IDS.filter((id) => K.est(SLUG, id).ok);
const n24 = Object.keys(st.fees).length, nNow = Object.keys(st.feesNow).length;
const fee = (c: string) => st.fees[c]?.all ?? st.fees[c]?.adult ?? 0;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const EX = K.P.examplePlan;
const ip = K.plan({ charge: imp.charge, allowed: imp.allowed, insured: true, inNetwork: true, planShare: K.shareOf('implant', 'auto'), deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: EX.annualMax, nextYearDeductible: EX.deductible });

export default defineState({
  slug: SLUG,
  title: 'Dental Costs Iowa 2026: Implant, Bridge and Wisdom Teeth',
  description: 'Dental costs in Iowa for 2026: implants, bridges, wisdom teeth and deep cleaning priced from the Iowa Medicaid dentist fee schedule, with your dental plan.',
  intro: `Iowa's Medicaid schedule lists implants, so a single implant can be priced here: ${K.usd(imp.charge)} with its abutment and crown, before insurance.`,
  resume: `A single implant with its abutment and crown is estimated at ${K.usd(imp.charge)} in Iowa, a three-unit bridge at ${K.usd(bridge.charge)}, the removal of four impacted wisdom teeth at ${K.usd(wisdom.charge)} and a deep cleaning of the whole mouth at ${K.usd(deep.charge)}, in ${cpi} dollars before any plan. The base is Iowa Medicaid's fee schedule for dentists, published as an open file that only shows the rates in force today. Rates that took effect after July 1, 2024 cannot be traced back to that date, so this site uses only the ${n24} codes whose current rate already applied then. That leaves out crowns, fillings and checkups, whose Iowa rates were raised in 2025 and 2026, but keeps the surgical and replacement work. The ADA's 2024 study found that Iowa Medicaid paid ${K.pct(r.adultCharge!, 1)} of what dentists charge adults.`,
  body: (h) => `
<h2>An open file with dates on every row</h2>
<p>Iowa publishes its ${h.ext(st.url, 'Medicaid fee schedule for dentists')} as a data file, one row per code with the date its rate took effect. Of the ${nNow} codes this site reads there, the diagnostic and preventive ones carry a rate from March 2026, after an increase for that group of services, and most restorative and prosthetic ones a rate from July 2025. Periodontal, surgical, implant and bridge codes keep older dates. Because the ADA's ratios describe Medicaid fees collected through July 2024, only rows dated on or before July 1, 2024 can be used: ${n24} codes, enough to price ${priced.length} of the procedures on this site.</p>
<p>That is why the Iowa price list below has no crown, filling or checkup. The rates exist, but their 2024 level is not in the file, and the site does not guess it.</p>
${h.mini('cost', { t: 'An Iowa procedure, with or without a plan', p: ['pr', 'cv'], d: { sx: SLUG, pr: 'implant' } })}
<h2>Implants and bridges side by side</h2>
<p>The implant estimate adds the implant body, code D6010, paid ${K.usd(fee('D6010'))} by Iowa Medicaid, a custom abutment and a porcelain crown on the implant. A bridge of three units, one false tooth and two supporting crowns, comes to ${K.usd(bridge.charge)}. With a plan like the Covered California example, the implant's network price of ${K.usd(imp.allowed)} runs into the ${K.usd(EX.annualMax)} yearly maximum, leaving ${K.usd(ip.youPay)} to the patient in one plan year. The ${h.a('implant-vs-bridge', 'implant or bridge page')} compares the two bills, never their clinical merits, which only a dentist can weigh.</p>
<h2>Surgery and gum treatment</h2>
<p>A surgical extraction of an erupted tooth is estimated at ${K.usd(surg.charge)} and four impacted wisdom teeth at ${K.usd(wisdom.charge)}, sedation not included. Deep cleaning, scaling and root planing in all four quadrants, comes to ${K.usd(deep.charge)}. Most Iowa Medicaid members receive dental care through managed dental plans whose rates are not public; the schedule used here is the fee-for-service one.</p>
`,
  faqs: [
    { q: 'How much does a dental implant cost in Iowa?', a: `About ${K.usd(imp.charge)} for one implant with its abutment and crown, before insurance, in ${cpi} dollars, and about ${K.usd(imp.allowed)} at a typical network price. The estimate divides the Iowa Medicaid fees for the three codes by the state's ratio from the ADA's 2024 study. Extractions, bone grafts and scans are billed separately when needed.` },
    { q: 'Why is there no crown price for Iowa?', a: `Iowa's open fee schedule shows only today's rates, and the crown rate took effect in 2025. Our estimates need the rate in force on July 1, 2024, the period of the ADA ratios, so a code whose rate changed after that date cannot be used. Codes with older rates, such as implants, bridges and oral surgery, are priced.` },
    { q: 'What does wisdom tooth removal cost in Iowa?', a: `Removing four impacted wisdom teeth is estimated at ${K.usd(wisdom.charge)} before insurance, from the Iowa Medicaid fee for code D7240 or D7230 times four. Sedation, X-rays and the consultation are billed on their own. With a plan, oral surgery usually falls in the major class, paid at about half after the deductible.` },
  ],
  related: ['dental-implant-cost', 'implant-vs-bridge', 'wisdom-teeth-removal-cost', 'dental-costs-by-state'],
});
