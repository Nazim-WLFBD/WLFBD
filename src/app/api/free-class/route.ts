import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb, json } from '@/lib/firebase-admin';
import { ADMISSIONS_EMAIL, layout, sendMail } from '@/lib/email';
import { publicRateLimit, rateLimit } from '@/lib/rate-limit';
import { bdPhone } from '@/lib/phone';
import { FREE_CLASS_INTERESTS } from '@/data/freeClass';

const Body = z.object({
  name: z.string().trim().min(2).max(100),
  phone: bdPhone,
  whatsapp: z.union([bdPhone, z.literal('')]).optional(),
  email: z.string().trim().email().max(200),
  interest: z.enum(FREE_CLASS_INTERESTS.map((i) => i.id) as [string, ...string[]]),
  locale: z.enum(['en', 'bn']).optional(),
  source: z.enum(['page', 'mobile-sheet']).optional(),
});

/** Free class sign-up: stored for the admin panel, with a confirmation email to the student. */
export async function POST(req: Request) {
  const p = Body.safeParse(await req.json().catch(() => null));
  if (!p.success) return json({ error: 'Please check the form and try again.', code: 'invalid', field: String(p.error.issues[0]?.path[0] ?? '') }, 400);
  const d = p.data;
  const email = d.email.toLowerCase();
  const [ok, emailOk] = await Promise.all([publicRateLimit('free-class', req, 5, 600, 300), rateLimit(`free-class-email:${email}`, 3, 86400)]);
  if (!ok || !emailOk) return json({ error: 'Too many submissions. Please try again later.', code: 'rate_limited' }, 429);

  const interest = FREE_CLASS_INTERESTS.find((i) => i.id === d.interest)!;
  const ref = await adminDb().collection('freeClassRegistrations').add({
    name: d.name,
    phone: d.phone,
    whatsapp: d.whatsapp || d.phone,
    email,
    interest: d.interest,
    interestLabel: interest.label.en,
    locale: d.locale ?? 'en',
    source: d.source ?? 'page',
    status: 'New',
    submittedAt: FieldValue.serverTimestamp(),
  });

  const bn = d.locale === 'bn';
  const rows: [string, string][] = [
    [bn ? 'নাম' : 'Name', d.name],
    [bn ? 'ফোন' : 'Phone', d.phone],
    ['WhatsApp', d.whatsapp || d.phone],
    [bn ? 'ইমেইল' : 'Email', email],
    [bn ? 'আগ্রহের কোর্স' : 'Interested in', bn ? interest.label.bn : interest.label.en],
  ];
  await Promise.allSettled([
    sendMail(
      email,
      bn ? 'ফ্রি ক্লাসে আপনার রেজিস্ট্রেশন সম্পন্ন হয়েছে' : 'You are registered for a free class',
      layout(
        bn ? 'ফ্রি ক্লাস রেজিস্ট্রেশন সম্পন্ন' : 'Free class registration received',
        bn ? 'ধন্যবাদ! পরবর্তী ফ্রি ক্লাসের সময় ও লিংক আমরা WhatsApp-এ পাঠিয়ে দেব।' : 'Thank you! We will send the time and joining link of the next free class on WhatsApp.',
        rows,
      ),
    ),
    sendMail(ADMISSIONS_EMAIL, `Free class registration: ${d.name}`, layout('New free class registration', 'Someone registered for a free class on the website.', rows)),
  ]);
  return json({ id: ref.id });
}
