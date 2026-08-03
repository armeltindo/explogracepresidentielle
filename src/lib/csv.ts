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

/** Pure CSV builder (no BOM) — split out from `exportCSV` so the format can be unit tested without touching the DOM. */
export function buildCSV(rows: Person[]): string {
  const lines = [HEADERS.map(esc).join(';')];
  rows.forEach((p) => {
    lines.push(
      [p.num, p.nom, p.inf, p.cat, p.cour, p.trib, p.prison, p.mandat, p.fin, p.peine, p.duree, p.remis, p.dossier]
        .map(esc)
        .join(';'),
    );
  });
  return lines.join('\r\n');
}

export function exportCSV(rows: Person[]): void {
  // UTF-8 BOM so Excel opens accented characters correctly.
  downloadFile('grace-presidentielle-2026.csv', '﻿' + buildCSV(rows), 'text/csv;charset=utf-8;');
}
