'use client';

import * as Accordion from '@radix-ui/react-accordion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Inline } from './Inline';

/** FAQ accordion for a post (items already localised). The same Q&As are also emitted as FAQPage JSON-LD by the page. */
export function BlogFaq({ items, bn }: { items: { q: string; a: string }[]; bn: boolean }) {
  return (
    <Accordion.Root type="multiple" defaultValue={['q0']} className="flex flex-col gap-3">
      {items.map((f, i) => (
        <Accordion.Item
          key={i}
          value={`q${i}`}
          className="overflow-hidden rounded-[20px] border border-line bg-surface data-[state=open]:border-fg/25"
        >
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center gap-4 rounded-[20px] p-5 text-left md:p-6">
              <span className={cn('flex-1 text-[16px] font-bold text-fg md:text-[17px]', bn && 'font-bangla')}>{f.q}</span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line transition group-data-[state=open]:rotate-45 group-data-[state=open]:bg-ink group-data-[state=open]:text-white dark:group-data-[state=open]:bg-white dark:group-data-[state=open]:text-ink">
                <Plus size={16} aria-hidden />
              </span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-[collapse_.25s_ease] data-[state=open]:animate-[expand_.3s_ease]">
            <p className={cn('px-5 pb-6 leading-relaxed text-muted md:px-6', bn && 'font-bangla leading-[1.85]')}>
              <Inline text={f.a} />
            </p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
