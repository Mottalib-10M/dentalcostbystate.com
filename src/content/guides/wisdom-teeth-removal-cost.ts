import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const w4 = K.spread('wisdom4');
const surg = K.spread('extraction_surgical');
const EX = K.P.examplePlan;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const share = K.shareOf('wisdom4', 'auto');
const perTooth = w4.median / 4;
const base = { charge: w4.median, allowed: w4.medianAllowed, insured: true, inNetwork: true, planShare: share, deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: 0, nextYearDeductible: 0 };
const r = K.plan(base);
const rOut = K.plan({ ...base, inNetwork: false });
const g = K.P.credit;
const months = 12;
const loan = K.loan(Math.round(r.youPay / 10) * 10, g.cardAllAccounts, months);
const codeNote = (() => { const c = new Set(w4.rows.map((x) => x.e.lines[0]?.code)); return c.has('D7230') ? 'D7240, or D7230 where a schedule lists only the partly bony code' : 'D7240'; })();

export default defineGuide({
  id: 'wisdom-teeth-removal-cost',
  group: 'procedure',
  order: 8,
  slug: 'wisdom-teeth-removal-cost',
  nav: 'Wisdom teeth removal cost',
  card: 'Four impacted wisdom teeth removed, by state, with the anesthesia bill and the plan share.',
  title: 'Wisdom Teeth Removal Cost 2026: Four Impacted Teeth by State',
  description: 'Wisdom teeth removal cost in 2026: four impacted teeth estimated state by state from public fee schedules, before and after insurance, anesthesia apart.',
  h1: 'Wisdom teeth removal cost: four impacted teeth, before and after insurance',
  intro: 'Choose your state and your coverage: the estimate prices the removal of four impacted wisdom teeth, the usual case in a quote.',
  resume: `Removing four wisdom teeth that are impacted in bone, the case most quotes describe, is estimated at a median ${K.usd(w4.median)} before insurance across the ${w4.n === 1 ? 'one state' : `${w4.n} states`} whose Medicaid fee schedules list the code, in ${cpi} dollars, or about ${K.usd(perTooth)} a tooth. The code used is ${codeNote}, for a tooth fully covered by bone; a tooth only under the gum costs less, one deep in bone with complications more. A private plan's network price for the four is about ${K.usd(w4.medianAllowed)}. The Covered California 2026 example plan pays oral surgery at ${K.pct(share, 0)} after a ${K.usd(EX.deductible)} deductible and stops at a ${K.usd(EX.annualMax)} yearly maximum, which leaves the patient ${K.usd(r.youPay)} in network. Sedation or general anesthesia, the consultation and the panoramic X-ray are billed on top, and in many offices the anesthesia is the largest of those lines.`,
  body: (h) => `
<h2>How impaction sets the price</h2>
<p>Wisdom teeth are the third molars, and their removal is billed tooth by tooth under codes that describe how deep each one sits. A wisdom tooth that has erupted is removed like any other tooth, under the simple or surgical extraction codes. One still covered by gum only is coded D7220, soft tissue impaction. One partly in bone is D7230, and one completely in bone is D7240, the code this page uses for all four teeth. A tooth in bone with unusual complications, such as roots close to a nerve, has a further code at a higher fee.</p>
<p>An office's quote for "four wisdom teeth" therefore depends on what the X-ray shows. Two upper teeth under the gum and two lower teeth in bone can cost noticeably less than four teeth fully in bone. The estimate here is the full-bony case, the upper end of the usual range, so a quote below it is not unusual.</p>
<p>The depth of each tooth is read on the X-ray before the surgery, and it is that reading the office uses to choose the codes on its estimate. If the written estimate lists four teeth in bone but the patient was told two are only under the gum, the difference is worth a question before the day of surgery, since it changes both the fee and the plan's payment. A second opinion on the X-ray is also a common step before a surgery of this size, and its cost is usually limited to a consultation.</p>
${h.table(['State', 'Four teeth, full fee', 'Four teeth, in network', 'Per tooth'], w4.rows.slice().sort((a, b) => b.e.charge - a.e.charge).map((x) => [h.a(`state:${x.s.slug}`, x.s.name), K.usd(x.e.charge), K.usd(x.e.allowed), K.usd(x.e.charge / 4)]), `Removal of impacted teeth, completely bony, estimated typical charges in ${cpi} dollars, anesthesia excluded.`, ['l', 'r', 'r', 'r'])}

<h2>The lines around the surgery</h2>
<p>The extraction codes cover the removal itself. Around it, a typical bill also lists the consultation, a panoramic X-ray or a cone beam scan, and the anesthesia. Local anesthesia is usually part of the extraction. Intravenous sedation and general anesthesia are separate codes billed by the quarter hour, so their cost grows with the length of the surgery, and they are usually given by an oral surgeon or a dental anesthesiologist. Those charges are not in the estimate on this page, and the schedules read for it do not give them in a form that can be summed.</p>
<p>Plans often treat the anesthesia differently from the extraction. Some pay general anesthesia only with surgical removals of impacted teeth, some only when it is medically required, and some not at all. Asking the office for the anesthesia codes, and the plan for a predetermination that includes them, gives the complete picture before the day of surgery.</p>
${h.mini('cost', { t: 'Four wisdom teeth in your state', p: ['sx', 'cv'], d: { pr: 'wisdom4' } })}

<h2>Insurance, the maximum and the network</h2>
<p>Four bony extractions at the median network price of ${K.usd(w4.medianAllowed)} would draw ${K.usd((w4.medianAllowed - EX.deductible) * share)} from a plan paying ${K.pct(share, 0)} after its deductible. The example plan's yearly maximum ${r.overMax > 0.5 ? `cuts that to ${K.usd(r.planPays)}` : 'leaves room for it'}, and the anesthesia, if covered, would draw on the same maximum. Out of network, the oral surgeon can bill up to the full fee, so the patient's share rises to about ${K.usd(rOut.youPay)} before anesthesia. Oral surgeons are not always in the networks of the general dentists who refer to them, which makes the network question worth asking twice.</p>
<p>Students and young adults often have dental coverage through a parent's plan, a school plan or a marketplace plan, and the dates of the plan year matter: removing two teeth in December and two in January can use two yearly maximums. The ${h.a('dental-insurance-annual-maximum', 'annual maximum page')} shows the effect for any total.</p>
${h.mini('max', { t: 'Wisdom teeth against a yearly maximum', p: ['q', 'am'], d: { q: Math.round(w4.medianAllowed / 100) * 100 } })}

<h2>Paying the balance</h2>
<p>For the share left after the plan, at the median ${K.usd(r.youPay)} before anesthesia, a credit card charging the Federal Reserve's average rate for all accounts, ${K.pct(g.cardAllAccounts / 100, 2)} in ${K.month(g.period)}, would cost ${K.usd(loan.monthly)} a month over ${months} months. The ${h.a('dental-financing', 'financing page')} compares that with a personal loan and explains how a deferred interest promotion can charge the interest of the whole period at once.</p>
<p>A single surgical extraction of an erupted tooth, for comparison, is estimated at ${K.usd(surg.median)} on the ${h.a('tooth-extraction-cost', 'extraction page')}. Whether wisdom teeth should come out, and when, is a clinical question for the dentist or oral surgeon who examines them; this page prices the work once that decision is made.</p>
`,
  faqs: [
    { q: 'How much does it cost to remove all four wisdom teeth?', a: `Four wisdom teeth impacted in bone are estimated at a median ${K.usd(w4.median)} before insurance in the states priced here, in ${cpi} dollars, anesthesia excluded. Teeth only under the gum cost less, and teeth with complications more. Sedation or general anesthesia, the consultation and the X-rays are billed on top of that amount.` },
    { q: 'Is anesthesia included in the price of wisdom teeth removal?', a: 'Local anesthesia usually is. Intravenous sedation and general anesthesia are separate codes, billed by the quarter hour, so their price depends on how long the surgery lasts. Plans differ on whether they pay them. The office can list the anesthesia codes in its written estimate, and the plan can confirm its payment beforehand.' },
    { q: 'Does insurance pay for wisdom teeth removal?', a: `Most plans pay part of it, often as oral surgery among major services. With the Covered California 2026 example plan, which pays ${K.pct(share, 0)} after the deductible and stops at ${K.usd(EX.annualMax)} a year, four bony extractions at the median network price leave the patient about ${K.usd(r.youPay)} before anesthesia.` },
  ],
  tool: 'cost',
  toolArg: { pr: 'wisdom4' },
  related: ['tooth-extraction-cost', 'dental-insurance-annual-maximum', 'dental-financing', 'dental-insurance-calculator'],
  sources: ['ada_hpi_2024', 'bls_cpi_dental', 'covered_ca_2026', 'fed_g19'],
});
