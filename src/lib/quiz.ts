/** Public URL for a quiz. Strips the legacy "quiz/" prefix some slugs carry. */
export function quizHref(slug: string) {
  return '/quiz/' + slug.replace(/^quiz\//, '');
}
