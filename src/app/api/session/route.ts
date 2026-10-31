import { FieldValue } from 'firebase-admin/firestore';
import { adminAuth, adminDb, getCaller, json } from '@/lib/firebase-admin';

/**
 * Called after sign-in. Grants the superAdmin claim to emails listed in SUPER_ADMIN_EMAILS
 * (verified email required) so Firestore rules recognise them, and makes sure the profile
 * document carries the identity fields students are not allowed to write themselves.
 * Returns the caller's role.
 */
export async function POST(req: Request) {
  const caller = await getCaller(req);
  if (!caller) return json({ error: 'Unauthorized' }, 401);
  const user = await adminAuth().getUser(caller.uid);
  const current = (user.customClaims?.role as string) ?? 'student';
  const grant = caller.role === 'superAdmin' && current !== 'superAdmin';
  if (grant) await adminAuth().setCustomUserClaims(caller.uid, { ...user.customClaims, role: 'superAdmin' });

  // Fill in whatever the profile is missing (it may have been created by a payment unlock or a role grant)
  const ref = adminDb().doc(`users/${caller.uid}`);
  const data = (await ref.get()).data() ?? {};
  const patch: Record<string, unknown> = {};
  if (!data.uid) patch.uid = caller.uid;
  if (!data.email) patch.email = caller.email;
  if (!data.status) patch.status = 'Active';
  if (!Array.isArray(data.enrolledCourses)) patch.enrolledCourses = [];
  if (!data.createdAt) patch.createdAt = FieldValue.serverTimestamp();
  if (grant || !data.role) patch.role = grant || current === 'superAdmin' ? 'superAdmin' : current;
  if (caller.role !== 'student' && data.approval !== 'approved') patch.approval = 'approved';
  // A brand-new student account (this request can land before the browser creates the profile) waits for approval
  else if (caller.role === 'student' && !data.createdAt && data.approval === undefined) patch.approval = 'pending';
  if (Object.keys(patch).length) await ref.set(patch, { merge: true });

  return grant ? json({ role: 'superAdmin', refresh: true }) : json({ role: current });
}
