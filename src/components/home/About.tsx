'use client';

import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { about } from '@/content/home';
import { BRAND_NAME } from '@/lib/brand';

export function About() {
  const t = useT();
  const { mission, vision, founded } = about;

  return (
    <section id="about" className="relative bg-surface py-20 md:py-28">
      <div className="container-x">
        <SectionHeading
          tag={t(about.badge)}
          title={
            <>
              {t(about.titleA)}
              <em className="text-rouge">{t(about.titleB)}</em>
            </>
          }
          intro={t(about.intro)}
          num="02"
        />

        {/* Mission / Vision — two flat cards with the red top accent */}
        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal>
            <article className="card accent-top flex h-full flex-col p-7 md:p-9">
              <p className="eyebrow text-rouge">{t(mission.label)}</p>
              <h3 className="font-display mt-5 text-2xl font-semibold md:text-3xl">{t(mission.title)}</h3>
              <p className="mt-5 text-[15px] leading-relaxed md:text-base">{t(mission.p1)}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-muted md:text-base">{t(mission.p2)}</p>
              <ul className="mt-7 grid gap-x-6 sm:grid-cols-2">
                {mission.goals.map((g) => (
                  <li key={g.label.en} className="hairline flex items-center gap-3 py-3 text-sm font-semibold">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-soft text-bleu">
                      <Icon name={g.icon} size={15} />
                    </span>
                    {t(g.label)}
                  </li>
                ))}
              </ul>
              <p className="hairline mt-auto flex items-center gap-2 pt-5 text-sm font-semibold">
                <CheckCircle2 size={16} className="text-mint" />
                {t(mission.footer)}
              </p>
            </article>
          </Reveal>

          <Reveal delay={0.1}>
            <article className="card accent-top flex h-full flex-col p-7 md:p-9">
              <p className="eyebrow text-rouge">{t(vision.label)}</p>
              <h3 className="font-display mt-5 text-2xl font-semibold md:text-3xl">{t(vision.title)}</h3>
              <blockquote className="font-display mt-5 border-l-2 border-rouge pl-5 text-xl leading-snug italic">{t(vision.quote)}</blockquote>
              <p className="mt-5 text-[15px] leading-relaxed text-muted md:text-base">{t(vision.p)}</p>
              <ul className="mt-7">
                {vision.pillars.map((p, i) => (
                  <li key={p.label.en} className="hairline flex items-start gap-4 py-3 text-sm">
                    <span className="section-num pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-red-soft text-rouge">
                      <Icon name={p.icon} size={15} />
                    </span>
                    <span className="pt-1.5 leading-snug">{t(p.label)}</span>
                  </li>
                ))}
              </ul>
              <div className="hairline mt-auto flex flex-wrap items-center justify-between gap-2 pt-5 text-sm">
                <span className="font-semibold">{t(vision.footer)}</span>
                <span className="text-xs tracking-wide text-muted uppercase">{t(vision.place)}</span>
              </div>
            </article>
          </Reveal>
        </div>

        {/* Why founded — full-width editorial quote block, then the story in two columns */}
        <article id="why-founded" className="mt-16 scroll-mt-28 md:mt-20">
          <Reveal>
            <div className="rounded-[var(--radius)] bg-surface-2 px-7 py-10 md:px-14 md:py-16">
              <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-14">
                <div>
                  <p className="eyebrow text-rouge">{t(founded.label)}</p>
                  <h3 className="font-display mt-5 text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.08] font-semibold text-balance">
                    {t(founded.titleA)}
                    <span className="text-bleu">{BRAND_NAME}</span>
                  </h3>
                </div>
                <blockquote className="relative">
                  <span aria-hidden className="font-display absolute -top-3 -left-1 text-6xl leading-none font-light text-rouge select-none md:-left-8">
                    “
                  </span>
                  <p className="font-display relative pl-7 text-[clamp(1.35rem,2.4vw,1.9rem)] leading-[1.4] italic md:pl-0">{t(founded.quote)}</p>
                </blockquote>
              </div>
            </div>
          </Reveal>

          <Reveal className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
            <div>
              <p className="eyebrow text-muted">01</p>
              <h4 className="font-display mt-4 text-2xl font-semibold">{t(founded.challengeTitle)}</h4>
              <p className="mt-4 text-[15px] leading-relaxed text-muted md:text-base">{t(founded.challenge1)}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-muted md:text-base">{t(founded.challenge2)}</p>
            </div>
            <div>
              <p className="eyebrow text-muted">02</p>
              <h4 className="font-display mt-4 text-2xl font-semibold">{t(founded.solutionTitle)}</h4>
              <p className="mt-4 text-[15px] leading-relaxed text-muted md:text-base">{t(founded.solution1)}</p>
              <p className="font-display my-5 border-l-2 border-bleu pl-5 text-xl leading-snug font-semibold">{t(founded.callout)}</p>
              <p className="text-[15px] leading-relaxed text-muted md:text-base">{t(founded.solution2)}</p>
            </div>
          </Reveal>

          {/* Journey + CTA on a hairline row */}
          <Reveal className="hairline mt-12 grid gap-8 pt-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
            <div>
              <p className="eyebrow text-rouge">{t(founded.journeyPill)}</p>
              <p className="mt-4 text-[15px] leading-relaxed md:text-lg">{t(founded.journey)}</p>
              <p className="font-display mt-4 text-xl text-bleu italic">{t(founded.tagline)}</p>
            </div>
            <div className="card p-6 md:p-7">
              <p className="font-display text-2xl font-semibold">{t(founded.ctaTitle)}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{t(founded.ctaText)}</p>
              <Link href={{ pathname: '/', hash: 'courses' }} className={btn('rouge', 'md', 'mt-5 w-full')}>
                {t(founded.ctaExplore)}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </article>
      </div>
    </section>
  );
}
