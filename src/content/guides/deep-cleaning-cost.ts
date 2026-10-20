import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const sp = K.spread('deepclean');
const range = sp.n > 1 ? `from ${K.usd(sp.lo!.e.charge)} in ${sp.lo!.s.name} to ${K.usd(sp.hi!.e.charge)} in ${sp.hi!.s.name}` : `${K.usd(sp.median)} in ${sp.rows[0]?.s.name}`;
const clean = K.spread('checkup');
const EX = K.P.examplePlan;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const share = K.shareOf('deepclean', 'auto');
const r = K.plan({ charge: sp.median, allowed: sp.medianAllowed, insured: true, inNetwork: true, planShare: share, deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: 0, nextYearDeductible: 0 });
const wait = K.plan({ charge: sp.median, allowed: sp.medianAllowed, insured: true, inNetwork: true, planShare: share, deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: EX.waitingMajorMonths, monthsCovered: 2, nextYearMax: 0, nextYearDeductible: 0 });
const quad = sp.median / 4;

export default defineGuide({
  id: 'deep-cleaning-cost',
  group: 'procedure',
  order: 11,
  slug: 'deep-cleaning-cost',
  nav: 'Deep cleaning cost',
  card: 'Scaling and root planing in four quadrants, by state, and how plans class it.',
  title: 'Deep Cleaning Cost 2026: Scaling and Root Planing by State',
  description: `Deep cleaning cost in 2026: scaling and root planing of all four quadrants priced from state fee schedules, about ${K.usd(sp.median)} before insurance, and plan share.`,
  h1: 'Deep cleaning cost: scaling and root planing, quadrant by quadrant',
  intro: 'Choose your state and your plan: the estimator prices a full-mouth deep cleaning, four quadrants, and what is left for you to pay.',
  resume: `A deep cleaning is billed as scaling and root planing, code D4341 when four or more teeth of a quadrant are treated, and the mouth has four quadrants. A full-mouth treatment is estimated at a median ${K.usd(sp.median)} in ${cpi} dollars before insurance, about ${K.usd(quad)} a quadrant, ${range}, across the ${sp.n === 1 ? 'state' : `${sp.n} states`} whose Medicaid fee schedules list the code. The network price of a private plan is lower, about ${K.usd(sp.medianAllowed)} for the four. This is not the routine cleaning of a checkup, which uses a different code and costs much less; plans treat the two very differently. The Covered California 2026 example plan places periodontics other than maintenance among major services, paid at ${K.pct(share, 0)} after the deductible, so the patient pays about ${K.usd(r.youPay)} of the network price, and nothing is paid during a waiting period for major work.`,
  body: (h) => `
<h2>How a deep cleaning is coded</h2>
<p>Scaling and root planing removes deposits below the gum line and smooths the root surfaces. Dentists bill it by quadrant: D4341 when four or more teeth in the quadrant are treated, D4342 when one to three are. Many patients need it in all four quadrants, often over two visits, and that is the case the estimator prices: four times D4341. When fewer teeth need it, the office bills D4342 for those quadrants, which usually costs less; the site does not estimate that code separately.</p>
<p>Other lines can appear on the same bill. A full-mouth debridement (D4355) is sometimes done first when deposits are too heavy for an exam; periodontal maintenance (D4910) is the cleaning that follows a deep cleaning in later visits; local anesthetic and medicine placed in pockets have their own codes. None of these is in the estimate.</p>
${h.table(['Code', 'What it is', 'In the estimate'], [['D4341', 'Scaling and root planing, four or more teeth per quadrant', 'Yes, four times'], ['D4342', 'Scaling and root planing, one to three teeth per quadrant', 'No'], ['D4355', 'Full-mouth debridement', 'No'], ['D4910', 'Periodontal maintenance', 'No']], 'Periodontal codes of the Current Dental Terminology.', ['l', 'l', 'l'])}

<h2>Deep cleaning against a routine cleaning</h2>
<p>A regular cleaning, D1110 for adults, is preventive care. Priced with an exam and bitewing X-rays, a checkup visit has a median estimate of ${K.usd(clean.median)}, and most plans pay it in full in network. A deep cleaning is treatment of gum disease, and plans pay it at the rate of its class: the difference on the bill is large, as the ${h.a('teeth-cleaning-cost', 'teeth cleaning page')} shows. Whether a mouth needs scaling and root planing is decided by a dentist from pocket depths and X-rays; this site prices the procedure and takes no position on the diagnosis.</p>
${h.mini('states', { t: 'Four quadrants of scaling and root planing, state by state', p: ['bs'], d: { pr: 'deepclean' } })}

<h2>How the price is estimated</h2>
<p>The site reads what each state's Medicaid program paid for D4341 on July 1, 2024, the date up to which the ADA Health Policy Institute collected Medicaid fees for its 2024 ratios. It divides that fee by the state's ratio between Medicaid pay and dentists' charges, multiplies by four quadrants and carries the result to ${cpi} with the federal price index for dental services. A state whose schedule has no fee for D4341 is not priced. The ${h.a('method', 'method page')} lists every schedule and its edition.</p>

<h2>What a plan pays</h2>
<p>Plans do not agree on the class of scaling and root planing. The Covered California 2026 adult plan used by default here lists periodontics other than maintenance among major services, at ${K.pct(share, 0)} after a ${K.usd(EX.deductible)} deductible, while it puts periodontal maintenance with basic services. Other plans pay deep cleanings as basic work, often at a higher share. On the median network price, the example plan pays ${K.usd(r.planPays)} and leaves ${K.usd(r.youPay)} to the patient. The calculator lets you set your own plan's percentage.</p>
<p>Timing matters for new members. With the example plan's ${EX.waitingMajorMonths}-month wait for major services, a deep cleaning two months after joining is paid by no one but the patient, who would owe the whole network price of ${K.usd(wait.youPay)}. Proof of earlier coverage lifts that wait in the example plan. The ${h.a('dental-insurance-waiting-period', 'waiting period page')} computes the gap for any plan.</p>
${h.mini('cost', { t: 'Your share of a deep cleaning, with your plan', p: ['sx', 'pc'], d: { pr: 'deepclean' } })}

<h2>Out of network, and with Medicaid</h2>
<p>Out of network, the example plan still pays its share of its own allowance, but the office can bill the gap up to its full fee. On the median estimate that gap is ${K.usd(sp.median - sp.medianAllowed)} for the four quadrants, owed by the patient on top of the coinsurance. Choosing the out of network option in the calculator adds it to your share.</p>
<p>Medicaid is a separate case. Federal rules require dental coverage for children enrolled in Medicaid, but ${h.src('cms_dental', 'the federal Medicaid agency')} leaves adult dental benefits to each state, with no minimum. Some states pay scaling and root planing for adults, others only emergency care. The ${h.a('medicaid-dental-by-state', 'Medicaid dental page')} gives the level of adult coverage reported for each state.</p>

<h2>Before the appointment</h2>
<p>Ask how many quadrants are planned and which code each will carry, D4341 or D4342, and whether maintenance visits will follow and at what interval, since each of those is billed again. Compare the per-quadrant price with the estimate for your state. Prices run higher in large cities and with periodontists than with general dentists. Without a plan, the ${h.a('dental-work-without-insurance', 'page on paying without insurance')} lists ways the bill can be lowered.</p>
`,
  faqs: [
    { q: 'How much does a deep cleaning cost without insurance?', a: `For all four quadrants of scaling and root planing, code D4341, the median estimate across the priced states is ${K.usd(sp.median)} in ${cpi} dollars, about ${K.usd(quad)} a quadrant. Fewer teeth per quadrant use code D4342 and usually cost less. Debridement, anesthetic or medicines placed in the gums are billed separately.` },
    { q: 'Is a deep cleaning covered like a regular cleaning?', a: `No. A regular cleaning is preventive and often paid in full in network. Scaling and root planing is periodontal treatment, paid at the rate of its class after the deductible. In the Covered California 2026 example plan that class is major, at ${K.pct(share, 0)}, with a waiting period for new members unless earlier coverage is proven.` },
    { q: 'Why is scaling and root planing billed per quadrant?', a: 'The code describes the work done in one quarter of the mouth, so each treated quadrant is a separate line on the claim. A dentist may treat two quadrants per visit. The count of teeth treated in each quadrant decides the code: four or more is D4341, one to three is D4342.' },
  ],
  tool: 'cost',
  toolArg: { pr: 'deepclean' },
  related: ['teeth-cleaning-cost', 'dental-insurance-coverage', 'dental-insurance-waiting-period', 'cavity-filling-cost'],
  sources: ['ada_hpi_2024', 'bls_cpi_dental', 'covered_ca_2026', 'cms_dental'],
});
