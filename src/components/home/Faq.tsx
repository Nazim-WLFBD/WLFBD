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
import { waLink, waMessage } from '@/lib/brand';
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
        // Instant: Lenis owns the page scroll and swallows native smooth scrolls
        requestAnimationFrame(() => document.getElementById(`faq-${m[1]}`)?.scrollIntoView({ block: 'center' }));
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
    <section id="faq" className="relative bg-surface py-20 md:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.3fr] lg:gap-16">
        {/* Sticky heading column (min-w-0: long Bangla titles must not widen the grid past the phone viewport) */}
        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <SectionHeading tag={t(copy.tag)} title={t(copy.title)} intro={t(copy.intro)} num="10" className="mb-8 md:mb-10" />
          <Reveal className="card accent-top p-6 md:p-7">
            <p className="font-display text-xl font-semibold md:text-2xl">{t(copy.customTitle)}</p>
            <a href={waLink(waMessage('question', t.locale))} target="_blank" rel="noopener" className={btn('rouge', 'md', 'mt-5 w-full sm:w-auto')}>
              <WhatsAppGlyph size={18} />
              {t(copy.customCta)}
            </a>
          </Reveal>
        </div>

        <div className="min-w-0">
          <Reveal>
            <label className="flex w-full min-w-0 items-center gap-3 rounded-lg border border-line bg-bg px-4 focus-within:border-fg/40">
              <Search size={18} className="shrink-0 text-muted" />
              <input
                type="search"
                enterKeyHint="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t(copy.search)}
                className="h-12 w-full min-w-0 bg-transparent text-base outline-none placeholder:text-muted sm:text-[15px]"
                aria-label={t(copy.search)}
              />
            </label>

            {/* Category tabs: underlined text, scrollable on phones */}
            <div className="no-scrollbar -mx-4 mt-5 flex max-w-[calc(100%+32px)] gap-1 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:max-w-full sm:px-0">
              {copy.categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  aria-pressed={cat === c}
                  className={cn(
                    'relative -mb-px min-h-11 min-w-11 shrink-0 border-b-2 px-3 py-3 text-sm font-semibold whitespace-nowrap transition-colors',
                    cat === c ? 'border-rouge text-fg' : 'border-transparent text-muted hover:text-fg',
                  )}
                >
                  {t(copy.categoryLabels[c])}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Accordion rows separated by hairlines */}
          <Accordion.Root type="single" collapsible value={open} onValueChange={setOpen} className="mt-4 border-b border-line">
            {list.map((f) => (
              <Accordion.Item key={f.id} value={f.id} id={`faq-${f.id}`} className="hairline scroll-mt-28">
                <Accordion.Header>
                  <Accordion.Trigger className="group flex min-h-11 w-full items-center gap-4 py-5 text-left md:gap-6">
                    <span aria-hidden className="hidden w-24 shrink-0 text-[10px] font-bold tracking-[0.16em] text-muted uppercase sm:inline">
                      {t(copy.categoryLabels[f.category])}
                    </span>
                    <span className="font-display flex-1 text-lg leading-snug font-semibold transition-colors group-hover:text-rouge md:text-xl">
                      {t.locale === 'bn' ? f.banglaQuestion : f.question}
                    </span>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line transition group-data-[state=open]:rotate-45 group-data-[state=open]:border-rouge group-data-[state=open]:bg-rouge group-data-[state=open]:text-white">
                      <Plus size={16} />
                    </span>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=closed]:animate-[collapse_.25s_ease] data-[state=open]:animate-[expand_.3s_ease]">
                  <p className="pb-6 text-[15px] leading-relaxed whitespace-pre-line text-muted sm:pl-28 md:pl-30 md:text-base">
                    {t.locale === 'bn' ? f.banglaAnswer : f.answer}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
            ))}
            {list.length === 0 && <p className="hairline py-10 text-center text-muted">{t(copy.none)}</p>}
          </Accordion.Root>
        </div>
      </div>
    </section>
  );
}
