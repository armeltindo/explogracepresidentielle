import { describe, expect, it } from 'vitest';
import type { Person } from '../types';
import { buildCSV } from './csv';

const sample: Person = {
  num: 1,
  nom: 'DOE John "Le Grand"',
  inf: 'Vol simple; avec récidive',
  cour: "Cour d'appel de Cotonou",
  trib: 'TPI Cotonou',
  prison: 'MA Cotonou',
  mandat: '01-01-2024',
  fin: '01-01-2025',
  peine: '12 mois',
  duree: 6,
  dossier: 'DOS-0001',
  cat: 'Vol simple',
  remis: 3,
  annee: 2024,
};

describe('buildCSV', () => {
  it('emits a header row followed by one row per record, ; separated', () => {
    const csv = buildCSV([sample]);
    const lines = csv.split('\r\n');
    expect(lines).toHaveLength(2);
    expect(lines[0]).toContain('N°');
    expect(lines[0].split(';')).toHaveLength(13);
  });

  it('escapes embedded quotes by doubling them, matching RFC 4180', () => {
    const csv = buildCSV([sample]);
    expect(csv).toContain('"DOE John ""Le Grand"""');
  });

  it('wraps every field in quotes so embedded semicolons stay part of the value', () => {
    const csv = buildCSV([sample]);
    const dataLine = csv.split('\r\n')[1];
    expect(dataLine).toContain('"Vol simple; avec récidive"');
    // the offense field's embedded ';' must not have produced an extra top-level field
    expect(dataLine.startsWith('"1";')).toBe(true);
    expect(dataLine.endsWith('"DOS-0001"')).toBe(true);
  });

  it('returns just the header for an empty selection', () => {
    const csv = buildCSV([]);
    expect(csv.split('\r\n')).toHaveLength(1);
  });
});
