import 'server-only';
import { BATCH_SCHEDULES } from '@/data/schedules';
import { FAQ_DATA } from '@/data/faq';
import { TESTIMONIALS_DATA } from '@/data/testimonials';
import type { BatchSchedule, FAQItem, Testimonial } from '@/types';
import { adminDb } from './firebase-admin';

const ready = () => Boolean(process.env.FIREBASE_SERVICE_ACCOUNT || process.env.FIREBASE_AUTH_EMULATOR_HOST);

/** Admin-edited collection if it has documents, otherwise the built-in fallback. */
async function fromDb<T>(path: string, fallback: T[], keep: (d: Record<string, unknown>) => boolean = () => true): Promise<T[]> {
  if (!ready()) return fallback;
  try {
    const s = await adminDb().collection(path).get();
    if (s.empty) return fallback;
    // Strip Firestore timestamps so the data can be passed to client components
    return s.docs
      .map((d) => {
        const { createdAt: _c, updatedAt: _u, ...rest } = d.data(); // eslint-disable-line @typescript-eslint/no-unused-vars
        return { ...rest, id: d.id };
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
