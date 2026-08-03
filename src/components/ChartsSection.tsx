import { useMemo } from 'react';
import { BUCKETS } from '../lib/buckets';
import { groupCounts } from '../lib/filtering';
import type { Filters } from '../state';
import type { Person } from '../types';
import { BarRows } from './charts/BarRows';
import { Matrix } from './charts/Matrix';
import { YearChart } from './charts/YearChart';

interface Props {
  data: Person[];
  filters: Filters;
  toggleFilter: (key: 'filterCour' | 'filterCat' | 'filterBucket' | 'filterAnnee', value: string) => void;
  setCourAndCat: (cour: string, cat: string) => void;
}

const cardClass = 'border border-line bg-white px-[19px] py-[17px]';
const titleClass = 'm-0 mb-[13px] text-xs font-bold tracking-[0.06em] uppercase';
const hintClass = 'text-muted font-normal normal-case tracking-normal';

export function ChartsSection({ data, filters, toggleFilter, setCourAndCat }: Props) {
  const courEntries = useMemo(() => groupCounts(data, 'cour'), [data]);
  const catEntries = useMemo(() => groupCounts(data, 'cat'), [data]);

  const ressortItems = courEntries.map(([label, count]) => ({
    label,
    count,
    active: filters.filterCour === label,
    onClick: () => toggleFilter('filterCour', label),
  }));

  const catItems = catEntries.map(([label, count]) => ({
    label,
    count,
    active: filters.filterCat === label,
    onClick: () => toggleFilter('filterCat', label),
  }));

  const bucketItems = BUCKETS.map((b) => ({
    label: b.label,
    count: data.filter((p) => p.duree >= b.min && p.duree < b.max).length,
    active: filters.filterBucket === b.id,
    onClick: () => toggleFilter('filterBucket', b.id),
  }));

  const years = useMemo(() => {
    const m = new Map<number, number>();
    data.forEach((p) => m.set(p.annee, (m.get(p.annee) || 0) + 1));
    return [...m.entries()].sort((a, b) => a[0] - b[0]);
  }, [data]);

  const yearItems = years.map(([year, count]) => ({
    year,
    count,
    active: String(filters.filterAnnee) === String(year),
    onClick: () => toggleFilter('filterAnnee', String(year)),
  }));

  const topCats = catEntries.slice(0, 8).map(([cat]) => cat);
  const matrixMax = Math.max(
    1,
    ...courEntries.map(([cour]) => Math.max(...topCats.map((cat) => data.filter((p) => p.cour === cour && p.cat === cat).length))),
  );
  const matrixRows = courEntries.map(([cour]) => ({
    label: cour,
    cells: topCats.map((cat) => {
      const n = data.filter((p) => p.cour === cour && p.cat === cat).length;
      return { count: n, title: `${cour} × ${cat} : ${n}`, onClick: () => setCourAndCat(cour, cat) };
    }),
  }));

  return (
    <>
      <section className="no-print mb-[14px] grid grid-cols-[repeat(auto-fit,minmax(330px,1fr))] gap-[14px]">
        <div className={cardClass}>
          <p className={titleClass}>
            Par ressort <span className={hintClass}>— cliquer pour filtrer</span>
          </p>
          <BarRows items={ressortItems} />
        </div>

        <div className={cardClass}>
          <p className={titleClass}>
            Par catégorie <span className={hintClass}>— indicative</span>
          </p>
          <div className="max-h-[250px] overflow-x-hidden overflow-y-auto px-[10px] pr-[10px] pl-[6px]">
            <BarRows items={catItems} />
          </div>
        </div>

        <div className={cardClass}>
          <p className={titleClass}>Mandats de dépôt par année</p>
          <YearChart items={yearItems} />
          <p className="mt-[10px] mb-0 text-[11px] text-muted">
            La majorité des mandats datent de 2025 — détentions récentes et courtes peines.
          </p>
        </div>

        <div className={cardClass}>
          <p className={titleClass}>Durée déjà exécutée</p>
          <BarRows items={bucketItems} />
        </div>
      </section>

      <section className="no-print mb-[22px] overflow-x-auto border border-line bg-white px-[19px] py-[17px]">
        <p className="m-0 mb-[14px] text-xs font-bold tracking-[0.06em] uppercase">
          Ressort × catégorie{' '}
          <span className={hintClass}>— cliquer une case pour croiser les deux filtres</span>
        </p>
        <Matrix cols={topCats} rows={matrixRows} max={matrixMax} />
      </section>
    </>
  );
}
