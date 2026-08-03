import { Button } from './ui/Button';

export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="border border-line bg-white px-5 py-16 text-center">
      <p className="m-0 mb-2 font-display text-[22px]">Aucun résultat ne correspond aux critères</p>
      <p className="m-0 mb-[18px] text-[13px] text-muted">Élargissez la recherche ou levez un filtre.</p>
      <Button variant="primary" onClick={onReset}>
        Réinitialiser les filtres
      </Button>
    </div>
  );
}
