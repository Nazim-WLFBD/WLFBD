'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { MapleLeaf } from '@/components/ui/MapleLeaf';
import { Tilt } from '@/components/ui/Tilt';
import { hero, marquee } from '@/content/home';
import { cn } from '@/lib/utils';

const HeroGlobe = dynamic(() => import('./HeroGlobe'), { ssr: false, loading: () => <GlobeFallback /> });

function canUseWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const t = useT();
  const reduce = useReducedMotion();
  const [use3d, setUse3d] = useState(false);

  useEffect(() => {
    setUse3d(!reduce && canUseWebGL());
  }, [reduce]);

  const words = (s: string) => s.split(' ');

  return (
    <section id="hero" className="relative overflow-hidden bg-ink text-white">
      {/* Atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[720px] w-[1200px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(39,71,216,.38),transparent)]" />
        <div className="absolute right-[-10%] bottom-[-20%] h-[520px] w-[620px] rounded-full bg-[radial-gradient(closest-side,rgba(224,36,58,.22),transparent)]" />
        <div className="dots absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,#000,transparent_85%)]" />
      </div>

      <div className="container-x relative grid min-h-[100svh] items-center gap-6 pt-28 pb-10 lg:grid-cols-[1.08fr_1fr] lg:pt-24">
        {/* Copy */}
        <div className="relative z-10">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/5 py-1.5 pr-4 pl-1.5 text-xs font-semibold tracking-wide text-white/80"
          >
            <span className="tricolor h-5 w-8 rounded-full" />
            {t(hero.eyebrow)}
          </motion.p>

          <h1 className="font-display text-[clamp(2.9rem,7.6vw,6.4rem)] leading-[0.95] font-semibold">
            <span className="block">
              {words(t(hero.line1)).map((w, i) => (
                <motion.span
                  key={`a${i}`}
                  className="mr-[0.22em] inline-block"
                  initial={reduce ? false : { opacity: 0, y: '0.6em', rotate: 3 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.08, ease }}
                >
                  {w + ' '}
                </motion.span>
              ))}
            </span>
            <span className="block text-rouge italic">
              {words(t(hero.line2)).map((w, i) => (
                <motion.span
                  key={`b${i}`}
                  className="mr-[0.22em] inline-block"
                  initial={reduce ? false : { opacity: 0, y: '0.6em', rotate: 3 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ duration: 0.9, delay: 0.35 + i * 0.08, ease }}
                >
                  {w + ' '}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-white/70 md:text-xl"
          >
            {t(hero.subtitle)}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease }}
            className="mt-8 grid max-w-xl grid-cols-2 gap-2.5 sm:grid-cols-4"
          >
            {hero.chips.map((c) => (
              <div key={c.title} className="glass flex flex-col gap-2 rounded-2xl p-3">
                <span
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full',
                    c.icon === 'maple' ? 'bg-maple text-white' : 'bg-white/10 text-gold',
                  )}
                >
                  <Icon name={c.icon} size={15} />
                </span>
                <span className="text-[13px] leading-tight font-bold">{c.title}</span>
                <span className="-mt-1 text-[11px] text-white/55">{c.sub}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Link href={{ pathname: '/', hash: 'courses' }} className={btn('rouge', 'lg')}>
              {t(hero.ctaPrimary)}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/quiz/placement-test" className={btn('ghost-light', 'lg')}>
              <Sparkles size={17} className="text-gold" />
              {t(hero.ctaSecondary)}
            </Link>
          </motion.div>
        </div>

        {/* Globe + Canada card */}
        <div className="relative flex flex-col lg:block lg:h-[640px]">
          <div className="relative h-[340px] sm:h-[460px] lg:absolute lg:inset-0 lg:h-auto">
            <div className="absolute inset-0 -mx-4 lg:-mr-20 lg:-ml-10">{use3d ? <HeroGlobe /> : <GlobeFallback />}</div>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1, ease }}
            className="relative z-10 -mt-16 w-full sm:mx-auto sm:max-w-[400px] lg:absolute lg:right-2 lg:bottom-0 lg:mt-0 lg:w-[360px]"
          >
            <Tilt max={5}>
              <div className="rounded-[26px] border border-white/15 bg-white/[.08] p-5 shadow-2xl backdrop-blur-xl">
                <div className="flex items-start gap-3.5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-maple text-white shadow-lg">
                    <MapleLeaf size={24} />
                  </span>
                  <div>
                    <p className="font-display text-xl font-semibold">{hero.card.title}</p>
                    <p className="text-sm text-white/70">
                      {hero.card.pre} <strong className="font-extrabold text-white">{hero.card.strong}</strong>
                    </p>
                  </div>
                </div>
                <ul className="mt-4 space-y-2">
                  {hero.card.checks.map((c) => (
                    <li key={c} className="flex items-center gap-2 text-sm text-white/85">
                      <CheckCircle2 size={16} className="shrink-0 text-mint" />
                      {c}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/crs-calculator"
                  className="mt-5 flex items-center justify-between gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-ink transition hover:bg-gold"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles size={16} className="text-rouge" />
                    {t(hero.card.cta)}
                  </span>
                  <ArrowRight size={16} />
                </Link>
                <p className="mt-3 text-[10px] leading-snug text-white/45">{hero.card.disclaimer}</p>
              </div>
            </Tilt>
          </motion.div>
        </div>
      </div>

      {/* Feature bar */}
      <div className="container-x relative z-10 pb-10">
        <div className="grid gap-px overflow-hidden rounded-[26px] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {hero.features.map((f) => (
            <div key={f.title.en} className="flex items-center gap-3.5 bg-ink-2/90 p-4 sm:p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/7 text-gold">
                <Icon name={f.icon} size={20} />
              </span>
              <span>
                <span className="block text-sm font-bold">{t(f.title)}</span>
                <span className="block text-xs text-white/55">{t(f.sub)}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee */}
      <div className="relative border-y border-white/10 bg-rouge py-3.5 text-white">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i} className="font-display flex items-center gap-10 text-lg font-semibold italic">
              {m}
              <MapleLeaf size={14} className="text-white/60" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Static globe used for reduced motion, no WebGL, and while the 3D scene loads. */
function GlobeFallback() {
  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 m-auto h-full w-full max-w-[560px]" aria-hidden>
      <defs>
        <radialGradient id="gf" cx="40%" cy="35%">
          <stop offset="0" stopColor="#1c2a62" />
          <stop offset="1" stopColor="#0a1230" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="150" fill="url(#gf)" stroke="rgba(91,124,255,.45)" />
      {[-60, -30, 0, 30, 60].map((l) => (
        <ellipse key={l} cx="200" cy={200 + l * 1.6} rx={150 * Math.cos((l * Math.PI) / 180)} ry="14" fill="none" stroke="rgba(159,179,255,.18)" />
      ))}
      {[0, 30, 60, 90, 120, 150].map((a) => (
        <ellipse key={a} cx="200" cy="200" rx={Math.abs(150 * Math.cos((a * Math.PI) / 180))} ry="150" fill="none" stroke="rgba(159,179,255,.14)" />
      ))}
      <path d="M300 230 Q 240 110 190 150" fill="none" stroke="#e8b64a" strokeWidth="2.5" strokeDasharray="6 7" />
      <path d="M190 150 Q 140 90 95 170" fill="none" stroke="#ff3b4f" strokeWidth="2.5" strokeDasharray="6 7" />
      {[
        { x: 300, y: 230, c: '#1b9c6b', l: 'DAC' },
        { x: 190, y: 150, c: '#5b7cff', l: 'PAR' },
        { x: 95, y: 170, c: '#ff3b4f', l: 'YYZ' },
      ].map((p) => (
        <g key={p.l}>
          <circle cx={p.x} cy={p.y} r="6" fill={p.c} />
          <text x={p.x} y={p.y - 12} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700" fontFamily="monospace">
            {p.l}
          </text>
        </g>
      ))}
    </svg>
  );
}
