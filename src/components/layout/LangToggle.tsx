'use client';

import { Languages } from 'lucide-react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

/** One compact button that switches to the other language. */
export function LangToggle() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const next = locale === 'bn' ? 'en' : 'bn';
  return (
    <button
      onClick={() => router.replace(pathname + window.location.search + window.location.hash, { locale: next, scroll: false })}
      className="flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full px-3 text-sm font-semibold whitespace-nowrap text-white/80 transition hover:bg-white/10 hover:text-white"
      aria-label={next === 'bn' ? 'বাংলায় দেখুন' : 'View in English'}
      lang={next}
    >
      <Languages size={16} />
      <span className={next === 'bn' ? 'font-bangla' : ''}>{next === 'bn' ? 'বাংলা' : 'EN'}</span>
    </button>
  );
}
