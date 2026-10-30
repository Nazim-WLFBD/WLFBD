'use client';

import { useAuth } from '@/components/auth/AuthContext';
import { EnrollForm, type EnrollmentInput } from './EnrollForm';
import type { BatchSchedule } from '@/types';

/** Enrollment page: saves through /api/enroll when the backend is configured. */
export function EnrollFlow({ batches }: { batches: BatchSchedule[] }) {
  const { configured, user, profile, authFetch } = useAuth();

  const submit = async (d: EnrollmentInput) => {
    if (!configured) return; // No backend yet: receipt + WhatsApp handoff only
    const res = await authFetch('/api/enroll', { method: 'POST', body: JSON.stringify(d) });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? 'Could not submit. Please try WhatsApp.');
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
