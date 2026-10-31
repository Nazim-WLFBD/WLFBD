'use client';

import { useState } from 'react';
import { ArrowRight, Clock, ListChecks } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { Icon } from '@/components/ui/Icon';
import { QUIZ_CATEGORIES } from '@/data/quizData';
import { builtInQuestions } from '@/lib/quizScoring';
import { quizHref } from '@/lib/quiz';
import { cn, num } from '@/lib/utils';

type Filter = 'all' | 'placement' | 'mock' | 'practice';
const ICON: Record<string, string> = { BookOpen: 'book', GraduationCap: 'cap', Compass: 'compass' };

const FILTERS: Record<Filter, { en: string; bn: string }> = {
  all: { en: 'All tests', bn: 'সব টেস্ট' },
  placement: { en: 'Level test', bn: 'লেভেল টেস্ট' },
  mock: { en: 'Mock exams', bn: 'মক এক্সাম' },
  practice: { en: 'Practice & challenges', bn: 'প্র্যাকটিস ও চ্যালেঞ্জ' },
};

/** The placement test is the recommended first step, so it is pinned as the featured card. */
const isFeatured = (q: (typeof QUIZ_CATEGORIES)[number]) => q.slug === 'placement-test' || /RECOMMENDED/i.test(q.badgeTag ?? '');

/** Quizzes with only a handful of questions are shown as a "Sample" rather than hidden. */
const SAMPLE_MAX = 4;

export function QuizHub() {
  const t = useT();
  const [filter, setFilter] = useState<Filter>('all');
  // The two level tests share one question set; show it once
  const list = QUIZ_CATEGORIES.filter((q) => q.id !== 'french-level-test')
    .map((q) => ({ q, count: builtInQuestions(q.id).length, featured: isFeatured(q) }))
    .filter(({ q }) =>
      filter === 'all' ? true : filter === 'placement' ? q.isPlacementTest : filter === 'mock' ? q.isMockExam : !q.isPlacementTest && !q.isMockExam,
    )
    // Featured first, then anything playable, then "coming soon"
    .sort((a, b) => Number(b.featured) - Number(a.featured) || Number(b.count > 0) - Number(a.count > 0));

  return (
    <>
      {/* Underlined text tabs */}
      <div className="no-scrollbar -mx-4 mb-10 flex gap-1 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0 [&>button]:shrink-0 [&>button]:whitespace-nowrap">
        {(Object.keys(FILTERS) as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={cn(
              'relative -mb-px min-h-11 px-4 pt-2 pb-3 text-sm font-semibold transition',
              filter === f ? 'text-fg after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-rouge' : 'text-muted hover:text-fg',
            )}
          >
            {t(FILTERS[f])}
          </button>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map(({ q, count, featured }, idx) => {
          const ready = count > 0;
          const sample = ready && count <= SAMPLE_MAX;
          const body = (
            <>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-3">
                  <span className={cn('flex h-10 w-10 items-center justify-center rounded-lg', q.isPlacementTest ? 'bg-rouge text-white' : 'bg-ink text-white')}>
                    <Icon name={ICON[q.iconName] ?? 'clipboard'} size={18} />
                  </span>
                  <span className="section-num">{String(idx + 1).padStart(2, '0')}</span>
                </span>
                <span className={cn('text-right text-[11px] font-bold tracking-[0.14em] uppercase', featured ? 'text-rouge' : 'text-muted')}>
                  {t.locale === 'bn' && q.banglaBadgeTag ? q.banglaBadgeTag : q.badgeTag}
                </span>
              </div>
              <h3 className={cn('font-display mt-5 leading-tight font-semibold', featured ? 'text-2xl md:text-3xl' : 'text-xl')}>
                {t.locale === 'bn' ? q.banglaTitle : q.title}
              </h3>
              <p className={cn('mt-2 flex-1 text-sm leading-relaxed text-muted', !featured && 'line-clamp-3')}>{t.locale === 'bn' ? q.banglaDescription : q.description}</p>
              <div className="hairline mt-5 flex items-center justify-between pt-4 text-sm">
                <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted">
                  <span className="flex items-center gap-1.5">
                    <ListChecks size={15} /> {num(ready ? count : q.questionCount, t.locale)}
                  </span>
                  {sample && (
                    <span className="rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-bold tracking-[0.14em] text-fg uppercase">{t({ en: 'Sample', bn: 'নমুনা' })}</span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Clock size={15} /> {num(q.durationMinutes, t.locale)} {t({ en: 'min', bn: 'মিনিট' })}
                  </span>
                </span>
                {ready ? (
                  <span className="flex items-center gap-1 font-bold text-rouge">
                    {t({ en: 'Start', bn: 'শুরু করুন' })} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </span>
                ) : (
                  <span className="text-[11px] font-bold tracking-[0.14em] text-muted uppercase">{t({ en: 'Coming soon', bn: 'শীঘ্রই আসছে' })}</span>
                )}
              </div>
            </>
          );
          const cls = cn('group card flex h-full flex-col p-6 transition', featured && 'border-rouge/50 md:col-span-2 md:p-8 xl:col-span-3');
          return ready ? (
            <Link key={q.id} href={quizHref(q.slug)} className={cn(cls, 'hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]', q.isPlacementTest && 'accent-top')}>
              {body}
            </Link>
          ) : (
            <div key={q.id} className={cn(cls, 'opacity-60')}>
              {body}
            </div>
          );
        })}
      </div>
    </>
  );
}
