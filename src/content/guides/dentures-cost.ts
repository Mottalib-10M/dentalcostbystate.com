import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const full = K.spread('denture_full');
const one = K.spread('denture_upper');
const part = K.spread('denture_partial');
const ext = K.spread('extraction');
const EX = K.P.examplePlan;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const share = K.shareOf('denture_full', 'auto');
const r = K.plan({ charge: full.median, allowed: full.medianAllowed, insured: true, inNetwork: true, planShare: share, deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: EX.annualMax, nextYearDeductible: EX.deductible });
const row = (label: string, codes: string, s: ReturnType<typeof K.spread>) => [label, codes, s.n ? K.usd(s.median) : 'not priced', s.n ? K.usd(s.medianAllowed) : 'not priced', String(s.n)];

export default defineGuide({
  id: 'dentures-cost',
  group: 'procedure',
  order: 6,
  slug: 'dentures-cost',
  nav: 'Dentures cost',
  card: 'Complete dentures for one or both arches, or a partial, by state, and what Medicare and plans pay.',
  title: 'Dentures Cost 2026: Full, Upper or Partial Dentures by State',
  description: 'Dentures cost in 2026: complete dentures for both arches, one arch or a partial, estimated by state from public fee schedules, and what Medicare and plans pay.',
  h1: 'Dentures cost: complete dentures, one arch or a partial, state by state',
  intro: 'Pick the kind of denture, your state and your plan: the estimate covers the appliance itself, the extractions are a separate bill.',
  resume: `A complete set of dentures, upper and lower (codes D5110 and D5120), is estimated at a median ${K.usd(full.median)} before insurance across the ${full.n === 1 ? 'one state' : `${full.n} states`} whose Medicaid fee schedules list both, in ${cpi} dollars. One complete denture for a single arch is about ${K.usd(one.median)}, and a partial denture on a cast metal framework, which replaces some teeth and clips to the others, ${part.n ? `about ${K.usd(part.median)}` : 'cannot be priced from the schedules read'}. Network prices are lower: ${K.usd(full.medianAllowed)} for the full set. Dental plans usually class dentures as major work. The Covered California 2026 example plan pays ${K.pct(share, 0)} after a ${K.usd(EX.deductible)} deductible but no more than ${K.usd(EX.annualMax)} a year, so on a full set at the median network price it pays ${K.usd(r.planPays)} and the patient keeps ${K.usd(r.youPay)}. Original Medicare does not pay for dentures. Removing remaining teeth is billed apart.`,
  body: (h) => `
<h2>Three kinds of denture, three prices</h2>
<p>The dental terminology separates the appliance by how much of the mouth it replaces. A complete denture replaces every tooth of one arch, upper (D5110) or lower (D5120). A partial denture replaces some teeth of an arch and holds on to the natural teeth left; the cast metal framework kind (D5213 for the upper arch, D5214 for the lower) is the one estimated here, while resin partials have cheaper codes of their own. The table gives each across the states priced on this site.</p>
${h.table(['Denture', 'CDT codes', 'Full fee, median', 'In network, median', 'States'], [row('Complete, both arches', 'D5110 + D5120', full), row('Complete, one arch', 'D5110', one), row('Partial, metal framework', 'D5213 or D5214', part)], `Estimated typical charges in ${cpi} dollars. Extractions, relines and adjustments after the first months are billed apart.`, ['l', 'l', 'r', 'r', 'r'])}
<p>The fee for a denture code covers making and fitting the appliance, usually with a few adjustment visits in the first months. What it does not cover is listed separately on a quote: removing the remaining teeth, an immediate denture worn while the gums heal, relines that refit the base as the gums change, and repairs.</p>

<h2>The bill before the denture</h2>
<p>Many people who need complete dentures still have some teeth to remove first. Each removal is a separate code, priced on the ${h.a('tooth-extraction-cost', 'extraction page')}: a simple extraction has a median of ${K.usd(ext.median)} before insurance here, and surgical removals cost more. A mouth with several teeth left can therefore add a large amount before the denture is made. A quote that gives one total for the whole plan can be compared with the estimate only once those lines are separated.</p>
<p>The sequence also affects the plan. If the extractions fall in one plan year and the denture in the next, the plan's yearly maximum applies twice. If both fall in the same year, the maximum can run out on the extractions. The estimator's option to split over two plan years shows the effect.</p>
${h.mini('cost', { t: 'Dentures in your state, with your plan', p: ['pr', 'sx'], d: { pr: 'denture_full' } })}

<h2>What plans and public programs pay</h2>
<p>Private dental plans that cover dentures usually put them with major services. The ${h.src('covered_ca_2026', 'Covered California 2026 plan designs')} list prosthodontics, the specialty of dentures and bridges, among major services paid at ${K.pct(share, 0)}. With its ${K.usd(EX.annualMax)} maximum, a full set at the median network price exceeds what the plan can pay in one year, which is why the plan's payment stops at ${K.usd(r.planPays)}. Plans also limit how often a denture is replaced, commonly once in a set number of years, and may exclude replacing teeth lost before the coverage began.</p>
<p>${h.src('medicare_dental', 'Medicare.gov')} states that Original Medicare does not cover most dental care, and dentures are among the items it leaves out; some Medicare Advantage plans include dental benefits with their own limits. Medicaid covers dental care for children everywhere, while adult benefits depend on the state, and dentures are one of the services where state programs differ most. The ${h.a('medicaid-dental-by-state', 'Medicaid page')} gives each state's level of adult benefit as classified in 2024.</p>
${h.mini('plan', { t: 'Your share of a denture quote', p: ['q', 'mx'], d: { q: Math.round(full.medianAllowed / 100) * 100, pc: '50' } })}

<h2>Comparing quotes</h2>
<p>Denture prices vary with the materials of the base and the teeth, the number of try-in visits, and whether the office or a lab makes the appliance. Offices that focus on dentures often advertise one price for a set, which may or may not include extractions, relines or adjustments. The estimate for your state describes the typical charge for the appliance codes only, so it compares best with the line of a quote that names those codes. Asking each office for a written plan that lists every visit, every code and what happens if the denture needs to be remade during the first months makes two offers comparable, and it shows which costs are fixed and which may come later.</p>
<p>Dentures are one way to replace missing teeth among several, with implants and bridges among the others, and each carries a different bill over the years. The ${h.a('implant-vs-bridge', 'implant or bridge page')} sets two of those bills side by side. Which treatment suits a mouth is for the patient and the dentist to decide; this page only prices it.</p>
<p>For a patient paying the whole bill, the ${h.a('dental-financing', 'financing page')} shows what spreading it over a year or two costs at the rates the Federal Reserve reports for cards and personal loans.</p>
`,
  faqs: [
    { q: 'How much does a full set of dentures cost in 2026?', a: `Complete dentures for both arches, codes D5110 and D5120, are estimated at a median ${K.usd(full.median)} before insurance in the states priced here, in ${cpi} dollars. One arch alone is about ${K.usd(one.median)}. Removing remaining teeth, an immediate denture and later relines are billed separately and add to the total.` },
    { q: 'Does Medicare pay for dentures?', a: 'Original Medicare does not cover most dental care, and Medicare.gov lists dentures among the services it generally leaves out. Some Medicare Advantage plans include dental benefits that may help with dentures, within their own yearly limits. The plan\'s evidence of coverage says what it pays and how often a denture can be replaced.' },
    { q: 'Is a partial denture cheaper than a complete one?', a: `A partial denture on a metal framework replaces only some teeth of an arch and clips to the natural teeth that remain. ${part.n ? `It is estimated at a median ${K.usd(part.median)} here, against ${K.usd(one.median)} for a complete denture of one arch.` : 'Its codes are missing from the schedules read, so it is not priced here.'} Resin partials, a cheaper kind, have their own codes.` },
  ],
  tool: 'cost',
  toolArg: { pr: 'denture_full' },
  related: ['tooth-extraction-cost', 'implant-vs-bridge', 'medicaid-dental-by-state', 'dental-financing'],
  sources: ['ada_hpi_2024', 'bls_cpi_dental', 'covered_ca_2026', 'medicare_dental', 'cms_dental'],
});
