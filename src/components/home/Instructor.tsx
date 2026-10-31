'use client';

import { BadgeCheck, GraduationCap } from 'lucide-react';
import { useT } from '@/i18n/t';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { instructor } from '@/content/home';

export function Instructor() {
  const t = useT();
  return (
    <section id="instructor" className="relative bg-bg py-24 md:py-32">
      <div className="container-x">
        <SectionHeading tag={t(instructor.tag)} title={t(instructor.title)} intro={t(instructor.intro)} align="center" />
        <Reveal>
          <article className="mx-auto grid max-w-4xl overflow-hidden rounded-[30px] border border-line bg-surface md:grid-cols-[300px_1fr]">
            <div className="relative flex min-h-[280px] flex-col items-center justify-center gap-3 overflow-hidden bg-ink p-8 text-white">
              <div className="dots pointer-events-none absolute inset-0 opacity-30" />
              <span className="tricolor absolute inset-x-0 top-0 h-1.5" />
              <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white/10 ring-4 ring-white/10">
                <GraduationCap size={44} className="text-gold" />
              </span>
              <p className="font-display relative text-2xl font-semibold">DELF A1–B2</p>
              <p className="relative text-sm text-white/60">Alliance Française</p>
              <span className="relative inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1 text-xs font-bold">
                <BadgeCheck size={14} /> {t(instructor.verified)}
              </span>
            </div>
            <div className="p-7 md:p-10">
              <h3 className="font-display text-3xl font-semibold">{t(instructor.name)}</h3>
              <p className="mt-1 font-semibold text-rouge">{t(instructor.role)}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {[instructor.creds, instructor.experience, instructor.expert].map((c) => (
                  <span key={c.en} className="rounded-full border border-line bg-surface-2/60 px-3 py-1.5 text-xs font-semibold">
                    {t(c)}
                  </span>
                ))}
              </div>
              <p className="mt-6 text-[17px] leading-relaxed text-muted">{t(instructor.bio)}</p>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
