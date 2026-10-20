/** Text of the home page (the pillar). Every figure comes from the kit. */
import { KIT as K } from '../lib/kit';
import type { FAQ, Helpers } from '../lib/page-types';

const imp = K.spread('implant');
const crown = K.spread('crown');
const rc = K.spread('rootcanal_molar');
const br = K.spread('braces_teen');
const EX = K.P.examplePlan;
const n = K.STATES.length;
const cpi = K.month(K.P.cpiDental.latestPeriod);
const median = (s: ReturnType<typeof K.spread>) => K.usd(s.median);
const adults = K.ADA.states.filter((x) => x.adultCharge).sort((a, b) => a.adultCharge! - b.adultCharge!);
const loA = adults[0], hiA = adults[adults.length - 1];

/** The value sentence (RECETTE §2.4), shown on the home page and the About page. */
export const VALUE = `Price pages at the top of search results quote one national range with no source and then ask for an appointment or a credit application; this site prices each procedure for your state from that state's own published fee schedule, code by code, names and dates the document, and runs your plan's deductible, coinsurance, annual maximum and waiting period on the result.`;

export const HOME = {
  title: 'Dental Costs by State 2026: Implant, Crown, Braces Prices',
  description: `Dental costs by state in 2026: implants, crowns, root canals, braces and dentures priced from ${n} state fee schedules, before and after your dental insurance.`,
  h1: 'Dental costs by state: what the work costs, and what your plan leaves you to pay',
  intro: 'Pick the procedure, your state and your coverage: the estimate, the plan payment and your share appear at once, with the fee schedule behind them.',
  resume: `A single dental implant with its abutment and crown is estimated at a median ${median(imp)} across the ${imp.n} states whose fee schedules list all three codes, a porcelain crown at ${median(crown)}, a molar root canal at ${median(rc)} and braces for a teenager at ${median(br)}, in ${cpi} dollars and before insurance. Those are typical full fees, the price a dentist bills a patient with no plan. A dental plan lowers the bill twice: its network price is lower than the full fee, and it then pays a share by class of service, often all of a checkup, most of a filling and half of a crown or root canal, until its yearly maximum runs out. With the example plan used on this site, sold on the California exchange in 2026, the deductible is ${K.usd(EX.deductible)} and the yearly maximum ${K.usd(EX.annualMax)}, so an implant leaves most of the bill to the patient. Each figure comes from one state's Medicaid dental fee schedule, divided by that state's published ratio between Medicaid pay and dentists' charges.`,
  why: (h: Helpers) => `
<h2>Why a price by state, and where it comes from</h2>
<p>Dentists set their own fees, and no public register lists them. What is public is what each state's Medicaid program pays for every dental code, in a fee schedule anyone can download, and how far those payments sit below what dentists charge in the same state. The ${h.src('ada_hpi_2024', 'American Dental Association Health Policy Institute')} measured that gap for every state in 2024, using Medicaid fees collected through July 2024 and dentists' charges from April 2023 to March 2024. Divide a state's Medicaid fee for a code by that state's ratio and you get an estimate of the typical charge for the same code there.</p>
<p>This site does that division for ${n} states, procedure by procedure, with the schedule in force on July 1, 2024, so that fees and ratios describe the same months. It then brings the result to ${cpi} with the ${h.src('bls_cpi_dental', 'consumer price index for dental services')} published by the Bureau of Labor Statistics, which rose ${K.pct(K.cpiChange, 1)} over the last twelve months. A procedure is priced only when the schedule lists every code it needs: no fee is guessed. The ${h.a('method', 'method page')} gives each step and its limits.</p>
${h.mini('states', { t: 'One procedure across the states we price', p: ['pr'], d: { pr: 'crown' } })}
<h2>Full fee, network price and your share</h2>
<p>Three numbers matter on a dental bill. The full fee is what an office charges a patient who has no plan. The network price is the lower amount a dental plan has agreed with the dentists of its network; a patient who goes out of network can be billed the difference. Your share is what remains after the plan has applied its deductible, paid its percentage for the class of the work and stopped at its yearly maximum. The ${h.a('dental-insurance-calculator', 'dental insurance calculator')} runs those steps on any price, and the ${h.a('dental-insurance-annual-maximum', 'annual maximum page')} shows why a large treatment often ends up mostly paid by the patient.</p>
<p>Plans differ, so the estimator lets you type your own deductible, maximum and percentage. Its defaults come from the ${h.src('covered_ca_2026', 'Covered California 2026 dental plan designs')}: the coinsurance plan for adults pays nothing toward the first ${K.usd(EX.deductible)} of covered basic and major work, then ${K.pct(1 - EX.memberShare.basic, 0)} of basic services and ${K.pct(1 - EX.memberShare.major, 0)} of major ones, up to ${K.usd(EX.annualMax)} a year, with a waiting period of ${EX.waitingMajorMonths} months for major services.</p>
<h2>What these prices are not</h2>
<p>They are estimates of typical fees in a state, not the price of your treatment. A city office and a rural one in the same state can charge very differently, and a dentist may find that a tooth needs more work, or less, than the codes used here. The site does not tell anyone which treatment to choose: that belongs to the patient and the dentist. Medicaid fees appear on every page because they are the public base of the estimate; they are also what the program pays when it covers the work, which for adults varies from state to state, as the ${h.a('medicaid-dental-by-state', 'Medicaid dental page')} explains.</p>
`,
  faqs: [
    { q: 'How much does dental work cost without insurance in 2026?', a: `It depends on the procedure and the state. Across the states priced here, the median full fee is about ${median(imp)} for a single implant with its crown, ${median(crown)} for a porcelain crown and ${median(rc)} for a molar root canal. A checkup with cleaning and X-rays costs far less. Each state page lists every procedure its fee schedule allows us to price.` },
    { q: 'Why do dental prices differ so much between states?', a: `Dentists' fees follow local wages, rents and lab costs, and the gap between Medicaid pay and private fees also varies. In the ADA's 2024 figures, Medicaid paid adults from ${K.pct(loA.adultCharge!, 0)} of what dentists charged in ${loA.name} to ${K.pct(hiA.adultCharge!, 0)} in ${hiA.name}. Our estimates divide each state's own fees by its own ratio, so both differences show up.` },
    { q: 'Are these prices quotes from dentists?', a: 'No. They are estimates of the typical charge in a state, built from public fee schedules and published ratios, and they describe an average office, not yours. A dentist gives a written estimate after an exam, and a dental plan can confirm its own payment in advance with a predetermination. Use these figures to judge whether a quote is in the usual range.' },
    { q: 'What does a dental plan usually pay for a crown or implant?', a: `Plans sort work into classes. In the Covered California 2026 example, major services such as crowns, root canals and dentures are paid at ${K.pct(1 - EX.memberShare.major, 0)} after the deductible, up to a ${K.usd(EX.annualMax)} yearly maximum. A large treatment can reach that maximum in one visit, so the patient pays the rest. The estimator shows both amounts for your state.` },
    { q: 'Can I compare a dentist quote with these prices?', a: 'Yes, line by line. Ask the office for the CDT codes on its written estimate, then compare each code with the state price list on the state page. A total far above the estimate usually means extra work is included, such as a bone graft, a scan or sedation. The estimate describes a typical office in the state, not a ceiling or a floor.' },
    { q: 'How often are these dental prices updated?', a: `The fee schedules, ratios and price index behind the site were last read on ${K.day(K.P.retrieved_at)}. Prices move each month with the dental services price index, which the site reloads when the Bureau of Labor Statistics publishes a new month. A new state schedule or a new ADA study is loaded when it appears, and the method page records each edition used.` },
    { q: 'What is the difference between the full fee and the in-network price?', a: `The full fee is what a dental office bills a patient who has no plan. The in-network price is the lower amount a dental plan has agreed with the dentists in its network, and it is the base on which the plan pays its share. Across the states priced here, a crown's network price is about ${K.pct(crown.medianAllowed / crown.median, 0)} of its full fee.` },
  ] as FAQ[],
  sources: ['ada_hpi_2024', 'bls_cpi_dental', 'covered_ca_2026', 'cms_dental', 'fed_g19'],
};
