import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const sp = K.spread('implant');
const names = sp.rows.map((r) => r.s.name);
const list = names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0];
const crown = K.spread('crown');
const bridge = K.spread('bridge3');
const EX = K.P.examplePlan;
const cpi = K.month(K.P.cpiDental.latestPeriod);
// Worked case: the median implant, in network, with the example plan (major class, 50 %).
const allowed = sp.medianAllowed;
const r = K.plan({ charge: sp.median, allowed, insured: true, inNetwork: true, planShare: K.shareOf('implant', 'auto'), deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: EX.annualMax, nextYearDeductible: EX.deductible });
const lines = sp.rows[0]?.e.lines ?? [];

export default defineGuide({
  id: 'dental-implant-cost',
  group: 'procedure',
  order: 1,
  slug: 'dental-implant-cost',
  nav: 'Dental implant cost',
  card: 'One implant with abutment and crown, by state, before and after a dental plan.',
  title: 'Dental Implant Cost 2026: Price by State, With Insurance',
  description: `Dental implant cost in 2026: one implant with abutment and crown priced from state fee schedules, about ${K.usd(sp.median)} before insurance, and what a plan pays.`,
  h1: 'Dental implant cost: the implant, the abutment and the crown, state by state',
  intro: 'Choose your state and your coverage: the estimator adds the three parts of a single implant and runs your plan on the total.',
  resume: `A single dental implant is three billed pieces: the implant body placed in the bone (code D6010), the abutment that connects it (D6057 or D6056) and the crown on top (D6058 or D6059). Together they are estimated at a median ${K.usd(sp.median)} in ${cpi} dollars, before any insurance, in the ${sp.n === 1 ? 'one state' : `${sp.n} states`} whose Medicaid fee schedules list all three codes: ${list}. The network price that a private dental plan allows is lower, about ${K.usd(allowed)}. Plans usually treat implants as major work and pay half after the deductible, but the yearly maximum caps what they pay: with the Covered California 2026 example plan, a ${K.usd(EX.annualMax)} maximum, the plan pays ${K.usd(r.planPays)} and the patient keeps ${K.usd(r.youPay)} of that network price. Extractions, bone grafts, scans and sedation are billed separately and are not in these figures.`,
  body: (h) => `
<h2>What a single implant is billed as</h2>
<p>An implant replaces the root and the crown of one missing tooth, and it reaches the bill as separate codes of the Current Dental Terminology. The implant body, a titanium or zirconia post placed in the jaw, is code D6010. The abutment, the connector screwed onto it, is D6057 when it is custom made and D6056 when it is prefabricated. The crown fitted on the abutment is D6058 for porcelain or ceramic and D6059 for porcelain fused to metal. The estimator adds one of each, which is the usual sequence for one tooth once the jaw has healed.</p>
<p>Most offices quote the three together, and the total is what the estimator shows. Work done before or around the implant is billed on its own: removing the tooth, a bone graft or sinus lift when the bone is too thin, a cone beam scan, a temporary tooth, sedation. A quote that seems far above the estimate often includes some of these, so it is worth asking for the codes line by line.</p>
${h.table(['Part', 'CDT code', 'What it is'], lines.map((l) => [l.label, l.code, l.code === 'D6010' ? 'Post placed in the bone' : l.code.startsWith('D605') && l.code !== 'D6058' && l.code !== 'D6059' ? 'Connector between post and crown' : 'Visible tooth']), 'Codes used by the estimator for one implant; the first code a state lists in each slot is used.', ['l', 'l', 'l'])}

<h2>Why only a few states can be priced</h2>
<p>The estimate starts from what a state's Medicaid program pays for each code, and most programs do not pay for implants at all. Of the ${K.STATES.length} schedules this site reads, ${sp.n === 1 ? 'only one lists' : `${sp.n} list`} the implant body, an abutment and an implant crown: ${list}. Elsewhere the price cannot be estimated without guessing a fee, and the site does not guess. The ${h.a('dental-costs-by-state', 'state comparison')} shows which procedures each state's schedule allows us to price.</p>
<p>The same method gives the parts that many more states list. A porcelain crown on a natural tooth, priced in ${crown.n} states, has a median of ${K.usd(crown.median)}; a three-unit bridge, priced in ${bridge.n}, ${K.usd(bridge.median)}. The ${h.a('dental-crown-cost', 'crown page')} and the ${h.a('dental-bridge-cost', 'bridge page')} give their state ranges.</p>
${h.mini('states', { t: 'Implant prices in the states that list every code', p: ['bs'], d: { pr: 'implant' } })}

<h2>What a dental plan pays toward an implant</h2>
<p>Plans that cover implants put them with major services, paid at a lower share than fillings. The Covered California 2026 adult plan used as the default here pays ${K.pct(1 - EX.memberShare.major, 0)} of major work after a ${K.usd(EX.deductible)} deductible, and nothing beyond ${K.usd(EX.annualMax)} a year. On the median network price of ${K.usd(allowed)}, half after the deductible would be ${K.usd((allowed - EX.deductible) * 0.5)}, so the maximum binds and the plan pays ${K.usd(r.planPays)}. If the dentist agrees the crown can wait until the plan year renews, a second maximum is available: the calculator puts that at ${K.usd(r.stagedExtra)} more. The ${h.a('dental-insurance-annual-maximum', 'annual maximum page')} explains this split.</p>
<p>Three clauses decide whether a plan pays at all, and they are in the benefit summary rather than on a price page. A waiting period, often several months for major services, delays any payment for new members; the example plan has ${EX.waitingMajorMonths} months for major services, waived with proof of earlier coverage. Some plans exclude the replacement of a tooth that was missing before coverage began. And some plans pay for an implant only up to the price of a cheaper alternative, such as a bridge or a partial denture. A predetermination, the plan's written answer before treatment, settles all three.</p>
${h.mini('plan', { t: 'Your share of an implant quote', p: ['q', 'mx'], d: { q: Math.round(allowed / 100) * 100, pc: '50' } })}

<h2>Medicare, Medicaid and implants</h2>
<p>Original Medicare does not cover routine dental work, and ${h.src('medicare_dental', 'Medicare.gov')} lists implants among the services it generally leaves out; some Medicare Advantage plans add dental benefits of their own. Medicaid programs must cover dental care for children, but adult benefits are left to each state, as ${h.src('cms_dental', 'the federal Medicaid agency')} states, and few include implants. The ${h.a('medicaid-dental-by-state', 'Medicaid page')} gives each state's level of adult coverage.</p>

<h2>Reading a quote against these figures</h2>
<p>An estimate is a state average for the three codes, not the price of your treatment. Fees are higher in large cities, specialists such as periodontists and oral surgeons often charge more than general dentists for the surgical part, and the crown's price depends on the material and the lab. The useful comparison is code by code: if the quote's D6010 line is close to the estimate and the total is not, the difference is in other work, which the office can explain. Paying over time is covered on the ${h.a('dental-financing', 'financing page')}, with the rates a card or a loan actually costs.</p>
<p>Whether an implant is the right treatment for a missing tooth is a clinical question that depends on the bone, the gums, the neighboring teeth and your health. This site compares prices only; the ${h.a('implant-vs-bridge', 'implant or bridge page')} sets the two bills side by side, not their medical merits.</p>
`,
  faqs: [
    { q: 'How much does one dental implant cost in 2026?', a: `In the states whose Medicaid schedules list all three codes, the implant body, the abutment and the crown together are estimated at a median ${K.usd(sp.median)} before insurance, in ${cpi} dollars. That covers one tooth after the jaw has healed. Extractions, bone grafts, scans and sedation are billed on top when they are needed.` },
    { q: 'Does dental insurance cover implants?', a: `Many plans do, as a major service paid at about half after the deductible, but the yearly maximum limits the payment. With a ${K.usd(EX.annualMax)} maximum, the plan pays at most that amount in a plan year. Check the waiting period, any missing tooth clause and whether the plan pays only the price of a cheaper alternative.` },
    { q: 'Why is an implant priced in so few states here?', a: `Our estimate divides a state's Medicaid fee for each code by that state's ratio between Medicaid pay and dentists' charges. Most Medicaid programs do not pay for implants, so their schedules have no fee for code D6010. Without that fee there is nothing to divide, and the site does not invent one.` },
    { q: 'Are implant parts billed at different visits?', a: `Usually yes. The implant body is placed first; the abutment and the crown follow once the bone has healed around the post, often months later. A plan's yearly maximum applies to each plan year, so a treatment that spans two plan years can draw on two maximums, as the estimator shows.` },
  ],
  tool: 'cost',
  toolArg: { pr: 'implant' },
  related: ['implant-vs-bridge', 'dental-crown-cost', 'dental-insurance-annual-maximum', 'dental-financing'],
  sources: ['ada_hpi_2024', 'bls_cpi_dental', 'covered_ca_2026', 'medicare_dental', 'cms_dental'],
});
