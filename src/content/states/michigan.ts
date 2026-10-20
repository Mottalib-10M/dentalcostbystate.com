import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const SLUG = 'michigan';
const st = K.S(SLUG);
const r = st.ratios;
const must = (id: string) => { const e = K.est(SLUG, id); if (!e.ok) throw new Error(`${SLUG}: ${id} not priced`); return e; };
const crown = must('crown');
const molar = must('rootcanal_molar');
const dent = must('denture_full');
const upper = must('denture_upper');
const wisdom = must('wisdom4');
const fill = must('filling');
const check = must('checkup');
const f24 = (c: string) => st.fees[c]?.all ?? 0;
const fNow = (c: string) => st.feesNow[c]?.all ?? 0;
const nat = K.ADA.national;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const EX = K.P.examplePlan;
const toMax = Math.ceil(EX.annualMax / (crown.allowed * (1 - EX.memberShare.major)));
const pf = K.plan({ charge: fill.charge, allowed: fill.allowed, insured: true, inNetwork: true, planShare: K.shareOf('filling', 'auto'), deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: 0, nextYearDeductible: 0 });

export default defineState({
  slug: SLUG,
  title: 'Dental Costs Michigan 2026: Crown, Denture, Filling Prices',
  description: `Dental costs in Michigan for 2026: crowns, root canals, dentures, fillings and checkups priced from the state's January 2024 Medicaid dental fee schedule.`,
  intro: `Michigan's Medicaid pays dentists about half of what they charge, a high share, so its fees sit close to the market; a two-surface filling comes to ${K.usd(fill.charge)}.`,
  resume: `In Michigan a two-surface tooth-colored filling is estimated at ${K.usd(fill.charge)}, a checkup with cleaning and bitewing X-rays at ${K.usd(check.charge)}, a porcelain crown at ${K.usd(crown.charge)}, a molar root canal at ${K.usd(molar.charge)} and a full set of upper and lower dentures at ${K.usd(dent.charge)}, in ${cpi} dollars before any dental plan. The base is the Michigan Department of Health and Human Services dental fee schedule of January 2024, the edition in force on July 1, 2024. In the American Dental Association's 2024 study, Michigan's Medicaid paid ${K.pct(r.adultCharge!, 1)} of what the state's dentists charge adults and ${K.pct(r.adultPrivate!, 1)} of what private plans pay them, both far above the national figures of ${K.pct(nat.adultCharge!, 1)} and ${K.pct(nat.adultPrivate!, 1)}. Its fees therefore need only a small adjustment to reach a typical charge.`,
  body: (h) => `
<h2>Two editions of the Michigan schedule</h2>
<p>The state publishes a new dental fee schedule every January, sometimes with a spring revision. The estimate divides the ${h.ext(st.url2024!, 'January 2024 edition')}, which was still in force in July 2024, and the page's table also shows the ${h.ext(st.url, 'January 2026 edition')}. Between the two, most fees moved up moderately: a porcelain crown from ${K.usd(f24('D2740'))} to ${K.usd(fNow('D2740'))}, a molar root canal from ${K.usd(f24('D3330'))} to ${K.usd(fNow('D3330'))}, an adult cleaning from ${K.usd(f24('D1110'))} to ${K.usd(fNow('D1110'))}. Complete dentures stayed almost where they were.</p>
<p>The schedule notes that implant, bridge and orthodontic codes are covered only for Children's Special Health Care Services, and they carry no rate in the file, so those procedures are not priced for Michigan. The ${h.a('dental-implant-cost', 'implant page')} lists the states that can be priced.</p>
${h.mini('cost', { t: 'A Michigan procedure with your plan', p: ['pr', 'cv'], d: { sx: SLUG, pr: 'filling' } })}
<h2>Everyday work and dentures</h2>
<p>Small, frequent treatments are where a plan's classes matter most. With the example plan, which pays ${K.pct(1 - EX.memberShare.basic, 0)} of basic work after the deductible, a filling at the Michigan network price of ${K.usd(fill.allowed)} leaves ${K.usd(pf.youPay)} to the patient when the deductible is still due. A checkup is usually paid in full in network. The ${h.a('cavity-filling-cost', 'filling page')} and the ${h.a('teeth-cleaning-cost', 'cleaning page')} compare these amounts across states.</p>
<p>At the other end, a complete denture for one arch is estimated at ${K.usd(upper.charge)} and both arches at ${K.usd(dent.charge)}; removing four impacted wisdom teeth comes to ${K.usd(wisdom.charge)}. Michigan's high ratio keeps these figures close to the Medicaid fees themselves. Children are mostly served through a separate managed program, so the schedule mainly describes adult fee-for-service care, which is the side the ADA measured for adults.</p>
<p>A crown is the case where the plan's classes and its yearly maximum meet. At a network price of ${K.usd(crown.allowed)}, a plan paying ${K.pct(1 - EX.memberShare.major, 0)} of major work stays under a ${K.usd(EX.annualMax)} maximum for one tooth, but ${K.num(toMax)} crowns in the same plan year would reach it. When several teeth need work, the order and the timing of the visits change the patient's share, which the ${h.a('dental-insurance-annual-maximum', 'annual maximum calculator')} lays out year by year.</p>
`,
  faqs: [
    { q: 'How much does a filling cost in Michigan?', a: `A two-surface tooth-colored filling on a back tooth is estimated at ${K.usd(fill.charge)} before insurance in Michigan and about ${K.usd(fill.allowed)} at a typical network price, in ${cpi} dollars. It starts from the Michigan Medicaid fee for code D2392 in January 2024. Larger fillings with more surfaces cost more, and a front tooth uses other codes.` },
    { q: 'What do dentures cost in Michigan?', a: `A complete denture for one arch is estimated at ${K.usd(upper.charge)} and a full upper and lower set at ${K.usd(dent.charge)} before insurance in Michigan. The figures come from the state's January 2024 Medicaid fees for codes D5110 and D5120. Extractions, relines and later adjustments are billed separately when they are needed.` },
    { q: 'Why are Michigan\'s estimates close to its Medicaid fees?', a: `Because the ADA's 2024 study found that Michigan's Medicaid paid ${K.pct(r.adultCharge!, 1)} of what dentists in the state charge adults, one of the higher shares in the country. The estimate divides each fee by that share, so a high share means a small step from the Medicaid fee to the typical charge.` },
  ],
  related: ['cavity-filling-cost', 'dentures-cost', 'teeth-cleaning-cost', 'dental-costs-by-state'],
});
