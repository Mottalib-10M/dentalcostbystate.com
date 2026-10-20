import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const S = 'colorado';
const st = K.S(S);
const r = st.ratios;
const e = (id: string) => K.est(S, id);
const usd = (id: string) => K.usd(e(id).charge);
const rc = e('rootcanal_molar');
const rcAll = K.spread('rootcanal_molar');
const crown = e('crown');
const dentUp = e('denture_upper');
const ext = e('extraction');
const deep = e('deepclean');
const check = e('checkup');
const cpi = K.month(K.P.cpiDental.latestPeriod);
const nCodes = Object.keys(st.fees).length;
// States whose molar root canal estimate is higher than Colorado's.
const above = rcAll.rows.filter((x) => x.e.charge > rc.charge).length;

export default defineState({
  slug: S,
  title: 'Dental Costs Colorado 2026: Root Canal, Crown, Denture Cost',
  description: 'Dental costs in Colorado for 2026: root canals, crowns, dentures and cleanings estimated from the Medicaid dental rates of July 2024, with or without a plan.',
  intro: `Colorado's estimates rest on the adult dental rates the state Medicaid agency printed for July 1, 2024; a molar root canal comes to ${rc.ok ? K.usd(rc.charge) : 'a figure we withhold'} before insurance.`,
  resume: `For Colorado the site estimates a molar root canal at ${K.usd(rc.charge)}, ${crown.ok ? `a porcelain crown at ${usd('crown')}, ` : ''}${dentUp.ok ? `one complete denture at ${usd('denture_upper')} ` : ''}and a checkup with cleaning and X-rays at ${check.ok ? usd('checkup') : 'a price shown in the table below'}, all in ${cpi} dollars and before insurance. The base is unusual. The dental fee schedule of Health First Colorado, the state's Medicaid program, is published through its dental administrator in a form this site could not download, so the fees come instead from a document of the state's own rate review, which lists the Medicaid allowable effective July 1, 2024 for ${K.num(nCodes)} of the codes used here. That date is exactly the one the ADA's 2024 ratios describe. Colorado's adult ratio is ${K.pct(r.adultCharge!, 1)} of dentists' charges, well above the national ${K.pct(K.ADA.national.adultCharge!, 1)}, which means Medicaid fees there sit closer to what offices charge.`,
  body: (h) => `
<h2>A rate review instead of a fee schedule</h2>
<p>Colorado reviews its Medicaid rates on a cycle and publishes the working papers. One of them, ${h.ext(st.url, 'Appendix H on dental rates and benchmark ratios')}, reproduces the adult part of the dental fee schedule with a column headed as the total Medicaid fee-for-service allowable effective July 1, 2024. The site reads its fees from that column. The current schedule is posted only through the program's dental administrator, which blocked every download we attempted, so the price list below has no column for today's Medicaid fee: the state has not been left out, its current file simply could not be read.</p>
<p>Because the document covers the adult tab, codes that the program pays only for children, among them comprehensive orthodontics, are not in it. Teen braces therefore have no Colorado estimate. That says nothing about whether the program covers them; it only means the fee is missing from the document the site uses.</p>
${h.mini('cost', { t: 'Colorado price of a procedure, plan or no plan', p: ['pr', 'cv'], d: { sx: S, pr: 'rootcanal_molar' } })}
<h2>Where the high ratio leads</h2>
<p>A high ratio means each Medicaid dollar stands for fewer dollars of dentist charges, so in Colorado the estimate is the 2024 fee multiplied by ${K.dec(1 / r.adultCharge!, 2)}, then by the price index, where the national adult ratio would multiply it by ${K.dec(1 / K.ADA.national.adultCharge!, 2)}. ${rc.ok ? `The molar root canal shows how it plays out: Colorado's estimate of ${K.usd(rc.charge)} is ${above === 0 ? 'the highest' : `exceeded by ${above === 1 ? 'one state' : `${above} states`}`} among the ${rcAll.n} states that price it, whose median is ${K.usd(rcAll.median)}.` : ''} ${ext.ok ? `A simple extraction is estimated at ${usd('extraction')}` : ''}${deep.ok ? ` and a deep cleaning of the four quadrants at ${usd('deepclean')}.` : '.'} The network price a private plan allows is lower in every row, by the gap between the adult private ratio of ${K.pct(r.adultPrivate!, 1)} and the charge ratio.</p>
<p>Prices across Denver, the mountain resorts and the eastern plains are not separated in any public file, so the figure is one average for the state. The ${h.a('root-canal-cost', 'root canal page')} compares the three kinds of teeth, and the ${h.a('dental-insurance-calculator', 'insurance calculator')} runs your own plan on any quote.</p>
`,
  faqs: [
    { q: 'How much is a root canal on a molar in Colorado?', a: `About ${K.usd(rc.charge)} before insurance, in ${cpi} dollars, estimated from the Medicaid allowable of July 2024 and Colorado's ratio between Medicaid pay and dentists' charges. A plan's network price is lower, near ${K.usd(rc.allowed)}. Specialists often charge more than general dentists for molars, and the crown that usually follows is billed separately.` },
    { q: 'Why is there no current Medicaid fee on the Colorado page?', a: `Health First Colorado publishes its dental fee schedule through its dental administrator, whose site refused our downloads. The fees used come from a state rate review document listing the allowable effective July 1, 2024, the month the ADA ratios describe. The estimate is complete; only the comparison with today's fee is missing.` },
    { q: 'Can braces be priced in Colorado on this site?', a: `Not at present. The rate review document reproduces the adult part of the Medicaid schedule, and comprehensive orthodontics for teenagers is a children's code, so its fee is absent. The site never fills a missing fee with a guess, so teen braces in Colorado are left out until a readable schedule lists them.` },
  ],
  related: ['root-canal-cost', 'dentures-cost', 'dental-insurance-calculator', 'dental-costs-by-state'],
});
