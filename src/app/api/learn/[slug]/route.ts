import { getCaller, json } from '@/lib/firebase-admin';
import { fullRecordedCourse, recordedCourseIndex, toPublic } from '@/lib/recorded';
import { canAccessCourse } from '@/lib/access';
import { publicRateLimit } from '@/lib/rate-limit';

/** Course content for the classroom: full lesson links only for enrolled students and staff. */
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!/^[\w-]{1,80}$/.test(slug)) return json({ error: 'Not found' }, 404);
  if (!(await publicRateLimit('learn', req, 60, 60))) return json({ error: 'Too many requests' }, 429);
  const course = (await recordedCourseIndex()).find((c) => c.slug === slug);
  if (!course) return json({ error: 'Not found' }, 404);
  const caller = await getCaller(req);
  const access = caller ? await canAccessCourse(caller, course.id) : false;
  // Paid links are only read from the database once the caller is known to be allowed
  return json({ access, course: access ? await fullRecordedCourse(course) : toPublic(course) });
}
