'use client';

import { useAuth } from '@/components/auth/AuthContext';
import { useT } from '@/i18n/t';
import { EnrollError, EnrollForm, type EnrollmentInput } from './EnrollForm';
import type { BatchSchedule } from '@/types';

/** Enrollment page: saves through /api/enroll when the backend is configured. */
export function EnrollFlow({ batches }: { batches: BatchSchedule[] }) {
  const t = useT();
  const { configured, user, profile, authFetch } = useAuth();

  const submit = async (d: EnrollmentInput) => {
    if (!configured) return; // No backend yet: receipt + WhatsApp handoff only
    // `locale` picks the language of the receipt email sent by the API
    const res = await authFetch('/api/enroll', { method: 'POST', body: JSON.stringify({ ...d, locale: t.locale }) });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string; code?: string; field?: string };
      // Bilingual message is picked from `code` inside EnrollForm; the server text is only a fallback
      throw new EnrollError(body.error ?? '', body.code, body.field);
    }
  };

  return (
    <EnrollForm
      key={user?.uid ?? 'guest'}
      defaults={{ name: profile?.displayName, phone: profile?.phoneNumber, email: profile?.email ?? user?.email ?? '' }}
      batches={batches}
      onSubmit={submit}
    />
  );
}
