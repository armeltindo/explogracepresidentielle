import type { Density, SortDir, SortKey } from '../types';
import { DURATION_TIERS } from '../styles/tokens';

interface SortButtonProps {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  dir: SortDir;
  onClick: () => void;
}

function ariaSort(active: boolean, dir: SortDir): 'ascending' | 'descending' | 'none' {
  if (!active) return 'none';
  return dir === 'asc' ? 'ascending' : 'descending';
}

function SortButton({ label, sortKey, activeKey, dir, onClick }: SortButtonProps) {
  const active = sortKey === activeKey;
  return (
    <button
      onClick={onClick}
      aria-sort={ariaSort(active, dir)}
      className={`cursor-pointer border px-[10px] py-[6px] text-xs ${
        active ? 'border-green bg-green-soft' : 'border-line bg-transparent'
      }`}
    >
      {label} {active ? (dir === 'asc' ? '▲' : '▼') : ''}
    </button>
  );
}

interface Props {
  resultLabel: string;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  density: Density;
  onToggleDensity: () => void;
}

export function ResultsBar({ resultLabel, sortKey, sortDir, onSort, density, onToggleDensity }: Props) {
  return (
    <section className="my-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <p aria-live="polite" className="m-0 text-[13px] text-muted">
          {resultLabel}
        </p>
        <span className="no-print flex flex-wrap items-center gap-[10px] text-[11px] text-muted">
          {DURATION_TIERS.map((t) => (
            <span key={t.label} className="flex items-center gap-1">
              <span className="h-[10px] w-[10px]" style={{ background: t.color }} />
              {t.label}
            </span>
          ))}
        </span>
      </div>
      <div className="no-print flex flex-wrap items-center gap-[6px] text-xs">
        <button
          onClick={onToggleDensity}
          className="cursor-pointer border border-line bg-transparent px-[10px] py-[6px] text-xs text-muted hover:border-green hover:text-ink"
        >
          Densité : {density === 'compacte' ? 'compacte' : 'confortable'}
        </button>
        <span className="mr-[2px] ml-2 text-muted">Trier :</span>
        <SortButton label="N°" sortKey="num" activeKey={sortKey} dir={sortDir} onClick={() => onSort('num')} />
        <SortButton label="Nom" sortKey="nom" activeKey={sortKey} dir={sortDir} onClick={() => onSort('nom')} />
        <SortButton label="Durée" sortKey="duree" activeKey={sortKey} dir={sortDir} onClick={() => onSort('duree')} />
        <SortButton label="Reliquat" sortKey="remis" activeKey={sortKey} dir={sortDir} onClick={() => onSort('remis')} />
      </div>
    </section>
  );
}
