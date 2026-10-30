import { BadgeCheck, XCircle } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { adminDb } from '@/lib/firebase-admin';
import { PageHero } from '@/components/layout/PageHero';
import { BRAND_NAME } from '@/lib/brand';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Certificate Verification', robots: { index: false } };

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
  const c = await lookup(decodeURIComponent(cert).toUpperCase());
  return (
    <>
      <PageHero eyebrow="Certificate verification" title={decodeURIComponent(cert).toUpperCase()} className="pb-10" />
      <section className="bg-bg py-14">
        <div className="container-x">
          {c ? (
            <div className="mx-auto max-w-2xl overflow-hidden rounded-[28px] border-4 border-double border-gold bg-surface p-10 text-center">
              <BadgeCheck size={46} className="mx-auto text-mint" />
              <p className="mt-3 text-sm font-bold tracking-[0.2em] text-mint uppercase">Verified</p>
              <p className="mt-6 text-muted">This certifies that</p>
              <p className="font-display mt-2 text-4xl font-semibold">{String(c.userName)}</p>
              <p className="mt-4 text-muted">has completed</p>
              <p className="font-display mt-1 text-2xl font-semibold">{String(c.courseTitle)}</p>
              <p className="mt-6 text-sm text-muted">
                Level {String(c.cefrLevel)} · Issued {String(c.issueDate)} · {BRAND_NAME}
              </p>
            </div>
          ) : (
            <div className="mx-auto max-w-md rounded-[28px] border border-line bg-surface p-10 text-center">
              <XCircle size={40} className="mx-auto text-rouge" />
              <p className="font-display mt-3 text-xl font-semibold">No certificate found with this number.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
