import 'server-only';
import { z } from 'zod';
import { BATCH_SCHEDULES } from '@/data/schedules';
import { FAQ_DATA } from '@/data/faq';
import { TESTIMONIALS_DATA } from '@/data/testimonials';
import { COMBO_OFFERS, COURSES_DATA } from '@/data/courses';
import type { BatchSchedule, ComboOffer, Course, FAQItem, Testimonial } from '@/types';
import type { Question } from '@/types/quiz';
import { adminDb } from './firebase-admin';

const ready = () => Boolean(process.env.FIREBASE_SERVICE_ACCOUNT || process.env.FIREBASE_AUTH_EMULATOR_HOST);

/* ── Shape checks for admin-edited documents ───────────────────────────────────────────────────────────────
 * Documents are typed by hand in the admin panel, so a typo (a price saved as text, a missing title) must not
 * take down every page that renders the collection. Core fields are required; everything else is lenient and
 * passes through. Invalid documents are skipped with a warning instead of crashing the render.
 */
const text = z.string();
const optText = z.string().optional();
const optNum = z.number().finite().optional();
const optList = z.array(z.string()).optional();

const CourseSchema = z
  .object({
    id: text,
    title: text.min(1),
    banglaTitle: optText,
    duration: optText,
    classCount: optNum,
    regularPrice: optNum,
    offerPrice: z.number().min(0).optional(),
    features: optList,
    banglaFeatures: optList,
    tagColor: optText,
    published: z.boolean().optional(),
  })
  .passthrough();

const ComboSchema = z
  .object({
    id: text,
    title: text.min(1),
    banglaTitle: optText,
    courses: optList,
    combinedFee: optNum,
    regularValue: optNum,
    published: z.boolean().optional(),
  })
  .passthrough();

const BatchSchema = z
  .object({
    id: text,
    days: text,
    timeSlot: text,
    dayKeys: optList,
    courseId: optText,
    batchName: optText,
    status: optText,
    seatsTotal: optNum,
    seatsTaken: optNum,
  })
  .passthrough();

const FaqSchema = z.object({ id: text, question: text.min(1), answer: text.min(1), banglaQuestion: optText, banglaAnswer: optText }).passthrough();

const ReviewSchema = z
  .object({ id: text, name: optText, studentName: optText, quote: optText, reviewText: optText, rating: optNum, displayOrder: optNum, published: z.boolean().optional() })
  .passthrough()
  .refine((r) => Boolean(r.name || r.studentName), { message: 'name or studentName is required' })
  .refine((r) => Boolean(r.quote || r.reviewText), { message: 'quote or reviewText is required' });

/** Admin-edited collection if it has documents, otherwise the built-in fallback. */
async function fromDb<T extends { id: string }>(
  path: string,
  fallback: T[],
  schema: z.ZodTypeAny,
  keep: (d: Record<string, unknown>) => boolean = () => true,
): Promise<T[]> {
  if (!ready()) return fallback;
  try {
    const s = await adminDb().collection(path).get();
    if (s.empty) return fallback;
    // Strip Firestore timestamps so the data can be passed to client components.
    // Fields the database copy lacks (e.g. Bangla text added after seeding) come from the built-in item with the same id.
    const builtIn = new Map(fallback.map((f) => [f.id, f]));
    const out: T[] = [];
    for (const d of s.docs) {
      const { createdAt: _c, updatedAt: _u, ...rest } = d.data(); // eslint-disable-line @typescript-eslint/no-unused-vars
      const merged = { ...(builtIn.get(d.id) ?? {}), ...rest, id: d.id } as Record<string, unknown>;
      const r = schema.safeParse(merged);
      if (!r.success) {
        console.warn(`content: skipped ${path}/${d.id}: ${r.error.issues.map((i) => `${i.path.join('.') || '(doc)'} ${i.message}`).join('; ')}`);
        continue;
      }
      if (keep(r.data as Record<string, unknown>)) out.push(r.data as T);
    }
    return out;
  } catch (e) {
    console.warn(`content: ${path} fell back to built-in`, e);
    return fallback;
  }
}

export async function getBatches(): Promise<BatchSchedule[]> {
  const b = await fromDb<BatchSchedule>('batches', BATCH_SCHEDULES, BatchSchema, (d) => d.status !== 'Closed');
  const batches = b.map((x) => ({ ...x, dayKeys: x.dayKeys ?? [], status: x.status ?? 'Open' }));
  try {
    return [...batches].sort((x, y) => String(x.days ?? '').localeCompare(String(y.days ?? '')) || String(x.timeSlot ?? '').localeCompare(String(y.timeSlot ?? '')));
  } catch (e) {
    console.warn('content: batches left unsorted', e);
    return batches;
  }
}
export const getFaq = () => fromDb<FAQItem>('faq', FAQ_DATA, FaqSchema, (d) => d.published !== false);
export const getReviews = () =>
  fromDb<Testimonial>('reviews', TESTIMONIALS_DATA, ReviewSchema, (d) => d.published === true).then((rs) =>
    rs.map((r) => ({ ...r, name: r.name || r.studentName || '', quote: r.quote || r.reviewText || '' })),
  );

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
  const title = c.title || c.id;
  const offerPrice = typeof c.offerPrice === 'number' ? c.offerPrice : typeof c.regularPrice === 'number' ? c.regularPrice : 0;
  return {
    ...c,
    title,
    banglaTitle: c.banglaTitle || title,
    duration: c.duration ?? '',
    classCount: typeof c.classCount === 'number' ? c.classCount : 0,
    regularPrice: typeof c.regularPrice === 'number' ? c.regularPrice : offerPrice,
    offerPrice,
    code: c.code ?? '',
    tag: c.tag ?? '',
    cefrLevel: c.cefrLevel ?? '',
    targetAudience: c.targetAudience ?? '',
    outcome: c.outcome ?? '',
    tagColor: c.tagColor || DEFAULT_TAG_COLOR,
    features: c.features ?? [],
    whatsappMessage:
      c.whatsappOnly && !c.whatsappMessage
        ? {
            en: `Bonjour! I am interested in ${title}. Could you share the details, schedule and fee?`,
            bn: `Bonjour! আমি ${c.banglaTitle || title} সম্পর্কে জানতে আগ্রহী। বিস্তারিত, সময়সূচি ও ফি জানাবেন?`,
          }
        : c.whatsappMessage,
  };
}

/** Published live courses: the admin-edited `courses` collection, or the built-in list until it is imported. */
export const getCourses = () =>
  cached('courses', () =>
    fromDb<Course>('courses', COURSES_DATA, CourseSchema, (d) => d.published !== false).then((c) => inBuiltInOrder(c, COURSES_DATA).map(normaliseCourse)),
  );

/** Published combo offers from the `combos` collection, or the built-in list. */
export const getCombos = () =>
  cached('combos', () =>
    fromDb<ComboOffer>('combos', COMBO_OFFERS, ComboSchema, (d) => d.published !== false).then((c) =>
      inBuiltInOrder(c, COMBO_OFFERS).map((o) => ({
        ...o,
        banglaTitle: o.banglaTitle || o.title,
        courses: o.courses ?? [],
        combinedFee: typeof o.combinedFee === 'number' ? o.combinedFee : 0,
        eligibility: o.eligibility ?? '',
        eligibilityBangla: o.eligibilityBangla ?? '',
        description: o.description ?? '',
      })),
    ),
  );

/** Called after an admin saves a course or combo so the next request sees the change. */
export const invalidateCourseCache = () => courseCache.clear();

/**
 * Questions an admin added to a quiz (`quizzes/{quizId}/questions`), read on the server so the page can ship
 * them without a client-side Firestore round trip. Marking notes (`modelAnswer`) never leave the server.
 */
export async function getAdminQuestions(quizId: string): Promise<Question[]> {
  if (!ready()) return [];
  try {
    const s = await adminDb().collection(`quizzes/${quizId}/questions`).get();
    return s.docs.map((d) => {
      const { createdAt: _c, updatedAt: _u, modelAnswer: _m, ...rest } = d.data(); // eslint-disable-line @typescript-eslint/no-unused-vars
      return { ...(rest as Question), id: d.id, quizId };
    });
  } catch (e) {
    console.warn(`content: quizzes/${quizId}/questions unavailable`, e);
    return [];
  }
}
