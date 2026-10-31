'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Inline } from './Inline';

/** FAQ accordion for a post (items already localised). The same Q&As are also emitted as FAQPage JSON-LD by the page. */
export function BlogFaq({ items, bn }: { items: { q: string; a: string }[]; bn: boolean }) {
  return (
    <Accordion.Root type="multiple" defaultValue={['q0']} className="card flex flex-col px-5 md:px-6">
      {items.map((f, i) => (
        <Accordion.Item key={i} value={`q${i}`} className="hairline first:border-t-0">
          <Accordion.Header>
            <Accordion.Trigger className="group flex min-h-14 w-full items-center gap-4 py-5 text-left">
              <span className="font-display shrink-0 text-base font-semibold text-rouge tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <span className={cn('flex-1 text-[16px] font-semibold text-fg md:text-[17px]', bn ? 'font-bangla' : 'font-display')}>{f.q}</span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line text-muted transition group-data-[state=open]:rotate-45 group-data-[state=open]:border-ink group-data-[state=open]:text-fg dark:group-data-[state=open]:border-white">
                <Plus size={16} aria-hidden />
              </span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-[collapse_.25s_ease] data-[state=open]:animate-[expand_.3s_ease]">
            <p className={cn('pb-6 pl-9 leading-relaxed text-muted', bn && 'font-bangla leading-[1.85]')}>
              <Inline text={f.a} />
            </p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
