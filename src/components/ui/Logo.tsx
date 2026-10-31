import Image from 'next/image';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { BRAND_TAGLINE_BANGLA } from '@/lib/brand';
import { ui } from '@/content/home';
import { cn } from '@/lib/utils';

/** Maple-leaf + Eiffel emblem with the brand name set in type (the emblem file has no readable wordmark). */
export function Logo({ size = 40, showText = true, light = false }: { size?: number; showText?: boolean; light?: boolean }) {
  // useLocale works in both server and client components (the logo is used from both)
  const locale = useLocale() as Locale;
  return (
    <span className="flex items-center gap-2.5">
      <Image src="/emblem.png" alt={ui.logoAlt[locale]} width={size} height={Math.round(size * 0.78)} priority className="shrink-0 object-contain" />
      {showText && (
        <span className="flex flex-col leading-none">
          <span className={cn('font-display text-[17px] font-semibold tracking-tight whitespace-nowrap', light ? 'text-white' : 'text-ink dark:text-white')}>
            We Learn <span className="text-rouge">French</span> BD
          </span>
          <span className={cn('font-bangla mt-1 text-[10.5px]', light ? 'text-white/60' : 'text-muted')}>{BRAND_TAGLINE_BANGLA}</span>
        </span>
      )}
    </span>
  );
}
