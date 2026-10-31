'use client';

import { ArrowRight, Check } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { MapleLeaf } from '@/components/ui/MapleLeaf';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { pathways } from '@/content/home';
import { cn } from '@/lib/utils';

function Bullets({ items, tone }: { items: { en: string; bn: string }[]; tone: 'rouge' | 'bleu' }) {
  const t = useT();
  return (
    <ul>
      {items.map((b, i) => (
        <li key={b.en} className="hairline flex items-start gap-4 py-4 text-[15px] leading-relaxed">
          <span className="section-num pt-1">{String(i + 1).padStart(2, '0')}</span>
          <span className="flex-1">{t(b)}</span>
          <Check size={16} className={cn('mt-1.5 shrink-0', tone === 'rouge' ? 'text-rouge' : 'text-bleu')} />
        </li>
      ))}
    </ul>
  );
}

export function Pathways() {
  const t = useT();
  const { canada, france } = pathways;

  return (
    <section id="pathways" className="relative bg-bg py-20 md:py-28">
      <div className="container-x">
        <SectionHeading tag={t(pathways.tag)} title={t(pathways.title)} intro={t(pathways.intro)} num="04" />

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Canada */}
          <Reveal>
            <article className="card flex h-full flex-col overflow-hidden">
              <div className="relative overflow-hidden bg-rouge p-7 text-white md:p-9">
                <MapleLeaf size={280} className="pointer-events-none absolute -top-14 -right-12 text-white/[.12]" />
                <p className="eyebrow relative text-white/85">{t(canada.ribbon)}</p>
                <h3 className="font-display relative mt-6 text-3xl font-semibold md:text-4xl">{t(canada.title)}</h3>
                <p className="relative mt-2 text-white/80">{t(canada.sub)}</p>
                <div className="relative mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-white/20 pt-6">
                  <div>
                    <p className="text-[11px] font-bold tracking-[0.18em] text-white/70 uppercase">{t(canada.statLabel)}</p>
                    <p className="font-display mt-1 text-[clamp(2.4rem,5vw,3.6rem)] leading-none font-semibold">{t(canada.stat)}</p>
                  </div>
                  <Link href="/crs-calculator" className={btn('paper', 'sm', 'text-rouge')}>
                    {t(canada.calc)}
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-7 md:p-9">
                <Bullets items={canada.bullets} tone="rouge" />
                <Link href="/courses/tef-canada" className={btn('ink', 'md', 'mt-8 self-start')}>
                  {t(canada.cta)}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          </Reveal>

          {/* France */}
          <Reveal delay={0.1}>
            <article className="card flex h-full flex-col overflow-hidden">
              <div className="relative overflow-hidden bg-bleu p-7 text-white md:p-9">
                <svg viewBox="0 0 100 160" className="pointer-events-none absolute -top-6 right-8 h-[260px] text-white/[.12]" fill="currentColor" aria-hidden>
                  <path d="M50 0 52 30 58 70 70 110 86 160H72L62 130H38L28 160H14L30 110 42 70 48 30Z" />
                </svg>
                <p className="eyebrow relative text-white/85">{t(france.ribbon)}</p>
                <h3 className="font-display relative mt-6 text-3xl font-semibold md:text-4xl">{t(france.title)}</h3>
                <p className="relative mt-2 text-white/80">{t(france.sub)}</p>
                <div className="relative mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-white/20 pt-6">
                  <div>
                    <p className="text-[11px] font-bold tracking-[0.18em] text-white/70 uppercase">{t(france.statLabel)}</p>
                    <p className="font-display mt-1 text-[clamp(2.4rem,5vw,3.6rem)] leading-none font-semibold">{t(france.stat)}</p>
                  </div>
                  <span className="rounded-md border border-white/30 px-3 py-2 text-xs font-bold">{t(france.chip)}</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-7 md:p-9">
                <Bullets items={france.bullets} tone="bleu" />
                <Link href="/courses/delf-b2" className={btn('ink', 'md', 'mt-8 self-start')}>
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
