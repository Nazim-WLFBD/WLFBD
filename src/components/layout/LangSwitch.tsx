'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { ui } from '@/content/home';
import { cn } from '@/lib/utils';

export function LangSwitch({ light = true }: { light?: boolean }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  const go = (next: 'en' | 'bn') => {
    if (next === locale) return;
    router.replace(pathname + window.location.search + window.location.hash, { locale: next, scroll: false });
  };

  return (
    <div
      role="group"
      aria-label={ui.language[locale]}
      className={cn('flex rounded-full p-1 text-xs font-bold', light ? 'bg-white/8' : 'bg-fg/5')}
    >
      {(['bn', 'en'] as const).map((l) => (
        <button
          key={l}
          onClick={() => go(l)}
          aria-pressed={locale === l}
          className={cn(
            'rounded-full px-3 py-1.5 transition',
            locale === l ? 'bg-white text-ink' : light ? 'text-white/70 hover:text-white' : 'text-muted',
            l === 'bn' && 'font-bangla',
          )}
        >
          {l === 'bn' ? 'বাংলা' : 'EN'}
        </button>
      ))}
    </div>
  );
}
