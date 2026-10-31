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

/**
 * Caller's IP as seen by the hosting platform. Netlify sets `x-nf-client-connection-ip`;
 * otherwise the LAST `x-forwarded-for` entry is used, since clients can prepend their own
 * values to that header but the platform's proxy always appends the real address.
 */
export function clientIp(req: Request) {
  const nf = req.headers.get('x-nf-client-connection-ip');
  if (nf) return nf.trim();
  const xff = (req.headers.get('x-forwarded-for') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return xff[xff.length - 1] || req.headers.get('x-real-ip') || 'unknown';
}

/** Rate limit for anonymous endpoints: per IP plus a global ceiling, so a flood can't exhaust quotas. */
export async function publicRateLimit(scope: string, req: Request, perIp: number, windowSec: number, global = 300) {
  const [ipOk, allOk] = await Promise.all([rateLimit(`${scope}:${clientIp(req)}`, perIp, windowSec), rateLimit(`${scope}:all`, global, windowSec)]);
  return ipOk && allOk;
}
