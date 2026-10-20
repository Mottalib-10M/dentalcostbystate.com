import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { medicaidNow } from '../../lib/data';

const S = 'connecticut';
const st = K.S(S);
const r = st.ratios;
const e = (id: string) => K.est(S, id);
const usd = (id: string) => K.usd(e(id).charge);
const rc = e('rootcanal_molar');
const dent = e('denture_full');
const wis = e('wisdom4');
const check = e('checkup');
const checkNow = medicaidNow(st, 'checkup');
const cpi = K.month(K.P.cpiDental.latestPeriod);
// Adult fees that moved between the edition of January 2024 and today's.
const moved = Object.keys(st.fees).filter((c) => st.feesNow[c]?.adult !== undefined && st.fees[c]?.adult !== undefined && st.feesNow[c].adult !== st.fees[c].adult);
const added = Object.keys(st.feesNow).filter((c) => !st.fees[c]);
const ex = st.fees.D0120;
const exNow = st.feesNow.D0120;
const crownNow = st.feesNow.D2740;
// Procedures whose estimate the outlier screen withholds in Connecticut.
const held = K.PROC_IDS.filter((id) => e(id).outlier).map((id) => K.PR(id).short.toLowerCase());
const heldText = held.length > 1 ? `${held.slice(0, -1).join(', ')} and ${held[held.length - 1]}` : held[0] ?? '';

export default defineState({
  slug: S,
  title: 'Dental Costs Connecticut 2026: Root Canal and Denture Prices',
  description: 'Dental costs in Connecticut for 2026: root canals, dentures, extractions and checkups estimated from the HUSKY Health fee schedule, and what changed since 2024.',
  intro: `Connecticut's Medicaid dental schedule has changed several times since 2024; the estimates use its January 2024 edition, which puts a molar root canal at ${K.usd(rc.charge)}.`,
  resume: `A molar root canal is estimated at ${K.usd(rc.charge)} in Connecticut, ${dent.ok ? `complete upper and lower dentures at ${usd('denture_full')}, ` : ''}${wis.ok ? `the removal of four impacted wisdom teeth at ${usd('wisdom4')} ` : ''}and a checkup with cleaning and bitewing X-rays at ${check.ok ? usd('checkup') : 'the amount in the table below'}, in ${cpi} dollars before insurance. The figures divide the fees of HUSKY Health, the state's Medicaid and children's health program, by Connecticut's ratios from the ADA's 2024 study: Medicaid paid ${K.pct(r.adultCharge!, 1)} of what dentists charged for adult care and ${K.pct(r.childCharge!, 1)} for children's care, one of the widest gaps between the two groups in the data. The schedule used is the edition of January 1, 2024, the one posted in July 2024 when the ADA collected its fees. Connecticut has revised its schedule since then, and the table below shows today's fee beside the 2024 one for every procedure.`,
  body: (h) => `
<h2>Two columns that are converging</h2>
<p>The HUSKY Health schedule, published by the ${h.ext(st.url, 'Connecticut Dental Health Partnership')}, the administrator the state's social services department contracts for dental care, prints an adult column for members 21 and over and a children's column for those under 21. In the January 2024 edition the children's fee was often about half again as high as the adult fee for the same code: a periodic exam paid ${K.usd(ex?.adult ?? 0)} for an adult and ${K.usd(ex?.child ?? 0)} for a child. That pattern matches the two ADA ratios, which put adult pay much further below dentists' charges than children's pay.</p>
<p>Since then the state has raised some adult fees to the children's level. In the edition read for this site the periodic exam pays ${K.usd(exNow?.adult ?? 0)} for adults as well as children, and ${moved.length === 1 ? 'one adult fee among the codes used here has' : `${K.num(moved.length)} adult fees among the codes used here have`} moved since January 2024. A checkup that Medicaid paid ${K.usd(check.medicaid)} for in 2024 now pays ${checkNow === null ? 'an amount the schedule no longer lists in full' : K.usd(checkNow)}. The estimates do not follow those increases, because the 2024 ratio was measured on the 2024 fees.</p>
${h.table(['CDT code', 'Adult fee, January 2024', 'Adult fee today'], moved.map((c) => [c, K.usd(st.fees[c].adult!), K.usd(st.feesNow[c].adult!)]), 'HUSKY Health dental fee schedule, adult column, codes used by this site whose fee changed.', ['l', 'r', 'r'])}
${h.mini('cost', { t: 'A Connecticut procedure with your plan', p: ['pr', 'cv'], d: { sx: S, pr: 'rootcanal_molar' } })}
<h2>What the site cannot price in Connecticut</h2>
<p>${crownNow && added.includes('D2740') ? `A porcelain crown, code D2740, appears in the current schedule at ${K.usd(crownNow.adult ?? 0)} for adults but was not in the January 2024 edition, so there is no 2024 fee to divide and no crown estimate.` : 'A porcelain crown has no fee in the 2024 edition, so it has no estimate here.'} Implants and fixed bridges are not in either edition. ${held.length ? `The site's outlier screen also withholds ${heldText}: the Connecticut fees give estimates far from those of the other states, a sign that the program pays ${held.length === 1 ? 'that work' : 'them'} on another basis.` : 'Every other procedure whose codes the 2024 edition lists passes the outlier screen.'} The ${h.a('dental-costs-by-state', 'state comparison')} lists which procedures each state allows.</p>
<p>For what remains, the result card names the schedule and the codes used. The ${h.a('dentures-cost', 'dentures page')} compares complete and partial dentures across states, and the ${h.a('wisdom-teeth-removal-cost', 'wisdom teeth page')} explains why four impacted teeth cost far more than four simple extractions.</p>
`,
  faqs: [
    { q: 'How much do dentures cost in Connecticut?', a: `Complete upper and lower dentures are estimated at ${dent.ok ? usd('denture_full') : 'an amount this site withholds'} in Connecticut before insurance, in ${cpi} dollars, from the HUSKY Health fees of January 2024 and the state's adult ratio. A single arch costs about half. Extractions, relines and adjustments after delivery are billed separately when needed.` },
    { q: 'Did Connecticut raise its Medicaid dental fees after 2024?', a: `Yes, for some codes. Revisions through October 2026 raised several adult fees, among them the periodic exam and the adult cleaning, to the children's level, and added a porcelain crown fee. This site's estimates still divide the January 2024 fees, because the ADA ratios they rely on were measured on fees of that year.` },
    { q: 'Why is a crown not priced for Connecticut?', a: `The estimate needs the fee in force on July 1, 2024, and the HUSKY Health edition of that time listed no fee for a porcelain crown. The current schedule does list one, but dividing a 2026 fee by a 2024 ratio would mix two different years, so the site leaves the crown out for Connecticut.` },
  ],
  related: ['dentures-cost', 'wisdom-teeth-removal-cost', 'root-canal-cost', 'medicaid-dental-by-state'],
});
