import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const front = K.spread('rootcanal_front');
const pre = K.spread('rootcanal_premolar');
const mol = K.spread('rootcanal_molar');
const crown = K.spread('crown');
const EX = K.P.examplePlan;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const share = K.shareOf('rootcanal_molar', 'auto');
const r = K.plan({ charge: mol.median, allowed: mol.medianAllowed, insured: true, inNetwork: true, planShare: share, deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: 0, nextYearDeductible: 0 });
// Molar root canal followed by a crown on the same tooth, same plan year.
const both = K.plan({ charge: mol.median + crown.median, allowed: mol.medianAllowed + crown.medianAllowed, insured: true, inNetwork: true, planShare: share, deductibleLeft: EX.deductible, maxLeft: EX.annualMax, waitMonths: 0, monthsCovered: 12, nextYearMax: 0, nextYearDeductible: 0 });
const row = (label: string, code: string, s: ReturnType<typeof K.spread>) => [label, code, K.usd(s.median), K.usd(s.medianAllowed), s.n > 1 ? `${K.usd(s.lo!.e.charge)} to ${K.usd(s.hi!.e.charge)}` : K.usd(s.median), String(s.n)];

export default defineGuide({
  id: 'root-canal-cost',
  group: 'procedure',
  order: 5,
  slug: 'root-canal-cost',
  nav: 'Root canal cost',
  card: 'Front tooth, premolar or molar: the root canal estimate by state and the crown that often follows.',
  title: 'Root Canal Cost 2026: Front Tooth, Premolar, Molar by State',
  description: 'Root canal cost in 2026 for a front tooth, premolar or molar, estimated state by state from public fee schedules, with the crown after it and your plan share.',
  h1: 'Root canal cost: front tooth, premolar or molar, and the crown that often follows',
  intro: 'Choose the tooth, your state and your plan: a molar costs more than a front tooth because it has more canals to treat.',
  resume: `The price of a root canal depends first on the tooth. Endodontic treatment of a molar (code D3330) is estimated at a median ${K.usd(mol.median)} before insurance across the ${mol.n === 1 ? 'one state' : `${mol.n} states`} whose Medicaid schedules list it, a premolar (D3320) at ${K.usd(pre.median)} and a front tooth (D3310) at ${K.usd(front.median)}, all in ${cpi} dollars. Network prices that a private plan allows are lower: ${K.usd(mol.medianAllowed)} for the molar. The Covered California 2026 example plan places endodontics among major services and pays ${K.pct(share, 0)} after its ${K.usd(EX.deductible)} deductible, so an in-network molar root canal at the median leaves the patient about ${K.usd(r.youPay)}. A back tooth treated this way often receives a crown afterwards, a separate bill that brings the two together to about ${K.usd(both.youPay)} for the patient with the same plan, once its yearly maximum is counted.`,
  body: (h) => `
<h2>Why the tooth sets the price</h2>
<p>A root canal cleans out the pulp inside a tooth, shapes and disinfects the canals that run down its roots, and seals them. Front teeth usually have one canal, premolars one or two, molars three or more, often curved and narrow. The dental terminology reflects that with three codes, and offices price them in the same order. The table compares the three across the states priced on this site.</p>
${h.table(['Tooth', 'CDT code', 'Full fee, median', 'In network, median', 'Range of states', 'States'], [row('Front tooth', 'D3310', front), row('Premolar', 'D3320', pre), row('Molar', 'D3330', mol)], `Endodontic therapy, final restoration excluded. Estimated typical charges in ${cpi} dollars.`, ['l', 'l', 'r', 'r', 'r', 'r'])}
<p>The fee covers the treatment of the canals. X-rays taken during it are often included, but the exam that found the problem, a temporary filling and the final restoration are not. Retreating a tooth whose earlier root canal has failed uses separate codes, priced higher than a first treatment.</p>

<h2>General dentist or specialist</h2>
<p>Root canals are done by general dentists and by endodontists, the specialists of the inside of the tooth. Specialists often charge more, particularly for molars and retreatments. The estimate describes the average charge for the code in a state, which mixes both. When a general dentist refers a difficult molar, a specialist's quote above the estimate is common and not a sign of an error.</p>
${h.mini('cost', { t: 'Root canal in your state', p: ['pr', 'sx'], d: { pr: 'rootcanal_molar' } })}

<h2>The crown after a molar root canal</h2>
<p>A back tooth that has had a root canal is often weakened, and dentists frequently cover it with a crown. That is a second bill under code D2740 or a related one, priced on the ${h.a('dental-crown-cost', 'crown page')} at a median of ${K.usd(crown.median)} before insurance. Added to the molar root canal, the pair reaches about ${K.usd(mol.median + crown.median)} at full fee. In network, with the example plan, the two together ask the plan for ${K.usd((mol.medianAllowed + crown.medianAllowed - EX.deductible) * share)}; its ${K.usd(EX.annualMax)} yearly maximum ${both.overMax > 0.5 ? `cuts that to ${K.usd(both.planPays)}` : 'covers it'}, and the patient pays ${K.usd(both.youPay)}. A buildup that rebuilds the core of the tooth before the crown may add a third line.</p>
<p>Whether a crown is needed, and when, is the dentist's call. Some plans pay the root canal and the crown in different classes, and the waiting period may apply to one and not the other: the benefit summary lists both.</p>

<h2>Reading a root canal quote</h2>
<p>A written estimate for endodontic work usually lists several lines, and each has its own code. The treatment of the canals is the main one. Around it may appear an emergency visit to relieve pain before the treatment, called palliative care, the X-rays taken before and after, a temporary filling between visits and, later, the buildup and crown. Each line can be compared with what a plan pays for that class and with the estimate for the state. When two offices quote the same tooth, laying their lines side by side usually shows that the main fee is close and that the difference sits in the extras, or in whether a specialist does the work.</p>
<p>The number of visits also varies. Many root canals are finished in one appointment, others in two, and the fee for the code normally covers the treatment whatever the number of visits. A retreatment of a tooth already treated years ago, or a surgical procedure at the tip of the root, is a different code with a higher price, and the quote should say so plainly. If the estimate on this page and a quote differ widely, the codes on the quote are the first thing to check.</p>

<h2>How plans classify endodontics</h2>
<p>Plans do not agree on where root canals belong. Some treat them as basic services with fillings, paid at a higher share; others, including the ${h.src('covered_ca_2026', 'Covered California 2026 dental plan designs')}, put endodontics with major work. The difference is large on a molar: at the median network price, a plan paying ${K.pct(1 - EX.memberShare.basic, 0)} instead of ${K.pct(share, 0)} would leave the patient roughly ${K.usd((mol.medianAllowed - EX.deductible) * EX.memberShare.basic + EX.deductible)} instead of ${K.usd(r.youPay)}. The estimator's "Plan pays" field lets you set your own plan's share.</p>
${h.mini('plan', { t: 'Your share of a root canal quote', p: ['q', 'pc'], d: { q: Math.round(mol.medianAllowed / 50) * 50, pc: '50' } })}
<p>For a patient without a plan, the full fee is what the office bills, and some offices offer a lower price for payment at the time of service; the ${h.a('dental-work-without-insurance', 'page on paying without insurance')} sets out the options and what each one costs.</p>
<p>The alternative to saving a tooth is usually removing it, and that has costs later if the gap is filled with a bridge or an implant. Comparing those bills is legitimate; choosing between treatments is a clinical decision made with the dentist after an exam.</p>
`,
  faqs: [
    { q: 'How much does a root canal on a molar cost?', a: `A molar root canal, code D3330, is estimated at a median ${K.usd(mol.median)} before insurance in the states priced here, in ${cpi} dollars, and a private plan's network price is about ${K.usd(mol.medianAllowed)}. The crown that often follows is billed separately. Specialists usually charge more than general dentists for molars.` },
    { q: 'Is a root canal on a front tooth cheaper?', a: `Yes. A front tooth usually has a single canal, and its code, D3310, is priced lower: a median of ${K.usd(front.median)} before insurance here, against ${K.usd(pre.median)} for a premolar and ${K.usd(mol.median)} for a molar. Whether a crown follows is a separate question, settled by the dentist for each tooth, and a separate bill.` },
    { q: 'Does insurance treat a root canal as basic or major work?', a: `It depends on the plan. Some pay root canals with fillings as basic services, often around ${K.pct(1 - EX.memberShare.basic, 0)}; others class them as major, around ${K.pct(share, 0)}. The Covered California 2026 example plan treats endodontics as major work. Your plan's benefit summary lists endodontics under one class or the other.` },
  ],
  tool: 'cost',
  toolArg: { pr: 'rootcanal_molar' },
  related: ['dental-crown-cost', 'tooth-extraction-cost', 'dental-insurance-coverage', 'dental-work-without-insurance'],
  sources: ['ada_hpi_2024', 'bls_cpi_dental', 'covered_ca_2026'],
});
