import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = 'illinois';
const st = K.S(S);
const r = st.ratios;
const e = (id: string) => K.est(S, id);
const usd = (id: string) => K.usd(e(id).charge);
const crown = e('crown');
const front = e('rootcanal_front');
const molar = e('rootcanal_molar');
const br = e('braces_teen');
const dent = e('denture_full');
const crownAll = K.spread('crown');
const cpi = K.month(K.P.cpiDental.latestPeriod);
const EX = K.P.examplePlan;
const pr = crown.ok ? K.plan({ charge: crown.charge, allowed: crown.allowed, insured: true, inNetwork: true, planShare: K.shareOf('crown', 'auto'), deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: 0, nextYearDeductible: 0 }) : null;
// Codes used here whose fee differs between the 2023 edition and today's.
const changed = Object.keys(st.fees).filter((c) => JSON.stringify(st.fees[c]) !== JSON.stringify(st.feesNow[c]));
const crownFee = st.fees.D2740?.adult ?? 0;

export default defineState({
  slug: S,
  title: 'Dental Costs Illinois 2026: Crown, Braces, Root Canal Prices',
  description: 'Dental costs in Illinois for 2026: crowns, braces, root canals and dentures estimated from the HFS dental fee schedule, and what a dental plan leaves you.',
  intro: `Illinois Medicaid fees are among the lowest relative to dentists' charges, and its schedule barely moved between 2023 and 2026; a crown is estimated at ${crown.ok ? usd('crown') : 'an amount withheld here'}.`,
  resume: `In Illinois the estimates put ${crown.ok ? `a porcelain crown at ${usd('crown')}, ` : ''}a root canal on a front tooth at ${K.usd(front.charge)} and on a molar at ${K.usd(molar.charge)}, ${br.ok ? `comprehensive braces for a teenager at ${usd('braces_teen')} ` : ''}and complete dentures for both arches at ${dent.ok ? usd('denture_full') : 'an amount withheld here'}, in ${cpi} dollars before insurance. They divide the fees of the dental program of the Illinois Department of Healthcare and Family Services by the state's ratios from the ADA's 2024 study, which found that Illinois Medicaid paid ${K.pct(r.adultCharge!, 1)} of what dentists charged for adult care and ${K.pct(r.childCharge!, 1)} for children's care, both well under the national figures. The schedule in force on July 1, 2024 was the edition effective January 1, 2023; the agency's archive shows no edition in 2024. For the codes used here, ${changed.length === 0 ? 'its fees are the same as today\'s' : `only ${changed.length === 1 ? 'one fee differs' : `${K.num(changed.length)} fees, all for sedation, differ`} from today's`}.`,
  body: (h) => `
<h2>A schedule with three columns and two ratios</h2>
<p>The ${h.ext(st.url, 'HFS dental program fee schedule')} prints a maximum allowance for children, one for adults and one for pregnant women, the last equal to the adult column for every code this site uses. Many codes are paid at the same amount in both age columns: ${crownFee ? `a porcelain crown pays ${K.usd(crownFee)} whoever the patient is` : 'fillings and extractions pay the same whoever the patient is'}. Others exist for children only. Root canals on premolars and molars, partial dentures and teen orthodontics are among them, so the site prices those from the children's fee with the children's ratio of ${K.pct(r.childCharge!, 1)}, while a root canal on a front tooth, which has an adult fee, uses the adult ratio of ${K.pct(r.adultCharge!, 1)}.</p>
<p>The schedule also flags the codes that need prior approval, crowns and dentures among them. That is a rule for the program's own members and does not enter the estimate, which only uses the fee.</p>
${h.mini('cost', { t: 'Illinois estimate with your plan', p: ['pr', 'cv'], d: { sx: S, pr: crown.ok ? 'crown' : 'rootcanal_front' } })}
<h2>Low fees, low ratio, moderate prices</h2>
<p>A low ratio raises an estimate and a low fee lowers it, and in Illinois the two nearly offset. ${crown.ok ? `The crown estimate of ${usd('crown')} sits ${crown.charge < crownAll.median ? 'below' : 'above'} the median of ${K.usd(crownAll.median)} for the ${crownAll.n} states that price a crown. ` : ''}${pr ? `With a private plan, the network price would be about ${K.usd(crown.allowed)}, and a plan paying half of major work after a ${K.usd(EX.deductible)} deductible would leave ${K.usd(pr.youPay)} to the patient. ` : ''}${e('bridge3').outlier ? 'A three-unit bridge is not shown: the Illinois fees for its codes give an estimate far from the other states, so the outlier screen withholds it.' : ''}</p>
<p>The numbers describe the state as a whole. Chicago offices and those in downstate towns are not separated in any public file, and most Illinois Medicaid members are served by managed care plans whose payments are not published. The ${h.a('braces-cost', 'braces page')} and the ${h.a('dental-crown-cost', 'crown page')} compare Illinois with the other states that price the same work.</p>
`,
  faqs: [
    { q: 'How much does a crown cost in Illinois?', a: `${crown.ok ? `A porcelain crown is estimated at ${usd('crown')} in Illinois before insurance` : 'A crown is not estimated for Illinois at present'}, in ${cpi} dollars, from the HFS fee and the state's adult ratio. The network price a private plan allows is lower. A buildup under the crown, or a root canal before it, is billed on separate lines of the treatment plan.` },
    { q: 'Do Illinois Medicaid fees differ for pregnant women?', a: 'The HFS dental fee schedule prints a separate column of maximum allowances for pregnant women. For every code this site uses, that column carries the same amount as the adult column. Which services a pregnant member can receive is set by the program rules, not by the fee schedule.' },
    { q: 'Why does the Illinois page use a 2023 fee schedule?', a: `The estimate divides the fees in force on July 1, 2024, the date up to which the ADA collected Medicaid fees for its ratios. The Illinois archive lists no edition between January 2023 and January 2025, so the January 2023 edition was the one in force. For the codes used here it matches today's schedule almost entirely.` },
  ],
  related: ['dental-crown-cost', 'braces-cost', 'root-canal-cost', 'dental-costs-by-state'],
});
