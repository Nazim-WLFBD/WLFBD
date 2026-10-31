import { CalendarCheck, Laptop, MessageCircle, Users } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { PageHero } from '@/components/layout/PageHero';
import { FreeClassForm } from '@/components/freeclass/FreeClassForm';

const COPY = {
  title: { en: 'Join a Free French Class', bn: 'ফ্রি ফ্রেঞ্চ ক্লাসে যোগ দিন' },
  meta: {
    en: 'Register for an upcoming free online French class with We Learn French BD. Meet the instructor, see how DELF and TEF/TCF classes work, and ask your questions.',
    bn: 'We Learn French BD-এর পরবর্তী ফ্রি অনলাইন ফ্রেঞ্চ ক্লাসে রেজিস্টার করুন। ইন্সট্রাক্টরের সঙ্গে পরিচিত হোন, DELF ও TEF/TCF ক্লাস কীভাবে হয় দেখুন এবং প্রশ্ন করুন।',
  },
  eyebrow: { en: 'Free class · Live online', bn: 'ফ্রি ক্লাস · লাইভ অনলাইন' },
  intro: {
    en: 'Try a real class before you enroll. Fill in the form and we’ll send you the time and joining link on WhatsApp.',
    bn: 'ভর্তির আগে একটি আসল ক্লাস করে দেখুন। ফর্মটি পূরণ করুন, ক্লাসের সময় ও জয়েনিং লিংক আমরা হোয়াটসঅ্যাপে পাঠিয়ে দেব।',
  },
  formTitle: { en: 'Free class registration', bn: 'ফ্রি ক্লাস রেজিস্ট্রেশন' },
  whatTitle: { en: 'What happens in the free class', bn: 'ফ্রি ক্লাসে যা থাকছে' },
  points: [
    { icon: Laptop, t: { en: 'A live online lesson', bn: 'লাইভ অনলাইন লেসন' }, d: { en: 'A real class with the instructor, just like our paid batches.', bn: 'ইন্সট্রাক্টরের সঙ্গে আসল ক্লাস, ঠিক আমাদের নিয়মিত ব্যাচের মতো।' } },
    { icon: Users, t: { en: 'Meet the teacher', bn: 'শিক্ষকের সঙ্গে পরিচয়' }, d: { en: 'See the teaching style and ask about DELF, TEF or TCF.', bn: 'পড়ানোর ধরন দেখুন এবং DELF, TEF বা TCF নিয়ে প্রশ্ন করুন।' } },
    { icon: CalendarCheck, t: { en: 'Find your batch', bn: 'আপনার ব্যাচ বেছে নিন' }, d: { en: 'Get advice on the right level and class schedule for you.', bn: 'আপনার জন্য সঠিক লেভেল ও ক্লাসের সময় নিয়ে পরামর্শ পান।' } },
    { icon: MessageCircle, t: { en: 'No payment, no obligation', bn: 'কোনো পেমেন্ট বা বাধ্যবাধকতা নেই' }, d: { en: 'Completely free. Enroll later only if it suits you.', bn: 'সম্পূর্ণ ফ্রি। ভালো লাগলে পরে ভর্তি হবেন।' } },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return {
    title: COPY.title[locale],
    description: COPY.meta[locale],
    alternates: { canonical: `/${locale}/free-class`, languages: { en: '/en/free-class', bn: '/bn/free-class' } },
  };
}

export default async function FreeClassPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <PageHero eyebrow={COPY.eyebrow[locale]} title={COPY.title[locale]} intro={COPY.intro[locale]} crumbs={[{ href: '/', label: locale === 'bn' ? 'হোম' : 'Home' }, { label: COPY.title[locale] }]} />
      <section className="bg-bg py-14 md:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-start">
          <div className="rounded-[var(--radius)] border border-line bg-surface p-6 shadow-[var(--shadow-lift)] md:p-9">
            <h2 className="font-display mb-6 text-2xl font-semibold md:text-3xl">{COPY.formTitle[locale]}</h2>
            <FreeClassForm source="page" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold">{COPY.whatTitle[locale]}</h2>
            <ul className="mt-6 space-y-5">
              {COPY.points.map(({ icon: Icon, t, d }) => (
                <li key={t.en} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rouge/10 text-rouge">
                    <Icon size={20} />
                  </span>
                  <div>
                    <p className="font-semibold">{t[locale]}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted">{d[locale]}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
