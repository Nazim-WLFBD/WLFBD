import { Fragment } from 'react';
import { Link } from '@/i18n/navigation';

const TOKEN = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;

/** Only same-site paths like "/courses/delf-a1" (optionally with #hash or ?query) become links. */
export function isInternalPath(href: string) {
  return /^\/(?!\/)[A-Za-z0-9\-._~/#?=&%]*$/.test(href);
}

/**
 * Renders the blog's tiny inline markup as React nodes (never as raw HTML):
 *   [text](/internal/path) → locale-aware <Link>;  **bold** → <strong>.
 * Anything that is not an internal path is rendered as plain text.
 */
export function Inline({ text, linkClassName }: { text: string; linkClassName?: string }) {
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(TOKEN)) {
    const at = m.index ?? 0;
    if (at > last) out.push(<Fragment key={key++}>{text.slice(last, at)}</Fragment>);
    if (m[3] !== undefined) {
      out.push(
        <strong key={key++} className="font-semibold text-fg">
          {m[3]}
        </strong>,
      );
    } else if (isInternalPath(m[2])) {
      out.push(
        <Link
          key={key++}
          href={m[2]}
          className={
            linkClassName ??
            'font-semibold text-bleu underline decoration-bleu/35 decoration-2 underline-offset-[3px] transition-colors hover:text-rouge hover:decoration-rouge'
          }
        >
          {m[1]}
        </Link>,
      );
    } else {
      out.push(<Fragment key={key++}>{m[1]}</Fragment>);
    }
    last = at + m[0].length;
  }
  if (last < text.length) out.push(<Fragment key={key++}>{text.slice(last)}</Fragment>);
  return <>{out}</>;
}
