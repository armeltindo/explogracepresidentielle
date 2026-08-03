# Grâce présidentielle 2026 — registre consultable

Application web statique de consultation publique des 369 personnes graciées par le
Décret n° 2026-546 du 31 juillet 2026 (République du Bénin) : recherche, filtres,
tri, graphiques cliquables, vue fiche, export CSV, impression. Page non officielle,
aucune donnée n'est envoyée à l'extérieur — tout est statique et fonctionne hors
ligne une fois chargé.

> Ce dépôt implémente le design produit dans Claude Design
> (`project/Grace Presidentielle 2026.dc.html`) — voir `README.design-bundle.md` et
> `chats/` pour l'historique de conception.

## Lancer le projet

```bash
npm install
npm run dev       # serveur de développement, http://localhost:5173
```

## Build de production

```bash
npm run build      # écrit un dossier dist/ autonome (déployable sur Netlify/Vercel/GitHub Pages)
npm run preview    # sert le build de dist/ localement pour vérification
```

## Vérifications

```bash
npm run typecheck    # tsc -b
npm run lint         # oxlint
npm run test         # vitest run — logique pure (filtres/tri/CSV/médiane/…)
npm run validate-data # sanity checks sur src/data/data.json (369 lignes, numérotation, dates…)
```

Ces quatre commandes tournent dans `.github/workflows/ci.yml` sur chaque push/PR
vers `main`. Un job de déploiement (déclenché uniquement sur push vers `main`)
publie ensuite `dist/` sur GitHub Pages via `actions/deploy-pages` — **à activer une
fois** dans Settings → Pages → Source : « GitHub Actions » sur le dépôt GitHub.

## Structure

```
src/
  App.tsx                 orchestration : état, filtres, tri, URL, raccourcis clavier
  state.ts                forme de l'état (filtres, tri, sélection, pagination)
  types.ts                types Person / Stats / SortKey / Density
  data/data.json           les 369 enregistrements enrichis (cat, remis, annee)
  lib/
    filtering.ts           matches / getFiltered / facetOptions / median / parsePeine
    buckets.ts              paliers de durée de détention
    urlState.ts             lecture/écriture de l'état dans location.hash (lien partageable)
    csv.ts, download.ts     export CSV (BOM UTF-8)
    highlight.tsx           surlignage des occurrences de recherche
    reportIssue.ts           lien pré-rempli vers les issues GitHub du dépôt
    printFiche.ts            bascule le mode « impression d'une seule fiche »
    *.test.ts                tests Vitest (lib/, styles/) — voir `npm run test`
  hooks/
    useMediaQuery.ts         bascule tableau (desktop) / cartes (mobile, <760px)
  components/
    Header, Footer, FlagStripe    bandeau institutionnel, devise nationale
    ErrorBoundary                 filet de sécurité si le rendu plante (recharger la page)
    MethodologyModal               méthodologie : source, calcul cat/remis, signalement
    StatsCartouche                cartouche de statistiques
    ChartsSection, charts/        graphiques cliquables (ressort, catégorie, année,
                                   durée, matrice ressort × catégorie)
    FilterBar, FilterChips        recherche (débouncée) + filtres cumulables + puces actives
    ResultsBar                    compteur (aria-live), légende, tri, densité
    PersonTable, PersonCards      registre (desktop) / cartes empilées (mobile)
    LoadMore                      pagination par paliers de 20
    DetailPanel                   fiche latérale (précédent/suivant/fermer/imprimer/signaler)
  styles/tokens.ts           couleurs, typographies, paliers de couleur de durée

scripts/validate-data.mjs    validation structurelle de data.json (voir « Vérifications »)
.github/workflows/ci.yml     typecheck + lint + validate-data + test + build (+ déploiement Pages)
```

## Remplacer la charte graphique

Toutes les couleurs et polices sont centralisées à deux endroits qui doivent rester
synchronisés :

- `src/styles/tokens.ts` — valeurs utilisées en JS (paliers de couleur des barres de
  durée, calculs de style dynamiques).
- `src/index.css` (bloc `@theme`) — les mêmes valeurs exposées comme utilitaires
  Tailwind (`bg-green`, `text-muted`, `font-display`, etc.).

Pour basculer vers une charte DGI/gouv.bj officielle, remplacer les valeurs dans ces
deux fichiers ; aucun composant ne code une couleur en dur en dehors de ces tokens
(à l'exception de quelques nuances de survol calculées à partir du vert primaire).

Les polices (Source Serif 4 pour les titres, Public Sans pour le corps) sont
chargées depuis Google Fonts via des balises `<link>` dans `index.html`.

## Données

`src/data/data.json` contient les 369 enregistrements du décret, avec deux champs
dérivés et non officiels : `cat` (catégorie indicative d'infraction, calculée à
partir du libellé) et `remis` (écart en mois entre la fin normale de peine et la
date du décret). Le caractère indicatif de ces champs est rappelé dans l'interface
(bandeau d'en-tête, astérisque du tableau, fiche latérale).

## Qualité

- Responsive jusqu'à ~360 px ; tableau → cartes empilées sous 760 px.
- Navigation clavier : `↑ ↓ ← →` pour parcourir les fiches, `Échap` pour fermer ;
  focus visibles (`:focus-visible`) ; `prefers-reduced-motion` respecté.
- `aria-live` sur le compteur de résultats, `aria-sort` sur les boutons de tri,
  `aria-pressed` sur les graphiques cliquables.
- Feuille de style d'impression dédiée (`@media print`) : dépile tout le registre,
  masque les contrôles interactifs. Bouton « Imprimer cette fiche » dans le panneau
  latéral pour n'imprimer qu'un seul enregistrement (`.print-fiche-only` dans
  `index.css`).
- État (filtres, tri, fiche ouverte) encodé dans `location.hash` → lien partageable
  via le bouton « Copier le lien ». Balises Open Graph / Twitter Card dans
  `index.html` pour les aperçus de lien.
- Recherche débouncée (~200 ms) : le champ reste réactif, le filtrage et l'écriture
  dans l'URL attendent une pause de frappe.
- `ErrorBoundary` racine : un plantage de rendu affiche un message de secours au
  lieu d'une page blanche.
- Lien « Signaler une erreur » (footer, panneau de méthodologie, fiche individuelle)
  → ouvre une issue GitHub pré-remplie sur ce dépôt ; il n'y a pas d'adresse de
  contact officielle à laquelle se raccrocher, cette page étant non officielle.

### Table basse laissée de côté : en-tête de tableau collant

Un `<thead>` collant a été tenté puis abandonné : le conteneur `overflow-x-auto`
qui permet le défilement horizontal du tableau large force, par la spécification
CSS, `overflow-y` à `auto` sur ce même conteneur — qui devient alors le conteneur
de référence pour `position: sticky` au lieu de la fenêtre. Comme ce conteneur ne
défile jamais lui-même verticalement (il grandit avec son contenu), l'en-tête ne
« colle » jamais réellement. Le corriger proprement demanderait soit de borner le
tableau à une hauteur fixe avec défilement interne (contraire au choix assumé de
pagination plutôt que de virtualisation), soit un en-tête recalculé en JS
synchronisé avec le défilement horizontal — complexité jugée disproportionnée pour
ce gain cosmétique.
