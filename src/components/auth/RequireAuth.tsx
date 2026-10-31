'use client';

import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { useAuth } from './AuthContext';
import { NotConfigured } from './NotConfigured';

/** Renders children only for signed-in users; otherwise sends them to /login?next=… */
export function RequireAuth({ children, admin }: { children: React.ReactNode; admin?: boolean }) {
  const t = useT();
  const { configured, loading, user, isAdmin } = useAuth();
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
  return <>{children}</>;
}
