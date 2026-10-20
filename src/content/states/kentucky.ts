import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const SLUG = 'kentucky';
const st = K.S(SLUG);
const r = st.ratios;
const must = (id: string) => { const e = K.est(SLUG, id); if (!e.ok) throw new Error(`${SLUG}: ${id} not priced`); return e; };
const imp = must('implant');
const crown = must('crown');
const molar = must('rootcanal_molar');
const partial = must('denture_partial');
const fill = must('filling');
const deep = must('deepclean');
const url = st.url.split(' ')[0];
const kid = (c: string) => st.fees[c]?.child ?? 0, adult = (c: string) => st.fees[c]?.adult ?? 0;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const impAll = K.spread('implant');
const EX = K.P.examplePlan;
const pr = K.plan({ charge: imp.charge, allowed: imp.allowed, insured: true, inNetwork: true, planShare: K.shareOf('implant', 'auto'), deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: 0, nextYearDeductible: 0 });

export default defineState({
  slug: SLUG,
  title: 'Dental Costs Kentucky 2026: Implant, Crown, Root Canal Price',
  description: 'Dental costs in Kentucky for 2026: implants, crowns, root canals and partial dentures priced from the 2024 Kentucky Medicaid dental schedule, with your plan.',
  intro: `Kentucky's Medicaid schedule prints separate fees for patients under and over 21 and lists the implant codes; a crown is estimated at ${K.usd(crown.charge)}.`,
  resume: `A porcelain crown is estimated at ${K.usd(crown.charge)} in Kentucky, a molar root canal at ${K.usd(molar.charge)}, a partial denture on a metal framework at ${K.usd(partial.charge)} and a single implant with its abutment and crown at ${K.usd(imp.charge)}, in ${cpi} dollars before any dental plan. The fees come from the Kentucky Medicaid dental fee schedule of 2024, which prints one rate for members under 21 and another for adults; the estimator uses the adult column for adult work. The American Dental Association's 2024 study found that Kentucky Medicaid paid ${K.pct(r.adultCharge!, 1)} of what dentists charge adults and ${K.pct(r.adultPrivate!, 1)} of what private plans pay, and classed its adult benefit as ${st.adultBenefit.toLowerCase()}. Dividing the adult fees by those shares gives the typical full fee and the network price. Kentucky is one of the few states whose schedule lets an implant be priced.`,
  body: (h) => `
<h2>Two columns: under 21 and over 21</h2>
<p>The ${h.ext(url, 'Kentucky Medicaid dental fee schedule')}, revised in October 2024, lists each code with an under-21 rate and an over-21 rate, and marks the services not covered for one group or the other. For most of the codes priced here both columns carry the same amount: a porcelain crown, D2740, is ${K.usd(adult('D2740'))} for either age. A few differ. A two-surface filling, D2392, is paid ${K.usd(kid('D2392'))} for a child and ${K.usd(adult('D2392'))} for an adult, and scaling and root planing of one quadrant, D4341, ${K.usd(kid('D4341'))} against ${K.usd(adult('D4341'))}. The adult column feeds the estimates of adult procedures, the adult ratio of the ADA study divides them, and the two stay matched.</p>
<p>The October 2024 revision changed only the wording of one periodontal code; the rates were those in force on July 1, 2024, the month up to which the ADA collected Medicaid fees. A newer edition published in 2026 could not be read from the state's site, so this page does not show today's Medicaid fees.</p>
${h.mini('cost', { t: 'A Kentucky procedure, with or without a plan', p: ['pr', 'cv'], d: { sx: SLUG, pr: 'implant' } })}
<h2>An implant priced from a public schedule</h2>
<p>Most Medicaid programs pay nothing for implants, so their states cannot be priced for one. Kentucky's schedule lists the implant body, D6010, the abutment and the implant crown, which gives an estimate of ${K.usd(imp.charge)} for one tooth before insurance and ${K.usd(imp.allowed)} at a network price. Only ${impAll.n === 1 ? 'one state' : `${impAll.n} states`} can be priced this way, so the figure cannot be compared with a broad median; the ${h.a('dental-implant-cost', 'implant page')} sets the states side by side. With a plan that pays half of major work up to a ${K.usd(EX.annualMax)} yearly maximum, the plan would pay ${K.usd(pr.planPays)} and leave ${K.usd(pr.youPay)} of the network price to the patient.</p>
<p>Smaller work follows the same method: a two-surface filling comes to ${K.usd(fill.charge)} and a full-mouth deep cleaning at ${K.usd(deep.charge)}, both before insurance. A dentist's written estimate, read code by code against the table below, shows where an office stands.</p>
`,
  faqs: [
    { q: 'How much does a dental implant cost in Kentucky?', a: `About ${K.usd(imp.charge)} for one implant with its abutment and crown, before insurance, in ${cpi} dollars. The estimate divides the adult fees of the Kentucky Medicaid schedule for the three implant codes by the state's ratio between Medicaid pay and dentists' charges. Extractions, grafts and scans are billed separately when needed.` },
    { q: 'Does Kentucky Medicaid pay dentists the same for adults and children?', a: `For many codes yes, but not all. The 2024 schedule prints an under-21 and an over-21 rate: a two-surface filling is paid ${K.usd(kid('D2392'))} for a child and ${K.usd(adult('D2392'))} for an adult. Which services an adult member can receive depends on Kentucky Medicaid's own coverage rules, not on this price list.` },
    { q: 'What does a partial denture cost in Kentucky?', a: `A partial denture on a cast metal framework is estimated at ${K.usd(partial.charge)} for one arch before insurance and about ${K.usd(partial.allowed)} at a typical network price. Dental plans usually class dentures as major work, paid at about half after the deductible and within the yearly maximum. Relines and repairs are billed separately.` },
  ],
  related: ['dental-implant-cost', 'dental-crown-cost', 'dentures-cost', 'dental-costs-by-state'],
});
