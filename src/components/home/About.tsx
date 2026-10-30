'use client';

import { ArrowRight, CheckCircle2, HeartHandshake, Quote, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Tilt } from '@/components/ui/Tilt';
import { about } from '@/content/home';
import { BRAND_NAME } from '@/lib/brand';

export function About() {
  const t = useT();
  const { mission, vision, founded } = about;

  return (
    <section id="about" className="relative bg-bg pb-24 md:pb-32">
      <div className="container-x">
        <SectionHeading
          tag={t(about.badge)}
          title={
            <>
              {t(about.titleA)}
              <em className="text-bleu">{t(about.titleB)}</em>
            </>
          }
          intro={t(about.intro)}
        />

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Mission */}
          <Reveal>
            <Tilt className="h-full rounded-[var(--radius)]" max={3}>
              <article className="relative flex h-full flex-col overflow-hidden rounded-[var(--radius)] border border-line bg-surface p-7 md:p-9">
                <span className="tricolor absolute inset-x-0 top-0 h-1" />
                <p className="text-[11px] font-bold tracking-[0.2em] text-rouge uppercase">{t(mission.label)}</p>
                <h3 className="font-display mt-3 text-3xl font-semibold">{t(mission.title)}</h3>
                <p className="mt-5 leading-relaxed text-fg/85">{t(mission.p1)}</p>
                <p className="mt-3 leading-relaxed text-muted">{t(mission.p2)}</p>
                <div className="mt-6 grid grid-cols-2 gap-2.5">
                  {mission.goals.map((g) => (
                    <span key={g.label.en} className="flex items-center gap-2.5 rounded-2xl bg-surface-2/70 px-3.5 py-3 text-sm font-semibold">
                      <Icon name={g.icon} size={16} className="shrink-0 text-bleu" />
                      {t(g.label)}
                    </span>
                  ))}
                </div>
                <div className="mt-auto flex items-center justify-between pt-7 text-sm font-semibold">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={17} className="text-mint" />
                    {t(mission.footer)}
                  </span>
                  <span className="flex gap-1">
                    <i className="h-2.5 w-2.5 rounded-full bg-[#002395]" />
                    <i className="h-2.5 w-2.5 rounded-full border border-line bg-white" />
                    <i className="h-2.5 w-2.5 rounded-full bg-[#ED2939]" />
                  </span>
                </div>
              </article>
            </Tilt>
          </Reveal>

          {/* Vision */}
          <Reveal delay={0.1}>
            <Tilt className="h-full rounded-[var(--radius)]" max={3}>
              <article className="relative flex h-full flex-col overflow-hidden rounded-[var(--radius)] bg-ink p-7 text-white md:p-9">
                <div className="dots pointer-events-none absolute inset-0 opacity-25" />
                <p className="relative text-[11px] font-bold tracking-[0.2em] text-gold uppercase">{t(vision.label)}</p>
                <h3 className="font-display relative mt-3 text-3xl font-semibold">{t(vision.title)}</h3>
                <blockquote className="font-display relative mt-5 border-l-2 border-gold pl-4 text-xl leading-snug text-gold italic">
                  {t(vision.quote)}
                </blockquote>
                <p className="relative mt-5 leading-relaxed text-white/70">{t(vision.p)}</p>
                <ul className="relative mt-5 space-y-2.5">
                  {vision.pillars.map((p) => (
                    <li key={p.label.en} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/8 text-gold">
                        <Icon name={p.icon} size={14} />
                      </span>
                      <span className="pt-1 text-white/85">{t(p.label)}</span>
                    </li>
                  ))}
                </ul>
                <div className="relative mt-auto flex items-center justify-between pt-7 text-sm text-white/70">
                  <span className="flex items-center gap-2">
                    <Sparkles size={15} className="text-gold" />
                    {t(vision.footer)}
                  </span>
                  <span className="text-xs">{t(vision.place)}</span>
                </div>
              </article>
            </Tilt>
          </Reveal>
        </div>

        {/* Why founded — editorial spread */}
        <Reveal>
          <article id="why-founded" className="mt-5 scroll-mt-28 overflow-hidden rounded-[var(--radius)] border border-line bg-surface">
            <div className="grid lg:grid-cols-[1fr_1.25fr]">
              <div className="relative flex flex-col justify-between gap-8 bg-surface-2/60 p-7 md:p-10">
                <div>
                  <p className="text-[11px] font-bold tracking-[0.2em] text-rouge uppercase">{t(founded.label)}</p>
                  <h3 className="font-display mt-3 text-[clamp(1.9rem,3.6vw,2.8rem)] leading-[1.05] font-semibold">
                    {t(founded.titleA)}
                    <span className="text-bleu">{BRAND_NAME}</span>
                  </h3>
                </div>
                <blockquote className="relative">
                  <Quote size={42} className="absolute -top-4 -left-1 text-rouge/20" />
                  <p className="font-display relative text-2xl leading-snug italic">{t(founded.quote)}</p>
                </blockquote>
              </div>
              <div className="grid gap-6 p-7 md:p-10">
                <div>
                  <p className="mb-2 flex items-center gap-2 font-bold">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rouge text-xs text-white">!</span>
                    {t(founded.challengeTitle)}
                  </p>
                  <p className="leading-relaxed text-muted">{t(founded.challenge1)}</p>
                  <p className="mt-3 leading-relaxed text-muted">{t(founded.challenge2)}</p>
                </div>
                <div>
                  <p className="mb-2 flex items-center gap-2 font-bold">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-bleu text-xs text-white">✓</span>
                    {t(founded.solutionTitle)}
                  </p>
                  <p className="leading-relaxed text-muted">{t(founded.solution1)}</p>
                  <p className="font-display my-4 rounded-2xl border-l-4 border-bleu bg-bleu/8 px-5 py-4 text-lg font-semibold">
                    {t(founded.callout)}
                  </p>
                  <p className="leading-relaxed text-muted">{t(founded.solution2)}</p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden bg-ink p-7 text-white md:p-10">
              <div className="dots pointer-events-none absolute inset-0 opacity-25" />
              <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">
                    <HeartHandshake size={14} className="text-gold" />
                    {t(founded.journeyPill)}
                  </span>
                  <p className="mt-4 text-lg leading-relaxed text-white/80">{t(founded.journey)}</p>
                  <p className="font-display mt-4 text-xl text-gold italic">{t(founded.tagline)}</p>
                </div>
                <div className="rounded-2xl bg-white/6 p-6">
                  <p className="font-display text-2xl font-semibold">{t(founded.ctaTitle)}</p>
                  <p className="mt-2 text-sm text-white/65">{t(founded.ctaText)}</p>
                  <Link href={{ pathname: '/', hash: 'courses' }} className={btn('rouge', 'md', 'mt-5 w-full')}>
                    {t(founded.ctaExplore)}
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
