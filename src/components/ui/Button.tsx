import { cn } from '@/lib/utils';

export type ButtonVariant = 'rouge' | 'ink' | 'paper' | 'ghost' | 'ghost-light' | 'gold';

const VARIANTS: Record<ButtonVariant, string> = {
  rouge: 'bg-rouge text-white hover:bg-[#c51d31] shadow-[0_12px_30px_-12px_rgba(224,36,58,.7)]',
  ink: 'bg-ink text-white hover:bg-ink-3 dark:bg-white dark:text-ink dark:hover:bg-white/90',
  paper: 'bg-white text-ink hover:bg-white/90',
  gold: 'bg-gold text-ink hover:bg-[#f0c463]',
  ghost: 'border border-line text-fg hover:bg-fg/5',
  'ghost-light': 'border border-white/20 text-white hover:bg-white/10',
};

/** Class names for a pill button; apply to <Link>, <a> or <button>. */
export function btn(variant: ButtonVariant = 'rouge', size: 'sm' | 'md' | 'lg' = 'md', extra?: string) {
  return cn(
    'group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 active:scale-[.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
    size === 'sm' && 'px-4 py-2 text-sm',
    size === 'md' && 'px-6 py-3 text-[15px]',
    size === 'lg' && 'px-7 py-4 text-base',
    VARIANTS[variant],
    extra,
  );
}
