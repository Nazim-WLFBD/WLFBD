import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { PageHero } from '@/components/layout/PageHero';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { Dashboard } from '@/components/dashboard/Dashboard';

const TITLE = { en: 'My Dashboard', bn: 'আমার ড্যাশবোর্ড' };

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: TITLE[locale],
    robots: { index: false },
    alternates: { canonical: `/${locale}/dashboard`, languages: { en: '/en/dashboard', bn: '/bn/dashboard' } },
  };
}

export default async function DashboardPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <PageHero title={TITLE[locale]} className="pb-10 md:pb-12" />
      <section className="bg-bg py-10 md:py-14">
        <div className="container-x">
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        </div>
      </section>
    </>
  );
}
