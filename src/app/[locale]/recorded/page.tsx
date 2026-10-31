import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { PageHero } from '@/components/layout/PageHero';
import { RecordedTeaser } from '@/components/home/RecordedTeaser';
import { publicRecordedCourses } from '@/lib/recorded';

export const revalidate = 300;

const T = { en: 'Recorded DELF A1 & A2 Masterclasses', bn: 'রেকর্ডেড DELF A1 ও A2 মাস্টারক্লাস' };
const D = {
  en: 'Self-paced DELF A1 and A2 video courses in Bangla, with PDF notes, mock exams, lifetime access and bKash payment.',
  bn: 'বাংলায় ব্যাখ্যাসহ নিজের গতিতে শেখার DELF A1 ও A2 ভিডিও কোর্স — PDF নোট, মক এক্সাম, লাইফটাইম অ্যাক্সেস ও bKash পেমেন্ট।',
};
const HERO = {
  eyebrow: { en: 'SELF-PACED VIDEO COURSES', bn: 'নিজের গতিতে ভিডিও কোর্স' },
  title: { en: 'Recorded masterclasses', bn: 'রেকর্ডেড মাস্টারক্লাস' },
  home: { en: 'Home', bn: 'হোম' },
  crumb: { en: 'Recorded', bn: 'রেকর্ডেড' },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: T[locale],
    description: D[locale],
    alternates: { canonical: `/${locale}/recorded`, languages: { en: '/en/recorded', bn: '/bn/recorded' } },
  };
}

export default async function RecordedPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <PageHero
        eyebrow={HERO.eyebrow[locale]}
        title={HERO.title[locale]}
        intro={D[locale]}
        crumbs={[{ href: '/', label: HERO.home[locale] }, { label: HERO.crumb[locale] }]}
      />
      <RecordedTeaser courses={await publicRecordedCourses()} />
    </>
  );
}
