'use client';

import { ArrowRight, Clock } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { law } from '@/content/home';
import { cn } from '@/lib/utils';

/* Marker colour per card — echoes the tricolour on navy (bleu would vanish, so it becomes white) */
const MARK: Record<string, string> = {
  gold: 'bg-gold',
  bleu: 'bg-white',
  rouge: 'bg-rouge',
};

/** The one navy block in the middle of the page. */
export function LawSection() {
  const t = useT();
  return (
    <section id="urgency-law" className="relative bg-ink py-20 text-white md:py-28">
      <span aria-hidden className="tricolor absolute inset-x-0 top-0 h-[3px]" />
      <div className="container-x">
        <SectionHeading tag={t(law.tag)} title={t(law.title)} dark num="03" className="mb-10 md:mb-12">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
            <p className="max-w-2xl text-lg leading-relaxed text-white/70">{t(law.body)}</p>
            <div className="flex items-start gap-3 self-start rounded-lg border border-white/15 px-4 py-3 text-sm">
              <Clock size={18} className="mt-0.5 shrink-0 text-gold" />
              <span>
                <span className="block text-white/60">{t(law.deadlineLabel)}</span>
                <strong className="text-gold">{t(law.deadline)}</strong>
              </span>
            </div>
          </div>
        </SectionHeading>

        {/* Three requirement cards: large serif level numerals */}
        <div className="grid gap-4 md:grid-cols-3">
          {law.cards.map((c, i) => {
            const [exam, level] = c.tag.split(' ');
            return (
              <Reveal key={c.tag} delay={i * 0.08}>
                <article className="relative flex h-full flex-col rounded-[var(--radius)] border border-white/12 bg-white/[.04] p-7 md:p-8">
                  <span aria-hidden className={cn('absolute top-0 left-7 h-[3px] w-14 md:left-8', MARK[c.color])} />
                  <div className="flex items-baseline justify-between">
                    <p className="text-[11px] font-bold tracking-[0.18em] text-white/55 uppercase">{exam}</p>
                    <span className="section-num text-white/40">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <p className="font-display mt-3 text-[72px] leading-none font-semibold md:text-[84px]">{level}</p>
                  <h3 className="font-display mt-7 text-xl leading-snug font-semibold md:text-2xl">{t(c.title)}</h3>
                  <p className="font-display mt-1.5 text-base text-white/60 italic">{c.fr}</p>
                  <p className="mt-4 mb-6 text-[15px] leading-relaxed text-white/70">{t(c.desc)}</p>
                  <p className="mt-auto border-t border-white/12 pt-4 text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">République Française</p>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-white/15 pt-8 md:flex-row md:items-center">
          <p className="max-w-2xl text-[15px] leading-relaxed text-white/75 md:text-base">
            <strong className="text-white">{t(law.stripLead)}</strong> {t(law.strip)}
          </p>
          <Link href={{ pathname: '/enroll', query: { course: 'delf-a2' } }} className={btn('rouge', 'md', 'shrink-0')}>
            {t(law.cta)}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
