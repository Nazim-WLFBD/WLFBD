import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb, getCaller, json } from '@/lib/firebase-admin';
import { recordedCourseIndex } from '@/lib/recorded';
import { rateLimit } from '@/lib/rate-limit';
import { bdPhone } from '@/lib/phone';
import { ADMISSIONS_EMAIL, layout, sendMail } from '@/lib/email';

const Body = z.object({
  courseId: z.string().max(60),
  senderPhone: bdPhone,
  trxId: z.string().trim().min(6).max(40).regex(/^[A-Za-z0-9]+$/),
  notes: z.string().max(300).optional(),
  locale: z.enum(['en', 'bn']).optional(),
});

/** Records a bKash payment claim for a recorded course (Pending until an admin verifies it). */
export async function POST(req: Request) {
  const caller = await getCaller(req);
  if (!caller) return json({ error: 'Please log in first.', code: 'login_required' }, 401);
  const p = Body.safeParse(await req.json().catch(() => null));
  if (!p.success) return json({ error: 'Check the bKash number and TrxID.', code: 'invalid', field: String(p.error.issues[0]?.path[0] ?? '') }, 400);
  if (!(await rateLimit(`pay:${caller.uid}`, 5, 3600))) return json({ error: 'Too many attempts. Try again later.', code: 'rate_limited' }, 429);

  const course = (await recordedCourseIndex()).find((c) => c.id === p.data.courseId);
  if (!course) return json({ error: 'Unknown course.', code: 'unknown_course' }, 400);

  const db = adminDb();
  const trxId = p.data.trxId.toUpperCase();
  const now = FieldValue.serverTimestamp();
  try {
    await db.doc(`trxIds/${trxId}`).create({ courseId: course.id, userId: caller.uid, createdAt: now });
  } catch (e) {
    if ((e as { code?: number }).code === 6) return json({ error: 'This TrxID has already been submitted.', code: 'duplicate_trx', field: 'trxId' }, 409);
    throw e;
  }

  const user = (await db.collection('users').doc(caller.uid).get()).data() ?? {};
  const pay = await db.collection('coursePayments').add({
    userId: caller.uid,
    userEmail: caller.email,
    userName: user.displayName ?? '',
    userPhone: user.phoneNumber ?? '',
    courseId: course.id,
    courseTitle: course.title,
    courseType: 'recorded',
    amount: course.offerPrice, // price comes from the server, not the browser
    paymentMethod: 'bkash',
    senderPhone: p.data.senderPhone,
    trxId,
    notes: p.data.notes ?? '',
    status: 'Pending',
    submittedAt: now,
  });
  await db.collection('enrollments').add({
    userId: caller.uid,
    userName: user.displayName ?? '',
    userEmail: caller.email,
    userPhone: user.phoneNumber ?? '',
    courseId: course.id,
    courseTitle: course.title,
    courseType: 'recorded',
    batchSchedule: 'Self-paced',
    paymentMethod: 'bkash',
    paymentStatus: 'Pending',
    transactionId: trxId,
    amountPaid: course.offerPrice,
    paymentDocId: pay.id,
    locale: p.data.locale ?? 'en',
    enrolledAt: now,
  });
  await sendMail(
    ADMISSIONS_EMAIL,
    `bKash payment to verify: ${course.title}`,
    layout('Recorded course payment', 'Verify this TrxID in bKash, then approve it in the admin portal.', [
      ['Student', `${user.displayName ?? ''} (${caller.email})`],
      ['Course', course.title],
      ['Amount', `৳${course.offerPrice}`],
      ['Sender', p.data.senderPhone],
      ['TrxID', trxId],
    ]),
  ).catch(() => {});
  return json({ id: pay.id });
}
