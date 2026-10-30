import { randomInt } from 'crypto';
import { FieldValue } from 'firebase-admin/firestore';
import { adminDb, getCaller, json } from '@/lib/firebase-admin';
import { allRecordedCourses } from '@/lib/recorded';
import { canAccessCourse } from '@/lib/access';

/** Issues (or returns) the completion certificate once every lesson is marked complete. */
export async function POST(req: Request) {
  const caller = await getCaller(req);
  if (!caller) return json({ error: 'Unauthorized' }, 401);
  const { courseId } = (await req.json().catch(() => ({}))) as { courseId?: string };
  const course = (await allRecordedCourses()).find((c) => c.id === courseId);
  if (!course || !course.hasCertificate) return json({ error: 'No certificate for this course.' }, 400);
  if (!(await canAccessCourse(caller, course.id))) return json({ error: 'Not enrolled.' }, 403);

  const db = adminDb();
  const lessonIds = (course.modules ?? []).flatMap((m) => m.lessons.map((l) => l.id));
  const progress = (await db.doc(`users/${caller.uid}/courseProgress/${course.id}`).get()).data();
  const done = new Set<string>((progress?.completedLessonIds as string[]) ?? []);
  if (!lessonIds.every((id) => done.has(id))) return json({ error: 'Complete every lesson first.' }, 400);

  const existing = await db.collection('certificates').where('userId', '==', caller.uid).where('courseId', '==', course.id).limit(1).get();
  if (!existing.empty) return json({ certificateNumber: existing.docs[0].id });

  const user = (await db.collection('users').doc(caller.uid).get()).data() ?? {};
  const number = `WLF-BD-${randomInt(100000, 999999)}`;
  await db.collection('certificates').doc(number).set({
    certificateNumber: number,
    userId: caller.uid,
    userName: user.displayName ?? caller.email,
    courseId: course.id,
    courseTitle: course.title,
    cefrLevel: course.level,
    issueDate: new Date().toISOString().slice(0, 10),
    createdAt: FieldValue.serverTimestamp(),
  });
  return json({ certificateNumber: number });
}
