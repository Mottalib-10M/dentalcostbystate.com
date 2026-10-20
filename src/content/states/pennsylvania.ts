import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const SLUG = 'pennsylvania';
const st = K.S(SLUG);
const r = st.ratios;
const must = (id: string) => { const e = K.est(SLUG, id); if (!e.ok) throw new Error(`${SLUG}: ${id} not priced`); return e; };
const crown = must('crown');
const front = must('rootcanal_front');
const molar = must('rootcanal_molar');
const braces = must('braces_teen');
const dent = must('denture_full');
const wisdom = must('wisdom4');
const fee = (c: string) => st.fees[c]?.all ?? 0;
const nat = K.ADA.national;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const adults = K.ADA.states.filter((x) => x.adultCharge).sort((a, b) => a.adultCharge! - b.adultCharge!);
const rankLow = adults.findIndex((x) => x.code === st.code) + 1;
const ord = (n: number) => `${n}${n % 10 === 1 && n % 100 !== 11 ? 'st' : n % 10 === 2 && n % 100 !== 12 ? 'nd' : n % 10 === 3 && n % 100 !== 13 ? 'rd' : 'th'}`;
const EX = K.P.examplePlan;
const pb = K.plan({ charge: molar.charge + crown.charge, allowed: molar.allowed + crown.allowed, insured: true, inNetwork: true, planShare: K.shareOf('crown', 'auto'), deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: 0, nextYearDeductible: 0 });

export default defineState({
  slug: SLUG,
  title: 'Dental Costs Pennsylvania 2026: Crown and Root Canal Prices',
  description: `Dental costs in Pennsylvania for 2026: crowns, root canals, braces, dentures and wisdom teeth estimated from the Medical Assistance dental fee schedule.`,
  intro: `Pennsylvania pays dentists round, rarely changed Medical Assistance fees that sit low against the market, so its estimates sit well above them; a crown comes to ${K.usd(crown.charge)}.`,
  resume: `A porcelain crown is estimated at ${K.usd(crown.charge)} in Pennsylvania, a molar root canal at ${K.usd(molar.charge)} and a front tooth root canal at ${K.usd(front.charge)}, comprehensive braces for a teenager at ${K.usd(braces.charge)}, four impacted wisdom teeth at ${K.usd(wisdom.charge)} and a full set of dentures at ${K.usd(dent.charge)}, in ${cpi} dollars before any dental plan. The base is the Medical Assistance Program dental fee schedule effective May 28, 2024, in force on July 1, 2024 and identical, for every code used here, to the edition in force today. The American Dental Association's 2024 study found that Pennsylvania's Medicaid paid ${K.pct(r.adultCharge!, 1)} of what the state's dentists charge adults, below the national ${K.pct(nat.adultCharge!, 1)}: the ${rankLow === 1 ? 'lowest' : `${ord(rankLow)} lowest`} share of the ${K.num(adults.length)} states with an adult figure.`,
  body: (h) => `
<h2>Round fees that have not moved</h2>
<p>Pennsylvania's ${h.ext(st.url, 'dental fee schedule')} reads like a price list set by hand: ${K.usd(fee('D2740'))} for a porcelain crown, ${K.usd(fee('D3330'))} for a molar root canal, ${K.usd(fee('D5110'))} for each complete denture, ${K.usd(fee('D8080'))} for comprehensive orthodontic treatment of an adolescent. The ${h.ext(st.url2024!, 'edition attached to the June 2024 bulletin')} gives the same amounts, and so does the October 2023 edition, so the fees the ADA measured are the fees paid today. A simple and a surgical extraction are paid the same amount, ${K.usd(fee('D7140'))}.</p>
<p>Low, stable fees and a low ratio go together. Dividing ${K.usd(fee('D2740'))} by ${K.pct(r.adultCharge!, 1)} and carrying the result to ${cpi} gives ${K.usd(crown.charge)}, well above the Medicaid amount. The same division turns the ${K.usd(fee('D3310'))} paid for a front tooth root canal into ${K.usd(front.charge)} and the ${K.usd(fee('D3330'))} paid for a molar into ${K.usd(molar.charge)}.</p>
${h.mini('cost', { t: 'A Pennsylvania procedure with or without a plan', p: ['pr', 'cv'], d: { sx: SLUG, pr: 'rootcanal_molar' } })}
<h2>A root canal and its crown in one plan year</h2>
<p>A back tooth that needs a root canal usually needs a crown afterwards, and the two together test a plan's yearly maximum. At Pennsylvania network prices of ${K.usd(molar.allowed)} and ${K.usd(crown.allowed)}, the example plan, which pays ${K.pct(1 - EX.memberShare.major, 0)} of major work after a ${K.usd(EX.deductible)} deductible, would pay ${K.usd(pb.planPays)} and leave ${K.usd(pb.youPay)} to the patient${pb.overMax > 0.5 ? `, ${K.usd(pb.overMax)} of its share being lost to the ${K.usd(EX.annualMax)} maximum` : ''}. The ${h.a('root-canal-cost', 'root canal page')} and the ${h.a('dental-crown-cost', 'crown page')} compare each bill with other states.</p>
<p>The schedule also marks which adult services need a benefit limit exception from the program, among them crowns, root canals and scaling and root planing for members 21 and older. That rule concerns Medical Assistance members, not the price a dentist charges others. Codes for implants and fixed bridges are not in the schedule, so neither can be priced for Pennsylvania. Most members are enrolled in managed care, whose rates are not published.</p>
<p>For a patient paying cash, the full fee is the number to hold a written estimate against; for a patient with a plan, the network price is, provided the office belongs to the plan's network. A quote far above either usually includes other codes, such as a core buildup under a crown, X-rays or sedation, which the office can list line by line. The ${h.a('dental-costs-by-state', 'state comparison')} shows how Pennsylvania's estimates compare with its neighbors.</p>
`,
  faqs: [
    { q: 'How much does a root canal cost in Pennsylvania?', a: `A molar root canal is estimated at ${K.usd(molar.charge)} before insurance in Pennsylvania and a front tooth at ${K.usd(front.charge)}, in ${cpi} dollars. The figures divide the Medical Assistance fees for codes D3330 and D3310 by the state's ratio from the ADA's 2024 study. A crown on a back tooth afterwards is a separate bill.` },
    { q: 'What do braces cost in Pennsylvania?', a: `Comprehensive orthodontic treatment of a teenager is estimated at ${K.usd(braces.charge)} before insurance in Pennsylvania, from the Medical Assistance fee for code D8080 divided by the state's children's ratio. The schedule pays that code only for members under 21. Private plans that cover orthodontics usually pay a share up to a lifetime maximum.` },
    { q: 'What does wisdom teeth removal cost in Pennsylvania?', a: `Removing four impacted wisdom teeth embedded in bone is estimated at ${K.usd(wisdom.charge)} before insurance in Pennsylvania, four times code D7240. Sedation, the exam and X-rays are billed on top. Teeth that are less deeply impacted are billed under cheaper codes, so the X-ray decides which code applies to each tooth.` },
  ],
  related: ['root-canal-cost', 'dental-crown-cost', 'braces-cost', 'wisdom-teeth-removal-cost'],
});
