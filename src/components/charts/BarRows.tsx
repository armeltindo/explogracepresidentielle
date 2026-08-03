export interface BarItem {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}

/** Horizontal bar-chart rows shared by the ressort / catégorie / durée panels — click a row to toggle it as a filter. */
export function BarRows({ items }: { items: BarItem[] }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <>
      {items.map((item) => (
        <div
          key={item.label}
          onClick={item.onClick}
          role="button"
          tabIndex={0}
          aria-pressed={item.active}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              item.onClick();
            }
          }}
          className={`-mx-[6px] cursor-pointer p-[6px] ${item.active ? 'bg-green-soft' : 'bg-transparent'}`}
        >
          <div className="mb-1 flex justify-between gap-[10px] text-[13px]">
            <span className={item.active ? 'font-bold' : 'font-medium'}>{item.label}</span>
            <span className="text-muted">{item.count}</span>
          </div>
          <div className="h-[8px] bg-track">
            <div
              className="h-full"
              style={{
                width: `${Math.round((item.count / max) * 100)}%`,
                background: item.active ? 'var(--color-yellow)' : 'var(--color-green)',
              }}
            />
          </div>
        </div>
      ))}
    </>
  );
}
