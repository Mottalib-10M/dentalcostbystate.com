import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const ad = K.spread('braces_adult');
const teen = K.spread('braces_teen');
const names = (s: ReturnType<typeof K.spread>) => { const n = s.rows.map((r) => r.s.name); return n.length > 1 ? `${n.slice(0, -1).join(', ')} and ${n[n.length - 1]}` : n[0] ?? 'no state'; };
const EX = K.P.examplePlan;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const g = K.P.credit;
const months = 18;
const loan = K.loan(Math.round(ad.median / 100) * 100, g.cardAssessedInterest, months);

export default defineGuide({
  id: 'invisalign-cost',
  group: 'procedure',
  order: 3,
  slug: 'invisalign-cost',
  nav: 'Clear aligners cost',
  card: 'What clear aligner treatment is billed as, its state estimate, and why no brand price is published.',
  title: 'Invisalign Cost 2026: Clear Aligner Treatment by State',
  description: 'Invisalign cost in 2026: clear aligners are billed as a full orthodontic treatment, estimated here by state from public fee schedules, with what insurance pays.',
  h1: 'Clear aligner cost: what the treatment is billed as, and the estimate for your state',
  intro: 'Clear aligners reach the bill under the same codes as metal braces: choose your state to see the estimate for a full adult treatment.',
  resume: `No public body publishes the price of a particular brand of clear aligners, and this site does not invent one. What is public is how the treatment is billed: a dentist or orthodontist who treats the whole mouth with aligners uses the same comprehensive orthodontic codes as for brackets and wires, D8090 for an adult and D8080 for a teenager. For an adult, that treatment is estimated at a median ${K.usd(ad.median)} before insurance in the ${ad.n === 1 ? 'state' : `${ad.n} states`} whose Medicaid schedules list the adult code (${names(ad)}), in ${cpi} dollars, with a network price of about ${K.usd(ad.medianAllowed)}. The office's own price for aligners can sit above or below that figure, since it depends on the number of trays, the refinements included and the provider. Many dental plans pay orthodontics for children only; the Covered California 2026 example plan pays nothing toward adult orthodontics.`,
  body: (h) => `
<h2>Same code, different appliance</h2>
<p>A dental claim describes the treatment, not the product. Whether the teeth are moved by brackets glued to them or by a series of removable plastic trays, a treatment that corrects the whole bite is reported as comprehensive orthodontic treatment. That is why the estimator prices aligners with the adult code D8090: it is what the office writes on the claim form, and what a plan reads when it decides how much to pay. A short treatment that moves only a few front teeth is limited orthodontic treatment, a separate and cheaper code, and some aligner offers fall into that category.</p>
<p>The brand on the trays changes nothing on the claim. Manufacturers set the price they charge offices for the trays, but they do not publish a consumer price, and no state or federal document records one. A figure presented as "the" price of a brand comes from a survey, a clinic's advertising or the brand's own marketing. Those sources do not show their method, so this page does not repeat them.</p>

<h2>The adult estimate, state by state</h2>
<p>Few Medicaid programs pay orthodontics for adults, so the adult code appears in few schedules. Where it does, the estimate divides the fee by the state's ratio between Medicaid pay and dentists' charges, as for every procedure on this site, and brings the result to ${cpi} with the dental services price index. Where the adult code appears only for patients under 21, the children's fee and the children's ratio are used together.</p>
${h.table(['State', 'Full fee', 'In network'], ad.rows.slice().sort((a, b) => b.e.charge - a.e.charge).map((r) => [h.a(`state:${r.s.slug}`, r.s.name), K.usd(r.e.charge), K.usd(r.e.allowed)]), `Comprehensive orthodontic treatment of an adult (D8090), estimated typical charge in ${cpi} dollars.`, ['l', 'r', 'r'])}
<p>For a teenager the code is D8080, listed far more often, with a median of ${K.usd(teen.median)} across ${teen.n === 1 ? 'one state' : `${teen.n} states`}. The ${h.a('braces-cost', 'braces page')} gives that range state by state. The two medians are not a comparison of aligners with brackets: both codes cover either appliance.</p>
${h.mini('states', { t: 'Adult orthodontic treatment in the states priced', p: ['bs'], d: { pr: 'braces_adult' } })}

<h2>What changes the quote you receive</h2>
<p>An office quoting aligners usually states one fee for the treatment. Three things move it. The length of the treatment, which sets how many trays are made. The refinements, extra series of trays ordered when teeth do not track as planned, which some offices include and others charge for. And the retainers worn afterwards, often billed separately. Two quotes for the same mouth can differ by these items alone, so it pays to ask what each includes, and to compare the total with the estimate for your state.</p>
<p>Treatment by mail, where trays are shipped after remote planning, follows a different model and often a different code, and its sellers set their own prices. This site does not review providers or their methods; whether the treatment suits a given mouth is for a dentist or an orthodontist to judge.</p>

<h2>Questions to put to the office before signing</h2>
<p>A written treatment plan answers most of the uncertainty. It should name the code the office will bill, the total fee, how it is paid over the months of treatment, and what happens if the treatment runs longer than planned. It should also say whether the fee includes the records taken at the start, the refinement trays, the attachments bonded to the teeth during treatment and the first set of retainers. If a plan is involved, the office can send the same plan to the insurer for a predetermination, which comes back with the amount the plan expects to pay and any age or lifetime limit that applies.</p>
<p>Comparing that document with the estimate for your state shows whether the quote is in the usual range for comprehensive treatment. A quote far below it may describe a limited treatment of a few teeth; a quote far above it may include extra items, a specialist's fee or a longer plan. Either can be reasonable, and only the office can explain its own figure.</p>

<h2>Insurance and adult aligners</h2>
<p>Orthodontic benefits are often limited to children and teenagers. Plans that cover adults usually pay a share up to a lifetime orthodontic maximum, separate from the yearly maximum, and stop there. The example plan of this site, the ${h.src('covered_ca_2026', 'Covered California 2026 family dental plan')}, lists adult orthodontics as ${EX.adultOrtho.toLowerCase()}.</p>
${h.mini('plan', { t: 'What a plan with orthodontic benefits leaves you', p: ['q', 'pc'], d: { q: Math.round(ad.medianAllowed / 100) * 100, pc: '50', mx: Math.round(ad.medianAllowed / 200) * 100 } })}
<p>Paid on a credit card that charges the average rate of accounts assessed interest, ${K.pct(g.cardAssessedInterest / 100, 2)} in ${K.month(g.period)} according to the Federal Reserve, a treatment at the adult median would cost ${K.usd(loan.monthly)} a month over ${months} months, ${K.usd(loan.totalInterest)} of interest in total. The ${h.a('dental-financing', 'financing page')} runs other amounts and explains deferred interest offers.</p>
`,
  faqs: [
    { q: 'How much is Invisalign in 2026?', a: `No public document states a price for a brand of aligners. Aligners that treat the whole mouth are billed as comprehensive orthodontic treatment, code D8090 for an adult, which is estimated at a median ${K.usd(ad.median)} before insurance in the states whose Medicaid schedules list it. An office's own aligner price may be higher or lower.` },
    { q: 'Are clear aligners cheaper than metal braces?', a: 'On the claim form they are the same treatment: both use the comprehensive orthodontic codes, D8090 for adults and D8080 for teenagers, and a plan pays them alike. Price differences come from each office, the length of treatment, the refinements included and the retainers. Comparing two written quotes item by item answers the question for your own case.' },
    { q: 'Does dental insurance cover aligners for adults?', a: `Some plans do, usually at about half up to a lifetime orthodontic maximum, but many limit orthodontic benefits to children. The Covered California 2026 example plan does not cover adult orthodontics. A predetermination from the plan, requested by the office before treatment, says exactly what will be paid.` },
  ],
  tool: 'cost',
  toolArg: { pr: 'braces_adult', cv: 'none' },
  related: ['braces-cost', 'dental-financing', 'dental-insurance-coverage', 'dental-costs-by-state'],
  sources: ['ada_hpi_2024', 'bls_cpi_dental', 'covered_ca_2026', 'fed_g19'],
});
