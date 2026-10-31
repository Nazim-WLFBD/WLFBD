/**
 * Lesson media links are typed by admins, so they are checked before being rendered:
 * only known video players may be embedded, and documents must be https.
 */
const EMBED_HOSTS = /^https:\/\/(www\.youtube(-nocookie)?\.com\/embed\/[\w-]+|player\.vimeo\.com\/video\/\d+)([/?#]|$)/;

/** The URL if it points at an allowed video player, otherwise null. */
export function safeEmbedUrl(url: string | undefined | null) {
  const u = (url ?? '').trim();
  return EMBED_HOSTS.test(u) ? u : null;
}

/** The URL if it is a plain https link, otherwise null. */
export function safeHttpsUrl(url: string | undefined | null) {
  const u = (url ?? '').trim();
  try {
    return new URL(u).protocol === 'https:' ? u : null;
  } catch {
    return null;
  }
}

export const EMBED_HINT = 'Use a YouTube embed link (https://www.youtube-nocookie.com/embed/VIDEO_ID) or a Vimeo player link.';
