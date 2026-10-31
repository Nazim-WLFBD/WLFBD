import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { PageHero } from '@/components/layout/PageHero';
import { BlogExplorer } from '@/components/blog/BlogExplorer';
import { toCardData } from '@/components/blog/BlogCard';
import { BLOG_CATEGORIES, BLOG_POSTS } from '@/data/blog';
import type { L } from '@/i18n/t';
import type { Locale } from '@/i18n/routing';
import { BRAND_META, BRAND_NAME } from '@/lib/brand';

const copy = {
  eyebrow: { en: 'Blog', bn: 'ব্লগ' },
  title: { en: 'French learning guides for Bangladesh', bn: 'বাংলাদেশ থেকে ফরাসি শেখার গাইড' },
  intro: {
    en: 'Practical, honest articles on DELF, TEF Canada, TCF Canada, CRS points, studying in France and learning French well from Bangladesh.',
    bn: 'DELF, TEF Canada, TCF Canada, CRS পয়েন্ট, ফ্রান্সে পড়াশোনা এবং বাংলাদেশ থেকে ভালোভাবে ফরাসি শেখা নিয়ে বাস্তবধর্মী, সৎ লেখা।',
  },
  metaTitle: { en: 'French Learning Blog: DELF, TEF & TCF Guides', bn: 'ফরাসি শেখার ব্লগ: DELF, TEF ও TCF গাইড' },
  metaDescription: {
    en: 'Guides for Bangladeshi learners: DELF A1–B2, TEF Canada vs TCF Canada, CLB 7, CRS points for French, France’s 2026 language rules and study tips.',
    bn: 'বাংলাদেশি শিক্ষার্থীদের জন্য গাইড: DELF A1–B2, TEF Canada বনাম TCF Canada, CLB 7, ফ্রেঞ্চের CRS পয়েন্ট, ফ্রান্সের ২০২৬ ভাষা নিয়ম ও শেখার টিপস।',
  },
  all: { en: 'All', bn: 'সব' },
  filter: { en: 'Filter articles by category', bn: 'বিষয় অনুযায়ী লেখা ফিল্টার করুন' },
  empty: { en: 'No articles in this category yet.', bn: 'এই বিভাগে এখনো কোনো লেখা নেই।' },
} satisfies Record<string, L>;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = copy.metaTitle[locale];
  const description = copy.metaDescription[locale];
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/blog`, languages: { en: '/en/blog', bn: '/bn/blog', 'x-default': '/en/blog' } },
    openGraph: {
      type: 'website',
      siteName: BRAND_NAME,
      title,
      description,
      url: `/${locale}/blog`,
      locale: locale === 'bn' ? 'bn_BD' : 'en_US',
      images: [{ url: '/og.jpg', width: 1200, height: 630, alt: BRAND_NAME }],
    },
  };
}

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const base = BRAND_META.canonical;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${BRAND_NAME} — ${copy.eyebrow[locale]}`,
    description: copy.metaDescription[locale],
    url: `${base}/${locale}/blog`,
    inLanguage: locale === 'bn' ? 'bn-BD' : 'en',
    publisher: { '@type': 'Organization', name: BRAND_NAME, url: base, logo: { '@type': 'ImageObject', url: `${base}/logo.png` } },
    blogPost: BLOG_POSTS.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title[locale],
      description: p.metaDescription[locale],
      url: `${base}/${locale}/blog/${p.slug}`,
      datePublished: p.date,
      dateModified: p.updated ?? p.date,
      author: { '@type': 'Organization', name: BRAND_NAME, url: base },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\u003c') }} />
      <PageHero
        eyebrow={copy.eyebrow[locale]}
        title={copy.title[locale]}
        intro={copy.intro[locale]}
        crumbs={[{ href: '/', label: locale === 'bn' ? 'হোম' : 'Home' }, { label: copy.eyebrow[locale] }]}
      />
      <section className="bg-bg py-14 md:py-20">
        <div className="container-x">
          <BlogExplorer
            posts={BLOG_POSTS.map((p) => toCardData(p, locale))}
            categories={Object.values(BLOG_CATEGORIES).map((c) => ({ key: c.key, label: c[locale] }))}
            locale={locale}
            labels={{ all: copy.all[locale], filter: copy.filter[locale], empty: copy.empty[locale] }}
          />
        </div>
      </section>
    </>
  );
}
