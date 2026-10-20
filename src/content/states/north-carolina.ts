import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const SLUG = 'north-carolina';
const st = K.S(SLUG);
const r = st.ratios;
const must = (id: string) => { const e = K.est(SLUG, id); if (!e.ok) throw new Error(`${SLUG}: ${id} not priced`); return e; };
const molar = must('rootcanal_molar');
const front = must('rootcanal_front');
const dent = must('denture_full');
const wisdom = must('wisdom4');
const braces = must('braces_teen');
const chk = must('checkup');
const fee = (f: typeof st.fees, c: string) => f[c]?.all ?? f[c]?.adult ?? 0;
const codes = Object.keys(st.fees);
const same = codes.filter((c) => Math.abs(fee(st.fees, c) - fee(st.feesNow, c)) < 0.01).length;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const nat = K.ADA.national;
const EX = K.P.examplePlan;
const rc = K.plan({ charge: molar.charge, allowed: molar.allowed, insured: true, inNetwork: true, planShare: K.shareOf('rootcanal_molar', 'auto'), deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: 0, nextYearDeductible: 0 });

export default defineState({
  slug: SLUG,
  title: 'Dental Costs North Carolina 2026: Root Canal, Denture Prices',
  description: 'Dental costs in North Carolina for 2026: root canals, dentures, wisdom teeth and braces priced from NC Medicaid dental rates, before and after a plan.',
  intro: `North Carolina's Medicaid dental rates have barely moved since 2024, so the base of the estimate and today's fee agree; a molar root canal comes to ${K.usd(molar.charge)}.`,
  resume: `A molar root canal is estimated at ${K.usd(molar.charge)} in North Carolina, a front tooth root canal at ${K.usd(front.charge)}, a full set of upper and lower dentures at ${K.usd(dent.charge)} and the removal of four impacted wisdom teeth at ${K.usd(wisdom.charge)}, in ${cpi} dollars before any dental plan. The fees come from the general dental rates of NC Medicaid, one amount per code for all ages. The American Dental Association's 2024 study found that the program paid ${K.pct(r.adultCharge!, 1)} of what North Carolina dentists charge adults, a little above the national ${K.pct(nat.adultCharge!, 1)}, and ${K.pct(r.adultPrivate!, 1)} of what private plans pay them. Dividing by those shares gives the typical full fee and the network price. Crowns are not in the general dental file and are not priced here; a checkup with cleaning and X-rays comes to ${K.usd(chk.charge)}.`,
  body: (h) => `
<h2>A schedule that stood still</h2>
<p>NC Medicaid publishes its dental rates on a fee schedule portal, one file per type of dentist. The base of this page is the ${h.ext(st.url2024!, 'general dental file')} posted on July 1, 2024; the ${h.ext(st.url, 'current file')} was revised in April 2026 and dates every rate from ${K.day(st.effective)}. Of the ${codes.length} codes this site reads, ${same} carry the same amount in both editions, the rest differing only by rounding to the cent. A molar root canal, D3330, is ${K.usd(fee(st.feesNow, 'D3330'))} in each.</p>
<p>The current file states that all rates depicted do not contain rate reductions, so it shows the full schedule amounts. Dental care for North Carolina Medicaid members is paid by the program itself, fee for service, rather than through managed care plans. Because the fees did not change, the estimates here move only with the national price index for dental services, which rose ${K.pct(K.cpiChange, 1)} over the last twelve months.</p>
${h.mini('cost', { t: 'A North Carolina procedure, with or without a plan', p: ['pr', 'cv'], d: { sx: SLUG, pr: 'rootcanal_molar' } })}
<h2>Root canals by tooth, and what a plan leaves</h2>
<p>A root canal is priced by the tooth: ${K.usd(front.charge)} for a front tooth, ${K.usd(must('rootcanal_premolar').charge)} for a premolar and ${K.usd(molar.charge)} for a molar. The crown often placed afterwards is billed on its own and cannot be estimated from this schedule. Plans that follow the Covered California pattern class root canals as major work, paid at half after the deductible; at the network price of ${K.usd(molar.allowed)}, a molar root canal leaves ${K.usd(rc.youPay)} to the patient if the yearly maximum is not yet used. The ${h.a('root-canal-cost', 'root canal page')} compares the states.</p>
<p>Comprehensive braces for a teenager, code D8080, come to ${K.usd(braces.charge)} before insurance, from the ${K.usd(fee(st.fees, 'D8080'))} the program pays for that code. The ${h.a('braces-cost', 'braces page')} explains how orthodontic benefits differ from the rest of a plan. Records, retainers and follow-up visits can be billed in addition to the treatment code, so a written orthodontic quote often lists several lines that the estimate does not cover.</p>
`,
  faqs: [
    { q: 'How much is a root canal in North Carolina?', a: `A molar root canal is estimated at ${K.usd(molar.charge)} before insurance, a premolar at ${K.usd(must('rootcanal_premolar').charge)} and a front tooth at ${K.usd(front.charge)}, in ${cpi} dollars. The estimates divide the NC Medicaid rates for codes D3310 to D3330 by the state's ratio from the ADA's 2024 study. A crown placed afterwards is billed separately.` },
    { q: 'Have North Carolina Medicaid dental rates changed since 2024?', a: `Hardly. Of the ${codes.length} codes read for this site, ${same} have the same rate in the July 2024 file and in the file revised in April 2026, and the others differ by rounding only. The current file dates its rates from ${K.day(st.effective)} and states that they do not contain rate reductions.` },
    { q: 'What do full dentures cost in North Carolina?', a: `A complete upper and lower set is estimated at ${K.usd(dent.charge)} before insurance and about ${K.usd(dent.allowed)} at a typical network price. One arch costs about half. The figure starts from the NC Medicaid rates for codes D5110 and D5120; extractions before the dentures and later relines are billed on their own.` },
  ],
  related: ['root-canal-cost', 'dentures-cost', 'wisdom-teeth-removal-cost', 'dental-costs-by-state'],
});
