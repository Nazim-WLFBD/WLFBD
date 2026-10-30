'use client';

import { AlertTriangle, ArrowRight, Clock } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Tilt } from '@/components/ui/Tilt';
import { law } from '@/content/home';
import { cn } from '@/lib/utils';

const ACCENT: Record<string, string> = {
  gold: 'from-gold/90 to-[#f5d58c]',
  bleu: 'from-bleu to-[#5b7cff]',
  rouge: 'from-rouge to-[#ff6b7d]',
};

export function LawSection() {
  const t = useT();
  return (
    <section id="urgency-law" className="relative overflow-hidden bg-ink py-24 text-white md:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(closest-side,rgba(224,36,58,.25),transparent)]" />
        <div className="dots absolute inset-0 opacity-20" />
      </div>
      <div className="container-x relative">
        <Reveal className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-rouge px-3.5 py-1.5 text-[11px] font-extrabold tracking-[0.16em] uppercase">
              <AlertTriangle size={14} className="animate-bounce" />
              {t(law.tag)}
            </span>
            <h2 className="font-display mt-6 text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.04] font-semibold text-balance">
              {t(law.title)}
            </h2>
          </div>
          <div className="flex flex-col gap-5">
            <p className="leading-relaxed text-white/70">{t(law.body)}</p>
            <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3">
              <Clock size={18} className="text-gold" />
              <span className="text-sm">
                <span className="text-white/70">{t(law.deadlineLabel)}</span>{' '}
                <strong className="text-gold">{t(law.deadline)}</strong>
              </span>
            </div>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {law.cards.map((c, i) => (
            <Reveal key={c.tag} delay={i * 0.1}>
              <Tilt max={6} className="rounded-[20px]">
                {/* Styled after a French residence card */}
                <article className="relative aspect-[1.58/1] overflow-hidden rounded-[20px] bg-[#f3efe6] p-5 text-ink shadow-[0_30px_60px_-25px_rgba(0,0,0,.7)]">
                  <div className={cn('absolute inset-x-0 top-0 h-14 bg-gradient-to-r', ACCENT[c.color])} />
                  <div className="relative flex items-start justify-between">
                    <div>
                      <p className="text-[9px] font-bold tracking-[0.2em] text-ink/70 uppercase">République Française</p>
                      <p className="text-[11px] font-semibold text-ink/80 italic">{c.fr}</p>
                    </div>
                    <span className="rounded-md bg-ink px-2 py-1 font-mono text-xs font-bold text-white">{c.tag}</span>
                  </div>
                  <div className="relative mt-6 flex gap-4">
                    <div className="flex h-[72px] w-[58px] shrink-0 items-end justify-center overflow-hidden rounded-md bg-ink/10">
                      <svg viewBox="0 0 40 50" className="h-14 w-11 text-ink/30" fill="currentColor" aria-hidden>
                        <circle cx="20" cy="17" r="9" />
                        <path d="M3 50c0-10 8-17 17-17s17 7 17 17Z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="font-display text-lg leading-tight font-semibold">{c.title}</p>
                      <p className="mt-1.5 text-[12.5px] leading-snug text-ink/70">{t(c.desc)}</p>
                    </div>
                  </div>
                  <p className="absolute right-5 bottom-3 left-5 truncate font-mono text-[9px] tracking-[0.3em] text-ink/35">
                    {'IDFRA<<' + c.tag.replace(' ', '<') + '<<<<<<<<<<<<<<<<<<<<<'}
                  </p>
                </article>
              </Tilt>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex flex-col items-start justify-between gap-5 rounded-[var(--radius)] border border-white/10 bg-white/[.04] p-6 md:flex-row md:items-center">
          <p className="text-white/80">
            <strong className="text-white">{t(law.stripLead)}</strong> {t(law.strip)}
          </p>
          <Link
            href={{ pathname: '/enroll', query: { course: 'delf-a2' } }}
            className={btn('rouge', 'md', 'shrink-0 shadow-[0_0_0_0_rgba(224,36,58,.6)] hover:shadow-[0_0_0_10px_rgba(224,36,58,0)]')}
          >
            {t(law.cta)}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
