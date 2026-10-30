'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useAuth } from './AuthContext';
import { NotConfigured } from './NotConfigured';

type Tab = 'login' | 'signup' | 'reset';

export const GOALS = [
  'Canada TEF/TCF (+62 CRS)',
  '2026 France Residency',
  'France Higher Education',
  'General Fluency',
];
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

function friendly(e: unknown) {
  const code = (e as { code?: string })?.code ?? '';
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found'))
    return 'Email or password is incorrect.';
  if (code.includes('email-already-in-use')) return 'An account with this email already exists. Log in instead.';
  if (code.includes('weak-password')) return 'Password must be at least 6 characters.';
  if (code.includes('popup-closed')) return 'Google sign-in was closed before finishing.';
  return e instanceof Error ? e.message : 'Something went wrong. Please try again.';
}

export function AuthForm({ initial = 'login' }: { initial?: Tab }) {
  const t = useT();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/dashboard';
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
      setErr(friendly(e));
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

  const input = 'w-full rounded-2xl border border-line bg-surface px-4 py-3.5 text-[15px] outline-none focus:border-fg/50';

  return (
    <div className="mx-auto max-w-md rounded-[28px] border border-line bg-surface p-6 md:p-8">
      <div className="mb-6 grid grid-cols-2 rounded-full bg-fg/5 p-1 text-sm font-bold">
        {(['login', 'signup'] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={cn('rounded-full py-2.5 transition', tab === k ? 'bg-ink text-white dark:bg-white dark:text-ink' : 'text-muted')}
          >
            {t(copy[k])}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="flex flex-col gap-3.5">
        {tab === 'signup' && <input required placeholder={t(copy.name)} value={f.name} onChange={set('name')} className={input} />}
        <input required type="email" placeholder={t(copy.email)} value={f.email} onChange={set('email')} autoComplete="email" className={input} />
        {tab !== 'reset' && (
          <input
            required
            type="password"
            minLength={6}
            placeholder={t(copy.password)}
            value={f.password}
            onChange={set('password')}
            autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
            className={input}
          />
        )}
        {tab === 'signup' && (
          <>
            <input required type="password" minLength={6} placeholder={t(copy.confirm)} value={f.confirm} onChange={set('confirm')} autoComplete="new-password" className={input} />
            <input placeholder={t(copy.phone)} value={f.phone} onChange={set('phone')} inputMode="tel" className={input} />
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs font-bold text-muted">
                {t(copy.goal)}
                <select value={f.goal} onChange={set('goal')} className={cn(input, 'mt-1 px-3')}>
                  {GOALS.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </label>
              <label className="text-xs font-bold text-muted">
                {t(copy.level)}
                <select value={f.level} onChange={set('level')} className={cn(input, 'mt-1 px-3')}>
                  {LEVELS.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </label>
            </div>
          </>
        )}
        {err && <p className="rounded-xl bg-rouge/10 p-3 text-sm text-rouge">{err}</p>}
        {msg && <p className="rounded-xl bg-mint/10 p-3 text-sm text-mint">{msg}</p>}
        <button disabled={busy} className={btn('rouge', 'md', 'mt-1 w-full')}>
          {busy && <Loader2 size={16} className="animate-spin" />}
          {t(copy[tab])}
        </button>
      </form>
      {tab !== 'reset' && (
        <>
          <div className="my-5 flex items-center gap-3 text-xs text-muted">
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
      <button onClick={() => setTab(tab === 'reset' ? 'login' : 'reset')} className="mx-auto mt-5 block text-sm font-semibold text-bleu hover:underline">
        {tab === 'reset' ? t(copy.login) : t(copy.forgot)}
      </button>
    </div>
  );
}
