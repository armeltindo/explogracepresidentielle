interface Props {
  remaining: number;
  total: number;
  onShowMore: () => void;
  onShowAll: () => void;
}

export function LoadMore({ remaining, total, onShowMore, onShowAll }: Props) {
  if (remaining <= 0) return null;
  return (
    <div className="no-print flex flex-wrap items-center justify-center gap-3 pt-6 pb-1">
      <button
        onClick={onShowMore}
        className="cursor-pointer border-none bg-green px-5 py-[11px] text-[13px] font-semibold text-white hover:bg-green-dark"
      >
        Afficher 20 de plus — {remaining} restantes
      </button>
      <button
        onClick={onShowAll}
        className="cursor-pointer border border-line bg-transparent px-[18px] py-[11px] text-[13px] text-muted hover:border-green hover:text-ink"
      >
        Tout afficher ({total})
      </button>
    </div>
  );
}
