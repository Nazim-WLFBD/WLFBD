import { getLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { btn } from '@/components/ui/Button';

const copy = {
  oops: { en: 'Oups!', bn: 'উফ্!' },
  notFound: { en: 'Page not found.', bn: 'পেজটি পাওয়া যায়নি।' },
  body: {
    en: 'This flight doesn’t exist. Let’s get you back on route.',
    bn: 'এই ফ্লাইটটির কোনো অস্তিত্ব নেই। চলুন, আপনাকে আবার সঠিক পথে ফিরিয়ে নিই।',
  },
  home: { en: 'Back to home', bn: 'হোমে ফিরে যান' },
  courses: { en: 'Browse courses', bn: 'কোর্সগুলো দেখুন' },
};

export default async function NotFound() {
  // not-found has no route params, so the locale comes from the request context
  const locale = (await getLocale()) as Locale;
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden bg-ink pt-24 text-white">
      <div className="dots pointer-events-none absolute inset-0 opacity-25" />
      <div className="container-x relative">
        <p className="font-mono text-sm tracking-[0.3em] text-gold">GATE 404 · VOL ANNULÉ</p>
        <h1 className="font-display mt-4 text-[clamp(3rem,9vw,7rem)] leading-none font-semibold">
          {copy.oops[locale]} <span className="text-rouge italic">{copy.notFound[locale]}</span>
        </h1>
        <p className="mt-5 max-w-lg text-lg text-white/65">{copy.body[locale]}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className={btn('rouge', 'lg')}>
            {copy.home[locale]}
          </Link>
          <Link href="/courses" className={btn('ghost-light', 'lg')}>
            {copy.courses[locale]}
          </Link>
        </div>
      </div>
    </section>
  );
}
