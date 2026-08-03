import { useEffect } from 'react';
import { groupCounts } from '../lib/filtering';
import { buildReportIssueUrl } from '../lib/reportIssue';
import type { Person } from '../types';

interface Props {
  data: Person[];
  onClose: () => void;
}

export function MethodologyModal({ data, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const catCounts = groupCounts(data, 'cat');

  return (
    <>
      <div className="no-print fixed inset-0 z-40 bg-ink/45" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="methodology-title"
        className="no-print fixed top-1/2 left-1/2 z-40 max-h-[85vh] w-[min(620px,92vw)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto bg-white px-7 pt-6 pb-8 shadow-[0_12px_40px_rgba(20,37,28,0.3)]"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id="methodology-title" className="m-0 font-display text-2xl">
            Méthodologie
          </h2>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="h-[30px] w-[30px] cursor-pointer border border-line bg-transparent"
          >
            ✕
          </button>
        </div>

        <section className="mb-5">
          <h3 className="m-0 mb-2 text-xs font-bold tracking-[0.06em] uppercase">Source</h3>
          <p className="m-0 text-sm leading-[1.6] text-text">
            Décret n° 2026-546 du 31 juillet 2026, République du Bénin, accordant une grâce présidentielle à
            369 personnes détenues. Cette page est une <strong>consultation publique non officielle</strong> du
            texte du décret ; elle n'engage pas les autorités et ne remplace pas le décret lui-même.
          </p>
        </section>

        <section className="mb-5">
          <h3 className="m-0 mb-2 text-xs font-bold tracking-[0.06em] uppercase">
            Catégorie d'infraction <span className="font-normal text-muted normal-case">— indicative</span>
          </h3>
          <p className="m-0 mb-3 text-sm leading-[1.6] text-text">
            Le décret ne classe pas les personnes graciées par catégorie : le champ « catégorie » affiché ici
            est <strong>déduit automatiquement du libellé de l'infraction</strong> (colonne « Infraction »), par
            simple rapprochement de mots-clés. Ce n'est <strong>pas une qualification juridique officielle</strong>{' '}
            — deux infractions au libellé proche peuvent être classées différemment, et le regroupement en{' '}
            {catCounts.length} catégories simplifie nécessairement des situations juridiques plus nuancées.
          </p>
          <ul className="m-0 grid grid-cols-1 gap-x-4 gap-y-1 pl-5 text-[13px] text-text sm:grid-cols-2">
            {catCounts.map(([cat, count]) => (
              <li key={cat}>
                {cat} <span className="text-muted">— {count}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-5">
          <h3 className="m-0 mb-2 text-xs font-bold tracking-[0.06em] uppercase">
            Reliquat remis <span className="font-normal text-muted normal-case">— indicatif</span>
          </h3>
          <p className="m-0 text-sm leading-[1.6] text-text">
            Calculé comme l'écart, arrondi au mois, entre la <strong>fin normale de peine</strong> et la{' '}
            <strong>date du décret (31 juillet 2026)</strong>. Il approxime la durée de prison restant à purger
            au moment de la grâce — c'est-à-dire ce que la grâce dispense effectivement. La grâce ne porte que
            sur la peine d'emprisonnement restante : les amendes, dommages-intérêts et frais de justice
            demeurent dus quel que soit le reliquat remis.
          </p>
        </section>

        <section>
          <h3 className="m-0 mb-2 text-xs font-bold tracking-[0.06em] uppercase">Signaler une erreur</h3>
          <p className="m-0 mb-2 text-sm leading-[1.6] text-text">
            Cette page est maintenue de façon indépendante, sans lien avec l'administration. Si une donnée vous
            semble erronée (orthographe, dates, catégorisation…), vous pouvez le signaler.
          </p>
          <a
            href={buildReportIssueUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block cursor-pointer border border-line bg-white px-3 py-2 text-xs text-ink no-underline hover:border-green hover:text-ink"
          >
            Signaler une erreur ↗
          </a>
        </section>
      </div>
    </>
  );
}
