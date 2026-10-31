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
    <section className="relative flex min-h-[80svh] items-center bg-bg pt-28 pb-16 text-fg">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow justify-center text-rouge">GATE 404 · VOL ANNULÉ</p>
          <p className="font-display mt-6 text-[clamp(6rem,22vw,13rem)] leading-[0.85] font-semibold text-fg tabular-nums">
            4<span className="text-rouge">0</span>4
          </p>
          <h1 className="font-display mt-6 text-[clamp(1.75rem,4.5vw,2.75rem)] leading-tight font-semibold text-balance">
            {copy.oops[locale]} <span className="text-muted italic">{copy.notFound[locale]}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-muted">{copy.body[locale]}</p>
          <div className="hairline mx-auto mt-8 flex max-w-md flex-wrap justify-center gap-3 pt-8">
            <Link href="/" className={btn('rouge', 'lg')}>
              {copy.home[locale]}
            </Link>
            <Link href="/courses" className={btn('ghost', 'lg')}>
              {copy.courses[locale]}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
