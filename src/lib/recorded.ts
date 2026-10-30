import 'server-only';
import { DEFAULT_RECORDED_COURSES } from '@/data/recordedCourses.server';
import type { RecordedCourse } from '@/types';
import { adminDb } from './firebase-admin';

const serverReady = () => Boolean(process.env.FIREBASE_SERVICE_ACCOUNT || process.env.FIREBASE_AUTH_EMULATOR_HOST);

/** Full course data (with lesson links): admin-edited Firestore copy if present, else built-in. */
export async function allRecordedCourses(): Promise<RecordedCourse[]> {
  if (serverReady()) {
    try {
      const snap = await adminDb().collection('recordedCourses').get();
      if (!snap.empty) {
        const courses = await Promise.all(
          snap.docs.map(async (d) => {
            const c = { ...(d.data() as RecordedCourse), id: d.id };
            // Paid lesson links are stored separately in recordedCourses/{id}/private/{lessonId}
            const priv = await d.ref.collection('private').get();
            const links = Object.fromEntries(priv.docs.map((p) => [p.id, p.data()]));
            c.modules = (c.modules ?? []).map((m) => ({
              ...m,
              lessons: m.lessons.map((l) => ({ ...l, ...(links[l.id] ?? {}) })),
            }));
            return c;
          }),
        );
        return courses.filter((c) => c.published !== false);
      }
    } catch (e) {
      console.warn('recordedCourses: falling back to built-in data', e);
    }
  }
  return DEFAULT_RECORDED_COURSES;
}

/** Same data with video/PDF links removed from every non-preview lesson. */
export function toPublic(c: RecordedCourse): RecordedCourse {
  return {
    ...c,
    modules: (c.modules ?? []).map((m) => ({
      ...m,
      lessons: m.lessons.map((l) => (l.isPreview ? l : { ...l, videoUrl: '', pdfUrl: undefined })),
    })),
  };
}

export async function publicRecordedCourses() {
  return (await allRecordedCourses()).map(toPublic);
}
