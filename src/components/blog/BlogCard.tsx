import { CalendarDays, Clock } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { BlogCategoryKey, BlogPost } from '@/data/blog';
import { cn, num } from '@/lib/utils';
import { BlogCover } from './BlogCover';

/** Locale-resolved, body-free post summary (small enough to hand to client components). */
export interface BlogCardData {
  slug: string;
  date: string;
  readMinutes: number;
  categoryKey: BlogCategoryKey;
  category: string;
  title: string;
  excerpt: string;
  cover: BlogPost['cover'] & { text: string; alt: string };
}

export function toCardData(post: BlogPost, locale: Locale): BlogCardData {
  return {
    slug: post.slug,
    date: post.date,
    readMinutes: post.readMinutes,
    categoryKey: post.category.key,
    category: post.category[locale],
    title: post.title[locale],
    excerpt: post.excerpt[locale],
    cover: { ...post.cover, text: post.cover.label[locale], alt: post.coverAlt[locale] },
  };
}

/** e.g. "4 September 2026" / "৪ সেপ্টেম্বর, ২০২৬", always in Bangladesh time. */
export function formatPostDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale === 'bn' ? 'bn-BD' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Dhaka',
  }).format(new Date(iso));
}

export function readTimeLabel(minutes: number, locale: string) {
  return locale === 'bn' ? `${num(minutes, locale)} মিনিটের পড়া` : `${minutes} min read`;
}

export function BlogCard({
  post,
  locale,
  headingLevel = 'h2',
  className,
}: {
  post: BlogCardData;
  locale: string;
  headingLevel?: 'h2' | 'h3';
  className?: string;
}) {
  const Heading = headingLevel;
  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-[var(--radius)] border border-line bg-surface p-3 shadow-[var(--shadow-card)] transition duration-300',
        'hover:-translate-y-0.5 hover:border-fg/20 hover:shadow-[var(--shadow-lift)]',
        'has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-gold has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-bg',
        className,
      )}
    >
      <BlogCover
        theme={post.cover.theme}
        icon={post.cover.icon}
        label={post.cover.text}
        alt={post.cover.alt}
        className="transition duration-500 group-hover:brightness-[1.02]"
      />
      <div className="flex flex-1 flex-col px-2 pt-5 pb-3">
        <p className="eyebrow text-rouge">{post.category}</p>
        <Heading className={cn('mt-3 text-xl leading-snug font-semibold text-balance text-fg', locale === 'bn' ? 'font-bangla' : 'font-display')}>
          {/* stretched link: the whole card is clickable, the title stays the accessible name */}
          <Link
            href={`/blog/${post.slug}`}
            className="outline-none after:absolute after:inset-0 after:rounded-[var(--radius)] after:content-[''] focus-visible:outline-none"
          >
            {post.title}
          </Link>
        </Heading>
        <p className={cn('mt-3 mb-5 line-clamp-3 text-[15px] leading-relaxed text-muted', locale === 'bn' && 'font-bangla')}>{post.excerpt}</p>
        <p className="hairline mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-4 text-[13px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={14} aria-hidden />
            <time dateTime={post.date}>{formatPostDate(post.date, locale)}</time>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} aria-hidden />
            {readTimeLabel(post.readMinutes, locale)}
          </span>
        </p>
      </div>
    </article>
  );
}
