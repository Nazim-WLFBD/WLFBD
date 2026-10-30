import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { COURSES_DATA } from '@/data/courses';
import { routing, type Locale } from '@/i18n/routing';
import { BRAND_META, BRAND_NAME } from '@/lib/brand';
import { CourseDetail } from '@/components/courses/CourseDetail';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => COURSES_DATA.map((c) => ({ locale, id: c.id })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params;
  const c = COURSES_DATA.find((x) => x.id === id);
  if (!c) return {};
  const title = locale === 'bn' ? c.banglaTitle : c.title;
  return {
    title,
    description: `${c.outcome} ${c.duration} · ${c.classCount} live classes · ${c.targetClb ?? c.cefrLevel}.`,
    alternates: { canonical: `/${locale}/courses/${id}`, languages: { en: `/en/courses/${id}`, bn: `/bn/courses/${id}` } },
    openGraph: { title, description: c.outcome },
  };
}

export default async function CoursePage({ params }: { params: Promise<{ locale: Locale; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const course = COURSES_DATA.find((x) => x.id === id);
  if (!course) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.outcome,
    provider: { '@type': 'EducationalOrganization', name: BRAND_NAME, sameAs: BRAND_META.canonical },
    inLanguage: ['fr', 'bn'],
    educationalLevel: course.cefrLevel,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      courseWorkload: `${course.classCount} live classes`,
    },
    ...(course.isCustomPricing
      ? {}
      : { offers: { '@type': 'Offer', price: course.offerPrice, priceCurrency: 'BDT', category: 'Paid' } }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CourseDetail course={course} />
    </>
  );
}
