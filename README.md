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
  hooks/
    useMediaQuery.ts         bascule tableau (desktop) / cartes (mobile, <760px)
  components/
    Header, Footer, FlagStripe    bandeau institutionnel, devise nationale
    StatsCartouche                cartouche de statistiques
    ChartsSection, charts/        graphiques cliquables (ressort, catégorie, année,
                                   durée, matrice ressort × catégorie)
    FilterBar, FilterChips        recherche + filtres cumulables + puces actives
    ResultsBar                    compteur (aria-live), légende, tri, densité
    PersonTable, PersonCards      registre (desktop) / cartes empilées (mobile)
    LoadMore                      pagination par paliers de 20
    DetailPanel                   fiche latérale (précédent/suivant/fermer)
  styles/tokens.ts           couleurs, typographies, paliers de couleur de durée
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
  masque les contrôles interactifs.
- État (filtres, tri, fiche ouverte) encodé dans `location.hash` → lien partageable
  via le bouton « Copier le lien ».
