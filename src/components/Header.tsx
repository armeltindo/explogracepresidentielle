import { Button } from './ui/Button';

interface Props {
  onExportCSV: () => void;
  onCopyLink: () => void;
  copyLinkLabel: string;
  onPrint: () => void;
  onOpenMethodology: () => void;
}

export function Header({ onExportCSV, onCopyLink, copyLinkLabel, onPrint, onOpenMethodology }: Props) {
  return (
    <header className="relative border-b border-line bg-white px-8 pt-[30px] pb-6 pl-10">
      <div className="no-print absolute top-0 bottom-0 left-0 w-[6px] bg-green" />
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-start justify-between gap-6">
        <div>
          <p className="m-0 mb-2 text-xs font-semibold tracking-[0.09em] text-muted uppercase">
            République du Bénin — Décret n° 2026-546 du 31 juillet 2026
          </p>
          <h1 className="m-0 font-display text-[clamp(28px,4vw,38px)] leading-[1.05] font-bold">
            Grâce présidentielle 2026
          </h1>
          <p className="mt-[10px] mb-0 text-sm text-muted">
            Fraternité – Justice – Travail · registre consultable des 369 personnes graciées
          </p>
        </div>
        <div className="no-print flex flex-wrap gap-[10px]">
          <Button variant="primary" onClick={onExportCSV}>
            Exporter CSV
          </Button>
          <Button variant="ghost" onClick={onCopyLink}>
            {copyLinkLabel}
          </Button>
          <Button variant="ghost" onClick={onPrint}>
            Imprimer
          </Button>
        </div>
      </div>
      <div className="mx-auto mt-5 max-w-[1000px] border border-line bg-paper px-4 py-[14px] text-[13px] leading-[1.6] text-text">
        Page de consultation publique, <strong>non officielle</strong>. Source : Décret n° 2026-546 du 31
        juillet 2026. La <strong>catégorisation par nature d'infraction est indicative</strong>, calculée à
        partir du libellé d'infraction, et n'engage pas les autorités. La grâce ne dispense que de la{' '}
        <strong>peine de prison restant à exécuter</strong> — amendes, dommages-intérêts et frais de justice
        demeurent dus.
        <span className="no-print">
          {' '}
          <button
            onClick={onOpenMethodology}
            className="cursor-pointer border-none bg-transparent p-0 font-semibold text-green-dark underline hover:text-red"
          >
            Voir la méthodologie
          </button>
          .
        </span>
      </div>
    </header>
  );
}
