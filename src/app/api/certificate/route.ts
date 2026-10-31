import { randomInt } from 'crypto';
import { z } from 'zod';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb, getCaller, json } from '@/lib/firebase-admin';
import { recordedCourseIndex } from '@/lib/recorded';
import { canAccessCourse } from '@/lib/access';
import { rateLimit } from '@/lib/rate-limit';
import { dhakaDate } from '@/lib/dates';

const Body = z.object({ courseId: z.string().min(1).max(80) });

/** Issues (or returns) the completion certificate once every lesson is marked complete. */
export async function POST(req: Request) {
  const caller = await getCaller(req);
  if (!caller) return json({ error: 'Unauthorized' }, 401);
  if (!caller.approved) return json({ error: 'Your account is awaiting admin approval.', code: 'not_approved' }, 403);
  const p = Body.safeParse(await req.json().catch(() => null));
  if (!p.success) return json({ error: 'Bad request' }, 400);
  if (!(await rateLimit(`cert:${caller.uid}`, 10, 3600))) return json({ error: 'Too many attempts. Try again later.', code: 'rate_limited' }, 429);

  const course = (await recordedCourseIndex()).find((c) => c.id === p.data.courseId);
  if (!course || !course.hasCertificate) return json({ error: 'No certificate for this course.', code: 'no_certificate' }, 400);
  if (!(await canAccessCourse(caller, course.id))) return json({ error: 'Not enrolled.', code: 'not_enrolled' }, 403);

  const db = adminDb();
  const lessonIds = (course.modules ?? []).flatMap((m) => m.lessons.map((l) => l.id));
  const progress = (await db.doc(`users/${caller.uid}/courseProgress/${course.id}`).get()).data();
  const done = new Set<string>((progress?.completedLessonIds as string[]) ?? []);
  if (lessonIds.length === 0 || !lessonIds.every((id) => done.has(id))) return json({ error: 'Complete every lesson first.', code: 'incomplete' }, 400);

  const user = (await db.collection('users').doc(caller.uid).get()).data() ?? {};
  const holderName = String(user.displayName ?? '').trim();
  // The name is printed on a public page, so the email address is never used as a stand-in
  if (!holderName) return json({ error: 'Add your full name in your profile first, then request the certificate.', code: 'name_required' }, 400);

  // One certificate per student per course; a `create()` on a random number can't overwrite an existing one
  const marker = db.doc(`users/${caller.uid}/certificates/${course.id}`);
  for (let attempt = 0; attempt < 5; attempt++) {
    const number = `WLF-BD-${randomInt(100000, 999999)}`;
    try {
      const result = await db.runTransaction(async (tx) => {
        const existing = await tx.get(marker);
        if (existing.exists) return existing.data()!.certificateNumber as string;
        const ref = db.collection('certificates').doc(number);
        tx.create(ref, {
          certificateNumber: number,
          userId: caller.uid,
          userName: holderName,
          courseId: course.id,
          courseTitle: course.title,
          cefrLevel: course.level,
          issueDate: dhakaDate(),
          createdAt: FieldValue.serverTimestamp(),
        });
        tx.create(marker, { certificateNumber: number, courseId: course.id, createdAt: FieldValue.serverTimestamp() });
        return number;
      });
      return json({ certificateNumber: result });
    } catch (e) {
      // ALREADY_EXISTS (code 6): the random number is taken, try another
      if ((e as { code?: number }).code !== 6) throw e;
    }
  }
  return json({ error: 'Could not issue a certificate number. Please try again.' }, 500);
}
