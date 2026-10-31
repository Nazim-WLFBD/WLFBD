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

export function QuizHub() {
  const t = useT();
  const [filter, setFilter] = useState<Filter>('all');
  // The two level tests share one question set; show it once
  const list = QUIZ_CATEGORIES.filter((q) => q.id !== 'french-level-test')
    .map((q) => ({ q, count: builtInQuestions(q.id).length }))
    .filter(({ q }) =>
      filter === 'all' ? true : filter === 'placement' ? q.isPlacementTest : filter === 'mock' ? q.isMockExam : !q.isPlacementTest && !q.isMockExam,
    )
    .sort((a, b) => Number(b.count > 0) - Number(a.count > 0));

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        {(Object.keys(FILTERS) as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={cn('rounded-full px-5 py-2.5 text-sm font-semibold transition', filter === f ? 'bg-ink text-white dark:bg-bleu' : 'border border-line hover:bg-fg/5')}
          >
            {t(FILTERS[f])}
          </button>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map(({ q, count }) => {
          const ready = count > 0;
          const body = (
            <>
              <div className="flex items-center justify-between">
                <span className={cn('flex h-11 w-11 items-center justify-center rounded-xl', q.isPlacementTest ? 'bg-gold text-ink' : 'bg-ink text-gold')}>
                  <Icon name={ICON[q.iconName] ?? 'clipboard'} size={20} />
                </span>
                <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[10px] font-bold tracking-wider">{t.locale === 'bn' && q.banglaBadgeTag ? q.banglaBadgeTag : q.badgeTag}</span>
              </div>
              <h3 className="font-display mt-5 text-xl leading-tight font-semibold">{t.locale === 'bn' ? q.banglaTitle : q.title}</h3>
              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">{t.locale === 'bn' ? q.banglaDescription : q.description}</p>
              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="flex gap-4 text-muted">
                  <span className="flex items-center gap-1.5">
                    <ListChecks size={15} /> {num(ready ? count : q.questionCount, t.locale)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={15} /> {num(q.durationMinutes, t.locale)} {t({ en: 'min', bn: 'মিনিট' })}
                  </span>
                </span>
                {ready ? (
                  <span className="flex items-center gap-1 font-bold text-rouge">
                    {t({ en: 'Start', bn: 'শুরু করুন' })} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </span>
                ) : (
                  <span className="rounded-full bg-fg/10 px-2.5 py-1 text-xs font-bold text-muted">{t({ en: 'Coming soon', bn: 'শীঘ্রই আসছে' })}</span>
                )}
              </div>
            </>
          );
          const cls = 'group flex h-full flex-col rounded-[24px] border border-line bg-surface p-6 transition';
          return ready ? (
            <Link key={q.id} href={quizHref(q.slug)} className={cn(cls, 'hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]', q.isPlacementTest && 'ring-2 ring-gold')}>
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
