import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const EX = K.P.examplePlan;
const W = EX.waitingMajorMonths;
const major = 1 - EX.memberShare.major;
const rc = K.spread('rootcanal_molar');
const crown = K.spread('crown');
const price = rc.medianAllowed;
const base = { charge: price, allowed: price, insured: true, inNetwork: true, planShare: major, deductibleLeft: EX.deductible, maxLeft: EX.annualMax, nextYearMax: 0, nextYearDeductible: 0 };
const early = Math.max(1, Math.floor(W / 2));
const now = K.plan({ ...base, waitMonths: W, monthsCovered: early });
const later = K.plan({ ...base, waitMonths: W, monthsCovered: W });
const fill = K.spread('filling');

export default defineGuide({
  id: 'dental-insurance-waiting-period',
  group: 'insurance',
  order: 23,
  slug: 'dental-insurance-waiting-period',
  nav: 'Waiting periods',
  card: 'Months before a new plan pays for major work, and what treating early costs.',
  title: 'Dental Insurance Waiting Period 2026: Months Before Coverage',
  description: `Dental insurance waiting period in 2026: how many months a new plan makes you wait for major work, how earlier coverage waives it, and what acting early costs.`,
  h1: 'Dental insurance waiting periods: when a new plan starts paying for each class',
  intro: 'Enter the waiting period in your policy and the months you will have been covered: the calculator says whether the plan pays and what waiting saves.',
  resume: `Many dental plans make new members wait before they pay for some classes of work. Preventive care is usually covered from the first day; basic and especially major services, such as crowns, root canals, dentures and bridges, can carry a wait of several months. In the Covered California 2026 example plan, major services have a waiting period of ${W} months for adults, which the plan waives when the member shows proof of earlier dental coverage. During the wait the plan pays nothing for that class, whatever its percentage. A molar root canal at the median network price of the states priced here, ${K.usd(price)}, done ${early} months into the plan, is paid in full by the patient. The same work once the ${W} months have passed leaves ${K.usd(later.youPay)} to the patient, a difference of ${K.usd(now.youPay - later.youPay)}. Whether a tooth can wait that long is for a dentist to say.`,
  body: (h) => `
<h2>Why plans have waiting periods</h2>
<p>A dental plan priced for a group of members assumes that most of them will need only checkups and small repairs in a given year. If people could join when they already know they need a crown, claim it, and leave, premiums would have to rise for everyone. A waiting period limits that by making the plan's share of expensive classes start only after a member has paid premiums for some time. It works like the waiting period of many other kinds of cover, applied class by class.</p>
<p>The period is written in the benefit summary, usually as a number of months for each class. The clock starts on the coverage effective date, not on the date of application. Plans bought individually tend to have longer waits than employer plans, which often have none because the employer enrolls a whole group at once.</p>

<h2>How the wait changes a bill</h2>
<p>The calculator compares the same treatment done before and after the wait ends. With the example plan's ${W}-month wait for major work and a molar root canal at a network price of ${K.usd(price)}:</p>
${h.table(['Done after', 'Plan pays', 'You pay'], [
  [`${early} months of coverage`, K.usd(now.planPays), K.usd(now.youPay)],
  [`${W} months of coverage`, K.usd(later.planPays), K.usd(later.youPay)],
], `Example plan: Covered California 2026 adult, ${K.pct(major, 0)} for major services after a ${K.usd(EX.deductible)} deductible, ${K.usd(EX.annualMax)} yearly maximum. Median network price of the states priced here.`, ['l', 'r', 'r'])}
<p>Inside the wait, the patient still pays the network price rather than the full fee when the dentist is in network, which on this root canal is ${K.usd(rc.median - rc.medianAllowed)} less than the median full fee. A filling, basic work, may have a shorter wait or none: at a network price of about ${K.usd(fill.medianAllowed)} it matters less, but the same logic applies.</p>
${h.mini('waiting', { t: 'Months left before the plan pays', p: ['wm', 'mc'] })}

<h2>Reading the clause in a benefit summary</h2>
<p>Waiting periods are listed in different places depending on the insurer: sometimes in the table of covered services, next to each class, sometimes in a section on limitations and exclusions. The wording to look for is a number of months attached to a class name, such as basic, major or orthodontic services. Some plans phrase it as a benefit that becomes available after a period of continuous enrollment, which means the same thing. A wait that applies per member, rather than per policy, restarts when a new family member is added.</p>
<p>The date that counts is the date of service, not the date of the exam or of the treatment plan. A crown prepared one week and seated the next is usually claimed on the seating date, so a treatment that straddles the end of the wait may fall on the covered side. The office can tell you which date it will report.</p>

<h2>Getting the wait waived</h2>
<p>The most common exception is proof of earlier coverage. The example plan waives its major-services wait when the new member had dental coverage before, and many individual plans do the same when the gap between the two plans is short. The proof is usually a letter or certificate from the former plan showing the dates of coverage. It is worth asking for before the old plan ends, since getting it later can take time.</p>
<p>Employer plans often have no waiting period at all, and some plans let members who sign up during a first enrollment window skip it. A plan may also treat an accident differently from decay. None of this is automatic; the benefit summary or the plan's member service states the rule that applies.</p>

<h2>Missing teeth and earlier problems</h2>
<p>A separate clause sometimes travels with the waiting period: some plans do not pay to replace a tooth that was already missing when coverage began, however long the member waits. That matters for implants, bridges and partial dentures, and it is the first thing to check when a new plan is bought with one of them in mind. The ${h.a('dental-implant-cost', 'implant page')} and the ${h.a('dental-bridge-cost', 'bridge page')} give the prices at stake, and the ${h.a('dental-insurance-coverage', 'coverage page')} explains how classes are set.</p>

<h2>Deciding whether to wait</h2>
<p>The money is only half of the question. A tooth with an infection, a broken crown or pain may not wait months without the problem growing, and the treatment that becomes necessary later can cost more than the one available now. That judgment belongs to the dentist. What the calculator offers is the other half: the amount the wait would save, set against the alternatives. When the saving is small, paying now may be simplest. When it is large, the patient can ask the dentist whether a temporary measure would keep the tooth stable until the plan pays, and can compare that with the ${h.a('dental-financing', 'cost of financing')} the work today. On a crown at the median network price of ${K.usd(crown.medianAllowed)}, the same arithmetic applies.</p>
`,
  faqs: [
    { q: 'How long is a typical dental insurance waiting period?', a: `It depends on the plan and the class. Preventive care usually has no wait; basic and major services can have waits of several months, and orthodontics often longer. The Covered California 2026 adult plan used as an example here has ${W} months for major services, waived with proof of earlier coverage. Employer group plans often have none.` },
    { q: 'Can I get dental work done during the waiting period?', a: 'Yes, but the plan pays nothing for the class still under its wait, so you pay the full price yourself. If the dentist is in the plan network, that price is usually the plan allowed amount rather than the office full fee. Preventive visits, which most plans cover from the first day, can go ahead as normal.' },
    { q: 'How do I avoid a dental insurance waiting period?', a: 'Ask the new plan whether it waives the wait with proof of earlier dental coverage, and request a letter of coverage dates from your former plan before it ends. Employer plans often have no waiting period at all. Some plans also waive it for members who enroll during a first enrollment window. The benefit summary states the rule.' },
    { q: 'Does a waiting period apply to cleanings and checkups?', a: 'Rarely. Most plans cover diagnostic and preventive care, such as exams, cleanings and routine X-rays, from the first day of coverage, because these visits keep later costs down. Waiting periods are usually reserved for basic restorations and major work. Read the benefit summary, as a few low-cost plans also delay preventive benefits.' },
  ],
  tool: 'waiting',
  toolArg: { q: Math.round(price / 10) * 10 },
  related: ['dental-insurance-coverage', 'dental-insurance-calculator', 'dental-financing', 'root-canal-cost'],
  sources: ['covered_ca_2026', 'ada_hpi_2024', 'bls_cpi_dental'],
});
