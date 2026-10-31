import { ArrowRight, Info, Lightbulb, TriangleAlert } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { btn } from '@/components/ui/Button';
import { headingId, type BlogBlock } from '@/data/blog';
import { cn } from '@/lib/utils';
import { Inline, isInternalPath } from './Inline';

const TONES = {
  info: { box: 'border-bleu bg-blue-soft', icon: Info, iconCls: 'text-bleu' },
  tip: { box: 'border-mint bg-surface-2', icon: Lightbulb, iconCls: 'text-mint' },
  warn: { box: 'border-rouge bg-red-soft', icon: TriangleAlert, iconCls: 'text-rouge' },
} as const;

/** Renders a post body (typed blocks) with readable article typography. No raw HTML is ever injected. */
export function PostBody({ blocks, locale }: { blocks: BlogBlock[]; locale: string }) {
  const bn = locale === 'bn';
  const heading = bn ? 'font-bangla font-bold' : 'font-display font-semibold';
  const copy = cn('text-[1.0625rem] text-fg/90', bn ? 'font-bangla leading-[1.9]' : 'leading-[1.8]');
  let h2 = 0;

  return (
    <div className="flex max-w-[68ch] flex-col gap-5">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'h2': {
            const id = headingId(h2++);
            const n = String(h2).padStart(2, '0');
            return (
              <h2 key={i} id={id} className={cn('hairline mt-8 scroll-mt-28 pt-6 text-[1.75rem] leading-tight text-balance text-fg md:text-[2rem]', heading)}>
                <span aria-hidden className="section-num mr-3 align-middle text-rouge">{n}</span>
                <Inline text={b.text} />
              </h2>
            );
          }
          case 'h3':
            return (
              <h3 key={i} className={cn('mt-3 text-[1.3rem] leading-snug text-fg', heading)}>
                <Inline text={b.text} />
              </h3>
            );
          case 'p':
            return (
              <p key={i} className={copy}>
                <Inline text={b.text} />
              </p>
            );
          case 'ul':
          case 'ol': {
            const List = b.type;
            return (
              <List
                key={i}
                className={cn(
                  copy,
                  'flex flex-col gap-2 pl-6 marker:font-semibold',
                  b.type === 'ul' ? 'list-disc marker:text-rouge' : 'list-decimal marker:font-display marker:text-rouge',
                )}
              >
                {b.items.map((item, j) => (
                  <li key={j} className="pl-1">
                    <Inline text={item} />
                  </li>
                ))}
              </List>
            );
          }
          case 'callout': {
            const tone = TONES[b.tone ?? 'info'];
            const Icon = tone.icon;
            return (
              <aside key={i} role="note" className={cn('my-2 flex gap-4 rounded-r-xl border-l-2 p-5 md:p-6', tone.box)}>
                <Icon size={20} aria-hidden className={cn('mt-0.5 shrink-0', tone.iconCls)} />
                <div className="min-w-0">
                  {b.title && <p className={cn('mb-1.5 text-[1.1rem] text-fg', bn ? 'font-bangla font-bold' : 'font-display font-semibold')}>{b.title}</p>}
                  <p className={cn(copy, 'text-base')}>
                    <Inline text={b.text} />
                  </p>
                </div>
              </aside>
            );
          }
          case 'cta':
            return (
              <div key={i} className="relative mt-8 overflow-hidden rounded-[var(--radius)] bg-ink p-7 text-white md:p-9 dark:ring-1 dark:ring-white/10">
                <div aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-rouge" />
                <div className="relative">
                  <p className={cn('text-2xl leading-tight text-balance md:text-[1.75rem]', bn ? 'font-bangla font-bold' : 'font-display font-semibold')}>
                    {b.title}
                  </p>
                  <p className={cn('mt-3 max-w-xl leading-relaxed text-white/75', bn && 'font-bangla')}>
                    <Inline text={b.text} linkClassName="font-semibold text-gold underline underline-offset-[3px] hover:text-white" />
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {isInternalPath(b.href) && (
                      <Link href={b.href} className={btn('rouge', 'md')}>
                        {b.label}
                        <ArrowRight size={16} aria-hidden className="transition group-hover:translate-x-0.5" />
                      </Link>
                    )}
                    {b.secondaryHref && b.secondaryLabel && isInternalPath(b.secondaryHref) && (
                      <Link href={b.secondaryHref} className={btn('ghost-light', 'md')}>
                        {b.secondaryLabel}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
        }
      })}
    </div>
  );
}
