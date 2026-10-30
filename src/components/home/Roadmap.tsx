'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, CheckCircle2, Plane } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { roadmap } from '@/content/home';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const COLOR: Record<string, string> = {
  bleu: 'bg-bleu',
  gold: 'bg-gold text-ink',
  rouge: 'bg-rouge',
  mint: 'bg-mint',
};

/** Pinned horizontal "flight" through the 4 steps on desktop; a vertical list on mobile. */
export function Roadmap() {
  const t = useT();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const plane = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const el = track.current!;
      const distance = () => el.scrollWidth - el.clientWidth + 64;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      tl.to(el, { x: () => -distance(), ease: 'none' }, 0)
        .fromTo(progress.current, { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0)
        .fromTo(plane.current, { left: '0%' }, { left: '100%', ease: 'none' }, 0);
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="roadmap" ref={section} className="relative overflow-hidden bg-ink text-white lg:h-[100svh]">
      <div className="dots pointer-events-none absolute inset-0 opacity-25" />
      <div className="relative flex h-full flex-col justify-center py-24 lg:py-0">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 text-[11px] font-bold tracking-[0.18em] text-gold uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {t(roadmap.tag)}
              </span>
              <h2 className="font-display mt-5 max-w-3xl text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.04] font-semibold text-balance">
                {t(roadmap.title)}
              </h2>
              <p className="mt-4 max-w-xl text-white/65">{t(roadmap.intro)}</p>
            </div>
            <Link href="/enroll" className={btn('gold', 'lg', 'shrink-0 self-start lg:self-end')}>
              {t(roadmap.cta)} <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Flight progress */}
          <div className="relative mt-12 hidden h-8 lg:block">
            <div className="absolute top-1/2 right-0 left-0 border-t border-dashed border-white/20" />
            <div ref={progress} className="absolute top-1/2 right-0 left-0 h-[2px] origin-left -translate-y-px bg-gradient-to-r from-bleu via-gold to-mint" />
            <div ref={plane} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink shadow-lg">
                <Plane size={16} />
              </span>
            </div>
            <span className="absolute top-full left-0 mt-1 font-mono text-[10px] tracking-widest text-white/50">DAC</span>
            <span className="absolute top-full right-0 mt-1 font-mono text-[10px] tracking-widest text-white/50">YYZ / PAR</span>
          </div>
        </div>

        <div className="mt-10 lg:mt-12 lg:pl-[max(24px,calc((100vw-1240px)/2+24px))]">
          {/* Phones/tablets: swipe row. Desktop: the pinned horizontal scroll drives this track */}
          <div
            ref={track}
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scroll-padding-inline:16px] sm:px-6 lg:snap-none lg:gap-6 lg:overflow-visible lg:px-0 lg:pr-16"
          >
            {roadmap.steps.map((s) => (
              <article
                key={s.n}
                className="relative flex w-[82vw] max-w-[380px] shrink-0 snap-start flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white/[.05] p-7 backdrop-blur lg:w-[440px] lg:max-w-none"
              >
                <span className="font-display pointer-events-none absolute -top-6 -right-2 text-[140px] leading-none font-semibold text-white/[.05]">
                  {s.n}
                </span>
                <div className="relative flex items-center justify-between">
                  <span className={cn('flex h-12 w-12 items-center justify-center rounded-2xl text-white', COLOR[s.color])}>
                    <Icon name={s.icon} size={22} />
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold">{s.badge}</span>
                </div>
                <h3 className="font-display relative mt-6 text-2xl leading-tight font-semibold">{t(s.title)}</h3>
                <p className="relative mt-1 text-sm font-semibold text-gold">{s.duration}</p>
                <p className="relative mt-4 leading-relaxed text-white/70">{t(s.desc)}</p>
                <p className="relative mt-auto flex items-center gap-2 pt-6 text-xs font-semibold text-white/55">
                  <CheckCircle2 size={14} className="text-mint" />
                  {t(roadmap.verified)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
