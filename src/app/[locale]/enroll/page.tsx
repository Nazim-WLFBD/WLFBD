import type { Metadata } from 'next';
import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { PageHero } from '@/components/layout/PageHero';
import { EnrollFlow } from '@/components/enroll/EnrollFlow';
import { enroll } from '@/content/enroll';
import { getBatches } from '@/lib/content';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: enroll.title[locale],
    description: enroll.intro[locale],
    alternates: { canonical: `/${locale}/enroll`, languages: { en: '/en/enroll', bn: '/bn/enroll' } },
  };
}

export default async function EnrollPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <PageHero
        eyebrow={locale === 'bn' ? 'ভর্তি · bKash · Nagad' : 'Admissions · bKash · Nagad'}
        title={enroll.title[locale]}
        intro={enroll.intro[locale]}
        crumbs={[{ href: '/', label: locale === 'bn' ? 'হোম' : 'Home' }, { label: locale === 'bn' ? 'ভর্তি' : 'Enroll' }]}
      />
      <section className="bg-bg py-12 md:py-16">
        <div className="container-x">
          <Suspense>
            <EnrollFlow batches={await getBatches()} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
