import { defineGuide } from '../../lib/page-types';
import { KIT as K } from '../../lib/kit';

const A = K.ADA.states;
const N = K.ADA.national;
const level = (l: string) => A.filter((x) => x.adultBenefit === l);
const names = (xs: typeof A) => xs.map((x) => x.name).join(', ');
const enh = level('Enhanced'), lim = level('Limited'), emg = level('Emergency'), none = level('None');
const adults = A.filter((x) => x.adultCharge).sort((a, b) => a.adultCharge! - b.adultCharge!);
const kids = A.slice().sort((a, b) => a.childCharge - b.childCharge);
const priced = new Set(K.STATES.map((s) => s.code));
const slugOf = (code: string) => K.STATES.find((s) => s.code === code)?.slug;
const LABEL: Record<string, string> = { Enhanced: 'Enhanced', Limited: 'Limited', Emergency: 'Emergency only', None: 'None' };

export default defineGuide({
  id: 'medicaid-dental-by-state',
  group: 'paying',
  order: 32,
  slug: 'medicaid-dental-by-state',
  nav: 'Medicaid dental by state',
  card: 'Adult dental benefit level and how Medicaid pay compares with dentists\' fees, all states.',
  title: 'Medicaid Dental Coverage by State 2026: Adults and Children',
  description: 'Medicaid dental coverage by state in 2026: which states give adults enhanced, limited or emergency-only dental care, and how far Medicaid pay sits below fees.',
  h1: 'Medicaid dental coverage by state: adult benefit levels and what the program pays dentists',
  intro: 'Choose a procedure: the calculator ranks the priced states by its typical fee, next to the Medicaid fee each program pays for the same codes.',
  resume: `Medicaid must cover dental care for every enrolled child, but adult dental care is optional and each state decides what to offer, with no federal minimum, as the federal Medicaid agency states. The result is a patchwork. In the classification the ADA Health Policy Institute published in 2024 with CareQuest, ${enh.length} of the fifty states and the District of Columbia gave adults an enhanced benefit, ${lim.length} a limited one, ${emg.length} covered emergencies only and ${none.length} offered none. How much Medicaid pays also varies: for adults it paid from ${K.pct(adults[0].adultCharge!, 0)} of what dentists charged in ${adults[0].name} to ${K.pct(adults[adults.length - 1].adultCharge!, 0)} in ${adults[adults.length - 1].name}, ${K.pct(N.adultCharge!, 0)} on average, and for children ${K.pct(N.childCharge, 0)} on average. Those ratios are the basis of every price on this site. Benefits change with state budgets, so a 2024 level may not be today's: the state Medicaid agency has the current rules and decides eligibility.`,
  body: (h) => `
<h2>Children and adults are treated differently</h2>
<p>For children, federal law sets the floor. ${h.src('cms_dental', 'Medicaid.gov')} states that Medicaid covers dental services for all child enrollees as part of a comprehensive set of benefits, and that separate CHIP programs must also include dental coverage. Checkups, cleanings, fillings and medically necessary treatment are therefore available to enrolled children in every state, whatever the adult rules.</p>
<p>For adults, the same page says that states have flexibility to decide what dental benefits to provide and that there are no minimum requirements. Some states cover adults almost as broadly as children; others pay only to relieve pain or treat infection; a few pay nothing. The level can change from one budget year to the next.</p>

<h2>The four levels of adult coverage</h2>
<p>The ADA Health Policy Institute classifies each state's adult benefit, using information from CareQuest and its own research, in its ${h.src('ada_hpi_2024', '2024 workbook')}. The levels, from broadest to narrowest:</p>
<ul>
<li>Enhanced: the broadest level, a wider set of covered services for adults. ${enh.length} jurisdictions in 2024.</li>
<li>Limited: a narrower set of covered services. ${lim.length} states: ${names(lim)}.</li>
<li>Emergency only: care for pain and infection, without routine care. ${emg.length} states: ${names(emg)}.</li>
<li>None: no adult dental benefit. ${none.length === 1 ? `One state: ${names(none)}` : `${none.length} states${none.length ? `: ${names(none)}` : ''}`}.</li>
</ul>
<p>Within one state, some groups of adults can have dental coverage under rules of their own. The exact list of covered services at each level is set by each state, and the state Medicaid agency is the place to check what applies to a given person; this site does not assess eligibility.</p>

<h2>All fifty states and the District of Columbia</h2>
<p>The table gives each jurisdiction's adult benefit level and the two ratios between Medicaid fee-for-service pay and dentists' charges, for adults and for children, as published by the ADA for 2024. States in bold link to their price page on this site.</p>
${h.table(['State', 'Adult benefit, 2024', 'Medicaid pay / dentist charges, adults', 'Medicaid pay / dentist charges, children'], A.map((x) => [priced.has(x.code) && slugOf(x.code) ? `<strong>${h.a(`state:${slugOf(x.code)}`, x.name)}</strong>` : x.name, LABEL[x.adultBenefit] ?? x.adultBenefit, x.adultCharge ? K.pct(x.adultCharge, 1) : 'n/a', K.pct(x.childCharge, 1)]), 'ADA Health Policy Institute, Medicaid Fee-For-Service Reimbursement as a Percentage of Dentist Charges, 2024. Fees collected through July 2024; dentist charges of April 2023 to March 2024. n/a: no adult benefit beyond emergencies, so no adult ratio.', ['l', 'l', 'r', 'r'])}

<h2>Why low pay matters to patients</h2>
<p>A low ratio means that an office receives much less for a visit paid by Medicaid than for the same visit paid by a patient or a private plan. Whether an office takes Medicaid patients is its own decision, and the state agency or the health plan can list the offices that do. Children's ratios are generally higher than adults', ${K.pct(N.childCharge, 0)} against ${K.pct(N.adultCharge!, 0)} nationally, and range from ${K.pct(kids[0].childCharge, 0)} in ${kids[0].name} to ${K.pct(kids[kids.length - 1].childCharge, 0)} in ${kids[kids.length - 1].name}.</p>
<p>Many states pay dentists through managed care plans rather than directly, and those plans' rates are not public. The ADA ratios, like this site's estimates, use the public fee-for-service schedules, which is a limit both share.</p>
${h.mini('states', { t: 'Typical fee and Medicaid fee, state by state', p: ['pr'], d: { pr: 'extraction' } })}

<h2>Reading a state's ratio</h2>
<p>A ratio compares a weighted basket of common codes, the same basket in every state: exams, cleanings, X-rays, fillings and extractions. It does not say that every code is paid at that share. A state can pay a filling close to private fees and a crown far below them, or the reverse. That is why the estimates on this site are made code by code, from the state's own fee for each code, and why a state's estimate for a procedure can sit far from its neighbors when one fee is set on a different basis.</p>
<p>A ratio also moves when either side moves. A state that raises its fees after July 2024 has a higher ratio today than the table shows, until the ADA publishes new figures, and a state where dentists' fees rise faster than Medicaid's has a lower one. The table is the latest public measure, not a forecast.</p>

<h2>From Medicaid fees to prices</h2>
<p>Because each ratio relates Medicaid pay to dentists' charges in the same state, dividing a state's Medicaid fee for a code by its ratio estimates what dentists there charge for it. That is how every price on this site is built, for the ${K.STATES.length} states whose fee schedules have been read and dated so far. The ${h.a('method', 'method page')} gives the steps, the ${h.a('dental-costs-by-state', 'state comparison')} the results, and the ${h.a('dental-work-without-insurance', 'page on paying without insurance')} the options for adults whose state covers little. Medicare, the federal program for people 65 and over, is separate and generally does not cover routine dental care, as ${h.src('medicare_dental', 'Medicare.gov')} explains.</p>
`,
  faqs: [
    { q: 'Does Medicaid cover dental for adults?', a: `It depends on the state. Adult dental coverage is optional under federal rules, with no minimum. In the ADA Health Policy Institute 2024 classification, ${enh.length} jurisdictions offered adults enhanced dental benefits, ${lim.length} limited ones, ${emg.length} emergency care only and ${none.length} none. Benefits change with state budgets, so the state Medicaid agency has the current rules.` },
    { q: 'Does Medicaid cover dental for children in every state?', a: 'Yes. Medicaid must cover dental services for all enrolled children as part of its comprehensive child benefit, and separate CHIP programs must include dental coverage too. That covers checkups, cleanings, fillings and medically necessary treatment. Finding a dentist who accepts Medicaid can still take effort, and the state agency or the child health plan can list participating offices.' },
    { q: 'How much does Medicaid pay dentists compared with private patients?', a: `On average, Medicaid paid ${K.pct(N.adultCharge!, 0)} of what dentists charged for adult services and ${K.pct(N.childCharge, 0)} for children in the ADA 2024 figures, with wide variation by state. Compared with what private dental plans pay, rather than full fees, the averages were ${K.pct(N.adultPrivate!, 0)} for adults and ${K.pct(N.childPrivate, 0)} for children.` },
    { q: 'Does Medicare pay for dental work?', a: 'Original Medicare generally does not cover routine dental care such as cleanings, fillings, extractions or dentures. It pays for some dental services tied to covered medical treatment or a hospital stay. Some Medicare Advantage plans include dental benefits of their own, with their own limits, so the plan documents say what they pay.' },
  ],
  tool: 'states',
  toolArg: { pr: 'extraction' },
  related: ['dental-costs-by-state', 'dental-work-without-insurance', 'tooth-extraction-cost', 'dental-insurance-coverage'],
  sources: ['cms_dental', 'ada_hpi_2024', 'medicare_dental', 'bls_cpi_dental'],
});
