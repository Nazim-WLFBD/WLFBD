import Image from 'next/image';
import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { ui } from '@/content/home';

/**
 * Brand logo. `showText` renders the full artwork (emblem + wordmark, light lettering for dark
 * surfaces); otherwise just the maple-leaf + Eiffel emblem. Width/height follow each artwork's own aspect
 * ratio (emblem 512×307, full logo 171×160) so next/image doesn't warn about one side being resized.
 */
export function Logo({ size = 44, showText = true, priority = false }: { size?: number; showText?: boolean; light?: boolean; priority?: boolean }) {
  // useLocale works in both server and client components (the logo is used from both)
  const locale = useLocale() as Locale;
  if (!showText) return <Image src="/emblem.png" alt={ui.logoAlt[locale]} width={size} height={Math.round((size * 307) / 512)} priority={priority} className="shrink-0 object-contain" />;
  const h = Math.round(size * 1.15);
  return <Image src="/logo-full.png" alt={ui.logoAlt[locale]} width={Math.round((h * 171) / 160)} height={h} priority={priority} className="shrink-0 object-contain" style={{ height: h, width: 'auto' }} />;
}
