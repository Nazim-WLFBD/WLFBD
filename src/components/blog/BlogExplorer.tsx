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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label={labels.filter} className="flex flex-wrap gap-2">
          {options.map((o) => (
            <button
              key={o.key}
              type="button"
              onClick={() => setFilter(o.key)}
              aria-pressed={filter === o.key}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-semibold transition',
                filter === o.key ? 'bg-ink text-white dark:bg-white dark:text-ink' : 'border border-line text-fg hover:bg-fg/5',
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted" aria-live="polite">
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
        <p className="mt-8 rounded-2xl border border-dashed border-line p-8 text-center text-muted">{labels.empty}</p>
      )}
    </div>
  );
}
