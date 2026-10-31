import type { Metadata } from 'next';
import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { PageHero } from '@/components/layout/PageHero';
import { AuthForm } from '@/components/auth/AuthForm';

const TITLE = { en: 'Student Login', bn: 'স্টুডেন্ট লগইন' };
const INTRO = {
  en: 'Log in to see your courses, quiz history and progress.',
  bn: 'আপনার কোর্স, কুইজ হিস্ট্রি ও অগ্রগতি দেখতে লগইন করুন।',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: TITLE[locale],
    description: INTRO[locale],
    robots: { index: false },
    alternates: { canonical: `/${locale}/login`, languages: { en: '/en/login', bn: '/bn/login' } },
  };
}

export default async function LoginPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <PageHero title={TITLE[locale]} intro={INTRO[locale]} />
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
