'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useT, type L } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { FREE_CLASS_INTERESTS } from '@/data/freeClass';
import { BD_PHONE, normalizePhone } from '@/lib/phone';
import { cn } from '@/lib/utils';

const COPY = {
  name: { en: 'Full name', bn: 'পুরো নাম' },
  phone: { en: 'Phone number', bn: 'ফোন নম্বর' },
  whatsapp: { en: 'WhatsApp number (if different)', bn: 'হোয়াটসঅ্যাপ নম্বর (ভিন্ন হলে)' },
  email: { en: 'Email address', bn: 'ইমেইল অ্যাড্রেস' },
  interest: { en: 'Course or subject of interest', bn: 'আগ্রহের কোর্স বা বিষয়' },
  choose: { en: 'Select one…', bn: 'একটি বেছে নিন…' },
  submit: { en: 'Register for the free class', bn: 'ফ্রি ক্লাসে রেজিস্টার করুন' },
  doneTitle: { en: 'You’re registered!', bn: 'রেজিস্ট্রেশন সম্পন্ন হয়েছে!' },
  doneText: {
    en: 'We’ll send the date, time and joining link of the next free class to your WhatsApp. A confirmation email is on its way too.',
    bn: 'পরবর্তী ফ্রি ক্লাসের তারিখ, সময় ও জয়েনিং লিংক আপনার হোয়াটসঅ্যাপে পাঠানো হবে। একটি কনফার্মেশন ইমেইলও পাঠানো হয়েছে।',
  },
  another: { en: 'Register someone else', bn: 'আরেকজনকে রেজিস্টার করুন' },
  privacy: { en: 'We only use your details to contact you about classes.', bn: 'আপনার তথ্য শুধু ক্লাস সংক্রান্ত যোগাযোগে ব্যবহার করা হবে।' },
} satisfies Record<string, L>;

const ERR = {
  required: { en: 'Please enter your name.', bn: 'আপনার নাম লিখুন।' },
  phone: { en: 'Enter a valid 11-digit Bangladeshi mobile number.', bn: 'সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন।' },
  email: { en: 'Enter a valid email address.', bn: 'সঠিক ইমেইল অ্যাড্রেস দিন।' },
  interest: { en: 'Please choose a course.', bn: 'একটি কোর্স বেছে নিন।' },
  rate_limited: { en: 'Too many submissions. Please try again later.', bn: 'অনেকবার জমা দেওয়া হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।' },
  generic: { en: 'Could not submit. Please check your connection and try again.', bn: 'জমা দেওয়া যায়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।' },
} satisfies Record<string, L>;

type Field = 'name' | 'phone' | 'whatsapp' | 'email' | 'interest';
/** Fields in on-screen order with their id stems (the form's `source` is appended, so the page and sheet never clash). */
const FIELD_ID: Record<Field, string> = { name: 'fc-name', phone: 'fc-phone', whatsapp: 'fc-wa', email: 'fc-email', interest: 'fc-interest' };
const FIELD_ORDER = Object.keys(FIELD_ID) as Field[];

/** Free class registration form, used on /free-class and in the phone support sheet. */
export function FreeClassForm({ source = 'page', compact = false }: { source?: 'page' | 'mobile-sheet'; compact?: boolean }) {
  const t = useT();
  const [f, setF] = useState({ name: '', phone: '', whatsapp: '', email: '', interest: '' });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const set = (k: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF((s) => ({ ...s, [k]: e.target.value }));
  const idOf = (k: Field) => `${FIELD_ID[k]}-${source}`;

  // First invalid field, brought into view and focused once its error state has rendered
  const pendingFocus = useRef<Field | null>(null);
  useEffect(() => {
    const k = pendingFocus.current;
    if (!k) return;
    pendingFocus.current = null;
    const el = document.getElementById(`${FIELD_ID[k]}-${source}`);
    if (!el) return;
    // Instant: Lenis owns the page scroll and swallows native smooth scrolls
    el.scrollIntoView({ block: 'center' });
    el.focus({ preventScroll: true });
  }, [errors, source]);
  const focusFirst = (e: Partial<Record<Field, string>>) => {
    pendingFocus.current = FIELD_ORDER.find((key) => e[key]) ?? null;
  };

  const validate = () => {
    const e: Partial<Record<Field, string>> = {};
    if (f.name.trim().length < 2) e.name = t(ERR.required);
    if (!BD_PHONE.test(normalizePhone(f.phone))) e.phone = t(ERR.phone);
    if (f.whatsapp.trim() && !BD_PHONE.test(normalizePhone(f.whatsapp))) e.whatsapp = t(ERR.phone);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = t(ERR.email);
    if (!f.interest) e.interest = t(ERR.interest);
    setErrors(e);
    focusFirst(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setFailure(null);
    if (!validate()) return;
    setBusy(true);
    try {
      const r = await fetch('/api/free-class', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.name.trim(),
          phone: normalizePhone(f.phone),
          whatsapp: normalizePhone(f.whatsapp),
          email: f.email.trim(),
          interest: f.interest,
          locale: t.locale,
          source,
        }),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        if (d.field && d.field in f) {
          const fe = { [d.field as Field]: t(ERR[d.field as keyof typeof ERR] ?? ERR.generic) };
          setErrors(fe);
          focusFirst(fe);
        }
        setFailure(t(d.code === 'rate_limited' ? ERR.rate_limited : ERR.generic));
        return;
      }
      setDone(true);
    } catch {
      setFailure(t(ERR.generic));
    } finally {
      setBusy(false);
    }
  };

  if (done)
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center" role="status">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-soft text-rouge">
          <CheckCircle2 size={26} />
        </span>
        <p className="font-display text-2xl font-semibold">{t(COPY.doneTitle)}</p>
        <p className="max-w-md text-sm leading-relaxed text-muted">{t(COPY.doneText)}</p>
        <button
          type="button"
          onClick={() => {
            setF({ name: '', phone: '', whatsapp: '', email: '', interest: '' });
            setDone(false);
          }}
          className="mt-2 min-h-11 text-sm font-semibold text-rouge hover:underline"
        >
          {t(COPY.another)}
        </button>
      </div>
    );

  // text-base (16px) on phones: iOS Safari zooms the page into any field with a smaller font
  const field = (err?: string) =>
    cn(
      'w-full rounded-xl border bg-surface px-4 py-3 text-base outline-none transition focus:border-bleu focus:ring-2 focus:ring-bleu/20 sm:text-[15px]',
      err ? 'border-rouge' : 'border-line',
    );
  const label = 'mb-2 block text-[11px] font-bold tracking-[0.14em] text-muted uppercase';
  const errText = (k: Field) =>
    errors[k] && (
      <p id={`${idOf(k)}-error`} className="mt-1 text-xs font-semibold text-rouge">
        {errors[k]}
      </p>
    );
  // id + error wiring: the error text is announced with the field
  const a11y = (k: Field) => ({
    id: idOf(k),
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? `${idOf(k)}-error` : undefined,
  });

  return (
    <form onSubmit={submit} noValidate className={cn('grid gap-4', !compact && 'sm:grid-cols-2')}>
      <div className={cn(!compact && 'sm:col-span-2')}>
        <label htmlFor={`fc-name-${source}`} className={label}>
          {t(COPY.name)}
        </label>
        <input {...a11y('name')} value={f.name} onChange={set('name')} autoComplete="name" enterKeyHint="next" className={field(errors.name)} />
        {errText('name')}
      </div>
      <div>
        <label htmlFor={`fc-phone-${source}`} className={label}>
          {t(COPY.phone)}
        </label>
        <input
          {...a11y('phone')}
          value={f.phone}
          onChange={set('phone')}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          enterKeyHint="next"
          placeholder="01XXXXXXXXX"
          className={field(errors.phone)}
        />
        {errText('phone')}
      </div>
      <div>
        <label htmlFor={`fc-wa-${source}`} className={label}>
          {t(COPY.whatsapp)}
        </label>
        <input
          {...a11y('whatsapp')}
          value={f.whatsapp}
          onChange={set('whatsapp')}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          enterKeyHint="next"
          placeholder="01XXXXXXXXX"
          className={field(errors.whatsapp)}
        />
        {errText('whatsapp')}
      </div>
      <div>
        <label htmlFor={`fc-email-${source}`} className={label}>
          {t(COPY.email)}
        </label>
        <input {...a11y('email')} value={f.email} onChange={set('email')} type="email" autoComplete="email" enterKeyHint="next" className={field(errors.email)} />
        {errText('email')}
      </div>
      <div>
        <label htmlFor={`fc-interest-${source}`} className={label}>
          {t(COPY.interest)}
        </label>
        <select {...a11y('interest')} value={f.interest} onChange={set('interest')} className={field(errors.interest)}>
          <option value="">{t(COPY.choose)}</option>
          {FREE_CLASS_INTERESTS.map((i) => (
            <option key={i.id} value={i.id}>
              {t(i.label)}
            </option>
          ))}
        </select>
        {errText('interest')}
      </div>
      <div className={cn(!compact && 'sm:col-span-2')}>
        {failure && (
          <p role="alert" className="mb-3 rounded-xl border border-rouge/30 bg-red-soft px-4 py-2.5 text-sm font-semibold text-rouge">
            {failure}
          </p>
        )}
        <button type="submit" disabled={busy} className={btn('rouge', 'lg', 'w-full')}>
          {busy && <Loader2 size={17} className="animate-spin" />} {t(COPY.submit)}
        </button>
        <p className="mt-3 text-center text-xs text-muted">{t(COPY.privacy)}</p>
      </div>
    </form>
  );
}
