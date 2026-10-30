import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb, getCaller, json } from '@/lib/firebase-admin';
import { ADMISSIONS_EMAIL, layout, sendMail } from '@/lib/email';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { COURSES_DATA, COMBO_OFFERS } from '@/data/courses';
import { BRAND_CONTACT } from '@/lib/brand';

const phone = z.string().regex(/^(\+?88)?01[3-9]\d{8}$/, 'Invalid mobile number');

const Body = z.object({
  courseId: z.string(),
  batchId: z.string().max(60),
  batchLabel: z.string().max(120),
  name: z.string().trim().min(1).max(100),
  phone,
  email: z.string().email().max(200),
  plan: z.enum(['full', 'half']),
  method: z.enum(['bkash', 'nagad', 'bank']),
  senderPhone: z.union([phone, z.literal('')]),
  trxId: z.string().trim().max(40),
});

/** Records a live-course enrollment (+ payment, if any) and emails the student and admissions. */
export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ error: 'Please check the form and try again.' }, 400);
  const d = parsed.data;

  // Price is decided on the server, never trusted from the browser
  const course = COURSES_DATA.find((c) => c.id === d.courseId);
  const combo = COMBO_OFFERS.find((c) => c.id === d.courseId);
  if (!course && !combo) return json({ error: 'Unknown course.' }, 400);
  const title = course?.title ?? combo!.title;
  const custom = !!course?.isCustomPricing;
  const fee = custom ? 0 : (course?.offerPrice ?? combo!.combinedFee);
  const amount = d.plan === 'half' ? Math.round(fee / 2) : fee;
  if (!custom && d.method === 'bkash' && (d.trxId.length < 6 || !d.senderPhone))
    return json({ error: 'bKash sender number and TrxID are required.' }, 400);

  const caller = await getCaller(req);
  const ok = await rateLimit(`enroll:${caller?.uid ?? clientIp(req)}`, 5, 600);
  if (!ok) return json({ error: 'Too many submissions. Please wait a few minutes or contact us on WhatsApp.' }, 429);

  const db = adminDb();
  const now = FieldValue.serverTimestamp();
  const trxId = d.trxId.toUpperCase();
  let paymentDocId: string | null = null;

  if (!custom && d.method === 'bkash' && trxId) {
    // Same TrxID can't be claimed twice
    const dup = await db.collection('coursePayments').where('trxId', '==', trxId).limit(1).get();
    if (!dup.empty) return json({ error: 'This TrxID has already been submitted. Contact us if this is a mistake.' }, 409);
  }
  if (!custom) {
    const p = await db.collection('coursePayments').add({
      userId: caller?.uid ?? null,
      userEmail: d.email,
      userName: d.name,
      userPhone: d.phone,
      courseId: d.courseId,
      courseTitle: title,
      courseType: 'live',
      amount,
      plan: d.plan,
      paymentMethod: d.method,
      senderPhone: d.senderPhone,
      trxId,
      status: 'Pending',
      submittedAt: now,
    });
    paymentDocId = p.id;
  }
  const e = await db.collection('enrollments').add({
    userId: caller?.uid ?? null,
    userName: d.name,
    userEmail: d.email,
    userPhone: d.phone,
    courseId: d.courseId,
    courseTitle: title,
    courseType: 'live',
    batchId: d.batchId,
    batchSchedule: d.batchLabel,
    paymentMethod: custom ? 'consultation' : d.method,
    paymentStatus: custom ? 'Consultation' : 'Pending',
    transactionId: trxId,
    amountPaid: amount,
    paymentDocId,
    enrolledAt: now,
  });

  const rows: [string, string][] = [
    ['Reference', e.id.slice(0, 8).toUpperCase()],
    ['Student', d.name],
    ['WhatsApp', d.phone],
    ['Email', d.email],
    ['Course', title],
    ['Batch', d.batchLabel],
    ...(custom
      ? ([['Fee', 'Consultation requested']] as [string, string][])
      : ([
          ['Amount', `৳${amount.toLocaleString()} (${d.plan === 'half' ? '50% installment' : 'full'})`],
          ['Method', d.method === 'bkash' ? `bKash (${BRAND_CONTACT.bkashPersonal})` : d.method],
          ...(trxId ? ([['TrxID', trxId]] as [string, string][]) : []),
          ['Status', 'Pending verification'],
        ] as [string, string][])),
  ];
  await Promise.allSettled([
    sendMail(
      d.email,
      `Enrollment received: ${title}`,
      layout('Enrollment received', 'Thank you! Our admissions team will verify your details and confirm your seat shortly.', rows),
    ),
    sendMail(ADMISSIONS_EMAIL, `New enrollment: ${d.name} — ${title}`, layout('New enrollment', 'A new enrollment was submitted on the website.', rows)),
  ]);

  return json({ id: e.id });
}
