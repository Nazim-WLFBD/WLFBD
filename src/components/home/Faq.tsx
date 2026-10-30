'use client';

import { useEffect, useMemo, useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { Plus, Search } from 'lucide-react';
import { useT } from '@/i18n/t';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { btn } from '@/components/ui/Button';
import { FAQ_DATA } from '@/data/faq';
import { faq as copy } from '@/content/home';
import { WA_MESSAGES, waLink } from '@/lib/brand';
import { cn } from '@/lib/utils';
import type { FAQItem } from '@/types';
import { WhatsAppGlyph } from '@/components/layout/FloatingActions';

type Cat = (typeof copy.categories)[number];

export function Faq({ items = FAQ_DATA }: { items?: FAQItem[] }) {
  const t = useT();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<Cat>('All');
  const [open, setOpen] = useState<string>('f1');

  // Open an answer linked as /#faq-<id> (e.g. from the search palette)
  useEffect(() => {
    const sync = () => {
      const m = window.location.hash.match(/^#faq-(.+)$/);
      if (m) {
        setCat('All');
        setQuery('');
        setOpen(m[1]);
        requestAnimationFrame(() => document.getElementById(`faq-${m[1]}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
      }
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((f) => {
      if (cat !== 'All' && f.category !== cat) return false;
      if (!q) return true;
      return (
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        f.banglaQuestion.includes(query.trim()) ||
        f.banglaAnswer.includes(query.trim())
      );
    });
  }, [items, query, cat]);

  return (
    <section id="faq" className="relative bg-bg py-24 md:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.3fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading tag={t(copy.tag)} title={t(copy.title)} intro={t(copy.intro)} className="mb-8 md:mb-8" />
          <Reveal className="rounded-[var(--radius)] bg-ink p-6 text-white">
            <p className="font-display text-xl font-semibold">{t(copy.customTitle)}</p>
            <a href={waLink(WA_MESSAGES.question)} target="_blank" rel="noopener" className={btn('gold', 'md', 'mt-4')}>
              <WhatsAppGlyph size={18} />
              {t(copy.customCta)}
            </a>
          </Reveal>
        </div>

        <div>
          <Reveal>
            <label className="flex items-center gap-3 rounded-full border border-line bg-surface px-5 focus-within:border-fg/40">
              <Search size={18} className="text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t(copy.search)}
                className="h-14 w-full bg-transparent text-[15px] outline-none placeholder:text-muted"
                aria-label={t(copy.search)}
              />
            </label>
            <div className="mt-4 flex flex-wrap gap-2">
              {copy.categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  aria-pressed={cat === c}
                  className={cn(
                    'rounded-full px-4 py-1.5 text-sm font-semibold transition',
                    cat === c ? 'bg-rouge text-white' : 'border border-line hover:bg-fg/5',
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>

          <Accordion.Root type="single" collapsible value={open} onValueChange={setOpen} className="mt-8 flex flex-col gap-3">
            {list.map((f) => (
              <Accordion.Item
                key={f.id}
                value={f.id}
                id={`faq-${f.id}`}
                className="scroll-mt-28 overflow-hidden rounded-[20px] border border-line bg-surface data-[state=open]:border-fg/25 data-[state=open]:shadow-[var(--shadow-lift)]"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="group flex w-full items-center gap-4 p-5 text-left md:p-6">
                    <span aria-hidden className="hidden rounded-md bg-surface-2 px-2 py-1 text-[10px] font-bold tracking-wider text-muted uppercase sm:inline">
                      {f.category}
                    </span>
                    <span className="flex-1 text-[16px] font-bold md:text-[17px]">{t.locale === 'bn' ? f.banglaQuestion : f.question}</span>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line transition group-data-[state=open]:rotate-45 group-data-[state=open]:bg-ink group-data-[state=open]:text-white">
                      <Plus size={16} />
                    </span>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=closed]:animate-[collapse_.25s_ease] data-[state=open]:animate-[expand_.3s_ease]">
                  <p className="px-5 pb-6 leading-relaxed whitespace-pre-line text-muted md:px-6">
                    {t.locale === 'bn' ? f.banglaAnswer : f.answer}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
            ))}
            {list.length === 0 && <p className="rounded-2xl border border-dashed border-line p-8 text-center text-muted">{t(copy.none)}</p>}
          </Accordion.Root>
        </div>
      </div>
    </section>
  );
}
