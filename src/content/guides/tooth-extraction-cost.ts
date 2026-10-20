import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const simple = K.spread('extraction');
const surg = K.spread('extraction_surgical');
const imp = K.spread('implant');
const bridge = K.spread('bridge3');
const EX = K.P.examplePlan;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const share = K.shareOf('extraction', 'auto');
const base = { insured: true, inNetwork: true, planShare: share, deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: 0, nextYearDeductible: 0 };
const rS = K.plan({ ...base, charge: simple.median, allowed: simple.medianAllowed });
const rW = K.plan({ ...base, charge: surg.median, allowed: surg.medianAllowed, waitMonths: EX.waitingMajorMonths, monthsCovered: 2 });

export default defineGuide({
  id: 'tooth-extraction-cost',
  group: 'procedure',
  order: 7,
  slug: 'tooth-extraction-cost',
  nav: 'Tooth extraction cost',
  card: 'Simple or surgical removal of one tooth, by state, and what a plan pays toward it.',
  title: 'Tooth Extraction Cost 2026: Simple and Surgical, by State',
  description: 'Tooth extraction cost in 2026: a simple or a surgical removal of one tooth, estimated state by state from public fee schedules, with your dental plan share.',
  h1: 'Tooth extraction cost: a simple removal or a surgical one',
  intro: 'Choose simple or surgical, your state and your plan: the estimate is for one tooth, the most common way extractions are billed.',
  resume: `Removing one erupted tooth that comes out whole with forceps, a simple extraction (code D7140), is estimated at a median ${K.usd(simple.median)} before insurance across the ${simple.n === 1 ? 'one state' : `${simple.n} states`} whose Medicaid fee schedules list it, in ${cpi} dollars. When the dentist must lift the gum, remove bone or cut the tooth into pieces, the surgical code (D7210) applies, at a median of ${K.usd(surg.median)}. Network prices that a private plan allows are lower: ${K.usd(simple.medianAllowed)} and ${K.usd(surg.medianAllowed)}. Extraction is one of the procedures the ADA uses to measure how Medicaid fees compare with dentists' charges, so these estimates rest on a code inside the measured basket. Plans differ on its class. The Covered California 2026 example plan counts oral surgery as major work, paid at ${K.pct(share, 0)} after the deductible, which leaves about ${K.usd(rS.youPay)} for a simple extraction in network. Sedation, X-rays and the replacement of the tooth are separate bills.`,
  body: (h) => `
<h2>Simple or surgical: what decides the code</h2>
<p>The code depends on how the tooth comes out, not on how much it hurts or how long the visit lasts. A simple extraction, D7140, removes a tooth that has erupted through the gum, using elevators and forceps. A surgical extraction, D7210, applies when the dentist has to open the gum, remove some bone or section the tooth. Broken teeth, teeth with curved roots and teeth that break during removal often move to the surgical code. Wisdom teeth still partly or fully under the gum have codes of their own, priced on the ${h.a('wisdom-teeth-removal-cost', 'wisdom teeth page')}.</p>
<p>That rule explains many surprises on a bill: a quote written for a simple extraction can become surgical once the work starts. Asking the office how likely that is for a given tooth, and what the surgical fee would be, avoids the shock. The written estimate can list both codes, the simple one as expected and the surgical one as possible, so that the patient and the plan know the two figures before the visit rather than after it.</p>
${h.table(['State', 'Simple (D7140)', 'Surgical (D7210)'], simple.rows.map((r) => { const s2 = surg.rows.find((x) => x.s.code === r.s.code); return [h.a(`state:${r.s.slug}`, r.s.name), K.usd(r.e.charge), s2 ? K.usd(s2.e.charge) : 'not priced']; }), `One tooth, estimated typical full fee in ${cpi} dollars, before insurance.`, ['l', 'r', 'r'])}

<h2>A procedure inside the ADA basket</h2>
<p>The estimates on this site divide each state's Medicaid fee by the ratio between Medicaid pay and dentists' charges that the ${h.src('ada_hpi_2024', 'ADA Health Policy Institute')} measured for the state. That ratio is built from a basket of common procedures, and the surgical extraction D7210 is one of them, along with exams, X-rays and fillings. For an extraction, then, the estimate applies the ratio to the kind of code it was measured on, which is not the case for crowns, dentures or braces. It remains an average for the state: offices in large cities usually charge more than rural ones.</p>
${h.mini('cost', { t: 'One extraction in your state', p: ['pr', 'sx'], d: { pr: 'extraction' } })}

<h2>The other lines on an extraction bill</h2>
<p>The extraction code covers removing the tooth and the routine care of the site. Several things are billed apart when they happen: the exam and X-ray that come first, local anesthesia beyond the routine in some offices, sedation or general anesthesia, which are timed codes, a bone graft placed in the socket to preserve it for a later implant, and a follow-up visit for a dry socket. A quote for the removal of a single tooth can therefore double once those lines are added, and the line items say why.</p>
<p>An emergency visit is another case. When a tooth is removed on the day of a painful visit, the office may bill a limited exam and an X-ray with the extraction. Plans usually pay the exam and X-ray as preventive or diagnostic care, at a higher share than the extraction itself.</p>

<h2>What plans pay, and the waiting period</h2>
<p>Plans place extractions in different classes. Some count simple extractions as basic services, paid with fillings; others, like the ${h.src('covered_ca_2026', 'Covered California 2026 plan designs')}, put oral surgery among major services. The class matters twice: it sets the plan's share, and it decides whether a waiting period applies. The example plan's ${EX.waitingMajorMonths}-month wait for major services means that a new member who has a surgical extraction in the second month pays the whole network price, ${K.usd(rW.youPay)} at the median, unless the plan waived the wait on proof of earlier coverage. The ${h.a('dental-insurance-waiting-period', 'waiting period page')} computes that cost for any date.</p>
${h.mini('waiting', { t: 'An extraction during the waiting period', p: ['mc', 'q'], d: { q: Math.round(surg.medianAllowed / 10) * 10, mc: 2 } })}

<h2>After the extraction</h2>
<p>An extraction is often the first bill of a longer plan. A missing tooth may be left as it is, or replaced by a bridge, a partial denture or an implant, each priced on its own page. At the medians of this site, a three-unit bridge is ${bridge.n ? K.usd(bridge.median) : 'not priced'} before insurance and a single implant with its crown ${imp.n ? K.usd(imp.median) : 'not priced'}, far above the extraction itself. The ${h.a('implant-vs-bridge', 'implant or bridge page')} compares those two bills.</p>
<p>Whether a tooth should be removed or saved, for instance with a root canal, is a decision for the patient and the dentist after an exam. This page gives the price of the removal; the ${h.a('root-canal-cost', 'root canal page')} gives the price of the other path, without judging between them.</p>
`,
  faqs: [
    { q: 'How much does it cost to pull a tooth in 2026?', a: `A simple extraction of one erupted tooth, code D7140, is estimated at a median ${K.usd(simple.median)} before insurance in the states priced here, in ${cpi} dollars. A surgical extraction, D7210, is about ${K.usd(surg.median)}. The exam, X-rays, sedation or a bone graft are billed separately when they are needed.` },
    { q: 'What makes an extraction surgical?', a: 'The code depends on the technique. When the tooth comes out with elevators and forceps, it is a simple extraction. When the dentist must open the gum, remove bone or cut the tooth into sections, it becomes a surgical extraction, billed under a different code at a higher fee. A tooth that breaks during removal can move from one to the other.' },
    { q: 'Does dental insurance cover tooth extractions?', a: `Most plans do, but the class differs: some pay simple extractions as basic services, others treat all oral surgery as major work. The Covered California 2026 example plan places oral surgery among major services, paid at ${K.pct(share, 0)} after the deductible, with a ${EX.waitingMajorMonths}-month waiting period for new members unless earlier coverage is shown.` },
  ],
  tool: 'cost',
  toolArg: { pr: 'extraction' },
  related: ['wisdom-teeth-removal-cost', 'root-canal-cost', 'dental-insurance-waiting-period', 'implant-vs-bridge'],
  sources: ['ada_hpi_2024', 'bls_cpi_dental', 'covered_ca_2026'],
});
