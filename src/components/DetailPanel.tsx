import { tierColor } from '../styles/tokens';
import type { Person } from '../types';

interface Row {
  label: string;
  value: string;
  narrow?: boolean;
}

function InfoRow({ label, value }: Row) {
  return (
    <div className="flex justify-between gap-[14px] border-t border-line py-[10px]">
      <span className="text-[11px] tracking-[0.06em] text-muted uppercase">{label}</span>
      <span className="text-right text-[13px]">{value}</span>
    </div>
  );
}

interface Props {
  person: Person;
  maxDuree: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onFilterSameCour: () => void;
  onFilterSameCat: () => void;
  onFilterSamePrison: () => void;
}

export function DetailPanel({
  person,
  maxDuree,
  onClose,
  onPrev,
  onNext,
  onFilterSameCour,
  onFilterSameCat,
  onFilterSamePrison,
}: Props) {
  const pct = Math.min(100, Math.round((person.duree / maxDuree) * 100));

  return (
    <>
      <div className="no-print fixed inset-0 z-40 bg-ink/45" onClick={onClose} />
      <aside className="no-print fixed top-0 right-0 bottom-0 z-40 w-[min(440px,94vw)] overflow-y-auto bg-white px-7 pt-[26px] pb-10 shadow-[-6px_0_24px_rgba(20,37,28,0.2)]">
        <div className="mb-[18px] flex items-center justify-between gap-[10px]">
          <p className="m-0 text-xs tracking-[0.06em] text-muted uppercase">Fiche {person.num} / 369</p>
          <div className="flex gap-[6px]">
            <button
              onClick={onPrev}
              aria-label="Fiche précédente"
              className="h-[30px] w-[30px] cursor-pointer border border-line bg-transparent"
            >
              ←
            </button>
            <button
              onClick={onNext}
              aria-label="Fiche suivante"
              className="h-[30px] w-[30px] cursor-pointer border border-line bg-transparent"
            >
              →
            </button>
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="h-[30px] w-[30px] cursor-pointer border border-line bg-transparent"
            >
              ✕
            </button>
          </div>
        </div>

        <h2 className="m-0 mb-2 font-display text-2xl leading-[1.15]">{person.nom}</h2>
        <span className="inline-block border border-line bg-track px-[9px] py-[3px] text-xs">{person.cat}</span>
        <p className="m-0 mt-[18px] text-sm leading-[1.6]">{person.inf}</p>

        <div className="mt-[22px]">
          <InfoRow label="Ressort" value={person.cour} />
          <InfoRow label="Tribunal" value={person.trib} />
          <InfoRow label="Lieu de détention" value={person.prison} />
          <InfoRow label="Mandat de dépôt" value={person.mandat} />
          <InfoRow label="Fin normale de peine" value={person.fin} />
          <InfoRow label="Peine prononcée" value={person.peine} />
          <div className="flex justify-between gap-[14px] border-t border-b border-line py-[10px]">
            <span className="text-[11px] tracking-[0.06em] text-muted uppercase">N° dossier</span>
            <span className="text-right text-xs">{person.dossier}</span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-[18px]">
          <div className="flex-1 basis-[150px]">
            <p className="m-0 mb-[6px] text-[11px] tracking-[0.06em] text-muted uppercase">Détention exécutée</p>
            <div className="h-[9px] bg-track">
              <div className="h-full" style={{ width: `${pct}%`, background: tierColor(person.duree) }} />
            </div>
            <p className="mt-[7px] mb-0 font-display text-[22px]">
              {person.duree} <span className="font-body text-[13px] text-muted">mois</span>
            </p>
          </div>
          <div className="flex-1 basis-[130px]">
            <p className="m-0 mb-[6px] text-[11px] tracking-[0.06em] text-muted uppercase">Reliquat remis</p>
            <p className="m-0 font-display text-[22px]">{person.remis} mois</p>
            <p className="m-0 mt-1 text-[11px] text-muted">peine de prison restant à exécuter au 31/07/2026</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            onClick={onFilterSameCour}
            className="cursor-pointer border border-line bg-white px-3 py-2 text-xs hover:border-green"
          >
            Voir ce ressort
          </button>
          <button
            onClick={onFilterSameCat}
            className="cursor-pointer border border-line bg-white px-3 py-2 text-xs hover:border-green"
          >
            Voir cette catégorie
          </button>
          <button
            onClick={onFilterSamePrison}
            className="cursor-pointer border border-line bg-white px-3 py-2 text-xs hover:border-green"
          >
            Voir ce lieu
          </button>
        </div>

        <p className="m-0 mt-[22px] border-t border-line pt-[14px] text-xs leading-[1.6] text-muted">
          La grâce porte uniquement sur le reliquat de peine d'emprisonnement. Les obligations financières
          demeurent dues. Catégorie et reliquat : valeurs indicatives.
        </p>
      </aside>
    </>
  );
}
