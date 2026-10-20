import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const sp = K.spread('bridge3');
const names = sp.rows.map((r) => r.s.name);
const list = names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0];
const range = sp.n > 1 ? `from ${K.usd(sp.lo!.e.charge)} in ${sp.lo!.s.name} to ${K.usd(sp.hi!.e.charge)} in ${sp.hi!.s.name}` : `${K.usd(sp.median)} in ${list}, the only state priced so far`;
const crown = K.spread('crown');
const partial = K.spread('denture_partial');
const EX = K.P.examplePlan;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const share = K.shareOf('bridge3', 'auto');
const r = K.plan({ charge: sp.median, allowed: sp.medianAllowed, insured: true, inNetwork: true, planShare: share, deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: EX.annualMax, nextYearDeductible: EX.deductible });
const perUnit = sp.median / 3;

export default defineGuide({
  id: 'dental-bridge-cost',
  group: 'procedure',
  order: 9,
  slug: 'dental-bridge-cost',
  nav: 'Dental bridge cost',
  card: 'A three-unit bridge for one missing tooth, unit by unit, by state and with a plan.',
  title: 'Dental Bridge Cost 2026: Three-Unit Price by State, Plan',
  description: `Dental bridge cost in 2026: a three-unit bridge for one missing tooth priced from state fee schedules, about ${K.usd(sp.median)} before insurance, and your plan share.`,
  h1: 'Dental bridge cost: the false tooth and the two crowns that hold it',
  intro: 'Pick a state and your coverage: the estimator adds the three units of a fixed bridge and shows what a dental plan leaves to you.',
  resume: `A fixed bridge that replaces one missing tooth is billed as three units: the false tooth in the gap, called a pontic (code D6240 or D6245), and a crown on each neighboring tooth to hold it, called a retainer (D6750, D6740 or D6790). The three together are estimated at a median ${K.usd(sp.median)} in ${cpi} dollars before insurance, ${range}, in the ${sp.n === 1 ? 'one state' : `${sp.n} states`} whose Medicaid fee schedules list a pontic and a retainer crown. That is roughly ${K.usd(perUnit)} a unit. The price a private plan allows its network dentists is lower, about ${K.usd(sp.medianAllowed)}. Bridges count as major work in most plans: with the Covered California 2026 example plan, which pays ${K.pct(share, 0)} after a ${K.usd(EX.deductible)} deductible up to ${K.usd(EX.annualMax)} a year, the plan pays ${K.usd(r.planPays)} of that network price and the patient pays ${K.usd(r.youPay)}.`,
  body: (h) => `
<h2>Three units on one bill</h2>
<p>A bridge is priced by the unit, and the units are not all alike. The pontic is the replacement tooth; it sits on the gum and is held by the two crowns cemented on the teeth at each end of the gap. Those two teeth are reshaped to receive their crowns, which is why a bridge for one missing tooth involves three teeth. Longer bridges, for two or more missing teeth in a row, add one pontic per tooth and sometimes more retainers. The estimator prices the common case of three units.</p>
<p>The codes tell the material. D6240 is a pontic of porcelain fused to a high noble metal and D6245 a porcelain or ceramic pontic; D6750 is a retainer crown of porcelain fused to high noble metal, D6740 a porcelain or ceramic retainer and D6790 a full cast high noble one. Each state's schedule lists some of these, and the first one listed in each slot is used.</p>
${h.table(['Unit', 'Codes accepted', 'Count'], [['Pontic (false tooth)', 'D6240 or D6245', '1'], ['Retainer crown', 'D6750, D6740 or D6790', '2']], 'The three units priced by the estimator.', ['l', 'l', 'r'])}

<h2>Where a bridge can be priced</h2>
<p>The estimate divides what a state's Medicaid program paid for each code on July 1, 2024 by that state's ratio between Medicaid pay and dentists' charges, measured by the ADA Health Policy Institute, then carries the result to ${cpi} with the federal price index for dental services. It needs a fee for every unit. Fixed bridges are absent from many Medicaid schedules, especially where adults have limited dental benefits, so the list of priced states is short: ${list}. The ${h.a('dental-costs-by-state', 'state comparison')} shows every procedure each schedule allows us to price.</p>
${h.mini('states', { t: 'A three-unit bridge across the priced states', p: ['bs'], d: { pr: 'bridge3' } })}
<p>A crown on a natural tooth, the same work as one retainer, is priced in more states: its median is ${K.usd(crown.median)} across ${crown.n}. Comparing that figure with a third of the bridge price is a quick check of a quote: the retainers of a bridge cost about what single crowns cost, and the pontic usually a little less.</p>

<h2>What a plan pays on a bridge</h2>
<p>Plans group bridges with crowns, dentures and implants as major services. The Covered California 2026 adult plan used as the default on this site lists prosthodontics among its major services and pays ${K.pct(share, 0)} of them after the deductible. On the median network price of ${K.usd(sp.medianAllowed)}, the yearly maximum of ${K.usd(EX.annualMax)} ${r.overMax > 0.5 ? `stops the plan's payment at ${K.usd(r.planPays)}` : `is not reached, and the plan pays ${K.usd(r.planPays)}`}. ${r.stagedExtra > 0.5 ? `When the work can be split across two plan years, a second maximum adds up to ${K.usd(r.stagedExtra)}, as the ${h.a('dental-insurance-annual-maximum', 'annual maximum page')} explains.` : `The ${h.a('dental-insurance-annual-maximum', 'annual maximum page')} shows when a larger treatment would hit the cap.`}</p>
<p>New members often meet a waiting period for major work; the example plan has ${EX.waitingMajorMonths} months, waived with proof of earlier coverage. Some plans also refuse to replace a tooth lost before the coverage began. Out of network, the plan pays its share of its own allowance and the office may bill the gap up to its full fee, which the estimator adds when you choose that option.</p>
${h.mini('cost', { t: 'Your share of a bridge, in your state and plan', p: ['sx', 'cv'], d: { pr: 'bridge3' } })}

<h2>A bridge, an implant or a partial denture: the bills</h2>
<p>The same gap can be filled in other ways, and each has its own price. ${partial.n ? `A removable partial denture with a metal framework, priced in ${partial.n} ${partial.n === 1 ? 'state' : 'states'}, has a median of ${K.usd(partial.median)} for one arch.` : 'A removable partial denture with a metal framework is another, priced on the dentures page where a schedule lists it.'} A single implant with its crown is priced in fewer states, because most Medicaid schedules do not list it. The ${h.a('implant-vs-bridge', 'implant or bridge page')} puts the two bills side by side for one state and one plan. Which option suits a given mouth is a clinical question for a dentist, who looks at the neighboring teeth, the gum and the bone; this site compares the prices only.</p>

<h2>Checking a quote</h2>
<p>Ask the office for the codes. A quote that lists one pontic and two retainers can be compared unit by unit with the estimate for your state; a large gap usually comes from extra work, such as a core buildup on a retainer tooth, a root canal or a temporary bridge, each billed on its own. Prices are higher in large cities and vary with the lab and the material. To spread the cost, the ${h.a('dental-financing', 'financing page')} shows what a card or a loan adds.</p>
`,
  faqs: [
    { q: 'How much does a three-unit dental bridge cost in 2026?', a: `In the states whose Medicaid schedules list a pontic and a retainer crown, a three-unit bridge is estimated at a median ${K.usd(sp.median)} before insurance, in ${cpi} dollars. That covers the false tooth and the two crowns holding it. Buildups, root canals or a temporary bridge are billed on top when the dentist needs them.` },
    { q: 'Is a dental bridge priced per tooth?', a: `Offices bill per unit: each pontic and each retainer crown is a line on the claim with its own code. A bridge for one missing tooth has three units, so its price is roughly three times the price of a unit, about ${K.usd(perUnit)} each at the median estimate. Longer bridges add a pontic for each extra missing tooth.` },
    { q: 'Does dental insurance pay for a bridge?', a: `Most plans pay for a bridge as a major service, often at half after the deductible, until the yearly maximum is used. With a ${K.usd(EX.annualMax)} maximum, a bridge can use up the whole year's benefit. A waiting period for major services and a missing tooth clause can delay or block payment, so a predetermination before treatment is worth asking for.` },
  ],
  tool: 'cost',
  toolArg: { pr: 'bridge3' },
  related: ['implant-vs-bridge', 'dental-crown-cost', 'dentures-cost', 'dental-insurance-annual-maximum'],
  sources: ['ada_hpi_2024', 'bls_cpi_dental', 'covered_ca_2026', 'cms_dental'],
});
