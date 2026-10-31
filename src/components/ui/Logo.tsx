import Image from 'next/image';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { ui } from '@/content/home';

/**
 * Brand logo. `showText` renders the full artwork (emblem + wordmark, light lettering for dark
 * surfaces); otherwise just the maple-leaf + Eiffel emblem.
 */
export function Logo({ size = 44, showText = true }: { size?: number; showText?: boolean; light?: boolean }) {
  // useLocale works in both server and client components (the logo is used from both)
  const locale = useLocale() as Locale;
  if (!showText) return <Image src="/emblem.png" alt={ui.logoAlt[locale]} width={size} height={size} priority className="shrink-0 object-contain" />;
  const h = Math.round(size * 1.15);
  return <Image src="/logo-full.png" alt={ui.logoAlt[locale]} width={Math.round(h * 1.5)} height={h} priority className="shrink-0 object-contain" style={{ height: h, width: 'auto' }} />;
}
