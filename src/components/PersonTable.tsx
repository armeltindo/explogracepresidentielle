import { parsePeine } from '../lib/filtering';
import { highlight } from '../lib/highlight';
import { tierColor } from '../styles/tokens';
import type { Density, Person } from '../types';

const HEADERS = [
  'N°',
  'Nom et prénoms',
  'Infraction',
  'Catégorie*',
  'Ressort',
  'Tribunal',
  'Lieu de détention',
  'Mandat',
  'Fin normale',
  'Peine',
  'Durée exécutée',
  'Reliquat remis',
  'N° dossier',
];

interface Props {
  rows: Person[];
  maxDuree: number;
  query: string;
  density: Density;
  selected: number | null;
  onSelect: (num: number) => void;
}

export function PersonTable({ rows, maxDuree, query, density, selected, onSelect }: Props) {
  const pad = density === 'compacte' ? 'px-[10px] py-[5px]' : 'px-3 py-[9px]';

  return (
    <div className="print-table overflow-x-auto border border-line bg-white">
      <table className="w-full min-w-[1560px] border-collapse text-[13px]">
        <thead>
          <tr className="bg-ink text-left text-white">
            {HEADERS.map((h) => (
              <th key={h} className="px-3 py-[10px] font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => {
            const { total, ferme } = parsePeine(p.peine);
            const hasSursis = total != null && ferme != null && ferme < total;
            const pct = Math.min(100, Math.round((p.duree / maxDuree) * 100));
            const isSelected = selected === p.num;
            return (
              <tr
                key={p.num}
                onClick={() => onSelect(p.num)}
                className={`cursor-pointer border-b border-line hover:bg-paper ${isSelected ? 'bg-green-soft' : 'bg-white'}`}
              >
                <td className={`${pad} align-top text-text`}>{p.num}</td>
                <td className={`${pad} align-top font-semibold`}>{highlight(p.nom, query)}</td>
                <td className={`${pad} align-top text-text`}>{highlight(p.inf, query)}</td>
                <td className={`${pad} align-top text-text`}>
                  <span className="inline-block border border-line bg-track px-2 py-[3px] text-[11px] whitespace-nowrap text-text">
                    {p.cat}
                  </span>
                </td>
                <td className={`${pad} align-top text-text`}>{p.cour}</td>
                <td className={`${pad} align-top text-text`}>{p.trib}</td>
                <td className={`${pad} align-top text-text`}>{p.prison}</td>
                <td className={`${pad} align-top text-text`}>{p.mandat}</td>
                <td className={`${pad} align-top text-text`}>{p.fin}</td>
                <td className={`${pad} align-top text-text`}>
                  {p.peine}
                  {hasSursis && (
                    <>
                      <br />
                      <span className="mt-[2px] inline-block bg-yellow px-[6px] py-[1px] text-[11px] font-bold text-ink">
                        {ferme} mois ferme
                      </span>
                    </>
                  )}
                </td>
                <td className={`${pad} align-top text-text`}>
                  <div className="flex min-w-[140px] items-center gap-2">
                    <div className="h-[9px] flex-1 bg-track">
                      <div className="h-full" style={{ width: `${pct}%`, background: tierColor(p.duree) }} />
                    </div>
                    <span className="text-xs whitespace-nowrap text-muted">{p.duree} mois</span>
                  </div>
                </td>
                <td className={`${pad} align-top text-text`}>
                  <span className="font-semibold">{p.remis} mois</span>
                </td>
                <td className={`${pad} align-top text-xs text-muted`}>{p.dossier}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
