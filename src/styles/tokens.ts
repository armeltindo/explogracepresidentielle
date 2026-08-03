/**
 * Design tokens for "Grâce présidentielle 2026".
 *
 * Sourced from the Bénin national flag: green primary, yellow/red used
 * sparingly as accents. Swap these values to switch to an official
 * DGI/gouv.bj charte graphique without touching component code.
 */
export const colors = {
  green: '#008751',
  greenDark: '#026b40',
  greenSoft: '#EAF4EE',
  greenSoftHover: '#dcecdf',
  greenLight: '#BFE3CC',
  yellow: '#FCD116',
  red: '#E8112D',
  ink: '#14251C',
  paper: '#F5F6F2',
  line: '#D9DDD2',
  muted: '#5D6B62',
  text: '#3d473f',
  track: '#EDEFE8',
  white: '#ffffff',
} as const;

export const fonts = {
  display: "'Source Serif 4', Georgia, serif",
  body: "'Public Sans', Helvetica, Arial, sans-serif",
} as const;

/** Color scale for the "detention duration" bars/legend, in months. */
export const DURATION_TIERS = [
  { max: 12, color: colors.greenLight, label: '< 1 an' },
  { max: 36, color: colors.green, label: '1–3 ans' },
  { max: 72, color: colors.yellow, label: '3–6 ans' },
  { max: Infinity, color: colors.red, label: '6 ans et +' },
] as const;

export function tierColor(dureeMois: number): string {
  return DURATION_TIERS.find((t) => dureeMois < t.max)?.color ?? colors.red;
}
