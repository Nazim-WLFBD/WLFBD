import { ListTree } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  items: { id: string; text: string }[];
  title: string;
  bn: boolean;
  className?: string;
}

/** "On this page" list of anchor links to the post's H2 sections. */
export function Toc({ items, title, bn, className }: Props) {
  if (items.length < 2) return null;
  return (
    <nav aria-label={title} className={className}>
      <p className="mb-3 flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] text-muted uppercase">
        <ListTree size={14} aria-hidden />
        {title}
      </p>
      <ol className={cn('flex flex-col gap-0.5 border-l border-line text-[14px]', bn && 'font-bangla')}>
        {items.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className="-ml-px block border-l-2 border-transparent py-1.5 pr-2 pl-4 leading-snug text-muted transition hover:border-rouge hover:text-fg"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
