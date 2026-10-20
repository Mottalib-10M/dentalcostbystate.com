import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const SLUG = 'minnesota';
const st = K.S(SLUG);
const r = st.ratios;
const must = (id: string) => { const e = K.est(SLUG, id); if (!e.ok) throw new Error(`${SLUG}: ${id} not priced`); return e; };
const molar = must('rootcanal_molar');
const front = must('rootcanal_front');
const dent = must('denture_full');
const bridge = must('bridge3');
const deep = must('deepclean');
const check = must('checkup');
const base = (c: string) => (st.fees[c]?.all ?? 0) / 1.98;
const cpi = K.month(K.P.cpiDental.latestPeriod);

export default defineState({
  slug: SLUG,
  title: 'Dental Costs Minnesota 2026: Root Canal and Bridge Prices',
  description: `Dental costs in Minnesota for 2026: root canals, bridges, dentures and deep cleanings priced from the state's fee schedule with its printed 98 % add-on.`,
  intro: `Minnesota's fee schedule lists base amounts and says in its header that 98 % must be added to them; the estimates here apply that instruction before anything else.`,
  resume: `In Minnesota a molar root canal is estimated at ${K.usd(molar.charge)}, a three-unit bridge at ${K.usd(bridge.charge)}, a full set of upper and lower dentures at ${K.usd(dent.charge)} and a deep cleaning of all four quadrants at ${K.usd(deep.charge)}, in ${cpi} dollars before any dental plan. A checkup with cleaning and bitewing X-rays comes to ${K.usd(check.charge)}. The figures start from the Minnesota Health Care Programs fee schedule, whose header states that for dental services provided on or after January 1, 2022, an additional 98 % is added to the listed amount to reach the payment. Each listed fee is therefore doubled, less two percent, before it is divided by Minnesota's ratio in the American Dental Association's 2024 study: Medicaid paid ${K.pct(r.adultCharge!, 1)} of what dentists in the state charged adults.`,
  body: (h) => `
<h2>A schedule that must be read with its header</h2>
<p>The ${h.ext(st.url, 'Minnesota Health Care Programs fee schedule')} is a single spreadsheet covering every service the programs pay for, with a "total allowable" for each code. For dental codes that figure is not the payment. The header instructs dentists that an additional 98 % is added to the fee schedule total for services provided since January 1, 2022. A molar root canal listed at ${K.usd(base('D3330'))} is therefore paid about ${K.usd(st.fees.D3330?.all ?? 0)}, and an adult cleaning listed at ${K.usd(base('D1110'))} about ${K.usd(st.fees.D1110?.all ?? 0)}. The site applies this multiplication to every Minnesota code and records the reason on its ${h.a('method', 'method page')}.</p>
<p>Leaving the add-on out would halve every Minnesota estimate and put the state far below its neighbors. With it, Minnesota's 2024 ratio of ${K.pct(r.adultCharge!, 1)} lines up with the fees, and the estimates fall within the range of the other states priced on this site.</p>
<h2>Which codes are priced, and which are not</h2>
<p>The schedule gives each total allowable an effective date. The estimate uses only amounts whose date is on or before July 1, 2024, the point up to which the ADA collected Medicaid fees, so that fee and ratio describe the same time. Several codes qualify: root canals on front, premolar and molar teeth, complete dentures, bridge parts, scaling and root planing, fillings and the checkup codes. A front tooth root canal comes to ${K.usd(front.charge)} against ${K.usd(molar.charge)} for a molar, the difference reflecting the extra canals of a back tooth.</p>
<p>Porcelain crowns are listed "by report" in Minnesota, meaning the program prices each claim on its own, so no crown estimate can be made here; the ${h.a('dental-crown-cost', 'crown page')} gives the states that publish a fee. Orthodontic codes appear at an amount that is not a full-treatment fee and are left out. Extractions carry an effective date after July 2024 and are not estimated either.</p>
${h.mini('cost', { t: 'A Minnesota procedure, before and after your plan', p: ['pr', 'cv'], d: { sx: SLUG, pr: 'bridge3' } })}
<h2>A bridge or a set of dentures with a plan</h2>
<p>Large prosthetic work runs into the yearly maximum of most dental plans quickly. At a typical network price of ${K.usd(bridge.allowed)} for a three-unit bridge, a plan paying half after its deductible would owe far more than a maximum of ${K.usd(K.P.examplePlan.annualMax)}, so the patient carries most of the bill. The estimator above shows the split for your own plan, and the ${h.a('dental-insurance-annual-maximum', 'annual maximum page')} shows how spreading work over two plan years changes it.</p>
`,
  faqs: [
    { q: 'How much is a dental bridge in Minnesota?', a: `A three-unit bridge replacing one tooth, a false tooth plus crowns on the two neighbors, is estimated at ${K.usd(bridge.charge)} before insurance in Minnesota and about ${K.usd(bridge.allowed)} at a typical network price, in ${cpi} dollars. The estimate uses the state's fees for the pontic and the two retainer crowns, with the 98 % add-on its schedule prescribes.` },
    { q: 'Why are Minnesota Medicaid dental fees multiplied by 1.98 here?', a: 'The Minnesota Health Care Programs fee schedule says in its header that an additional 98 % must be added to the listed total for dental services provided on or after January 1, 2022. The listed figure is a base, not the payment. Multiplying by 1.98 gives what the program actually pays, which is what the ADA ratio describes.' },
    { q: 'What does a deep cleaning cost in Minnesota?', a: `Scaling and root planing of all four quadrants, four times code D4341, is estimated at ${K.usd(deep.charge)} before insurance in Minnesota. Many plans class it as major or basic periodontal work rather than a routine cleaning, so the share they pay is lower than for a checkup. A dentist decides how many quadrants need it.` },
  ],
  related: ['root-canal-cost', 'dental-bridge-cost', 'dentures-cost', 'dental-costs-by-state'],
});
