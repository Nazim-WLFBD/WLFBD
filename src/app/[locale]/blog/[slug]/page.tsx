import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowRight, CalendarDays, ChevronDown, Clock, PenLine, RefreshCw } from 'lucide-react';
import { PageHero } from '@/components/layout/PageHero';
import { BlogCover } from '@/components/blog/BlogCover';
import { BlogCard, formatPostDate, readTimeLabel, toCardData } from '@/components/blog/BlogCard';
import { BlogFaq } from '@/components/blog/BlogFaq';
import { PostBody } from '@/components/blog/PostBody';
import { Toc } from '@/components/blog/Toc';
import { btn } from '@/components/ui/Button';
import { BLOG_POSTS, getPost, postHeadings, relatedPosts, stripInline } from '@/data/blog';
import { Link } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { BRAND_META, BRAND_NAME } from '@/lib/brand';
import { cn } from '@/lib/utils';

type P = { params: Promise<{ locale: Locale; slug: string }> };

const ui = {
  home: { en: 'Home', bn: 'হোম' },
  blog: { en: 'Blog', bn: 'ব্লগ' },
  toc: { en: 'On this page', bn: 'এই লেখায়' },
  faq: { en: 'Frequently asked questions', bn: 'সচরাচর জিজ্ঞাসিত প্রশ্ন' },
  related: { en: 'Keep reading', bn: 'আরও পড়ুন' },
  allPosts: { en: 'All articles', bn: 'সব লেখা' },
  updated: { en: 'Updated', bn: 'হালনাগাদ' },
  by: { en: 'By', bn: 'লিখেছে' },
  tags: { en: 'Tags', bn: 'ট্যাগ' },
  sideTitle: { en: 'Not sure of your level?', bn: 'আপনার লেভেল নিয়ে নিশ্চিত নন?' },
  sideText: {
    en: 'Take the free online level test and get a clear starting point.',
    bn: 'বিনামূল্যে অনলাইন লেভেল টেস্ট দিন, শুরু করার সঠিক জায়গা জেনে নিন।',
  },
  sideCta: { en: 'Free level test', bn: 'ফ্রি লেভেল টেস্ট' },
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => BLOG_POSTS.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const title = post.metaTitle[locale];
  const description = post.metaDescription[locale];
  const path = `/blog/${slug}`;
  return {
    title: { absolute: title },
    description,
    keywords: post.tags,
    authors: [{ name: BRAND_NAME, url: BRAND_META.canonical }],
    alternates: {
      canonical: `/${locale}${path}`,
      languages: { en: `/en${path}`, bn: `/bn${path}`, 'x-default': `/en${path}` },
    },
    openGraph: {
      type: 'article',
      siteName: BRAND_NAME,
      title,
      description,
      url: `/${locale}${path}`,
      locale: locale === 'bn' ? 'bn_BD' : 'en_US',
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      authors: [BRAND_NAME],
      section: post.category[locale],
      tags: post.tags,
      images: [{ url: '/og.jpg', width: 1200, height: 630, alt: post.title[locale] }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/og.jpg'] },
  };
}

export default async function BlogPostPage({ params }: P) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = getPost(slug);
  if (!post) notFound();

  const bn = locale === 'bn';
  const base = BRAND_META.canonical;
  const url = `${base}/${locale}/blog/${post.slug}`;
  const body = post.body[locale];
  const faq = post.faq?.map((f) => ({ q: f.q[locale], a: f.a[locale] })) ?? [];
  const headings = postHeadings(body);
  const toc = faq.length ? [...headings, { id: 'faq', text: ui.faq[locale] }] : headings;
  const related = relatedPosts(post.slug, 3);
  const title = post.title[locale];
  const shortTitle = title.length > 42 ? `${title.slice(0, 40).trimEnd()}…` : title;
  const headingFont = bn ? 'font-bangla font-bold' : 'font-display font-semibold';
  const org = {
    '@type': 'Organization',
    name: BRAND_NAME,
    url: base,
    logo: { '@type': 'ImageObject', url: `${base}/logo.png` },
  };

  const jsonLd: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: post.metaDescription[locale],
      datePublished: post.date,
      dateModified: post.updated ?? post.date,
      inLanguage: bn ? 'bn-BD' : 'en',
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      url,
      image: `${base}/og.jpg`,
      articleSection: post.category[locale],
      keywords: post.tags.join(', '),
      author: org,
      publisher: org,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: ui.home[locale], item: `${base}/${locale}` },
        { '@type': 'ListItem', position: 2, name: ui.blog[locale], item: `${base}/${locale}/blog` },
        { '@type': 'ListItem', position: 3, name: title, item: url },
      ],
    },
  ];
  if (faq.length)
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: bn ? 'bn-BD' : 'en',
      mainEntity: faq.map((f) => ({
        '@type': 'Question',
        name: stripInline(f.q),
        acceptedAnswer: { '@type': 'Answer', text: stripInline(f.a) },
      })),
    });

  return (
    <>
      {jsonLd.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, '\\u003c') }}
        />
      ))}

      <article>
        <PageHero
          eyebrow={post.category[locale]}
          title={title}
          intro={post.excerpt[locale]}
          crumbs={[{ href: '/', label: ui.home[locale] }, { href: '/blog', label: ui.blog[locale] }, { label: shortTitle }]}
          className="pb-28 md:pb-36"
        >
          <p className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={15} aria-hidden />
              <time dateTime={post.date}>{formatPostDate(post.date, locale)}</time>
            </span>
            {post.updated && (
              <span className="inline-flex items-center gap-1.5">
                <RefreshCw size={14} aria-hidden />
                {ui.updated[locale]} <time dateTime={post.updated}>{formatPostDate(post.updated, locale)}</time>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Clock size={15} aria-hidden />
              {readTimeLabel(post.readMinutes, locale)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <PenLine size={15} aria-hidden />
              {ui.by[locale]} {BRAND_NAME}
            </span>
          </p>
        </PageHero>

        <div className="bg-bg">
          <div className="container-x relative -mt-20 md:-mt-28 xl:max-w-[1120px]">
            <BlogCover
              theme={post.cover.theme}
              icon={post.cover.icon}
              label={post.cover.label[locale]}
              alt={post.coverAlt[locale]}
              size="hero"
              className="shadow-[var(--shadow-lift)]"
            />
          </div>

          <div className="container-x grid gap-10 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-16 xl:max-w-[1120px]">
            <div className="max-w-[70ch] min-w-0">
              {toc.length >= 2 && (
                <details className="group mb-8 rounded-2xl border border-line bg-surface px-5 py-2 lg:hidden">
                  {/* display:flex drops the native disclosure triangle, so draw our own */}
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-fg">
                    {ui.toc[locale]}
                    <ChevronDown size={18} aria-hidden className="shrink-0 text-muted transition-transform group-open:rotate-180" />
                  </summary>
                  <Toc items={toc} title={ui.toc[locale]} bn={bn} className="mt-2 pb-3 [&>p]:hidden" />
                </details>
              )}

              <PostBody blocks={body} locale={locale} />

              {faq.length > 0 && (
                <section aria-labelledby="faq" className="mt-14">
                  <h2 id="faq" className={cn('mb-6 scroll-mt-28 text-[1.75rem] leading-tight text-fg md:text-[2rem]', headingFont)}>
                    {ui.faq[locale]}
                  </h2>
                  <BlogFaq items={faq} bn={bn} />
                </section>
              )}

              {post.tags.length > 0 && (
                <ul className="mt-12 flex flex-wrap gap-2" aria-label={ui.tags[locale]}>
                  {post.tags.map((t) => (
                    <li key={t} className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted">
                      #{t}
                    </li>
                  ))}
                </ul>
              )}

              {/* Phones/tablets: the sidebar CTA (hidden below lg) appears as an inline card after the article */}
              <SideCta locale={locale} bn={bn} className="mt-12 lg:hidden" />
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-28 flex flex-col gap-8">
                <Toc items={toc} title={ui.toc[locale]} bn={bn} />
                <SideCta locale={locale} bn={bn} />
              </div>
            </aside>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related" className="border-t border-line bg-surface-2/50 py-14 md:py-20">
          <div className="container-x">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <h2 id="related" className={cn('text-[1.9rem] leading-tight text-fg md:text-[2.4rem]', headingFont)}>
                {ui.related[locale]}
              </h2>
              <Link href="/blog" className={btn('ghost', 'sm')}>
                {ui.allPosts[locale]}
                <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <BlogCard post={toCardData(p, locale)} locale={locale} headingLevel="h3" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}

/** "Not sure of your level?" card: in the desktop sidebar, and inline after the article below lg. */
function SideCta({ locale, bn, className }: { locale: Locale; bn: boolean; className?: string }) {
  const headingFont = bn ? 'font-bangla font-bold' : 'font-display font-semibold';
  return (
    <div className={cn('rounded-[20px] bg-ink p-5 text-white dark:ring-1 dark:ring-white/10', className)}>
      <p className={cn('text-lg leading-snug', headingFont)}>{ui.sideTitle[locale]}</p>
      <p className={cn('mt-2 text-sm leading-relaxed text-white/70', bn && 'font-bangla')}>{ui.sideText[locale]}</p>
      <Link href="/quiz/placement-test" className={btn('gold', 'sm', 'mt-4')}>
        {ui.sideCta[locale]}
        <ArrowRight size={14} aria-hidden />
      </Link>
    </div>
  );
}
