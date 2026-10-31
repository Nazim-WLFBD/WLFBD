'use client';

import { useEffect } from 'react';
import { Clock, Loader2, XCircle } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { useAuth } from './AuthContext';
import { btn } from '@/components/ui/Button';
import { BRAND_CONTACT, waLink } from '@/lib/brand';
import { NotConfigured } from './NotConfigured';

/** Renders children only for signed-in users; otherwise sends them to /login?next=… */
export function RequireAuth({ children, admin }: { children: React.ReactNode; admin?: boolean }) {
  const t = useT();
  const { configured, loading, user, isAdmin, approval } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (configured && !loading && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [configured, loading, user, router, pathname]);

  if (!configured) return <NotConfigured />;
  if (loading || !user)
    return (
      <div className="flex justify-center py-20 text-muted">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (admin && !isAdmin)
    return (
      <p className="py-20 text-center text-muted">
        {t({ en: 'You don’t have access to this page.', bn: 'এই পেজে আপনার প্রবেশাধিকার নেই।' })}
      </p>
    );
  if (!admin && !isAdmin && approval !== 'approved') return <ApprovalNotice status={approval} />;
  return <>{children}</>;
}

/** Shown to students whose account an admin has not approved yet, or has rejected. */
function ApprovalNotice({ status }: { status: 'pending' | 'rejected' }) {
  const t = useT();
  const { logOut } = useAuth();
  const pending = status === 'pending';
  const msg = pending
    ? {
        title: { en: 'Your account is awaiting approval', bn: 'আপনার অ্যাকাউন্ট অনুমোদনের অপেক্ষায়' },
        text: {
          en: 'Thanks for signing up! An admin will review and approve your account shortly. You will get access to your dashboard and courses as soon as it is approved.',
          bn: 'সাইন আপ করার জন্য ধন্যবাদ! একজন অ্যাডমিন শীঘ্রই আপনার অ্যাকাউন্ট যাচাই করে অনুমোদন দেবেন। অনুমোদনের পরই ড্যাশবোর্ড ও কোর্সে প্রবেশ করতে পারবেন।',
        },
      }
    : {
        title: { en: 'Your account was not approved', bn: 'আপনার অ্যাকাউন্ট অনুমোদিত হয়নি' },
        text: {
          en: 'If you think this is a mistake, please contact us on WhatsApp and we will look into it.',
          bn: 'এটি ভুল মনে হলে হোয়াটসঅ্যাপে আমাদের সঙ্গে যোগাযোগ করুন, আমরা বিষয়টি দেখব।',
        },
      };
  const Icon = pending ? Clock : XCircle;
  return (
    <div className="card accent-top mx-auto max-w-lg p-8 text-center" role="status">
      <span className={pending ? 'mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-muted' : 'mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-soft text-rouge'}>
        <Icon size={26} />
      </span>
      <h2 className="font-display mt-4 text-2xl font-semibold">{t(msg.title)}</h2>
      <p className="mt-3 leading-relaxed text-muted">{t(msg.text)}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <a
          href={waLink(t({ en: 'Hello! I am waiting for my account approval.', bn: 'হ্যালো! আমার অ্যাকাউন্ট অনুমোদনের অপেক্ষায় আছি।' }))}
          target="_blank"
          rel="noopener"
          className={btn('ink', 'md')}
        >
          WhatsApp {BRAND_CONTACT.whatsapp}
        </a>
        <button onClick={() => logOut()} className={btn('ghost', 'md')}>
          {t({ en: 'Log out', bn: 'লগ আউট' })}
        </button>
      </div>
    </div>
  );
}
