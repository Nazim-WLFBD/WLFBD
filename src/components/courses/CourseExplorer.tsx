'use client';

import { useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { ArrowRight, Plane, ShieldCheck, X } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { COURSES_DATA, COMBO_OFFERS } from '@/data/courses';
import { courses as copy } from '@/content/home';
import { cn, num, taka } from '@/lib/utils';
import { BoardingPass, courseText } from './BoardingPass';

type Filter = 'all' | 'delf' | 'canada';

export function CourseExplorer({ notchClass = 'bg-bg' }: { notchClass?: string }) {
  const t = useT();
  const bn = t.locale === 'bn';
  const [filter, setFilter] = useState<Filter>('all');
  const [compare, setCompare] = useState<string[]>([]);
  const [showTable, setShowTable] = useState(false);

  const list = COURSES_DATA.filter((c) =>
    filter === 'all' ? true : filter === 'delf' ? c.id.startsWith('delf') : c.id.includes('tef') || c.id.includes('tcf'),
  );
  const toggleCompare = (id: string) =>
    setCompare((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : cur.length >= 3 ? [...cur.slice(1), id] : [...cur, id]));
  const compared = COURSES_DATA.filter((c) => compare.includes(c.id));

  return (
    <>
      <div
        className="no-scrollbar -mx-4 mb-10 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0 [&>button]:shrink-0 [&>button]:whitespace-nowrap"
        role="tablist"
        aria-label={t({ en: 'Filter courses', bn: 'কোর্স ফিল্টার করুন' })}
      >
        {(Object.keys(copy.filters) as Filter[]).map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              'relative rounded-full px-5 py-2.5 text-sm font-semibold transition',
              filter === f ? 'text-white' : 'border border-line text-fg hover:bg-fg/5',
            )}
          >
            {filter === f && (
              <motion.span layoutId="course-filter" className="absolute inset-0 rounded-full bg-ink dark:bg-bleu" transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }} />
            )}
            <span className="relative">{t(copy.filters[f])}</span>
          </button>
        ))}
      </div>

      <p className="-mt-6 mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted md:hidden">
        {t({ en: `Swipe to see all ${list.length} courses`, bn: `সব ${num(list.length, 'bn')}টি কোর্স দেখতে সোয়াইপ করুন` })} →
      </p>
      <LayoutGroup>
        {/* Phones: horizontal swipe row (saves several screens of scrolling). Tablet/desktop: grid */}
        <motion.div
          layout
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pt-4 pb-4 [scroll-padding-inline:16px] sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-8 md:overflow-visible md:px-0 md:pt-0 md:pb-0 xl:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {list.map((c) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
                className="w-[84vw] max-w-[360px] shrink-0 snap-start md:w-auto md:max-w-none"
              >
                <BoardingPass course={c} comparing={compare.includes(c.id)} onCompare={toggleCompare} notchClass={notchClass} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {/* Combos */}
      <div id="combos" className="mt-24 scroll-mt-28">
        <Reveal className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] text-rouge uppercase">
              {t(copy.comboTag)} <span className="text-muted normal-case">{t(copy.comboTagSub)}</span>
            </p>
            <h3 className="font-display mt-3 text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold">{t(copy.comboTitle)}</h3>
          </div>
          <p className="flex max-w-md items-start gap-3 rounded-2xl border border-line bg-surface px-4 py-3 text-sm">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-mint" />
            <span>
              <strong>{t(copy.eligibilityLabel)}</strong> <span className="text-muted">{t(copy.eligibility)}</span>
            </span>
          </p>
        </Reveal>
        <div className="grid gap-6 lg:grid-cols-2">
          {COMBO_OFFERS.map((combo, i) => (
            <Reveal key={combo.id} delay={i * 0.1}>
              <article className="relative flex h-full flex-col overflow-hidden rounded-[28px] bg-ink p-7 text-white md:p-8">
                <div className="dots pointer-events-none absolute inset-0 opacity-20" />
                <div className="relative flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-gold px-3 py-1 text-[10px] font-extrabold tracking-wider text-ink uppercase">
                    {(bn && combo.banglaBadge) || combo.badge || t({ en: 'COMBO', bn: 'কম্বো' })}
                  </span>
                  <span className="text-xs text-white/60">{bn ? combo.eligibilityBangla : combo.eligibility}</span>
                </div>
                {/* Connecting flight */}
                <div className="relative mt-6 flex items-center gap-3">
                  {combo.courses.map((name, idx) => (
                    <div key={name} className="contents">
                      {idx > 0 && (
                        <span className="flex flex-1 items-center">
                          <span className="h-px flex-1 border-t border-dashed border-white/30" />
                          <Plane size={16} className="mx-1 text-gold" />
                          <span className="h-px flex-1 border-t border-dashed border-white/30" />
                        </span>
                      )}
                      <span className="font-display rounded-xl bg-white/8 px-3 py-2 text-lg font-semibold">{name}</span>
                    </div>
                  ))}
                </div>
                <h4 className={cn('font-display relative mt-6 text-2xl font-semibold', bn && 'font-bangla')}>
                  {bn ? combo.banglaTitle : combo.title}
                </h4>
                <p className={cn('relative text-sm text-white/55', !bn && 'font-bangla')}>{bn ? combo.title : combo.banglaTitle}</p>
                <p className="relative mt-3 text-sm leading-relaxed text-white/70">
                  {(bn && combo.banglaDescription) || combo.description}
                </p>
                <div className="relative mt-auto flex flex-wrap items-end justify-between gap-4 pt-7">
                  <div>
                    <p className="text-[11px] font-bold tracking-wider text-white/55 uppercase">{t(copy.combinedFee)}</p>
                    <p className="font-display text-4xl font-semibold text-gold">{taka(combo.combinedFee, t.locale)}</p>
                    {combo.regularValue && (
                      <p className="text-xs text-white/50">
                        {t(copy.regularValue)} <span className="line-through">{taka(combo.regularValue, t.locale)}</span>
                      </p>
                    )}
                  </div>
                  <Link href={{ pathname: '/enroll', query: { course: combo.id } }} className={btn('rouge', 'md')}>
                    {t(copy.comboCta)}
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Compare drawer */}
      <AnimatePresence>
        {compare.length > 0 && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            className="fixed inset-x-3 bottom-[84px] z-[45] mx-auto max-w-3xl rounded-3xl border border-white/10 bg-ink p-3 text-white shadow-2xl lg:bottom-6"
          >
            <div className="flex items-center gap-2">
              <div className="flex flex-1 flex-wrap gap-1.5">
                {compared.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => toggleCompare(c.id)}
                    className="flex items-center gap-1.5 rounded-full bg-white/10 py-1.5 pr-2 pl-3 text-xs font-bold"
                  >
                    {c.code} <X size={12} />
                  </button>
                ))}
              </div>
              <button onClick={() => setCompare([])} className="px-2 text-xs text-white/60 hover:text-white">
                {t(copy.clear)}
              </button>
              <button onClick={() => setShowTable((s) => !s)} className={btn('gold', 'sm')} disabled={compare.length < 2}>
                {t(copy.compareN)} ({compare.length})
              </button>
            </div>
            <AnimatePresence>
              {showTable && compare.length >= 2 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 max-h-[50vh] overflow-auto rounded-2xl bg-white/5">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="text-[10px] tracking-widest text-white/50 uppercase">
                          <th className="p-3" />
                          {compared.map((c) => (
                            <th key={c.id} className="font-display p-3 text-base font-semibold tracking-normal text-white normal-case">
                              {courseText(c, t.locale).shortTitle}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="[&_td]:border-t [&_td]:border-white/10 [&_td]:p-3 [&_th]:border-t [&_th]:border-white/10 [&_th]:p-3">
                        {(
                          [
                            [t(copy.target), (c) => courseText(c, t.locale).targetClb ?? c.cefrLevel],
                            [t(copy.duration), (c) => (bn ? courseText(c, 'bn').duration : c.duration)],
                            [t(copy.schedule), (c) => (c.whatsappOnly ? courseText(c, t.locale).classesPerWeek : `${num(c.classCount, t.locale)} · ${courseText(c, t.locale).classesPerWeek}`)],
                            [t(copy.fee), (c) => (c.isCustomPricing ? t(copy.feeCustom) : taka(c.offerPrice, t.locale))],
                            [t({ en: 'Audience', bn: 'কাদের জন্য' }), (c) => courseText(c, t.locale).targetAudience],
                          ] as [string, (c: (typeof compared)[number]) => string][]
                        ).map(([label, get]) => (
                          <tr key={label}>
                            <th className="text-[11px] font-bold tracking-wider whitespace-nowrap text-white/50 uppercase">{label}</th>
                            {compared.map((c) => (
                              <td key={c.id} className="align-top text-white/85">
                                {get(c)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
