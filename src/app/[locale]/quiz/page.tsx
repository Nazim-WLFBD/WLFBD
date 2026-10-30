import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { PageHero } from '@/components/layout/PageHero';
import { QuizHub } from '@/components/quiz/QuizHub';

const T = { en: 'Quiz & Mock Test Hub', bn: 'কুইজ ও মক টেস্ট' };
const I = {
  en: 'Free French level test, DELF and TCF Canada mock exams, with instant results and course recommendations.',
  bn: 'ফ্রি ফ্রেঞ্চ লেভেল টেস্ট, DELF ও TCF Canada মক এক্সাম — সাথে সাথে ফলাফল ও কোর্স সুপারিশ।',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: T[locale], description: I[locale], alternates: { canonical: `/${locale}/quiz` } };
}

export default async function QuizPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <PageHero eyebrow="DELF · TCF · TEF" title={T[locale]} intro={I[locale]} />
      <section className="bg-bg py-14 md:py-20">
        <div className="container-x">
          <QuizHub />
        </div>
      </section>
    </>
  );
}
