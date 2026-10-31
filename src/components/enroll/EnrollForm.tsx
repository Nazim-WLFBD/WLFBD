'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Copy, Loader2 } from 'lucide-react';
import { useT } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { WhatsAppGlyph } from '@/components/layout/FloatingActions';
import { COURSES_DATA, COMBO_OFFERS } from '@/data/courses';
import { BATCH_SCHEDULES } from '@/data/schedules';
import { enroll as copy } from '@/content/enroll';
import { BRAND_CONTACT, waLink } from '@/lib/brand';
import { cn, num, taka } from '@/lib/utils';
import type { BatchSchedule } from '@/types';
import type { L } from '@/i18n/t';

export type PaymentMethod = 'bkash' | 'nagad' | 'bank';

/** Error codes returned by POST /api/enroll. */
export type EnrollErrorCode = 'invalid' | 'unknown_course' | 'bkash_required' | 'rate_limited' | 'duplicate_trx';
type ErrorField = 'phone' | 'email' | 'senderPhone' | 'trxId';

/** Thrown by the enrollment submit handler so the form can show a bilingual message under the right field. */
export class EnrollError extends Error {
  code?: string;
  field?: string;
  constructor(message: string, code?: string, field?: string) {
    super(message);
    this.name = 'EnrollError';
    this.code = code;
    this.field = field;
  }
}

const SERVER_ERRORS: Record<EnrollErrorCode, L> = {
  invalid: { en: 'Please check the form and try again.', bn: 'ফর্মের তথ্যগুলো আবার দেখে চেষ্টা করুন।' },
  unknown_course: { en: 'This course could not be found. Please pick a course again.', bn: 'কোর্সটি খুঁজে পাওয়া যায়নি। অনুগ্রহ করে আবার কোর্স নির্বাচন করুন।' },
  bkash_required: { en: 'bKash sender number and TrxID are required.', bn: 'বিকাশ প্রেরক নম্বর ও TrxID দেওয়া আবশ্যক।' },
  rate_limited: {
    en: 'Too many submissions. Please wait a few minutes or contact us on WhatsApp.',
    bn: 'অনেকবার জমা দেওয়া হয়েছে। কয়েক মিনিট অপেক্ষা করুন অথবা WhatsApp-এ যোগাযোগ করুন।',
  },
  duplicate_trx: {
    en: 'This TrxID has already been submitted. Contact us if this is a mistake.',
    bn: 'এই TrxID আগেই জমা দেওয়া হয়েছে। ভুল মনে হলে আমাদের সাথে যোগাযোগ করুন।',
  },
};
const FALLBACK_ERROR: L = { en: 'Could not submit. Please try WhatsApp.', bn: 'জমা দেওয়া যায়নি। অনুগ্রহ করে WhatsApp-এ চেষ্টা করুন।' };
const FIELD_STEP: Record<ErrorField, number> = { phone: 1, email: 1, senderPhone: 2, trxId: 2 };
const METHOD_LABEL: Record<PaymentMethod, L> = {
  bkash: { en: 'bKash', bn: 'bKash' },
  nagad: { en: 'Nagad', bn: 'Nagad' },
  bank: { en: 'Bank / Office', bn: 'ব্যাংক / অফিস' },
};

export interface EnrollmentInput {
  courseId: string;
  courseTitle: string;
  batchId: string;
  batchLabel: string;
  name: string;
  phone: string;
  email: string;
  plan: 'full' | 'half';
  method: PaymentMethod;
  amount: number;
  senderPhone: string;
  trxId: string;
  customPricing: boolean;
}

interface Props {
  defaults?: { name?: string; phone?: string; email?: string };
  batches?: BatchSchedule[];
  /** Persists the enrollment. Throw to show an error. */
  onSubmit?: (data: EnrollmentInput) => Promise<void>;
}

type Option = { id: string; title: string; sub: string; fee: number | null; combo: boolean };

export function EnrollForm({ defaults, batches = BATCH_SCHEDULES, onSubmit }: Props) {
  const t = useT();
  const bn = t.locale === 'bn';
  const params = useSearchParams();

  const options: Option[] = useMemo(
    () => [
      ...COURSES_DATA.filter((c) => !c.whatsappOnly).map((c) => ({
        id: c.id,
        title: bn ? c.banglaTitle : c.title,
        sub: c.isCustomPricing
          ? t(copy.contactFee)
          : bn
            ? `${c.banglaDuration ?? c.duration.split(' (')[0]} · ${num(c.classCount, 'bn')}টি ক্লাস`
            : `${c.duration.split(' (')[0]} · ${c.classCount} classes`,
        fee: c.isCustomPricing ? null : c.offerPrice,
        combo: false,
      })),
      ...COMBO_OFFERS.map((c) => ({
        id: c.id,
        title: bn ? c.banglaTitle : c.title,
        sub: c.courses.join(' + '),
        fee: c.combinedFee,
        combo: true,
      })),
    ],
    [t, bn],
  );

  const initialCourse = options.find((o) => o.id === params.get('course'))?.id ?? 'delf-a1';
  const initialBatch = batches.find((b) => b.id === params.get('batch'))?.id ?? batches[0]?.id ?? 'flexible';

  const [step, setStep] = useState(0);
  const [courseId, setCourseId] = useState(initialCourse);
  const [batchId, setBatchId] = useState(initialBatch);
  const [name, setName] = useState(defaults?.name ?? '');
  const [phone, setPhone] = useState(defaults?.phone ?? '');
  const [email, setEmail] = useState(defaults?.email ?? '');
  const [plan, setPlan] = useState<'full' | 'half'>('full');
  const [method, setMethod] = useState<PaymentMethod>('bkash');
  const [senderPhone, setSenderPhone] = useState('');
  const [trxId, setTrxId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [done, setDone] = useState<EnrollmentInput | null>(null);
  const [copied, setCopied] = useState(false);

  const course = options.find((o) => o.id === courseId)!;
  const custom = course.fee == null;
  const amount = custom ? 0 : plan === 'half' ? Math.round(course.fee! / 2) : course.fee!;
  const batch = batches.find((b) => b.id === batchId);
  const batchTime = (b: BatchSchedule) => (bn && b.banglaTimeSlot) || b.timeSlot;
  const batchLabel = batch ? `${(bn && batch.banglaDays) || batch.days}, ${batchTime(batch)}` : t(copy.flexible);
  const steps = custom ? copy.steps.slice(0, 2) : copy.steps;

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!name.trim()) e.name = t(copy.errors.required);
      if (!/^(\+?88)?01[3-9]\d{8}$/.test(phone.replace(/[\s-]/g, ''))) e.phone = t(copy.errors.phone);
      if (!/^\S+@\S+\.\S+$/.test(email.trim())) e.email = t(copy.errors.email);
    }
    if (s === 2 && method === 'bkash') {
      if (!/^(\+?88)?01[3-9]\d{8}$/.test(senderPhone.replace(/[\s-]/g, ''))) e.senderPhone = t(copy.errors.phone);
      if (trxId.trim().length < 6) e.trxId = t(copy.errors.trx);
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => validate(step) && setStep((s) => s + 1);

  const submit = async () => {
    if (!validate(step)) return;
    const data: EnrollmentInput = {
      courseId,
      courseTitle: course.title,
      batchId,
      batchLabel,
      name: name.trim(),
      phone: phone.replace(/[\s-]/g, ''),
      email: email.trim(),
      plan,
      method,
      amount,
      senderPhone: senderPhone.replace(/[\s-]/g, ''),
      trxId: trxId.trim().toUpperCase(),
      customPricing: custom,
    };
    setBusy(true);
    setFailure(null);
    try {
      await onSubmit?.(data);
      setDone(data);
    } catch (err) {
      const code = err instanceof EnrollError ? err.code : undefined;
      const field = err instanceof EnrollError ? err.field : undefined;
      const known = code && code in SERVER_ERRORS ? SERVER_ERRORS[code as EnrollErrorCode] : null;
      // Prefer our bilingual copy; fall back to the server's text, then a generic message
      const message = known ? t(known) : err instanceof Error && err.message ? err.message : t(FALLBACK_ERROR);
      if (field && field in FIELD_STEP) {
        const f = field as ErrorField;
        setErrors({ [f]: message });
        setStep(FIELD_STEP[f]);
        setFailure(null);
      } else {
        setFailure(message);
      }
    } finally {
      setBusy(false);
    }
  };

  const waText = done
    ? bn
      ? custom
        ? `Bonjour! আমি ${done.name}। ${done.courseTitle} কোর্সের ফি ও লেভেল অ্যাসেসমেন্ট সম্পর্কে জানতে চাই। ব্যাচ: ${done.batchLabel}। ফোন: ${done.phone}`
        : `Bonjour! আমি ${done.name}। ${done.courseTitle} কোর্সে ভর্তি হয়েছি (${done.batchLabel})। ${t(METHOD_LABEL[done.method])}-এ ${taka(done.amount, 'bn')} পরিশোধ করেছি${done.trxId ? `, TrxID ${done.trxId}` : ''}। ফোন: ${done.phone}`
      : custom
        ? `Bonjour! I'm ${done.name}. Interested in ${done.courseTitle}: fee and level assessment. Batch: ${done.batchLabel}. Phone: ${done.phone}`
        : `Bonjour! I'm ${done.name}. Enrolled in ${done.courseTitle} (${done.batchLabel}). Paid ${taka(done.amount)} via ${t(METHOD_LABEL[done.method])}${done.trxId ? `, TrxID ${done.trxId}` : ''}. Phone: ${done.phone}`
    : '';

  const field = (err?: string) =>
    cn(
      'w-full rounded-xl border bg-surface px-4 py-3 text-[15px] outline-none transition focus:border-bleu focus:ring-2 focus:ring-bleu/20',
      err ? 'border-rouge' : 'border-line',
    );

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl">
        <div className="card accent-top overflow-hidden">
          <div className="border-b border-line p-7">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-soft text-rouge">
              <CheckCircle2 size={24} />
            </span>
            <h2 className="font-display mt-4 text-3xl font-semibold">{t(copy.doneTitle)}</h2>
            <p className="mt-2 text-muted">{t(copy.doneText)}</p>
          </div>
          <div className="p-7">
            <p className="eyebrow text-rouge">{t(copy.receipt)}</p>
            <dl className="mt-4 text-sm">
              {[
                [t({ en: 'Student Name', bn: 'শিক্ষার্থীর নাম' }), done.name],
                [t({ en: 'Email Address', bn: 'ইমেইল অ্যাড্রেস' }), done.email],
                [t({ en: 'WhatsApp', bn: 'হোয়াটসঅ্যাপ' }), done.phone],
                [t({ en: 'Course', bn: 'কোর্স' }), done.courseTitle],
                [t({ en: 'Batch', bn: 'ব্যাচ' }), done.batchLabel],
                ...(!done.customPricing
                  ? [
                      [
                        t({ en: 'Amount', bn: 'পরিমাণ' }),
                        `${taka(done.amount, t.locale)} (${done.plan === 'half' ? t({ en: '50%', bn: '৫০%' }) : t({ en: 'full', bn: 'সম্পূর্ণ' })})`,
                      ],
                      [
                        t({ en: 'Method', bn: 'মাধ্যম' }),
                        done.method === 'bkash'
                          ? t({ en: `bKash Personal (${BRAND_CONTACT.bkashPersonal})`, bn: `bKash পার্সোনাল (${BRAND_CONTACT.bkashPersonal})` })
                          : t(METHOD_LABEL[done.method]),
                      ],
                      ...(done.trxId ? [['TrxID', done.trxId]] : []),
                    ]
                  : []),
              ].map(([k, v]) => (
                <div key={k} className="hairline flex justify-between gap-4 py-2.5 first:border-t-0">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-right font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
            <a href={waLink(waText)} target="_blank" rel="noopener" className={btn('ink', 'md', 'mt-6 w-full bg-[#16a34a] hover:bg-[#15803d] dark:bg-[#16a34a] dark:text-white dark:hover:bg-[#15803d]')}>
              <WhatsAppGlyph size={18} /> {t(copy.waConfirm)}
            </a>
            <p className="mt-4 text-center text-xs text-muted">{t(copy.helpline)}</p>
            <button
              onClick={() => {
                setDone(null);
                setStep(0);
                setTrxId('');
                setSenderPhone('');
              }}
              className="mx-auto mt-3 block min-h-10 text-sm font-semibold text-bleu hover:underline"
            >
              {t(copy.newOne)}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="card p-6 md:p-8">
        {/* Stepper: numbered circles joined by a hairline */}
        <ol className="mb-8 flex items-center">
          {steps.map((s, i) => (
            <li key={s.en} className={cn('flex items-center gap-3', i < steps.length - 1 && 'flex-1')}>
              <span
                className={cn(
                  'font-display flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition tabular-nums',
                  i < step
                    ? 'border-rouge bg-rouge text-white'
                    : i === step
                      ? 'border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-ink'
                      : 'border-line bg-surface text-muted',
                )}
              >
                {i < step ? <Check size={15} strokeWidth={2.5} /> : String(i + 1).padStart(2, '0')}
              </span>
              <span className={cn('hidden text-[11px] font-bold tracking-[0.14em] uppercase sm:block', i === step ? 'text-fg' : 'text-muted')}>{t(s)}</span>
              {i < steps.length - 1 && <span className="mx-3 h-px flex-1 bg-line" />}
            </li>
          ))}
        </ol>

        <motion.div key={step} initial={{ opacity: 0.4, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
            {step === 0 && (
              <div className="flex flex-col gap-7">
                <fieldset>
                  <legend className="font-display mb-3 text-lg font-semibold">{t(copy.course)}</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {options.map((o) => (
                      <label
                        key={o.id}
                        className={cn(
                          'flex cursor-pointer items-start gap-3 rounded-xl border bg-surface p-3.5 transition',
                          courseId === o.id ? 'border-ink ring-1 ring-ink dark:border-white dark:ring-white' : 'border-line hover:border-fg/30',
                        )}
                      >
                        <input
                          type="radio"
                          name="course"
                          value={o.id}
                          checked={courseId === o.id}
                          onChange={() => setCourseId(o.id)}
                          className="mt-1 accent-[var(--rouge)]"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm leading-tight font-bold">
                            {o.combo && <span className="mr-1.5 rounded bg-red-soft px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-rouge uppercase">{t(copy.combo)}</span>}
                            {o.title}
                          </span>
                          <span className="mt-0.5 block text-xs text-muted">{o.sub}</span>
                        </span>
                        <span className="font-display shrink-0 text-base font-semibold text-fg">{o.fee != null ? taka(o.fee, t.locale) : '—'}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="font-display mb-3 text-lg font-semibold">{t(copy.batch)}</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[...batches, { id: 'flexible' } as BatchSchedule].map((b, i) => (
                      <label
                        key={b.id}
                        className={cn(
                          'flex cursor-pointer items-center gap-3 rounded-xl border bg-surface p-3.5 transition',
                          batchId === b.id ? 'border-ink ring-1 ring-ink dark:border-white dark:ring-white' : 'border-line hover:border-fg/30',
                        )}
                      >
                        <input type="radio" name="batch" checked={batchId === b.id} onChange={() => setBatchId(b.id)} className="accent-[var(--rouge)]" />
                        {b.id === 'flexible' ? (
                          <span className="text-sm font-semibold">{t(copy.flexible)}</span>
                        ) : (
                          <span>
                            <span className="block text-sm font-bold">
                              #{i + 1} · {t.locale === 'bn' ? b.banglaDays : b.days}
                            </span>
                            <span className="text-xs text-muted">{batchTime(b)}</span>
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            )}

            {step === 1 && (
              <div className="flex flex-col gap-5">
                <Field label={t(copy.name)} error={errors.name}>
                  <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={field(errors.name)} />
                </Field>
                <Field label={t(copy.phone)} error={errors.phone}>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="01XXXXXXXXX"
                    className={field(errors.phone)}
                  />
                </Field>
                <Field label={t(copy.email)} error={errors.email}>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" className={field(errors.email)} />
                </Field>
                {custom && (
                  <div className="rounded-xl bg-surface-2 p-4 text-sm leading-relaxed">
                    <strong className="font-semibold">{t(copy.customFeeLabel)}</strong> {t(copy.customFee)}
                  </div>
                )}
              </div>
            )}

            {step === 2 && !custom && (
              <div className="flex flex-col gap-6">
                <fieldset>
                  <legend className="font-display mb-3 text-lg font-semibold">{t(copy.plan)}</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {(['full', 'half'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPlan(p)}
                        className={cn(
                          'rounded-xl border bg-surface p-4 text-left transition',
                          plan === p ? 'border-ink ring-1 ring-ink dark:border-white dark:ring-white' : 'border-line hover:border-fg/30',
                        )}
                      >
                        <span className="block text-[11px] font-bold tracking-[0.14em] text-muted uppercase">{t(p === 'full' ? copy.full : copy.half)}</span>
                        <span className="font-display mt-1 block text-2xl font-semibold text-fg">
                          {taka(p === 'full' ? course.fee! : Math.round(course.fee! / 2), t.locale)}
                        </span>
                      </button>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="font-display mb-3 text-lg font-semibold">{t(copy.method)}</legend>
                  <div className="grid grid-cols-3 gap-2">
                    {(['bkash', 'nagad', 'bank'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMethod(m)}
                        aria-pressed={method === m}
                        className={cn(
                          'min-h-12 rounded-xl border bg-surface px-3 py-3 text-sm font-bold transition',
                          method === m ? 'border-ink ring-1 ring-ink dark:border-white dark:ring-white' : 'border-line text-muted hover:border-fg/30',
                        )}
                      >
                        {t(METHOD_LABEL[m])}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {method === 'bkash' && (
                  <div className="rounded-xl bg-red-soft p-5">
                    <p className="eyebrow text-rouge">{t(copy.bkashHow)}</p>
                    <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-line bg-surface p-3">
                      <span className="font-mono text-xl font-bold tracking-wider">{BRAND_CONTACT.bkashPersonal}</span>
                      <button
                        type="button"
                        onClick={async () => {
                          await navigator.clipboard?.writeText(BRAND_CONTACT.bkashPersonal).catch(() => {});
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="flex min-h-10 items-center gap-1.5 rounded-lg bg-ink px-3 py-1.5 text-xs font-bold text-white dark:bg-white dark:text-ink"
                      >
                        {copied ? <Check size={13} /> : <Copy size={13} />} {t(copied ? copy.copied : copy.copy)}
                      </button>
                    </div>
                    <ol className={cn('mt-4 space-y-2 text-sm text-fg/85', bn && 'font-bangla')}>
                      {copy.bkashSteps.map((s, i) => (
                        <li key={s.en} className="flex gap-3">
                          <span className="font-display w-6 shrink-0 font-semibold text-rouge tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                          <span>
                            {t(s)}
                            {i === 2 && <strong className="ml-1 font-semibold text-rouge">{taka(amount, t.locale)}</strong>}
                          </span>
                        </li>
                      ))}
                    </ol>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <Field label={t(copy.sender)} error={errors.senderPhone}>
                        <input
                          value={senderPhone}
                          onChange={(e) => setSenderPhone(e.target.value)}
                          inputMode="tel"
                          placeholder="01XXXXXXXXX"
                          className={field(errors.senderPhone)}
                        />
                      </Field>
                      <Field label={t(copy.trx)} error={errors.trxId}>
                        <input
                          value={trxId}
                          onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                          placeholder="9A7B6C5D4E"
                          className={cn(field(errors.trxId), 'font-mono uppercase')}
                        />
                      </Field>
                    </div>
                  </div>
                )}
                {method === 'nagad' && <p className="rounded-xl bg-surface-2 p-4 text-sm leading-relaxed">{t(copy.nagad)}</p>}
                {method === 'bank' && <p className="rounded-xl bg-surface-2 p-4 text-sm leading-relaxed">{t(copy.bank)}</p>}
              </div>
            )}
        </motion.div>

        {failure && <p className="mt-5 rounded-xl border border-rouge/30 bg-red-soft p-4 text-sm font-medium text-rouge">{failure}</p>}

        <div className="hairline mt-8 flex items-center justify-between gap-3 pt-6">
          {step > 0 ? (
            <button type="button" onClick={() => setStep((s) => s - 1)} className={btn('ghost', 'md')}>
              <ArrowLeft size={16} /> {t(copy.back)}
            </button>
          ) : (
            <span />
          )}
          {step < steps.length - 1 ? (
            <button type="button" onClick={next} className={btn('ink', 'md')}>
              {t(copy.next)} <ArrowRight size={16} />
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={busy} className={btn('rouge', 'md')}>
              {busy && <Loader2 size={16} className="animate-spin" />}
              {t(custom ? copy.submitCustom : copy.submit)}
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="card accent-top p-6">
          <p className="eyebrow text-rouge">{t(copy.receipt)}</p>
          <p className={cn('font-display mt-4 text-2xl leading-tight font-semibold', bn && 'font-bangla')}>{course.title}</p>
          <p className="mt-1 text-sm text-muted">{course.sub}</p>
          <dl className="hairline mt-5 text-sm">
            <div className="flex justify-between gap-4 py-2.5">
              <dt className="text-muted">{t(copy.batch)}</dt>
              <dd className="text-right font-semibold">{batchLabel}</dd>
            </div>
            {custom ? (
              <div className="hairline py-3 text-sm leading-relaxed text-muted">{t(copy.customFee)}</div>
            ) : (
              <>
                <div className="hairline flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-[11px] font-bold tracking-[0.14em] text-muted uppercase">{t(course.combo ? copy.totalCombo : copy.total)}</dt>
                  <dd className="font-display text-3xl font-semibold text-fg">{taka(course.fee!, t.locale)}</dd>
                </div>
                {plan === 'half' && (
                  <div className="hairline flex justify-between gap-4 py-2.5">
                    <dt className="text-muted">{t(copy.payNow)}</dt>
                    <dd className="font-semibold text-rouge">{taka(amount, t.locale)}</dd>
                  </div>
                )}
              </>
            )}
          </dl>
        </div>
        <p className="mt-4 text-center text-xs text-muted">{t(copy.helpline)}</p>
      </aside>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-bold tracking-[0.14em] text-muted uppercase">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-xs font-semibold text-rouge">{error}</span>}
    </label>
  );
}
