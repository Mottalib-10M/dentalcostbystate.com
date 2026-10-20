import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const SLUG = 'oklahoma';
const st = K.S(SLUG);
const r = st.ratios;
const must = (id: string) => { const e = K.est(SLUG, id); if (!e.ok) throw new Error(`${SLUG}: ${id} not priced`); return e; };
const crown = must('crown');
const molar = must('rootcanal_molar');
const dent = must('denture_full');
const partial = must('denture_partial');
const chk = must('checkup');
const kid = (c: string) => st.fees[c]?.child ?? st.fees[c]?.all ?? 0;
const ad = (c: string) => st.fees[c]?.adult ?? st.fees[c]?.all ?? 0;
const codes = Object.keys(st.fees);
const childOnly = codes.filter((c) => st.fees[c]?.child && !st.fees[c]?.adult && !st.fees[c]?.all).length;
const nat = K.ADA.national;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const EX = K.P.examplePlan;
const dp = K.plan({ charge: dent.charge, allowed: dent.allowed, insured: true, inNetwork: true, planShare: K.shareOf('denture_full', 'auto'), deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: 0, nextYearDeductible: 0 });

export default defineState({
  slug: SLUG,
  title: 'Dental Costs Oklahoma 2026: Denture, Crown and Root Canal',
  description: 'Dental costs in Oklahoma for 2026: dentures, crowns, root canals and checkups priced from the SoonerCare dental fee schedule, before and after a plan.',
  intro: `SoonerCare prints a children's rate and an adult rate for each dental code; full dentures in Oklahoma are estimated at ${K.usd(dent.charge)} before insurance.`,
  resume: `A full set of upper and lower dentures is estimated at ${K.usd(dent.charge)} in Oklahoma, a partial denture at ${K.usd(partial.charge)}, a porcelain crown at ${K.usd(crown.charge)}, a molar root canal at ${K.usd(molar.charge)} and a checkup with cleaning and X-rays at ${K.usd(chk.charge)}, in ${cpi} dollars before any plan. The fees come from the SoonerCare dental fee schedule of January 1, 2024, in force through 2024, which gives one column for patients up to age 20 and one for adults. The ADA's 2024 study found Oklahoma among the states where Medicaid paid adult dental care relatively well: ${K.pct(r.adultCharge!, 1)} of dentists' charges, against ${K.pct(nat.adultCharge!, 1)} nationally, and ${K.pct(r.adultPrivate!, 1)} of private plan payments. Where the adult column is blank, the children's fee and ratio are used together.`,
  body: (h) => `
<h2>Two columns, and blanks in the adult one</h2>
<p>The ${h.ext(st.url2024!, 'SoonerCare dental fee schedule of January 1, 2024')} lists a children's rate and an adult rate for each code. A blank adult rate means the service is not covered for adults, and ${childOnly} of the ${codes.length} codes read here are in that case, among them crowns and root canals. For those procedures the estimate divides the children's fee by the children's ratio, ${K.pct(r.childCharge!, 1)}, so fee and ratio describe the same patients. Dentures, extractions and cleanings have an adult rate and use the adult ratio.</p>
<p>The ${h.ext(st.url, 'current edition')}, dated ${K.day(st.effective)}, is shown in the price list below as today's Medicaid fee. Most SoonerCare members now receive dental care through managed dental plans, whose rates are not public; the schedule used here is the program's own maximum allowable fees.</p>
${h.mini('cost', { t: 'An Oklahoma procedure, with or without a plan', p: ['pr', 'cv'], d: { sx: SLUG, pr: 'denture_full' } })}
<h2>Dentures: adult and child rates side by side</h2>
<p>For a complete upper denture, code D5110, SoonerCare's 2024 schedule pays ${K.usd(ad('D5110'))} for an adult and ${K.usd(kid('D5110'))} for a child. Divided by the adult ratio and brought to ${cpi}, a full set comes to ${K.usd(dent.charge)}; a cast metal partial denture, ${K.usd(partial.charge)}. Plans class dentures as major work. With the Covered California example, the network price of ${K.usd(dent.allowed)} leaves ${K.usd(dp.youPay)} to the patient, the yearly maximum taking most of the strain. The ${h.a('dentures-cost', 'denture page')} compares states and arch counts.</p>
<h2>Crowns and root canals priced from the children's column</h2>
<p>A porcelain crown, priced from the children's rate of ${K.usd(kid('D2740'))}, comes to ${K.usd(crown.charge)}, and a molar root canal to ${K.usd(molar.charge)}. These describe what Oklahoma dentists typically charge for the codes, whoever the patient; an adult quote from a given office may still differ. The ${h.a('dental-crown-cost', 'crown page')} sets the figure among the other states.</p>
<p>A checkup with a periodic exam, an adult cleaning and bitewing X-rays, all three listed with an adult rate, comes to ${K.usd(chk.charge)} before insurance. In network, plans that follow the Covered California pattern pay preventive care in full and leave the deductible for basic and major work, so the visit usually costs a member nothing.</p>
`,
  faqs: [
    { q: 'How much do dentures cost in Oklahoma?', a: `A complete upper and lower set is estimated at ${K.usd(dent.charge)} before insurance and about ${K.usd(dent.allowed)} at a typical network price, in ${cpi} dollars. A partial denture with a metal framework comes to ${K.usd(partial.charge)}. The estimates divide SoonerCare's adult rates from the 2024 schedule by Oklahoma's adult ratio from the ADA's 2024 study.` },
    { q: 'Does SoonerCare pay the same dental fee for adults and children?', a: `Not always. Its schedule has a column for patients up to age 20 and one for adults, and a blank adult rate means adults are not covered for that service. For a complete upper denture, the 2024 schedule paid ${K.usd(ad('D5110'))} for an adult and ${K.usd(kid('D5110'))} for a child.` },
    { q: 'What does a crown cost in Oklahoma?', a: `About ${K.usd(crown.charge)} for a porcelain crown before insurance, and ${K.usd(crown.allowed)} at a typical network price. Because SoonerCare lists crowns for children only, the estimate uses the children's fee and the children's ratio of the ADA's 2024 study. Plans usually pay crowns as major work, about half after the deductible.` },
  ],
  related: ['dentures-cost', 'dental-crown-cost', 'root-canal-cost', 'dental-costs-by-state'],
});
