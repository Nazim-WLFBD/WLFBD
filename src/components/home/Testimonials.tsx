'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowLeft, ArrowRight, MapPin, Quote, Star, X } from 'lucide-react';
import { useT } from '@/i18n/t';
import { Reveal } from '@/components/ui/Reveal';
import { Flag } from '@/components/ui/Flag';
import { TESTIMONIALS_DATA } from '@/data/testimonials';
import { testimonials as copy } from '@/content/home';
import { cn, num } from '@/lib/utils';
import type { Testimonial } from '@/types';

/** Quotes longer than this are trimmed on the card, with a "Read full review" link. */
const LONG = 190;

const TONE: Record<string, string> = {
  Canada: 'from-maple to-[#ff6b5e]',
  France: 'from-bleu to-[#6f8bff]',
  General: 'from-ink-3 to-ink',
};

const quoteOf = (r: Testimonial, locale: string) => (locale === 'bn' && r.banglaQuote) || r.quote || r.reviewText || '';
const nameOf = (r: Testimonial) => r.studentName || r.name;
const countryOf = (r: Testimonial) => (r.targetCountry === 'Canada' || r.targetCountry === 'France' ? r.targetCountry : 'General');

/** Photo only when an admin has added a real one; the demo's stock photos are skipped in favour of initials. */
function Avatar({ r }: { r: Testimonial }) {
  const src = r.photoUrl || r.avatar;
  const [failed, setFailed] = useState(false);
  // Admin-entered photo links can be any host, so a plain <img> is used (next/image only allows configured hosts)
  const usable = src && src.startsWith('https://') && !src.includes('images.unsplash.com') && !failed;
  const initials = nameOf(r)
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join('')
    .toUpperCase();
  return usable ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={nameOf(r)} width={52} height={52} loading="lazy" onError={() => setFailed(true)} className="h-[52px] w-[52px] shrink-0 rounded-full object-cover ring-2 ring-surface" />
  ) : (
    <span
      className={cn(
        'font-display flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-lg font-semibold text-white ring-2 ring-surface',
        TONE[countryOf(r)],
      )}
      aria-hidden
    >
      {initials}
    </span>
  );
}

function Person({ r, light }: { r: Testimonial; light?: boolean }) {
  const c = countryOf(r);
  const bn = useT().locale === 'bn';
  return (
    <div className="flex min-w-0 items-center gap-3.5">
      <Avatar r={r} />
      <div className="min-w-0">
        <p className="truncate font-bold">{nameOf(r)}</p>
        <p className={cn('truncate text-[13px]', light ? 'text-white/60' : 'text-muted')}>{(bn && r.banglaProfessionRole) || r.professionRole || r.profession}</p>
        <p className={cn('mt-0.5 flex items-center gap-1.5 truncate text-xs', light ? 'text-white/50' : 'text-muted')}>
          <MapPin size={12} className="shrink-0" />
          <span className="truncate">{(bn && r.banglaLocation) || r.location}</span>
          <Flag country={c === 'Canada' ? 'ca' : c === 'France' ? 'fr' : 'bd'} />
        </p>
      </div>
    </div>
  );
}

function Stars({ n = 5 }: { n?: number }) {
  const t = useT();
  return (
    <span className="flex gap-0.5 text-gold" aria-label={t(copy.rating).replace('{n}', num(n, t.locale))}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={15} fill={i < n ? 'currentColor' : 'none'} className={i < n ? '' : 'opacity-30'} />
      ))}
    </span>
  );
}

export function Testimonials({ items = TESTIMONIALS_DATA }: { items?: Testimonial[] }) {
  const t = useT();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const [open, setOpen] = useState<Testimonial | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  const list = items.filter((r) => r.published !== false).sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));

  const scrollTo = useCallback((i: number) => {
    const el = scroller.current;
    const card = el?.children[i] as HTMLElement | undefined;
    // The track is `relative`, so offsetLeft is measured inside it; the first card sits at the gutter
    if (el && card) el.scrollTo({ left: card.offsetLeft - (el.children[0] as HTMLElement).offsetLeft, behavior: 'smooth' });
  }, []);

  // Track the card nearest the start edge, and whether the end is reached
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const onScroll = () => {
      const first = (el.children[0] as HTMLElement)?.offsetLeft ?? 0;
      const cards = Array.from(el.children) as HTMLElement[];
      let best = 0;
      cards.forEach((c, i) => {
        if (Math.abs(c.offsetLeft - first - el.scrollLeft) < Math.abs(cards[best].offsetLeft - first - el.scrollLeft)) best = i;
      });
      setIndex(best);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
    };
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [list.length]);

  // Autoplay every 7s; pauses on hover/focus, after manual navigation, and for reduced motion
  useEffect(() => {
    if (paused || list.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => scrollTo(atEnd ? 0 : index + 1), 7000);
    return () => clearInterval(id);
  }, [paused, index, atEnd, list.length, scrollTo]);

  const go = (i: number) => {
    setPaused(true);
    scrollTo(Math.max(0, Math.min(list.length - 1, i)));
  };

  if (list.length === 0) return null;

  return (
    <section id="students-voice" className="relative overflow-hidden bg-surface-2/50 py-24 md:py-32">
      <Quote aria-hidden className="pointer-events-none absolute -top-6 right-[6%] h-56 w-56 rotate-180 text-rouge/[.06]" strokeWidth={1} />

      <div className="container-x">
        <Reveal className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-1.5 text-[11px] font-bold tracking-[0.18em] text-rouge uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {t(copy.badge)}
            </span>
            <h2 className="font-display mt-5 text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.04] font-semibold text-balance">{t(copy.title)}</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">{t(copy.intro)}</p>
          </div>

          <div className="flex items-center gap-5">
            <p className="font-display text-lg tabular-nums">
              <span className="text-3xl font-semibold">{num(String(index + 1).padStart(2, '0'), t.locale)}</span>
              <span className="text-muted"> / {num(String(list.length).padStart(2, '0'), t.locale)}</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => go(index - 1)}
                disabled={index === 0}
                aria-label={t(copy.prev)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface transition hover:border-fg disabled:opacity-35"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                onClick={() => go(index + 1)}
                disabled={atEnd}
                aria-label={t(copy.next)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white transition hover:bg-rouge disabled:opacity-35 dark:bg-white dark:text-ink"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Track: padded to line up with the page container on every screen size */}
      <div
        ref={scroller}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onPointerDown={() => setPaused(true)}
        role="region"
        aria-roledescription="carousel"
        aria-label={t(copy.badge)}
        className="no-scrollbar relative flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-[var(--gutter)] pb-6 [--gutter:16px] [scroll-padding-inline:var(--gutter)] sm:[--gutter:24px] xl:[--gutter:calc((100vw-1240px)/2+24px)]"
      >
        {list.map((r, i) => {
          const quote = quoteOf(r, t.locale);
          const long = quote.length > LONG;
          const tag = (t.locale === 'bn' && r.banglaTag) || r.examPassed || r.course || r.achievement;
          const score = (t.locale === 'bn' && r.banglaScore) || r.score;
          return (
            <article
              key={r.id}
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${list.length}`}
              className={cn(
                'group relative flex min-h-[420px] w-[86vw] shrink-0 snap-start flex-col rounded-[28px] border border-line bg-surface p-7 transition duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] sm:w-[400px] lg:w-[calc((min(100vw,1240px)-48px-40px)/3)]',
                i === index && 'border-fg/20',
              )}
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rouge text-white">
                  <Quote size={20} fill="currentColor" strokeWidth={0} />
                </span>
                <Stars n={r.rating ?? 5} />
              </div>

              <blockquote className="mt-6 min-h-0 flex-1">
                <p className={cn('text-[16.5px] leading-[1.7] whitespace-pre-line text-fg/85', long && 'line-clamp-5')}>{quote}</p>
                {long && (
                  <button onClick={() => (setPaused(true), setOpen(r))} className="mt-1 -ml-1 inline-flex min-h-10 items-center px-1 text-sm font-bold text-rouge hover:underline">
                    {t(copy.readFull)} →
                  </button>
                )}
              </blockquote>

              {tag && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-bleu/10 px-3 py-1 text-xs font-bold text-bleu">{tag}</span>
                  {score && score !== tag && <span className="rounded-full bg-mint/12 px-3 py-1 text-xs font-bold text-mint">{score}</span>}
                </div>
              )}

              <div className="mt-5 border-t border-dashed border-line pt-5">
                <Person r={r} />
              </div>
            </article>
          );
        })}
      </div>

      {/* Progress */}
      <div className="container-x mt-4">
        <div className="relative h-1 overflow-hidden rounded-full bg-fg/10">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-rouge transition-all duration-500"
            style={{ width: `${atEnd ? 100 : ((index + 1) / list.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Full review */}
      <Dialog.Root open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[90] bg-ink/70 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed top-1/2 left-1/2 z-[91] max-h-[88vh] w-[min(640px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[28px] bg-surface p-7 text-fg md:p-9"
            aria-describedby={undefined}
          >
            {open && (
              <>
                <div className="flex items-center justify-between">
                  <Stars n={open.rating ?? 5} />
                  <Dialog.Close aria-label={t(copy.close)} className="rounded-full p-2 hover:bg-fg/10">
                    <X size={18} />
                  </Dialog.Close>
                </div>
                <Dialog.Title className="sr-only">{nameOf(open)}</Dialog.Title>
                <p className="mt-5 text-[17px] leading-[1.75] whitespace-pre-line">{quoteOf(open, t.locale)}</p>
                <div className="mt-7 border-t border-dashed border-line pt-6">
                  <Person r={open} />
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
