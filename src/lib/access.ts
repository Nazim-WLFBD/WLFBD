import 'server-only';
import { adminDb, isAdminRole, type Caller } from './firebase-admin';

/** True if the caller may watch every lesson of a recorded course. */
export async function canAccessCourse(caller: Caller, courseId: string) {
  if (isAdminRole(caller.role) || caller.role === 'instructor') return true;
  if (!caller.approved) return false;
  const user = await adminDb().collection('users').doc(caller.uid).get();
  return ((user.data()?.enrolledCourses as string[]) ?? []).includes(courseId);
}
