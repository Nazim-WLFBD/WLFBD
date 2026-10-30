import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { Classroom } from '@/components/recorded/Classroom';

export const metadata = { title: 'Classroom', robots: { index: false } };

export default async function LearnPage({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  return (
    <section className="min-h-screen bg-bg pt-24 pb-16">
      <div className="container-x">
        <RequireAuth>
          <Classroom slug={slug} />
        </RequireAuth>
      </div>
    </section>
  );
}
