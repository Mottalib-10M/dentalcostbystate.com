import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';
import { medicaidNow } from '../../lib/data';

const S = 'florida';
const st = K.S(S);
const r = st.ratios;
const e = (id: string) => K.est(S, id);
const usd = (id: string) => K.usd(e(id).charge);
const crown = e('crown');
const rc = e('rootcanal_molar');
const dent = e('denture_full');
const br = e('braces_teen');
const clean = e('checkup');
const cleanNow = medicaidNow(st, 'checkup');
const cpi = K.month(K.P.cpiDental.latestPeriod);
// Rank of Florida's children's ratio among the 51 jurisdictions (1 = lowest).
const rank = [...K.ADA.states].sort((a, b) => a.childCharge - b.childCharge).findIndex((x) => x.code === 'FL') + 1;
const kidPriced = K.PROC_IDS.filter((id) => e(id).ok && e(id).feePop === 'child' && K.PR(id).pop === 'adult').map((id) => K.PR(id).short.toLowerCase());
const kidText = kidPriced.length > 1 ? `${kidPriced.slice(0, -1).join(', ')} and ${kidPriced[kidPriced.length - 1]}` : kidPriced[0] ?? '';
const d5110 = st.fees.D5110;

export default defineState({
  slug: S,
  title: 'Dental Costs Florida 2026: Crown, Braces and Denture Prices',
  description: 'Dental costs in Florida for 2026: crowns, root canals, braces and dentures estimated from the Florida Medicaid dental fee schedule, with or without a plan.',
  intro: `Florida Medicaid pays dentists a smaller share of their charges for children's care than any other state measured by the ADA, so its modest fees stand for higher prices: a crown is estimated at ${crown.ok ? usd('crown') : 'an amount withheld here'}.`,
  resume: `Florida's estimates put ${crown.ok ? `a porcelain crown at ${usd('crown')}, ` : ''}a molar root canal at ${K.usd(rc.charge)}, ${br.ok ? `braces for a teenager at ${usd('braces_teen')} ` : ''}and complete upper and lower dentures at ${dent.ok ? usd('denture_full') : 'an amount withheld here'}, in ${cpi} dollars and before insurance. They come from the Florida Medicaid dental general fee schedule, which the state adopts by reference in its administrative code, divided by the ADA's 2024 ratio for Florida. That ratio is low: Medicaid paid ${K.pct(r.childCharge!, 1)} of what dentists charged for children's care, ${rank === 1 ? 'the lowest share of all 51 jurisdictions' : `the ${rank === 2 ? 'second' : rank === 3 ? 'third' : `${rank}th`} lowest of the 51 jurisdictions`}, against ${K.pct(K.ADA.national.childCharge, 1)} nationally. The ADA gave no adult ratio for Florida, whose adult benefit it classed as ${st.adultBenefit.toLowerCase()} care, so every Florida estimate uses the children's ratio, and procedures that the schedule pays only for patients under 21 are priced from the children's column.`,
  body: (h) => `
<h2>A children's schedule doing an adult's job</h2>
<p>The ${h.ext(st.url, 'Florida dental general fee schedule')} has a column for patients from birth to age 20 and one for those 21 and over. The adult column is short. In the edition in force in 2024 it carried fees for complete and partial dentures and for extractions, ${d5110?.adult ? `such as ${K.usd(d5110.adult)} for an upper denture against ${K.usd(d5110.child ?? 0)} in the children's column,` : ''} but no fee for crowns, root canals or fillings. For those, the site uses the children's fee with the children's ratio, so that fee and ratio describe the same patients. In Florida that applies to ${kidText}. The result card says so each time.</p>
<p>Two caveats follow. A crown or root canal for an adult in Florida is priced from what dentists charge in general, which the ratio recovers, not from any Florida adult Medicaid payment. And the low ratio magnifies small fees: each Medicaid dollar stands for about ${K.dec(1 / r.childCharge!, 1)} dollars of dentist charges in the ADA window, before the price index brings it to ${cpi}.</p>
${h.mini('cost', { t: 'Florida price with or without dental insurance', p: ['pr', 'cv'], d: { sx: S, pr: crown.ok ? 'crown' : 'rootcanal_molar' } })}
<h2>Which edition, and what changed</h2>
<p>The estimates divide the edition dated January 1, 2024. Its rates for the codes used here match the 2023 edition that the administrative rule formally incorporated on July 1, 2024, so the choice of edition does not change any figure. The current fee column comes from the January 2026 edition; the state agency also lists a July 2026 edition that could not be downloaded, so a few of today's fees may already be higher. Among the changes the site could read, the children's cleaning fee rose, which lifts the Medicaid payment for a checkup from ${K.usd(clean.medicaid)} in 2024 to ${cleanNow === null ? 'an amount not fully listed today' : K.usd(cleanNow)} today.</p>
<p>Most Florida Medicaid members receive dental care through managed care dental plans, whose payments are not public; the fee-for-service schedule is the published benchmark. For the comparison with other states, see the ${h.a('dental-costs-by-state', 'state comparison')}; for orthodontics, the ${h.a('braces-cost', 'braces page')} explains the codes and the lifetime maximums plans apply.</p>
`,
  faqs: [
    { q: 'How much do braces cost in Florida?', a: `${br.ok ? `Comprehensive braces for a teenager are estimated at ${usd('braces_teen')} in Florida before insurance` : 'Teen braces are not estimated for Florida at present'}, in ${cpi} dollars, from the Florida Medicaid orthodontic fee and the state's children's ratio. Many dental plans pay orthodontics for children at half, up to a lifetime maximum, so the share left to the family depends on that maximum.` },
    { q: 'Why are Florida dental estimates high compared with Medicaid fees?', a: `Because Florida Medicaid pays a small share of what dentists charge. The ADA measured it at ${K.pct(r.childCharge!, 1)} for children's care in its 2024 study, so the site divides each Florida fee by that share to recover the typical charge. A low fee therefore stands for a much higher price in a dental office.` },
    { q: 'Does Florida Medicaid pay for adult crowns?', a: 'The Florida dental general fee schedule this site reads lists no adult fee for crowns, root canals or fillings, only for dentures, partials and extractions among the codes used here. Coverage for an adult member also depends on the managed care dental plan that serves them, which the member handbook describes.' },
  ],
  related: ['braces-cost', 'dental-crown-cost', 'dental-costs-by-state', 'medicaid-dental-by-state'],
});
