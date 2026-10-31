'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { useT, type L } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useAuth } from './AuthContext';
import { NotConfigured } from './NotConfigured';

type Tab = 'login' | 'signup' | 'reset';

/** Target goals: the English value is what gets stored on the profile; `l` is the display label. */
export const GOAL_OPTIONS: { v: string; l: L }[] = [
  { v: 'Canada TEF/TCF (+62 CRS)', l: { en: 'Canada TEF/TCF (+62 CRS)', bn: 'কানাডা TEF/TCF (+৬২ CRS)' } },
  { v: '2026 France Residency', l: { en: '2026 France Residency', bn: 'ফ্রান্স রেসিডেন্সি ২০২৬' } },
  { v: 'France Higher Education', l: { en: 'France Higher Education', bn: 'ফ্রান্সে উচ্চশিক্ষা' } },
  { v: 'General Fluency', l: { en: 'General Fluency', bn: 'সাধারণ ভাষা দক্ষতা' } },
];
export const GOALS = GOAL_OPTIONS.map((g) => g.v);
export const LEVELS = ['A0', 'A1', 'A2', 'B1', 'B2+'];

const copy = {
  login: { en: 'Log in', bn: 'লগইন' },
  signup: { en: 'Create account', bn: 'অ্যাকাউন্ট তৈরি' },
  reset: { en: 'Reset password', bn: 'পাসওয়ার্ড রিসেট' },
  name: { en: 'Full name', bn: 'পুরো নাম' },
  email: { en: 'Email', bn: 'ইমেইল' },
  password: { en: 'Password (6+ characters)', bn: 'পাসওয়ার্ড (৬+ অক্ষর)' },
  confirm: { en: 'Confirm password', bn: 'পাসওয়ার্ড নিশ্চিত করুন' },
  phone: { en: 'WhatsApp (optional)', bn: 'হোয়াটসঅ্যাপ (ঐচ্ছিক)' },
  goal: { en: 'Target goal', bn: 'লক্ষ্য' },
  level: { en: 'Current French level', bn: 'বর্তমান ফ্রেঞ্চ লেভেল' },
  google: { en: 'Continue with Google', bn: 'Google দিয়ে চালিয়ে যান' },
  forgot: { en: 'Forgot password?', bn: 'পাসওয়ার্ড ভুলে গেছেন?' },
  sent: { en: 'Reset link sent. Check your inbox.', bn: 'রিসেট লিংক পাঠানো হয়েছে। ইনবক্স দেখুন।' },
  mismatch: { en: 'Passwords do not match.', bn: 'পাসওয়ার্ড মেলেনি।' },
  or: { en: 'or', bn: 'অথবা' },
};

const ERRORS = {
  credential: { en: 'Email or password is incorrect.', bn: 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।' },
  exists: { en: 'An account with this email already exists. Log in instead.', bn: 'এই ইমেইলে আগে থেকেই অ্যাকাউন্ট আছে। লগইন করুন।' },
  weak: { en: 'Password must be at least 6 characters.', bn: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' },
  popup: { en: 'Google sign-in was closed before finishing.', bn: 'Google সাইন-ইন শেষ হওয়ার আগেই বন্ধ হয়ে গেছে।' },
  invalidEmail: { en: 'Enter a valid email address.', bn: 'সঠিক ইমেইল অ্যাড্রেস দিন।' },
  tooMany: { en: 'Too many attempts. Please wait a few minutes and try again.', bn: 'অনেকবার চেষ্টা করা হয়েছে। কয়েক মিনিট পর আবার চেষ্টা করুন।' },
  network: { en: 'Network error. Check your connection and try again.', bn: 'নেটওয়ার্ক সমস্যা। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।' },
  notConfigured: { en: 'Accounts are not configured yet.', bn: 'অ্যাকাউন্ট সুবিধা এখনো চালু হয়নি।' },
  notSignedIn: { en: 'You are not signed in.', bn: 'আপনি লগইন করা নেই।' },
  generic: { en: 'Something went wrong. Please try again.', bn: 'কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।' },
} satisfies Record<string, L>;

/** Maps a Firebase/AuthContext error to a bilingual message. Raw error text is never shown. */
function friendly(e: unknown): L {
  const code = (e as { code?: string })?.code ?? '';
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) return ERRORS.credential;
  if (code.includes('email-already-in-use')) return ERRORS.exists;
  if (code.includes('weak-password')) return ERRORS.weak;
  if (code.includes('popup-closed')) return ERRORS.popup;
  if (code.includes('invalid-email')) return ERRORS.invalidEmail;
  if (code.includes('too-many-requests')) return ERRORS.tooMany;
  if (code.includes('network-request-failed')) return ERRORS.network;
  if (code === 'auth/not-configured') return ERRORS.notConfigured;
  if (code === 'auth/not-signed-in') return ERRORS.notSignedIn;
  return ERRORS.generic;
}

export function AuthForm({ initial = 'login' }: { initial?: Tab }) {
  const t = useT();
  const router = useRouter();
  const params = useSearchParams();
  // Only same-site paths may be used as the return address (blocks open redirects like ?next=https://evil)
  const rawNext = params.get('next') || '';
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') && !/^\/[a-z][\w+.-]*:/i.test(rawNext) ? rawNext : '/dashboard';
  const auth = useAuth();
  const [tab, setTab] = useState<Tab>(initial);
  const [f, setF] = useState({ name: '', email: '', password: '', confirm: '', phone: '', goal: GOALS[0], level: 'A0' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (auth.user) router.replace(next);
  }, [auth.user, next, router]);

  if (!auth.configured) return <NotConfigured />;

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      await fn();
    } catch (e) {
      setErr(t(friendly(e)));
    } finally {
      setBusy(false);
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'login') return run(() => auth.logIn(f.email, f.password));
    if (tab === 'reset') return run(async () => (await auth.resetPassword(f.email), setMsg(t(copy.sent))));
    if (f.password !== f.confirm) return setErr(t(copy.mismatch));
    return run(() =>
      auth.signUp(f.email, f.password, {
        displayName: f.name,
        phoneNumber: f.phone,
        targetGoal: f.goal,
        currentFrenchLevel: f.level,
      }),
    );
  };

  const input = 'w-full rounded-xl border border-line bg-surface px-4 py-3 text-[15px] outline-none transition focus:border-bleu focus:ring-2 focus:ring-bleu/20';
  const label = 'mb-2 block text-[11px] font-bold tracking-[0.14em] text-muted uppercase';

  return (
    <div className="card accent-top mx-auto max-w-md p-6 md:p-8">
      <div className="mb-6 flex border-b border-line text-sm font-semibold" role="tablist">
        {(['login', 'signup'] as const).map((k) => (
          <button
            key={k}
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={cn(
              'relative -mb-px min-h-11 flex-1 px-2 pt-2 pb-3 transition',
              tab === k ? 'text-fg after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-rouge' : 'text-muted hover:text-fg',
            )}
          >
            {t(copy[k])}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="flex flex-col gap-4">
        {tab === 'signup' && (
          <div>
            <label htmlFor="auth-name" className={label}>
              {t(copy.name)}
            </label>
            <input id="auth-name" required value={f.name} onChange={set('name')} autoComplete="name" className={input} />
          </div>
        )}
        <div>
          <label htmlFor="auth-email" className={label}>
            {t(copy.email)}
          </label>
          <input id="auth-email" required type="email" value={f.email} onChange={set('email')} autoComplete="email" className={input} />
        </div>
        {tab !== 'reset' && (
          <div>
            <label htmlFor="auth-password" className={label}>
              {t(copy.password)}
            </label>
            <input
              id="auth-password"
              required
              type="password"
              minLength={6}
              value={f.password}
              onChange={set('password')}
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              className={input}
            />
          </div>
        )}
        {tab === 'signup' && (
          <>
            <div>
              <label htmlFor="auth-confirm" className={label}>
                {t(copy.confirm)}
              </label>
              <input id="auth-confirm" required type="password" minLength={6} value={f.confirm} onChange={set('confirm')} autoComplete="new-password" className={input} />
            </div>
            <div>
              <label htmlFor="auth-phone" className={label}>
                {t(copy.phone)}
              </label>
              <input id="auth-phone" value={f.phone} onChange={set('phone')} type="tel" inputMode="numeric" autoComplete="tel" placeholder="01XXXXXXXXX" className={input} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-[11px] font-bold tracking-[0.14em] text-muted uppercase">
                {t(copy.goal)}
                <select value={f.goal} onChange={set('goal')} className={cn(input, 'mt-1.5 px-3 text-sm tracking-normal normal-case')}>
                  {GOAL_OPTIONS.map((g) => (
                    <option key={g.v} value={g.v}>
                      {t(g.l)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-[11px] font-bold tracking-[0.14em] text-muted uppercase">
                {t(copy.level)}
                <select value={f.level} onChange={set('level')} className={cn(input, 'mt-1.5 px-3 text-sm tracking-normal normal-case')}>
                  {LEVELS.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </label>
            </div>
          </>
        )}
        {err && <p className="rounded-xl border border-rouge/30 bg-red-soft p-3 text-sm font-medium text-rouge">{err}</p>}
        {msg && <p className="rounded-xl bg-surface-2 p-3 text-sm font-medium text-mint">{msg}</p>}
        <button disabled={busy} className={btn('rouge', 'md', 'mt-1 w-full')}>
          {busy && <Loader2 size={16} className="animate-spin" />}
          {t(copy[tab])}
        </button>
      </form>
      {tab !== 'reset' && (
        <>
          <div className="my-5 flex items-center gap-3 text-[11px] font-bold tracking-[0.14em] text-muted uppercase">
            <span className="h-px flex-1 bg-line" />
            {t(copy.or)}
            <span className="h-px flex-1 bg-line" />
          </div>
          <button onClick={() => run(auth.logInWithGoogle)} disabled={busy} className={btn('ghost', 'md', 'w-full')}>
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
              <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.5 5C9.5 39.6 16.2 44 24 44z" />
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
            </svg>
            {t(copy.google)}
          </button>
        </>
      )}
      <button onClick={() => setTab(tab === 'reset' ? 'login' : 'reset')} className="mx-auto mt-5 block min-h-10 text-sm font-semibold text-bleu hover:underline">
        {tab === 'reset' ? t(copy.login) : t(copy.forgot)}
      </button>
    </div>
  );
}
