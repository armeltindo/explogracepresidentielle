import { buildReportIssueUrl } from '../lib/reportIssue';

interface Props {
  onOpenMethodology: () => void;
}

export function Footer({ onOpenMethodology }: Props) {
  return (
    <footer className="no-print border-t border-line bg-white px-[26px] py-[26px] text-center text-xs text-muted">
      <p className="m-0">
        Fraternité – Justice – Travail · page non officielle, aucune donnée transmise à l'extérieur — Décret n°
        2026-546 du 31 juillet 2026
      </p>
      <p className="m-0 mt-2">
        <button
          onClick={onOpenMethodology}
          className="cursor-pointer border-none bg-transparent p-0 text-xs text-green-dark underline hover:text-red"
        >
          Méthodologie
        </button>
        {' · '}
        <a
          href={buildReportIssueUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-dark underline hover:text-red"
        >
          Signaler une erreur ↗
        </a>
      </p>
    </footer>
  );
}
