'use client';

import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { MapleLeaf } from '@/components/ui/MapleLeaf';
import { hero, marquee } from '@/content/home';
import { MapleDrift } from './MapleDrift';

/**
 * CSS-only entrance (`.hero-in` / @keyframes hero-in in globals.css): the copy is in the server HTML at full
 * strength, so it shows (and counts for LCP) before any JS runs. Reduced-motion users get no animation.
 */
const enter = (delay: number, className: string) => ({ className: `hero-in ${className}`, style: { animationDelay: `${delay}s` } });

/**
 * Hero: the Toronto–Paris skyline photo fills the band; a navy wash on the left keeps the
 * headline legible while maple leaves drift down that side. Copy sits on an editorial grid.
 */
export function Hero() {
  const t = useT();

  return (
    <section id="hero" className="relative isolate overflow-hidden bg-ink text-white">
      {/* Photo */}
      <picture className="absolute inset-0 -z-20">
        <source media="(max-width: 640px)" srcSet="/hero-sm.webp" />
        <source media="(max-width: 1100px)" srcSet="/hero-md.webp" />
        <img
          src="/hero.webp"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-[72%_center] sm:object-[60%_center]"
          style={{ animation: 'ken-burns 18s ease-out forwards' }} // stopped for reduced motion by the global CSS rule
        />
      </picture>
      {/* Legibility wash: strong on the left, clear on the right so the skyline shows */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(14,26,47,.96)_0%,rgba(14,26,47,.86)_34%,rgba(14,26,47,.45)_62%,rgba(14,26,47,.15)_100%)]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-[linear-gradient(to_top,rgba(14,26,47,.95),transparent)]" />
      <MapleDrift />

      <div className="container-x relative grid min-h-[92svh] items-end pt-32 pb-12 md:min-h-[88svh] md:pt-40 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)] lg:items-center lg:pb-16">
        <div className="max-w-2xl">
          <p lang="bn" {...enter(0, 'font-bangla mb-3 text-base font-semibold text-white/90 sm:text-lg')}>
            স্বল্প খরচে, সহজে ফরাসি শেখার প্লাটফর্ম
          </p>
          <p {...enter(0.06, 'eyebrow text-[#ffb3ab]')}>
            {t(hero.eyebrow)}
          </p>

          <h1 {...enter(0.12, 'font-display mt-6 text-[clamp(2.8rem,7vw,5.9rem)] leading-[0.98] font-semibold tracking-tight text-balance')}>
            {t(hero.line1)} <span className="text-[#ffb3ab] italic">{t(hero.line2)}</span>
          </h1>

          <p {...enter(0.3, 'mt-6 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl')}>
            {t(hero.subtitle)}
          </p>

          <div {...enter(0.45, 'mt-8 flex flex-wrap gap-3')}>
            <Link href={{ pathname: '/', hash: 'courses' }} className={btn('rouge', 'lg')}>
              {t(hero.ctaPrimary)}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/free-class" className={btn('paper', 'lg')}>
              <Sparkles size={17} className="text-rouge" />
              {t({ en: 'Join a free class', bn: 'ফ্রি ক্লাসে যোগ দিন' })}
            </Link>
          </div>

          {/* Exam strip */}
          <ul {...enter(0.6, 'mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-3 border-t border-white/15 pt-5 sm:grid-cols-4')}>
            {hero.chips.map((c) => (
              <li key={c.title.en} className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[#ffb3ab]">
                  <Icon name={c.icon} size={15} />
                </span>
                <span className="leading-tight">
                  <span className="block text-[13px] font-bold">{t(c.title)}</span>
                  <span className="block text-xs text-white/60 sm:text-[11px]">{t(c.sub)}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Canada card, anchored bottom-right so the student in the photo stays visible */}
        <aside {...enter(0.8, 'mt-10 w-full justify-self-end sm:max-w-[380px] lg:mt-0')}>
          {/* Phones: a near-opaque card with no backdrop blur (blur over the animated photo is costly on mobile GPUs) */}
          <div className="accent-top rounded-[var(--radius)] border border-white/15 bg-ink/90 p-5 shadow-2xl sm:bg-ink/70 sm:backdrop-blur-xl">
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rouge text-white">
                <MapleLeaf size={22} />
              </span>
              <div>
                <p className="font-display text-lg font-semibold">{t(hero.card.title)}</p>
                <p className="text-sm text-white/70">
                  {t(hero.card.pre)} <strong className="font-bold text-white">{t(hero.card.strong)}</strong>
                </p>
              </div>
            </div>
            <ul className="mt-4 space-y-2">
              {hero.card.checks.map((c) => (
                <li key={c.en} className="flex items-center gap-2 text-sm text-white/85">
                  <CheckCircle2 size={16} className="shrink-0 text-[#6fd3a5]" />
                  {t(c)}
                </li>
              ))}
            </ul>
            <Link href="/crs-calculator" className={btn('paper', 'md', 'mt-5 w-full justify-between')}>
              <span className="flex items-center gap-2">
                <Sparkles size={16} className="text-rouge" />
                {t(hero.card.cta)}
              </span>
              <ArrowRight size={16} />
            </Link>
            <p className="mt-3 text-xs leading-snug text-white/60">{t(hero.card.disclaimer)}</p>
          </div>
        </aside>
      </div>

      {/* Marquee */}
      <div className="relative border-t border-white/10 bg-rouge py-3 text-white">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i} className="font-display flex items-center gap-10 text-base font-semibold italic">
              {t(m)}
              <MapleLeaf size={13} className="text-white/60" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
