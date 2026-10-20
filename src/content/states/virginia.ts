import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const SLUG = 'virginia';
const st = K.S(SLUG);
const r = st.ratios;
const must = (id: string) => { const e = K.est(SLUG, id); if (!e.ok) throw new Error(`${SLUG}: ${id} not priced`); return e; };
const crown = must('crown');
const molar = must('rootcanal_molar');
const bridge = must('bridge3');
const veneer = must('veneer');
const braces = must('braces_teen');
const dent = must('denture_full');
const fee = (c: string) => st.fees[c]?.all ?? 0;
const nat = K.ADA.national;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const EX = K.P.examplePlan;
const pv = K.plan({ charge: veneer.charge, allowed: veneer.allowed, insured: true, inNetwork: true, planShare: K.shareOf('veneer', 'auto'), deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: 0, nextYearDeductible: 0 });
const pbr = K.plan({ charge: bridge.charge, allowed: bridge.allowed, insured: true, inNetwork: true, planShare: K.shareOf('bridge3', 'auto'), deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: EX.annualMax, nextYearDeductible: EX.deductible });

export default defineState({
  slug: SLUG,
  title: 'Dental Costs Virginia 2026: Crown, Bridge and Veneer Prices',
  description: `Dental costs in Virginia for 2026: crowns, bridges, veneers, root canals and braces estimated from the Cardinal Care Smiles fee schedule of July 1, 2024.`,
  intro: `Virginia's dental fee schedule took effect on July 1, 2024, the very month the ADA's Medicaid fee collection closed, and is still the one posted; a crown comes to ${K.usd(crown.charge)}.`,
  resume: `A porcelain crown is estimated at ${K.usd(crown.charge)} in Virginia, a molar root canal at ${K.usd(molar.charge)}, a three-unit bridge at ${K.usd(bridge.charge)}, a porcelain veneer at ${K.usd(veneer.charge)}, comprehensive braces for a teenager at ${K.usd(braces.charge)} and a full set of dentures at ${K.usd(dent.charge)}, in ${cpi} dollars before any dental plan. The base is the schedule of allowable fees of Cardinal Care Smiles, the dental program of Virginia Medicaid and FAMIS, effective July 1, 2024. No later schedule has been published, so the same document gives both the base of the estimate and today's fees. The American Dental Association's 2024 study found that Virginia's program paid ${K.pct(r.adultCharge!, 1)} of what the state's dentists charge adults, well above the national ${K.pct(nat.adultCharge!, 1)}, so each estimate is a short step from the program's own fee.`,
  body: (h) => `
<h2>A schedule dated to the month</h2>
<p>The fee schedule behind every Virginia figure is ${h.ext(st.url, 'Attachment A-1, Cardinal Care Smiles schedule of allowable fees')}, footed "07.01.24". The date matters for the method of this site: the ADA collected Medicaid fees through July 2024, and Virginia's ratio was therefore measured on this very schedule. Nothing has to be reconstructed from archives, and no code had to be dropped for a later rate change. One column gives one fee per code, without separating adults and children; the program's reference manual, not the schedule, sets who is covered for what.</p>
<p>The schedule lists several kinds of work that many states leave out: the pontic and retainer crowns of a fixed bridge, at ${K.usd(fee('D6240'))} each, and a laboratory porcelain veneer at ${K.usd(fee('D2962'))}. Listing a fee does not mean the program covers the work for every member, but it is enough to estimate what the work costs a private patient.</p>
${h.mini('cost', { t: 'A Virginia procedure with or without a plan', p: ['pr', 'cv'], d: { sx: SLUG, pr: 'bridge3' } })}
<h2>Bridges and veneers with a dental plan</h2>
<p>The two procedures fall at opposite ends of a plan's rules. A bridge is major work: at a Virginia network price of ${K.usd(bridge.allowed)}, the example plan pays ${K.usd(pbr.planPays)} in one plan year, held back by its ${K.usd(EX.annualMax)} maximum, and up to ${K.usd(pbr.stagedExtra)} more if part of the work can wait until the plan year renews. A veneer is cosmetic, and plans usually pay nothing toward it: the patient keeps the whole ${K.usd(pv.youPay)} of the network price. The ${h.a('veneers-cost', 'veneers page')} and the ${h.a('dental-bridge-cost', 'bridge page')} compare these with other states.</p>
<p>Virginia's adult dental benefit, which the ADA classed as ${st.adultBenefit.toLowerCase()} in 2024, does not change what a dentist charges a patient outside the program. For that patient, the full fee is the figure to compare with a written estimate, and the network price is the one to use when the office is in the plan's network. The ${h.a('dental-insurance-calculator', 'insurance calculator')} runs a quote through your own deductible, share and maximum.</p>
`,
  faqs: [
    { q: 'How much is a dental bridge in Virginia?', a: `A three-unit bridge replacing one tooth is estimated at ${K.usd(bridge.charge)} before insurance in Virginia and about ${K.usd(bridge.allowed)} at a typical network price, in ${cpi} dollars. The estimate adds the program's fees for the false tooth and the two crowns that hold it, codes D6240 and D6750, and divides them by Virginia's ratio from the ADA's 2024 study.` },
    { q: 'What do veneers cost in Virginia?', a: `A laboratory porcelain veneer is estimated at ${K.usd(veneer.charge)} per tooth before insurance in Virginia, from the program's fee for code D2962. Dental plans usually treat veneers as cosmetic and pay nothing, so the whole price falls to the patient. Several veneers are often placed together, multiplying the bill by the number of teeth.` },
    { q: 'Which Virginia fee schedule does this site use?', a: 'The Cardinal Care Smiles schedule of allowable fees effective July 1, 2024, published by the state Medicaid agency and still the latest one posted. Because the ADA collected Medicaid fees through July 2024, its Virginia ratio describes this same schedule, so the estimate needs no older edition and no code had to be left out.' },
  ],
  related: ['dental-bridge-cost', 'veneers-cost', 'dental-crown-cost', 'dental-insurance-calculator'],
});
