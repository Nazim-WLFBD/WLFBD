import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing, type Locale } from '@/i18n/routing';
import { QUIZ_CATEGORIES } from '@/data/quizData';
import { findQuiz } from '@/lib/quizScoring';
import { PageHero } from '@/components/layout/PageHero';
import { QuizRunner } from '@/components/quiz/QuizRunner';

type P = { params: Promise<{ locale: Locale; slug: string[] }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    QUIZ_CATEGORIES.map((q) => ({ locale, slug: q.slug.replace(/^quiz\//, '').split('/') })),
  );
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale, slug } = await params;
  const q = findQuiz(slug);
  if (!q) return {};
  return { title: locale === 'bn' ? q.banglaTitle : q.title, description: locale === 'bn' ? q.banglaDescription : q.description };
}

export default async function QuizRunPage({ params }: P) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const quiz = findQuiz(slug);
  if (!quiz) notFound();
  return (
    <>
      <PageHero
        eyebrow={quiz.badgeTag}
        title={locale === 'bn' ? quiz.banglaTitle : quiz.title}
        crumbs={[{ href: '/', label: locale === 'bn' ? 'হোম' : 'Home' }, { href: '/quiz', label: locale === 'bn' ? 'কুইজ' : 'Quizzes' }, { label: quiz.level }]}
        className="pb-10 md:pb-12"
      />
      <section className="bg-bg py-10 md:py-14">
        <div className="container-x">
          <QuizRunner quiz={quiz} />
        </div>
      </section>
    </>
  );
}
