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
      'w-full rounded-2xl border bg-surface px-4 py-3.5 text-[15px] outline-none transition focus:border-fg/50',
      err ? 'border-rouge' : 'border-line',
    );

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-[28px] border border-line bg-surface">
          <div className="bg-mint p-7 text-white">
            <CheckCircle2 size={38} />
            <h2 className="font-display mt-3 text-3xl font-semibold">{t(copy.doneTitle)}</h2>
            <p className="mt-2 text-white/90">{t(copy.doneText)}</p>
          </div>
          <div className="p-7">
            <p className="text-[11px] font-bold tracking-[0.2em] text-muted uppercase">{t(copy.receipt)}</p>
            <dl className="mt-4 grid gap-2 text-sm">
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
                <div key={k} className="flex justify-between gap-4 border-b border-dashed border-line pb-2">
                  <dt className="text-muted">{k}:</dt>
                  <dd className="text-right font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
            <a href={waLink(waText)} target="_blank" rel="noopener" className={btn('ink', 'md', 'mt-6 w-full bg-[#16a34a] hover:bg-[#15803d]')}>
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
              className="mx-auto mt-3 block text-sm font-semibold text-bleu hover:underline"
            >
              {t(copy.newOne)}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="rounded-[28px] border border-line bg-surface p-6 md:p-8">
        {/* Stepper */}
        <ol className="mb-8 flex items-center gap-2">
          {steps.map((s, i) => (
            <li key={s.en} className="flex flex-1 items-center gap-2">
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition',
                  i < step ? 'bg-mint text-white' : i === step ? 'bg-ink text-white dark:bg-white dark:text-ink' : 'bg-fg/10 text-muted',
                )}
              >
                {i < step ? <Check size={15} /> : i + 1}
              </span>
              <span className={cn('hidden text-sm font-semibold sm:block', i === step ? 'text-fg' : 'text-muted')}>{t(s)}</span>
              {i < steps.length - 1 && <span className="h-px flex-1 bg-line" />}
            </li>
          ))}
        </ol>

        <motion.div key={step} initial={{ opacity: 0.4, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
            {step === 0 && (
              <div className="flex flex-col gap-7">
                <fieldset>
                  <legend className="mb-3 font-bold">{t(copy.course)}</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {options.map((o) => (
                      <label
                        key={o.id}
                        className={cn(
                          'flex cursor-pointer items-start gap-3 rounded-2xl border p-3.5 transition',
                          courseId === o.id ? 'border-fg bg-fg/[.04] ring-1 ring-fg' : 'border-line hover:border-fg/30',
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
                            {o.combo && <span className="mr-1.5 rounded bg-gold px-1.5 py-0.5 text-[10px] text-ink">{t(copy.combo)}</span>}
                            {o.title}
                          </span>
                          <span className="mt-0.5 block text-xs text-muted">{o.sub}</span>
                        </span>
                        <span className="shrink-0 text-sm font-bold text-rouge">{o.fee != null ? taka(o.fee, t.locale) : '—'}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="mb-3 font-bold">{t(copy.batch)}</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[...batches, { id: 'flexible' } as BatchSchedule].map((b, i) => (
                      <label
                        key={b.id}
                        className={cn(
                          'flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 transition',
                          batchId === b.id ? 'border-fg bg-fg/[.04] ring-1 ring-fg' : 'border-line hover:border-fg/30',
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
                  <div className="rounded-2xl border border-dashed border-gold/70 bg-gold/10 p-4 text-sm">
                    <strong>{t(copy.customFeeLabel)}</strong> {t(copy.customFee)}
                  </div>
                )}
              </div>
            )}

            {step === 2 && !custom && (
              <div className="flex flex-col gap-6">
                <fieldset>
                  <legend className="mb-3 font-bold">{t(copy.plan)}</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {(['full', 'half'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPlan(p)}
                        className={cn(
                          'rounded-2xl border p-4 text-left transition',
                          plan === p ? 'border-fg ring-1 ring-fg' : 'border-line hover:border-fg/30',
                        )}
                      >
                        <span className="block text-sm font-bold">{t(p === 'full' ? copy.full : copy.half)}</span>
                        <span className="font-display text-2xl font-semibold text-rouge">
                          {taka(p === 'full' ? course.fee! : Math.round(course.fee! / 2), t.locale)}
                        </span>
                      </button>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="mb-3 font-bold">{t(copy.method)}</legend>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        ['bkash', 'bg-bkash border-bkash'],
                        ['nagad', 'bg-orange-600 border-orange-600'],
                        ['bank', 'bg-ink border-ink'],
                      ] as const
                    ).map(([m, on]) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMethod(m)}
                        className={cn(
                          'rounded-2xl border px-3 py-3 text-sm font-bold transition',
                          method === m ? `${on} text-white shadow-md` : 'border-line hover:border-fg/30',
                        )}
                      >
                        {t(METHOD_LABEL[m])}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {method === 'bkash' && (
                  <div className="rounded-2xl border border-bkash/30 bg-bkash/[.06] p-5">
                    <p className="text-sm font-bold text-bkash">{t(copy.bkashHow)}</p>
                    <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-surface p-3">
                      <span className="font-mono text-xl font-bold tracking-wider">{BRAND_CONTACT.bkashPersonal}</span>
                      <button
                        type="button"
                        onClick={async () => {
                          await navigator.clipboard?.writeText(BRAND_CONTACT.bkashPersonal).catch(() => {});
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="flex items-center gap-1.5 rounded-lg bg-bkash px-3 py-1.5 text-xs font-bold text-white"
                      >
                        {copied ? <Check size={13} /> : <Copy size={13} />} {t(copied ? copy.copied : copy.copy)}
                      </button>
                    </div>
                    <ol className={cn('mt-3 space-y-1 text-sm text-fg/80', bn && 'font-bangla')}>
                      {copy.bkashSteps.map((s, i) => (
                        <li key={s.en}>
                          {t(s)}
                          {i === 2 && <strong className="ml-1 text-bkash">{taka(amount, t.locale)}</strong>}
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
                {method === 'nagad' && <p className="rounded-2xl bg-orange-500/10 p-4 text-sm">{t(copy.nagad)}</p>}
                {method === 'bank' && <p className="rounded-2xl bg-fg/5 p-4 text-sm">{t(copy.bank)}</p>}
              </div>
            )}
        </motion.div>

        {failure && <p className="mt-5 rounded-2xl bg-rouge/10 p-4 text-sm text-rouge">{failure}</p>}

        <div className="mt-8 flex items-center justify-between gap-3">
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
        <div className="overflow-hidden rounded-[26px] bg-ink text-white">
          <div className="p-6">
            <p className="text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">
              {t({ en: 'Boarding pass · WLF BD', bn: 'বোর্ডিং পাস · WLF BD' })}
            </p>
            <p className={cn('font-display mt-4 text-2xl leading-tight font-semibold', bn && 'font-bangla')}>{course.title}</p>
            <p className="mt-1 text-sm text-white/60">{course.sub}</p>
            <p className="mt-4 text-sm text-white/70">{batchLabel}</p>
          </div>
          <div className="border-t-2 border-dashed border-white/15 p-6">
            {custom ? (
              <p className="text-sm text-white/75">{t(copy.customFee)}</p>
            ) : (
              <>
                <p className="text-[10px] font-bold tracking-widest text-white/50 uppercase">
                  {t(course.combo ? copy.totalCombo : copy.total)}
                </p>
                <p className="font-display text-4xl font-semibold text-gold">{taka(course.fee!, t.locale)}</p>
                {plan === 'half' && (
                  <p className="mt-1 text-sm text-white/65">
                    {t(copy.payNow)}: <strong className="text-white">{taka(amount, t.locale)}</strong>
                  </p>
                )}
              </>
            )}
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted">{t(copy.helpline)}</p>
      </aside>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-xs font-semibold text-rouge">{error}</span>}
    </label>
  );
}
