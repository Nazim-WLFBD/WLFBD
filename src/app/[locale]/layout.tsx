import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { Fraunces, Hind_Siliguri, Plus_Jakarta_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { BRAND_CONTACT, BRAND_META, BRAND_NAME, BRAND_TAGLINE_BANGLA, FACEBOOK_PIXEL_ID, brandMeta } from '@/lib/brand';
import { ui } from '@/content/home';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingActions } from '@/components/layout/FloatingActions';
import { MobileBottomBar } from '@/components/layout/MobileBottomBar';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { LegacyHashRedirect } from '@/components/layout/LegacyHashRedirect';
import { themeScript } from '@/components/layout/ThemeToggle';
import { Providers } from '@/components/Providers';
import { CoursesProvider } from '@/components/CoursesProvider';
import { getCombos, getCourses } from '@/lib/content';

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', axes: ['opsz', 'SOFT'], display: 'swap' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap' });
const hind = Hind_Siliguri({ subsets: ['bengali', 'latin'], weight: ['400', '500', '600', '700'], variable: '--font-hind', display: 'swap' });
// Bangla digits (০–৯) only, from Hind Siliguri Bold: listed first in every font stack so numbers always render bold
const bnDigits = localFont({
  src: '../../fonts/hind-siliguri-bengali-700.woff2',
  weight: '100 900',
  variable: '--font-bn-digits',
  display: 'swap',
  preload: false,
  declarations: [{ prop: 'unicode-range', value: 'U+09E6-09EF' }],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Live courses and combos are admin-editable, so every page re-renders with fresh data within 5 minutes
export const revalidate = 300;

export const viewport: Viewport = {
  themeColor: '#0e1a2f',
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const meta = brandMeta(locale);
  return {
    metadataBase: new URL(BRAND_META.canonical),
    title: { default: meta.defaultTitle, template: `%s | ${BRAND_NAME}` },
    description: meta.defaultDescription,
    keywords: meta.keywords,
    alternates: {
      canonical: `/${locale}`,
      languages: { en: '/en', bn: '/bn', 'x-default': '/en' },
    },
    openGraph: {
      type: 'website',
      siteName: BRAND_NAME,
      title: meta.defaultTitle,
      description: meta.defaultDescription,
      url: `/${locale}`,
      locale: locale === 'bn' ? 'bn_BD' : 'en_US',
      images: [{ url: '/og.jpg', width: 1200, height: 630, alt: BRAND_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.defaultTitle,
      description: meta.defaultDescription,
      images: ['/og.jpg'],
    },
  };
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: BRAND_NAME,
  slogan: BRAND_TAGLINE_BANGLA,
  description: BRAND_META.defaultDescription,
  url: BRAND_META.canonical,
  logo: `${BRAND_META.canonical}/icon-512.png`,
  telephone: BRAND_CONTACT.phoneIntl,
  email: BRAND_CONTACT.email,
  address: { '@type': 'PostalAddress', addressLocality: 'Dhaka', addressCountry: 'BD' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'French Language Courses',
    itemListElement: [
      {
        '@type': 'Course',
        name: 'DELF A1 Beginner Mastery',
        description: 'A0 to A1 Complete French Beginner Course with Live Practice',
        provider: BRAND_NAME,
      },
      {
        '@type': 'Course',
        name: 'TCF Canada Express B2 Program',
        description: 'Comprehensive TEF/TCF Canada preparation for +62 CRS Bonus Points',
        provider: BRAND_NAME,
      },
    ],
  },
};

const pixel = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${FACEBOOK_PIXEL_ID}');fbq('track','PageView');`;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [courses, combos] = await Promise.all([getCourses(), getCombos()]);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${fraunces.variable} ${jakarta.variable} ${hind.variable} ${bnDigits.variable}`}
    >
      <body>
        {/* Inline scripts live at the top of <body>: React 19 hoists <script> children of <head> and the
            server/client trees then disagree (hydration mismatch). The theme script still runs before paint. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
        <NextIntlClientProvider>
          <Providers>
            <CoursesProvider courses={courses} combos={combos}>
              <a
                href="#main"
                className="sr-only z-[200] rounded-full bg-gold px-4 py-2 font-semibold text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
              >
                {ui.skip[locale]}
              </a>
              <SmoothScroll />
              <LegacyHashRedirect />
              <Header />
              <main id="main">{children}</main>
              <Footer />
              <FloatingActions />
              <MobileBottomBar />
              <CommandPalette />
            </CoursesProvider>
          </Providers>
        </NextIntlClientProvider>
        <Script id="fb-pixel" strategy="afterInteractive">
          {pixel}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            alt=""
            src={`https://www.facebook.com/tr?id=${FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
      </body>
    </html>
  );
}
