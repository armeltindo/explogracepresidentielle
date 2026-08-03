export interface MatrixCell {
  count: number;
  onClick: () => void;
  title: string;
}

export interface MatrixRow {
  label: string;
  cells: MatrixCell[];
}

export function Matrix({ cols, rows, max }: { cols: string[]; rows: MatrixRow[]; max: number }) {
  return (
    <div className="min-w-[760px]">
      <div className="mb-[3px] flex gap-[3px]">
        <span className="flex-[0_0_190px]" />
        {cols.map((c) => (
          <span key={c} className="min-w-0 flex-1 text-[10px] leading-[1.2] text-muted">
            {c}
          </span>
        ))}
      </div>
      {rows.map((r) => (
        <div key={r.label} className="mb-[3px] flex items-stretch gap-[3px]">
          <span className="flex flex-[0_0_190px] items-center text-xs">{r.label}</span>
          {r.cells.map((cell, i) => {
            const alpha = cell.count === 0 ? 0.04 : 0.12 + 0.78 * (cell.count / max);
            return (
              <span
                key={i}
                onClick={cell.onClick}
                role="button"
                tabIndex={0}
                title={cell.title}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    cell.onClick();
                  }
                }}
                className="min-w-0 flex-1 cursor-pointer px-1 py-[11px] text-center text-xs"
                style={{
                  background: `rgba(0,135,81,${alpha.toFixed(2)})`,
                  color: alpha > 0.55 ? '#fff' : 'var(--color-ink)',
                }}
              >
                {cell.count === 0 ? '·' : cell.count}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
