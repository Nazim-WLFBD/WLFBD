'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { addDoc, collection, doc, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Flag, RotateCcw, Star, Volume2, XCircle } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { useAuth } from '@/components/auth/AuthContext';
import { WhatsAppGlyph } from '@/components/layout/FloatingActions';
import { firebase } from '@/lib/firebase';
import { builtInQuestions, categoryLabel, cefrLabel, courseTitle, rate, scoreQuiz, type ScoredQuiz } from '@/lib/quizScoring';
import { waLink } from '@/lib/brand';
import { cn, num } from '@/lib/utils';
import type { Question, QuizCategory } from '@/types/quiz';

type Phase = 'intro' | 'running' | 'review' | 'done';

function shuffle<T>(a: T[]) {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

export function QuizRunner({ quiz }: { quiz: QuizCategory }) {
  const t = useT();
  const { user, profile, updateMyProfile } = useAuth();
  const pathname = usePathname();
  const storeKey = `wlf_quiz_${quiz.id}`;

  const [questions, setQuestions] = useState<Question[]>(() => builtInQuestions(quiz.id));
  const [phase, setPhase] = useState<Phase>('intro');
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [flags, setFlags] = useState<string[]>([]);
  const [left, setLeft] = useState(quiz.durationMinutes * 60);
  const [result, setResult] = useState<ScoredQuiz | null>(null);
  const [saved, setSaved] = useState(false);
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const startedAt = useRef(0);

  // Questions added by admins (Firestore) are appended to the built-in set
  useEffect(() => {
    const fb = firebase();
    if (!fb) return;
    getDocs(collection(fb.db, 'quizzes', quiz.id, 'questions'))
      .then((s) => {
        const extra = s.docs.map((d) => ({ ...(d.data() as Question), id: d.id, quizId: quiz.id }));
        if (extra.length) setQuestions((qs) => [...qs.filter((q) => !extra.some((e) => e.id === q.id)), ...extra]);
      })
      .catch(() => {});
  }, [quiz.id]);

  const options = useMemo(
    () => Object.fromEntries(questions.map((q) => [q.id, q.options ? shuffle(q.options) : []])),
    [questions],
  );

  // Resume saved progress
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(storeKey) ?? 'null');
      if (s?.answers) {
        setAnswers(s.answers);
        setFlags(s.flags ?? []);
        if (typeof s.left === 'number' && s.left > 0) setLeft(s.left);
      }
    } catch {}
  }, [storeKey]);

  useEffect(() => {
    if (phase !== 'running' && phase !== 'review') return;
    try {
      localStorage.setItem(storeKey, JSON.stringify({ answers, flags, left }));
    } catch {}
  }, [answers, flags, left, phase, storeKey]);

  const finish = useCallback(() => {
    const r = scoreQuiz(quiz, questions, answersRef.current); // latest answers, not a stale snapshot
    setResult(r);
    setPhase('done');
    try {
      localStorage.removeItem(storeKey);
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [quiz, questions, storeKey]);

  useEffect(() => {
    if (phase !== 'running' && phase !== 'review') return;
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [phase]);

  // Time's up: submit once, outside the state updater (updaters may run twice in dev)
  useEffect(() => {
    if (left === 0 && (phase === 'running' || phase === 'review')) finish();
  }, [left, phase, finish]);

  // Save the attempt once for signed-in students
  useEffect(() => {
    const fb = firebase();
    if (!result || !user || !fb || saved) return;
    setSaved(true);
    const rating = rate(quiz, result);
    addDoc(collection(fb.db, 'users', user.uid, 'quizAttempts'), {
      quizId: quiz.id,
      quizTitle: quiz.title,
      percentage: result.percentage,
      totalScore: result.totalScore,
      maxScore: result.maxScore,
      correctAnswers: result.correct,
      wrongAnswers: result.wrong,
      timeTakenSeconds: Math.round((Date.now() - startedAt.current) / 1000),
      estimatedCEFR: result.estimatedCEFR,
      performanceRating: rating.stars,
      completedAt: serverTimestamp(),
    }).catch(() => {});
    if (quiz.isPlacementTest) updateDoc(doc(fb.db, 'users', user.uid), { currentFrenchLevel: result.estimatedCEFR }).catch(() => {});
  }, [result, user, saved, quiz, updateMyProfile]);

  const q = questions[i];
  const answered = questions.filter((x) => answersRef.current[x.id] != null && answersRef.current[x.id] !== '').length;
  const setAnswer = (v: unknown) => setAnswers((a) => ({ ...a, [q.id]: v }));
  const speak = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fr-FR';
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  };

  if (!questions.length) {
    return (
      <div className="mx-auto max-w-lg rounded-[28px] border border-dashed border-line bg-surface p-10 text-center">
        <p className="font-display text-2xl font-semibold">{t({ en: 'This test is coming soon', bn: 'এই টেস্টটি শীঘ্রই আসছে' })}</p>
        <Link href="/quiz" className={btn('ink', 'md', 'mt-6')}>
          {t({ en: 'See available tests', bn: 'চলমান টেস্টগুলো দেখুন' })}
        </Link>
      </div>
    );
  }

  /* ── Intro ── */
  if (phase === 'intro') {
    const resuming = Object.keys(answers).length > 0;
    return (
      <div className="mx-auto max-w-2xl rounded-[28px] border border-line bg-surface p-7 md:p-10">
        <span className="rounded-full bg-surface-2 px-3 py-1 text-[11px] font-bold tracking-wider">{t.locale === 'bn' && quiz.banglaBadgeTag ? quiz.banglaBadgeTag : quiz.badgeTag}</span>
        <h2 className="font-display mt-4 text-3xl font-semibold">{t.locale === 'bn' ? quiz.banglaTitle : quiz.title}</h2>
        <p className="mt-3 leading-relaxed text-muted">{t.locale === 'bn' ? quiz.banglaDescription : quiz.description}</p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-surface-2/60 p-4">
            <p className="text-[10px] font-bold tracking-widest text-muted uppercase">{t({ en: 'Questions', bn: 'প্রশ্ন' })}</p>
            <p className="font-display text-3xl font-semibold">{num(questions.length, t.locale)}</p>
          </div>
          <div className="rounded-2xl bg-surface-2/60 p-4">
            <p className="text-[10px] font-bold tracking-widest text-muted uppercase">{t({ en: 'Time', bn: 'সময়' })}</p>
            <p className="font-display text-3xl font-semibold">
              {num(quiz.durationMinutes, t.locale)} {t({ en: 'min', bn: 'মিনিট' })}
            </p>
          </div>
        </div>
        {!user && (
          <p className="mt-5 rounded-2xl bg-bleu/10 p-4 text-sm">
            {t({ en: 'Tip: ', bn: 'টিপস: ' })}
            <Link href={`/login?next=${encodeURIComponent(pathname)}`} className="font-bold text-bleu underline">
              {t({ en: 'log in', bn: 'লগইন করুন' })}
            </Link>{' '}
            {t({ en: 'to save your result to your dashboard.', bn: 'ফলাফল ড্যাশবোর্ডে সেভ করতে।' })}
          </p>
        )}
        <div className="mt-7 flex flex-wrap gap-3">
          <button
            onClick={() => {
              startedAt.current = Date.now();
              setPhase('running');
            }}
            className={btn('rouge', 'lg')}
          >
            {resuming ? t({ en: 'Resume test', bn: 'টেস্ট চালিয়ে যান' }) : t({ en: 'Start test', bn: 'টেস্ট শুরু করুন' })}
            <ArrowRight size={17} />
          </button>
          {resuming && (
            <button
              onClick={() => {
                setAnswers({});
                setFlags([]);
                setLeft(quiz.durationMinutes * 60);
                localStorage.removeItem(storeKey);
              }}
              className={btn('ghost', 'lg')}
            >
              <RotateCcw size={16} /> {t({ en: 'Start over', bn: 'নতুন করে শুরু' })}
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ── Result ── */
  if (phase === 'done' && result) {
    const r = rate(quiz, result);
    return (
      <div className="flex flex-col gap-6">
        <div className="overflow-hidden rounded-[28px] bg-ink text-white">
          <div className="grid gap-6 p-7 md:grid-cols-[auto_1fr] md:p-10">
            <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full border-4 border-gold">
              <span className="font-display text-5xl font-semibold">{num(result.percentage, t.locale)}%</span>
              <span className="text-xs text-white/60">
                {num(result.totalScore, t.locale)}/{num(result.maxScore, t.locale)}
              </span>
            </div>
            <div>
              <div className="flex gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} size={20} fill={k < r.stars ? 'currentColor' : 'none'} className={k < r.stars ? '' : 'text-white/25'} />
                ))}
              </div>
              <p className="font-display mt-2 text-3xl font-semibold">{t(r.label)}</p>
              {r.nclc && <p className="text-sm text-gold">{t(r.nclc)}</p>}
              <p className="mt-3 max-w-2xl text-white/75">{t.locale === 'bn' ? r.banglaFeedback : r.feedback}</p>
              <div className="mt-5 flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-mint/20 px-3 py-1 text-mint">✓ {num(result.correct, t.locale)}</span>
                <span className="rounded-full bg-rouge/20 px-3 py-1 text-[#ff8a98]">✗ {num(result.wrong, t.locale)}</span>
                <span className="rounded-full bg-white/10 px-3 py-1">CEFR ≈ {t(cefrLabel(result.estimatedCEFR))}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 border-t border-white/10 p-6">
            <Link href={{ pathname: '/enroll', query: { course: result.recommendedCourseId } }} className={btn('rouge', 'md')}>
              {t({ en: 'Join', bn: 'ভর্তি হোন:' })} {courseTitle(result.recommendedCourseId, t.locale).split(' - ')[0]} <ArrowRight size={16} />
            </Link>
            <a
              href={waLink(
                t.locale === 'bn'
                  ? `Bonjour! আমি "${quiz.banglaTitle}" টেস্টে ${result.percentage}% (${result.estimatedCEFR}) পেয়েছি। আমি একটি ফ্রি পরামর্শ নিতে চাই।`
                  : `Bonjour! I scored ${result.percentage}% (${result.estimatedCEFR}) on "${quiz.title}". I'd like a free consultation.`,
              )}
              target="_blank"
              rel="noopener"
              className={btn('ghost-light', 'md')}
            >
              <WhatsAppGlyph size={17} /> {t({ en: 'Free consultation', bn: 'ফ্রি পরামর্শ' })}
            </a>
            <Link href="/quiz" className={btn('ghost-light', 'md')}>
              {t({ en: 'More tests', bn: 'আরও টেস্ট' })}
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <section className="rounded-[24px] border border-line bg-surface p-6">
            <h3 className="font-display text-xl font-semibold">{t({ en: 'By skill', bn: 'দক্ষতা অনুযায়ী' })}</h3>
            <div className="mt-4 flex flex-col gap-4">
              {Object.entries(result.breakdown)
                .filter(([, b]) => b.max > 0)
                .map(([k, b]) => {
                  const pct = Math.round((b.score / b.max) * 100);
                  return (
                    <div key={k}>
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold">{t(categoryLabel(k))}</span>
                        <span className="text-muted">
                          {num(b.score, t.locale)}/{num(b.max, t.locale)}
                        </span>
                      </div>
                      <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-fg/10">
                        <div className={cn('h-full rounded-full', pct >= 70 ? 'bg-mint' : pct >= 40 ? 'bg-gold' : 'bg-rouge')} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
            </div>
            {!user && (
              <p className="mt-6 text-sm text-muted">
                <Link href="/login" className="font-semibold text-bleu underline">
                  {t({ en: 'Log in', bn: 'লগইন' })}
                </Link>{' '}
                {t({ en: 'next time to keep your results.', bn: 'করলে পরের বার ফলাফল সেভ থাকবে।' })}
              </p>
            )}
            {user && <p className="mt-6 text-sm text-mint">{t({ en: 'Saved to your dashboard.', bn: 'আপনার ড্যাশবোর্ডে সেভ হয়েছে।' })}</p>}
            <p className="mt-4 text-[11px] text-muted">
              {t({
                en: 'Practice estimate only — not an official DELF, TCF or TEF result.',
                bn: 'এটি শুধুমাত্র অনুশীলনের অনুমান — অফিশিয়াল DELF, TCF বা TEF ফলাফল নয়।',
              })}
            </p>
          </section>
          <section className="rounded-[24px] border border-line bg-surface p-6">
            <h3 className="font-display text-xl font-semibold">{t({ en: 'Answer review', bn: 'উত্তর পর্যালোচনা' })}</h3>
            <ol className="mt-4 flex max-h-[560px] flex-col gap-3 overflow-y-auto pr-1">
              {result.review.map((rv, k) => (
                <li key={rv.id} className="rounded-2xl bg-surface-2/50 p-4 text-sm">
                  <p className="flex gap-2 font-semibold">
                    {rv.ok ? <CheckCircle2 size={17} className="shrink-0 text-mint" /> : <XCircle size={17} className="shrink-0 text-rouge" />}
                    {num(k + 1, t.locale)}. {rv.prompt}
                  </p>
                  {t.locale === 'bn' && rv.banglaPrompt && <p className="font-bangla pl-6 text-xs text-muted">{rv.banglaPrompt}</p>}
                  <p className="mt-2 pl-6 text-muted">
                    {t({ en: 'Your answer', bn: 'আপনার উত্তর' })}: <span className={rv.ok ? 'text-mint' : 'text-rouge'}>{rv.given}</span>
                  </p>
                  {!rv.ok && (
                    <p className="pl-6 text-muted">
                      {t({ en: 'Correct', bn: 'সঠিক উত্তর' })}: <span className="font-semibold text-fg">{rv.correct}</span>
                    </p>
                  )}
                  {(rv.explanation || rv.banglaExplanation) && (
                    <p className="mt-1 pl-6 text-xs text-muted">{t.locale === 'bn' ? rv.banglaExplanation || rv.explanation : rv.explanation}</p>
                  )}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    );
  }

  /* ── Review before submit ── */
  if (phase === 'review') {
    const missing = questions.length - answered;
    return (
      <div className="mx-auto max-w-2xl rounded-[28px] border border-line bg-surface p-7">
        <h2 className="font-display text-2xl font-semibold">{t({ en: 'Ready to submit?', bn: 'জমা দিতে প্রস্তুত?' })}</h2>
        {missing > 0 && (
          <p className="mt-3 rounded-2xl bg-gold/15 p-4 text-sm">
            {t({ en: `${missing} question(s) unanswered.`, bn: `${num(missing, 'bn')}টি প্রশ্নের উত্তর দেওয়া হয়নি।` })}
          </p>
        )}
        <Navigator questions={questions} answers={answers} flags={flags} current={-1} onGo={(k) => (setI(k), setPhase('running'))} locale={t.locale} />
        <div className="mt-6 flex gap-3">
          <button onClick={() => setPhase('running')} className={btn('ghost', 'md')}>
            <ArrowLeft size={16} /> {t({ en: 'Back to questions', bn: 'প্রশ্নে ফিরে যান' })}
          </button>
          <button onClick={finish} className={btn('rouge', 'md')}>
            {t({ en: 'Submit test', bn: 'টেস্ট জমা দিন' })}
          </button>
        </div>
      </div>
    );
  }

  /* ── Running ── */
  const opts = options[q.id] ?? [];
  const given = answers[q.id];
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      {/* Phones/tablets: compact timer that stays visible while scrolling (the sidebar sits below there) */}
      <div
        className={cn(
          'sticky top-[84px] z-20 flex items-center justify-between rounded-2xl px-4 py-2.5 text-white shadow-lg lg:hidden',
          left < 60 ? 'bg-rouge' : 'bg-ink',
        )}
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          <Clock size={16} /> {num(answered, t.locale)}/{num(questions.length, t.locale)}
        </span>
        <span className="font-display text-xl font-semibold tabular-nums">{fmt(left)}</span>
      </div>
      <div className="rounded-[28px] border border-line bg-surface p-5 md:p-8">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="font-bold text-muted">
            {t({ en: 'Question', bn: 'প্রশ্ন' })} {num(i + 1, t.locale)} / {num(questions.length, t.locale)}
          </span>
          <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-semibold">{t(categoryLabel(q.category))}</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-fg/10">
          <div className="h-full bg-rouge transition-all" style={{ width: `${((i + 1) / questions.length) * 100}%` }} />
        </div>

        {q.passage && (
          <div className="mt-6 max-h-72 overflow-y-auto rounded-2xl bg-surface-2/60 p-5 text-[15px] leading-relaxed whitespace-pre-line">{q.passage}</div>
        )}
        {q.type === 'audio-listening' && q.audioText && (
          <button onClick={() => speak(q.audioText!)} className={btn('ink', 'sm', 'mt-6')}>
            <Volume2 size={16} /> {t({ en: 'Play audio', bn: 'অডিও শুনুন' })}
          </button>
        )}
        <h2 className="font-display mt-6 text-2xl leading-snug font-semibold">{q.prompt}</h2>
        {t.locale === 'bn' && q.banglaPrompt && <p className="font-bangla mt-1 text-muted">{q.banglaPrompt}</p>}
        {q.frenchContext && <p className="mt-2 text-muted italic">{q.frenchContext}</p>}

        <div className="mt-6">
          {q.type === 'fill-blank' ? (
            <input
              value={String(given ?? '')}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={t({ en: 'Type your answer…', bn: 'উত্তর লিখুন…' })}
              className="w-full rounded-2xl border border-line bg-surface px-4 py-3.5 outline-none focus:border-fg/50"
            />
          ) : q.type === 'matching' && q.matchPairs ? (
            <div className="flex flex-col gap-2">
              {q.matchPairs.map((p) => {
                const g = (given as Record<string, string>) ?? {};
                return (
                  <label key={p.id} className="flex items-center gap-3 rounded-2xl border border-line p-3">
                    <span className="flex-1 font-semibold">{p.french}</span>
                    <select
                      value={g[p.id] ?? ''}
                      onChange={(e) => setAnswer({ ...g, [p.id]: e.target.value })}
                      className="rounded-xl border border-line bg-surface px-3 py-2"
                    >
                      <option value="">—</option>
                      {q.matchPairs!.map((x) => (
                        <option key={x.id}>{x.englishOrBangla}</option>
                      ))}
                    </select>
                  </label>
                );
              })}
            </div>
          ) : (
            <div className="grid gap-2.5">
              {opts.map((o, k) => (
                <button
                  key={o}
                  onClick={() => setAnswer(o)}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl border p-4 text-left transition',
                    given === o ? 'border-fg bg-fg/[.05] ring-1 ring-fg' : 'border-line hover:border-fg/30',
                  )}
                >
                  <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold', given === o ? 'bg-ink text-white dark:bg-white dark:text-ink' : 'bg-fg/10')}>
                    {String.fromCharCode(65 + k)}
                  </span>
                  {o}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-2">
          <button
            onClick={() => setI((k) => Math.max(0, k - 1))}
            disabled={i === 0}
            className={btn('ghost', 'md', 'px-4 sm:px-6')}
            aria-label={t({ en: 'Previous', bn: 'আগের' })}
          >
            <ArrowLeft size={16} /> <span className="hidden sm:inline">{t({ en: 'Previous', bn: 'আগের' })}</span>
          </button>
          <button
            onClick={() => setFlags((f) => (f.includes(q.id) ? f.filter((x) => x !== q.id) : [...f, q.id]))}
            aria-pressed={flags.includes(q.id)}
            className={cn('flex h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold', flags.includes(q.id) ? 'text-gold' : 'text-muted')}
          >
            <Flag size={15} fill={flags.includes(q.id) ? 'currentColor' : 'none'} /> {t({ en: 'Flag', bn: 'চিহ্নিত' })}
          </button>
          {i < questions.length - 1 ? (
            <button onClick={() => setI((k) => k + 1)} className={btn('ink', 'md')}>
              {t({ en: 'Next', bn: 'পরের' })} <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={() => setPhase('review')} className={btn('rouge', 'md')}>
              {t({ en: 'Review & submit', bn: 'পর্যালোচনা ও জমা' })}
            </button>
          )}
        </div>
      </div>

      <aside className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
        <div className={cn('hidden items-center justify-between rounded-[22px] p-5 text-white lg:flex', left < 60 ? 'bg-rouge' : 'bg-ink')}>
          <span className="flex items-center gap-2 text-sm font-semibold">
            <Clock size={17} /> {t({ en: 'Time left', bn: 'বাকি সময়' })}
          </span>
          <span className="font-display text-3xl font-semibold tabular-nums">{fmt(left)}</span>
        </div>
        <div className="rounded-[22px] border border-line bg-surface p-5">
          <p className="text-sm font-bold">
            {num(answered, t.locale)} / {num(questions.length, t.locale)} {t({ en: 'answered', bn: 'উত্তর দেওয়া হয়েছে' })}
          </p>
          <Navigator questions={questions} answers={answers} flags={flags} current={i} onGo={setI} locale={t.locale} />
          <button onClick={() => setPhase('review')} className={btn('rouge', 'sm', 'mt-4 w-full')}>
            {t({ en: 'Finish test', bn: 'টেস্ট শেষ করুন' })}
          </button>
        </div>
        {profile && <p className="text-center text-xs text-muted">{profile.displayName}</p>}
      </aside>
    </div>
  );
}

function Navigator({
  questions,
  answers,
  flags,
  current,
  onGo,
  locale,
}: {
  questions: Question[];
  answers: Record<string, unknown>;
  flags: string[];
  current: number;
  onGo: (i: number) => void;
  locale: 'en' | 'bn';
}) {
  return (
    <div className="mt-4 grid grid-cols-8 gap-1.5">
      {questions.map((q, k) => {
        const done = answers[q.id] != null && answers[q.id] !== '';
        return (
          <button
            key={q.id}
            onClick={() => onGo(k)}
            aria-label={locale === 'bn' ? `প্রশ্ন ${num(k + 1, 'bn')}` : `Question ${k + 1}`}
            className={cn(
              'relative h-8 rounded-lg text-xs font-bold transition',
              k === current ? 'bg-rouge text-white' : done ? 'bg-ink text-white dark:bg-white/80 dark:text-ink' : 'bg-fg/8 text-muted hover:bg-fg/15',
            )}
          >
            {k + 1}
            {flags.includes(q.id) && <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-gold" />}
          </button>
        );
      })}
    </div>
  );
}
