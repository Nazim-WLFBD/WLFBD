'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { RotateCcw } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { btn } from '@/components/ui/Button';

const copy = {
  eyebrow: { en: 'Turbulence', bn: 'সাময়িক সমস্যা' },
  title: { en: 'Something went wrong.', bn: 'কিছু একটা ভুল হয়েছে।' },
  body: {
    en: 'This page hit an unexpected error. Try again, or head back to the home page.',
    bn: 'এই পেজে একটি অপ্রত্যাশিত ত্রুটি হয়েছে। আবার চেষ্টা করুন, অথবা হোমে ফিরে যান।',
  },
  retry: { en: 'Try again', bn: 'আবার চেষ্টা করুন' },
  home: { en: 'Back to home', bn: 'হোমে ফিরে যান' },
};

/** Error boundary for every page under /en and /bn (the locale layout, header and footer stay up). */
export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const locale = useLocale() as 'en' | 'bn';
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <section className="relative flex min-h-[70svh] items-center bg-bg pt-28 pb-16 text-fg">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center text-rouge">{copy.eyebrow[locale]}</p>
          <h1 className="font-display mt-6 text-[clamp(1.75rem,4.5vw,2.75rem)] leading-tight font-semibold text-balance">{copy.title[locale]}</h1>
          <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-muted">{copy.body[locale]}</p>
          {error.digest && <p className="mt-2 font-mono text-xs text-muted">ref {error.digest}</p>}
          <div className="hairline mx-auto mt-8 flex max-w-md flex-wrap justify-center gap-3 pt-8">
            <button onClick={reset} className={btn('rouge', 'lg')}>
              <RotateCcw size={17} /> {copy.retry[locale]}
            </button>
            <Link href="/" className={btn('ghost', 'lg')}>
              {copy.home[locale]}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
