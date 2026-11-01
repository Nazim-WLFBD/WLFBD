'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { Award, Check, Clock, Lock, PlayCircle, X } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { PageHero } from '@/components/layout/PageHero';
import { useAuth } from '@/components/auth/AuthContext';
import { taka, cn, num, toBnDigits } from '@/lib/utils';
import { safeEmbedUrl } from '@/lib/embed';
import type { RecordedCourse, RecordedLesson } from '@/types';
import { BkashPay } from './BkashPay';

/** Lesson length such as "42 min" in the current locale ("৪২ মিনিট" in Bangla). */
const dur = (d: string, locale: string) =>
  locale === 'bn' ? toBnDigits(d.replace(/\b(mins?|minutes?)\b/i, 'মিনিট').replace(/\b(hrs?|hours?)\b/i, 'ঘণ্টা')) : d;

const TABS = {
  curriculum: { en: 'Curriculum', bn: 'কারিকুলাম' },
  overview: { en: 'Overview', bn: 'সারসংক্ষেপ' },
  outcomes: { en: 'Outcomes', bn: 'শেখার ফলাফল' },
};

export function RecordedDetail({ course: c }: { course: RecordedCourse }) {
  const t = useT();
  const params = useSearchParams();
  const { user, profile } = useAuth();
  const [tab, setTab] = useState<'curriculum' | 'overview' | 'outcomes'>('curriculum');
  const [preview, setPreview] = useState<RecordedLesson | null>(null);
  const [pay, setPay] = useState(false);
  const enrolled = !!profile?.enrolledCourses?.includes(c.id);

  useEffect(() => {
    if (params.get('enroll') === '1' && user && !enrolled) setPay(true);
  }, [params, user, enrolled]);

  const off = Math.round(((c.regularPrice - c.offerPrice) / c.regularPrice) * 100);
  const enrollHref = `/login?next=${encodeURIComponent(`/recorded/${c.slug}?enroll=1`)}`;
  const bn = t.locale === 'bn';
  const features = bn && c.banglaFeatures?.length ? c.banglaFeatures : c.features;
  const outcomes = bn && c.banglaOutcomes?.length ? c.banglaOutcomes : c.outcomes;
  const audience = bn && c.banglaTargetAudience ? c.banglaTargetAudience : c.targetAudience;
  const hours = bn && c.banglaTotalHours ? c.banglaTotalHours : c.totalHours;

  const cta = enrolled ? (
    <Link href={`/learn/${c.slug}`} className={btn('rouge', 'lg', 'w-full')}>
      <PlayCircle size={18} /> {t({ en: 'Go to classroom', bn: 'ক্লাসরুমে যান' })}
    </Link>
  ) : user ? (
    <button onClick={() => setPay(true)} className={btn('rouge', 'lg', 'w-full')}>
      {t({ en: 'Enroll with bKash', bn: 'বিকাশে ভর্তি' })}
    </button>
  ) : (
    <Link href={enrollHref} className={btn('rouge', 'lg', 'w-full')}>
      {t({ en: 'Log in to enroll', bn: 'ভর্তি হতে লগইন করুন' })}
    </Link>
  );

  return (
    <>
      <PageHero
        eyebrow={`DELF ${c.level} · ${t({ en: 'Recorded Video Course', bn: 'রেকর্ডেড ভিডিও কোর্স' })}`}
        title={bn ? c.banglaTitle : c.title}
        intro={bn ? c.banglaDescription : c.description}
        crumbs={[{ href: '/', label: t({ en: 'Home', bn: 'হোম' }) }, { href: '/recorded', label: t({ en: 'Recorded', bn: 'রেকর্ডেড' }) }, { label: c.level }]}
      >
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/75">
          <span className="flex items-center gap-1.5">
            <PlayCircle size={16} /> {num(c.totalLessons, t.locale)}
            {t({ en: ' lessons', bn: 'টি লেসন' })} · {num(c.totalModules, t.locale)}
            {t({ en: ' modules', bn: 'টি মডিউল' })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={16} /> {hours}
          </span>
          {c.hasCertificate && (
            <span className="flex items-center gap-1.5">
              <Award size={16} /> {t({ en: 'Certificate', bn: 'সার্টিফিকেট' })}
            </span>
          )}
        </div>
        {/* Phones: price + enroll up front (the sidebar card sits below the curriculum there) */}
        <div className="mt-7 flex flex-wrap items-center gap-4 lg:hidden">
          <p className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-semibold text-gold">{taka(c.offerPrice, t.locale)}</span>
            <span className="text-white/50 line-through">{taka(c.regularPrice, t.locale)}</span>
          </p>
          <div className="min-w-[200px] flex-1">{cta}</div>
        </div>
      </PageHero>

      <section className="bg-bg py-12 md:py-16">
        <div className="container-x grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
          <div>
            {/* Underlined text tabs */}
            <div className="mb-6 flex gap-1 border-b border-line" role="tablist">
              {(['curriculum', 'overview', 'outcomes'] as const).map((k) => (
                <button
                  key={k}
                  role="tab"
                  aria-selected={tab === k}
                  onClick={() => setTab(k)}
                  className={cn(
                    'relative -mb-px min-h-11 px-3 pt-2 pb-3 text-sm font-semibold transition sm:px-5',
                    tab === k ? 'text-fg after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-rouge' : 'text-muted hover:text-fg',
                  )}
                >
                  {t(TABS[k])}
                </button>
              ))}
            </div>

            {tab === 'curriculum' && (
              <div className="flex flex-col gap-4">
                {c.modules?.map((m, mi) => (
                  <details key={m.id} open={m.order === 1} className="group card overflow-hidden">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5">
                      <span className="flex gap-4">
                        <span className="font-display pt-0.5 text-lg font-semibold text-rouge tabular-nums">{String(mi + 1).padStart(2, '0')}</span>
                        <span>
                        <span className={cn('font-display block text-lg font-semibold', bn && m.banglaTitle && 'font-bangla')}>{bn && m.banglaTitle ? m.banglaTitle : m.title}</span>
                        {!bn && m.banglaTitle && <span className="font-bangla text-sm text-muted">{m.banglaTitle}</span>}
                        {bn && m.banglaTitle && <span className="text-sm text-muted">{m.title}</span>}
                        </span>
                      </span>
                      <span className="shrink-0 text-[11px] font-bold tracking-[0.14em] text-muted uppercase">
                        {num(m.lessons.length, t.locale)}
                        {t({ en: ' lessons', bn: 'টি লেসন' })}
                      </span>
                    </summary>
                    <ul className="border-t border-line">
                      {m.lessons.map((l) => (
                        <li
                          key={l.id}
                          onClick={l.isPreview ? () => setPreview(l) : undefined}
                          className={cn('hairline flex items-start gap-3 px-4 py-3.5 text-sm first:border-t-0 sm:px-5', l.isPreview && 'cursor-pointer hover:bg-surface-2/60')}
                        >
                          {l.isPreview ? <PlayCircle size={17} className="mt-0.5 shrink-0 text-rouge" /> : <Lock size={15} className="mt-0.5 shrink-0 text-muted" />}
                          {/* Title on its own line on phones; duration + preview wrap underneath */}
                          <span className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                            <span className="flex-1">{bn && l.banglaTitle ? l.banglaTitle : l.title}</span>
                            <span className="flex items-center gap-2">
                              <span className="text-xs text-muted">{dur(l.duration, t.locale)}</span>
                              {l.isPreview && (
                                <button
                                  onClick={(e) => (e.stopPropagation(), setPreview(l))}
                                  className="-my-1 min-h-10 rounded-md bg-red-soft px-3 py-1.5 text-xs font-bold text-rouge"
                                >
                                  {t({ en: 'Free preview', bn: 'ফ্রি প্রিভিউ' })}
                                </button>
                              )}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            )}
            {tab === 'overview' && (
              <div className="card p-6 md:p-8">
                <p className="max-w-[68ch] text-[16px] leading-relaxed">{bn ? c.banglaDescription : c.description}</p>
                <p className="hairline mt-5 pt-5 text-sm leading-relaxed text-muted">
                  <strong className="eyebrow mr-2 text-rouge">{t({ en: 'Who it’s for:', bn: 'কাদের জন্য:' })}</strong> {audience}
                </p>
                <ul className="mt-5 grid gap-2.5 md:grid-cols-2">
                  {features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-sm leading-relaxed">
                      <Check size={15} strokeWidth={2.5} className="mt-1 shrink-0 text-rouge" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tab === 'outcomes' && (
              <ol className="card p-6 md:p-8">
                {outcomes.map((o, oi) => (
                  <li key={o} className="hairline flex gap-4 py-4 first:border-t-0 first:pt-0 last:pb-0">
                    <span className="font-display shrink-0 text-lg font-semibold text-rouge tabular-nums">{String(oi + 1).padStart(2, '0')}</span>
                    <span className="leading-relaxed">{o}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="card accent-top overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.thumbnail}
                alt=""
                width={800}
                height={450}
                loading="lazy"
                decoding="async"
                className="aspect-video h-auto w-full border-b border-line object-cover"
              />
              <div className="p-6">
                <p className="text-[11px] font-bold tracking-[0.14em] text-muted uppercase">{t({ en: 'One-time Fee', bn: 'এককালীন ফি' })}</p>
                <p className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="font-display text-4xl font-semibold text-fg">{taka(c.offerPrice, t.locale)}</span>
                  <span className="text-muted line-through">{taka(c.regularPrice, t.locale)}</span>
                  <span className="rounded-md bg-red-soft px-2 py-0.5 text-[11px] font-bold tracking-wider text-rouge uppercase">
                    {num(off, t.locale)}% {t({ en: 'OFF', bn: 'ছাড়' })}
                  </span>
                </p>
                <div className="hairline mt-5 pt-5">{cta}</div>
                <p className="mt-3 text-center text-xs text-muted">
                  {t({ en: 'Lifetime access · PDF notes · Certificate', bn: 'লাইফটাইম অ্যাক্সেস · PDF নোট · সার্টিফিকেট' })}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Dialog.Root open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[90] bg-ink/80" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-[91] w-[min(900px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[var(--radius)] bg-ink text-white" aria-describedby={undefined}>
            <div className="flex items-center justify-between gap-3 border-b border-white/10 p-4">
              <Dialog.Title className="font-display text-lg font-semibold">{bn && preview?.banglaTitle ? preview.banglaTitle : preview?.title}</Dialog.Title>
              <Dialog.Close aria-label={t({ en: 'Close', bn: 'বন্ধ করুন' })} className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-white/10">
                <X size={18} />
              </Dialog.Close>
            </div>
            {preview && safeEmbedUrl(preview.videoUrl) && (
              <iframe
                src={safeEmbedUrl(preview.videoUrl)!}
                title={bn && preview.banglaTitle ? preview.banglaTitle : preview.title}
                className="aspect-video w-full"
                sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            )}
            <p className="p-4 text-sm text-white/70">{bn ? preview?.banglaSummary || preview?.summary : preview?.summary}</p>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <BkashPay course={c} open={pay} onClose={() => setPay(false)} />
    </>
  );
}
