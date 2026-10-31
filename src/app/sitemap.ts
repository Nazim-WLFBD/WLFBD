import type { MetadataRoute } from 'next';
import { COURSES_DATA } from '@/data/courses';
import { RECORDED_COURSES } from '@/data/recordedCourses';
import { QUIZ_CATEGORIES } from '@/data/quizData';
import { routing } from '@/i18n/routing';
import { BRAND_META } from '@/lib/brand';
import { quizHref } from '@/lib/quiz';
import { BLOG_PATHS } from '@/data/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '',
    '/courses',
    ...COURSES_DATA.map((c) => `/courses/${c.id}`),
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
