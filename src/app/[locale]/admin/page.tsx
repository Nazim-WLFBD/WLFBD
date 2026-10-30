import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { PageHero } from '@/components/layout/PageHero';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { AdminPortal } from '@/components/admin/AdminPortal';

export const metadata = { title: 'Admin Portal', robots: { index: false } };

export default async function AdminPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <PageHero title="Admin Portal" className="pb-8 md:pb-10" />
      <section className="bg-bg py-10">
        <div className="container-x">
          <RequireAuth admin>
            <AdminPortal />
          </RequireAuth>
        </div>
      </section>
    </>
  );
}
