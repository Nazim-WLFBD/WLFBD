import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { PageHero } from '@/components/layout/PageHero';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { Dashboard } from '@/components/dashboard/Dashboard';

export const metadata = { title: 'My Dashboard', robots: { index: false } };

export default async function DashboardPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <PageHero title={locale === 'bn' ? 'আমার ড্যাশবোর্ড' : 'My Dashboard'} className="pb-10 md:pb-12" />
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
