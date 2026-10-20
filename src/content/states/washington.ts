import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const SLUG = 'washington';
const st = K.S(SLUG);
const r = st.ratios;
const must = (id: string) => { const e = K.est(SLUG, id); if (!e.ok) throw new Error(`${SLUG}: ${id} not priced`); return e; };
const dent = must('denture_full');
const front = must('rootcanal_front');
const ext = must('extraction');
const braces = must('braces_teen');
const chk = must('checkup');
const wisdom = must('wisdom4');
const ad = (f: typeof st.fees, c: string) => f[c]?.adult ?? 0;
const then = (c: string) => ad(st.fees, c), now = (c: string) => ad(st.feesNow, c);
const fall = (c: string) => 1 - now(c) / then(c);
const cpi = K.month(K.P.cpiDental.latestPeriod);
const nat = K.ADA.national;
const bracesAll = K.spread('braces_teen');

export default defineState({
  slug: SLUG,
  title: 'Dental Costs Washington 2026: Denture, Braces, Checkup Price',
  description: 'Dental costs in Washington for 2026: dentures, root canals, braces and checkups priced from the Apple Health dental schedule of July 2024, with your plan.',
  intro: `Washington's Medicaid program cut several adult dental fees after 2024, but the estimate rests on the July 2024 schedule the ADA's ratios describe; full dentures come to ${K.usd(dent.charge)}.`,
  resume: `A full set of upper and lower dentures is estimated at ${K.usd(dent.charge)} in Washington, a front tooth root canal at ${K.usd(front.charge)}, the removal of four impacted wisdom teeth at ${K.usd(wisdom.charge)}, braces for a teenager at ${K.usd(braces.charge)} and a checkup with cleaning and X-rays at ${K.usd(chk.charge)}, in ${cpi} dollars before any dental plan. The fees come from the dental fee schedule of Washington Apple Health, the state's Medicaid program, effective July 1, 2024, which prints one maximum fee for ages 0 to 20 and another for 21 and over. The American Dental Association's 2024 study found that the program paid ${K.pct(r.adultCharge!, 1)} of what Washington dentists charge adults and ${K.pct(r.childCharge!, 1)} for children. Each procedure is divided by the ratio of its own age group. Crowns and molar root canals are listed for patients under 21 only, so their estimates use the children's fees and ratio.`,
  body: (h) => `
<h2>Adult fees that went down</h2>
<p>The Health Care Authority publishes a new dental schedule each July. This page divides the ${h.ext(st.url2024!, 'edition of July 1, 2024')}, in force when the ADA collected the Medicaid fees behind its ratios, and shows the ${h.ext(st.url, 'edition of July 1, 2026')} beside it. Many adult fees fell between the two. The periodic exam, D0120, went from ${K.usd(then('D0120'))} to ${K.usd(now('D0120'))} for an adult, the adult cleaning, D1110, from ${K.usd(then('D1110'))} to ${K.usd(now('D1110'))}, and a complete upper denture from ${K.usd(then('D5110'))} to ${K.usd(now('D5110'))}, a cut of ${K.pct(fall('D5110'), 0)}. Children's fees moved less.</p>
<p>Lower Medicaid fees change what the program pays a dentist, not what an uninsured patient is billed, so the estimates here do not fall with them. A separate, higher column of the schedule for the state's program for babies and young children is not used, since the ADA ratio describes the standard fees.</p>
${h.mini('cost', { t: 'A Washington procedure, with or without a plan', p: ['pr', 'cv'], d: { sx: SLUG, pr: 'denture_full' } })}
<h2>Two ratios, one per age group</h2>
<p>Washington is one of the states where Medicaid paid adults a larger share of dentists' charges than children: ${K.pct(r.adultCharge!, 1)} against ${K.pct(r.childCharge!, 1)}, while nationally the order is reversed, ${K.pct(nat.adultCharge!, 1)} for adults and ${K.pct(nat.childCharge, 1)} for children. Each estimate uses the ratio of the column its fee comes from, so a teenager's braces, ${K.usd(braces.charge)} here, are divided by the children's ratio and an adult's dentures by the adult one. Across the ${bracesAll.n} states that price teenage braces, the median is ${K.usd(bracesAll.median)}; the ${h.a('braces-cost', 'braces page')} compares them.</p>
<p>Smaller work: a simple extraction comes to ${K.usd(ext.charge)} and a checkup to ${K.usd(chk.charge)} before insurance. Plans built like the Covered California example pay diagnostic and preventive care in full in network, so the checkup costs a plan member nothing; the ${h.a('teeth-cleaning-cost', 'cleaning page')} gives the details. For larger work, a dentist's written estimate read code by code against the table below shows how an office compares with these state figures.</p>
`,
  faqs: [
    { q: 'How much do dentures cost in Washington state?', a: `A complete upper and lower set is estimated at ${K.usd(dent.charge)} before insurance in Washington and about ${K.usd(dent.allowed)} at a typical network price, in ${cpi} dollars. The estimate divides the adult Apple Health fees of July 2024 for codes D5110 and D5120 by the state's adult ratio from the ADA's 2024 study.` },
    { q: 'Did Washington Medicaid lower its dental fees?', a: `For several adult codes, yes. Between the July 2024 and July 2026 schedules, the adult periodic exam went from ${K.usd(then('D0120'))} to ${K.usd(now('D0120'))} and a complete upper denture from ${K.usd(then('D5110'))} to ${K.usd(now('D5110'))}. The estimates on this page rest on the 2024 fees, the ones the ADA ratio was measured on.` },
    { q: 'What do braces cost for a teenager in Washington?', a: `Comprehensive orthodontic treatment of a teenager is estimated at ${K.usd(braces.charge)} before insurance, from the Apple Health orthodontic fee for code D8080, divided by the state's children's ratio. Many dental plans limit orthodontic benefits to children and to a lifetime amount; the estimator lets you enter your own plan's terms.` },
  ],
  related: ['dentures-cost', 'braces-cost', 'teeth-cleaning-cost', 'dental-costs-by-state'],
});
