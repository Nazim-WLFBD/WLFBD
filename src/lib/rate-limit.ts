import 'server-only';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from './firebase-admin';

/**
 * Fixed-window rate limit stored in Firestore (`rateLimits` collection, server-only),
 * so it survives restarts and works across server instances.
 */
export async function rateLimit(key: string, max: number, windowSec: number) {
  const bucket = Math.floor(Date.now() / 1000 / windowSec);
  const id = `${key.replace(/[^\w.@-]/g, '_')}_${windowSec}_${bucket}`;
  const ref = adminDb().collection('rateLimits').doc(id);
  const count = await adminDb().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const n = (snap.exists ? (snap.data()!.count as number) : 0) + 1;
    tx.set(ref, { count: FieldValue.increment(1), expiresAt: new Date((bucket + 1) * windowSec * 1000) }, { merge: true });
    return n;
  });
  return count <= max;
}

export function clientIp(req: Request) {
  return (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown';
}
