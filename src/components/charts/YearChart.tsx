export interface YearItem {
  year: number;
  count: number;
  active: boolean;
  onClick: () => void;
}

export function YearChart({ items }: { items: YearItem[] }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div className="flex h-[150px] items-end gap-1">
      {items.map((item) => (
        <div
          key={item.year}
          onClick={item.onClick}
          role="button"
          tabIndex={0}
          title={`${item.year} : ${item.count} mandat(s) de dépôt`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              item.onClick();
            }
          }}
          className="flex h-full min-w-[14px] flex-1 cursor-pointer flex-col items-center justify-end"
        >
          <div
            className="w-full"
            style={{
              height: `${Math.max(2, Math.round((item.count / max) * 112))}px`,
              background: item.active ? 'var(--color-yellow)' : 'var(--color-green)',
            }}
          />
          <span className="mt-1 text-[9px] text-muted [writing-mode:vertical-rl]">{item.year}</span>
        </div>
      ))}
    </div>
  );
}
