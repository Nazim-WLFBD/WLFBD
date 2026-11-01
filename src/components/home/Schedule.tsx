'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Lightbulb, Monitor } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { BATCH_SCHEDULES } from '@/data/schedules';
import { schedule } from '@/content/home';
import { cn } from '@/lib/utils';
import type { BatchSchedule, DayKey } from '@/types';

const DAYS: DayKey[] = ['fri', 'sat', 'sun', 'mon'];
/* Fri/Sun batches read blue, Sat/Mon batches read red: flat tints with a solid left rule */
const PAIR: Record<string, { cell: string; num: string }> = {
  fs: { cell: 'bg-blue-soft text-bleu border-bleu', num: 'text-bleu' },
  sm: { cell: 'bg-red-soft text-rouge border-rouge', num: 'text-rouge' },
};

function pairOf(b: BatchSchedule) {
  return b.dayKeys.includes('fri') ? 'fs' : 'sm';
}
function slotOf(b: BatchSchedule) {
  return b.timeSlot.startsWith('07') ? '7pm' : '9pm';
}

export function Schedule({ batches = BATCH_SCHEDULES }: { batches?: BatchSchedule[] }) {
  const t = useT();
  const [hover, setHover] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null); // batch row briefly highlighted after tapping its cell
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bn = t.locale === 'bn';
  const nameOf = (b: BatchSchedule) => (bn ? (b.banglaBatchName ?? b.batchName) : b.batchName);
  /** Short day names for a batch, e.g. "Fri / Sun" (bn "শুক্র / রবি"). */
  const shortDays = (b: BatchSchedule) =>
    b.dayKeys
      .map((d) => schedule.days[d as keyof typeof schedule.days])
      .filter(Boolean)
      .map((d) => t(d))
      .join(' / ') || (bn ? b.banglaDays : b.days);

  useEffect(() => () => void (flashTimer.current && clearTimeout(flashTimer.current)), []);

  // Tap (or click) a timetable cell: scroll to its batch row and highlight it for a moment. Hover still links
  // cell and row on desktop; this makes the link work on touch screens too.
  const showBatch = (id: string) => {
    document.getElementById(`row-${id}`)?.scrollIntoView({ block: 'center' });
    setFlash(id);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(null), 2000);
  };

  return (
    <section id="schedule" className="relative bg-surface py-20 md:py-28">
      <div className="container-x">
        <SectionHeading tag={t(schedule.tag)} title={t(schedule.title)} intro={t(schedule.intro)} num="06" />

        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14 [&>*]:min-w-0">
          {/* Weekly timetable */}
          <Reveal>
            <div className="card overflow-hidden">
              <div className="grid grid-cols-[72px_repeat(4,minmax(0,1fr))] border-b border-line text-center text-xs font-bold tracking-[0.12em] text-muted uppercase sm:grid-cols-[120px_repeat(4,minmax(0,1fr))] sm:tracking-[0.16em]">
                <div className="p-3 text-left sm:p-4">{t(schedule.bst)}</div>
                {DAYS.map((d) => (
                  <div key={d} className="border-l border-line px-1 py-4 sm:p-4">
                    {t(schedule.days[d as keyof typeof schedule.days])}
                  </div>
                ))}
              </div>
              {schedule.slots.map((slot) => (
                <div key={slot.id} className="grid grid-cols-[72px_repeat(4,minmax(0,1fr))] border-b border-line last:border-0 sm:grid-cols-[120px_repeat(4,minmax(0,1fr))]">
                  <div className="flex items-center p-3 sm:p-4">
                    <span className="eyebrow leading-tight tracking-[0.08em] text-fg before:hidden sm:tracking-[0.18em] sm:before:block sm:before:w-4">{t(slot.label)}</span>
                  </div>
                  {DAYS.map((d) => {
                    const b = batches.find((x) => x.dayKeys.includes(d) && slotOf(x) === slot.id);
                    return (
                      <div key={d} className="border-l border-line p-1.5 sm:p-2.5">
                        {b && (
                          <button
                            type="button"
                            onClick={() => showBatch(b.id)}
                            onMouseEnter={() => setHover(b.id)}
                            onMouseLeave={() => setHover(null)}
                            aria-label={`${t({ en: 'Show batch', bn: 'ব্যাচ দেখুন' })} ${String(batches.indexOf(b) + 1).padStart(2, '0')}: ${nameOf(b)}`}
                            className={cn(
                              'flex h-full min-h-[72px] w-full cursor-pointer flex-col justify-between gap-1 rounded-md border-l-2 p-2 text-left text-xs font-bold transition-opacity duration-300 sm:min-h-[88px] sm:p-3',
                              PAIR[pairOf(b)].cell,
                              (hover || flash) && hover !== b.id && flash !== b.id && 'opacity-40',
                            )}
                          >
                            <span className="font-display text-base leading-none font-semibold sm:text-lg">{String(batches.indexOf(b) + 1).padStart(2, '0')}</span>
                            {/* Phones: short day names (the full ones don't fit a quarter-width cell) */}
                            <span className="leading-tight sm:hidden">{shortDays(b)}</span>
                            <span className="hidden leading-tight sm:block">{bn ? b.banglaDays : b.days}</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-muted">
              <Monitor size={15} className="mt-1 shrink-0" />
              <span>
                <strong className="text-fg">{t(schedule.formatTitle)}:</strong> {t(schedule.format)}
              </span>
            </p>
          </Reveal>

          {/* Batch list: hairline rows with a red book button */}
          <div>
            <div className="border-b border-line">
              {batches.map((b, i) => {
                const seatsLeft = b.seatsTotal != null && b.seatsTaken != null ? Math.max(0, b.seatsTotal - b.seatsTaken) : null;
                return (
                  <Reveal key={b.id} delay={i * 0.05}>
                    <div
                      id={`row-${b.id}`}
                      onMouseEnter={() => setHover(b.id)}
                      onMouseLeave={() => setHover(null)}
                      className={cn(
                        'hairline flex items-center gap-4 py-4 transition-colors duration-500',
                        hover === b.id && 'bg-surface-2/60',
                        flash === b.id && 'bg-gold/15 ring-2 ring-gold/50 ring-inset',
                      )}
                    >
                      <span className={cn('font-display w-8 shrink-0 text-2xl leading-none font-semibold', PAIR[pairOf(b)].num)}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="leading-snug font-bold">{nameOf(b)}</p>
                        <p className="text-sm text-muted">{bn ? (b.banglaTimeSlot ?? b.timeSlot) : b.timeSlot}</p>
                        {seatsLeft != null && (
                          <p className="mt-1 text-xs font-semibold text-rouge">
                            {t(schedule.seats)} {seatsLeft}/{b.seatsTotal}
                          </p>
                        )}
                      </div>
                      <Link href={{ pathname: '/enroll', query: { batch: b.id } }} aria-label={`${t(schedule.book)}: ${nameOf(b)}`} className={btn('rouge', 'sm', 'min-w-11 shrink-0 px-3')}>
                        <span className="hidden sm:inline">{t(schedule.book)}</span>
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </Reveal>
                );
              })}
            </div>
            <Reveal delay={0.3} className="mt-6 flex items-start gap-3 rounded-[var(--radius)] border border-line p-5 text-sm">
              <Lightbulb size={18} className="mt-0.5 shrink-0 text-rouge" />
              <div>
                <p className="font-bold">{t(schedule.customTitle)}</p>
                <p className="mt-1 leading-relaxed text-muted">{t(schedule.custom)}</p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* What every class covers */}
        <Reveal className="mt-16 md:mt-20">
          <p className="eyebrow text-rouge">{t(schedule.skillsTitle)}</p>
          <div className="mt-6 grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
            {schedule.skills.map((s, i) => (
              <div key={s.label.en} className="hairline flex items-center gap-4 py-4">
                <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-md', i % 2 ? 'bg-red-soft text-rouge' : 'bg-blue-soft text-bleu')}>
                  <Icon name={s.icon} size={18} />
                </span>
                <span className="text-[15px] leading-snug font-semibold">{t(s.label)}</span>
              </div>
            ))}
          </div>
          <Link href="/enroll" className={btn('rouge', 'md', 'mt-10')}>
            {t(schedule.bookAny)} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
