'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { ArrowRight, BookOpen, ClipboardCheck, LogOut, Megaphone, PlayCircle, Save, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useT, type L } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { useAuth } from '@/components/auth/AuthContext';
import { GOAL_OPTIONS, LEVELS } from '@/components/auth/AuthForm';
import { firebase } from '@/lib/firebase';
import { cefrLabel } from '@/lib/quizScoring';
import { RECORDED_COURSES } from '@/data/recordedCourses';
import { BRAND_CONTACT } from '@/lib/brand';
import { cn, num } from '@/lib/utils';

type Row = Record<string, unknown> & { id: string };

/** Preferred batch: the English value is stored on the profile; `l` is the display label. */
const BATCH_TIMES: { v: string; l: L }[] = [
  { v: 'Fri & Sun 7–9 PM', l: { en: 'Fri & Sun 7–9 PM', bn: 'শুক্র ও রবি সন্ধ্যা ৭–৯টা' } },
  { v: 'Fri & Sun 9–11 PM', l: { en: 'Fri & Sun 9–11 PM', bn: 'শুক্র ও রবি রাত ৯–১১টা' } },
  { v: 'Sat & Mon 7–9 PM', l: { en: 'Sat & Mon 7–9 PM', bn: 'শনি ও সোম সন্ধ্যা ৭–৯টা' } },
  { v: 'Sat & Mon 9–11 PM', l: { en: 'Sat & Mon 9–11 PM', bn: 'শনি ও সোম রাত ৯–১১টা' } },
  { v: 'Custom', l: { en: 'Custom', bn: 'কাস্টম' } },
];

const STATUS: Record<string, string> = {
  Verified: 'bg-mint/15 text-mint',
  Pending: 'bg-gold/20 text-[#9a6b00] dark:text-gold',
  Failed: 'bg-rouge/15 text-rouge',
  Consultation: 'bg-bleu/15 text-bleu',
};
const STATUS_LABEL: Record<string, L> = {
  Verified: { en: 'Verified', bn: 'যাচাইকৃত' },
  Pending: { en: 'Pending', bn: 'অপেক্ষমাণ' },
  Failed: { en: 'Failed', bn: 'ব্যর্থ' },
  Consultation: { en: 'Consultation', bn: 'কাউন্সেলিং' },
};
const ROLE_LABEL: Record<string, L> = {
  superAdmin: { en: 'Super admin', bn: 'সুপার অ্যাডমিন' },
  admin: { en: 'Admin', bn: 'অ্যাডমিন' },
  instructor: { en: 'Instructor', bn: 'ইন্সট্রাক্টর' },
  student: { en: 'Student', bn: 'শিক্ষার্থী' },
};

export function Dashboard() {
  const t = useT();
  const { user, profile, isAdmin, logOut, updateMyProfile } = useAuth();
  const [enrollments, setEnrollments] = useState<Row[]>([]);
  const [attempts, setAttempts] = useState<Row[]>([]);
  const [news, setNews] = useState<Row[]>([]);
  const [form, setForm] = useState({ displayName: '', phoneNumber: '', targetGoal: '', currentFrenchLevel: '', preferredBatchTime: '', bio: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile)
      setForm({
        displayName: profile.displayName ?? '',
        phoneNumber: profile.phoneNumber ?? '',
        targetGoal: profile.targetGoal ?? '',
        currentFrenchLevel: profile.currentFrenchLevel ?? '',
        preferredBatchTime: profile.preferredBatchTime ?? '',
        bio: profile.bio ?? '',
      });
  }, [profile]);

  useEffect(() => {
    const fb = firebase();
    if (!fb || !user) return;
    const rows = (s: { docs: { id: string; data: () => Record<string, unknown> }[] }) => s.docs.map((d) => ({ id: d.id, ...d.data() }));
    getDocs(query(collection(fb.db, 'enrollments'), where('userId', '==', user.uid)))
      .then((s) => setEnrollments(rows(s)))
      .catch(() => {});
    getDocs(query(collection(fb.db, 'users', user.uid, 'quizAttempts'), orderBy('completedAt', 'desc'), limit(10)))
      .then((s) => setAttempts(rows(s)))
      .catch(() => {});
    getDocs(query(collection(fb.db, 'announcements'), orderBy('createdAt', 'desc'), limit(5)))
      .then((s) => setNews(rows(s)))
      .catch(() => {});
  }, [user]);

  const recorded = RECORDED_COURSES.filter((r) => profile?.enrolledCourses?.includes(r.id));
  const avg = attempts.length ? Math.round(attempts.reduce((a, x) => a + Number(x.percentage ?? 0), 0) / attempts.length) : null;
  const best = attempts.length ? Math.max(...attempts.map((x) => Number(x.percentage ?? 0))) : null;
  const input = 'w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-fg/50';
  const name = profile?.displayName || user?.email?.split('@')[0] || '';

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="flex flex-col gap-6">
        {isAdmin && (
          <Link
            href="/admin"
            className="group flex flex-wrap items-center gap-4 rounded-[26px] border-2 border-gold bg-gold/10 p-5 transition hover:bg-gold/20"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold text-ink">
              <ShieldCheck size={24} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="font-display block text-xl font-semibold">{t({ en: 'Admin Portal', bn: 'অ্যাডমিন পোর্টাল' })}</span>
              <span className="text-sm text-muted">
                {t({
                  en: 'Verify payments, manage students, courses, batches, FAQ and reviews.',
                  bn: 'পেমেন্ট যাচাই, শিক্ষার্থী, কোর্স, ব্যাচ, প্রশ্নোত্তর ও রিভিউ পরিচালনা করুন।',
                })}
              </span>
            </span>
            <span className={btn('ink', 'md')}>
              {t({ en: 'Open', bn: 'খুলুন' })} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        )}

        {/* Header card */}
        <div className="flex flex-wrap items-center gap-4 rounded-[26px] bg-ink p-6 text-white">
          <span className="font-display flex h-16 w-16 items-center justify-center rounded-full bg-gold text-2xl font-semibold text-ink">
            {name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display truncate text-2xl font-semibold">{name}</p>
            <p className="truncate text-sm text-white/60">
              {user?.email} · <span>{t(ROLE_LABEL[profile?.role ?? 'student'] ?? ROLE_LABEL.student)}</span>
            </p>
          </div>
          <button onClick={logOut} className={btn('ghost-light', 'sm')}>
            <LogOut size={15} /> {t({ en: 'Log out', bn: 'লগআউট' })}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            [t({ en: 'Enrollments', bn: 'ভর্তি' }), num(enrollments.length + recorded.length, t.locale)],
            [t({ en: 'Quizzes taken', bn: 'কুইজ দিয়েছেন' }), num(attempts.length, t.locale)],
            [t({ en: 'Average score', bn: 'গড় স্কোর' }), avg != null ? `${num(avg, t.locale)}%` : '—'],
            [t({ en: 'Saved CRS', bn: 'সেভ করা CRS' }), profile?.crsScore != null ? num(profile.crsScore, t.locale) : '—'],
          ].map(([k, v]) => (
            <div key={String(k)} className="rounded-2xl border border-line bg-surface p-4">
              <p className="text-[10px] font-bold tracking-widest text-muted uppercase">{k}</p>
              <p className="font-display mt-1 text-2xl font-semibold">{v}</p>
            </div>
          ))}
        </div>

        {/* Courses */}
        <section className="rounded-[24px] border border-line bg-surface p-6">
          <h2 className="font-display flex items-center gap-2 text-xl font-semibold">
            <BookOpen size={18} className="text-rouge" /> {t({ en: 'My courses', bn: 'আমার কোর্স' })}
          </h2>
          {enrollments.length + recorded.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-line p-6 text-center text-sm text-muted">
              {t({ en: 'No enrollments yet.', bn: 'এখনো কোনো ভর্তি নেই।' })}{' '}
              <Link href="/courses" className="font-semibold text-bleu hover:underline">
                {t({ en: 'Browse courses', bn: 'কোর্স দেখুন' })}
              </Link>
            </div>
          ) : (
            <ul className="mt-4 flex flex-col gap-2">
              {recorded.map((r) => (
                <li key={r.id} className="flex items-center gap-3 rounded-2xl bg-surface-2/60 p-4">
                  <PlayCircle size={20} className="text-rouge" />
                  <span className="flex-1 font-semibold">{t.locale === 'bn' ? r.banglaTitle : r.title}</span>
                  <Link href={`/learn/${r.slug}`} className={btn('rouge', 'sm')}>
                    {t({ en: 'Go to classroom', bn: 'ক্লাসরুমে যান' })}
                  </Link>
                </li>
              ))}
              {enrollments.map((e) => (
                <li key={e.id} className="flex flex-wrap items-center gap-3 rounded-2xl bg-surface-2/60 p-4">
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{String(e.courseTitle)}</span>
                    <span className="text-xs text-muted">{String(e.batchSchedule ?? '')}</span>
                  </span>
                  <span className={cn('rounded-full px-2.5 py-1 text-xs font-bold', STATUS[String(e.paymentStatus)] ?? 'bg-fg/10')}>
                    {STATUS_LABEL[String(e.paymentStatus)] ? t(STATUS_LABEL[String(e.paymentStatus)]) : String(e.paymentStatus ?? '')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Quiz history */}
        <section className="rounded-[24px] border border-line bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display flex items-center gap-2 text-xl font-semibold">
              <ClipboardCheck size={18} className="text-rouge" /> {t({ en: 'Quiz history', bn: 'কুইজ হিস্ট্রি' })}
            </h2>
            {best != null && (
              <span className="text-sm text-muted">
                {t({ en: 'Best', bn: 'সেরা' })}: {num(best, t.locale)}%
              </span>
            )}
          </div>
          {attempts.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-line p-6 text-center text-sm text-muted">
              <Link href="/quiz/placement-test" className="font-semibold text-bleu hover:underline">
                {t({ en: 'Take the free level test', bn: 'ফ্রি লেভেল টেস্ট দিন' })}
              </Link>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-line">
              {attempts.map((a) => (
                <li key={a.id} className="flex items-center gap-3 py-3 text-sm">
                  <span className="flex-1 font-semibold">{String(a.quizTitle)}</span>
                  <span className="text-muted">{t(cefrLabel(String(a.estimatedCEFR ?? '')))}</span>
                  <span className="font-display w-14 text-right text-lg font-semibold">{num(String(a.percentage), t.locale)}%</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <aside className="flex flex-col gap-6">
        {/* Profile edit */}
        <section className="rounded-[24px] border border-line bg-surface p-6">
          <h2 className="font-display text-xl font-semibold">{t({ en: 'My profile', bn: 'আমার প্রোফাইল' })}</h2>
          <form
            className="mt-4 flex flex-col gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await updateMyProfile(form);
                setSaved(true);
                setTimeout(() => setSaved(false), 2500);
              } catch {
                alert(t({ en: 'Could not save. Check your connection and try again.', bn: 'সেভ করা যায়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।' }));
              }
            }}
          >
            <input
              className={input}
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
              placeholder={t({ en: 'Name', bn: 'নাম' })}
            />
            <input
              className={input}
              value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              placeholder={t({ en: 'WhatsApp', bn: 'হোয়াটসঅ্যাপ নম্বর' })}
              inputMode="tel"
            />
            <select className={input} value={form.targetGoal} onChange={(e) => setForm({ ...form, targetGoal: e.target.value })}>
              <option value="">{t({ en: 'Goal…', bn: 'লক্ষ্য…' })}</option>
              {GOAL_OPTIONS.map((g) => (
                <option key={g.v} value={g.v}>
                  {t(g.l)}
                </option>
              ))}
            </select>
            <select className={input} value={form.currentFrenchLevel} onChange={(e) => setForm({ ...form, currentFrenchLevel: e.target.value })}>
              <option value="">{t({ en: 'Level…', bn: 'লেভেল…' })}</option>
              {LEVELS.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
            <select className={input} value={form.preferredBatchTime} onChange={(e) => setForm({ ...form, preferredBatchTime: e.target.value })}>
              <option value="">{t({ en: 'Preferred batch…', bn: 'পছন্দের ব্যাচ…' })}</option>
              {BATCH_TIMES.map((g) => (
                <option key={g.v} value={g.v}>
                  {t(g.l)}
                </option>
              ))}
            </select>
            <textarea
              className={input}
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder={t({ en: 'Bio', bn: 'নিজের সম্পর্কে' })}
            />
            <button className={btn('ink', 'sm', 'self-start')}>
              <Save size={14} /> {saved ? t({ en: 'Saved!', bn: 'সেভ হয়েছে!' }) : t({ en: 'Save', bn: 'সেভ' })}
            </button>
          </form>
        </section>

        <Link href="/crs-calculator" className="flex items-center gap-3 rounded-[24px] bg-maple p-5 text-white">
          <Sparkles size={20} />
          <span className="flex-1">
            <span className="block text-sm text-white/80">CRS</span>
            <span className="font-display text-2xl font-semibold">
              {profile?.crsScore != null ? num(profile.crsScore, t.locale) : t({ en: 'Calculate', bn: 'হিসাব করুন' })}
            </span>
          </span>
        </Link>

        {news.length > 0 && (
          <section className="rounded-[24px] border border-line bg-surface p-6">
            <h2 className="font-display flex items-center gap-2 text-xl font-semibold">
              <Megaphone size={18} className="text-rouge" /> {t({ en: 'Announcements', bn: 'ঘোষণা' })}
            </h2>
            <ul className="mt-3 flex flex-col gap-3">
              {news.map((n) => (
                <li key={n.id} className="rounded-xl bg-surface-2/60 p-3">
                  <p className="text-sm font-bold">{String((t.locale === 'bn' && n.banglaTitle) || n.title)}</p>
                  <p className="mt-1 text-sm text-muted">{String((t.locale === 'bn' && n.banglaContent) || n.content || '')}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
        <p className="text-center text-xs text-muted">
          {t({ en: 'Helpline', bn: 'হেল্পলাইন' })}: {BRAND_CONTACT.phone}
        </p>
      </aside>
    </div>
  );
}
