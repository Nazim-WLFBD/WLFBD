import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { COURSES_DATA } from '@/data/courses';
import { getCourses } from '@/lib/content';
import { routing, type Locale } from '@/i18n/routing';
import { BRAND_META, BRAND_NAME } from '@/lib/brand';
import { toBnDigits } from '@/lib/utils';
import { CourseDetail } from '@/components/courses/CourseDetail';

export async function generateStaticParams() {
  // Built-in ids plus any course added in the admin panel; unpublished ones render as 404
  const ids = [...new Set([...COURSES_DATA, ...(await getCourses())].map((c) => c.id))];
  return routing.locales.flatMap((locale) => ids.map((id) => ({ locale, id })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params;
  const c = (await getCourses()).find((x) => x.id === id);
  if (!c) return {};
  const bn = locale === 'bn';
  const title = bn ? c.banglaTitle : c.title;
  const outcome = (bn && c.banglaOutcome) || c.outcome;
  const description = bn
    ? c.whatsappOnly
      ? `${outcome} ${c.banglaDuration ?? c.duration}।`
      : `${outcome} ${c.banglaDuration ?? c.duration} · ${toBnDigits(c.classCount)}টি লাইভ ক্লাস · ${c.banglaTargetClb ?? c.targetClb ?? c.cefrLevel}।`
    : c.whatsappOnly
      ? `${outcome} ${c.duration}.`
      : `${outcome} ${c.duration} · ${c.classCount} live classes · ${c.targetClb ?? c.cefrLevel}.`;
  return {
    title,
    description,
    alternates: { canonical: `/${locale}/courses/${id}`, languages: { en: `/en/courses/${id}`, bn: `/bn/courses/${id}` } },
    openGraph: { title, description: outcome },
  };
}

export default async function CoursePage({ params }: { params: Promise<{ locale: Locale; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const course = (await getCourses()).find((x) => x.id === id);
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
      courseWorkload: course.whatsappOnly ? 'Flexible one-to-one sessions' : `${course.classCount} live classes`,
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
