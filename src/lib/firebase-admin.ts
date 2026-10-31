import 'server-only';
import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let app: App | undefined;

/** Admin SDK, configured from FIREBASE_SERVICE_ACCOUNT (JSON) or the emulator. */
export function adminApp() {
  if (app) return app;
  if (getApps()[0]) return (app = getApps()[0]);
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (sa) {
    app = initializeApp({ credential: cert(JSON.parse(sa)), projectId });
  } else if (process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    app = initializeApp({ projectId });
  } else {
    throw new Error('Server is not configured: set FIREBASE_SERVICE_ACCOUNT.');
  }
  return app;
}

export const adminAuth = () => getAuth(adminApp());
export const adminDb = () => getFirestore(adminApp());

export const SUPER_ADMINS = (process.env.SUPER_ADMIN_EMAILS ?? '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export type Role = 'superAdmin' | 'admin' | 'instructor' | 'student';

export interface Caller {
  uid: string;
  email: string;
  role: Role;
}

/** Verifies the Firebase ID token in the Authorization header (signature checked). */
export async function getCaller(req: Request): Promise<Caller | null> {
  const h = req.headers.get('authorization') ?? '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (!token) return null;
  try {
    const d = await adminAuth().verifyIdToken(token, true);
    const email = (d.email ?? '').toLowerCase();
    let role = (d.role as Role) ?? 'student';
    if (email && SUPER_ADMINS.includes(email) && d.email_verified !== false) role = 'superAdmin';
    // A suspended account is treated as signed out everywhere on the server
    const profile = await adminDb().collection('users').doc(d.uid).get();
    if (profile.data()?.status === 'Suspended' && role !== 'superAdmin') return null;
    return { uid: d.uid, email, role };
  } catch {
    return null;
  }
}

export const isAdminRole = (r: Role) => r === 'admin' || r === 'superAdmin';

export function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}
