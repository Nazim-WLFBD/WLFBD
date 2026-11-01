import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { FieldValue } from 'firebase-admin/firestore';
import { adminAuth, adminDb, getCaller, isAdminRole, json, SUPER_ADMINS, type Caller } from '@/lib/firebase-admin';
import { layout, sendMail } from '@/lib/email';
import { invalidateRecordedCache } from '@/lib/recorded';
import { invalidateCourseCache } from '@/lib/content';
import { DEFAULT_RECORDED_COURSES } from '@/data/recordedCourses.server';

const Action = z.discriminatedUnion('action', [
  z.object({ action: z.literal('approvePayment'), paymentId: z.string().max(60) }),
  z.object({ action: z.literal('rejectPayment'), paymentId: z.string().max(60), reason: z.string().max(300) }),
  z.object({ action: z.literal('setEnrollmentStatus'), enrollmentId: z.string().max(60), status: z.enum(['Verified', 'Failed', 'Pending']) }),
  z.object({ action: z.literal('setRole'), uid: z.string().max(128), role: z.enum(['student', 'instructor', 'admin', 'superAdmin']) }),
  z.object({ action: z.literal('seedRecordedCourses') }),
  z.object({ action: z.literal('setApproval'), uid: z.string().max(128), approval: z.enum(['pending', 'approved', 'rejected']) }),
  z.object({ action: z.literal('refreshRecordedCourses') }),
  z.object({ action: z.literal('refreshCourses') }),
  // Removes a rejected payment / failed enrollment (and its linked record). Live records can't be deleted.
  z.object({ action: z.literal('deletePayment'), paymentId: z.string().max(60) }),
  z.object({ action: z.literal('deleteEnrollment'), enrollmentId: z.string().max(60) }),
  z.object({
    action: z.literal('gradeWriting'),
    /** Firestore path of the attempt: users/{uid}/quizAttempts/{id} */
    attemptPath: z.string().regex(/^users\/[A-Za-z0-9_-]{1,128}\/quizAttempts\/[A-Za-z0-9_-]{1,128}$/),
    grades: z.array(z.object({ id: z.string().max(120), points: z.number().min(0).max(1000), comment: z.string().max(2000).optional() })).min(1).max(50),
  }),
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

const bnOf = (doc: Record<string, unknown> | undefined) => doc?.locale === 'bn';

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
    if (pay.status !== 'Pending') return json({ error: `This payment is already ${String(pay.status).toLowerCase()}.` }, 409);
    const en = await db.collection('enrollments').where('paymentDocId', '==', a.paymentId).limit(1).get();
    const bn = bnOf(en.docs[0]?.data());
    if (a.action === 'approvePayment') {
      await ref.update({ status: 'Verified', verifiedAt: FieldValue.serverTimestamp(), verifiedBy: caller.email });
      await unlock(pay.userId ?? null, pay.courseId, a.paymentId, caller);
      await sendMail(
        pay.userEmail,
        bn ? `পেমেন্ট যাচাই হয়েছে: ${pay.courseTitle}` : `Payment verified: ${pay.courseTitle}`,
        layout(
          bn ? 'আপনার আসন নিশ্চিত' : 'Your seat is confirmed',
          bn ? 'আপনার পেমেন্ট যাচাই করা হয়েছে। স্বাগতম!' : 'Your payment has been verified. Welcome aboard!',
          [
            [bn ? 'কোর্স' : 'Course', pay.courseTitle],
            [bn ? 'পরিমাণ' : 'Amount', `৳${pay.amount}`],
            ['TrxID', pay.trxId || '—'],
          ],
        ),
      ).catch(() => {});
    } else {
      await ref.update({ status: 'Rejected', rejectionReason: a.reason, verifiedAt: FieldValue.serverTimestamp(), verifiedBy: caller.email });
      const all = await db.collection('enrollments').where('paymentDocId', '==', a.paymentId).get();
      await Promise.all(all.docs.map((d) => d.ref.update({ paymentStatus: 'Failed' })));
      // Free the TrxID so the student can resubmit after fixing a typo
      if (pay.trxId) await db.doc(`trxIds/${pay.trxId}`).delete().catch(() => {});
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
    // Keep the linked payment record in step, as approvePayment/rejectPayment do the other way round
    if (typeof en.paymentDocId === 'string' && en.paymentDocId) {
      const payRef = db.collection('coursePayments').doc(en.paymentDocId);
      const pay = (await payRef.get()).data();
      if (pay) {
        if (a.status === 'Verified') await payRef.update({ status: 'Verified', verifiedAt: FieldValue.serverTimestamp(), verifiedBy: caller.email });
        else if (a.status === 'Failed') {
          await payRef.update({ status: 'Rejected', rejectionReason: 'Set from enrollment', verifiedAt: FieldValue.serverTimestamp(), verifiedBy: caller.email });
          // Free the TrxID so the student can resubmit after fixing a typo
          if (pay.trxId) await db.doc(`trxIds/${pay.trxId}`).delete().catch(() => {});
        } else await payRef.update({ status: 'Pending', rejectionReason: FieldValue.delete(), verifiedAt: FieldValue.delete(), verifiedBy: FieldValue.delete() });
      }
    }
    if (a.status === 'Verified' && en.userEmail) {
      const bn = bnOf(en);
      await sendMail(
        en.userEmail,
        bn ? `ভর্তি নিশ্চিত: ${en.courseTitle}` : `Enrollment confirmed: ${en.courseTitle}`,
        layout(bn ? 'ভর্তি নিশ্চিত' : 'Enrollment confirmed', bn ? 'আপনার ভর্তি অনুমোদিত হয়েছে। ক্লাসে দেখা হবে!' : 'Your enrollment has been approved. See you in class!', [
          [bn ? 'কোর্স' : 'Course', en.courseTitle],
          [bn ? 'ব্যাচ' : 'Batch', en.batchSchedule ?? '—'],
        ]),
      ).catch(() => {});
    }
    await audit(caller, 'setEnrollmentStatus', `enrollments/${a.enrollmentId}`, { status: a.status });
    return json({ ok: true });
  }

  if (a.action === 'setRole') {
    if (caller.role !== 'superAdmin') return json({ error: 'Only super admins can change roles.' }, 403);
    if (a.uid === caller.uid && a.role !== 'superAdmin') return json({ error: 'You cannot remove your own super admin role.' }, 400);
    const target = await adminAuth().getUser(a.uid);
    if (SUPER_ADMINS.includes((target.email ?? '').toLowerCase()) && a.role !== 'superAdmin')
      return json({ error: 'This super admin is set in SUPER_ADMIN_EMAILS and cannot be demoted here.' }, 400);
    await adminAuth().setCustomUserClaims(a.uid, { ...target.customClaims, role: a.role });
    // Force the user's next request to carry the new role instead of the cached one (tokens live for an hour)
    await adminAuth().revokeRefreshTokens(a.uid);
    await db.doc(`users/${a.uid}`).set({ role: a.role }, { merge: true });
    await audit(caller, 'setRole', `users/${a.uid}`, { role: a.role });
    return json({ ok: true });
  }

  if (a.action === 'setApproval') {
    const ref = db.doc(`users/${a.uid}`);
    const u = (await ref.get()).data();
    if (!u) return json({ error: 'User not found' }, 404);
    await ref.set({ approval: a.approval, approvedBy: caller.email, approvedAt: FieldValue.serverTimestamp() }, { merge: true });
    if (a.approval === 'approved' && u.approval !== 'approved' && u.email) {
      const bn = u.locale === 'bn';
      await sendMail(
        u.email,
        bn ? 'আপনার অ্যাকাউন্ট অনুমোদিত হয়েছে' : 'Your account has been approved',
        layout(bn ? 'অ্যাকাউন্ট অনুমোদিত' : 'Account approved', bn ? 'এখন লগইন করে আপনার ড্যাশবোর্ড ও কোর্স ব্যবহার করতে পারবেন।' : 'You can now log in and use your dashboard and courses.', [
          [bn ? 'ইমেইল' : 'Email', u.email],
        ]),
      ).catch(() => {});
    }
    await audit(caller, 'setApproval', `users/${a.uid}`, { approval: a.approval });
    return json({ ok: true });
  }

  if (a.action === 'deletePayment' || a.action === 'deleteEnrollment') {
    // Resolve both sides of the payment ↔ enrollment link, whichever one was clicked
    let payRef: FirebaseFirestore.DocumentReference | null = null;
    let enRefs: FirebaseFirestore.DocumentReference[] = [];
    if (a.action === 'deletePayment') {
      payRef = db.collection('coursePayments').doc(a.paymentId);
      enRefs = (await db.collection('enrollments').where('paymentDocId', '==', a.paymentId).get()).docs.map((d) => d.ref);
    } else {
      const enRef = db.collection('enrollments').doc(a.enrollmentId);
      const en = (await enRef.get()).data();
      if (!en) return json({ error: 'Enrollment not found' }, 404);
      enRefs = [enRef];
      if (en.paymentDocId) payRef = db.collection('coursePayments').doc(String(en.paymentDocId));
    }
    const pay = payRef ? (await payRef.get()).data() : undefined;
    const ens = (await Promise.all(enRefs.map((r) => r.get()))).map((s) => s.data()).filter(Boolean) as Record<string, unknown>[];
    if (a.action === 'deletePayment' && !pay) return json({ error: 'Payment not found' }, 404);
    // Only dead records may go: a verified or pending payment/enrollment is real business data
    const payDead = !pay || pay.status === 'Rejected';
    const ensDead = ens.every((e) => e.paymentStatus === 'Failed' || (e.paymentStatus === 'Consultation' && !pay));
    if (!payDead || !ensDead)
      return json({ error: 'Only rejected payments and failed enrollments can be deleted. Reject or mark it failed first.' }, 409);
    const batch = db.batch();
    if (payRef && pay) batch.delete(payRef);
    enRefs.forEach((r) => batch.delete(r));
    if (pay?.trxId) batch.delete(db.doc(`trxIds/${pay.trxId}`));
    await batch.commit();
    await audit(caller, a.action, a.action === 'deletePayment' ? `coursePayments/${a.paymentId}` : `enrollments/${a.enrollmentId}`, {
      courseId: pay?.courseId ?? ens[0]?.courseId ?? null,
      student: pay?.userEmail ?? ens[0]?.userEmail ?? null,
      removedEnrollments: enRefs.length,
      removedPayment: Boolean(pay),
    });
    return json({ ok: true });
  }

  if (a.action === 'refreshRecordedCourses') {
    invalidateRecordedCache();
    return json({ ok: true });
  }

  // "Publish changes now" in the Courses editor: drop the in-memory course cache and re-render every page
  // (courses appear in the header menu, enroll form and pricing, so the whole locale layout is revalidated)
  if (a.action === 'refreshCourses') {
    invalidateCourseCache();
    revalidatePath('/', 'layout');
    return json({ ok: true });
  }

  // Instructor marks the writing answers of one attempt; the marks are added to the auto score
  if (a.action === 'gradeWriting') {
    const ref = db.doc(a.attemptPath);
    const at = (await ref.get()).data();
    if (!at) return json({ error: 'Attempt not found' }, 404);
    if (at.reviewStatus !== 'pending') return json({ error: 'This attempt has already been reviewed.' }, 409);
    const pending = (Array.isArray(at.pendingReview) ? at.pendingReview : []) as { id: string; prompt?: string; answer?: string; points: number }[];
    if (!pending.length) return json({ error: 'Nothing to review on this attempt.' }, 409);
    // Every pending answer needs a mark, within that question's points
    const byId = new Map(pending.map((p) => [p.id, p]));
    for (const g of a.grades) {
      const p = byId.get(g.id);
      if (!p) return json({ error: `Unknown question ${g.id}` }, 400);
      if (g.points > Number(p.points)) return json({ error: `Points for "${p.prompt ?? g.id}" exceed the maximum of ${p.points}.` }, 400);
    }
    const missing = pending.filter((p) => !a.grades.some((g) => g.id === p.id));
    if (missing.length) return json({ error: `Every writing answer needs a mark (${missing.length} missing).` }, 400);

    const reviewed = a.grades.map((g) => ({ id: g.id, points: g.points, ...(g.comment?.trim() ? { comment: g.comment.trim() } : {}) }));
    const earned = reviewed.reduce((s, g) => s + g.points, 0);
    const pendingMax = pending.reduce((s, p) => s + Number(p.points), 0);
    const autoScore = Number(at.autoScore ?? at.totalScore ?? 0);
    const autoMax = Number(at.autoMax ?? at.maxScore ?? 0);
    const score = autoScore + earned;
    const maxScore = autoMax + pendingMax;
    const percentage = maxScore ? Math.round((score / maxScore) * 100) : 0;
    await ref.update({
      reviewed,
      score,
      totalScore: score,
      maxScore,
      percentage,
      reviewStatus: 'reviewed',
      status: 'reviewed',
      reviewedBy: caller.email,
      reviewedAt: FieldValue.serverTimestamp(),
    });

    if (at.userEmail) {
      const bn = at.locale === 'bn';
      const title = String(at.quizTitle ?? at.quizId ?? '');
      await sendMail(
        String(at.userEmail),
        bn ? `আপনার রাইটিং উত্তর মার্ক করা হয়েছে: ${title}` : `Your writing answer has been marked: ${title}`,
        layout(
          bn ? 'রাইটিং রিভিউ সম্পন্ন' : 'Writing review complete',
          bn
            ? 'একজন ইন্সট্রাক্টর আপনার রাইটিং উত্তর পড়ে মার্কিং করেছেন। আপনার আপডেট হওয়া স্কোর ড্যাশবোর্ডে দেখুন।'
            : 'An instructor has read and marked your writing answer. Your updated score is on your dashboard.',
          [
            [bn ? 'টেস্ট' : 'Test', title],
            [bn ? 'রাইটিং মার্ক' : 'Writing marks', `${earned} / ${pendingMax}`],
            [bn ? 'মোট স্কোর' : 'Total score', `${score} / ${maxScore} (${percentage}%)`],
            ...reviewed.filter((g) => g.comment).map((g, k): [string, string] => [bn ? `মন্তব্য ${k + 1}` : `Comment ${k + 1}`, g.comment!]),
          ],
        ),
      ).catch(() => {});
    }
    await audit(caller, 'gradeWriting', a.attemptPath, { score, maxScore, percentage, graded: reviewed.length });
    return json({ ok: true, score, maxScore, percentage });
  }

  // Copy built-in recorded courses into Firestore so they can be edited; lesson links go to /private.
  // Only runs on an empty collection, otherwise it would overwrite admin edits with the built-in placeholders.
  if (!(await db.collection('recordedCourses').limit(1).get()).empty) return json({ error: 'Courses are already in the database.' }, 409);
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
  invalidateRecordedCache();
  await audit(caller, 'seedRecordedCourses', 'recordedCourses');
  return json({ ok: true });
}
