'use client';

import { ArrowRight, Check, Plane, Star } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { courses as copy } from '@/content/home';
import { BRAND_CONTACT } from '@/lib/brand';
import { cn, num, taka } from '@/lib/utils';
import type { Course } from '@/types';

/** "From" level shown on each pass: the level a student starts at. */
export const FROM_LEVEL: Record<string, string> = {
  'delf-a1': 'A0',
  'delf-a2': 'A1',
  'delf-b1': 'A2',
  'delf-b2': 'B1',
  'tef-canada': 'B1',
  'tcf-canada': 'B1',
};

/** Course copy in the given locale, falling back to English where no Bangla field is set. */
export function courseText(c: Course, locale: string) {
  const bn = locale === 'bn';
  return {
    title: bn ? c.banglaTitle : c.title,
    altTitle: bn ? c.title : c.banglaTitle,
    /** Short title without the " - subtitle" part, e.g. "DELF A1". */
    shortTitle: c.title.split(' - ')[0],
    tag: (bn && c.banglaTag) || c.tag,
    duration: (bn && c.banglaDuration) || c.duration.split(' (')[0],
    classesPerWeek: (bn && c.banglaClassesPerWeek) || c.classesPerWeek || (bn ? '২টি ক্লাস' : '2 Classes'),
    targetClb: (bn && c.banglaTargetClb) || c.targetClb,
    targetAudience: (bn && c.banglaTargetAudience) || c.targetAudience,
    outcome: (bn && c.banglaOutcome) || c.outcome,
    features: (bn && c.banglaFeatures?.length ? c.banglaFeatures : c.features),
  };
}

export function Barcode({ className }: { className?: string }) {
  const bars = [3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2];
  return (
    <span className={cn('flex h-8 items-stretch gap-[2px]', className)} aria-hidden>
      {bars.map((w, i) => (
        <i key={i} className="bg-current" style={{ width: w }} />
      ))}
    </span>
  );
}

interface Props {
  course: Course;
  comparing?: boolean;
  onCompare?: (id: string) => void;
  notchClass?: string;
}

export function BoardingPass({ course: c, comparing, onCompare, notchClass = 'bg-bg' }: Props) {
  const t = useT();
  const bn = t.locale === 'bn';
  const x = courseText(c, t.locale);
  const to = c.isCustomPricing ? c.targetClb ?? c.code : c.code;

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col rounded-[24px] border bg-surface transition duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]',
        c.popular ? 'border-rouge/60 ring-1 ring-rouge/30' : 'border-line',
      )}
    >
      {c.popular && (
        <span className="absolute -top-3 left-6 z-10 inline-flex items-center gap-1 rounded-full bg-rouge px-3 py-1 text-[10px] font-extrabold tracking-wider text-white shadow-lg">
          <Star size={11} fill="currentColor" /> {t(copy.popular)}
        </span>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between text-[10px] font-bold tracking-[0.2em] text-muted uppercase">
          <span>{t({ en: 'Boarding pass · WLF BD', bn: 'বোর্ডিং পাস · WLF BD' })}</span>
          <span className={cn('rounded-md border px-2 py-0.5 text-[10px] tracking-normal normal-case', c.tagColor)}>{x.tag}</span>
        </div>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-muted uppercase">{t({ en: 'From', bn: 'শুরু' })}</p>
            <p className="font-display text-4xl leading-none font-semibold text-muted/70">{FROM_LEVEL[c.id] ?? 'A0'}</p>
          </div>
          <div className="relative mb-3 flex flex-1 items-center">
            <span className="h-px flex-1 border-t border-dashed border-fg/25" />
            <Plane size={18} className="mx-1.5 text-rouge transition-transform duration-700 group-hover:translate-x-2" />
            <span className="h-px flex-1 border-t border-dashed border-fg/25" />
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold tracking-widest text-muted uppercase">{t({ en: 'To', bn: 'গন্তব্য' })}</p>
            <p className="font-display text-4xl leading-none font-semibold text-fg">{to}</p>
          </div>
        </div>

        <h3 className={cn('font-display mt-5 text-[22px] leading-tight font-semibold', bn && 'font-bangla')}>{x.title}</h3>
        <p className={cn('mt-1 text-sm text-muted', !bn && 'font-bangla')}>{x.altTitle}</p>

        <dl className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-surface-2/60 p-3 text-center">
          <div>
            <dt className="text-[9px] font-bold tracking-widest text-muted uppercase">{t(copy.duration)}</dt>
            <dd className="mt-0.5 text-[13px] font-bold">{x.duration}</dd>
          </div>
          <div className="border-x border-line">
            <dt className="text-[9px] font-bold tracking-widest text-muted uppercase">{t(copy.schedule)}</dt>
            <dd className="mt-0.5 text-[13px] font-bold">{num(c.classCount, t.locale)}</dd>
          </div>
          <div>
            <dt className="text-[9px] font-bold tracking-widest text-muted uppercase">{t({ en: '/ wk', bn: 'প্রতি সপ্তাহে' })}</dt>
            <dd className="mt-0.5 text-[13px] font-bold">{x.classesPerWeek}</dd>
          </div>
        </dl>
        {x.targetClb && (
          <p className="mt-3 text-sm">
            <span className="text-muted">{t(copy.target)}:</span> <strong>{x.targetClb}</strong>
          </p>
        )}

        <p className="mt-4 text-sm leading-relaxed">
          <strong>{t(copy.outcome)}:</strong> <span className="text-muted">{x.outcome}</span>
        </p>
        <ul className="mt-4 space-y-2">
          {x.features.slice(0, 4).map((f) => (
            <li key={f} className="flex items-start gap-2 text-[13.5px] leading-snug">
              <Check size={15} className="mt-0.5 shrink-0 text-mint" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Tear line */}
      <div className="relative mx-5 border-t-2 border-dashed border-line">
        <span className={cn('absolute -top-[13px] -left-[33px] h-6 w-6 rounded-full border-r border-line', notchClass)} />
        <span className={cn('absolute -top-[13px] -right-[33px] h-6 w-6 rounded-full border-l border-line', notchClass)} />
      </div>

      {/* Stub */}
      <div className="p-6 pt-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-muted uppercase">{t(copy.fee)}</p>
            {c.isCustomPricing ? (
              <p className="mt-1 font-bold text-rouge">{t(copy.feeCustom)}</p>
            ) : (
              <>
                <p className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-semibold text-rouge">{taka(c.offerPrice, t.locale)}</span>
                  <span className="text-sm text-muted line-through">{taka(c.regularPrice, t.locale)}</span>
                </p>
                <p className="text-[11px] font-bold text-mint">
                  {t(copy.save)} {taka(c.regularPrice - c.offerPrice, t.locale)}
                </p>
              </>
            )}
          </div>
          <Barcode className="text-fg/70" />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Link href={{ pathname: '/enroll', query: { course: c.id } }} className={btn('rouge', 'sm', 'w-full')}>
            {t(copy.enroll)}
          </Link>
          <Link href={`/courses/${c.id}`} className={btn('ghost', 'sm', 'w-full')}>
            {t(copy.details)}
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="mt-3 flex items-center justify-between">
          {onCompare ? (
            <label className="-my-2 flex min-h-10 cursor-pointer items-center gap-2 text-xs font-semibold text-muted select-none">
              <input
                type="checkbox"
                checked={!!comparing}
                onChange={() => onCompare(c.id)}
                className="h-4 w-4 rounded accent-[var(--ink)]"
              />
              {t(copy.compare)}
            </label>
          ) : (
            <span />
          )}
          {c.isCustomPricing && (
            <a href={BRAND_CONTACT.whatsappUrl} target="_blank" rel="noopener" className="-my-2 inline-flex min-h-10 items-center px-1 text-xs font-bold text-[#16a34a] hover:underline">
              WhatsApp →
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
