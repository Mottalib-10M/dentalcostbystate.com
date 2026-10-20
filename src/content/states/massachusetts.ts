import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const st = K.S('massachusetts');
const r = st.ratios;
const imp = K.est('massachusetts', 'implant');
const crown = K.est('massachusetts', 'crown');
const rc = K.est('massachusetts', 'rootcanal_molar');
const dent = K.est('massachusetts', 'denture_full');
const crownAll = K.spread('crown');
const adultCrown = st.fees.D2740?.adult ?? 0;
const kidCrown = st.fees.D2740?.child ?? 0;
const EX = K.P.examplePlan;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const pr = K.plan({ charge: crown.charge, allowed: crown.allowed, insured: true, inNetwork: true, planShare: K.shareOf('crown', 'auto'), deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: 0, nextYearDeductible: 0 });

export default defineState({
  slug: 'massachusetts',
  title: 'Dental Costs Massachusetts 2026: Implant and Crown Prices',
  description: `Dental costs in Massachusetts for 2026: an implant at about ${K.usd(imp.charge)}, a crown at ${K.usd(crown.charge)}, estimated from the MassHealth fee regulation, with your own plan.`,
  intro: `Massachusetts is one of the few states whose Medicaid schedule lists implants, so every major procedure can be priced here; a crown is estimated at ${K.usd(crown.charge)}.`,
  resume: `A single implant with its abutment and crown is estimated at ${K.usd(imp.charge)} in Massachusetts, a porcelain crown at ${K.usd(crown.charge)}, a molar root canal at ${K.usd(rc.charge)} and a full set of upper and lower dentures at ${K.usd(dent.charge)}, in ${cpi} dollars before any insurance. The figures start from the fees MassHealth pays dentists under its rate regulation, 101 CMR 314.00, in force since June 1, 2024, which the American Dental Association's 2024 study found to equal ${K.pct(r.adultCharge!, 1)} of what Massachusetts dentists charge for adult care and ${K.pct(r.adultPrivate!, 1)} of what private plans pay them. Dividing by those shares gives the typical full fee and the network price. With the Covered California example plan, a crown at the network price of ${K.usd(crown.allowed)} leaves ${K.usd(pr.youPay)} to the patient after a ${K.usd(EX.deductible)} deductible and a half share.`,
  body: (h) => `
<h2>The MassHealth regulation behind the prices</h2>
<p>Massachusetts sets the fees of its Medicaid dental program in a regulation rather than a spreadsheet: ${h.ext(st.url, '101 CMR 314.00, Rates for Dental Services')}, adopted in June 2024. It prints two fees for most codes, one for adult members and one for members under 21 covered by the federal child benefit, and the children's fee is often the higher of the two. A porcelain crown, code D2740, is paid ${K.usd(adultCrown)} for an adult and ${K.usd(kidCrown)} for a child. The estimator uses the adult column for adult procedures and the children's column for teenage braces, each with the matching ratio of the ADA study.</p>
<p>Because the regulation was already in force on July 1, 2024, the month up to which the ADA collected Medicaid fees, the same document serves both as the base of the estimate and as today's fee. The state's ratios are close to the national figures for adults: Medicaid paid ${K.pct(r.adultCharge!, 1)} of dentists' charges in Massachusetts against ${K.pct(K.ADA.national.adultCharge!, 1)} nationally, and the ADA classed its adult benefit as ${st.adultBenefit.toLowerCase()}.</p>
${h.mini('cost', { t: 'A procedure in Massachusetts, with or without a plan', p: ['pr', 'cv'], d: { sx: 'massachusetts', pr: 'rootcanal_molar' } })}
<h2>Where Massachusetts sits among the states</h2>
<p>Across the ${crownAll.n} states whose schedules list a porcelain crown, the median estimate is ${K.usd(crownAll.median)}; Massachusetts comes in at ${K.usd(crown.charge)}. Implants are the clearest difference: most Medicaid programs pay nothing for code D6010, so their states cannot be priced, while the MassHealth regulation lists the implant body, the abutment and the implant crown. The ${h.a('dental-implant-cost', 'implant page')} compares the states that can be priced, and the ${h.a('dental-costs-by-state', 'state comparison')} does the same for every procedure.</p>
<p>These are averages for the state. Fees in Boston and its suburbs are likely to differ from those in the western counties, and no public schedule describes that spread, so the estimator gives one figure for the state. A written estimate from a dentist, read code by code against the table below, shows where an office stands.</p>
`,
  faqs: [
    { q: 'How much does a dental implant cost in Massachusetts?', a: `About ${K.usd(imp.charge)} for one implant with its abutment and crown, before insurance, in ${cpi} dollars. The estimate divides the MassHealth fees for codes D6010, D6057 and D6058 by the state's ratio between Medicaid pay and dentists' charges. Extractions, bone grafts and scans are billed on top when needed, and city offices may charge more.` },
    { q: 'Does MassHealth pay dentists the same for adults and children?', a: `Not always. The rate regulation prints a separate fee for members under 21, and for many codes it is higher than the adult fee: a porcelain crown is paid ${K.usd(adultCrown)} for an adult and ${K.usd(kidCrown)} for a child. Which services an adult member can receive is set by MassHealth's own coverage rules.` },
    { q: 'What does a crown cost in Massachusetts with dental insurance?', a: `The estimated network price of a porcelain crown is ${K.usd(crown.allowed)}. A plan that pays half of major work after a ${K.usd(EX.deductible)} deductible, like the Covered California example, would leave about ${K.usd(pr.youPay)} to the patient if its yearly maximum is not yet used. Type your own plan's figures into the estimator above.` },
  ],
  related: ['dental-implant-cost', 'dental-crown-cost', 'dental-costs-by-state', 'medicaid-dental-by-state'],
});
