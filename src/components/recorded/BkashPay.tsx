'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Check, CheckCircle2, Copy, Loader2, X } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { useAuth } from '@/components/auth/AuthContext';
import { BRAND_CONTACT, waLink } from '@/lib/brand';
import { taka } from '@/lib/utils';
import type { RecordedCourse } from '@/types';

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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!/^(\+?88)?01[3-9]\d{8}$/.test(sender.replace(/[\s-]/g, ''))) return setErr('Enter the 11-digit bKash number you paid from.');
    if (trx.trim().length < 6) return setErr('Enter the TrxID from your bKash message.');
    setBusy(true);
    try {
      const r = await authFetch('/api/recorded/pay', {
        method: 'POST',
        body: JSON.stringify({ courseId: course.id, senderPhone: sender.trim(), trxId: trx.trim(), notes: note }),
      });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error ?? 'Could not submit payment.');
      setDone(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const input = 'w-full rounded-2xl border border-line bg-surface px-4 py-3 text-[15px] outline-none focus:border-fg/50';

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-ink/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-[91] max-h-[92vh] w-[min(520px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-surface p-6 text-fg" aria-describedby={undefined}>
          <div className="flex items-start justify-between gap-3">
            <Dialog.Title className="font-display text-2xl font-semibold">{t({ en: 'Pay with bKash', bn: 'বিকাশে পেমেন্ট' })}</Dialog.Title>
            <Dialog.Close aria-label="Close" className="rounded-full p-2 hover:bg-fg/10">
              <X size={18} />
            </Dialog.Close>
          </div>
          {done ? (
            <div className="mt-4 text-center">
              <CheckCircle2 size={44} className="mx-auto text-mint" />
              <p className="font-display mt-3 text-xl font-semibold">{t({ en: 'Payment submitted!', bn: 'পেমেন্ট জমা হয়েছে!' })}</p>
              <p className="mt-2 text-sm text-muted">
                {t({
                  en: 'Our team will verify your TrxID and unlock the course, usually within a few hours. You will see it in your dashboard.',
                  bn: 'আমাদের টিম আপনার TrxID যাচাই করে কোর্সটি আনলক করবে, সাধারণত কয়েক ঘণ্টার মধ্যে। আপনার ড্যাশবোর্ডে দেখতে পাবেন।',
                })}
              </p>
              <div className="mt-5 flex flex-col gap-2">
                <a href={waLink(`Bonjour! I paid ${taka(course.offerPrice)} for ${course.title}. TrxID: ${trx.toUpperCase()}`)} target="_blank" rel="noopener" className={btn('ink', 'md', 'bg-[#16a34a]')}>
                  {t({ en: 'Confirm on WhatsApp', bn: 'হোয়াটসঅ্যাপে নিশ্চিত করুন' })}
                </a>
                <Link href="/dashboard" className={btn('ghost', 'md')}>
                  {t({ en: 'Go to dashboard', bn: 'ড্যাশবোর্ডে যান' })}
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
              <div className="rounded-2xl border border-bkash/30 bg-bkash/[.06] p-4">
                <p className="text-sm">{course.title}</p>
                <p className="font-display text-3xl font-semibold text-bkash">{taka(course.offerPrice, t.locale)}</p>
                <div className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-surface p-3">
                  <span className="font-mono text-lg font-bold">{BRAND_CONTACT.bkashPersonal}</span>
                  <button
                    type="button"
                    onClick={async () => {
                      await navigator.clipboard.writeText(BRAND_CONTACT.bkashPersonal);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1500);
                    }}
                    className="flex items-center gap-1 rounded-lg bg-bkash px-3 py-1.5 text-xs font-bold text-white"
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <ol className="font-bangla mt-3 space-y-1 text-sm text-fg/80">
                  <li>১. bKash অ্যাপ ➔ Send Money</li>
                  <li>২. প্রাপক: {BRAND_CONTACT.bkashPersonal}</li>
                  <li>৩. পরিমাণ: {taka(course.offerPrice)} — তারপর TrxID নিচে দিন</li>
                </ol>
              </div>
              <input value={profile?.displayName ?? ''} readOnly className={`${input} opacity-70`} aria-label="Name" />
              <input value={user?.email ?? ''} readOnly className={`${input} opacity-70`} aria-label="Email" />
              <input value={sender} onChange={(e) => setSender(e.target.value)} placeholder={t({ en: 'Sender bKash number', bn: 'প্রেরক বিকাশ নম্বর' })} inputMode="tel" className={input} />
              <input value={trx} onChange={(e) => setTrx(e.target.value.toUpperCase())} placeholder="TrxID" className={`${input} font-mono`} />
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder={t({ en: 'Note (optional)', bn: 'নোট (ঐচ্ছিক)' })} className={input} />
              {err && <p className="rounded-xl bg-rouge/10 p-3 text-sm text-rouge">{err}</p>}
              <button disabled={busy} className={btn('rouge', 'md', 'mt-1 bg-bkash hover:bg-[#c50f5f]')}>
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
