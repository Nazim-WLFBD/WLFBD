'use client';

import { useEffect, useState } from 'react';
import { useT } from '@/i18n/t';
import { SECTIONS } from '@/content/nav';
import { ui } from '@/content/home';
import { cn } from '@/lib/utils';

/** Right-edge progress rail for the home page: shows and jumps to each section. */
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
    <nav
      aria-label={t(ui.pageSections)}
      className="fixed top-1/2 right-4 z-30 hidden -translate-y-1/2 flex-col gap-1 rounded-full border border-line bg-surface/80 p-1.5 backdrop-blur-md min-[1360px]:flex"
    >
      {SECTIONS.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          aria-label={t(s.label)}
          aria-current={active === s.id ? 'true' : undefined}
          className="group relative flex h-6 w-6 items-center justify-center"
        >
          <span
            className={cn(
              'block rounded-full transition-all duration-300',
              active === s.id ? 'h-2.5 w-2.5 bg-rouge' : 'h-1.5 w-1.5 bg-fg/30 group-hover:bg-fg/60',
            )}
          />
          <span className="pointer-events-none absolute right-8 rounded-full bg-ink px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-white opacity-0 transition group-hover:opacity-100">
            {t(s.label)}
          </span>
        </a>
      ))}
    </nav>
  );
}
