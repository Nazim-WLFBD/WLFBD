'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, ArrowRight, Calculator } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { MapleLeaf } from '@/components/ui/MapleLeaf';
import { calculateCrs, FRENCH_BONUS, type Education, type EnglishLevel } from '@/lib/crs';
import { cn, num } from '@/lib/utils';
import type { L } from '@/i18n/t';

const copy = {
  tool: { en: 'CANADA EXPRESS ENTRY TOOL', bn: 'কানাডা EXPRESS ENTRY টুল' },
  title: { en: 'Canada CRS Point Simulator', bn: 'কানাডা CRS পয়েন্ট ক্যালকুলেটর' },
  age: { en: 'Your Age:', bn: 'আপনার বয়স (Age):' },
  education: { en: 'Education Level:', bn: 'শিক্ষাগত যোগ্যতা (Education):' },
  english: { en: 'English Ability (IELTS):', bn: 'ইংরেজি দক্ষতা (IELTS Score):' },
  french: { en: 'French TEF CLB 7 Proficiency:', bn: 'ফ্রেঞ্চ ভাষা দক্ষতা (TEF CLB 7 / B2):' },
  frenchSub: { en: 'Official IRCC Bonus Factor', bn: 'IRCC নিয়মানুযায়ী অতিরিক্ত পয়েন্ট' },
  active: { en: 'ACTIVE (+62)', bn: 'চালু (+৬২)' },
  disabled: { en: 'DISABLED (0)', bn: 'বন্ধ (০)' },
  total: { en: 'ESTIMATED TOTAL CRS SCORE', bn: 'আনুমানিক মোট CRS স্কোর' },
  bonus: { en: '+62 French Bonus Added!', bn: '+৬২ ফ্রেঞ্চ বোনাস যুক্ত হয়েছে!' },
  good: {
    en: 'Highly competitive for French Category PR selection!',
    bn: 'ফ্রেঞ্চ শেখার ফলে আপনার ফাইল ক্যাটাগরি ড্র-তে সিলেক্ট হওয়ার সুযোগ ৯৫%+',
  },
  hard: {
    en: 'General draw cutoff (520+) is extremely high without French.',
    bn: 'ফ্রেঞ্চ ছাড়া জেনারেল ড্র কাটঅফ (৫২০+) পাওয়া বর্তমান সময়ে অত্যন্ত কঠিন',
  },
  boost: {
    en: (n: string) => `Adding French will immediately boost your score to ${n}!`,
    bn: (n: string) => `ফ্রেঞ্চ যুক্ত করলে আপনার পয়েন্ট সরাসরি ${n} এ পৌঁছাবে!`,
  },
  enroll: { en: 'Enroll in TEF Canada to Gain +62 Points', bn: 'TEF Canada কোর্সে এনরোল করে +৬২ পয়েন্ট অর্জন করুন' },
  breakdown: { en: 'Score breakdown', bn: 'পয়েন্ট বিভাজন' },
  ageL: { en: 'Age', bn: 'বয়স' },
  eduL: { en: 'Education', bn: 'শিক্ষা' },
  engL: { en: 'English', bn: 'ইংরেজি' },
  frL: { en: 'French bonus', bn: 'ফ্রেঞ্চ বোনাস' },
  disclaimer: {
    en: 'Simplified estimate for guidance only. It is not the official IRCC calculator and leaves out factors such as work experience, spouse and provincial nomination. We do not provide immigration legal advice.',
    bn: 'এটি শুধুমাত্র নির্দেশনার জন্য একটি সরলীকৃত হিসাব, অফিশিয়াল IRCC ক্যালকুলেটর নয়। কাজের অভিজ্ঞতা, স্পাউস ও প্রাদেশিক নমিনেশনের মতো বিষয় এতে ধরা হয়নি। আমরা ইমিগ্রেশন আইনি পরামর্শ প্রদান করি না।',
  },
};

const EDUCATION: { v: Education; l: L }[] = [
  { v: 'bachelor', l: { en: 'Bachelor’s Degree (4-year Honours)', bn: 'ব্যাচেলর ডিগ্রি (৪ বছর মেয়াদি অনার্স)' } },
  { v: 'two_degrees', l: { en: 'Two or More Certificates / Diplomas', bn: 'দুই বা ততোধিক সার্টিফিকেট / ডিপ্লোমা' } },
  { v: 'master', l: { en: 'Master’s Degree', bn: 'মাস্টার্স ডিগ্রি' } },
  { v: 'phd', l: { en: 'Ph.D. / Doctorate', bn: 'পিএইচডি / ডক্টরেট' } },
];
const ENGLISH: { v: EnglishLevel; l: L }[] = [
  { v: 'ielts_6', l: { en: 'IELTS CLB 7 (6.0 Each Band)', bn: 'IELTS CLB 7 (প্রতি ব্যান্ডে 6.0)' } },
  { v: 'ielts_7', l: { en: 'IELTS CLB 8 (6.5 - 7.0 Overall)', bn: 'IELTS CLB 8 (ওভারঅল 6.5 - 7.0)' } },
  { v: 'ielts_8', l: { en: 'IELTS CLB 9+ (8.0 Listening, 7.0 Others)', bn: 'IELTS CLB 9+ (লিসেনিং 8.0, বাকিগুলো 7.0)' } },
];

export function CrsCalculator({ onSave }: { onSave?: (score: number) => Promise<void> | void }) {
  const t = useT();
  const [age, setAge] = useState(28);
  const [education, setEducation] = useState<Education>('master');
  const [english, setEnglish] = useState<EnglishLevel>('ielts_7');
  const [hasFrench, setHasFrench] = useState(true);
  const [saved, setSaved] = useState(false);

  const r = calculateCrs({ age, education, english, hasFrench });
  const max = 600;
  const bars = [
    { l: t(copy.ageL), v: r.age, c: 'bg-bleu' },
    { l: t(copy.eduL), v: r.education, c: 'bg-gold' },
    { l: t(copy.engL), v: r.english, c: 'bg-ink-3 dark:bg-white/60' },
    { l: t(copy.frL), v: r.french, c: 'bg-maple' },
  ];

  const field = 'w-full rounded-2xl border border-line bg-surface px-4 py-3.5 text-[15px] outline-none focus:border-fg/40';

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr]">
      {/* Inputs */}
      <div className="rounded-[28px] border border-line bg-surface p-6 md:p-8">
        <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-rouge">
          <Calculator size={15} /> {t(copy.tool)}
        </p>
        <h2 className="font-display mt-3 text-3xl font-semibold">{t(copy.title)}</h2>

        <div className="mt-7 flex flex-col gap-6">
          <label className="block">
            <span className="mb-3 flex justify-between font-bold">
              {t(copy.age)} <span className="font-display text-2xl text-rouge">{num(age, t.locale)}</span>
            </span>
            <input
              type="range"
              min={20}
              max={45}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full accent-[var(--rouge)]"
            />
            <span className="mt-1 flex justify-between text-xs text-muted">
              <span>{num(20, t.locale)}</span>
              <span>{num(45, t.locale)}</span>
            </span>
          </label>
          <label className="block">
            <span className="mb-2 block font-bold">{t(copy.education)}</span>
            <select value={education} onChange={(e) => setEducation(e.target.value as Education)} className={field}>
              {EDUCATION.map((o) => (
                <option key={o.v} value={o.v}>
                  {t(o.l)}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block font-bold">{t(copy.english)}</span>
            <select value={english} onChange={(e) => setEnglish(e.target.value as EnglishLevel)} className={field}>
              {ENGLISH.map((o) => (
                <option key={o.v} value={o.v}>
                  {t(o.l)}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface-2/60 p-4">
            <div>
              <p className="font-bold">{t(copy.french)}</p>
              <p className="text-xs text-muted">{t(copy.frenchSub)}</p>
            </div>
            <button
              role="switch"
              aria-checked={hasFrench}
              onClick={() => setHasFrench(!hasFrench)}
              className={cn(
                'shrink-0 rounded-full px-4 py-2 text-xs font-extrabold transition',
                hasFrench ? 'bg-maple text-white shadow-md' : 'bg-fg/10 text-fg',
              )}
            >
              {t(hasFrench ? copy.active : copy.disabled)}
            </button>
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="relative flex flex-col overflow-hidden rounded-[28px] bg-ink p-6 text-white md:p-8">
        <MapleLeaf size={320} className="pointer-events-none absolute -right-16 -bottom-16 text-white/[.04]" />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] font-bold tracking-[0.2em] text-white/55">{t(copy.total)}</p>
          <AnimatePresence>
            {hasFrench && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="rounded-full bg-maple px-3 py-1 text-[11px] font-extrabold"
              >
                {t(copy.bonus)}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <motion.p
          key={r.total}
          initial={{ opacity: 0.4, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display mt-3 text-[clamp(4.5rem,12vw,7.5rem)] leading-none font-semibold"
        >
          {num(r.total, t.locale)}
        </motion.p>
        <p className={cn('mt-3 font-semibold', hasFrench ? 'text-mint' : 'text-gold')}>
          {hasFrench ? t(copy.good) : t(copy.hard)}
        </p>
        {!hasFrench && (
          <p className="mt-4 flex items-start gap-2 rounded-2xl bg-rouge/15 p-4 text-sm text-[#ffb3bd]">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {copy.boost[t.locale](num(r.total + FRENCH_BONUS, t.locale))}
          </p>
        )}

        <div className="mt-7">
          <p className="mb-3 text-[11px] font-bold tracking-[0.2em] text-white/50 uppercase">{t(copy.breakdown)}</p>
          <div className="flex h-4 overflow-hidden rounded-full bg-white/10">
            {bars.map((b) => (
              <span
                key={b.l}
                className={cn('block h-full transition-[width] duration-500 ease-out', b.c)}
                style={{ width: `${(b.v / max) * 100}%` }}
              />
            ))}
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {bars.map((b) => (
              <div key={b.l} className="flex items-center justify-between gap-2">
                <dt className="flex items-center gap-2 text-white/65">
                  <i className={cn('h-2.5 w-2.5 rounded-full', b.c)} />
                  {b.l}
                </dt>
                <dd className="font-bold">{num(b.v, t.locale)}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mt-auto flex flex-col gap-2 pt-8">
          {onSave && (
            <button
              onClick={async () => {
                await onSave(r.total);
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
              }}
              className={btn('ghost-light', 'md', 'w-full')}
            >
              {saved
                ? t({ en: 'Score saved to profile!', bn: 'স্কোর প্রোফাইলে সেভ হয়েছে!' })
                : t({ en: 'Save Score to My Profile', bn: 'এই পয়েন্ট স্কোর আমার প্রোফাইলে সেভ করুন' })}
            </button>
          )}
          <Link href={{ pathname: '/enroll', query: { course: 'tef-canada' } }} className={btn('rouge', 'md', 'w-full')}>
            {t(copy.enroll)} <ArrowRight size={16} />
          </Link>
          <p className="mt-2 text-[11px] leading-relaxed text-white/45">{t(copy.disclaimer)}</p>
        </div>
      </div>
    </div>
  );
}
