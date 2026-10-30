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
import { taka, cn } from '@/lib/utils';
import type { RecordedCourse, RecordedLesson } from '@/types';
import { BkashPay } from './BkashPay';

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
        eyebrow={`DELF ${c.level} · Recorded Video Course`}
        title={t.locale === 'bn' ? c.banglaTitle : c.title}
        intro={t.locale === 'bn' ? c.banglaDescription : c.description}
        crumbs={[{ href: '/', label: t({ en: 'Home', bn: 'হোম' }) }, { href: '/recorded', label: t({ en: 'Recorded', bn: 'রেকর্ডেড' }) }, { label: c.level }]}
      >
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/75">
          <span className="flex items-center gap-1.5">
            <PlayCircle size={16} /> {c.totalLessons} lessons · {c.totalModules} modules
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={16} /> {c.totalHours}
          </span>
          {c.hasCertificate && (
            <span className="flex items-center gap-1.5">
              <Award size={16} /> Certificate
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
        <div className="container-x grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="mb-6 grid grid-cols-3 gap-1.5 rounded-full border border-line bg-surface p-1 sm:inline-grid" role="tablist">
              {(['curriculum', 'overview', 'outcomes'] as const).map((k) => (
                <button
                  key={k}
                  role="tab"
                  aria-selected={tab === k}
                  onClick={() => setTab(k)}
                  className={cn('rounded-full px-3 py-2.5 text-sm font-semibold capitalize transition sm:px-5', tab === k ? 'bg-ink text-white dark:bg-bleu' : 'text-muted hover:text-fg')}
                >
                  {k}
                </button>
              ))}
            </div>

            {tab === 'curriculum' && (
              <div className="flex flex-col gap-4">
                {c.modules?.map((m) => (
                  <details key={m.id} open={m.order === 1} className="group overflow-hidden rounded-[22px] border border-line bg-surface">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5">
                      <span>
                        <span className="block font-bold">{m.title}</span>
                        {m.banglaTitle && <span className="font-bangla text-sm text-muted">{m.banglaTitle}</span>}
                      </span>
                      <span className="text-xs text-muted">{m.lessons.length} lessons</span>
                    </summary>
                    <ul className="border-t border-line">
                      {m.lessons.map((l) => (
                        <li
                          key={l.id}
                          onClick={l.isPreview ? () => setPreview(l) : undefined}
                          className={cn('flex items-start gap-3 border-b border-line px-4 py-3.5 text-sm last:border-0 sm:px-5', l.isPreview && 'cursor-pointer hover:bg-rouge/[.04]')}
                        >
                          {l.isPreview ? <PlayCircle size={17} className="mt-0.5 shrink-0 text-rouge" /> : <Lock size={15} className="mt-0.5 shrink-0 text-muted" />}
                          {/* Title on its own line on phones; duration + preview wrap underneath */}
                          <span className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                            <span className="flex-1">{t.locale === 'bn' && l.banglaTitle ? l.banglaTitle : l.title}</span>
                            <span className="flex items-center gap-2">
                              <span className="text-xs text-muted">{l.duration}</span>
                              {l.isPreview && (
                                <button
                                  onClick={(e) => (e.stopPropagation(), setPreview(l))}
                                  className="rounded-full bg-rouge/10 px-3 py-1.5 text-xs font-bold text-rouge"
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
              <div className="rounded-[22px] border border-line bg-surface p-6">
                <p className="leading-relaxed">{t.locale === 'bn' ? c.banglaDescription : c.description}</p>
                <p className="mt-4 text-sm text-muted">
                  <strong className="text-fg">Who it’s for:</strong> {c.targetAudience}
                </p>
                <ul className="mt-5 grid gap-2.5 md:grid-cols-2">
                  {c.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm">
                      <Check size={16} className="mt-0.5 shrink-0 text-mint" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tab === 'outcomes' && (
              <ul className="flex flex-col gap-3 rounded-[22px] border border-line bg-surface p-6">
                {c.outcomes.map((o) => (
                  <li key={o} className="flex gap-3">
                    <Check size={18} className="mt-0.5 shrink-0 text-mint" /> {o}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-[26px] border border-line bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.thumbnail} alt="" className="aspect-video w-full object-cover" />
              <div className="p-6">
                <p className="text-[11px] font-bold tracking-wider text-muted uppercase">{t({ en: 'One-time Fee', bn: 'এককালীন ফি' })}</p>
                <p className="flex items-baseline gap-2">
                  <span className="font-display text-4xl font-semibold text-rouge">{taka(c.offerPrice, t.locale)}</span>
                  <span className="text-muted line-through">{taka(c.regularPrice, t.locale)}</span>
                  <span className="rounded-full bg-rouge px-2 py-0.5 text-xs font-bold text-white">{off}% OFF</span>
                </p>
                <div className="mt-5">{cta}</div>
                <p className="mt-3 text-center text-xs text-muted">Lifetime access · PDF notes · Certificate</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Dialog.Root open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[90] bg-ink/80 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 z-[91] w-[min(900px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-ink text-white" aria-describedby={undefined}>
            <div className="flex items-center justify-between gap-3 p-4">
              <Dialog.Title className="font-semibold">{preview?.title}</Dialog.Title>
              <Dialog.Close aria-label="Close" className="rounded-full p-2 hover:bg-white/10">
                <X size={18} />
              </Dialog.Close>
            </div>
            {preview && (
              <iframe src={preview.videoUrl} title={preview.title} className="aspect-video w-full" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
            )}
            <p className="p-4 text-sm text-white/70">{t.locale === 'bn' ? preview?.banglaSummary : preview?.summary}</p>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <BkashPay course={c} open={pay} onClose={() => setPay(false)} />
    </>
  );
}
