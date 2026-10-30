import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { PageHero } from '@/components/layout/PageHero';
import { CrsTool } from '@/components/tools/CrsTool';

const TITLE = { en: 'Canada CRS Points Calculator', bn: 'কানাডা CRS পয়েন্ট ক্যালকুলেটর' };
const INTRO = {
  en: 'See how French (TEF / TCF Canada, CLB 7) can add up to +62 points to your Express Entry profile.',
  bn: 'ফ্রেঞ্চ (TEF / TCF Canada, CLB 7) কীভাবে আপনার এক্সপ্রেস এন্ট্রি প্রোফাইলে সর্বোচ্চ +৬২ পয়েন্ট যোগ করতে পারে দেখুন।',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: TITLE[locale],
    description: INTRO[locale],
    alternates: { canonical: `/${locale}/crs-calculator`, languages: { en: '/en/crs-calculator', bn: '/bn/crs-calculator' } },
  };
}

export default async function CrsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <PageHero
        eyebrow="Express Entry · +62 CRS"
        title={TITLE[locale]}
        intro={INTRO[locale]}
        crumbs={[{ href: '/', label: locale === 'bn' ? 'হোম' : 'Home' }, { label: 'CRS' }]}
      />
      <section className="bg-bg py-14 md:py-20">
        <div className="container-x">
          <CrsTool />
        </div>
      </section>
    </>
  );
}
