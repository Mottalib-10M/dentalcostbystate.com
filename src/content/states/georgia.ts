import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const SLUG = 'georgia';
const st = K.S(SLUG);
const r = st.ratios;
const must = (id: string) => { const e = K.est(SLUG, id); if (!e.ok) throw new Error(`${SLUG}: ${id} not priced`); return e; };
const premolar = must('rootcanal_premolar');
const dent = must('denture_full');
const wisdom = must('wisdom4');
const bridge = must('bridge3');
const braces = must('braces_teen');
const fill = must('filling');
const fee = (f: typeof st.fees, c: string) => f[c]?.all ?? f[c]?.adult ?? f[c]?.child ?? 0;
const then = (c: string) => fee(st.fees, c), now = (c: string) => fee(st.feesNow, c);
const step = now('D0120') / then('D0120') - 1;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const nat = K.ADA.national;
const bridgeAll = K.spread('bridge3');

export default defineState({
  slug: SLUG,
  title: 'Dental Costs Georgia 2026: Root Canal, Denture, Bridge Price',
  description: 'Dental costs in Georgia for 2026: root canals, dentures, bridges and braces priced from the Medicaid maximum allowable charges of July 2024, with your plan.',
  intro: `Georgia had no adult Medicaid ratio in the ADA's 2024 study, so its prices rest on the children's ratio; a three-unit bridge comes to ${K.usd(bridge.charge)}.`,
  resume: `A premolar root canal is estimated at ${K.usd(premolar.charge)} in Georgia, a full set of upper and lower dentures at ${K.usd(dent.charge)}, the removal of four impacted wisdom teeth at ${K.usd(wisdom.charge)} and a three-unit bridge at ${K.usd(bridge.charge)}, in ${cpi} dollars before any dental plan. The fees behind them are the maximum allowable charges that Georgia Medicaid prints in Appendix B of its dental services manual. Georgia classed its adult dental benefit as emergency care only in the American Dental Association's 2024 study, which therefore measured no adult ratio there; the children's ratio, ${K.pct(r.childCharge!, 1)} of what dentists charge, is used for every procedure. Georgia's schedule gives one fee per code for all ages, so the same fee and the same ratio serve a teenager's braces and an adult's dentures. Crowns and molar root canals are absent from the appendix and are not priced.`,
  body: (h) => `
<h2>One appendix, rates reset each July</h2>
<p>Georgia does not publish a separate dental spreadsheet. Its fees sit in Appendix B, Maximum Allowable Charges, of the Part II manual for dental services, reissued every quarter; the ${h.ext(st.url, 'current edition')} dates from ${K.day(st.effective)}. The state changes dental rates on July 1, the start of its fiscal year. The edition in force on July 1, 2024 is no longer online, so the base of this page is the ${h.ext(st.url2024!, 'October 2024 edition')}, which carries the rates set that July. Between the two, most fees moved by the same small step: the periodic exam, D0120, went from ${K.usd(then('D0120'))} to ${K.usd(now('D0120'))}, a rise of ${K.pct(step, 1)}, and a full upper denture from ${K.usd(then('D5110'))} to ${K.usd(now('D5110'))}.</p>
<p>The appendix lists several rows for some codes, such as a primary or a permanent tooth, or a first and an additional extraction. The estimate uses the permanent tooth and the first tooth, which is how an adult procedure is billed.</p>
${h.mini('cost', { t: 'A Georgia procedure, with or without a plan', p: ['pr', 'cv'], d: { sx: SLUG, pr: 'bridge3' } })}
<h2>Why the children's ratio is used here</h2>
<p>The ADA measured an adult ratio only in states whose Medicaid program offered adults more than emergency care in 2024. Georgia was not one of them, so the study gives only the children's figures: Medicaid paid ${K.pct(r.childCharge!, 1)} of dentists' charges and ${K.pct(r.childPrivate!, 1)} of what private plans pay, close to the national ${K.pct(nat.childCharge, 1)} for children. Dividing an all-ages fee by a children's ratio assumes that Georgia's program sits about as far below the market for adult work as it does for children's care. That is the main uncertainty of this page, and the reason the estimate should be read as a typical range rather than a figure for a given office.</p>
<p>Across the ${bridgeAll.n} states that price a three-unit bridge, the median estimate is ${K.usd(bridgeAll.median)}; Georgia's ${K.usd(bridge.charge)} is set against it on the ${h.a('dental-bridge-cost', 'bridge page')}. A two-surface filling, at ${K.usd(fill.charge)}, is the kind of basic work most plans pay at a higher share; the ${h.a('dental-insurance-coverage', 'coverage page')} explains the classes.</p>
`,
  faqs: [
    { q: 'How much does a dental bridge cost in Georgia?', a: `A three-unit bridge, one false tooth held by crowns on the two neighboring teeth, is estimated at ${K.usd(bridge.charge)} before insurance in Georgia and about ${K.usd(bridge.allowed)} at a typical network price, in ${cpi} dollars. The estimate starts from the Medicaid maximum allowable charges for the pontic and the two retainer crowns.` },
    { q: 'What do braces cost for a teenager in Georgia?', a: `Comprehensive orthodontic treatment of a teenager, code D8080, is estimated at ${K.usd(braces.charge)} before insurance in Georgia. The Medicaid appendix pays ${K.usd(then('D8080'))} for that code in the July 2024 rates, divided here by the state's children's ratio from the ADA's 2024 study. Records, retainers and extra visits can be billed on top.` },
    { q: 'Why can this site not price a crown in Georgia?', a: 'The estimate needs a Medicaid fee for the crown code, D2740 or D2750, and Georgia\'s Appendix B of maximum allowable charges does not list either. Without that fee there is nothing to divide by the state\'s ratio, and the site does not borrow a fee from another state. Molar root canals are missing for the same reason.' },
  ],
  related: ['dental-bridge-cost', 'braces-cost', 'medicaid-dental-by-state', 'dental-costs-by-state'],
});
