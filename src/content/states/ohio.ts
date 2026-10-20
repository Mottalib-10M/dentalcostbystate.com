import { defineState } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const SLUG = 'ohio';
const st = K.S(SLUG);
const r = st.ratios;
const must = (id: string) => { const e = K.est(SLUG, id); if (!e.ok) throw new Error(`${SLUG}: ${id} not priced`); return e; };
const crown = must('crown');
const molar = must('rootcanal_molar');
const prem = must('rootcanal_premolar');
const braces = must('braces_teen');
const wisdom = must('wisdom4');
const dent = must('denture_full');
const surg = must('extraction_surgical');
const nat = K.ADA.national;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const EX = K.P.examplePlan;
const pc = K.plan({ charge: crown.charge, allowed: crown.allowed, insured: true, inNetwork: false, planShare: K.shareOf('crown', 'auto'), deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: 0, nextYearDeductible: 0 });
const pin = K.plan({ charge: crown.charge, allowed: crown.allowed, insured: true, inNetwork: true, planShare: K.shareOf('crown', 'auto'), deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: 0, nextYearDeductible: 0 });

export default defineState({
  slug: SLUG,
  title: 'Dental Costs Ohio 2026: Crown, Root Canal and Braces Prices',
  description: `Dental costs in Ohio for 2026: crowns, root canals, braces, dentures and wisdom teeth estimated from the Ohio Medicaid fee table, in network or out of network.`,
  intro: `Ohio's Medicaid fees were raised in January 2024 and have not moved since, so one table serves both as the 2024 base and as today's fees; a crown comes to ${K.usd(crown.charge)}.`,
  resume: `In Ohio a porcelain crown is estimated at ${K.usd(crown.charge)}, a molar root canal at ${K.usd(molar.charge)}, comprehensive braces for a teenager at ${K.usd(braces.charge)}, four impacted wisdom teeth at ${K.usd(wisdom.charge)} and a full set of dentures at ${K.usd(dent.charge)}, in ${cpi} dollars before any dental plan. The base is the Ohio Department of Medicaid table of dental fees, whose maximum payments all carry an effective date of January 1, 2024, the date of the state's dental fee increase. The American Dental Association's 2024 study found that Ohio's Medicaid paid ${K.pct(r.adultCharge!, 1)} of what dentists charge adults, well above the national ${K.pct(nat.adultCharge!, 1)}. A high ratio means a short step from the Medicaid fee to the estimate, which makes Ohio one of the steadier states in this data.`,
  body: (h) => `
<h2>A table that has not changed since January 2024</h2>
<p>Ohio publishes its dental fees as a ${h.ext(st.url, 'table of CDT procedures')} with two money columns, the previous maximum payment and the current one, and an effective date for each code. Every code used here shows January 1, 2024: the current maximum is the one set by that year's increase, unchanged on July 1, 2024 and still the one posted today. That makes Ohio's estimate simple to trace. A molar root canal, code D3330, is paid ${K.usd(st.fees.D3330?.all ?? 0)}; divided by ${K.pct(r.adultCharge!, 1)} and carried to ${cpi}, it becomes ${K.usd(molar.charge)}. A premolar comes to ${K.usd(prem.charge)}.</p>
<p>The table also says what it leaves out. Codes for implants and fixed bridges are not listed, so neither can be priced for Ohio, and a surgical extraction, code D7210, is paid the same as a simple one, which puts the surgical estimate at ${K.usd(surg.charge)}. The ages and frequencies the program allows are set in the Ohio Administrative Code, not in this table.</p>
${h.mini('cost', { t: 'An Ohio procedure, in network or out', p: ['pr', 'cv'], d: { sx: SLUG, pr: 'crown', cv: 'out' } })}
<h2>In network or out of network</h2>
<p>Ohio's ratio to private insurance payments is ${K.pct(r.adultPrivate!, 1)}, which puts the typical network price of a crown at ${K.usd(crown.allowed)} against a full fee of ${K.usd(crown.charge)}. That gap is what going out of network can cost. With the example plan, a crown done in network leaves ${K.usd(pin.youPay)} to the patient; done out of network, where the dentist may bill the difference between the full fee and the plan's allowance, it leaves ${K.usd(pc.youPay)}. The estimator above starts on the out-of-network case so the two can be compared by switching one button.</p>
<p>Most Ohio Medicaid members are enrolled in managed care plans, whose rates are not public; this table is the fee-for-service side that the ADA measured. The ${h.a('dental-insurance-coverage', 'coverage page')} explains how plans sort work into classes, and the ${h.a('braces-cost', 'braces page')} compares Ohio's orthodontic estimate with other states.</p>
`,
  faqs: [
    { q: 'How much does a root canal cost in Ohio?', a: `A molar root canal is estimated at ${K.usd(molar.charge)} before insurance in Ohio and a premolar at ${K.usd(prem.charge)}, in ${cpi} dollars. Both start from the Ohio Medicaid fees set in January 2024, divided by the state's ratio in the ADA's 2024 study. The crown that usually follows a back tooth root canal is a separate bill.` },
    { q: 'What do braces cost in Ohio?', a: `Comprehensive orthodontic treatment of a teenager is estimated at ${K.usd(braces.charge)} before insurance in Ohio, from the Medicaid fee for code D8080 divided by the state's children's ratio. Retainers and records may be billed separately. Plans that cover orthodontics usually pay a share up to a lifetime maximum, often for children only.` },
    { q: 'How much more does an out-of-network crown cost in Ohio?', a: `With the example plan, a porcelain crown leaves about ${K.usd(pin.youPay)} to the patient in network and ${K.usd(pc.youPay)} out of network, because an office outside the network may bill the gap between its full fee of about ${K.usd(crown.charge)} and the plan's allowance. Your own plan's out-of-network rules may differ.` },
  ],
  related: ['dental-crown-cost', 'root-canal-cost', 'braces-cost', 'dental-insurance-coverage'],
});
