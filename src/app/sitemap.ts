import type { MetadataRoute } from 'next';
import { RECORDED_COURSES } from '@/data/recordedCourses';
import { QUIZ_CATEGORIES } from '@/data/quizData';
import { routing } from '@/i18n/routing';
import { BRAND_META } from '@/lib/brand';
import { quizHref } from '@/lib/quiz';
import { getCourses } from '@/lib/content';
import { BLOG_PATHS } from '@/data/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await getCourses();
  const paths = [
    '',
    '/courses',
    ...courses.map((c) => `/courses/${c.id}`),
    '/recorded',
    ...RECORDED_COURSES.map((r) => `/recorded/${r.slug}`),
    '/quiz',
    ...QUIZ_CATEGORIES.map((q) => quizHref(q.slug)),
    '/crs-calculator',
    '/enroll',
    '/free-class',
    ...BLOG_PATHS,
  ];
  return paths.flatMap((p) =>
    routing.locales.map((locale) => ({
      url: `${BRAND_META.canonical}/${locale}${p}`,
      changeFrequency: 'weekly' as const,
      priority: p === '' ? 1 : p.startsWith('/courses') ? 0.9 : 0.7,
      alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, `${BRAND_META.canonical}/${l}${p}`])) },
    })),
  );
}
