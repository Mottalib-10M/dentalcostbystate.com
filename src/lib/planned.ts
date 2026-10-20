/** Every page id the site is meant to have. Content tests accept links to these ids while pages are being
 *  written; the "all planned pages exist" test fails until each has its file. */
import STATES from '../data/states.json';
export const PLANNED_GUIDES = [
  'dental-implant-cost', 'braces-cost', 'invisalign-cost', 'dental-crown-cost', 'root-canal-cost', 'dentures-cost',
  'tooth-extraction-cost', 'wisdom-teeth-removal-cost', 'dental-bridge-cost', 'veneers-cost', 'deep-cleaning-cost',
  'cavity-filling-cost', 'teeth-cleaning-cost', 'implant-vs-bridge',
  'dental-insurance-calculator', 'dental-insurance-coverage', 'dental-insurance-annual-maximum', 'dental-insurance-waiting-period', 'dental-work-without-insurance',
  'dental-costs-by-state', 'dental-financing', 'medicaid-dental-by-state',
];
/** Every priced state (a schedule in force on July 1, 2024) gets a page. */
export const PLANNED_STATES = (STATES as Array<{ slug: string; fees: Record<string, unknown> }>).filter((s) => Object.keys(s.fees).length > 0).map((s) => s.slug);
export const PLANNED_IDS = new Set<string>([...PLANNED_GUIDES, ...PLANNED_STATES.map((s) => `state:${s}`)]);
