/** llms.txt (RECETTE §21), generated from the page registry. */
import { GUIDES, STATE_PAGES, stateId } from '../lib/pages';
import { SITE_URL, LAST_UPDATED, SITE_NAMES } from '../data/site-config';
import { route } from '../i18n/routes';
import { GROUPS, label } from '../i18n/nav';
export function GET() {
  const lines = [
    `# ${SITE_NAMES.en}`, '',
    `> What dental work costs in each state of the United States, before and after dental insurance: implants, crowns, root canals, braces, dentures, extractions, bridges, veneers, deep cleanings, fillings and checkups. Each price is estimated from the state's own Medicaid dental fee schedule, code by CDT code, divided by the ADA Health Policy Institute's 2024 ratio between Medicaid pay and dentists' charges in that state, then carried to ${'${'}LAST_UPDATED.slice(0, 4)} with the BLS price index for dental services. Calculators for deductibles, coinsurance classes, annual maximums, waiting periods and financing. Independent site published by Radif Partners; general information, not a quote and not medical advice. Last updated ${'${'}LAST_UPDATED}.`, '',
    ...GROUPS.flatMap((g) => [`## ${g.label}`, ...GUIDES.filter((p) => p.group === g.id).map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`), '']),
    '## Dental costs by state', ...STATE_PAGES.map((s) => `- [${label(stateId(s.slug))}](${SITE_URL}${route(stateId(s.slug), 'en')}): ${s.intro}`), '',
    '## About', `- [How prices are estimated](${SITE_URL}${route('method', 'en')})`, `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
