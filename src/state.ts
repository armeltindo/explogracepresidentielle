import type { SortDir, SortKey } from './types';

export interface Filters {
  search: string;
  filterCour: string;
  filterTrib: string;
  filterCat: string;
  filterPrison: string;
  filterAnnee: string;
  filterBucket: string;
}

export interface AppState extends Filters {
  sortKey: SortKey;
  sortDir: SortDir;
  selected: number | null;
  visibleCount: number;
}

export const DEFAULT_VISIBLE_COUNT = 20;
export const VISIBLE_COUNT_STEP = 20;

export const initialState: AppState = {
  search: '',
  filterCour: '',
  filterTrib: '',
  filterCat: '',
  filterPrison: '',
  filterAnnee: '',
  filterBucket: '',
  sortKey: 'num',
  sortDir: 'asc',
  selected: null,
  visibleCount: DEFAULT_VISIBLE_COUNT,
};

export const FILTER_KEYS: (keyof Filters)[] = [
  'search',
  'filterCour',
  'filterTrib',
  'filterCat',
  'filterPrison',
  'filterAnnee',
  'filterBucket',
];
