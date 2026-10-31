'use client';

import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { roadmap } from '@/content/home';

/** Vertical editorial timeline: numbered steps down a hairline, each with a red marker. */
export function Roadmap() {
  const t = useT();

  return (
    <section id="roadmap" className="relative bg-bg py-20 md:py-28">
      <div className="container-x grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading tag={t(roadmap.tag)} title={t(roadmap.title)} intro={t(roadmap.intro)} num="08" className="mb-0 md:mb-0">
            <Link href="/enroll" className={btn('rouge', 'lg', 'mt-2 self-start')}>
              {t(roadmap.cta)} <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </SectionHeading>
        </div>

        <ol className="relative ml-1.5 border-l border-line lg:ml-0">
          {roadmap.steps.map((s, i) => (
            <li key={s.n} className="relative pb-12 pl-8 last:pb-0 md:pl-12">
              {/* Marker on the line */}
              <span aria-hidden className="absolute top-2 -left-[5px] h-[9px] w-[9px] rounded-full bg-rouge ring-4 ring-bg" />
              <Reveal delay={i * 0.06}>
                <div className="grid gap-5 md:grid-cols-[96px_1fr] md:gap-8">
                  <div>
                    <p className="font-display text-5xl leading-none font-semibold text-fg/90 md:text-6xl">{s.n}</p>
                    <p className="mt-3 text-sm font-semibold text-rouge">{t(s.duration)}</p>
                  </div>
                  <div className="card p-6 md:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <p className="eyebrow text-muted">{t(s.badge)}</p>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-soft text-bleu">
                        <Icon name={s.icon} size={18} />
                      </span>
                    </div>
                    <h3 className="font-display mt-4 text-xl leading-snug font-semibold md:text-2xl">{t(s.title)}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted md:text-base">{t(s.desc)}</p>
                    <p className="hairline mt-5 flex items-center gap-2 pt-4 text-xs font-semibold text-muted">
                      <CheckCircle2 size={14} className="text-mint" />
                      {t(roadmap.verified)}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
