import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb, getCaller, json } from '@/lib/firebase-admin';
import { allRecordedCourses } from '@/lib/recorded';
import { rateLimit } from '@/lib/rate-limit';
import { ADMISSIONS_EMAIL, layout, sendMail } from '@/lib/email';

const Body = z.object({
  courseId: z.string(),
  senderPhone: z.string().regex(/^(\+?88)?01[3-9]\d{8}$/),
  trxId: z.string().trim().min(6).max(40),
  notes: z.string().max(300).optional(),
});

/** Records a bKash payment claim for a recorded course (Pending until an admin verifies it). */
export async function POST(req: Request) {
  const caller = await getCaller(req);
  if (!caller) return json({ error: 'Please log in first.' }, 401);
  const p = Body.safeParse(await req.json().catch(() => null));
  if (!p.success) return json({ error: 'Check the bKash number and TrxID.' }, 400);
  if (!(await rateLimit(`pay:${caller.uid}`, 5, 3600))) return json({ error: 'Too many attempts. Try again later.' }, 429);

  const course = (await allRecordedCourses()).find((c) => c.id === p.data.courseId);
  if (!course) return json({ error: 'Unknown course.' }, 400);

  const db = adminDb();
  const trxId = p.data.trxId.toUpperCase();
  const dup = await db.collection('coursePayments').where('trxId', '==', trxId).limit(1).get();
  if (!dup.empty) return json({ error: 'This TrxID has already been submitted.' }, 409);

  const user = (await db.collection('users').doc(caller.uid).get()).data() ?? {};
  const now = FieldValue.serverTimestamp();
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
