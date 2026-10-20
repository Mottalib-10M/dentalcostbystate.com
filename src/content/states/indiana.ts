import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = 'indiana';
const st = K.S(S);
const r = st.ratios;
const e = (id: string) => K.est(S, id);
const usd = (id: string) => K.usd(e(id).charge);
const molar = e('rootcanal_molar');
const dent = e('denture_full');
const wis = e('wisdom4');
const deep = e('deepclean');
const fill = e('filling');
const ext = e('extraction');
const wisAll = K.spread('wisdom4');
const cpi = K.month(K.P.cpiDental.latestPeriod);
const unchanged = Object.keys(st.fees).every((c) => JSON.stringify(st.fees[c]) === JSON.stringify(st.feesNow[c]));
const held = K.PROC_IDS.filter((id) => e(id).outlier).map((id) => K.PR(id).short.toLowerCase());

export default defineState({
  slug: S,
  title: 'Dental Costs Indiana 2026: Dentures, Root Canal, Extraction',
  description: 'Dental costs in Indiana for 2026: dentures, root canals, wisdom teeth, deep cleanings, fillings estimated from the IHCP fee schedule, before and after a plan.',
  intro: `Indiana's Medicaid dental fees have carried the same effective date, January 1, 2024, from the ADA's reference month to today, so its estimates and today's Medicaid payments rest on one set of numbers.`,
  resume: `Indiana's estimates put complete upper and lower dentures at ${dent.ok ? usd('denture_full') : 'an amount withheld here'}, a molar root canal at ${K.usd(molar.charge)}, ${wis.ok ? `the removal of four impacted wisdom teeth at ${usd('wisdom4')}, ` : ''}${deep.ok ? `a deep cleaning of all four quadrants at ${usd('deepclean')} ` : ''}and a two-surface filling at ${fill.ok ? usd('filling') : 'an amount withheld here'}, in ${cpi} dollars and before insurance. The fees come from the professional fee schedule of the Indiana Health Coverage Programs, the state's Medicaid programs, where every dental code used here carries a rate effective date of January 1, 2024 and no end date. The ADA's 2024 study found Indiana Medicaid paid ${K.pct(r.adultCharge!, 1)} of what dentists charged for adult care and ${K.pct(r.childCharge!, 1)} for children's care, both far above the national figures, so each fee is multiplied by only about ${K.dec(1 / r.adultCharge!, 1)}, before the price index, to recover the typical charge.`,
  body: (h) => `
<h2>One fee schedule, read in its base column</h2>
<p>Indiana publishes its dental fees inside the ${h.ext(st.url, 'IHCP professional fee schedule')}, a single spreadsheet that also covers medical services. It prints a maximum fee and several reduced cutback columns that apply to certain kinds of providers. The site reads the base maximum fee. ${unchanged ? 'Every fee it uses is identical in the file updated in June 2026 and at its January 2024 effective date, so the 2024 column and the current column of the price list below always match.' : 'Nearly all the fees it uses are unchanged since January 2024.'}</p>
<p>Some codes are listed as not covered at a price of zero, among them porcelain crowns, implants and fixed bridges, so the site cannot price that work in Indiana. Root canals have fees for patients up to age 20 only; the estimates use those children's fees with the children's ratio, a pairing the result card names. Dentures and extractions carry the same fee for every age.</p>
${h.mini('cost', { t: 'An Indiana procedure, insured or not', p: ['pr', 'cv'], d: { sx: S, pr: dent.ok ? 'denture_full' : 'rootcanal_molar' } })}
<h2>A high ratio and what it means for a quote</h2>
<p>When Medicaid pays close to half of dentists' charges, the step from fee to estimate is short, and the estimate leans on the fee itself. ${wis.ok ? `The four impacted wisdom teeth show the result: ${usd('wisdom4')} in Indiana against a median of ${K.usd(wisAll.median)} for the ${wisAll.n} states that price them${wis.charge > wisAll.median ? ', because the Indiana fee per impacted tooth is high' : ''}. ` : ''}${ext.ok ? `A simple extraction comes to ${usd('extraction')}. ` : ''}${held.length ? `The outlier screen withholds ${held.join(' and ')}, whose Indiana fees give estimates far from the other states.` : ''}</p>
<p>The ADA classed Indiana's adult benefit in 2024 as ${st.adultBenefit.toLowerCase()}, and the schedule itself is a list of fees, not of what an adult member may receive. Anyone comparing a quote with these figures should compare code by code, since an office's fee for a surgical extraction, sedation or a bone graft can make the total diverge. The ${h.a('wisdom-teeth-removal-cost', 'wisdom teeth page')} and the ${h.a('tooth-extraction-cost', 'extraction page')} explain the codes involved.</p>
`,
  faqs: [
    { q: 'How much does it cost to have wisdom teeth removed in Indiana?', a: `${wis.ok ? `Removing four impacted wisdom teeth is estimated at ${usd('wisdom4')} in Indiana before insurance` : 'Four impacted wisdom teeth are not estimated for Indiana at present'}, in ${cpi} dollars, from the IHCP fees and the state's adult ratio. Sedation, X-rays and the consultation are billed separately. Teeth that have erupted cost less to remove than teeth still in the bone.` },
    { q: 'Has Indiana Medicaid changed its dental fees since 2024?', a: 'Not for the codes this site uses. In the IHCP professional fee schedule updated in June 2026, each of them still carries a rate effective date of January 1, 2024 with no end date. The current fee shown on the price list is therefore the same as the 2024 fee the estimate divides.' },
    { q: 'Why can this site not price a crown in Indiana?', a: 'The Indiana schedule lists porcelain crowns among non-covered services at a price of zero. The estimate divides a state\'s Medicaid fee by its ratio, and a zero fee gives nothing to divide, so the site leaves crowns out for Indiana rather than borrow a figure from another state. Implants and fixed bridges are in the same case.' },
  ],
  related: ['wisdom-teeth-removal-cost', 'dentures-cost', 'tooth-extraction-cost', 'dental-costs-by-state'],
});
