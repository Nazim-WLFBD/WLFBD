/**
 * Copies the built-in content into Firestore so it can be edited in the admin portal.
 * Only fills collections that are still empty, so it never overwrites admin edits.
 *
 *   npm run seed
 */
import { readFileSync } from 'fs';
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { BATCH_SCHEDULES } from '../src/data/schedules';
import { FAQ_DATA } from '../src/data/faq';
import { TESTIMONIALS_DATA } from '../src/data/testimonials';
import { DEFAULT_RECORDED_COURSES } from '../src/data/recordedCourses.server';

// Read FIREBASE_SERVICE_ACCOUNT from .env.local
const env = readFileSync('.env.local', 'utf8');
const line = env.split('\n').find((l) => l.startsWith('FIREBASE_SERVICE_ACCOUNT='));
if (!line || line.trim() === 'FIREBASE_SERVICE_ACCOUNT=') throw new Error('Set FIREBASE_SERVICE_ACCOUNT in .env.local first.');
initializeApp({ credential: cert(JSON.parse(line.slice('FIREBASE_SERVICE_ACCOUNT='.length))) });
const db = getFirestore();

async function seed(path: string, rows: { id: string }[], map: (r: never) => object = (r) => r) {
  if (!(await db.collection(path).limit(1).get()).empty) return console.log(`skip ${path} (already has data)`);
  const batch = db.batch();
  for (const r of rows) {
    const { id, ...data } = map(r as never) as { id: string };
    batch.set(db.collection(path).doc(id ?? r.id), { ...data, createdAt: FieldValue.serverTimestamp() });
  }
  await batch.commit();
  console.log(`seeded ${path}: ${rows.length}`);
}

async function main() {
  await seed('batches', BATCH_SCHEDULES);
  await seed('faq', FAQ_DATA);
  await seed('reviews', TESTIMONIALS_DATA, (r: (typeof TESTIMONIALS_DATA)[number]) => ({ ...r, published: true }));

  // Recorded courses: paid lesson links go to the protected /private subcollection
  if (!(await db.collection('recordedCourses').limit(1).get()).empty) return console.log('skip recordedCourses (already has data)');
  const batch = db.batch();
  for (const c of DEFAULT_RECORDED_COURSES) {
    const ref = db.collection('recordedCourses').doc(c.id);
    batch.set(ref, {
      ...c,
      modules: (c.modules ?? []).map((m) => ({
        ...m,
        lessons: m.lessons.map(({ videoUrl, pdfUrl, ...l }) =>
          l.isPreview ? { ...l, videoUrl, pdfUrl: pdfUrl ?? null } : { ...l, videoUrl: '', pdfUrl: null },
        ),
      })),
    });
    for (const m of c.modules ?? [])
      for (const l of m.lessons)
        if (!l.isPreview) batch.set(ref.collection('private').doc(l.id), { videoUrl: l.videoUrl, pdfUrl: l.pdfUrl ?? null });
  }
  await batch.commit();
  console.log(`seeded recordedCourses: ${DEFAULT_RECORDED_COURSES.length} (lesson links protected)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
