'use client';

import { useEffect, useState } from 'react';
import { useT } from '@/i18n/t';
import { SECTIONS } from '@/content/nav';
import { ui } from '@/content/home';
import { cn } from '@/lib/utils';

/** Right-edge progress rail for the home page: slate ticks (visible on white and navy alike) with a red active marker. */
export function SectionRail() {
  const t = useT();
  const [active, setActive] = useState<string>('hero');

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav aria-label={t(ui.pageSections)} className="fixed top-1/2 right-5 z-30 hidden -translate-y-1/2 flex-col items-end gap-1 min-[1360px]:flex">
      {SECTIONS.map((s, i) => {
        const on = active === s.id;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-label={t(s.label)}
            aria-current={on ? 'true' : undefined}
            className="group relative flex h-7 items-center justify-end gap-2.5 pl-6"
          >
            <span
              className={cn(
                'section-num text-[10px] leading-none transition-opacity duration-300',
                on ? 'text-rouge opacity-100' : 'text-[#8b95a7] opacity-0 group-hover:opacity-100',
              )}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <span
              className={cn(
                'block h-px transition-all duration-300',
                on ? 'w-7 bg-rouge' : 'w-4 bg-[#8b95a7] group-hover:w-6 group-hover:bg-rouge',
              )}
            />
            <span className="pointer-events-none absolute top-1/2 right-full mr-10 -translate-y-1/2 rounded-md bg-ink px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap text-white opacity-0 transition group-hover:opacity-100">
              {t(s.label)}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
