// TEMPORARY diagnostic for the Netlify 500s. Reports only booleans, versions and error class names,
// never env values or key material. Remove once the live API routes work.
export const dynamic = 'force-dynamic';

const safe = (e: unknown) => {
  const err = e as { name?: string; code?: string; message?: string };
  // Module-resolution messages are safe; anything mentioning JSON could quote key text, so drop it
  const msg = String(err?.message ?? '');
  return { name: err?.name ?? 'Error', code: err?.code ?? null, message: /json|token|position/i.test(msg) ? '[hidden]' : msg.slice(0, 300) };
};

export async function GET() {
  const env = (k: string) => Boolean(process.env[k] && process.env[k]!.length > 0);
  const out: Record<string, unknown> = {
    node: process.version,
    env: {
      FIREBASE_SERVICE_ACCOUNT: env('FIREBASE_SERVICE_ACCOUNT'),
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: env('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
      SUPER_ADMIN_EMAILS: env('SUPER_ADMIN_EMAILS'),
      SMTP_USER: env('SMTP_USER'),
    },
  };
  try {
    const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT ?? '');
    out.serviceAccount = {
      parses: true,
      hasPrivateKey: typeof sa.private_key === 'string' && sa.private_key.includes('BEGIN PRIVATE KEY'),
      keyHasRealNewlines: typeof sa.private_key === 'string' && sa.private_key.includes('\n'),
      projectMatches: sa.project_id === process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    };
  } catch (e) {
    out.serviceAccount = { parses: false, error: safe(e) };
  }
  try {
    const { adminDb } = await import('@/lib/firebase-admin');
    await adminDb().collection('courses').limit(1).get();
    out.firestoreRead = 'ok';
  } catch (e) {
    out.firestoreRead = safe(e);
  }
  return Response.json(out);
}
