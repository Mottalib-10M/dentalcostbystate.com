import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const SLUG = 'oregon';
const st = K.S(SLUG);
const r = st.ratios;
const must = (id: string) => { const e = K.est(SLUG, id); if (!e.ok) throw new Error(`${SLUG}: ${id} not priced`); return e; };
const crown = must('crown');
const molar = must('rootcanal_molar');
const dent = must('denture_full');
const ext = must('extraction');
const fee = (f: typeof st.fees, c: string) => f[c]?.all ?? f[c]?.adult ?? 0;
const then = (c: string) => fee(st.fees, c), now = (c: string) => fee(st.feesNow, c);
const rise = (c: string) => now(c) / then(c) - 1;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const nat = K.ADA.national;

export default defineState({
  slug: SLUG,
  title: 'Dental Costs Oregon 2026: Crown, Root Canal, Denture Prices',
  description: `Dental costs in Oregon for 2026: crowns, root canals and dentures priced from the Oregon Health Plan's June 2024 fee schedule, before and after a dental plan.`,
  intro: `Oregon's Medicaid program has raised most dental fees since 2024, but the estimate here rests on the June 2024 schedule, the one the ADA's ratios describe; a crown comes to ${K.usd(crown.charge)}.`,
  resume: `A porcelain crown is estimated at ${K.usd(crown.charge)} in Oregon, a molar root canal at ${K.usd(molar.charge)}, a simple extraction at ${K.usd(ext.charge)} and a full set of upper and lower dentures at ${K.usd(dent.charge)}, in ${cpi} dollars before any dental plan. The base is the Oregon Health Plan's medical-dental fee schedule of June 2024, the edition in force when the American Dental Association collected the Medicaid fees behind its 2024 ratios. Those ratios put Oregon among the states where Medicaid paid least compared with the market: ${K.pct(r.adultCharge!, 1)} of what dentists charge adults, against ${K.pct(nat.adultCharge!, 1)} nationally. Dividing a low fee by a low ratio brings the estimate back to a typical charge. Oregon has since raised its fees sharply, which matters to dentists who treat plan members but does not change what an uninsured patient is billed.`,
  body: (h) => `
<h2>Fees that rose after 2024</h2>
<p>Oregon publishes one schedule for medical and dental services, updated every month: the ${h.ext(st.url, 'current edition')} and, for the base of this page, the ${h.ext(st.url2024!, 'June 2024 edition')}, which stayed unchanged through the summer of that year. Comparing the two shows how much the program changed its prices. A molar root canal, code D3330, was paid ${K.usd(then('D3330'))} in 2024 and ${K.usd(now('D3330'))} today; a porcelain crown went from ${K.usd(then('D2740'))} to ${K.usd(now('D2740'))}; a two-surface filling from ${K.usd(then('D2392'))} to ${K.usd(now('D2392'))}. The adult cleaning, D1110, rose ${K.pct(rise('D1110'), 0)}.</p>
<p>Those increases change what the Oregon Health Plan pays a dentist. They do not tell us that private fees rose in the same proportion, and the ADA has not yet measured Oregon's ratio against the new schedule. Dividing the 2026 fees by the 2024 ratio would inflate every estimate, so the site divides the fees the ratio was measured on and carries the result forward with the national price index for dental services, the same way for every state. The table under this text shows both fees side by side.</p>
${h.mini('cost', { t: 'An Oregon procedure with or without a plan', p: ['pr', 'cv'], d: { sx: SLUG, pr: 'rootcanal_molar' } })}
<h2>What the low ratio means for a patient</h2>
<p>In the ADA's figures, Oregon's Medicaid paid adults ${K.pct(r.adultPrivate!, 1)} of what private dental plans pay the same dentists, one of the widest gaps in the country. A wide gap does not mean that dentists in Oregon are expensive; it means the program's 2024 fees sat far below the market. That is why the estimates of this page are well above the Medicaid fees in the table: a crown that Medicaid paid ${K.usd(then('D2740'))} for is estimated at ${K.usd(crown.charge)} as a full fee and ${K.usd(crown.allowed)} at a typical network price.</p>
<p>Most Oregon Health Plan members get their dental care through coordinated care organizations, whose payment rates are not public; the schedule describes the program's fee-for-service side. For a person paying cash or using a private plan, the network price is the figure to set against a dentist's written estimate. The ${h.a('dental-insurance-calculator', 'insurance calculator')} turns such an estimate into the share left after the deductible and the yearly maximum, and the ${h.a('root-canal-cost', 'root canal page')} compares front, premolar and molar teeth across states.</p>
`,
  faqs: [
    { q: 'How much does a root canal cost in Oregon?', a: `A molar root canal is estimated at ${K.usd(molar.charge)} before insurance in Oregon, and about ${K.usd(molar.allowed)} at a typical network price, in ${cpi} dollars. The crown that often follows is billed separately. The figure starts from the June 2024 Oregon Health Plan fee for code D3330, divided by the state's ratio from the ADA's 2024 study.` },
    { q: 'Why does this site use Oregon\'s 2024 fees instead of the 2026 ones?', a: `Because the ratio that turns a Medicaid fee into a typical charge was measured on fees collected through July 2024. Oregon raised many dental fees afterwards, so dividing the new fees by the old ratio would overstate every price. The 2024 estimate is then carried to today with the federal price index for dental services.` },
    { q: 'What do dentures cost in Oregon?', a: `A complete upper and lower set is estimated at ${K.usd(dent.charge)} before insurance, from the Oregon Health Plan fees for codes D5110 and D5120 in June 2024. A single arch costs about half. Extractions, relines and adjustments are billed separately, and a lab's materials can move the final price either way.` },
  ],
  related: ['root-canal-cost', 'dental-crown-cost', 'dental-costs-by-state', 'medicaid-dental-by-state'],
});
