'use client';

import Image from 'next/image';
import { ArrowRight, CheckCircle2, PlayCircle, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { recorded } from '@/content/home';
import { waLink, waMessage } from '@/lib/brand';
import { num, taka } from '@/lib/utils';
import type { RecordedCourse } from '@/types';
import { WhatsAppGlyph } from '@/components/layout/FloatingActions';

export function RecordedTeaser({ courses }: { courses: RecordedCourse[] }) {
  const t = useT();

  return (
    <section id="recorded-courses" className="relative bg-surface-2/50 py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          tag={t(recorded.badge)}
          title={
            <>
              {t(recorded.titleA)}
              <span className="text-rouge italic">{t(recorded.titleB)}</span>
              {t(recorded.titleC)}
            </>
          }
          intro={t(recorded.intro)}
        />

        <Reveal className="mb-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {recorded.benefits.map((b) => (
            <div key={b.t.en} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink text-gold">
                <Icon name={b.icon} size={18} />
              </span>
              <span>
                <span className="block text-sm font-bold">{t(b.t)}</span>
                <span className="block text-xs text-muted">{t(b.s)}</span>
              </span>
            </div>
          ))}
        </Reveal>

        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((c, i) => {
            const off = Math.round(((c.regularPrice - c.offerPrice) / c.regularPrice) * 100);
            const bn = t.locale === 'bn';
            const hours = bn && c.banglaTotalHours ? c.banglaTotalHours.split(' ')[0] : num(c.totalHours.split(' ')[0], t.locale);
            return (
              <Reveal key={c.id} delay={i * 0.1}>
                <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-line bg-surface transition duration-500 hover:shadow-[var(--shadow-lift)]">
                  <Link href={`/recorded/${c.slug}`} className="relative block aspect-[16/9] overflow-hidden bg-ink">
                    <Image
                      src={c.thumbnail}
                      alt={bn ? c.banglaTitle : c.title}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold text-ink">DELF {c.level}</span>
                      <span className="rounded-full bg-ink/70 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
                        {t(recorded.tagRecorded)}
                      </span>
                      <span className="rounded-full bg-rouge px-2.5 py-1 text-[11px] font-extrabold text-white">
                        {num(off, t.locale)}% {t(recorded.off)}
                      </span>
                    </div>
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-sm font-bold text-ink shadow-xl transition group-hover:scale-105">
                        <PlayCircle size={18} className="text-rouge" />
                        {t(recorded.preview)}
                      </span>
                    </span>
                    <div className="absolute right-4 bottom-4 left-4 flex justify-between text-xs font-bold text-white">
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
                    <p className={bn ? 'font-display mt-1 text-sm text-muted' : 'font-bangla mt-1 text-sm text-muted'}>{bn ? c.title : c.banglaTitle}</p>
                    <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-muted">
                      {t.locale === 'bn' ? c.banglaDescription : c.description}
                    </p>
                    <ul className="mt-5 space-y-2">
                      {recorded.checks.map((ch) => (
                        <li key={ch.en} className="flex items-center gap-2.5 text-sm">
                          <CheckCircle2 size={16} className="shrink-0 text-mint" />
                          {t(ch)}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
                      <div>
                        <p className="text-[11px] font-bold tracking-wider text-muted uppercase">{t(recorded.fee)}</p>
                        <p className="flex items-baseline gap-2">
                          <span className="font-display text-3xl font-semibold text-rouge">{taka(c.offerPrice, t.locale)}</span>
                          <span className="text-muted line-through">{taka(c.regularPrice, t.locale)}</span>
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

        <Reveal className="mt-8 flex flex-col items-start justify-between gap-5 rounded-[var(--radius)] bg-ink p-6 text-white md:flex-row md:items-center md:p-7">
          <div>
            <p className="font-display text-xl font-semibold">{t(recorded.helpTitle)}</p>
            <p className="mt-1 text-sm text-white/65">{t(recorded.helpText)}</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link href="/quiz/placement-test" className={btn('gold', 'md')}>
              <Sparkles size={16} />
              {t(recorded.quizCta)}
            </Link>
            <a href={waLink(waMessage('question', t.locale))} target="_blank" rel="noopener" className={btn('ghost-light', 'md')}>
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
