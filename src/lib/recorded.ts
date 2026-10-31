import 'server-only';
import { DEFAULT_RECORDED_COURSES } from '@/data/recordedCourses.server';
import type { RecordedCourse } from '@/types';
import { adminDb } from './firebase-admin';

const serverReady = () => Boolean(process.env.FIREBASE_SERVICE_ACCOUNT || process.env.FIREBASE_AUTH_EMULATOR_HOST);

// Short in-memory cache per server instance: the public API routes are unauthenticated, so
// without it a request flood would turn into a Firestore read flood.
const TTL_MS = 60_000;
let cache: { at: number; data: RecordedCourse[] } | null = null;

/** Course index (prices, modules, lesson metadata) without paid lesson links. */
export async function recordedCourseIndex(): Promise<RecordedCourse[]> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.data;
  let data = DEFAULT_RECORDED_COURSES;
  if (serverReady()) {
    try {
      const snap = await adminDb().collection('recordedCourses').get();
      if (!snap.empty)
        data = snap.docs
          // Fields the database copy doesn't have yet (e.g. Bangla text added later) fall back to the built-in course
          .map((d) => ({ ...DEFAULT_RECORDED_COURSES.find((c) => c.id === d.id), ...(d.data() as RecordedCourse), id: d.id }))
          .filter((c) => c.published !== false);
    } catch (e) {
      console.warn('recordedCourses: falling back to built-in data', e);
    }
  }
  cache = { at: Date.now(), data };
  return data;
}

/** Called after an admin saves a course so the next request sees the change. */
export const invalidateRecordedCache = () => (cache = null);

/** One course with every lesson link (paid ones come from recordedCourses/{id}/private). */
export async function fullRecordedCourse(course: RecordedCourse): Promise<RecordedCourse> {
  const builtIn = DEFAULT_RECORDED_COURSES.find((c) => c.id === course.id);
  // Built-in data already carries its links; Firestore-backed courses keep them in the private subcollection
  const fromDb = serverReady() && course !== builtIn;
  let links: Record<string, { videoUrl?: string; pdfUrl?: string | null }> = {};
  if (fromDb) {
    try {
      const priv = await adminDb().collection('recordedCourses').doc(course.id).collection('private').get();
      links = Object.fromEntries(priv.docs.map((p) => [p.id, p.data()]));
    } catch (e) {
      console.warn('recordedCourses: private links unavailable', e);
    }
  }
  return {
    ...course,
    modules: (course.modules ?? []).map((m) => ({
      ...m,
      lessons: m.lessons.map((l) => ({ ...l, ...(links[l.id] ?? {}), pdfUrl: links[l.id]?.pdfUrl ?? l.pdfUrl ?? undefined })),
    })),
  };
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
  return (await recordedCourseIndex()).map(toPublic);
}
