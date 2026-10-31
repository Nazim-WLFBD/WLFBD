import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { PageHero } from '@/components/layout/PageHero';
import { CourseExplorer } from '@/components/courses/CourseExplorer';
import { courses } from '@/content/home';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: courses.title[locale],
    description: courses.intro[locale],
    alternates: { canonical: `/${locale}/courses`, languages: { en: '/en/courses', bn: '/bn/courses' } },
  };
}

export default async function CoursesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <PageHero
        eyebrow={courses.tag[locale]}
        title={courses.title[locale]}
        intro={courses.intro[locale]}
        crumbs={[{ href: '/', label: locale === 'bn' ? 'হোম' : 'Home' }, { label: locale === 'bn' ? 'কোর্সসমূহ' : 'Courses' }]}
      />
      <section className="bg-bg py-16 md:py-24">
        <div className="container-x">
          <CourseExplorer layout="grid" />
        </div>
      </section>
    </>
  );
}
