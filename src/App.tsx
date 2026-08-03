import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import rawData from './data/data.json';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FlagStripe } from './components/FlagStripe';
import { StatsCartouche } from './components/StatsCartouche';
import { ChartsSection } from './components/ChartsSection';
import { FilterBar } from './components/FilterBar';
import { FilterChips, type Chip } from './components/FilterChips';
import { ResultsBar } from './components/ResultsBar';
import { EmptyState } from './components/EmptyState';
import { PersonTable } from './components/PersonTable';
import { PersonCards } from './components/PersonCards';
import { LoadMore } from './components/LoadMore';
import { DetailPanel } from './components/DetailPanel';
import { MethodologyModal } from './components/MethodologyModal';
import { useMediaQuery } from './hooks/useMediaQuery';
import { BUCKETS } from './lib/buckets';
import { exportCSV } from './lib/csv';
import { facetOptions, getFiltered, median } from './lib/filtering';
import { printFiche } from './lib/printFiche';
import { readHashState, writeHashState } from './lib/urlState';
import { initialState, VISIBLE_COUNT_STEP, type AppState, type Filters } from './state';
import type { Density, Person, SortKey } from './types';

const SEARCH_DEBOUNCE_MS = 200;

const data = rawData as Person[];

type FacetFilterKey = 'filterCour' | 'filterCat' | 'filterBucket' | 'filterAnnee' | 'filterTrib' | 'filterPrison';

export default function App() {
  const [state, setState] = useState<AppState>(() => ({ ...initialState, ...readHashState() }));
  const [density, setDensity] = useState<Density>('confortable');
  const [copied, setCopied] = useState(false);
  const [showMethodology, setShowMethodology] = useState(false);
  const isMobile = useMediaQuery('(max-width: 760px)');

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    writeHashState(state);
  }, [state]);

  const { search, filterCour, filterTrib, filterCat, filterPrison, filterAnnee, filterBucket, sortKey, sortDir } =
    state;
  const filtered = useMemo(
    () =>
      getFiltered(
        data,
        { search, filterCour, filterTrib, filterCat, filterPrison, filterAnnee, filterBucket },
        sortKey,
        sortDir,
      ),
    [search, filterCour, filterTrib, filterCat, filterPrison, filterAnnee, filterBucket, sortKey, sortDir],
  );

  const step = useCallback((delta: number) => {
    const s = stateRef.current;
    const list = getFiltered(data, s, s.sortKey, s.sortDir);
    if (!list.length) return;
    const cur = list.findIndex((p) => p.num === s.selected);
    const next = cur === -1 ? 0 : Math.min(list.length - 1, Math.max(0, cur + delta));
    setState((prev) => ({ ...prev, selected: list[next].num }));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      if (e.key === 'Escape' && s.selected != null) {
        setState((prev) => ({ ...prev, selected: null }));
        return;
      }
      const target = e.target as HTMLElement | null;
      if (target && /input|select|textarea/i.test(target.tagName)) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        step(1);
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        step(-1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  const set = useCallback((patch: Partial<Filters> & Partial<Pick<AppState, 'selected'>>) => {
    setState((s) => ({ ...s, ...patch, visibleCount: initialState.visibleCount }));
  }, []);

  // The search box stays immediately responsive; the actual filter (and the URL-hash
  // write it triggers) is debounced so fast typing doesn't churn the URL or recompute
  // facet counts on every keystroke.
  const [searchInput, setSearchInput] = useState(state.search);
  useEffect(() => {
    setSearchInput(state.search);
  }, [state.search]);
  useEffect(() => {
    if (searchInput === state.search) return;
    const t = setTimeout(() => set({ search: searchInput }), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchInput, state.search, set]);

  const toggleFilter = useCallback((key: FacetFilterKey, value: string) => {
    setState((s) => ({ ...s, [key]: s[key] === value ? '' : value, visibleCount: initialState.visibleCount }));
  }, []);

  const setCourAndCat = useCallback((cour: string, cat: string) => {
    setState((s) => ({ ...s, filterCour: cour, filterCat: cat, visibleCount: initialState.visibleCount }));
  }, []);

  const onResetFilters = useCallback(() => {
    set({
      search: '',
      filterCour: '',
      filterTrib: '',
      filterCat: '',
      filterPrison: '',
      filterAnnee: '',
      filterBucket: '',
    });
  }, [set]);

  const sortBy = useCallback((key: SortKey) => {
    setState((s) => ({ ...s, sortKey: key, sortDir: s.sortKey === key && s.sortDir === 'asc' ? 'desc' : 'asc' }));
  }, []);

  const onSelect = useCallback((num: number) => setState((s) => ({ ...s, selected: num })), []);
  const onClosePanel = useCallback(() => setState((s) => ({ ...s, selected: null })), []);
  const onShowMore = useCallback(
    () => setState((s) => ({ ...s, visibleCount: s.visibleCount + VISIBLE_COUNT_STEP })),
    [],
  );
  const onShowAll = useCallback(() => setState((s) => ({ ...s, visibleCount: Infinity })), []);

  const onPrint = useCallback(() => {
    setState((s) => ({ ...s, visibleCount: Infinity, selected: null }));
    setTimeout(() => window.print(), 150);
  }, []);

  const onCopyLink = useCallback(() => {
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done, done);
    else done();
  }, []);

  const onExportCSV = useCallback(() => exportCSV(filtered), [filtered]);

  const maxDuree = data.length ? Math.max(...data.map((d) => d.duree)) : 1;
  const shown = filtered.slice(0, state.visibleCount);
  const remaining = filtered.length - shown.length;
  const query = state.search.trim().toLowerCase();

  const stats = {
    count: filtered.length,
    cours: new Set(filtered.map((p) => p.cour)).size,
    tribs: new Set(filtered.map((p) => p.trib)).size,
    prisons: new Set(filtered.map((p) => p.prison)).size,
    mediane: median(filtered.map((p) => p.duree)),
    medianeRemis: median(filtered.map((p) => p.remis)),
  };

  const courOptions = useMemo(() => facetOptions(data, state, 'cour', 'filterCour'), [state]);
  const tribOptions = useMemo(() => facetOptions(data, state, 'trib', 'filterTrib'), [state]);
  const catOptions = useMemo(() => facetOptions(data, state, 'cat', 'filterCat'), [state]);
  const prisonOptions = useMemo(() => facetOptions(data, state, 'prison', 'filterPrison'), [state]);

  const chips: Chip[] = [];
  if (state.search.trim()) chips.push({ label: `« ${state.search.trim()} »`, onRemove: () => set({ search: '' }) });
  if (state.filterCour) chips.push({ label: state.filterCour, onRemove: () => set({ filterCour: '' }) });
  if (state.filterTrib) chips.push({ label: state.filterTrib, onRemove: () => set({ filterTrib: '' }) });
  if (state.filterCat) chips.push({ label: state.filterCat, onRemove: () => set({ filterCat: '' }) });
  if (state.filterPrison) chips.push({ label: state.filterPrison, onRemove: () => set({ filterPrison: '' }) });
  if (state.filterAnnee)
    chips.push({ label: `Mandats ${state.filterAnnee}`, onRemove: () => set({ filterAnnee: '' }) });
  if (state.filterBucket) {
    const b = BUCKETS.find((x) => x.id === state.filterBucket);
    chips.push({ label: b ? b.label : state.filterBucket, onRemove: () => set({ filterBucket: '' }) });
  }

  const selected = state.selected != null ? (data.find((p) => p.num === state.selected) ?? null) : null;

  const resultLabel = `${filtered.length} résultat${filtered.length !== 1 ? 's' : ''} sur 369 — ${shown.length} affiché${shown.length !== 1 ? 's' : ''}`;

  return (
    <div className="min-h-screen">
      <div className="app-chrome">
        <FlagStripe />
        <Header
          onExportCSV={onExportCSV}
          onCopyLink={onCopyLink}
          copyLinkLabel={copied ? 'Lien copié ✓' : 'Copier le lien'}
          onPrint={onPrint}
          onOpenMethodology={() => setShowMethodology(true)}
        />

        <main className="mx-auto max-w-[1440px] px-8 pt-[26px] pb-[70px]">
          <StatsCartouche stats={stats} />

          <ChartsSection data={data} filters={state} toggleFilter={toggleFilter} setCourAndCat={setCourAndCat} />

          <FilterBar
            search={searchInput}
            onSearchChange={(e) => setSearchInput(e.target.value)}
            filterCour={state.filterCour}
            courOptions={courOptions}
            onCourChange={(e) => set({ filterCour: e.target.value })}
            filterTrib={state.filterTrib}
            tribOptions={tribOptions}
            onTribChange={(e) => set({ filterTrib: e.target.value })}
            filterCat={state.filterCat}
            catOptions={catOptions}
            onCatChange={(e) => set({ filterCat: e.target.value })}
            filterPrison={state.filterPrison}
            prisonOptions={prisonOptions}
            onPrisonChange={(e) => set({ filterPrison: e.target.value })}
            onReset={onResetFilters}
          />

          <FilterChips chips={chips} />

          <ResultsBar
            resultLabel={resultLabel}
            sortKey={state.sortKey}
            sortDir={state.sortDir}
            onSort={sortBy}
            density={density}
            onToggleDensity={() => setDensity((d) => (d === 'compacte' ? 'confortable' : 'compacte'))}
          />

          {filtered.length === 0 ? (
            <EmptyState onReset={onResetFilters} />
          ) : isMobile ? (
            <PersonCards
              rows={shown}
              maxDuree={maxDuree}
              query={query}
              selected={state.selected}
              onSelect={onSelect}
            />
          ) : (
            <PersonTable
              rows={shown}
              maxDuree={maxDuree}
              query={query}
              density={density}
              selected={state.selected}
              onSelect={onSelect}
            />
          )}

          <LoadMore remaining={remaining} total={filtered.length} onShowMore={onShowMore} onShowAll={onShowAll} />

          <p className="mt-[14px] text-[11px] leading-[1.6] text-muted">
            * Catégorisation indicative établie à partir du libellé de l'infraction ; ne constitue pas une
            qualification officielle. « Reliquat remis » = écart entre la fin normale de peine et la date du
            décret (31 juillet 2026), arrondi au mois — indicatif également.
            <br />
            Navigation clavier : <strong>↑ ↓</strong> parcourir les fiches · <strong>← →</strong> fiche
            précédente / suivante · <strong>Échap</strong> fermer.
          </p>
        </main>

        <Footer onOpenMethodology={() => setShowMethodology(true)} />
      </div>

      {selected && (
        <DetailPanel
          person={selected}
          maxDuree={maxDuree}
          onClose={onClosePanel}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          onFilterSameCour={() => set({ filterCour: selected.cour, selected: null })}
          onFilterSameCat={() => set({ filterCat: selected.cat, selected: null })}
          onFilterSamePrison={() => set({ filterPrison: selected.prison, selected: null })}
          onPrintFiche={printFiche}
        />
      )}

      {showMethodology && <MethodologyModal data={data} onClose={() => setShowMethodology(false)} />}
    </div>
  );
}
