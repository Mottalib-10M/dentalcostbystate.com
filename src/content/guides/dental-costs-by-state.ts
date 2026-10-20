import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const n = K.STATES.length;
const cols = ['checkup', 'filling', 'crown', 'rootcanal_molar', 'denture_full'];
const crown = K.spread('crown');
const rc = K.spread('rootcanal_molar');
const chk = K.spread('checkup');
const gap = (s: ReturnType<typeof K.spread>) => (s.lo && s.hi ? s.hi.e.charge / s.lo.e.charge : 1);
const cell = (slug: string, id: string) => { const e = K.est(slug, id); return e.ok ? K.usd(e.charge) : 'n/a'; };
const cpi = K.month(K.P.cpiDental.latestPeriod);
const noAdult = K.STATES.filter((s) => !s.ratios.adultCharge).map((s) => s.name);
const counts = K.STATES.map((s) => ({ s, k: K.PROC_IDS.filter((id) => K.est(s.slug, id).ok).length })).sort((a, b) => b.k - a.k);

export default defineGuide({
  id: 'dental-costs-by-state',
  group: 'paying',
  order: 30,
  slug: 'dental-costs-by-state',
  nav: 'Dental costs by state',
  card: 'Every state we price, side by side, with the procedures its fee schedule covers.',
  title: 'Dental Costs by State 2026: Compare Prices Across States',
  description: `Dental costs by state in 2026: checkups, fillings, crowns, root canals and dentures compared across ${n} states, each priced from its own Medicaid fee schedule.`,
  h1: 'Dental costs by state: the same procedures, compared across the states we price',
  intro: 'Choose a procedure and the kind of price: the table ranks every state whose fee schedule lists all of its codes.',
  resume: `The price of the same dental procedure changes markedly from one state to another. Across the ${crown.n} states where a porcelain crown can be priced, the estimated full fee runs from ${K.usd(crown.lo?.e.charge ?? 0)} in ${crown.lo?.s.name ?? 'the lowest state'} to ${K.usd(crown.hi?.e.charge ?? 0)} in ${crown.hi?.s.name ?? 'the highest state'}, with a median of ${K.usd(crown.median)}. A molar root canal has a median of ${K.usd(rc.median)} across ${rc.n} states, and a checkup with cleaning and X-rays ${K.usd(chk.median)} across ${chk.n}. All prices are in ${cpi} dollars and come from one method: each state's Medicaid dental fee schedule in force on July 1, 2024, divided by that state's ratio between Medicaid pay and dentists' charges published by the ADA Health Policy Institute, then carried forward with the federal price index for dental services. ${n} states are priced so far; a state appears only when its schedule could be read and dated, and a procedure only when the schedule lists all of its codes.`,
  body: (h) => `
<h2>Why the same crown costs more in one state</h2>
<p>Dental fees follow the cost of running an office: staff wages, rent, laboratory work and the number of dentists competing in an area. They also follow what patients are used to paying and what private plans allow. None of these is the same from one state to the next, and the gap is large: for a crown, the highest state priced here is ${K.dec(gap(crown), 1)} times the lowest; for a molar root canal, ${K.dec(gap(rc), 1)} times.</p>
<p>Part of the gap in our estimates also comes from the method. A state's price is its Medicaid fee divided by its own ratio, and both the fee and the ratio are specific to the state. When a Medicaid program pays a code far above or below its usual level compared with dentists' fees, the estimate for that code moves with it. The ${h.a('method', 'method page')} lists this limit with the others, and each state page shows the fees used.</p>

<h2>The states side by side</h2>
<p>The table gives the estimated full fee, the price billed to a patient with no plan, for five common procedures. Network prices, which private plans allow, are lower and appear on each state page.</p>
${h.table(['State', 'Checkup', 'Filling', 'Crown', 'Root canal, molar', 'Full dentures'], K.STATES.map((s) => [h.a(`state:${s.slug}`, s.name), ...cols.map((id) => cell(s.slug, id))]), `Estimated full fees, ${cpi} dollars. n/a: the state's Medicaid schedule does not list every code of the procedure, or the estimate fell outside the screen described on the method page, so it is not shown.`, ['l', 'r', 'r', 'r', 'r', 'r'])}
${h.mini('states', { t: 'Rank the states for one procedure', p: ['pr'], d: { pr: 'rootcanal_molar' } })}

<h2>Why some cells are empty</h2>
<p>A procedure is priced in a state only when the state's Medicaid schedule lists every code it needs. Schedules list what the program pays for, and programs differ: some cover adult dentures but not crowns, some cover orthodontics only for children with a severe condition, and most do not pay for implants or veneers. The site does not fill a gap with a guess or a neighbor's fee. A second rule removes estimates that land far from the other states for the same procedure, below half or above twice their median, because such a gap usually means the state's Medicaid fee for that code is set on another basis than its usual level, not that dentists there charge so differently. ${counts.length ? `The schedule of ${counts[0].s.name} allows the most procedures to be priced, ${counts[0].k} of the ${K.PROC_IDS.length} on this site.` : ''}</p>
<p>${noAdult.length ? `In ${noAdult.join(', ')}, the ADA published no adult ratio for 2024 because Medicaid offered adults no dental benefit beyond emergencies, so adult procedures are estimated with the children's ratio and, where the schedule lists the codes for children only, with the children's fees. Each estimate states which.` : 'Every state priced here has an adult ratio, so adult procedures use adult figures where the schedule gives them.'}</p>

<h2>Using a state price</h2>
<p>A state estimate is an average across offices, cities and countryside. Prices in a large metropolitan area tend to sit above it, and prices in smaller towns below. Its best use is as a check on a written quote: a quote close to the state figure is ordinary; one far above it deserves a question about what it includes, code by code. The ${h.a('dental-insurance-calculator', 'insurance calculator')} then shows what a plan would pay, and the ${h.a('dental-work-without-insurance', 'page on paying without insurance')} covers the options when there is no plan.</p>
<p>Network prices follow the same order between states but sit lower, because private plans negotiate fees below what offices bill patients without a plan. A state where the full fee is high is usually also a state where the network price is high, so a plan does not erase the gap between states; it narrows it in dollars.</p>
<p>Moving across a state line for treatment is rarely as simple as the table suggests: follow-up visits, travel and the warranty an office gives on its own work all count. The comparison is most useful for people who already live near a border, or who are deciding where to have a large treatment done between two homes.</p>

<h2>States still to come</h2>
<p>Not every state publishes its dental fee schedule in a form that can be read, and some pay dentists only through managed care plans whose rates are private. Other states' schedules for July 2024 could not be found, and without them the estimate would mix fees and ratios from different years. States are added as their documents are read; the ${h.a('medicaid-dental-by-state', 'Medicaid dental page')} lists the ADA ratios of all fifty states and the District of Columbia in the meantime.</p>
`,
  faqs: [
    { q: 'Which state has the cheapest dental care?', a: `Among the states priced here, it depends on the procedure. For a porcelain crown the lowest estimate is in ${crown.lo?.s.name ?? 'the lowest state'}, at about ${K.usd(crown.lo?.e.charge ?? 0)} before insurance; for a molar root canal, in ${rc.lo?.s.name ?? 'the lowest state'}. Our estimates are state averages, and prices also differ between cities and rural areas of the same state.` },
    { q: 'Why are some procedures missing for my state?', a: 'Each price starts from what the state Medicaid program pays for every code of the procedure. When the program does not cover a code, such as an implant or an adult crown, its schedule has no fee for it and the procedure cannot be estimated there. The site leaves the cell empty rather than borrowing another state fee.' },
    { q: 'Is it worth traveling to another state for dental work?', a: 'Sometimes, for a large treatment between two nearby states, but the saving shown by state averages can shrink once travel, follow-up visits and repairs are counted. Treatment usually needs several visits, and a problem afterwards is easier to handle close to home. Compare written quotes from offices in both places rather than state averages alone.' },
  ],
  tool: 'states',
  toolArg: { pr: 'crown' },
  related: ['medicaid-dental-by-state', 'dental-work-without-insurance', 'dental-crown-cost', 'root-canal-cost'],
  sources: ['ada_hpi_2024', 'bls_cpi_dental', 'cms_dental'],
});
