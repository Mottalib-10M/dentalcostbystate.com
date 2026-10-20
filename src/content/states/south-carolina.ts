import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const SLUG = 'south-carolina';
const st = K.S(SLUG);
const r = st.ratios;
const must = (id: string) => { const e = K.est(SLUG, id); if (!e.ok) throw new Error(`${SLUG}: ${id} not priced`); return e; };
const molar = must('rootcanal_molar');
const front = must('rootcanal_front');
const dent = must('denture_full');
const wisdom = must('wisdom4');
const simple = must('extraction');
const surg = must('extraction_surgical');
const fill = must('filling');
const chk = must('checkup');
const kid = (c: string) => st.fees[c]?.child ?? st.fees[c]?.all ?? 0;
const ad = (c: string) => st.fees[c]?.adult ?? st.fees[c]?.all ?? 0;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const EX = K.P.examplePlan;
const fp = K.plan({ charge: fill.charge, allowed: fill.allowed, insured: true, inNetwork: true, planShare: K.shareOf('filling', 'auto'), deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: 0, nextYearDeductible: 0 });

export default defineState({
  slug: SLUG,
  title: 'Dental Costs South Carolina 2026: Root Canal, Extraction',
  description: 'Dental costs in South Carolina for 2026: root canals, extractions, wisdom teeth and dentures priced from the SC Medicaid dental fee schedule, with a plan.',
  intro: `South Carolina raised its Medicaid dental rates for children on July 1, 2024, the last month of the ADA's fee collection; a molar root canal is estimated at ${K.usd(molar.charge)}.`,
  resume: `A molar root canal is estimated at ${K.usd(molar.charge)} in South Carolina, a front tooth root canal at ${K.usd(front.charge)}, the removal of four impacted wisdom teeth at ${K.usd(wisdom.charge)}, a full set of dentures at ${K.usd(dent.charge)} and a checkup with cleaning and X-rays at ${K.usd(chk.charge)}, in ${cpi} dollars before any plan. The fees come from the dental fee schedule of the South Carolina Department of Health and Human Services, in the edition updated on July 1, 2024, the day a new set of children's rates took effect. That edition prints a children's column and an adult column for the adult preventive benefit. The ADA's 2024 study classed the state's adult benefit as limited and found that Medicaid paid ${K.pct(r.adultCharge!, 1)} of dentists' charges for adults and ${K.pct(r.childCharge!, 1)} for children.`,
  body: (h) => `
<h2>Rates set on July 1, 2024</h2>
<p>The ${h.ext(st.url2024!, 'South Carolina dental fee schedule updated July 1, 2024')} labels its children's column as the rate set on that day, after a children's rate increase. The ADA collected Medicaid fees through July 2024, so that edition matches the period of its ratios, with one doubt recorded in our notes: if the ADA read South Carolina's fees before the increase took effect, its children's ratio was measured on the older, lower rates, and the children's estimates here would then run high. The ${h.ext(st.url, 'edition of January 1, 2025')} prints the same amounts for every code read here.</p>
<p>The adult column belongs to the adult preventive dental benefit, which carries a yearly cap set by state policy. It lists exams, cleanings, fillings and extractions for adults, but not root canals or dentures, so those are priced from the children's column with the children's ratio.</p>
${h.mini('cost', { t: 'A South Carolina procedure, with or without a plan', p: ['pr', 'cv'], d: { sx: SLUG, pr: 'rootcanal_molar' } })}
<h2>Extractions and wisdom teeth</h2>
<p>A simple extraction, D7140, is paid ${K.usd(ad('D7140'))} for an adult and ${K.usd(kid('D7140'))} for a child in the 2024 schedule; the estimate comes to ${K.usd(simple.charge)}, and a surgical extraction to ${K.usd(surg.charge)}. Four impacted wisdom teeth, the bony removal code times four, come to ${K.usd(wisdom.charge)}, sedation not included. The ${h.a('wisdom-teeth-removal-cost', 'wisdom teeth page')} compares the states.</p>
<h2>Fillings and checkups under a plan</h2>
<p>A two-surface filling on a back tooth is estimated at ${K.usd(fill.charge)}. Plans like the Covered California example pay basic work at ${K.pct(1 - EX.memberShare.basic, 0)} after the deductible, which leaves ${K.usd(fp.youPay)} on the network price if the deductible is still due. Checkups are preventive, paid in full in network by that plan. The ${h.a('dental-insurance-coverage', 'coverage page')} explains the classes.</p>
<p>The schedule was read from an unaltered archived copy of the official file, because the state's site refused our requests; a later notice of the department shows the same exam fee for July 2026, so the rates appear unchanged. Most South Carolina Medicaid members receive dental care through a dental benefits administrator, whose rates are not public; the fees used here are the state's own schedule.</p>
`,
  faqs: [
    { q: 'How much does a root canal cost in South Carolina?', a: `A molar root canal is estimated at ${K.usd(molar.charge)} before insurance and a front tooth at ${K.usd(front.charge)}, in ${cpi} dollars. South Carolina lists root canals in its children's column only, so the estimate divides those fees by the children's ratio of the ADA's 2024 study. The crown that often follows is billed separately.` },
    { q: 'When did South Carolina raise its Medicaid dental rates?', a: `The dental fee schedule updated on July 1, 2024 labels its children's rates as set on that day, following a rate increase for children. The edition of January 1, 2025 prints the same amounts for the codes read on this site. The adult column belongs to the adult preventive benefit, which has a yearly cap.` },
    { q: 'What does a tooth extraction cost in South Carolina?', a: `A simple extraction of an erupted tooth is estimated at ${K.usd(simple.charge)} before insurance, and a surgical extraction at ${K.usd(surg.charge)}, from the state's Medicaid fees divided by its ADA ratio. Plans that follow the Covered California pattern class oral surgery as major work, paid at about half after the deductible.` },
  ],
  related: ['root-canal-cost', 'tooth-extraction-cost', 'wisdom-teeth-removal-cost', 'dental-costs-by-state'],
});
