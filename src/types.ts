export type Ressort =
  | "Cour d'appel de Cotonou"
  | "Cour d'appel d'Abomey"
  | "Cour d'appel de Parakou"
  | 'CRIET'
  | 'Cour spéciale (foncier)'
  | (string & {});

/** One graciée record from the Décret n° 2026-546. `cat`, `remis` and `annee` are derived fields, not part of the official decree text. */
export interface Person {
  /** Official order number, 1..369 */
  num: number;
  nom: string;
  /** Offense label, verbatim from the decree */
  inf: string;
  cour: Ressort;
  trib: string;
  prison: string;
  /** Mandat de dépôt date, DD-MM-YYYY */
  mandat: string;
  /** Normal end-of-sentence date, DD-MM-YYYY */
  fin: string;
  peine: string;
  /** Months of detention already served */
  duree: number;
  dossier: string;
  /** Indicative offense category, derived from `inf` — not an official qualification */
  cat: string;
  /** Months of remaining sentence forgiven by the decree (fin - 31/07/2026), indicative */
  remis: number;
  /** Year extracted from `mandat` */
  annee: number;
}

export interface Stats {
  count: number;
  cours: number;
  tribs: number;
  prisons: number;
  mediane: number;
  medianeRemis: number;
}

export type SortKey = 'num' | 'nom' | 'duree' | 'remis';
export type SortDir = 'asc' | 'desc';
export type Density = 'confortable' | 'compacte';
