'use client';

import { ArrowRight, Check, Star } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { courses as copy } from '@/content/home';
import { BRAND_CONTACT, waLink } from '@/lib/brand';
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
  'one-to-one': 'A0+',
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

/** Kept for existing imports; now a tiny decorative strip rather than an airline barcode. */
export function Barcode({ className }: { className?: string }) {
  return <span className={cn('block h-px w-10 bg-current opacity-40', className)} aria-hidden />;
}

interface Props {
  course: Course;
  comparing?: boolean;
  onCompare?: (id: string) => void;
  /** Accepted for backwards compatibility; the card no longer has notches. */
  notchClass?: string;
}

export function BoardingPass({ course: c, comparing, onCompare }: Props) {
  const t = useT();
  const bn = t.locale === 'bn';
  const x = courseText(c, t.locale);
  const to = c.isCustomPricing && !c.whatsappOnly ? c.targetClb ?? c.code : c.code;

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col rounded-[var(--radius)] border bg-surface shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]',
        c.popular ? 'border-rouge/50' : 'border-line',
      )}
    >
      {/* Main */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-md bg-red-soft px-2.5 py-1 text-[11px] font-bold tracking-[0.14em] text-rouge uppercase">
            {FROM_LEVEL[c.id] ?? 'A0'}
            <span aria-hidden className="text-rouge/50">→</span>
            {to}
          </span>
          {c.popular ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-[0.14em] text-rouge uppercase">
              <Star size={11} fill="currentColor" /> {t(copy.popular)}
            </span>
          ) : (
            <span className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">{x.tag}</span>
          )}
        </div>

        <h3 className={cn('font-display mt-5 text-[22px] leading-tight font-semibold text-fg', bn && 'font-bangla')}>{x.title}</h3>
        <p className={cn('mt-1 text-sm text-muted', !bn && 'font-bangla')}>{x.altTitle}</p>

        <dl className="hairline mt-5 grid grid-cols-3 border-b border-line py-4">
          <div className="pr-3">
            <dt className="text-[10px] font-bold tracking-[0.14em] text-muted uppercase">{t(copy.duration)}</dt>
            <dd className="font-display mt-1 text-[15px] font-semibold text-fg">{x.duration}</dd>
          </div>
          <div className="border-l border-line px-3">
            <dt className="text-[10px] font-bold tracking-[0.14em] text-muted uppercase">{t(copy.schedule)}</dt>
            <dd className="font-display mt-1 text-[15px] font-semibold text-fg">
              {c.whatsappOnly ? t({ en: 'Flexible', bn: 'ফ্লেক্সিবল' }) : num(c.classCount, t.locale)}
            </dd>
          </div>
          <div className="border-l border-line pl-3">
            <dt className="text-[10px] font-bold tracking-[0.14em] text-muted uppercase">{t({ en: '/ wk', bn: 'প্রতি সপ্তাহে' })}</dt>
            <dd className="font-display mt-1 text-[15px] font-semibold text-fg">{x.classesPerWeek}</dd>
          </div>
        </dl>
        {x.targetClb && (
          <p className="mt-4 text-sm">
            <span className="text-muted">{t(copy.target)}:</span> <strong className="font-semibold">{x.targetClb}</strong>
          </p>
        )}

        <p className="mt-3 text-sm leading-relaxed">
          <strong className="font-semibold">{t(copy.outcome)}:</strong> <span className="text-muted">{x.outcome}</span>
        </p>
        <ul className="mt-4 space-y-2">
          {x.features.slice(0, 4).map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-[13.5px] leading-snug">
              <Check size={14} strokeWidth={2.5} className="mt-[3px] shrink-0 text-rouge" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Price + actions */}
      <div className="px-6 pb-6">
        <div className="hairline flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-[10px] font-bold tracking-[0.14em] text-muted uppercase">{t(copy.fee)}</p>
            {c.isCustomPricing ? (
              <p className="font-display mt-1 text-xl font-semibold text-rouge">{t(copy.feeCustom)}</p>
            ) : (
              <p className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-3xl font-semibold text-fg">{taka(c.offerPrice, t.locale)}</span>
                <span className="text-sm text-muted line-through">{taka(c.regularPrice, t.locale)}</span>
              </p>
            )}
          </div>
          {!c.isCustomPricing && (
            <p className="pb-1 text-right text-[11px] font-semibold text-mint">
              {t(copy.save)} {taka(c.regularPrice - c.offerPrice, t.locale)}
            </p>
          )}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          {c.whatsappOnly ? (
            <a href={waLink(t(c.whatsappMessage!))} target="_blank" rel="noopener" className={btn('ink', 'sm', 'w-full bg-[#1f9d55] hover:bg-[#178244] dark:bg-[#1f9d55] dark:text-white dark:hover:bg-[#178244]')}>
              {t({ en: 'WhatsApp us', bn: 'WhatsApp করুন' })}
            </a>
          ) : (
            <Link href={{ pathname: '/enroll', query: { course: c.id } }} className={btn('rouge', 'sm', 'w-full')}>
              {t(copy.enroll)}
            </Link>
          )}
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
                className="h-4 w-4 rounded border-line accent-[var(--ink)]"
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
