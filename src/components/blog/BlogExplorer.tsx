'use client';

import { useMemo, useState } from 'react';
import type { BlogCategoryKey } from '@/data/blog';
import { cn, num } from '@/lib/utils';
import { BlogCard, type BlogCardData } from './BlogCard';

type Filter = 'all' | BlogCategoryKey;

interface Props {
  posts: BlogCardData[];
  categories: { key: BlogCategoryKey; label: string }[];
  locale: string;
  labels: { all: string; filter: string; empty: string };
}

/** Category filter + responsive card grid for the blog index. */
export function BlogExplorer({ posts, categories, locale, labels }: Props) {
  const [filter, setFilter] = useState<Filter>('all');
  const list = useMemo(() => (filter === 'all' ? posts : posts.filter((p) => p.categoryKey === filter)), [posts, filter]);
  // only offer categories that actually have posts
  const cats = categories.filter((c) => posts.some((p) => p.categoryKey === c.key));
  const options: { key: Filter; label: string }[] = [{ key: 'all', label: labels.all }, ...cats];

  return (
    <div>
      <div className="flex flex-col gap-2 border-b border-line sm:flex-row sm:items-end sm:justify-between">
        <div role="group" aria-label={labels.filter} className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0 [&>button]:shrink-0 [&>button]:whitespace-nowrap">
          {options.map((o) => (
            <button
              key={o.key}
              type="button"
              onClick={() => setFilter(o.key)}
              aria-pressed={filter === o.key}
              className={cn(
                'relative -mb-px min-h-11 px-4 pt-2 pb-3 text-sm font-semibold transition',
                filter === o.key ? 'text-fg after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-rouge' : 'text-muted hover:text-fg',
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
        <p className="pb-3 text-[11px] font-bold tracking-[0.14em] text-muted uppercase" aria-live="polite">
          {locale === 'bn' ? `${num(list.length, locale)}টি লেখা` : `${list.length} ${list.length === 1 ? 'article' : 'articles'}`}
        </p>
      </div>

      {list.length > 0 ? (
        <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <li key={p.slug}>
              <BlogCard post={p} locale={locale} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 rounded-[var(--radius)] bg-surface-2 p-8 text-center text-muted">{labels.empty}</p>
      )}
    </div>
  );
}
