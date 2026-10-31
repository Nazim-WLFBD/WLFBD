import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb, getCaller, json } from '@/lib/firebase-admin';
import { ADMISSIONS_EMAIL, layout, sendMail } from '@/lib/email';
import { publicRateLimit, rateLimit } from '@/lib/rate-limit';
import { bdPhone } from '@/lib/phone';
import { COURSES_DATA, COMBO_OFFERS } from '@/data/courses';
import { BRAND_CONTACT } from '@/lib/brand';

const Body = z.object({
  courseId: z.string().max(60),
  batchId: z.string().max(60),
  batchLabel: z.string().max(120),
  name: z.string().trim().min(1).max(100),
  phone: bdPhone,
  email: z.string().trim().email().max(200),
  plan: z.enum(['full', 'half']),
  method: z.enum(['bkash', 'nagad', 'bank']),
  senderPhone: z.union([bdPhone, z.literal('')]),
  trxId: z
    .string()
    .trim()
    .max(40)
    .regex(/^[A-Za-z0-9]*$/, 'TrxID may only contain letters and digits'),
  locale: z.enum(['en', 'bn']).optional(),
});

/** Records a live-course enrollment (+ payment, if any) and emails the student and admissions. */
export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const field = String(parsed.error.issues[0]?.path[0] ?? '');
    return json({ error: 'Please check the form and try again.', code: 'invalid', field }, 400);
  }
  const d = parsed.data;

  // Price is decided on the server, never trusted from the browser
  const course = COURSES_DATA.find((c) => c.id === d.courseId);
  const combo = COMBO_OFFERS.find((c) => c.id === d.courseId);
  if (!course && !combo) return json({ error: 'Unknown course.', code: 'unknown_course' }, 400);
  const title = course?.title ?? combo!.title;
  const custom = !!course?.isCustomPricing;
  const fee = custom ? 0 : (course?.offerPrice ?? combo!.combinedFee);
  const amount = d.plan === 'half' ? Math.round(fee / 2) : fee;
  if (!custom && d.method === 'bkash' && (d.trxId.length < 6 || !d.senderPhone))
    return json({ error: 'bKash sender number and TrxID are required.', code: 'bkash_required', field: 'trxId' }, 400);

  // Limits: per signed-in user or per IP, per email address, and a global ceiling (this endpoint sends email)
  const caller = await getCaller(req);
  const email = d.email.toLowerCase();
  const [ok, emailOk] = await Promise.all([
    caller ? rateLimit(`enroll:${caller.uid}`, 5, 600) : publicRateLimit('enroll', req, 5, 600, 200),
    rateLimit(`enroll-email:${email}`, 3, 3600),
  ]);
  if (!ok || !emailOk) return json({ error: 'Too many submissions. Please wait a few minutes or contact us on WhatsApp.', code: 'rate_limited' }, 429);

  const db = adminDb();
  const now = FieldValue.serverTimestamp();
  const trxId = d.trxId.toUpperCase();
  let paymentDocId: string | null = null;

  if (!custom && d.method === 'bkash' && trxId) {
    // Same TrxID can't be claimed twice: `create()` on a fixed ID is atomic, unlike a query-then-add
    try {
      await db.doc(`trxIds/${trxId}`).create({ courseId: d.courseId, email, createdAt: now });
    } catch (e) {
      if ((e as { code?: number }).code === 6) return json({ error: 'This TrxID has already been submitted. Contact us if this is a mistake.', code: 'duplicate_trx', field: 'trxId' }, 409);
      throw e;
    }
  }
  if (!custom) {
    const p = await db.collection('coursePayments').add({
      userId: caller?.uid ?? null,
      userEmail: email,
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
    userEmail: email,
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
    locale: d.locale ?? 'en',
    enrolledAt: now,
  });

  const bn = d.locale === 'bn';
  const rows: [string, string][] = [
    [bn ? 'রেফারেন্স' : 'Reference', e.id.slice(0, 8).toUpperCase()],
    [bn ? 'শিক্ষার্থী' : 'Student', d.name],
    ['WhatsApp', d.phone],
    [bn ? 'ইমেইল' : 'Email', email],
    [bn ? 'কোর্স' : 'Course', title],
    [bn ? 'ব্যাচ' : 'Batch', d.batchLabel],
    ...(custom
      ? ([[bn ? 'ফি' : 'Fee', bn ? 'পরামর্শের অনুরোধ' : 'Consultation requested']] as [string, string][])
      : ([
          [bn ? 'পরিমাণ' : 'Amount', `৳${amount.toLocaleString()} (${d.plan === 'half' ? (bn ? '৫০% কিস্তি' : '50% installment') : bn ? 'সম্পূর্ণ' : 'full'})`],
          [bn ? 'পদ্ধতি' : 'Method', d.method === 'bkash' ? `bKash (${BRAND_CONTACT.bkashPersonal})` : d.method === 'nagad' ? 'Nagad' : bn ? 'ব্যাংক / অফিস' : 'Bank / Office'],
          ...(trxId ? ([['TrxID', trxId]] as [string, string][]) : []),
          [bn ? 'অবস্থা' : 'Status', bn ? 'যাচাইয়ের অপেক্ষায়' : 'Pending verification'],
        ] as [string, string][])),
  ];
  await Promise.allSettled([
    sendMail(
      email,
      bn ? `ভর্তির আবেদন পেয়েছি: ${title}` : `Enrollment received: ${title}`,
      layout(
        bn ? 'ভর্তির আবেদন পেয়েছি' : 'Enrollment received',
        bn ? 'ধন্যবাদ! আমাদের অ্যাডমিশন টিম আপনার তথ্য যাচাই করে শীঘ্রই আসন নিশ্চিত করবে।' : 'Thank you! Our admissions team will verify your details and confirm your seat shortly.',
        rows,
      ),
    ),
    sendMail(ADMISSIONS_EMAIL, `New enrollment: ${d.name} — ${title}`, layout('New enrollment', 'A new enrollment was submitted on the website.', rows)),
  ]);

  return json({ id: e.id });
}
