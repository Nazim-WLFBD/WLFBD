'use client';

import { ArrowRight, CheckCircle2, GraduationCap, Plane, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { MapleLeaf } from '@/components/ui/MapleLeaf';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { pathways } from '@/content/home';

export function Pathways() {
  const t = useT();
  const { canada, france } = pathways;

  return (
    <section id="pathways" className="relative bg-bg py-24 md:py-32">
      <div className="container-x">
        <SectionHeading tag={t(pathways.tag)} title={t(pathways.title)} intro={t(pathways.intro)} align="center" />

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Canada */}
          <Reveal>
            <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-surface">
              <div className="relative overflow-hidden bg-maple p-7 text-white md:p-9">
                <MapleLeaf
                  size={260}
                  className="absolute -top-12 -right-10 text-white/10 transition-transform duration-[1.5s] group-hover:rotate-12"
                />
                <span className="relative inline-block rounded-full bg-white px-3 py-1 text-[10px] font-extrabold tracking-[0.16em] text-maple">
                  {canada.ribbon}
                </span>
                <div className="relative mt-6 flex items-center gap-3">
                  <Plane size={22} />
                  <h3 className="font-display text-3xl font-semibold">{canada.title}</h3>
                </div>
                <p className="relative mt-1 text-white/80">{t(canada.sub)}</p>
                <div className="relative mt-7 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-white/70 uppercase">{t(canada.statLabel)}</p>
                    <p className="font-display text-[clamp(2.6rem,6vw,4rem)] leading-none font-semibold">{canada.stat}</p>
                  </div>
                  <Link href="/crs-calculator" className={btn('paper', 'sm', 'text-maple')}>
                    <Sparkles size={15} />
                    {t(canada.calc)}
                  </Link>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-7 md:p-9">
                <ul className="mb-8 space-y-3.5">
                  {canada.bullets.map((b) => (
                    <li key={b.en} className="flex items-start gap-3 text-[15px] leading-relaxed">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-maple" />
                      {t(b)}
                    </li>
                  ))}
                </ul>
                <Link href="/courses/tef-canada" className={btn('ink', 'md', 'mt-auto self-start')}>
                  {t(canada.cta)}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          </Reveal>

          {/* France */}
          <Reveal delay={0.1}>
            <article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-surface">
              <div className="relative overflow-hidden bg-bleu p-7 text-white md:p-9">
                <svg
                  viewBox="0 0 100 160"
                  className="absolute -top-4 right-6 h-[240px] text-white/10 transition-transform duration-[1.5s] group-hover:-translate-y-2"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M50 0 52 30 58 70 70 110 86 160H72L62 130H38L28 160H14L30 110 42 70 48 30Z" />
                </svg>
                <span className="relative inline-block rounded-full bg-white px-3 py-1 text-[10px] font-extrabold tracking-[0.16em] text-bleu">
                  {france.ribbon}
                </span>
                <div className="relative mt-6 flex items-center gap-3">
                  <GraduationCap size={22} />
                  <h3 className="font-display text-3xl font-semibold">{france.title}</h3>
                </div>
                <p className="relative mt-1 text-white/80">{t(france.sub)}</p>
                <div className="relative mt-7 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-white/70 uppercase">{t(france.statLabel)}</p>
                    <p className="font-display text-[clamp(2.6rem,6vw,4rem)] leading-none font-semibold">{france.stat}</p>
                  </div>
                  <span className="rounded-full border border-white/30 px-3 py-1.5 text-xs font-bold">{france.chip}</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-7 md:p-9">
                <ul className="mb-8 space-y-3.5">
                  {france.bullets.map((b) => (
                    <li key={b.en} className="flex items-start gap-3 text-[15px] leading-relaxed">
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-bleu" />
                      {t(b)}
                    </li>
                  ))}
                </ul>
                <Link href="/courses/delf-b2" className={btn('ink', 'md', 'mt-auto self-start')}>
                  {t(france.cta)}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
