import { cn } from '@/lib/utils';

export type ButtonVariant = 'rouge' | 'ink' | 'paper' | 'ghost' | 'ghost-light' | 'gold';

/* Crisp rounded rectangles (institutional), with one bold red primary */
const VARIANTS: Record<ButtonVariant, string> = {
  rouge: 'bg-rouge text-white hover:bg-[#b8241a] shadow-[0_10px_24px_-12px_rgba(213,43,30,.6)]',
  ink: 'bg-ink text-white hover:bg-ink-3 dark:bg-white dark:text-ink dark:hover:bg-white/90',
  paper: 'bg-white text-ink hover:bg-white/90',
  gold: 'bg-gold text-ink hover:bg-[#b98a30]',
  ghost: 'border border-line bg-surface text-fg hover:border-fg/40',
  'ghost-light': 'border border-white/25 text-white hover:bg-white/10',
};

/** Class names for a button; apply to <Link>, <a> or <button>. */
export function btn(variant: ButtonVariant = 'rouge', size: 'sm' | 'md' | 'lg' = 'md', extra?: string) {
  return cn(
    'group inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 active:scale-[.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
    size === 'sm' && 'h-10 px-4 text-sm',
    size === 'md' && 'h-12 px-6 text-[15px]',
    size === 'lg' && 'h-14 px-7 text-base',
    VARIANTS[variant],
    extra,
  );
}
