import { describe, expect, it } from 'vitest';
import type { Person } from '../types';
import type { Filters } from '../state';
import { facetOptions, getFiltered, groupCounts, matches, median, parsePeine } from './filtering';

function person(overrides: Partial<Person>): Person {
  return {
    num: 1,
    nom: 'DOE John',
    inf: 'Vol simple',
    cour: "Cour d'appel de Cotonou",
    trib: 'TPI Cotonou',
    prison: 'MA Cotonou',
    mandat: '01-01-2024',
    fin: '01-01-2025',
    peine: '12 mois',
    duree: 6,
    dossier: 'DOS-0001',
    cat: 'Vol simple',
    remis: 3,
    annee: 2024,
    ...overrides,
  };
}

const noFilters: Filters = {
  search: '',
  filterCour: '',
  filterTrib: '',
  filterCat: '',
  filterPrison: '',
  filterAnnee: '',
  filterBucket: '',
};

const data: Person[] = [
  person({ num: 1, nom: 'ABC Alice', cour: "Cour d'appel de Cotonou", cat: 'Vol simple', duree: 4, remis: 2, annee: 2023, dossier: 'D1' }),
  person({ num: 2, nom: 'ZEBRA Zoe', cour: "Cour d'appel d'Abomey", cat: 'Escroquerie', duree: 40, remis: 12, annee: 2024, dossier: 'D2' }),
  person({ num: 3, nom: 'MID Marc', inf: 'Escroquerie sur internet', cour: "Cour d'appel de Cotonou", cat: 'Escroquerie', duree: 90, remis: 30, annee: 2025, dossier: 'D3' }),
];

describe('matches', () => {
  it('has no effect when no filters are set', () => {
    expect(data.every((p) => matches(p, noFilters))).toBe(true);
  });

  it('filters by free-text search across nom/inf/dossier/prison/trib', () => {
    expect(matches(data[2], { ...noFilters, search: 'internet' })).toBe(true);
    expect(matches(data[0], { ...noFilters, search: 'internet' })).toBe(false);
  });

  it('search is case-insensitive', () => {
    expect(matches(data[0], { ...noFilters, search: 'aLiCe' })).toBe(true);
  });

  it('filters by ressort', () => {
    expect(matches(data[0], { ...noFilters, filterCour: "Cour d'appel de Cotonou" })).toBe(true);
    expect(matches(data[1], { ...noFilters, filterCour: "Cour d'appel de Cotonou" })).toBe(false);
  });

  it('filters by duration bucket', () => {
    // 0-6 bucket: min 0, max 6 (exclusive upper bound)
    expect(matches(data[0], { ...noFilters, filterBucket: '0-6' })).toBe(true);
    expect(matches(data[1], { ...noFilters, filterBucket: '0-6' })).toBe(false);
  });

  it('skip lets a dimension ignore its own active filter (used for facet counts)', () => {
    const withCour: Filters = { ...noFilters, filterCour: "Cour d'appel d'Abomey" };
    expect(matches(data[0], withCour)).toBe(false);
    expect(matches(data[0], withCour, 'filterCour')).toBe(true);
  });

  it('combines multiple active filters (AND)', () => {
    const f: Filters = { ...noFilters, filterCour: "Cour d'appel de Cotonou", filterCat: 'Escroquerie' };
    expect(matches(data[0], f)).toBe(false); // wrong cat
    expect(matches(data[2], f)).toBe(true); // matches both
  });
});

describe('getFiltered', () => {
  it('sorts by num ascending by default direction', () => {
    const out = getFiltered(data, noFilters, 'num', 'asc');
    expect(out.map((p) => p.num)).toEqual([1, 2, 3]);
  });

  it('sorts by num descending', () => {
    const out = getFiltered(data, noFilters, 'num', 'desc');
    expect(out.map((p) => p.num)).toEqual([3, 2, 1]);
  });

  it('sorts by nom using French locale order', () => {
    const out = getFiltered(data, noFilters, 'nom', 'asc');
    expect(out.map((p) => p.nom)).toEqual(['ABC Alice', 'MID Marc', 'ZEBRA Zoe']);
  });

  it('sorts by duree', () => {
    const out = getFiltered(data, noFilters, 'duree', 'asc');
    expect(out.map((p) => p.duree)).toEqual([4, 40, 90]);
  });

  it('sorts by remis', () => {
    const out = getFiltered(data, noFilters, 'remis', 'desc');
    expect(out.map((p) => p.remis)).toEqual([30, 12, 2]);
  });

  it('applies filters before sorting', () => {
    const out = getFiltered(data, { ...noFilters, filterCat: 'Escroquerie' }, 'num', 'asc');
    expect(out.map((p) => p.num)).toEqual([2, 3]);
  });
});

describe('median', () => {
  it('returns 0 for an empty list', () => {
    expect(median([])).toBe(0);
  });

  it('returns the middle value for an odd-length list', () => {
    expect(median([1, 5, 3])).toBe(3);
  });

  it('averages (rounded) the two middle values for an even-length list', () => {
    expect(median([1, 2, 4, 5])).toBe(Math.round((2 + 4) / 2));
  });
});

describe('groupCounts', () => {
  it('counts occurrences per key, sorted descending by count', () => {
    const out = groupCounts(data, 'cat');
    expect(out).toEqual([
      ['Escroquerie', 2],
      ['Vol simple', 1],
    ]);
  });
});

describe('facetOptions', () => {
  it('labels each option with its count under the current filters', () => {
    const opts = facetOptions(data, noFilters, 'cour', 'filterCour');
    const cotonou = opts.find((o) => o.value === "Cour d'appel de Cotonou");
    expect(cotonou?.label).toBe("Cour d'appel de Cotonou — 2");
    expect(cotonou?.disabled).toBe(false);
  });

  it('disables options that would produce zero results, without disabling the currently selected one', () => {
    // Only person #1 (Cotonou) is "Vol simple"; Abomey has none under that category.
    const filters: Filters = { ...noFilters, filterCat: 'Vol simple' };
    const opts = facetOptions(data, filters, 'cour', 'filterCour');
    expect(opts.find((o) => o.value === "Cour d'appel de Cotonou")?.disabled).toBe(false);
    expect(opts.find((o) => o.value === "Cour d'appel d'Abomey")?.disabled).toBe(true);

    // Selecting that zero-result option directly must keep it enabled/visible so it stays choosable.
    const withSelection: Filters = { ...filters, filterCour: "Cour d'appel d'Abomey" };
    const opts2 = facetOptions(data, withSelection, 'cour', 'filterCour');
    expect(opts2.find((o) => o.value === "Cour d'appel d'Abomey")?.disabled).toBe(false);
  });
});

describe('parsePeine', () => {
  it('parses a simple sentence with no sursis', () => {
    expect(parsePeine('48 mois')).toEqual({ total: 48, ferme: 48 });
  });

  it('parses a sentence with "dont X mois ferme"', () => {
    expect(parsePeine('24 mois dont 12 mois ferme')).toEqual({ total: 24, ferme: 12 });
  });

  it('returns nulls when it cannot find a month count', () => {
    expect(parsePeine('peine non précisée')).toEqual({ total: null, ferme: null });
  });
});
