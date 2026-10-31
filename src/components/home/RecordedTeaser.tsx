'use client';

import Image from 'next/image';
import { ArrowRight, Check, PlayCircle } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { recorded } from '@/content/home';
import { waLink, waMessage } from '@/lib/brand';
import { cn, num, taka } from '@/lib/utils';
import type { RecordedCourse } from '@/types';
import { WhatsAppGlyph } from '@/components/layout/FloatingActions';

export function RecordedTeaser({ courses }: { courses: RecordedCourse[] }) {
  const t = useT();

  return (
    <section id="recorded-courses" className="relative bg-surface py-20 md:py-28">
      <div className="container-x">
        <SectionHeading
          tag={t(recorded.badge)}
          title={
            <>
              {t(recorded.titleA)}
              <em className="text-rouge">{t(recorded.titleB)}</em>
              {t(recorded.titleC)}
            </>
          }
          intro={t(recorded.intro)}
          num="05"
        />

        {/* Benefits as a hairline row */}
        <Reveal className="mb-12 grid grid-cols-2 gap-x-6 lg:grid-cols-4">
          {recorded.benefits.map((b, i) => (
            <div key={b.t.en} className="hairline flex items-start gap-3 py-4">
              <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-md', i % 2 ? 'bg-red-soft text-rouge' : 'bg-blue-soft text-bleu')}>
                <Icon name={b.icon} size={16} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm leading-snug font-bold">{t(b.t)}</span>
                <span className="block text-xs leading-snug text-muted">{t(b.s)}</span>
              </span>
            </div>
          ))}
        </Reveal>

        {/* Magazine-style course cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((c, i) => {
            const off = Math.round(((c.regularPrice - c.offerPrice) / c.regularPrice) * 100);
            const bn = t.locale === 'bn';
            const hours = bn && c.banglaTotalHours ? c.banglaTotalHours.split(' ')[0] : num(c.totalHours.split(' ')[0], t.locale);
            return (
              <Reveal key={c.id} delay={i * 0.1}>
                <article className="card group flex h-full flex-col overflow-hidden transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]">
                  <Link href={`/recorded/${c.slug}`} className="relative block aspect-[16/9] overflow-hidden bg-ink">
                    <Image
                      src={c.thumbnail}
                      alt={bn ? c.banglaTitle : c.title}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover opacity-85 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                      <span className="rounded-md bg-white px-2 py-1 text-[11px] font-extrabold text-ink">DELF {c.level}</span>
                      <span className="rounded-md bg-ink/80 px-2 py-1 text-[11px] font-bold text-white">{t(recorded.tagRecorded)}</span>
                      <span className="rounded-md bg-rouge px-2 py-1 text-[11px] font-extrabold text-white">
                        {num(off, t.locale)}% {t(recorded.off)}
                      </span>
                    </div>
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-ink shadow-[var(--shadow-card)] transition group-hover:scale-105">
                        <PlayCircle size={18} className="text-rouge" />
                        {t(recorded.preview)}
                      </span>
                    </span>
                    <div className="absolute right-4 bottom-4 left-4 flex justify-between text-[11px] font-bold tracking-wider text-white/90 uppercase">
                      <span>
                        {num(c.totalLessons, t.locale)} {t(recorded.lessons)}
                      </span>
                      <span>{hours}</span>
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col p-6 md:p-7">
                    {/* Bangla readers get the Bangla title as the headline, with the English name as the subline */}
                    <h3 className={bn ? 'font-bangla text-2xl leading-tight font-semibold' : 'font-display text-2xl leading-tight font-semibold'}>
                      {bn ? c.banglaTitle : c.title}
                    </h3>
                    <p className={bn ? 'font-display mt-1 text-sm text-muted italic' : 'font-bangla mt-1 text-sm text-muted'}>{bn ? c.title : c.banglaTitle}</p>
                    <p className="mt-4 line-clamp-3 text-[15px] leading-relaxed text-muted">{t.locale === 'bn' ? c.banglaDescription : c.description}</p>
                    <ul className="mt-5 grid gap-x-6 sm:grid-cols-2">
                      {recorded.checks.map((ch) => (
                        <li key={ch.en} className="hairline flex items-center gap-2.5 py-2.5 text-sm">
                          <Check size={15} className="shrink-0 text-mint" />
                          {t(ch)}
                        </li>
                      ))}
                    </ul>

                    {/* Price row */}
                    <div className="hairline mt-auto flex flex-wrap items-end justify-between gap-4 pt-5">
                      <div>
                        <p className="text-[11px] font-bold tracking-[0.18em] text-muted uppercase">{t(recorded.fee)}</p>
                        <p className="mt-1 flex items-baseline gap-2">
                          <span className="font-display text-3xl font-semibold text-rouge">{taka(c.offerPrice, t.locale)}</span>
                          <span className="text-sm text-muted line-through">{taka(c.regularPrice, t.locale)}</span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/recorded/${c.slug}`} className={btn('ghost', 'sm')}>
                          {t(recorded.syllabus)}
                        </Link>
                        <Link href={`/recorded/${c.slug}?enroll=1`} className={btn('rouge', 'sm')}>
                          {t(recorded.enroll)}
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* Help row */}
        <Reveal className="hairline mt-12 flex flex-col items-start justify-between gap-6 pt-8 md:flex-row md:items-center">
          <div>
            <p className="font-display text-xl font-semibold md:text-2xl">{t(recorded.helpTitle)}</p>
            <p className="mt-1 text-[15px] text-muted">{t(recorded.helpText)}</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link href="/quiz/placement-test" className={btn('rouge', 'md')}>
              {t(recorded.quizCta)}
            </Link>
            <a href={waLink(waMessage('question', t.locale))} target="_blank" rel="noopener" className={btn('ghost', 'md')}>
              <WhatsAppGlyph size={17} />
              {t(recorded.helpCta)}
              <ArrowRight size={15} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
