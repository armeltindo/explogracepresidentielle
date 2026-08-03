import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'ghost' | 'danger-ghost';

const base = 'cursor-pointer text-sm font-semibold transition-colors';

const variants: Record<Variant, string> = {
  primary: 'border-none bg-green px-[18px] py-[11px] text-white hover:bg-green-dark',
  ghost:
    'border border-line bg-white px-4 py-[11px] text-ink hover:border-green',
  'danger-ghost': 'border border-line bg-white px-[14px] py-[10px] text-[13px] font-normal text-muted hover:border-red hover:text-red',
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = 'primary', className = '', ...rest }: Props) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...rest} />;
}
