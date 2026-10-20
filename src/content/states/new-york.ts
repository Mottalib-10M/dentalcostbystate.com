import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const SLUG = 'new-york';
const st = K.S(SLUG);
const r = st.ratios;
const must = (id: string) => { const e = K.est(SLUG, id); if (!e.ok) throw new Error(`${SLUG}: ${id} not priced`); return e; };
const imp = must('implant');
const crown = must('crown');
const braces = must('braces_teen');
const wisdom = must('wisdom4');
const bridge = must('bridge3');
const impAll = K.spread('implant');
const EX = K.P.examplePlan;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const nat = K.ADA.national;
const pi = K.plan({ charge: imp.charge, allowed: imp.allowed, insured: true, inNetwork: true, planShare: K.shareOf('implant', 'auto'), deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: 0, nextYearDeductible: 0 });
const diff = imp.charge - bridge.charge;

export default defineState({
  slug: SLUG,
  title: 'Dental Costs New York 2026: Implant, Crown and Braces Prices',
  description: `Dental costs in New York for 2026: implants, crowns, braces and wisdom teeth priced from the state's own Medicaid fee schedule, with what a dental plan pays.`,
  intro: `New York's Medicaid schedule lists the implant body, the abutment and the implant crown, so a full implant can be priced here: about ${K.usd(imp.charge)} before insurance.`,
  resume: `A single implant with abutment and crown is estimated at ${K.usd(imp.charge)} in New York, a three-unit bridge at ${K.usd(bridge.charge)}, a porcelain crown at ${K.usd(crown.charge)}, comprehensive braces for a teenager at ${K.usd(braces.charge)} and the removal of four impacted wisdom teeth at ${K.usd(wisdom.charge)}, in ${cpi} dollars before any dental plan. The base is the New York State Medicaid dental fee schedule in force on July 1, 2024, the archived edition effective January 31, 2024, whose fees match today's for every code used here. In the American Dental Association's 2024 study, New York's Medicaid paid ${K.pct(r.adultCharge!, 1)} of what the state's dentists charge adults, below the national ${K.pct(nat.adultCharge!, 1)}, so each fee is divided by a small share and the estimates land well above the Medicaid amounts.`,
  body: (h) => `
<h2>An implant priced from a public schedule</h2>
<p>Few state Medicaid programs publish a fee for an implant; New York does. Its ${h.ext(st.url2024!, '2024 dental fee schedule')} lists code D6010 for the implant body, a custom abutment and an implant crown, which together the program paid ${K.usd(imp.medicaid)} for. Divided by New York's adult ratio and carried to ${cpi} with the dental price index, that gives ${K.usd(imp.charge)} as a typical full fee and ${K.usd(imp.allowed)} at a typical network price. Across the ${impAll.n === 1 ? 'one state' : `${impAll.n} states`} that can be priced, the median is ${K.usd(impAll.median)}.</p>
<p>The implant is also the clearest case of a plan's yearly maximum at work. With the Covered California example, half of the network price after a ${K.usd(EX.deductible)} deductible would exceed a ${K.usd(EX.annualMax)} maximum, so the plan pays ${K.usd(pi.planPays)} and leaves ${K.usd(pi.youPay)} to the patient. A three-unit bridge costs ${K.usd(Math.abs(diff))} ${diff > 0 ? 'less' : 'more'} as a full fee in the state; the ${h.a('implant-vs-bridge', 'implant or bridge page')} puts the two bills side by side without judging which suits a mouth.</p>
${h.mini('versus', { t: 'Implant or bridge in New York: the two bills', p: ['cv'], d: { sx: SLUG } })}
<h2>Age limits printed in the schedule</h2>
<p>The ${h.ext(st.url, 'current eMedNY schedule')} carries minimum and maximum ages for many codes, which say whom the program pays for, not what a dentist may charge. Complete dentures are listed from age 18, bridges and partial dentures from 15, and orthodontic codes from 5 to 20, so New York's braces fee describes treatment of a young patient; the estimate for teen braces divides it by the state's children's ratio of ${K.pct(r.childCharge!, 1)}. Adult braces use code D8090, which the same schedule pays at the same amount as D8080.</p>
<p>Most New York Medicaid members are enrolled in managed care plans whose dental rates are not public; the fee schedule is the program's fee-for-service side, the one the ADA measured. For a private patient, the figure to compare with a dentist's written estimate is the network price when the office is in the plan's network, and the full fee otherwise. The ${h.a('braces-cost', 'braces page')} and the ${h.a('wisdom-teeth-removal-cost', 'wisdom teeth page')} compare New York with the other states.</p>
`,
  faqs: [
    { q: 'How much does a dental implant cost in New York?', a: `About ${K.usd(imp.charge)} for one implant with its abutment and crown, before insurance, in ${cpi} dollars, and roughly ${K.usd(imp.allowed)} at a typical network price. The estimate starts from the New York State Medicaid fees for the three codes in 2024. Extractions, bone grafts, scans and sedation are billed separately when they are needed.` },
    { q: 'What do braces cost in New York?', a: `Comprehensive treatment of a teenager is estimated at ${K.usd(braces.charge)} before insurance in New York, from the Medicaid fee for code D8080 divided by the state's children's ratio. Many plans pay a share of orthodontics only up to a separate lifetime maximum, and some pay nothing for adults. The estimator shows both cases.` },
    { q: 'How much is wisdom teeth removal in New York?', a: `Removing four impacted wisdom teeth embedded in bone is estimated at ${K.usd(wisdom.charge)} before insurance in New York, four times code D7240. Sedation, an exam and X-rays are billed on top. Teeth that have erupted or are only partly covered by bone are billed under cheaper codes, so the real bill depends on what the X-ray shows.` },
  ],
  related: ['dental-implant-cost', 'implant-vs-bridge', 'braces-cost', 'wisdom-teeth-removal-cost'],
});
