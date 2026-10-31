'use client';

import { useT } from '@/i18n/t';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { trust } from '@/content/home';
import { cn } from '@/lib/utils';

/* Icon tiles alternate between the two brand tints; red stays the accent, not the default */
const TILE = ['bg-blue-soft text-bleu', 'bg-red-soft text-rouge', 'bg-blue-soft text-bleu', 'bg-red-soft text-rouge'];

export function TrustBento() {
  const t = useT();
  const [zoom, bangla, standard, recording, batch] = trust.items;
  const rest = [zoom, standard, recording, batch];

  return (
    <section className="relative bg-bg py-20 md:py-28">
      <div className="container-x">
        <SectionHeading tag={t(trust.eyebrow)} title={t(trust.title)} num="01" />

        {/* 3 × 2 grid: the Bangla card takes the first column on both rows */}
        <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
          <Reveal className="md:row-span-2">
            <article className="relative flex h-full min-h-[300px] flex-col justify-between overflow-hidden rounded-[var(--radius)] bg-ink p-7 text-white md:p-8">
              <span
                aria-hidden
                className="font-bangla pointer-events-none absolute -right-5 -bottom-12 text-[200px] leading-none font-bold text-white/[.04] select-none"
              >
                অ আ
              </span>
              <div className="relative flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-gold">
                  <Icon name={bangla.icon} size={22} />
                </span>
                <span className="section-num text-white/40">02</span>
              </div>
              <div className="relative mt-12">
                <h3 className="font-display text-2xl leading-tight font-semibold md:text-3xl">{t(bangla.title)}</h3>
                <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-white/65">{t(bangla.desc)}</p>
                <p className="font-display mt-8 border-t border-white/15 pt-6 text-xl leading-snug text-gold italic">
                  “Bonjour” = <span className="font-bangla not-italic">“শুভ দিন / হ্যালো”</span>
                </p>
              </div>
            </article>
          </Reveal>

          {rest.map((item, i) => (
            <Reveal key={item.title.en} delay={0.06 * (i + 1)}>
              <article className="card flex h-full flex-col justify-between gap-8 p-6 transition-shadow duration-300 hover:shadow-[var(--shadow-lift)] md:p-7">
                <div className="flex items-start justify-between">
                  <span className={cn('flex h-12 w-12 items-center justify-center rounded-lg', TILE[i])}>
                    <Icon name={item.icon} size={22} />
                  </span>
                  <span className="section-num">{String([1, 3, 4, 5][i]).padStart(2, '0')}</span>
                </div>
                <div>
                  <h3 className="font-display text-xl leading-snug font-semibold">{t(item.title)}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{t(item.desc)}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
