import { highlight } from '../lib/highlight';
import { tierColor } from '../styles/tokens';
import type { Person } from '../types';

interface Props {
  rows: Person[];
  maxDuree: number;
  query: string;
  selected: number | null;
  onSelect: (num: number) => void;
}

export function PersonCards({ rows, maxDuree, query, selected, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-[10px]">
      {rows.map((p) => {
        const pct = Math.min(100, Math.round((p.duree / maxDuree) * 100));
        const isSelected = selected === p.num;
        return (
          <div
            key={p.num}
            onClick={() => onSelect(p.num)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(p.num);
              }
            }}
            className={`cursor-pointer border border-line px-4 py-[14px] ${isSelected ? 'bg-green-soft' : 'bg-white'}`}
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-display text-[17px] font-bold">{highlight(p.nom, query)}</span>
              <span className="text-xs text-muted">n° {p.num}</span>
            </div>
            <p className="m-0 mt-[6px] text-[13px] leading-[1.5] text-text">{highlight(p.inf, query)}</p>
            <div className="mt-2">
              <span className="inline-block border border-line bg-track px-2 py-[3px] text-[11px] whitespace-nowrap text-text">
                {p.cat}
              </span>
            </div>
            <p className="m-0 mt-[9px] text-xs leading-[1.6] text-muted">
              {p.prison} · {p.cour}
              <br />
              {p.peine} — {p.duree} mois exécutés · reliquat remis {p.remis} mois
            </p>
            <div className="mt-2 h-[8px] bg-track">
              <div className="h-full" style={{ width: `${pct}%`, background: tierColor(p.duree) }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
