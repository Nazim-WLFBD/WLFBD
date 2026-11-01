import { BadgeCheck, XCircle } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { adminDb } from '@/lib/firebase-admin';
import { PageHero } from '@/components/layout/PageHero';
import { BRAND_NAME } from '@/lib/brand';

export const dynamic = 'force-dynamic';

const COPY = {
  title: { en: 'Certificate Verification', bn: 'সার্টিফিকেট যাচাই' },
  eyebrow: { en: 'Certificate verification', bn: 'সার্টিফিকেট যাচাই' },
  verified: { en: 'Verified', bn: 'যাচাইকৃত' },
  certifies: { en: 'This certifies that', bn: 'এই মর্মে প্রত্যয়ন করা হচ্ছে যে' },
  completed: { en: 'has completed', bn: 'সফলভাবে সম্পন্ন করেছেন' },
  level: { en: 'Level', bn: 'লেভেল' },
  issued: { en: 'Issued', bn: 'প্রদানের তারিখ' },
  none: { en: 'No certificate found with this number.', bn: 'এই নম্বরে কোনো সার্টিফিকেট পাওয়া যায়নি।' },
  invalid: { en: 'Certificate numbers look like WLF-BD-123456.', bn: 'সার্টিফিকেট নম্বর দেখতে এমন: WLF-BD-123456' },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return { title: COPY.title[locale], robots: { index: false } };
}

/** Certificate numbers have a fixed shape; anything else is rejected before touching the database. */
function parseNumber(raw: string) {
  try {
    const n = decodeURIComponent(raw).trim().toUpperCase();
    return /^WLF-BD-\d{6}$/.test(n) ? n : null;
  } catch {
    return null;
  }
}

async function lookup(cert: string) {
  try {
    const d = await adminDb().collection('certificates').doc(cert).get();
    return d.exists ? d.data() : null;
  } catch {
    return null;
  }
}

export default async function VerifyPage({ params }: { params: Promise<{ locale: Locale; cert: string }> }) {
  const { locale, cert } = await params;
  setRequestLocale(locale);
  const number = parseNumber(cert);
  const c = number ? await lookup(number) : null;
  return (
    <>
      <PageHero eyebrow={COPY.eyebrow[locale]} title={number ?? COPY.title[locale]} className="pb-10" />
      <section className="bg-bg py-14">
        <div className="container-x">
          {c ? (
            <div className="mx-auto max-w-2xl overflow-hidden rounded-[28px] border-4 border-double border-gold bg-surface p-10 text-center">
              <BadgeCheck size={46} className="mx-auto text-mint" />
              <p className="mt-3 text-sm font-bold tracking-[0.2em] text-mint uppercase">{COPY.verified[locale]}</p>
              <p className="mt-6 text-muted">{COPY.certifies[locale]}</p>
              <p className="font-display mt-2 text-4xl font-semibold">{String(c.userName)}</p>
              <p className="mt-4 text-muted">{COPY.completed[locale]}</p>
              <p className="font-display mt-1 text-2xl font-semibold">{String(c.courseTitle)}</p>
              <p className="mt-6 text-sm text-muted">
                {c.cefrLevel ? `${COPY.level[locale]} ${String(c.cefrLevel)} · ` : ''}
                {COPY.issued[locale]} {String(c.issueDate ?? '')} · {BRAND_NAME}
              </p>
            </div>
          ) : (
            <div className="mx-auto max-w-md rounded-[28px] border border-line bg-surface p-10 text-center">
              <XCircle size={40} className="mx-auto text-rouge" />
              <p className="font-display mt-3 text-xl font-semibold">{COPY.none[locale]}</p>
              {!number && <p className="mt-2 text-sm text-muted">{COPY.invalid[locale]}</p>}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
