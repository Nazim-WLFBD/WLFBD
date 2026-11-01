'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowLeft, ArrowRight, MapPin, Star, X } from 'lucide-react';
import { useT } from '@/i18n/t';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Flag } from '@/components/ui/Flag';
import { TESTIMONIALS_DATA } from '@/data/testimonials';
import { testimonials as copy } from '@/content/home';
import { cn, num } from '@/lib/utils';
import type { Testimonial } from '@/types';

/** Quotes longer than this are trimmed on the card, with a "Read full review" link. */
const LONG = 190;

/* Flat initials tile per pathway */
const TONE: Record<string, string> = {
  Canada: 'bg-rouge text-white',
  France: 'bg-bleu text-white',
  General: 'bg-ink text-white',
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
    <img src={src} alt={nameOf(r)} width={48} height={48} loading="lazy" onError={() => setFailed(true)} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
  ) : (
    <span className={cn('font-display flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-base font-semibold', TONE[countryOf(r)])} aria-hidden>
      {initials}
    </span>
  );
}

function Person({ r }: { r: Testimonial }) {
  const c = countryOf(r);
  const bn = useT().locale === 'bn';
  return (
    <div className="flex min-w-0 items-center gap-3.5">
      <Avatar r={r} />
      <div className="min-w-0">
        <p className="truncate font-bold">{nameOf(r)}</p>
        <p className="truncate text-[13px] text-muted">{(bn && r.banglaProfessionRole) || r.professionRole || r.profession}</p>
        <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted">
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
        <Star key={i} size={14} fill={i < n ? 'currentColor' : 'none'} className={i < n ? '' : 'opacity-30'} />
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
    <section id="students-voice" className="relative bg-surface py-20 md:py-28">
      <div className="container-x">
        <SectionHeading tag={t(copy.badge)} title={t(copy.title)} intro={t(copy.intro)} num="08" className="mb-6 md:mb-8" />

        {/* Counter + controls on a hairline */}
        <Reveal className="hairline mb-8 flex items-center justify-between pt-4">
          <p className="font-display text-lg tabular-nums">
            <span className="text-3xl font-semibold">{num(String(index + 1).padStart(2, '0'), t.locale)}</span>
            <span className="text-muted"> / {num(String(list.length).padStart(2, '0'), t.locale)}</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => go(index - 1)}
              disabled={index === 0}
              aria-label={t(copy.prev)}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-surface transition hover:border-fg disabled:opacity-35"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={() => go(index + 1)}
              disabled={atEnd}
              aria-label={t(copy.next)}
              className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white transition hover:bg-rouge disabled:opacity-35 dark:bg-white dark:text-ink dark:hover:bg-rouge dark:hover:text-white"
            >
              <ArrowRight size={18} />
            </button>
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
        className="no-scrollbar container-x relative flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-6 [scroll-padding-inline:16px] sm:[scroll-padding-inline:24px]"
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
                'card flex min-h-[420px] w-[86vw] shrink-0 snap-start flex-col p-7 transition-colors duration-300 sm:w-[400px] lg:w-[calc((100%-40px)/3)]',
                i === index && 'border-fg/25',
              )}
            >
              <div className="flex items-start justify-between">
                <span aria-hidden className="font-display -mt-2 text-6xl leading-none font-light text-rouge select-none">
                  “
                </span>
                <Stars n={r.rating ?? 5} />
              </div>

              <blockquote className="mt-3 min-h-0 flex-1">
                <p className={cn('font-display text-[1.2rem] leading-[1.5] whitespace-pre-line italic md:text-[1.3rem]', long && 'line-clamp-6')}>{quote}</p>
                {long && (
                  <button onClick={() => (setPaused(true), setOpen(r))} className="mt-2 -ml-1 inline-flex min-h-11 items-center px-1 text-sm font-bold text-rouge hover:underline">
                    {t(copy.readFull)} →
                  </button>
                )}
              </blockquote>

              {tag && (
                <p className="mt-5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-bold tracking-[0.14em] uppercase">
                  <span className="text-bleu">{tag}</span>
                  {score && score !== tag && <span className="text-mint">{score}</span>}
                </p>
              )}

              <div className="hairline mt-5 pt-5">
                <Person r={r} />
              </div>
            </article>
          );
        })}
      </div>

      {/* Progress */}
      <div className="container-x mt-2">
        <div className="relative h-px overflow-hidden bg-line">
          <div className="absolute inset-y-0 left-0 bg-rouge transition-all duration-500" style={{ width: `${atEnd ? 100 : ((index + 1) / list.length) * 100}%` }} />
        </div>
      </div>

      {/* Full review */}
      <Dialog.Root open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[90] bg-ink/70" />
          <Dialog.Content
            data-lenis-prevent
            className="fixed top-1/2 left-1/2 z-[91] max-h-[85dvh] w-[min(640px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[var(--radius)] border border-line bg-surface p-7 text-fg md:p-9"
            aria-describedby={undefined}
          >
            {open && (
              <>
                <div className="flex items-center justify-between">
                  <Stars n={open.rating ?? 5} />
                  <Dialog.Close aria-label={t(copy.close)} className="-mr-2 flex h-11 w-11 items-center justify-center rounded-lg hover:bg-fg/10">
                    <X size={18} />
                  </Dialog.Close>
                </div>
                <Dialog.Title className="sr-only">{nameOf(open)}</Dialog.Title>
                <span aria-hidden className="font-display mt-4 block text-6xl leading-none font-light text-rouge select-none">
                  “
                </span>
                <p className="font-display mt-1 text-[1.3rem] leading-[1.55] whitespace-pre-line italic">{quoteOf(open, t.locale)}</p>
                <div className="hairline mt-7 pt-6">
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
