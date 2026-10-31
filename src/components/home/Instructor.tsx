'use client';

import { BadgeCheck } from 'lucide-react';
import { useT } from '@/i18n/t';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { instructor } from '@/content/home';

export function Instructor() {
  const t = useT();
  const creds = [instructor.creds, instructor.experience, instructor.expert];

  return (
    <section id="instructor" className="relative bg-bg py-20 md:py-28">
      <div className="container-x">
        <SectionHeading tag={t(instructor.tag)} title={t(instructor.title)} intro={t(instructor.intro)} num="10" />

        {/* Portrait-less editorial profile */}
        <Reveal>
          <article className="card accent-top grid gap-10 p-7 md:p-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16 lg:p-12">
            <div>
              <p className="eyebrow text-rouge">{t(instructor.role)}</p>
              <h3 className="font-display mt-5 text-[clamp(2rem,4vw,3.2rem)] leading-[1.05] font-semibold text-balance">{t(instructor.name)}</h3>
              <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-mint">
                <BadgeCheck size={16} />
                {t(instructor.verified)}
              </p>
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="hairline pt-4">
                  <p className="font-display text-2xl font-semibold">DELF A1–B2</p>
                  <p className="mt-1 text-[11px] font-bold tracking-[0.16em] text-muted uppercase">Niveaux</p>
                </div>
                <div className="hairline pt-4">
                  <p className="font-display text-2xl font-semibold">Alliance Française</p>
                  <p className="mt-1 text-[11px] font-bold tracking-[0.16em] text-muted uppercase">Formation</p>
                </div>
              </div>
            </div>

            <div>
              <blockquote className="relative">
                <span aria-hidden className="font-display absolute -top-3 -left-1 text-6xl leading-none font-light text-rouge select-none">
                  “
                </span>
                <p className="font-display relative pl-8 text-[clamp(1.25rem,2vw,1.6rem)] leading-[1.5] italic">{t(instructor.bio)}</p>
              </blockquote>
              <ul className="mt-10 border-b border-line">
                {creds.map((c, i) => (
                  <li key={c.en} className="hairline flex items-start gap-5 py-4 text-[15px] leading-relaxed md:text-base">
                    <span className="section-num pt-1">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-semibold">{t(c)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
