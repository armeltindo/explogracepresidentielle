import type { ReactNode } from 'react';
import type { Stats } from '../types';

interface Tile {
  label: string;
  value: ReactNode;
  unit?: string;
  sub?: string;
  accent?: 'green' | 'yellow';
}

function StatTile({ label, value, unit, sub, accent }: Tile) {
  const accentBorder =
    accent === 'green' ? 'border-t-[3px] border-t-green' : accent === 'yellow' ? 'border-t-[3px] border-t-yellow' : '';
  return (
    <div className={`border border-line bg-white px-[17px] py-[15px] ${accentBorder}`}>
      <p className="m-0 mb-[3px] text-[11px] tracking-[0.06em] text-muted uppercase">{label}</p>
      <p className={`m-0 font-display text-[27px] font-bold ${accent === 'green' ? 'text-green' : 'text-ink'}`}>
        {value} {unit && <span className="text-[13px] font-medium text-muted">{unit}</span>}
      </p>
      {sub && <p className="mt-[2px] mb-0 text-[11px] text-muted">{sub}</p>}
    </div>
  );
}

export function StatsCartouche({ stats }: { stats: Stats }) {
  return (
    <section className="mb-[26px] grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3">
      <StatTile label="Résultats" value={stats.count} sub="sur 369 personnes" accent="green" />
      <StatTile label="Ressorts" value={stats.cours} />
      <StatTile label="Tribunaux" value={stats.tribs} />
      <StatTile label="Lieux de détention" value={stats.prisons} />
      <StatTile label="Détention médiane" value={stats.mediane} unit="mois" />
      <StatTile
        label="Reliquat médian remis"
        value={stats.medianeRemis}
        unit="mois"
        sub="écart fin de peine / décret"
        accent="yellow"
      />
    </section>
  );
}
