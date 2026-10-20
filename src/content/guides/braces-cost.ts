import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const sp = K.spread('braces_teen');
const ad = K.spread('braces_adult');
const names = (s: ReturnType<typeof K.spread>) => { const n = s.rows.map((r) => r.s.name); return n.length > 1 ? `${n.slice(0, -1).join(', ')} and ${n[n.length - 1]}` : n[0] ?? 'no state'; };
const EX = K.P.examplePlan;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const kidShare = 1 - EX.childOrthoMemberShare;
// Medically necessary braces of a child under the example plan: half of the network price after the child deductible.
const kidPays = Math.max(0, sp.medianAllowed - EX.childDeductible) * kidShare;
const span = sp.n > 1 ? `from ${K.usd(sp.lo!.e.charge)} in ${sp.lo!.s.name} to ${K.usd(sp.hi!.e.charge)} in ${sp.hi!.s.name}` : `${K.usd(sp.median)} in ${names(sp)}`;

export default defineGuide({
  id: 'braces-cost',
  group: 'procedure',
  order: 2,
  slug: 'braces-cost',
  nav: 'Braces cost',
  card: 'A full orthodontic treatment for a teenager or an adult, by state, and what a plan pays.',
  title: 'Braces Cost 2026: Teen and Adult Orthodontics by State',
  description: 'Braces cost in 2026: full orthodontic treatment for a teenager or an adult, estimated state by state from public fee schedules, with insurance and its limits.',
  h1: 'Braces cost: a full orthodontic treatment, for a teenager or an adult',
  intro: 'Pick your state and whether a plan helps: the estimate covers the whole treatment, from fitting the brackets to taking them off.',
  resume: `Comprehensive orthodontic treatment of a teenager, the code a dentist bills for a full set of braces from start to finish (D8080), is estimated at a median ${K.usd(sp.median)} before insurance across the ${sp.n === 1 ? 'one state' : `${sp.n} states`} whose Medicaid fee schedules list it, in ${cpi} dollars: ${span}. The network price a private plan allows is lower, about ${K.usd(sp.medianAllowed)}. The fee is for the whole treatment, usually paid in installments over the months the braces are worn, and the retainers that follow are billed apart. Coverage is narrow. The Covered California 2026 example plan pays no orthodontics for adults and pays ${K.pct(kidShare, 0)} for children only when the treatment is medically necessary. Many employer plans add a lifetime orthodontic maximum, a separate amount that, once used, ends the plan's payments for braces.`,
  body: (h) => `
<h2>One fee for the whole treatment</h2>
<p>Unlike a filling or a crown, braces are not billed visit by visit. The office sets one price for the comprehensive treatment of the mouth, which covers the records, the brackets and wires, the adjustment visits and the removal, and spreads the payments over the months of treatment. The dental terminology has two codes for it, chosen by the stage of the patient's teeth: D8080 for an adolescent, D8090 for an adult. A limited treatment that moves a few teeth has codes of its own and costs less; the estimator prices the comprehensive one, which is what most families are quoted.</p>
<p>What follows the brackets is billed separately. Retainers, the devices that hold the teeth in place afterwards, have their own codes, as do replacements when one is lost. The first consultation and the X-rays may also appear apart from the treatment fee. When two quotes differ, asking each office which of these items its price includes is often enough to explain the gap, since one may bundle the retainers and records while the other lists them as extras at the end.</p>

<h2>Teen braces across the states priced here</h2>
<p>Medicaid programs must cover dental care for children, as ${h.src('cms_dental', 'the federal Medicaid agency')} recalls, and many state schedules include comprehensive orthodontics for adolescents when a severe condition makes it medically necessary. That makes D8080 one of the codes listed widely enough to compare. The estimate divides each state's fee by the state's ratio between Medicaid pay and dentists' charges for children's care, then brings it to ${cpi}.</p>
${h.table(['State', 'Full fee', 'In network'], sp.rows.slice().sort((a, b) => b.e.charge - a.e.charge).map((r) => [h.a(`state:${r.s.slug}`, r.s.name), K.usd(r.e.charge), K.usd(r.e.allowed)]), `Comprehensive orthodontic treatment of an adolescent (D8080), estimated typical charge in ${cpi} dollars.`, ['l', 'r', 'r'])}
<p>Gaps between states partly reflect what orthodontists charge locally and partly how each Medicaid program pays this one code compared with the basket of common services the ratio is measured on. A state that pays orthodontics generously relative to cleanings and fillings shows a higher estimate than its local fees justify, and the reverse. The ${h.a('method', 'method page')} lists that limit; the figure is a range to hold a quote against, not a verdict on it.</p>
${h.mini('cost', { t: 'Teen braces in your state', p: ['sx', 'cv'], d: { pr: 'braces_teen' } })}

<h2>Adult orthodontics</h2>
<p>Adults are treated under D8090. Fewer schedules list it, because few Medicaid programs pay orthodontics for adults: the estimate exists for ${ad.n === 1 ? 'one state' : `${ad.n} states`} (${names(ad)}), with a median of ${K.usd(ad.median)}. The work itself is often longer for adults, whose bones have stopped growing, and clear aligners are billed under the same comprehensive codes as metal brackets. The ${h.a('invisalign-cost', 'aligners page')} explains why no public document gives a price for a particular brand.</p>

<h2>How dental plans treat braces</h2>
<p>Orthodontics sits in a class of its own in most plans, outside the yearly maximum that applies to fillings and crowns. Plans that include it often pay half and stop at a lifetime orthodontic maximum written in the benefit summary; once that amount has been paid, the rest of the treatment, and any later one, falls to the family. Many plans also set an age limit, covering children and teenagers only.</p>
<p>The example plan of this site, Covered California's 2026 family dental plan, is stricter: it pays nothing toward orthodontics for adults, and for children it pays ${K.pct(kidShare, 0)} only for ${EX.childOrthoNote.toLowerCase()}, under a children's deductible of ${K.usd(EX.childDeductible)}. On the median network price of ${K.usd(sp.medianAllowed)}, that share would come to about ${K.usd(kidPays)}, leaving ${K.usd(sp.medianAllowed - kidPays)} to the family. Treatment chosen for appearance alone is not covered by that plan. To see your own case, type your plan's share and the orthodontic maximum you have left into the estimator's fields. A child who changes plans in the middle of a treatment can also lose part of the benefit, since many plans pay orthodontics in installments only while the patient stays enrolled.</p>
${h.mini('plan', { t: 'Your share of an orthodontic quote', p: ['q', 'mx'], d: { q: Math.round(sp.medianAllowed / 100) * 100, pc: '50', mx: Math.round(sp.medianAllowed / 200) * 100 } })}

<h2>Paying over the months of treatment</h2>
<p>Because the fee is spread over the treatment, many offices offer their own payment schedule: a down payment, then monthly amounts until the braces come off. That arrangement differs from a credit card or a medical credit line, where interest can apply. The ${h.a('dental-financing', 'financing page')} computes what a card or a loan adds at the rates the Federal Reserve reports, and how a deferred interest promotion works if the balance is not cleared in time.</p>
<p>Whether a child needs braces, and when, is a decision for the family and the orthodontist. This page prices the treatment; it does not judge it.</p>
`,
  faqs: [
    { q: 'How much do braces cost for a teenager in 2026?', a: `A comprehensive treatment for an adolescent, code D8080, is estimated at a median ${K.usd(sp.median)} before insurance in the states priced here, in ${cpi} dollars. The fee usually covers the whole treatment, paid in installments, while retainers afterwards are billed apart. The table on this page gives the estimate for each state.` },
    { q: 'Does dental insurance pay for braces?', a: `Some plans do, usually at about half, up to a lifetime orthodontic maximum written in the benefit summary, and often only for children. The Covered California 2026 example plan pays ${K.pct(kidShare, 0)} for medically necessary orthodontics of children and nothing for adults. Ask the plan for a predetermination before the treatment starts.` },
    { q: 'What is an orthodontic lifetime maximum?', a: 'It is the total a plan will ever pay toward orthodontics for one person, separate from the yearly maximum for other dental work. Once it has been paid, further orthodontic treatment for that person is not covered. Plans state the amount in their benefit summary, and it varies widely from one plan to another.' },
    { q: 'Are adult braces billed differently from teen braces?', a: `Yes, under a separate code, D8090, though the work is similar. Few Medicaid schedules list it, so fewer states can be priced: the median here is ${K.usd(ad.median)}. Many dental plans limit orthodontic benefits to children, and the Covered California example plan does not cover adult orthodontics at all.` },
  ],
  tool: 'cost',
  toolArg: { pr: 'braces_teen' },
  related: ['invisalign-cost', 'dental-insurance-coverage', 'dental-financing', 'dental-costs-by-state'],
  sources: ['ada_hpi_2024', 'bls_cpi_dental', 'covered_ca_2026', 'cms_dental'],
});
