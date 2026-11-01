'use client';

import { ArrowRight, Check, FileText } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { PageHero } from '@/components/layout/PageHero';
import { WhatsAppGlyph } from '@/components/layout/FloatingActions';
import { useCourses } from '@/components/CoursesProvider';
import { courseDetail as copy } from '@/content/course';
import { courses as cardCopy } from '@/content/home';
import { waLink } from '@/lib/brand';
import { cn, num, taka } from '@/lib/utils';
import type { Course } from '@/types';
import { courseText, FROM_LEVEL } from './BoardingPass';

export function CourseDetail({ course: c }: { course: Course }) {
  const t = useT();
  const bn = t.locale === 'bn';
  const x = courseText(c, t.locale);
  const fee = c.isCustomPricing ? t(cardCopy.feeCustom) : taka(c.offerPrice, t.locale);
  const others = useCourses().courses.filter((o) => o.id !== c.id);
  const waText = bn
    ? `Bonjour! আমি ${c.banglaTitle} (${c.title}) কোর্স সম্পর্কে বিস্তারিত জানতে চাই।`
    : `Bonjour! I want to know more about ${c.title}.`;
  const to = c.isCustomPricing && !c.whatsappOnly ? c.targetClb : c.code;

  return (
    <>
      <PageHero
        eyebrow={x.tag}
        title={x.title}
        intro={<span className={cn(!bn && 'font-bangla')}>{x.altTitle}</span>}
        crumbs={[
          { href: '/', label: t(copy.home) },
          { href: '/courses', label: t(copy.courses) },
          { label: c.code },
        ]}
      >
        {/* Price line: separators sit between meta items only, so a wrapped line never starts with "·" */}
        <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className={cn('font-display font-semibold text-gold', c.isCustomPricing ? 'text-2xl' : 'text-3xl')}>{fee}</span>
          {!c.isCustomPricing && <span className="text-white/45 line-through">{taka(c.regularPrice, t.locale)}</span>}
          <span className="flex flex-wrap items-baseline gap-x-2 text-sm text-white/60">
            <span>{x.duration}</span>
            {!c.whatsappOnly && (
              <>
                <span aria-hidden>·</span>
                <span>
                  {num(c.classCount, t.locale)} {t(copy.sessions)}
                </span>
              </>
            )}
          </span>
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {c.whatsappOnly ? (
            <>
              {/* One WhatsApp CTA only; the secondary action books a free class instead */}
              <a href={waLink(t(c.whatsappMessage!))} target="_blank" rel="noopener" className={btn('rouge', 'lg')}>
                <WhatsAppGlyph size={18} /> {t({ en: 'Contact via WhatsApp', bn: 'WhatsApp-এ যোগাযোগ করুন' })}
              </a>
              <Link href="/free-class" className={btn('ghost-light', 'lg')}>
                {t(copy.freeClass)} <ArrowRight size={17} />
              </Link>
            </>
          ) : (
            <>
              <Link href={{ pathname: '/enroll', query: { course: c.id } }} className={btn('rouge', 'lg')}>
                {t(copy.enroll)} <ArrowRight size={17} />
              </Link>
              <a href={waLink(waText)} target="_blank" rel="noopener" className={btn('ghost-light', 'lg')}>
                <WhatsAppGlyph size={18} /> {t(copy.ask)}
              </a>
            </>
          )}
        </div>
      </PageHero>

      <section className="bg-bg py-14 md:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14">
          <div className="flex flex-col gap-12">
            {/* Key stats: a hairline row rather than four boxes */}
            <Reveal>
              <dl className="grid grid-cols-2 gap-y-6 border-y border-line py-6 md:grid-cols-4">
                {[
                  [t(copy.duration), bn ? x.duration : c.duration],
                  [t(copy.live), c.whatsappOnly ? t({ en: 'Flexible', bn: 'ফ্লেক্সিবল' }) : `${num(c.classCount, t.locale)} ${t(copy.sessions)}`],
                  [t(copy.perWeek), x.classesPerWeek],
                  [t(copy.target), x.targetClb ?? c.cefrLevel],
                ].map(([k, v], i) => (
                  <div key={k} className={cn('px-4', i > 0 && 'border-l border-line', i === 2 && 'md:border-l max-md:border-l-0')}>
                    <dt className="text-[11px] font-bold tracking-[0.14em] text-muted uppercase">{k}</dt>
                    <dd className="font-display mt-1.5 text-lg font-semibold text-fg">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            {/* Audience / outcome: editorial two-column */}
            <Reveal className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="eyebrow text-rouge">{t(copy.audience)}</p>
                <p className="mt-4 text-[17px] leading-relaxed text-fg">{x.targetAudience}</p>
              </div>
              <div>
                <p className="eyebrow text-rouge">{t(copy.outcome)}</p>
                <p className="mt-4 text-[17px] leading-relaxed text-fg">{x.outcome}</p>
              </div>
            </Reveal>

            {/* Features */}
            <Reveal>
              <div className="flex items-baseline gap-4 border-t border-line pt-5">
                <span className="section-num">01</span>
                <h2 className="font-display text-2xl font-semibold">{t(copy.features)}</h2>
              </div>
              <ul className="mt-6 grid gap-x-10 gap-y-3 md:grid-cols-2">
                {x.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[15px] leading-relaxed">
                    <Check size={15} strokeWidth={2.5} className="mt-[5px] shrink-0 text-rouge" />
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Modules as a numbered hairline list */}
            <Reveal>
              <div className="flex items-baseline gap-4 border-t border-line pt-5">
                <span className="section-num">02</span>
                <h2 className="font-display text-2xl font-semibold">{t(c.whatsappOnly ? copy.oneToOneSyllabus : copy.syllabus)}</h2>
              </div>
              <ol className="mt-4">
                {(c.whatsappOnly ? copy.oneToOneModules : copy.modules).map((m, i) => (
                  <li key={m.t.en} className="hairline grid grid-cols-[2.75rem_1fr] gap-x-2 py-5 first:border-t-0">
                    <span className="font-display pt-0.5 text-lg font-semibold text-rouge tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      {/* the 01/02 column already numbers the list: drop the "1." prefix the copy carries */}
                      <p className="font-display text-lg font-semibold text-fg">{t(m.t).replace(/^[\d০-৯]+\.\s*/, '')}</p>
                      <p className="mt-1 text-[15px] leading-relaxed text-muted">{t(m.d)}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-6 flex gap-4 rounded-[var(--radius)] bg-surface-2 p-5 md:p-6">
                <FileText size={20} className="mt-0.5 shrink-0 text-rouge" />
                <p className="text-[15px] leading-relaxed">
                  <strong className="font-display text-base font-semibold">{t(copy.kitTitle)}.</strong> {t(copy.kit)}
                </p>
              </div>
            </Reveal>
          </div>

          {/* Sticky price card */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="card accent-top overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-md bg-red-soft px-2.5 py-1 text-[11px] font-bold tracking-[0.14em] text-rouge uppercase">
                    {FROM_LEVEL[c.id]}
                    <span aria-hidden className="text-rouge/50">→</span>
                    {to}
                  </span>
                  <span className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">{c.code}</span>
                </div>
                <p className="mt-6 text-[11px] font-bold tracking-[0.14em] text-muted uppercase">{t(copy.fee)}</p>
                <p className={cn('font-display mt-1 font-semibold text-fg', c.isCustomPricing ? 'text-2xl' : 'text-4xl')}>{fee}</p>
                {!c.isCustomPricing && (
                  <p className="mt-1 text-sm text-muted">
                    <span className="line-through">{taka(c.regularPrice, t.locale)}</span> · <span className="font-semibold text-mint">{t(cardCopy.save)}{' '}
                    {taka(c.regularPrice - c.offerPrice, t.locale)}</span>
                  </p>
                )}
                <dl className="hairline mt-5 divide-y divide-line text-sm">
                  <div className="flex justify-between gap-3 py-2.5">
                    <dt className="text-muted">{t(copy.duration)}</dt>
                    <dd className="font-semibold">{x.duration}</dd>
                  </div>
                  <div className="flex justify-between gap-3 py-2.5">
                    <dt className="text-muted">{t(copy.perWeek)}</dt>
                    <dd className="font-semibold">{x.classesPerWeek}</dd>
                  </div>
                </dl>
                {c.whatsappOnly ? (
                  <>
                    <a href={waLink(t(c.whatsappMessage!))} target="_blank" rel="noopener" className={btn('rouge', 'md', 'mt-6 w-full')}>
                      <WhatsAppGlyph size={18} /> {t({ en: 'Contact via WhatsApp', bn: 'WhatsApp-এ যোগাযোগ করুন' })}
                    </a>
                    <Link href="/free-class" className={btn('ghost', 'md', 'mt-2 w-full')}>
                      {t(copy.freeClass)}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href={{ pathname: '/enroll', query: { course: c.id } }} className={btn('rouge', 'md', 'mt-6 w-full')}>
                      {t(copy.enroll)} <ArrowRight size={16} />
                    </Link>
                    <Link href={{ pathname: '/', hash: 'schedule' }} className={btn('ghost', 'md', 'mt-2 w-full')}>
                      {t(copy.schedule)}
                    </Link>
                  </>
                )}
              </div>
            </div>
            <Link
              href="/quiz/placement-test"
              className="mt-4 flex items-center justify-between rounded-[var(--radius)] border border-line bg-surface p-4 text-sm transition hover:border-fg/30"
            >
              <span>
                <span className="font-display block text-base font-semibold">{t(copy.unsure)}</span>
                <span className="text-muted">{t(copy.unsureCta)}</span>
              </span>
              <ArrowRight size={16} className="shrink-0 text-rouge" />
            </Link>
          </aside>
        </div>

        <div className="container-x mt-20">
          <div className="mb-6 flex items-baseline gap-4 border-t border-line pt-5">
            <span className="section-num">03</span>
            <h2 className="font-display text-2xl font-semibold">{t(copy.others)}</h2>
          </div>
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4">
            {others.map((o) => (
              <Link
                key={o.id}
                href={`/courses/${o.id}`}
                className="flex min-w-[220px] items-center gap-3 rounded-[var(--radius)] border border-line bg-surface p-4 transition hover:border-fg/30"
              >
                <span className="font-display flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-ink text-sm font-semibold text-white">
                  {o.code}
                </span>
                <span className="text-sm leading-tight font-semibold">{bn ? o.banglaTitle : o.title.split(' - ')[0]}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
