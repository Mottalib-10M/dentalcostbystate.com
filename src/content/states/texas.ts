import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const SLUG = 'texas';
const st = K.S(SLUG);
const r = st.ratios;
const must = (id: string) => { const e = K.est(SLUG, id); if (!e.ok) throw new Error(`${SLUG}: ${id} not priced`); return e; };
const molar = must('rootcanal_molar');
const premolar = must('rootcanal_premolar');
const wisdom = must('wisdom4');
const fill = must('filling');
const chk = must('checkup');
const ext = must('extraction');
const fee = (f: typeof st.fees, c: string) => f[c]?.child ?? f[c]?.all ?? 0;
const then = (c: string) => fee(st.fees, c), now = (c: string) => fee(st.feesNow, c);
const withheld = K.PROC_IDS.filter((id) => K.est(SLUG, id).outlier).map((id) => K.PR(id).short.toLowerCase());
const wList = withheld.length > 1 ? `${withheld.slice(0, -1).join(', ')} and ${withheld[withheld.length - 1]}` : withheld[0] ?? '';
const cpi = K.month(K.P.cpiDental.latestPeriod);

export default defineState({
  slug: SLUG,
  title: 'Dental Costs Texas 2026: Root Canal, Filling, Checkup Prices',
  description: 'Dental costs in Texas for 2026: root canals, fillings, extractions and checkups priced from Texas Health Steps dental fees of July 2024, with or without a plan.',
  intro: `Texas Medicaid's dental schedule covers patients under 21 only, so every Texas price here starts from a children's fee; a molar root canal comes to ${K.usd(molar.charge)}.`,
  resume: `A molar root canal is estimated at ${K.usd(molar.charge)} in Texas, a premolar root canal at ${K.usd(premolar.charge)}, a two-surface filling at ${K.usd(fill.charge)}, a simple extraction at ${K.usd(ext.charge)} and a checkup with cleaning and X-rays at ${K.usd(chk.charge)}, in ${cpi} dollars before any dental plan. The fees come from the dental schedule of Texas Health Steps, the Medicaid dental benefit for people under 21, posted by the state's Medicaid claims administrator in July 2024. Texas Medicaid has no adult dental fee-for-service schedule, and the American Dental Association's 2024 study classed its adult benefit as emergency care only, so it measured no adult ratio. Every Texas estimate therefore divides a children's fee by the children's ratio: Medicaid paid ${K.pct(r.childCharge!, 1)} of what Texas dentists charge for children's care. The same tooth and the same code cost a dentist the same work at 16 or at 40, which is what the estimate relies on.`,
  body: (h) => `
<h2>A children's schedule read for adult prices</h2>
<p>The ${h.ext(st.page, 'Texas Medicaid fee schedule page')} publishes one dental file for Texas Health Steps. Each code carries an age range, and nearly all of them stop at 20 years: crowns and bridges start at 13 or 16, dentures at 3, but none reaches adulthood. This site reads the ${h.ext(st.url2024!, 'July 2024 edition')} as the base of its estimates and shows the ${h.ext(st.url, 'current edition')} beside it. Most fees were raised in September 2025 or September 2026: a molar root canal, D3330, went from ${K.usd(then('D3330'))} to ${K.usd(now('D3330'))}, and the adult-age cleaning code D1110 from ${K.usd(then('D1110'))} to ${K.usd(now('D1110'))}.</p>
<p>Comprehensive orthodontics, D8080, entered the schedule with a fee dated October 2024, after the month the ADA's ratios describe, so braces are not priced for Texas.</p>
${h.mini('cost', { t: 'A Texas procedure, with or without a plan', p: ['pr', 'cv'], d: { sx: SLUG, pr: 'rootcanal_molar' } })}
<h2>Procedures withheld for Texas</h2>
<p>Children's fees for some codes sit much further below the market than the basket of exams, cleanings, fillings and extractions on which the ADA built its ratio. Divided by that ratio, they give prices less than half the median of the other states. The site withholds such results rather than print them: for Texas, ${wList ? `that is the case of ${wList}` : 'no procedure is withheld at present'}. The porcelain crown is one such case: Texas Health Steps paid ${K.usd(then('D2740'))} for it in 2024. The ${h.a('method', 'method page')} gives the rule.</p>
<p>What remains are the procedures whose Texas fees behave like the basket: root canals, extractions, the removal of four impacted wisdom teeth at ${K.usd(wisdom.charge)}, fillings and checkups. For an adult paying cash, the network price, here ${K.usd(molar.allowed)} for a molar root canal, is the figure a dental plan would allow; the ${h.a('dental-work-without-insurance', 'page on paying without insurance')} explains the gap between the two. A written estimate from a Texas dentist, read code by code against the table below, shows where an office stands.</p>
`,
  faqs: [
    { q: 'How much does a root canal cost in Texas?', a: `A molar root canal is estimated at ${K.usd(molar.charge)} before insurance in Texas and about ${K.usd(molar.allowed)} at a typical network price, in ${cpi} dollars; a premolar at ${K.usd(premolar.charge)}. The estimate divides the Texas Health Steps fee of July 2024 by the state's children's ratio from the ADA's 2024 study, then applies the dental price index.` },
    { q: 'Why does this site not price a crown in Texas?', a: `The Texas Health Steps schedule paid ${K.usd(then('D2740'))} for a porcelain crown in 2024. Divided by the state's ratio, that fee gives an estimate outside the range the site accepts around the median of the other states, a sign that the code is paid on a different footing from the basket the ratio measures. The site withholds such results instead of printing them.` },
    { q: 'Does Texas Medicaid pay for adult dental care?', a: 'The Texas Medicaid dental fee schedule read here lists codes for Texas Health Steps members under 21, and the ADA classed the adult Medicaid dental benefit of Texas as emergency care only in 2024. Adults eligible for other programs should ask the state or their plan which services are covered.' },
  ],
  related: ['root-canal-cost', 'dental-work-without-insurance', 'medicaid-dental-by-state', 'dental-costs-by-state'],
});
