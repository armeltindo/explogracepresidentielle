import type { Person } from '../types';
import { downloadFile } from './download';

const HEADERS = [
  'N°',
  'Nom et prénoms',
  'Infraction',
  'Catégorie (indicative)',
  'Ressort',
  'Tribunal',
  'Lieu de détention',
  'Mandat de dépôt',
  'Fin normale de peine',
  'Peine prononcée',
  'Détention (mois)',
  'Reliquat remis (mois)',
  'N° dossier',
];

function esc(v: string | number): string {
  return `"${String(v).replace(/"/g, '""')}"`;
}

export function exportCSV(rows: Person[]): void {
  const lines = [HEADERS.map(esc).join(';')];
  rows.forEach((p) => {
    lines.push(
      [p.num, p.nom, p.inf, p.cat, p.cour, p.trib, p.prison, p.mandat, p.fin, p.peine, p.duree, p.remis, p.dossier]
        .map(esc)
        .join(';'),
    );
  });
  // UTF-8 BOM so Excel opens accented characters correctly.
  downloadFile('grace-presidentielle-2026.csv', '﻿' + lines.join('\r\n'), 'text/csv;charset=utf-8;');
}
