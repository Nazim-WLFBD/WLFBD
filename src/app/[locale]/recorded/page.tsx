import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { RecordedTeaser } from '@/components/home/RecordedTeaser';
import { publicRecordedCourses } from '@/lib/recorded';

export const revalidate = 300;
export const metadata = {
  title: 'Recorded DELF A1 & A2 Masterclasses',
  description: 'Self-paced DELF A1 and A2 video courses in Bangla, with PDF notes, mock exams, lifetime access and bKash payment.',
};

export default async function RecordedPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="pt-20">
      <RecordedTeaser courses={await publicRecordedCourses()} />
    </div>
  );
}
