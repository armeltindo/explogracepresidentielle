#!/usr/bin/env node
// Sanity checks on src/data/data.json — run via `npm run validate-data` and in CI.
// Fails the process (non-zero exit) on structural problems; prints warnings for
// soft inconsistencies that are plausible in real judicial data (e.g. several
// co-accused sharing one dossier) rather than treating them as errors.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const DATA_PATH = fileURLToPath(new URL('../src/data/data.json', import.meta.url));
const EXPECTED_COUNT = 369;
const DECREE_DATE = { dd: 31, mm: 7, yyyy: 2026 };
const DATE_RE = /^(\d{2})-(\d{2})-(\d{4})$/;

const errors = [];
const warnings = [];

function parseDMY(str, field, num) {
  const m = DATE_RE.exec(str ?? '');
  if (!m) {
    errors.push(`#${num}: ${field} "${str}" ne respecte pas le format JJ-MM-AAAA`);
    return null;
  }
  const dd = Number(m[1]);
  const mm = Number(m[2]);
  const yyyy = Number(m[3]);
  const date = new Date(Date.UTC(yyyy, mm - 1, dd));
  const valid = date.getUTCFullYear() === yyyy && date.getUTCMonth() === mm - 1 && date.getUTCDate() === dd;
  if (!valid) {
    errors.push(`#${num}: ${field} "${str}" n'est pas une date calendaire valide`);
    return null;
  }
  return { dd, mm, yyyy };
}

function monthsBetween(a, b) {
  let months = (b.yyyy - a.yyyy) * 12 + (b.mm - a.mm);
  if (b.dd < a.dd) months -= 1;
  return months;
}

const raw = readFileSync(DATA_PATH, 'utf-8');
/** @type {unknown} */
let data;
try {
  data = JSON.parse(raw);
} catch (e) {
  console.error(`✗ data.json invalide : ${e.message}`);
  process.exit(1);
}

if (!Array.isArray(data)) {
  console.error('✗ data.json doit contenir un tableau');
  process.exit(1);
}

if (data.length !== EXPECTED_COUNT) {
  errors.push(`Nombre d'enregistrements = ${data.length}, attendu ${EXPECTED_COUNT}`);
}

const seenNums = new Set();
const dossierCounts = new Map();
const requiredStringFields = ['nom', 'inf', 'cour', 'trib', 'prison', 'peine', 'cat', 'dossier'];

data.forEach((p, i) => {
  const num = p.num;
  if (!Number.isInteger(num)) {
    errors.push(`Enregistrement à l'index ${i} : "num" absent ou non entier`);
    return;
  }
  if (seenNums.has(num)) errors.push(`#${num} : numéro d'ordre en double`);
  seenNums.add(num);

  for (const field of requiredStringFields) {
    if (typeof p[field] !== 'string' || !p[field].trim()) {
      errors.push(`#${num} : champ "${field}" manquant ou vide`);
    }
  }

  if (!Number.isFinite(p.duree) || p.duree < 0) errors.push(`#${num} : "duree" invalide (${p.duree})`);
  if (!Number.isFinite(p.remis) || p.remis < 0) errors.push(`#${num} : "remis" invalide (${p.remis})`);
  if (!Number.isInteger(p.annee)) errors.push(`#${num} : "annee" invalide (${p.annee})`);

  const mandat = parseDMY(p.mandat, 'mandat', num);
  const fin = parseDMY(p.fin, 'fin', num);

  if (mandat && p.annee !== mandat.yyyy) {
    errors.push(`#${num} : "annee" (${p.annee}) ne correspond pas à l'année du mandat (${mandat.yyyy})`);
  }

  if (fin) {
    const computedRemis = monthsBetween(DECREE_DATE, fin);
    if (Math.abs(computedRemis - p.remis) > 1) {
      warnings.push(`#${num} : "remis" (${p.remis}) s'écarte de plus d'un mois du calcul fin→décret (${computedRemis})`);
    }
  }

  if (typeof p.dossier === 'string') {
    dossierCounts.set(p.dossier, (dossierCounts.get(p.dossier) || 0) + 1);
  }
});

for (let n = 1; n <= EXPECTED_COUNT; n++) {
  if (!seenNums.has(n)) errors.push(`Numéro d'ordre manquant : ${n}`);
}

const sharedDossiers = [...dossierCounts.entries()].filter(([, c]) => c > 1);
if (sharedDossiers.length) {
  warnings.push(
    `${sharedDossiers.length} numéro(s) de dossier partagés par plusieurs personnes (co-accusés) — normal, à vérifier si inattendu.`,
  );
}

console.log(`data.json : ${data.length} enregistrements vérifiés`);

if (warnings.length) {
  console.log(`\n⚠ ${warnings.length} avertissement(s) :`);
  warnings.slice(0, 20).forEach((w) => console.log('  - ' + w));
  if (warnings.length > 20) console.log(`  … et ${warnings.length - 20} de plus`);
}

if (errors.length) {
  console.error(`\n✗ ${errors.length} erreur(s) :`);
  errors.slice(0, 50).forEach((e) => console.error('  - ' + e));
  if (errors.length > 50) console.error(`  … et ${errors.length - 50} de plus`);
  process.exit(1);
}

console.log('\n✓ Toutes les vérifications structurelles sont passées.');
