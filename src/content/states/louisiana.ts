import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = 'louisiana';
const st = K.S(S);
const r = st.ratios;
const e = (id: string) => K.est(S, id);
const usd = (id: string) => K.usd(e(id).charge);
const dent = e('denture_full');
const dentUp = e('denture_upper');
const molar = e('rootcanal_molar');
const wis = e('wisdom4');
const fill = e('filling');
const dentAll = K.spread('denture_full');
const cpi = K.month(K.P.cpiDental.latestPeriod);
const upper = st.fees.D5110;
// Rank of Louisiana's adult ratio among the states that have one (1 = highest).
const adults = K.ADA.states.filter((x) => x.adultCharge).sort((a, b) => b.adultCharge! - a.adultCharge!);
const rank = adults.findIndex((x) => x.code === 'LA') + 1;
const kidPriced = K.PROC_IDS.filter((id) => e(id).ok && e(id).feePop === 'child' && K.PR(id).pop === 'adult').length;

export default defineState({
  slug: S,
  title: 'Dental Costs Louisiana 2026: Dentures and Root Canal Prices',
  description: 'Dental costs in Louisiana for 2026: dentures, root canals, wisdom teeth and fillings estimated from the Louisiana Medicaid dental schedules, with your plan.',
  intro: `Louisiana publishes one dental schedule for patients under 21 and a short one for adult dentures; complete upper and lower dentures are estimated at ${dent.ok ? usd('denture_full') : 'an amount withheld here'}.`,
  resume: `Louisiana's estimates put complete upper and lower dentures at ${dent.ok ? usd('denture_full') : 'an amount withheld here'}, a molar root canal at ${K.usd(molar.charge)}, ${wis.ok ? `four impacted wisdom teeth at ${usd('wisdom4')} ` : ''}and a two-surface filling at ${fill.ok ? usd('filling') : 'an amount withheld here'}, in ${cpi} dollars before insurance. The fees come from the Louisiana Medicaid dental program, which keeps separate schedules: the EPSDT dental program for members under 21, and an adult denture program that lists only exams, X-rays and complete and partial dentures. The ADA's 2024 study placed Louisiana among the states where Medicaid pays closest to dentists' charges, ${K.pct(r.adultCharge!, 1)} for adult care and ${K.pct(r.childCharge!, 1)} for children's care, ${rank > 0 && rank <= 5 ? `the ${rank === 1 ? 'highest' : rank === 2 ? 'second highest' : rank === 3 ? 'third highest' : `${rank}th highest`} adult share in the study` : 'well above the national figures'}. A high share means a short step from fee to estimate. Dentures use the adult schedule; most other work is priced from the EPSDT schedule with the children's ratio.`,
  body: (h) => `
<h2>Two schedules for two groups of patients</h2>
<p>The ${h.ext(st.url, 'Louisiana Medicaid dental fee schedules')} come as one workbook with several sheets. The EPSDT sheet, named after the federal child health benefit, covers members from birth through age 20 and lists the full range of dental codes. The adult denture sheet lists six codes, ${upper?.adult ? `with ${K.usd(upper.adult)} for a complete upper denture against ${K.usd(upper.child ?? 0)} on the EPSDT sheet` : 'exams, X-rays and dentures'}. Other sheets serve adults in certain waiver programs and in intermediate care facilities, with the same fees as the EPSDT sheet for the codes checked; this site does not treat them as the adult schedule.</p>
<p>So an adult root canal, filling or extraction in Louisiana is priced from the EPSDT fee with the EPSDT ratio, a pairing that keeps fee and ratio on the same patients and that the result card names. That is the case for ${K.num(kidPriced)} of the procedures shown on this page. Dentures are the exception, priced from the adult sheet and the adult ratio.</p>
${h.mini('cost', { t: 'Louisiana cost of a procedure with a plan', p: ['pr', 'cv'], d: { sx: S, pr: dent.ok ? 'denture_full' : 'rootcanal_molar' } })}
<h2>What is missing, and why</h2>
<p>Orthodontic codes on the EPSDT sheet carry a maximum fee marked for manual pricing with prior authorization rather than a set fee, so braces have no Louisiana estimate. Crowns, implants and bridges have no fee on either sheet. A checkup cannot be assembled either, since the EPSDT sheet has no fee for the bitewing X-rays the site includes in it. Those gaps are part of the documents, not of the program's coverage, which the member handbook describes.</p>
<p>${dent.ok ? `Among the ${dentAll.n} states that price complete dentures, the median is ${K.usd(dentAll.median)}; Louisiana's ${usd('denture_full')} sits ${dent.charge < dentAll.median ? 'below' : 'above'} it. ` : ''}${dentUp.ok ? `A single arch is estimated at ${usd('denture_upper')}. ` : ''}Louisiana Medicaid members mostly receive dental care through dental benefit managers whose payments are not public. The ${h.a('dentures-cost', 'dentures page')} explains complete, partial and immediate dentures, and the ${h.a('medicaid-dental-by-state', 'Medicaid page')} compares adult benefit levels across states.</p>
`,
  faqs: [
    { q: 'How much do full dentures cost in Louisiana?', a: `${dent.ok ? `Complete upper and lower dentures are estimated at ${usd('denture_full')} in Louisiana before insurance` : 'Complete dentures are not estimated for Louisiana at present'}, in ${cpi} dollars, from the fees of the Louisiana Medicaid adult denture program and the state's adult ratio. A partial denture or a single arch costs less. Extractions before the dentures are separate lines on the treatment plan.` },
    { q: 'Which adult dental services does the Louisiana schedule list?', a: 'The adult denture program sheet of the Louisiana Medicaid fee schedule lists six codes: a comprehensive exam, a full set of X-rays, complete upper and lower dentures, and two partial dentures. Separate sheets serve adults in certain waiver programs and in intermediate care facilities. What a given member can receive is set by the program rules.' },
    { q: 'Why are braces not priced for Louisiana?', a: 'The EPSDT sheet gives orthodontic treatment a maximum fee marked for manual pricing after prior authorization, not a set fee per treatment. The estimate needs a fee that the program pays as listed, so the site leaves braces out for Louisiana rather than treat a ceiling as a typical payment.' },
  ],
  related: ['dentures-cost', 'root-canal-cost', 'medicaid-dental-by-state', 'dental-costs-by-state'],
});
