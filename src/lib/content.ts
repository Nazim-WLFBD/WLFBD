import 'server-only';
import { BATCH_SCHEDULES } from '@/data/schedules';
import { FAQ_DATA } from '@/data/faq';
import { TESTIMONIALS_DATA } from '@/data/testimonials';
import { COMBO_OFFERS, COURSES_DATA } from '@/data/courses';
import type { BatchSchedule, ComboOffer, Course, FAQItem, Testimonial } from '@/types';
import { adminDb } from './firebase-admin';

const ready = () => Boolean(process.env.FIREBASE_SERVICE_ACCOUNT || process.env.FIREBASE_AUTH_EMULATOR_HOST);

/** Admin-edited collection if it has documents, otherwise the built-in fallback. */
async function fromDb<T>(path: string, fallback: T[], keep: (d: Record<string, unknown>) => boolean = () => true): Promise<T[]> {
  if (!ready()) return fallback;
  try {
    const s = await adminDb().collection(path).get();
    if (s.empty) return fallback;
    // Strip Firestore timestamps so the data can be passed to client components.
    // Fields the database copy lacks (e.g. Bangla text added after seeding) come from the built-in item with the same id.
    const builtIn = new Map((fallback as unknown as { id: string }[]).map((f) => [f.id, f]));
    return s.docs
      .map((d) => {
        const { createdAt: _c, updatedAt: _u, ...rest } = d.data(); // eslint-disable-line @typescript-eslint/no-unused-vars
        return { ...(builtIn.get(d.id) ?? {}), ...rest, id: d.id };
      })
      .filter(keep) as T[];
  } catch (e) {
    console.warn(`content: ${path} fell back to built-in`, e);
    return fallback;
  }
}

export const getBatches = () =>
  fromDb<BatchSchedule>('batches', BATCH_SCHEDULES, (d) => d.status !== 'Closed').then((b) =>
    [...b].sort((x, y) => x.days.localeCompare(y.days) || x.timeSlot.localeCompare(y.timeSlot)),
  );
export const getFaq = () => fromDb<FAQItem>('faq', FAQ_DATA, (d) => d.published !== false);
export const getReviews = () => fromDb<Testimonial>('reviews', TESTIMONIALS_DATA, (d) => d.published === true);

// Live courses and combos are read by every page (header menu, enroll form, pricing in /api/enroll), so they get a
// short in-memory cache per server instance, like recorded courses, to keep a request flood from becoming a Firestore flood.
const TTL_MS = 60_000;
const courseCache = new Map<'courses' | 'combos', { at: number; data: unknown }>();

async function cached<T>(key: 'courses' | 'combos', load: () => Promise<T>): Promise<T> {
  const hit = courseCache.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.data as T;
  const data = await load();
  courseCache.set(key, { at: Date.now(), data });
  return data;
}

/** Built-in items keep their built-in order; items added only in the database follow in database order. */
function inBuiltInOrder<T extends { id: string }>(items: T[], builtIn: { id: string }[]): T[] {
  const rank = new Map(builtIn.map((b, i) => [b.id, i]));
  return [...items].sort((a, b) => (rank.get(a.id) ?? Infinity) - (rank.get(b.id) ?? Infinity));
}

const DEFAULT_TAG_COLOR = 'bg-blue-50 text-[#0055A4] border-blue-200';

/** Fills the fields a course created in the admin panel may lack but the UI relies on. */
function normaliseCourse(c: Course): Course {
  return {
    ...c,
    tagColor: c.tagColor || DEFAULT_TAG_COLOR,
    features: c.features ?? [],
    whatsappMessage:
      c.whatsappOnly && !c.whatsappMessage
        ? {
            en: `Bonjour! I am interested in ${c.title}. Could you share the details, schedule and fee?`,
            bn: `Bonjour! আমি ${c.banglaTitle || c.title} সম্পর্কে জানতে আগ্রহী। বিস্তারিত, সময়সূচি ও ফি জানাবেন?`,
          }
        : c.whatsappMessage,
  };
}

/** Published live courses: the admin-edited `courses` collection, or the built-in list until it is imported. */
export const getCourses = () =>
  cached('courses', () =>
    fromDb<Course>('courses', COURSES_DATA, (d) => d.published !== false).then((c) => inBuiltInOrder(c, COURSES_DATA).map(normaliseCourse)),
  );

/** Published combo offers from the `combos` collection, or the built-in list. */
export const getCombos = () =>
  cached('combos', () =>
    fromDb<ComboOffer>('combos', COMBO_OFFERS, (d) => d.published !== false).then((c) =>
      inBuiltInOrder(c, COMBO_OFFERS).map((o) => ({ ...o, courses: o.courses ?? [] })),
    ),
  );

/** Called after an admin saves a course or combo so the next request sees the change. */
export const invalidateCourseCache = () => courseCache.clear();
