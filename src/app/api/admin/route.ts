import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import { adminAuth, adminDb, getCaller, isAdminRole, json, SUPER_ADMINS, type Caller } from '@/lib/firebase-admin';
import { layout, sendMail } from '@/lib/email';
import { DEFAULT_RECORDED_COURSES } from '@/data/recordedCourses.server';

const Action = z.discriminatedUnion('action', [
  z.object({ action: z.literal('approvePayment'), paymentId: z.string() }),
  z.object({ action: z.literal('rejectPayment'), paymentId: z.string(), reason: z.string().max(300) }),
  z.object({ action: z.literal('setEnrollmentStatus'), enrollmentId: z.string(), status: z.enum(['Verified', 'Failed', 'Pending']) }),
  z.object({ action: z.literal('setRole'), uid: z.string(), role: z.enum(['student', 'instructor', 'admin', 'superAdmin']) }),
  z.object({ action: z.literal('seedRecordedCourses') }),
]);

async function audit(caller: Caller, action: string, target: string, metadata: Record<string, unknown> = {}) {
  await adminDb().collection('auditLogs').add({
    actorUid: caller.uid,
    actorEmail: caller.email,
    actorRole: caller.role,
    action,
    targetResource: target,
    metadata,
    timestamp: FieldValue.serverTimestamp(),
  });
}

/** Grants course access and marks the matching enrollment verified. */
async function unlock(userId: string | null, courseId: string, paymentId: string, caller: Caller) {
  const db = adminDb();
  if (userId) await db.doc(`users/${userId}`).set({ enrolledCourses: FieldValue.arrayUnion(courseId) }, { merge: true });
  const en = await db.collection('enrollments').where('paymentDocId', '==', paymentId).get();
  await Promise.all(en.docs.map((d) => d.ref.update({ paymentStatus: 'Verified', verifiedAt: FieldValue.serverTimestamp(), verifiedBy: caller.email })));
}

export async function POST(req: Request) {
  const caller = await getCaller(req);
  if (!caller || !isAdminRole(caller.role)) return json({ error: 'Forbidden' }, 403);
  const p = Action.safeParse(await req.json().catch(() => null));
  if (!p.success) return json({ error: 'Bad request' }, 400);
  const a = p.data;
  const db = adminDb();

  if (a.action === 'approvePayment' || a.action === 'rejectPayment') {
    const ref = db.collection('coursePayments').doc(a.paymentId);
    const pay = (await ref.get()).data();
    if (!pay) return json({ error: 'Payment not found' }, 404);
    if (a.action === 'approvePayment') {
      await ref.update({ status: 'Verified', verifiedAt: FieldValue.serverTimestamp(), verifiedBy: caller.email });
      await unlock(pay.userId ?? null, pay.courseId, a.paymentId, caller);
      await sendMail(
        pay.userEmail,
        `Payment verified: ${pay.courseTitle}`,
        layout('Your seat is confirmed', 'Your payment has been verified. Welcome aboard!', [
          ['Course', pay.courseTitle],
          ['Amount', `৳${pay.amount}`],
          ['TrxID', pay.trxId || '—'],
        ]),
      ).catch(() => {});
    } else {
      await ref.update({ status: 'Rejected', rejectionReason: a.reason, verifiedAt: FieldValue.serverTimestamp(), verifiedBy: caller.email });
      const en = await db.collection('enrollments').where('paymentDocId', '==', a.paymentId).get();
      await Promise.all(en.docs.map((d) => d.ref.update({ paymentStatus: 'Failed' })));
    }
    await audit(caller, a.action, `coursePayments/${a.paymentId}`, { courseId: pay.courseId });
    return json({ ok: true });
  }

  if (a.action === 'setEnrollmentStatus') {
    const ref = db.collection('enrollments').doc(a.enrollmentId);
    const en = (await ref.get()).data();
    if (!en) return json({ error: 'Not found' }, 404);
    await ref.update({ paymentStatus: a.status, verifiedAt: FieldValue.serverTimestamp(), verifiedBy: caller.email });
    if (a.status === 'Verified' && en.userId) await db.doc(`users/${en.userId}`).set({ enrolledCourses: FieldValue.arrayUnion(en.courseId) }, { merge: true });
    if (a.status === 'Verified' && en.userEmail)
      await sendMail(en.userEmail, `Enrollment confirmed: ${en.courseTitle}`, layout('Enrollment confirmed', 'Your enrollment has been approved. See you in class!', [
        ['Course', en.courseTitle],
        ['Batch', en.batchSchedule ?? '—'],
      ])).catch(() => {});
    await audit(caller, 'setEnrollmentStatus', `enrollments/${a.enrollmentId}`, { status: a.status });
    return json({ ok: true });
  }

  if (a.action === 'setRole') {
    if (caller.role !== 'superAdmin') return json({ error: 'Only super admins can change roles.' }, 403);
    const target = await adminAuth().getUser(a.uid);
    if (SUPER_ADMINS.includes((target.email ?? '').toLowerCase()) && a.role !== 'superAdmin')
      return json({ error: 'This super admin is set in SUPER_ADMIN_EMAILS and cannot be demoted here.' }, 400);
    await adminAuth().setCustomUserClaims(a.uid, { ...target.customClaims, role: a.role });
    await db.doc(`users/${a.uid}`).set({ role: a.role }, { merge: true });
    await audit(caller, 'setRole', `users/${a.uid}`, { role: a.role });
    return json({ ok: true });
  }

  // Copy built-in recorded courses into Firestore so they can be edited; lesson links go to /private
  const batch = db.batch();
  for (const c of DEFAULT_RECORDED_COURSES) {
    const ref = db.collection('recordedCourses').doc(c.id);
    batch.set(ref, {
      ...c,
      modules: (c.modules ?? []).map((m) => ({
        ...m,
        lessons: m.lessons.map(({ videoUrl, pdfUrl, ...l }) => (l.isPreview ? { ...l, videoUrl, pdfUrl: pdfUrl ?? null } : { ...l, videoUrl: '' })),
      })),
    });
    for (const m of c.modules ?? [])
      for (const l of m.lessons) if (!l.isPreview) batch.set(ref.collection('private').doc(l.id), { videoUrl: l.videoUrl, pdfUrl: l.pdfUrl ?? null });
  }
  await batch.commit();
  await audit(caller, 'seedRecordedCourses', 'recordedCourses');
  return json({ ok: true });
}
