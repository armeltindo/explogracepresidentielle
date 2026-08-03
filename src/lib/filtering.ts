import { BUCKETS } from './buckets';
import type { Filters } from '../state';
import type { Person } from '../types';

type FilterSkip = keyof Filters | undefined;

/** Does person `p` satisfy `filters`? `skip` excludes one filter dimension — used to compute facet counts ("if I ignore this facet, how many results remain"). */
export function matches(p: Person, filters: Filters, skip?: FilterSkip): boolean {
  const q = filters.search.trim().toLowerCase();
  if (q && skip !== 'search') {
    const haystack = `${p.nom} ${p.inf} ${p.dossier} ${p.prison} ${p.trib}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  if (filters.filterCour && skip !== 'filterCour' && p.cour !== filters.filterCour) return false;
  if (filters.filterTrib && skip !== 'filterTrib' && p.trib !== filters.filterTrib) return false;
  if (filters.filterCat && skip !== 'filterCat' && p.cat !== filters.filterCat) return false;
  if (filters.filterPrison && skip !== 'filterPrison' && p.prison !== filters.filterPrison) return false;
  if (filters.filterAnnee && skip !== 'filterAnnee' && String(p.annee) !== String(filters.filterAnnee)) return false;
  if (filters.filterBucket && skip !== 'filterBucket') {
    const b = BUCKETS.find((x) => x.id === filters.filterBucket);
    if (b && !(p.duree >= b.min && p.duree < b.max)) return false;
  }
  return true;
}

export function getFiltered(data: Person[], filters: Filters, sortKey: string, sortDir: 'asc' | 'desc'): Person[] {
  const dir = sortDir === 'asc' ? 1 : -1;
  return data
    .filter((p) => matches(p, filters))
    .sort((a, b) => {
      if (sortKey === 'nom') return a.nom.localeCompare(b.nom, 'fr') * dir;
      if (sortKey === 'duree') return (a.duree - b.duree) * dir;
      if (sortKey === 'remis') return (a.remis - b.remis) * dir;
      return (a.num - b.num) * dir;
    });
}

export function median(nums: number[]): number {
  if (!nums.length) return 0;
  const a = [...nums].sort((x, y) => x - y);
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : Math.round((a[m - 1] + a[m]) / 2);
}

export interface FacetOption {
  value: string;
  label: string;
  disabled: boolean;
}

/** Options for a facet select, with result counts, greying out (disabling) choices that would produce zero results given the other active filters. */
export function facetOptions(
  data: Person[],
  filters: Filters,
  key: keyof Person,
  filterKey: keyof Filters,
): FacetOption[] {
  const avail = new Map<string, number>();
  data.forEach((p) => {
    if (matches(p, filters, filterKey)) {
      const v = String(p[key]);
      avail.set(v, (avail.get(v) || 0) + 1);
    }
  });
  const all = [...new Set(data.map((p) => String(p[key])))].sort((a, b) => a.localeCompare(b, 'fr'));
  return all.map((value) => {
    const c = avail.get(value) || 0;
    return { value, label: `${value} — ${c}`, disabled: c === 0 && filters[filterKey] !== value };
  });
}

export function groupCounts(data: Person[], key: keyof Person): [string, number][] {
  const m = new Map<string, number>();
  data.forEach((p) => {
    const v = String(p[key]);
    m.set(v, (m.get(v) || 0) + 1);
  });
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

export interface ParsedPeine {
  total: number | null;
  ferme: number | null;
}

export function parsePeine(str: string): ParsedPeine {
  const t = str.match(/(\d+)\s*mois/);
  const total = t ? parseInt(t[1], 10) : null;
  const f = str.match(/dont\s*(\d+)\s*mois\s*ferme/i);
  return { total, ferme: f ? parseInt(f[1], 10) : total };
}
