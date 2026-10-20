import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = 'maryland';
const st = K.S(S);
const r = st.ratios;
const e = (id: string) => K.est(S, id);
const usd = (id: string) => K.usd(e(id).charge);
const crown = e('crown');
const molar = e('rootcanal_molar');
const teen = e('braces_teen');
const adult = e('braces_adult');
const wis = e('wisdom4');
const brAll = K.spread('braces_teen');
const cpi = K.month(K.P.cpiDental.latestPeriod);
// Rank of Maryland's Medicaid-to-private ratio for adults (1 = highest).
const priv = K.ADA.states.filter((x) => x.adultPrivate).sort((a, b) => b.adultPrivate! - a.adultPrivate!);
const rank = priv.findIndex((x) => x.code === 'MD') + 1;
const same = Object.keys(st.fees).every((c) => JSON.stringify(st.fees[c]) === JSON.stringify(st.feesNow[c]));
const gap = K.dec(molar.charge / molar.allowed, 1);
const held = K.PROC_IDS.filter((id) => e(id).outlier).map((id) => K.PR(id).short.toLowerCase());
const heldText = held.length > 1 ? `${held.slice(0, -1).join(', ')} and ${held[held.length - 1]}` : held[0] ?? '';

export default defineState({
  slug: S,
  title: 'Dental Costs Maryland 2026: Braces, Crown, Root Canal Prices',
  description: 'Dental costs in Maryland for 2026: braces, crowns, root canals and wisdom teeth estimated from the Maryland Healthy Smiles fee schedule, with or without a plan.',
  intro: `In Maryland the Medicaid dental fee is close to what private dental plans pay, so the network price of a procedure is only a little above it; a molar root canal is estimated at ${K.usd(molar.charge)} before insurance.`,
  resume: `Maryland's estimates put ${teen.ok ? `comprehensive braces for a teenager at ${usd('braces_teen')}, ` : ''}${adult.ok ? `for an adult at ${usd('braces_adult')}, ` : ''}${crown.ok ? `a porcelain crown at ${usd('crown')}, ` : ''}a molar root canal at ${K.usd(molar.charge)} ${wis.ok ? `and four impacted wisdom teeth at ${usd('wisdom4')}` : 'and the other procedures in the table below'}, in ${cpi} dollars before insurance. The fees come from the Maryland Healthy Smiles dental program, the state's Medicaid dental benefit, which uses one schedule for patients of every age. The ADA's 2024 study found an unusual pattern there. Medicaid paid ${K.pct(r.adultCharge!, 1)} of what dentists charged for adult care, a little above the national ${K.pct(K.ADA.national.adultCharge!, 1)}, but ${K.pct(r.adultPrivate!, 1)} of what private dental plans paid them, ${rank === 2 ? 'the second highest share in the study' : rank === 1 ? 'the highest share in the study' : 'far above the national figure'}. In practice, the network price a plan member pays is only modestly higher than the Medicaid fee, while the full fee charged to an uninsured patient is about ${gap} times the network price.`,
  body: (h) => `
<h2>One schedule for every age</h2>
<p>The ${h.ext(st.url, 'Maryland Medicaid dental fee schedule')}, published by the state health department under the state's administrative code, gives one fee per code with no adult or children's column. The edition in force on July 1, 2024 was dated January 1, 2024, and ${same ? 'every fee the site reads is identical in it and in the revision of August 2026' : 'nearly every fee the site reads is unchanged in the revision of August 2026'}. For a reader comparing the estimate with today's Medicaid payment, the two columns of the price list below therefore match.</p>
<p>Orthodontics is listed for both age groups, which not every state schedule does: comprehensive treatment of an adolescent and of an adult each have a fee, limited by the schedule to one treatment per lifetime. ${teen.ok ? `Teen braces come out at ${usd('braces_teen')}, against a median of ${K.usd(brAll.median)} for the ${brAll.n} states that price them.` : ''} For a teenager the site pairs the fee with the children's ratio, for an adult with the adult ratio.</p>
${h.mini('cost', { t: 'Maryland price, insured or uninsured', p: ['pr', 'cv'], d: { sx: S, pr: teen.ok ? 'braces_teen' : 'rootcanal_molar' } })}
<h2>Full fee and network price far apart</h2>
<p>Because Maryland's two ratios are so far apart, the gap between a dentist's full fee and a plan's network price is wider than in most states. ${crown.ok ? `For a porcelain crown the full fee is estimated at ${usd('crown')} and the network price at ${K.usd(crown.allowed)}. ` : ''}A patient without insurance who asks for the office's cash price, or who joins a plan only for its network discount, may see a large difference; the ${h.a('dental-work-without-insurance', 'page on paying without insurance')} describes both routes.</p>
<p>${held.length ? `The outlier screen withholds ${heldText} in Maryland: the state's fees for that work give estimates far from those of the other states, a sign it is paid on another basis. ` : ''}Implants, fixed bridges and cast partial dentures are not in the schedule at all. The figures are one average for the state, with no split between Baltimore, the Washington suburbs and the Eastern Shore. The ${h.a('braces-cost', 'braces page')} explains the orthodontic codes and the lifetime maximums plans apply.</p>
`,
  faqs: [
    { q: 'How much do braces cost in Maryland?', a: `${teen.ok ? `Comprehensive braces for a teenager are estimated at ${usd('braces_teen')} in Maryland before insurance` : 'Teen braces are not estimated for Maryland at present'}${adult.ok ? `, and for an adult at ${usd('braces_adult')}` : ''}, in ${cpi} dollars. Both come from the Maryland Healthy Smiles fees and the state's ratios. Plans that cover orthodontics usually pay a share up to a lifetime maximum, so the family's part depends on that maximum.` },
    { q: 'Why is the network price so low compared with the full fee in Maryland?', a: `The ADA measured Maryland Medicaid fees at ${K.pct(r.adultPrivate!, 1)} of private plan payments for adult care but only ${K.pct(r.adultCharge!, 1)} of dentists' full charges. Dividing the same fee by the two shares gives a network price close to the fee and a full fee about ${gap} times as high. Plan members benefit from that gap; uninsured patients pay the full fee unless they negotiate.` },
    { q: 'Does Maryland Medicaid list one fee for adults and children?', a: 'Yes. The Maryland dental fee schedule prints one fee per code, whatever the age of the patient, and marks which codes require preauthorization. Orthodontic treatment for adolescents and for adults each has its own code and fee, limited to one treatment per lifetime. Which services a member can receive is set by the program rules.' },
  ],
  related: ['braces-cost', 'root-canal-cost', 'dental-work-without-insurance', 'dental-costs-by-state'],
});
