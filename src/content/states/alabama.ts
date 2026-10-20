import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const SLUG = 'alabama';
const st = K.S(SLUG);
const r = st.ratios;
const must = (id: string) => { const e = K.est(SLUG, id); if (!e.ok) throw new Error(`${SLUG}: ${id} not priced`); return e; };
const braces = must('braces_teen');
const crown = must('crown');
const molar = must('rootcanal_molar');
const dent = must('denture_full');
const bridge = must('bridge3');
const fill = must('filling');
const kidFee = (c: string) => st.fees[c]?.child ?? st.fees[c]?.all ?? 0;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const nat = K.ADA.national;
const EX = K.P.examplePlan;
const kidPlan = K.plan({ charge: braces.charge, allowed: braces.allowed, insured: true, inNetwork: true, planShare: K.shareOf('braces_teen', 'auto'), deductibleLeft: EX.childDeductible, maxLeft: braces.allowed, waitMonths: 0, monthsCovered: 12, nextYearMax: 0, nextYearDeductible: 0 });

export default defineState({
  slug: SLUG,
  title: 'Dental Costs Alabama 2026: Braces, Crown and Denture Prices',
  description: 'Dental costs in Alabama for 2026: braces, crowns, root canals, dentures priced from the Alabama Medicaid dental schedule for children, before and after a plan.',
  intro: `Alabama Medicaid pays dentists for patients under 21 only, so every Alabama estimate is built from children's fees; braces for a teenager come to ${K.usd(braces.charge)}.`,
  resume: `Comprehensive braces for a teenager are estimated at ${K.usd(braces.charge)} in Alabama, a porcelain crown at ${K.usd(crown.charge)}, a molar root canal at ${K.usd(molar.charge)} and a full set of upper and lower dentures at ${K.usd(dent.charge)}, in ${cpi} dollars before any dental plan. The starting point is the Alabama Medicaid dental fee schedule, which lists its amounts for recipients under 21, because the state's Medicaid program generally does not cover adult dental care; the American Dental Association's 2024 study accordingly gives Alabama a ratio for children only. That ratio says the program paid ${K.pct(r.childCharge!, 1)} of what Alabama dentists charge for children's care, above the national ${K.pct(nat.childCharge, 1)}, and ${K.pct(r.childPrivate!, 1)} of what private plans pay. Dividing the children's fees by those shares gives the full fee and the network price, and the same pair prices the adult procedures.`,
  body: (h) => `
<h2>A children's schedule that prices adult work</h2>
<p>The ${h.ext(st.url, 'Alabama Medicaid dental fee schedule')} prints one allowed amount per code, for recipients under 21. Adult dental care is generally outside the program, and the ADA's 2024 study, which classes Alabama's adult benefit as none, has no adult ratio for the state. A crown, a root canal or a denture for an adult is therefore estimated here from the children's fee for the same code divided by the children's ratio, so that the fee and the ratio describe the same patients. The method page explains why that pairing matters.</p>
<p>The base is the edition updated on ${K.day(st.effective2024!)}, which stayed posted until the edition of ${K.day(st.effective)}; for every code read here the two print the same amount. Several codes need prior authorization in the schedule, among them deep cleaning, dentures, bridges, the removal of impacted teeth and comprehensive orthodontics, which says nothing about the price but explains why such work is planned in advance.</p>
${h.mini('cost', { t: 'An Alabama procedure, with or without a plan', p: ['pr', 'cv'], d: { sx: SLUG, pr: 'braces_teen' } })}
<h2>Braces: the orthodontic code Alabama lists</h2>
<p>Comprehensive orthodontic treatment of an adolescent, code D8080, is paid ${K.usd(kidFee('D8080'))} in the schedule. Divided by the children's ratio and carried to ${cpi}, that becomes ${K.usd(braces.charge)} as a typical full fee and ${K.usd(braces.allowed)} at a typical network price. A plan built like the Covered California example pays medically necessary orthodontics for children at half after a ${K.usd(EX.childDeductible)} deductible, which on that network price would leave ${K.usd(kidPlan.youPay)} to the family before any orthodontic limit. The ${h.a('braces-cost', 'braces page')} compares states.</p>
<h2>Bridges and fillings in the same schedule</h2>
<p>Alabama is one of the few schedules read here that lists both the false tooth of a bridge and its two supporting crowns, so a three-unit bridge can be priced: ${K.usd(bridge.charge)} before insurance. At the other end, a two-surface tooth-colored filling on a back tooth comes to ${K.usd(fill.charge)}. The ${h.a('dental-bridge-cost', 'bridge page')} sets the Alabama figure against the other states that list those codes.</p>
<p>These figures describe a typical Alabama office, not a given one. A written estimate lists its CDT codes, and comparing them line by line with the price list below shows whether a quote is in the usual range, or whether it includes work, such as a scan, sedation or a temporary tooth, that the estimate leaves out.</p>
`,
  faqs: [
    { q: 'How much do braces cost in Alabama?', a: `Comprehensive braces for a teenager are estimated at ${K.usd(braces.charge)} before insurance in Alabama, and about ${K.usd(braces.allowed)} at a typical network price, in ${cpi} dollars. The figure divides the Alabama Medicaid fee for code D8080 by the state's children's ratio from the ADA's 2024 study. Records, retainers and follow-up visits may be billed on top.` },
    { q: 'Does Alabama Medicaid cover dental care for adults?', a: 'Its dental fee schedule lists dental benefits for recipients under 21, and adults are generally not covered, which is also how the ADA classed the state in 2024. Coverage rules can change and some situations may differ, so the Alabama Medicaid agency is the place to confirm what an adult can receive. This site only uses the schedule to estimate prices.' },
    { q: 'Why are Alabama adult prices built from children\'s fees?', a: `Because Alabama's schedule and the ADA's ratios exist for children only. Dividing a children's fee by the children's ratio keeps both figures about the same patients; the result estimates what Alabama dentists typically charge for the code, ${K.usd(crown.charge)} for a porcelain crown, whoever the patient is. Fees for adults at a given office may still differ.` },
  ],
  related: ['braces-cost', 'dental-bridge-cost', 'medicaid-dental-by-state', 'dental-costs-by-state'],
});
