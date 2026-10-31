'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Check, CheckCircle2, Copy, Loader2, X } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useT, type L } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { useAuth } from '@/components/auth/AuthContext';
import { BRAND_CONTACT, waLink } from '@/lib/brand';
import { taka } from '@/lib/utils';
import type { RecordedCourse } from '@/types';

/** Messages for the payment API's error codes (the server's English `error` is the fallback). */
const PAY_ERRORS: Record<string, L> = {
  login_required: { en: 'Please log in first.', bn: 'অনুগ্রহ করে আগে লগইন করুন।' },
  invalid: { en: 'Check the bKash number and TrxID.', bn: 'bKash নম্বর ও TrxID ঠিক আছে কি না দেখুন।' },
  rate_limited: { en: 'Too many attempts. Please try again later.', bn: 'অনেকবার চেষ্টা করা হয়েছে। একটু পরে আবার চেষ্টা করুন।' },
  unknown_course: { en: 'This course could not be found.', bn: 'এই কোর্সটি খুঁজে পাওয়া যায়নি।' },
  duplicate_trx: { en: 'This TrxID has already been submitted.', bn: 'এই TrxID আগেই জমা দেওয়া হয়েছে।' },
};

/** bKash Send Money + TrxID submission for a recorded course; verified manually by admins. */
export function BkashPay({ course, open, onClose }: { course: RecordedCourse; open: boolean; onClose: () => void }) {
  const t = useT();
  const { profile, user, authFetch } = useAuth();
  const [sender, setSender] = useState('');
  const [trx, setTrx] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const title = t.locale === 'bn' && course.banglaTitle ? course.banglaTitle : course.title;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!/^(\+?88)?01[3-9]\d{8}$/.test(sender.replace(/[\s-]/g, '')))
      return setErr(t({ en: 'Enter the 11-digit bKash number you paid from.', bn: 'যে bKash নম্বর থেকে পেমেন্ট করেছেন, সেই ১১ সংখ্যার নম্বরটি লিখুন।' }));
    if (trx.trim().length < 6) return setErr(t({ en: 'Enter the TrxID from your bKash message.', bn: 'আপনার bKash মেসেজ থেকে TrxID লিখুন।' }));
    setBusy(true);
    try {
      const r = await authFetch('/api/recorded/pay', {
        method: 'POST',
        body: JSON.stringify({ courseId: course.id, senderPhone: sender.replace(/[\s-]/g, ''), trxId: trx.trim(), notes: note, locale: t.locale }),
      });
      if (!r.ok) {
        const d: { error?: string; code?: string } = await r.json().catch(() => ({}));
        const known = d.code ? PAY_ERRORS[d.code] : undefined;
        throw new Error(known ? t(known) : d.error ?? t({ en: 'Could not submit payment.', bn: 'পেমেন্ট জমা দেওয়া যায়নি।' }));
      }
      setDone(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const input = 'w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] outline-none transition focus:border-bleu focus:ring-2 focus:ring-bleu/20';

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-ink/70" />
        <Dialog.Content data-lenis-prevent className="accent-top fixed top-1/2 left-1/2 z-[91] max-h-[92vh] w-[min(520px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[var(--radius)] border border-line bg-surface p-6 text-fg shadow-[var(--shadow-lift)]" aria-describedby={undefined}>
          <div className="flex items-start justify-between gap-3">
            <Dialog.Title className="font-display text-2xl font-semibold">{t({ en: 'Pay with bKash', bn: 'বিকাশে পেমেন্ট' })}</Dialog.Title>
            <Dialog.Close aria-label={t({ en: 'Close', bn: 'বন্ধ করুন' })} className="-mt-1 -mr-1 flex h-10 w-10 items-center justify-center rounded-lg hover:bg-fg/10">
              <X size={18} />
            </Dialog.Close>
          </div>
          {done ? (
            <div className="mt-4 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-soft text-rouge">
                <CheckCircle2 size={26} />
              </span>
              <p className="font-display mt-3 text-xl font-semibold">{t({ en: 'Payment submitted!', bn: 'পেমেন্ট জমা হয়েছে!' })}</p>
              <p className="mt-2 text-sm text-muted">
                {t({
                  en: 'Our team will verify your TrxID and unlock the course, usually within a few hours. You will see it in your dashboard.',
                  bn: 'আমাদের টিম আপনার TrxID যাচাই করে কোর্সটি আনলক করবে, সাধারণত কয়েক ঘণ্টার মধ্যে। আপনার ড্যাশবোর্ডে দেখতে পাবেন।',
                })}
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <a
                  href={waLink(
                    t.locale === 'bn'
                      ? `Bonjour! আমি "${title}" কোর্সের জন্য ${taka(course.offerPrice)} bKash-এ পাঠিয়েছি। TrxID: ${trx.toUpperCase()}`
                      : `Bonjour! I paid ${taka(course.offerPrice)} for ${course.title}. TrxID: ${trx.toUpperCase()}`,
                  )}
                  target="_blank"
                  rel="noopener"
                  className={btn('ink', 'md', 'bg-[#16a34a] hover:bg-[#15803d] dark:bg-[#16a34a] dark:text-white dark:hover:bg-[#15803d]')}
                >
                  {t({ en: 'Confirm on WhatsApp', bn: 'হোয়াটসঅ্যাপে নিশ্চিত করুন' })}
                </a>
                <Link href="/dashboard" className={btn('ghost', 'md')}>
                  {t({ en: 'Go to dashboard', bn: 'ড্যাশবোর্ডে যান' })}
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
              <div className="rounded-xl bg-red-soft p-4">
                <p className="text-sm text-muted">{title}</p>
                <p className="font-display text-3xl font-semibold text-fg">{taka(course.offerPrice, t.locale)}</p>
                <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-line bg-surface p-3">
                  <span className="font-mono text-lg font-bold">{BRAND_CONTACT.bkashPersonal}</span>
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard?.writeText(BRAND_CONTACT.bkashPersonal).catch(() => {});
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1500);
                    }}
                    className="flex min-h-10 items-center gap-1 rounded-lg bg-ink px-3 py-1.5 text-xs font-bold text-white dark:bg-white dark:text-ink"
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? t({ en: 'Copied', bn: 'কপি হয়েছে' }) : t({ en: 'Copy', bn: 'কপি করুন' })}
                  </button>
                </div>
                <ol className={`mt-3 space-y-1.5 text-sm text-fg/85 ${t.locale === 'bn' ? 'font-bangla' : ''}`}>
                  <li>{t({ en: '1. bKash app ➔ Send Money', bn: '১. bKash অ্যাপ ➔ Send Money' })}</li>
                  <li>
                    {t({ en: '2. Recipient: ', bn: '২. প্রাপক: ' })}
                    {BRAND_CONTACT.bkashPersonal}
                  </li>
                  <li>
                    {t({ en: '3. Amount: ', bn: '৩. পরিমাণ: ' })}
                    {taka(course.offerPrice, t.locale)}
                    {t({ en: ' — then enter the TrxID below', bn: ' — তারপর TrxID নিচে দিন' })}
                  </li>
                </ol>
              </div>
              <input value={profile?.displayName ?? ''} readOnly className={`${input} opacity-70`} aria-label={t({ en: 'Name', bn: 'নাম' })} />
              <input value={user?.email ?? ''} readOnly className={`${input} opacity-70`} aria-label={t({ en: 'Email', bn: 'ইমেইল' })} />
              <input value={sender} onChange={(e) => setSender(e.target.value)} placeholder={t({ en: 'Sender bKash number', bn: 'প্রেরক বিকাশ নম্বর' })} inputMode="tel" className={input} />
              <input value={trx} onChange={(e) => setTrx(e.target.value.toUpperCase())} placeholder="TrxID" className={`${input} font-mono`} />
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder={t({ en: 'Note (optional)', bn: 'নোট (ঐচ্ছিক)' })} className={input} />
              {err && <p className="rounded-xl border border-rouge/30 bg-red-soft p-3 text-sm font-medium text-rouge">{err}</p>}
              <button disabled={busy} className={btn('rouge', 'md', 'mt-1')}>
                {busy && <Loader2 size={16} className="animate-spin" />}
                {t({ en: 'Submit payment for verification', bn: 'যাচাইয়ের জন্য পেমেন্ট জমা দিন' })}
              </button>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
