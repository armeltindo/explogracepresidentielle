export interface Chip {
  label: string;
  onRemove: () => void;
}

export function FilterChips({ chips }: { chips: Chip[] }) {
  if (!chips.length) return null;
  return (
    <section className="no-print mt-[14px] flex flex-wrap items-center gap-2">
      <span className="text-xs tracking-[0.05em] text-muted uppercase">Filtres actifs</span>
      {chips.map((c) => (
        <button
          key={c.label}
          onClick={c.onRemove}
          className="flex cursor-pointer items-center gap-[7px] border border-green bg-green-soft px-[10px] py-[5px] text-xs text-ink hover:bg-green-soft-hover"
        >
          <span>{c.label}</span>
          <span className="font-bold text-green">✕</span>
        </button>
      ))}
    </section>
  );
}
