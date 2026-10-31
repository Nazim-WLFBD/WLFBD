'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Lightbulb, Monitor, Moon, Sunset } from 'lucide-react';
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
const PAIR_COLOR: Record<string, string> = {
  fs: 'bg-bleu text-white',
  sm: 'bg-rouge text-white',
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

  return (
    <section id="schedule" className="relative bg-bg py-24 md:py-32">
      <div className="container-x">
        <SectionHeading tag={t(schedule.tag)} title={t(schedule.title)} intro={t(schedule.intro)} />

        <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr] [&>*]:min-w-0">
          {/* Weekly timetable */}
          <Reveal>
            <div className="overflow-hidden rounded-[28px] border border-line bg-surface">
              <div className="grid grid-cols-[64px_repeat(4,minmax(0,1fr))] border-b border-line text-center text-xs font-bold tracking-widest text-muted uppercase sm:grid-cols-[120px_repeat(4,minmax(0,1fr))]">
                <div className="p-3 text-left sm:p-4">{t(schedule.bst)}</div>
                {DAYS.map((d) => (
                  <div key={d} className="px-1 py-4 sm:p-4">
                    {t(schedule.days[d as keyof typeof schedule.days])}
                  </div>
                ))}
              </div>
              {schedule.slots.map((slot) => (
                <div key={slot.id} className="grid grid-cols-[64px_repeat(4,minmax(0,1fr))] border-b border-line last:border-0 sm:grid-cols-[120px_repeat(4,minmax(0,1fr))]">
                  <div className="flex flex-col justify-center gap-1 p-3 text-[11px] font-bold sm:p-4 sm:text-xs">
                    {slot.id === '7pm' ? <Sunset size={16} className="text-gold" /> : <Moon size={16} className="text-bleu" />}
                    {t(slot.label)}
                  </div>
                  {DAYS.map((d) => {
                    const b = batches.find((x) => x.dayKeys.includes(d) && slotOf(x) === slot.id);
                    return (
                      <div key={d} className="p-1.5 sm:p-2.5">
                        {b && (
                          <motion.div
                            onHoverStart={() => setHover(b.id)}
                            onHoverEnd={() => setHover(null)}
                            animate={{ scale: hover === b.id ? 1.04 : 1, opacity: hover && hover !== b.id ? 0.35 : 1 }}
                            className={cn(
                              'flex h-full min-h-[74px] flex-col justify-between rounded-2xl p-2.5 text-[10px] font-bold sm:min-h-[92px] sm:p-3 sm:text-xs',
                              PAIR_COLOR[pairOf(b)],
                            )}
                          >
                            <span className="opacity-80">#{batches.indexOf(b) + 1}</span>
                            <span className="hidden leading-tight sm:block">{t.locale === 'bn' ? b.banglaDays : b.days}</span>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <p className="mt-3 flex items-center gap-2 text-sm text-muted">
              <Monitor size={15} />
              <strong className="text-fg">{t(schedule.formatTitle)}:</strong> {t(schedule.format)}
            </p>
          </Reveal>

          {/* Batch list */}
          <div className="flex flex-col gap-3">
            {batches.map((b, i) => {
              const seatsLeft =
                b.seatsTotal != null && b.seatsTaken != null ? Math.max(0, b.seatsTotal - b.seatsTaken) : null;
              return (
                <Reveal key={b.id} delay={i * 0.06}>
                  <div
                    onMouseEnter={() => setHover(b.id)}
                    onMouseLeave={() => setHover(null)}
                    className={cn(
                      'flex items-center gap-4 rounded-2xl border bg-surface p-4 transition',
                      hover === b.id ? 'border-fg/40 shadow-[var(--shadow-lift)]' : 'border-line',
                    )}
                  >
                    <span className={cn('font-display flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-semibold', PAIR_COLOR[pairOf(b)])}>
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="leading-snug font-bold">{t.locale === 'bn' ? (b.banglaBatchName ?? b.batchName) : b.batchName}</p>
                      <p className="text-sm text-muted">{t.locale === 'bn' ? (b.banglaTimeSlot ?? b.timeSlot) : b.timeSlot}</p>
                      {seatsLeft != null && (
                        <p className="mt-1 text-xs font-semibold text-rouge">
                          {t(schedule.seats)} {seatsLeft}/{b.seatsTotal}
                        </p>
                      )}
                    </div>
                    <Link
                      href={{ pathname: '/enroll', query: { batch: b.id } }}
                      aria-label={`${t(schedule.book)}: ${t.locale === 'bn' ? (b.banglaBatchName ?? b.batchName) : b.batchName}`}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-white transition hover:bg-rouge dark:bg-white dark:text-ink"
                    >
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </Reveal>
              );
            })}
            <Reveal delay={0.3}>
              <div className="rounded-2xl border border-dashed border-gold/60 bg-gold/10 p-4 text-sm">
                <p className="flex items-center gap-2 font-bold">
                  <Lightbulb size={16} className="text-gold" />
                  {t(schedule.customTitle)}
                </p>
                <p className="mt-1 text-muted">{t(schedule.custom)}</p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* What every class covers */}
        <Reveal className="mt-14">
          <p className="mb-4 text-[11px] font-bold tracking-[0.2em] text-muted uppercase">{t(schedule.skillsTitle)}</p>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {schedule.skills.map((s, i) => (
              <div key={s.label.en} className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4">
                <span className={cn('flex h-10 w-10 items-center justify-center rounded-full text-white', i % 2 ? 'bg-rouge' : 'bg-ink-3')}>
                  <Icon name={s.icon} size={18} />
                </span>
                <span className="text-sm leading-snug font-semibold">{t(s.label)}</span>
              </div>
            ))}
          </div>
          <Link href="/enroll" className={btn('rouge', 'md', 'mt-8')}>
            {t(schedule.bookAny)} <ArrowRight size={16} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
