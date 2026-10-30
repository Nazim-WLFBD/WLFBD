import { getCaller, json } from '@/lib/firebase-admin';
import { allRecordedCourses, toPublic } from '@/lib/recorded';
import { canAccessCourse } from '@/lib/access';

/** Course content for the classroom: full lesson links only for enrolled students and staff. */
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = (await allRecordedCourses()).find((c) => c.slug === slug);
  if (!course) return json({ error: 'Not found' }, 404);
  const caller = await getCaller(req);
  const access = caller ? await canAccessCourse(caller, course.id) : false;
  return json({ access, course: access ? course : toPublic(course) });
}
