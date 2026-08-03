export interface DurationBucket {
  id: string;
  label: string;
  min: number;
  max: number;
}

export const BUCKETS: DurationBucket[] = [
  { id: '0-6', label: 'Moins de 6 mois', min: 0, max: 6 },
  { id: '6-12', label: '6 à 12 mois', min: 6, max: 12 },
  { id: '12-24', label: '1 à 2 ans', min: 12, max: 24 },
  { id: '24-36', label: '2 à 3 ans', min: 24, max: 36 },
  { id: '36-60', label: '3 à 5 ans', min: 36, max: 60 },
  { id: '60+', label: '5 ans et plus', min: 60, max: 1e9 },
];
