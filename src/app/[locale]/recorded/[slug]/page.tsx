import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { RECORDED_COURSES } from '@/data/recordedCourses';
import { publicRecordedCourses } from '@/lib/recorded';
import { RecordedDetail } from '@/components/recorded/RecordedDetail';

export const revalidate = 300;
type P = { params: Promise<{ locale: Locale; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => RECORDED_COURSES.map((r) => ({ locale, slug: r.slug })));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug, locale } = await params;
  const c = (await publicRecordedCourses()).find((x) => x.slug === slug);
  if (!c) return {};
  return {
    title: locale === 'bn' ? c.banglaTitle : c.title,
    description: locale === 'bn' ? c.banglaDescription || c.description : c.description,
    openGraph: { images: [c.thumbnail] },
    alternates: { canonical: `/${locale}/recorded/${slug}`, languages: { en: `/en/recorded/${slug}`, bn: `/bn/recorded/${slug}` } },
  };
}

export default async function RecordedCoursePage({ params }: P) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const course = (await publicRecordedCourses()).find((x) => x.slug === slug);
  if (!course) notFound();
  return (
    <Suspense>
      <RecordedDetail course={course} />
    </Suspense>
  );
}
