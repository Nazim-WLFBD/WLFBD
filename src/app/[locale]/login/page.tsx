import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { PageHero } from '@/components/layout/PageHero';
import { AuthForm } from '@/components/auth/AuthForm';

export const metadata = { title: 'Student Login', robots: { index: false } };

export default async function LoginPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <PageHero
        title={locale === 'bn' ? 'স্টুডেন্ট লগইন' : 'Student Login'}
        intro={locale === 'bn' ? 'আপনার কোর্স, কুইজ হিস্ট্রি ও অগ্রগতি দেখতে লগইন করুন।' : 'Log in to see your courses, quiz history and progress.'}
      />
      <section className="bg-bg py-14">
        <div className="container-x">
          <Suspense>
            <AuthForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
