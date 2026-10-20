import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const sp = K.spread('crown');
const names = (s: ReturnType<typeof K.spread>) => { const n = s.rows.map((r) => r.s.name); return n.length > 1 ? `${n.slice(0, -1).join(', ')} and ${n[n.length - 1]}` : n[0] ?? 'no state'; };
const EX = K.P.examplePlan;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const share = K.shareOf('crown', 'auto');
const base = { charge: sp.median, allowed: sp.medianAllowed, insured: true, planShare: share, deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: 0, nextYearDeductible: 0 };
const inN = K.plan({ ...base, inNetwork: true });
const outN = K.plan({ ...base, inNetwork: false });
// Three crowns in one plan year: the yearly maximum starts to bite.
const three = K.plan({ ...base, charge: sp.median * 3, allowed: sp.medianAllowed * 3, inNetwork: true });
const span = sp.n > 1 ? `from ${K.usd(sp.lo!.e.charge)} in ${sp.lo!.s.name} to ${K.usd(sp.hi!.e.charge)} in ${sp.hi!.s.name}` : `in ${names(sp)}`;

export default defineGuide({
  id: 'dental-crown-cost',
  group: 'procedure',
  order: 4,
  slug: 'dental-crown-cost',
  nav: 'Dental crown cost',
  card: 'A porcelain or ceramic crown by state, in and out of network, and how much a plan pays.',
  title: 'Dental Crown Cost 2026: Porcelain Crown Price by State',
  description: 'Dental crown cost in 2026: a porcelain or ceramic crown estimated state by state from public fee schedules, in and out of network, and what a plan leaves you.',
  h1: 'Dental crown cost: one porcelain or ceramic crown, before and after insurance',
  intro: 'Set your state and your plan: the estimator prices one crown and shows the share left to you in network or out of it.',
  resume: `A porcelain or ceramic crown on a natural tooth (code D2740, or D2750 when the schedule prices only the porcelain fused to metal kind) is estimated at a median ${K.usd(sp.median)} before insurance across the ${sp.n === 1 ? 'one state' : `${sp.n} states`} whose Medicaid fee schedules list it, ${span}, in ${cpi} dollars. A private plan's network price is lower, about ${K.usd(sp.medianAllowed)}. Most plans class crowns as major services. With the Covered California 2026 example plan, which pays ${K.pct(share, 0)} of major work after a ${K.usd(EX.deductible)} deductible, an in-network crown at that price leaves the patient about ${K.usd(inN.youPay)}. Out of network the plan pays the same amount but the office may bill up to its full fee, so the patient's share rises to about ${K.usd(outN.youPay)}. A core buildup or a root canal done before the crown is billed separately.`,
  body: (h) => `
<h2>What the crown fee covers</h2>
<p>A crown is a cap made in a laboratory or milled in the office that covers the whole visible part of a damaged tooth. The fee for code D2740 usually includes shaping the tooth, the impression or scan, a temporary crown and fitting the final one. Some work around it has its own code: a buildup that rebuilds a broken tooth before it is shaped, a root canal when the nerve is involved, a post. A quote that adds those lines is not unusual, and the ${h.a('root-canal-cost', 'root canal page')} prices the most common one.</p>
<p>Materials also change the fee. All-ceramic crowns, porcelain fused to metal and gold each have their own code, and many Medicaid schedules list only some of them. The estimator uses the porcelain or ceramic code where it exists, and the porcelain fused to metal one otherwise.</p>
<p>A crown placed on an implant is a different code again, part of the implant bill rather than this one, and the ${h.a('dental-implant-cost', 'implant page')} counts it there. A crown that holds a bridge, called a retainer, also has codes of its own. When a quote mentions a crown, the code on the line says which of these it is, and the office can give it before any work begins. Asking for the codes is the simplest way to compare two offices, or to compare one office with the estimate for its state.</p>
<p>How long the crown lasts, and whether it is replaced under the plan, is also in the benefit summary: many plans pay for a new crown on the same tooth only after a set number of years. A replacement inside that period falls to the patient even when the plan is otherwise generous.</p>

<h2>State by state</h2>
${h.table(['State', 'Full fee', 'In network', 'Medicaid fee, 2024'], sp.rows.slice().sort((a, b) => b.e.charge - a.e.charge).map((r) => [h.a(`state:${r.s.slug}`, r.s.name), K.usd(r.e.charge), K.usd(r.e.allowed), K.usd(r.e.medicaid)]), `One crown, estimated typical charge in ${cpi} dollars.`, ['l', 'r', 'r', 'r'])}
<p>The spread between states comes from two sources at once: what dentists charge locally, and how generously each Medicaid program pays crowns compared with the cleanings and fillings on which the ${h.src('ada_hpi_2024', 'ADA ratio')} is measured. A program that pays crowns at a low rate relative to its other fees produces a low estimate, and the reverse. Where the gap looks large, the ${h.a('method', 'method page')} explains which part of it is measurement and which part is price.</p>
<p>Crown codes appear in more of the schedules read here than implant or veneer codes, so a crown can be priced in more states. That makes them a good yardstick for a dental bill in general: if a state's crown estimate is high compared with its neighbors, its other major work tends to be too.</p>
${h.mini('cost', { t: 'One crown in your state, with your plan', p: ['sx', 'cv'], d: { pr: 'crown' } })}

<h2>In network or out of network</h2>
<p>The plan's network price matters as much as its percentage. In network, the dentist has agreed to the plan's fee, so the patient owes only the part the plan does not pay of that lower amount. Out of network, the plan usually pays its share of its own allowed amount, and the office can ask the patient for the difference up to its full fee. On a crown at the median prices of this page, that difference moves the patient's share from ${K.usd(inN.youPay)} to ${K.usd(outN.youPay)}, the plan's payment staying at ${K.usd(inN.planPays)} in both cases. The estimator shows the gap for any state with the coverage field.</p>

<h2>Several crowns in one year</h2>
<p>The yearly maximum changes the picture when a mouth needs more than one crown. With the example plan's ${K.usd(EX.annualMax)} maximum, three crowns at the median network price would ask the plan for more than it can pay in one plan year: it pays ${K.usd(three.planPays)}, and ${K.usd(three.overMax)} of what would have been its share falls to the patient. Spacing the work over two plan years, when the dentist agrees that one tooth can wait, brings a second maximum into play. The ${h.a('dental-insurance-annual-maximum', 'annual maximum page')} runs that calculation for any total.</p>
${h.mini('max', { t: 'Several crowns against a yearly maximum', p: ['q', 'am'], d: { q: Math.round((sp.medianAllowed * 3) / 100) * 100 } })}
<p>New members should also read the waiting period. The Covered California example plan applies ${EX.waitingMajorMonths} months to major services, waived with proof of earlier coverage; until then a crown is paid entirely by the patient. The ${h.a('dental-insurance-waiting-period', 'waiting period page')} computes the cost of starting early.</p>
<p>Whether a tooth needs a crown, a large filling or another treatment is a clinical decision for the dentist who examines it. These figures help read the price once that decision is made.</p>
`,
  faqs: [
    { q: 'How much does a dental crown cost in 2026?', a: `One porcelain or ceramic crown is estimated at a median ${K.usd(sp.median)} before insurance in the states priced here, in ${cpi} dollars, with a network price around ${K.usd(sp.medianAllowed)}. Buildups, posts or a root canal done first are billed apart. The state table on this page shows the range from one state to another.` },
    { q: 'How much does insurance pay for a crown?', a: `Most plans class crowns as major work and pay about half after the deductible. With the Covered California 2026 example plan, an in-network crown at the median network price leaves the patient about ${K.usd(inN.youPay)}. The yearly maximum limits what the plan pays when several crowns are done in the same plan year.` },
    { q: 'Why does an out-of-network crown cost me more?', a: 'Out of network, the dentist has not agreed to the plan\'s fee. The plan pays its share of its own allowed amount, and the office can bill you the difference up to its usual charge, called balance billing. Asking the office whether it is in your plan\'s network before the work avoids the surprise.' },
  ],
  tool: 'cost',
  toolArg: { pr: 'crown' },
  related: ['root-canal-cost', 'dental-insurance-annual-maximum', 'dental-implant-cost', 'dental-insurance-calculator'],
  sources: ['ada_hpi_2024', 'bls_cpi_dental', 'covered_ca_2026'],
});
