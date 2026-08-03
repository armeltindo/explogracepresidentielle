import type { AppState } from '../state';
import { initialState } from '../state';
import type { SortDir, SortKey } from '../types';

const SORT_KEYS: SortKey[] = ['num', 'nom', 'duree', 'remis'];

/** Reads filters/sort/selected fiche from `location.hash` (`#q=...&ressort=...`). */
export function readHashState(): Partial<AppState> {
  const params = new URLSearchParams((location.hash || '').replace(/^#/, ''));
  const out: Partial<AppState> = {};
  if (params.get('q')) out.search = params.get('q')!;
  if (params.get('ressort')) out.filterCour = params.get('ressort')!;
  if (params.get('tribunal')) out.filterTrib = params.get('tribunal')!;
  if (params.get('categorie')) out.filterCat = params.get('categorie')!;
  if (params.get('lieu')) out.filterPrison = params.get('lieu')!;
  if (params.get('annee')) out.filterAnnee = params.get('annee')!;
  if (params.get('duree')) out.filterBucket = params.get('duree')!;
  if (params.get('fiche')) out.selected = parseInt(params.get('fiche')!, 10);
  if (params.get('tri')) {
    const [k, d] = params.get('tri')!.split('.');
    if (k && (SORT_KEYS as string[]).includes(k)) out.sortKey = k as SortKey;
    if (d === 'asc' || d === 'desc') out.sortDir = d as SortDir;
  }
  return out;
}

/** Serializes the shareable parts of state back into `location.hash`, replacing history (no new entries per keystroke). */
export function writeHashState(state: AppState): void {
  const p = new URLSearchParams();
  if (state.search.trim()) p.set('q', state.search.trim());
  if (state.filterCour) p.set('ressort', state.filterCour);
  if (state.filterTrib) p.set('tribunal', state.filterTrib);
  if (state.filterCat) p.set('categorie', state.filterCat);
  if (state.filterPrison) p.set('lieu', state.filterPrison);
  if (state.filterAnnee) p.set('annee', state.filterAnnee);
  if (state.filterBucket) p.set('duree', state.filterBucket);
  if (state.sortKey !== initialState.sortKey || state.sortDir !== initialState.sortDir) {
    p.set('tri', `${state.sortKey}.${state.sortDir}`);
  }
  if (state.selected != null) p.set('fiche', String(state.selected));
  const hash = p.toString();
  const next = location.pathname + location.search + (hash ? '#' + hash : '');
  if (location.hash.replace(/^#/, '') !== hash) history.replaceState(null, '', next);
}
