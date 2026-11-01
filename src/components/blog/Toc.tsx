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
      <p className="eyebrow mb-3 text-rouge">
        <ListTree size={13} aria-hidden />
        {title}
      </p>
      <ol className={cn('flex flex-col border-t border-line text-[14px]', bn && 'font-bangla')}>
        {items.map((h, i) => (
          <li key={h.id} className="border-b border-line">
            <a
              href={`#${h.id}`}
              className="group flex min-h-11 items-center gap-3 py-2 pr-2 leading-snug text-muted transition hover:text-fg"
            >
              <span aria-hidden className="h-[2px] w-0 shrink-0 bg-rouge transition-all group-hover:w-3" />
              <span className="section-num shrink-0">{String(i + 1).padStart(2, '0')}</span>
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
