# Écrire ou étoffer une page de Dental Cost by State (us-dental-costs)

Notice pour qui écrit les pages. À lire en entier avant d'écrire, avec `~/Documents/GitHub/RECETTE-SITE.md`.

**Le site** : ce que coûtent les soins dentaires aux États-Unis, acte par acte et État par État, avant et après
l'assurance dentaire (franchise, part payée par classe, plafond annuel, délai de carence), et le coût d'un étalement.
**Anglais américain seul**, sous `/en/`. Éditeur : la société **Radif Partners** (jamais un nom de personne). Aucune
marque (ADA, Delta, MetLife, CareCredit, Medicaid, Invisalign) dans le nom du site ni dans le logo ; le site n'est affilié
à personne.

**La phrase de valeur ajoutée** (accueil, À propos, Méthode, rapport SERP) : `VALUE` dans `src/content/home.ts`.
Rapport SERP : `~/Documents/GitHub/reports/us-dental-costs-serp-2026-10-20.md`.

## Interdits

- **Sujet santé (YMYL) : jamais de conseil médical.** Le site donne des prix, jamais un traitement à choisir (implant,
  bridge ou dentier : on compare des factures, pas des mérites cliniques ; on renvoie au dentiste).
- Pas de leads : aucun formulaire de contact, de devis, de rappel ou de rendez-vous ; aucun lien vers un dentiste, une
  chaîne, un assureur, un plan de réduction ou un prêteur ; aucun prêteur nommé ni recommandé.
- **FAIR Health est sous licence** : ne jamais copier ses montants. On cite seulement les pourcentages publiés par l'ADA.
- **Un chiffre non sourçable ne se publie pas.** Tout chiffre vient du kit (`K.…`). Pas de prix de marque (aligneurs),
  pas d'acte estimé dans un État dont le barème n'a pas tous les codes, pas de fourchette nationale inventée.
- Ne jamais lier ni copier un site du portefeuille (`~/Documents/GitHub/_trame/domaines-ovh.txt`), notamment
  dentimetre.fr, usglpcost.com, homecostsbystate.com, bumpweek.com ; pas de « nos autres sites ».
- Un chiffre annoncé pour plus tard est « à venir », avec sa date, jamais présenté comme en vigueur.
- Ni tiret cadratin ni demi-cadratin, ni les tournures listées dans `tests/pages.test.ts` (BANNED).

## D'où viennent les chiffres

| Donnée | Source | Fichier |
|---|---|---|
| Honoraires Medicaid par code CDT, édition en vigueur au 1er juillet 2024 (`fees`) et édition actuelle (`feesNow`) | barème dentaire à l'acte publié par chaque État (URL, titre, date d'effet dans `data/fees/<ST>.json`) | `data/fees/*.json` → `src/data/states.json` |
| Rapports Medicaid / honoraires des dentistes et Medicaid / paiements des assurances privées, enfants et adultes, niveau de prestation adulte | ADA Health Policy Institute, classeur 2024 (publié en octobre 2024 ; honoraires Medicaid relevés jusqu'en juillet 2024 ; honoraires des dentistes d'avril 2023 à mars 2024 ; paiements privés au 2e trimestre 2024) | `src/data/ada-ratios-2024.json` |
| Indice des prix des soins dentaires (CUUR0000SEMC02), mois par mois | BLS | `params-2026.json > cpiDental` |
| Contrat type : franchise 50 $, plafond 1 500 $, classes, délai de 6 mois, orthodontie | Covered California, 2026 Dental Standard Benefit Plan Designs | `params-2026.json > examplePlan`, `classes` |
| Taux des cartes et des prêts personnels | Fed G.19 (publication du 2026-10-07, données d'août 2026) | `params-2026.json > credit` |
| Intérêts différés | 12 CFR 1026.16(h) et 1026.53(b) (Regulation Z, édition 2025) | sources `cfr_1026_16`, `cfr_1026_53` |

**Méthode** : honoraire estimé = somme des honoraires Medicaid 2024 des codes de l'acte ÷ rapport Medicaid / honoraires
de l'État × (IPC dentaire du dernier mois ÷ moyenne avril 2023 à mars 2024). Prix en réseau : même calcul avec le
rapport Medicaid / paiements privés et la base du 2e trimestre 2024. Rapport adulte s'il existe, sinon enfant (mention).
Un État qui ne liste un code que pour les moins de 21 ans : honoraires enfants et rapport enfants ensemble. Un État sans
édition 2024 retrouvée n'est pas chiffré.

## Reconstruire les données

    python3 -m venv .venv && .venv/bin/pip install openpyxl
    .venv/bin/python scripts/build-data.py        # télécharge le classeur ADA dans .cache/ s'il manque

Corrections lues dans les documents eux-mêmes (multiplicateur imprimé en tête de barème, codes payés sur une autre base) :
`data/fees-overrides.json`, chacune avec sa raison. Les fichiers bruts des États restent hors du dépôt.

## Les fichiers d'une page (une page = un fichier)

| Page | Fichier | Route |
|---|---|---|
| Sujet + calculateur | `src/content/guides/<id>.ts` (`defineGuide`) | `/en/<slug>/` |
| État | `src/content/states/<slug>.ts` (`defineState`, slug = clé de `states.json`) | `/en/dental-costs/<slug>/` |
| Accueil | `src/content/home.ts` | `/en/` |

Pages prévues : `src/lib/planned.ts`. Modèles (copier la structure, jamais les phrases) :
`src/content/guides/dental-implant-cost.ts` et un fichier de `src/content/states/`.

Le gabarit affiche seul : H1, `intro`, le calculateur (`tool`, réglé par `toolArg`), le chapeau replié (`resume`), le
corps (`body`), la FAQ, les pages liées, les sources. Sur un État : H1 fixé, estimateur réglé sur l'État, tableau des
actes généré sous le corps.

### Champs

| Champ | Règle |
|---|---|
| `title` | 50 à 60 caractères rendus, terme-clé en tête, « 2026 », unique ; jamais en tête le pays, un mot d'outil, une question |
| `description` | 150 à 160 caractères rendus, « 2026 », unique |
| `resume` | un seul paragraphe de 120 mots ou plus : la réponse directe, chiffrée |
| `body` | guides 650 mots de prose au moins, États 300 ; au moins un `h.mini(kind, { t, p, d })` |
| `faqs` | 3 à 8 questions, réponses de 40 à 90 mots, question unique sur tout le site |
| `related` | 3 ou 4 identifiants de pages |
| `sources` | clés de `params-2026.json > sources` (guides) |

Outils (`src/lib/tool-specs.ts`) : `cost` (acte × État × contrat), `states` (un acte dans tous les États chiffrés),
`plan` (un devis en main : part du contrat), `versus` (deux actes côte à côte, `toolArg: { a, b }`), `finance`
(mensualité, intérêts différés), `max` (plafond annuel, étalement sur deux années), `waiting` (délai de carence).

## Contrôler

    PAGE_FILES=<id>,state:<slug> npx vitest run tests/pages.test.ts
    npx vitest run tests/pages.test.ts >/dev/null; python3 scripts/sim-pages.py --only <id>    # moins de 30 %

Puis, une seule fois et jamais en parallèle : `npm run check` et les contrôles de la recette.
