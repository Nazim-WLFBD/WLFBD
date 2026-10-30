import { adminAuth, adminDb, getCaller, json } from '@/lib/firebase-admin';

/**
 * Called after sign-in. Grants the superAdmin claim to emails listed in SUPER_ADMIN_EMAILS
 * (verified email required) so Firestore rules recognise them. Returns the caller's role.
 */
export async function POST(req: Request) {
  const caller = await getCaller(req);
  if (!caller) return json({ error: 'Unauthorized' }, 401);
  const user = await adminAuth().getUser(caller.uid);
  const current = (user.customClaims?.role as string) ?? 'student';
  if (caller.role === 'superAdmin' && current !== 'superAdmin') {
    await adminAuth().setCustomUserClaims(caller.uid, { ...user.customClaims, role: 'superAdmin' });
    await adminDb().doc(`users/${caller.uid}`).set({ role: 'superAdmin' }, { merge: true });
    return json({ role: 'superAdmin', refresh: true });
  }
  return json({ role: current });
}
