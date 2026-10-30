'use client';

import { useT } from '@/i18n/t';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { trust } from '@/content/home';
import { cn } from '@/lib/utils';

export function TrustBento() {
  const t = useT();
  const [zoom, bangla, standard, recording, batch] = trust.items;

  return (
    <section className="relative bg-bg py-20 md:py-28">
      <div className="container-x">
        <Reveal className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-[11px] font-bold tracking-[0.2em] text-rouge uppercase">{t(trust.eyebrow)}</p>
            <h2 className="font-display max-w-xl text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] font-semibold">{t(trust.title)}</h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:auto-rows-[minmax(170px,auto)] md:grid-cols-3">
          {/* Feature tile */}
          <Reveal className="col-span-2 md:col-span-1 md:row-span-2">
            <div className="relative flex h-full min-h-[240px] flex-col md:min-h-[300px] justify-between overflow-hidden rounded-[var(--radius)] bg-ink p-7 text-white">
              <span
                aria-hidden
                className="font-bangla pointer-events-none absolute -right-6 -bottom-10 text-[180px] leading-none font-bold text-white/[.05]"
              >
                অ আ
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold text-ink">
                <Icon name={bangla.icon} size={22} />
              </span>
              <div className="relative">
                <p className="font-display text-3xl leading-tight font-semibold">{t(bangla.title)}</p>
                <p className="mt-2 text-white/65">{t(bangla.desc)}</p>
                <p className="font-bangla mt-6 text-2xl text-gold">“Bonjour” = “শুভ দিন / হ্যালো”</p>
              </div>
            </div>
          </Reveal>
          {[zoom, standard, recording, batch].map((item, i) => (
            <Reveal key={item.title.en} delay={0.06 * (i + 1)}>
              <div
                className={cn(
                  'group flex h-full flex-col justify-between gap-5 rounded-[var(--radius)] border border-line bg-surface p-4 transition sm:p-6 duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]',
                )}
              >
                <span
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-xl text-white transition group-hover:scale-110',
                    ['bg-bleu', 'bg-gold !text-ink', 'bg-ink-3', 'bg-rouge'][i],
                  )}
                >
                  <Icon name={item.icon} size={20} />
                </span>
                <div>
                  <p className="text-[15px] leading-snug font-bold sm:text-lg">{t(item.title)}</p>
                  <p className="mt-1 text-sm text-muted">{t(item.desc)}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
