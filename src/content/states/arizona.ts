import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = 'arizona';
const st = K.S(S);
const r = st.ratios;
const e = (id: string) => K.est(S, id);
const usd = (id: string) => K.usd(e(id).charge);
const crown = e('crown');
const rc = e('rootcanal_molar');
const dent = e('denture_full');
const wis = e('wisdom4');
const fill = e('filling');
// Procedures this page cites in its lead, kept only when the estimate is published.
const lead = ['crown', 'rootcanal_molar', 'denture_full', 'wisdom4'].filter((id) => e(id).ok);
const named = lead.map((id) => `${K.PR(id).short.toLowerCase()} at ${usd(id)}`);
const leadText = named.length > 1 ? `${named.slice(0, -1).join(', ')} and ${named[named.length - 1]}` : named[0] ?? '';
const crownAll = K.spread('crown');
const braces = e('braces_teen');
const cpi = K.month(K.P.cpiDental.latestPeriod);
const sameNow = Object.keys(st.fees).every((c) => JSON.stringify(st.fees[c]) === JSON.stringify(st.feesNow[c]));

export default defineState({
  slug: S,
  title: 'Dental Costs Arizona 2026: Crown, Root Canal, Denture Prices',
  description: 'Dental costs in Arizona for 2026: crowns, root canals, dentures and wisdom teeth estimated from the AHCCCS capped fee schedule, before and after a dental plan.',
  intro: `Arizona's Medicaid dental fees for the codes priced here are the same in its 2023 and 2026 schedules, and a ${crown.ok ? `crown is estimated at ${usd('crown')}` : `molar root canal is estimated at ${usd('rootcanal_molar')}`} before insurance.`,
  resume: `In Arizona the estimates put a ${leadText}, in ${cpi} dollars and before any insurance. They start from the capped fee schedule of AHCCCS, the Arizona Health Care Cost Containment System, which pays the same fee for a code whatever the patient's age. The ADA's 2024 study found that those fees equal ${K.pct(r.childCharge!, 1)} of what Arizona dentists charge for children's care, but it published no adult figure for the state, because adults then had an emergency benefit only. For adult procedures the site therefore divides the schedule's single fee by the children's ratio, a choice the method page explains and every result card names. The network price that a private plan allows is lower than the full fee: about ${K.usd(rc.allowed)} for a molar root canal, against a full fee of ${K.usd(rc.charge)}.`,
  body: (h) => `
<h2>One fee for every age, and no adult ratio</h2>
<p>The ${h.ext(st.url, 'AHCCCS dental fee-for-service schedule')} lists one rate per code for all members, with no separate adult column, plus a second, higher column for the Flagstaff area that this site does not use. The edition in force on July 1, 2024 was the one dated October 1, 2023, and ${sameNow ? 'every fee the site reads is the same in it as in the edition of October 1, 2026' : 'most fees the site reads are the same in it as in the current edition'}: the effective dates printed beside the codes go back as far as October 2020. For a site that divides a 2024 fee by a 2024 ratio, that stability is useful, since the estimate and today's Medicaid payment rest on the same amount.</p>
<p>The weak point is the ratio. The ADA classed Arizona's adult benefit in 2024 as ${st.adultBenefit.toLowerCase()} care and gave no adult figure, so the children's ratio of ${K.pct(r.childCharge!, 1)} stands in for adults. Nationally, Medicaid paid ${K.pct(K.ADA.national.childCharge, 1)} of dentists' charges for children and ${K.pct(K.ADA.national.adultCharge!, 1)} for adults, so the substitution may move adult prices in either direction; the estimates are best read as a range around the figure shown.</p>
${h.mini('cost', { t: 'A procedure in Arizona, with or without a plan', p: ['pr', 'cv'], d: { sx: S, pr: rc.ok ? 'rootcanal_molar' : 'filling' } })}
<h2>How Arizona compares</h2>
<p>${crown.ok ? `A porcelain crown at ${usd('crown')} sits ${crown.charge > crownAll.median ? 'above' : 'below'} the median of ${K.usd(crownAll.median)} across the ${crownAll.n} states whose schedules list it.` : `Crowns cannot be priced in Arizona with the current schedules.`} ${dent.ok ? `Complete upper and lower dentures come to ${usd('denture_full')}, ` : ''}${wis.ok ? `the removal of four impacted wisdom teeth to ${usd('wisdom4')}, ` : ''}${fill.ok ? `and a two-surface filling on a back tooth to ${usd('filling')}.` : 'and smaller work follows the table below.'} ${braces.ok ? `Braces for a teenager are estimated at ${usd('braces_teen')}.` : `Teen braces are not shown: the Arizona fee for comprehensive orthodontics gives an estimate more than twice the median of the other states, a sign it is paid on another basis, so the site withholds it.`}</p>
<p>These figures describe a typical office in the state. Phoenix, Tucson and rural counties are not separated in any public schedule, and the AHCCCS file itself states that a listed rate does not mean a service is covered. The ${h.a('dental-costs-by-state', 'state comparison')} sets Arizona beside the other states, and the ${h.a('dental-work-without-insurance', 'page on paying without insurance')} explains how a cash price is usually negotiated.</p>
`,
  faqs: [
    { q: 'How much does a root canal cost in Arizona?', a: `A molar root canal is estimated at ${K.usd(rc.charge)} before insurance in Arizona, a front tooth less. With a private plan, the network price is about ${K.usd(rc.allowed)}, and a plan paying half of major work would leave roughly half of that to you after the deductible. The crown that often follows is a separate bill.` },
    { q: 'Why does this site use a children\'s ratio for Arizona adults?', a: `The ADA study that converts Medicaid fees into typical charges gave Arizona only a children's figure for 2024, because the adult benefit then covered emergencies only. The AHCCCS schedule pays one fee for all ages, so the site divides it by the children's ratio of ${K.pct(r.childCharge!, 1)}. Treat adult estimates in Arizona as approximate.` },
    { q: 'Has Arizona Medicaid raised its dental fees recently?', a: `Not for the codes this site prices. The AHCCCS schedules of October 2023 and October 2026 carry the same fees, with effective dates as old as October 2020 printed beside the codes. Payment by managed care plans, which serve most members, can differ from the fee-for-service schedule, and those rates are not public.` },
  ],
  related: ['root-canal-cost', 'dental-crown-cost', 'dental-costs-by-state', 'medicaid-dental-by-state'],
});
