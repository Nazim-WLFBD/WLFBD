'use client';

import { ArrowRight, Check, FileText, Plane, Sparkles, Users } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { PageHero } from '@/components/layout/PageHero';
import { WhatsAppGlyph } from '@/components/layout/FloatingActions';
import { COURSES_DATA } from '@/data/courses';
import { courseDetail as copy } from '@/content/course';
import { courses as cardCopy } from '@/content/home';
import { waLink } from '@/lib/brand';
import { cn, num, taka } from '@/lib/utils';
import type { Course } from '@/types';
import { Barcode, courseText, FROM_LEVEL } from './BoardingPass';

export function CourseDetail({ course: c }: { course: Course }) {
  const t = useT();
  const bn = t.locale === 'bn';
  const x = courseText(c, t.locale);
  const fee = c.isCustomPricing ? t(cardCopy.feeCustom) : taka(c.offerPrice, t.locale);
  const others = COURSES_DATA.filter((o) => o.id !== c.id);
  const waText = bn
    ? `Bonjour! আমি ${c.banglaTitle} (${c.title}) কোর্স সম্পর্কে বিস্তারিত জানতে চাই।`
    : `Bonjour! I want to know more about ${c.title}.`;

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
        <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-display text-3xl font-semibold text-gold">{fee}</span>
          {!c.isCustomPricing && <span className="text-white/45 line-through">{taka(c.regularPrice, t.locale)}</span>}
          <span className="text-sm text-white/60">
            · {x.duration} · {num(c.classCount, t.locale)} {t(copy.sessions)}
          </span>
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={{ pathname: '/enroll', query: { course: c.id } }} className={btn('rouge', 'lg')}>
            {t(copy.enroll)} <ArrowRight size={17} />
          </Link>
          <a
            href={waLink(waText)}
            target="_blank"
            rel="noopener"
            className={btn('ghost-light', 'lg')}
          >
            <WhatsAppGlyph size={18} /> {t(copy.ask)}
          </a>
        </div>
      </PageHero>

      <section className="bg-bg py-14 md:py-20">
        <div className="container-x grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-6">
            {/* Key stats */}
            <Reveal className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                [t(copy.duration), bn ? x.duration : c.duration],
                [t(copy.live), `${num(c.classCount, t.locale)} ${t(copy.sessions)}`],
                [t(copy.perWeek), x.classesPerWeek],
                [t(copy.target), x.targetClb ?? c.cefrLevel],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl border border-line bg-surface p-4">
                  <p className="text-[10px] font-bold tracking-widest text-muted uppercase">{k}</p>
                  <p className="mt-1 font-bold">{v}</p>
                </div>
              ))}
            </Reveal>

            <Reveal className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[var(--radius)] border border-line bg-surface p-6">
                <p className="flex items-center gap-2 text-sm font-bold text-rouge">
                  <Users size={16} /> {t(copy.audience)}
                </p>
                <p className="mt-2 leading-relaxed">{x.targetAudience}</p>
              </div>
              <div className="rounded-[var(--radius)] border border-line bg-surface p-6">
                <p className="flex items-center gap-2 text-sm font-bold text-rouge">
                  <Sparkles size={16} /> {t(copy.outcome)}
                </p>
                <p className="mt-2 leading-relaxed">{x.outcome}</p>
              </div>
            </Reveal>

            <Reveal className="rounded-[var(--radius)] border border-line bg-surface p-6 md:p-8">
              <h2 className="font-display text-2xl font-semibold">{t(copy.features)}</h2>
              <ul className="mt-5 grid gap-3 md:grid-cols-2">
                {x.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint/15 text-mint">
                      <Check size={14} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="rounded-[var(--radius)] border border-line bg-surface p-6 md:p-8">
              <h2 className="font-display text-2xl font-semibold">{t(copy.syllabus)}</h2>
              <ol className="mt-5 grid gap-3 md:grid-cols-2">
                {copy.modules.map((m) => (
                  <li key={m.t.en} className="rounded-2xl bg-surface-2/60 p-5">
                    <p className="font-bold">{t(m.t)}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{t(m.d)}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-5 flex gap-3 rounded-2xl border border-dashed border-gold/70 bg-gold/10 p-5">
                <FileText size={20} className="mt-0.5 shrink-0 text-gold" />
                <p className="text-sm leading-relaxed">
                  <strong>{t(copy.kitTitle)}:</strong> {t(copy.kit)}
                </p>
              </div>
            </Reveal>
          </div>

          {/* Sticky boarding pass */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-[26px] bg-ink text-white shadow-[var(--shadow-lift)]">
              <div className="p-6">
                <p className="text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">
                  {t({ en: 'Boarding pass · WLF BD', bn: 'বোর্ডিং পাস · WLF BD' })}
                </p>
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] tracking-widest text-white/50 uppercase">{t({ en: 'From', bn: 'শুরু' })}</p>
                    <p className="font-display text-4xl font-semibold text-white/50">{FROM_LEVEL[c.id]}</p>
                  </div>
                  <Plane size={20} className="mb-3 text-gold" />
                  <div className="text-right">
                    <p className="text-[10px] tracking-widest text-white/50 uppercase">{t({ en: 'To', bn: 'গন্তব্য' })}</p>
                    <p className="font-display text-4xl font-semibold">{c.isCustomPricing ? c.targetClb : c.code}</p>
                  </div>
                </div>
              </div>
              <div className="border-t-2 border-dashed border-white/15 p-6">
                <p className="text-[10px] font-bold tracking-widest text-white/50 uppercase">{t(copy.fee)}</p>
                <p className="font-display mt-1 text-4xl font-semibold text-gold">{fee}</p>
                {!c.isCustomPricing && (
                  <p className="mt-1 text-sm text-white/55">
                    <span className="line-through">{taka(c.regularPrice, t.locale)}</span> · {t(cardCopy.save)}{' '}
                    {taka(c.regularPrice - c.offerPrice, t.locale)}
                  </p>
                )}
                <Link href={{ pathname: '/enroll', query: { course: c.id } }} className={btn('rouge', 'md', 'mt-6 w-full')}>
                  {t(copy.enroll)} <ArrowRight size={16} />
                </Link>
                <Link href={{ pathname: '/', hash: 'schedule' }} className={btn('ghost-light', 'md', 'mt-2 w-full')}>
                  {t(copy.schedule)}
                </Link>
                <Barcode className="mt-6 text-white/40" />
              </div>
            </div>
            <Link
              href="/quiz/placement-test"
              className="mt-4 flex items-center justify-between rounded-2xl border border-line bg-surface p-4 text-sm transition hover:border-fg/30"
            >
              <span>
                <span className="block font-bold">{t(copy.unsure)}</span>
                <span className="text-muted">{t(copy.unsureCta)}</span>
              </span>
              <ArrowRight size={16} />
            </Link>
          </aside>
        </div>

        <div className="container-x mt-16">
          <h2 className="font-display mb-5 text-2xl font-semibold">{t(copy.others)}</h2>
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4">
            {others.map((o) => (
              <Link
                key={o.id}
                href={`/courses/${o.id}`}
                className="flex min-w-[220px] items-center gap-3 rounded-2xl border border-line bg-surface p-4 transition hover:border-fg/30"
              >
                <span className="font-display flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-sm font-bold text-white">
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
