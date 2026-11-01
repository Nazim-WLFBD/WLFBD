'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { addDoc, collection, doc, getDocs, serverTimestamp, updateDoc } from 'firebase/firestore';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Flag, Hourglass, ListChecks, RotateCcw, Star, Volume2, XCircle } from 'lucide-react';
import { Link, usePathname } from '@/i18n/navigation';
import { useT } from '@/i18n/t';
import { btn } from '@/components/ui/Button';
import { useAuth } from '@/components/auth/AuthContext';
import { useCourses } from '@/components/CoursesProvider';
import { WhatsAppGlyph } from '@/components/layout/FloatingActions';
import { firebase } from '@/lib/firebase';
import { builtInQuestions, categoryLabel, cefrLabel, courseTitle, rate, scoreQuiz, wordCount, type ScoredQuiz } from '@/lib/quizScoring';
import { waLink } from '@/lib/brand';
import { cn, num } from '@/lib/utils';
import { needsReview, type Question, type QuizCategory } from '@/types/quiz';

type Phase = 'intro' | 'running' | 'review' | 'done';

/** How many times a listening clip may be played in full. */
const AUDIO_PLAY_LIMIT = 2;

function shuffle<T>(a: T[]) {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** Built-in questions followed by admin-added ones (an admin copy with the same id replaces the built-in one). */
const withExtra = (quizId: string, extra: Question[]) => {
  const built = builtInQuestions(quizId);
  return extra.length ? [...built.filter((q) => !extra.some((e) => e.id === q.id)), ...extra] : built;
};

export function QuizRunner({
  quiz,
  extraQuestions,
}: {
  quiz: QuizCategory;
  /** Admin-added questions loaded on the server; when omitted they are fetched from Firestore here. */
  extraQuestions?: Question[];
}) {
  const t = useT();
  const { courses } = useCourses();
  const locale = t.locale;
  const { user, profile, updateMyProfile } = useAuth();
  const pathname = usePathname();
  const storeKey = `wlf_quiz_${quiz.id}`;

  const [questions, setQuestions] = useState<Question[]>(() => withExtra(quiz.id, extraQuestions ?? []));
  const [phase, setPhase] = useState<Phase>('intro');
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [flags, setFlags] = useState<string[]>([]);
  const [plays, setPlays] = useState<Record<string, number>>({}); // completed plays per listening question
  const [left, setLeft] = useState(quiz.durationMinutes * 60);
  const [result, setResult] = useState<ScoredQuiz | null>(null);
  const [saved, setSaved] = useState(false);
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const startedAt = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const [jump, setJump] = useState(0); // bumped on Next / Previous / navigator jumps to scroll the card into view

  // Questions added by admins are normally passed in from the server; this fallback fetch is only for callers
  // that render the runner without them
  useEffect(() => {
    if (extraQuestions) return;
    const fb = firebase();
    if (!fb) return;
    getDocs(collection(fb.db, 'quizzes', quiz.id, 'questions'))
      .then((s) => {
        const extra = s.docs.map((d) => {
          const { modelAnswer: _m, ...rest } = d.data() as Question & { modelAnswer?: string }; // eslint-disable-line @typescript-eslint/no-unused-vars
          return { ...rest, id: d.id, quizId: quiz.id } as Question;
        });
        if (extra.length) setQuestions(withExtra(quiz.id, extra));
      })
      .catch(() => {});
  }, [quiz.id, extraQuestions]);

  const options = useMemo(
    () => Object.fromEntries(questions.map((q) => [q.id, q.options ? shuffle(q.options) : []])),
    [questions],
  );

  // Resume saved progress (startedAt too, so the time taken survives a reload)
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(storeKey) ?? 'null');
      if (s?.answers) {
        setAnswers(s.answers);
        setFlags(s.flags ?? []);
        setPlays(s.plays ?? {});
        if (typeof s.left === 'number' && s.left > 0) setLeft(s.left);
        if (typeof s.startedAt === 'number' && s.startedAt > 0) startedAt.current = s.startedAt;
      }
    } catch {}
  }, [storeKey]);

  useEffect(() => {
    if (phase !== 'running' && phase !== 'review') return;
    try {
      localStorage.setItem(storeKey, JSON.stringify({ answers, flags, plays, left, startedAt: startedAt.current }));
    } catch {}
  }, [answers, flags, plays, left, phase, storeKey]);

  // While a test is in progress the phone bottom bar and the floating support / back-to-top cluster step aside
  // (globals.css hides them under body.quiz-active), so they never cover answers or the Next button
  useEffect(() => {
    if (phase !== 'running' && phase !== 'review') return;
    document.body.classList.add('quiz-active');
    return () => document.body.classList.remove('quiz-active');
  }, [phase]);

  // After moving between questions, bring the top of the question card back into view (instant: Lenis ignores
  // native smooth scrolling). scroll-mt on the card clears the fixed header and the sticky phone timer.
  useEffect(() => {
    if (jump) cardRef.current?.scrollIntoView({ block: 'start' });
  }, [jump]);

  // Stop any text-to-speech when the question changes or the runner unmounts
  useEffect(() => {
    return () => {
      if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
    };
  }, [i, phase]);

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
    const pending = result.pendingReview.length > 0;
    addDoc(collection(fb.db, 'users', user.uid, 'quizAttempts'), {
      userId: user.uid,
      userEmail: user.email ?? profile?.email ?? '',
      userName: profile?.displayName || user.displayName || '',
      locale,
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
      // Writing answers are marked by an instructor (/api/admin gradeWriting) and then added to the score
      answers: Object.fromEntries(result.pendingReview.map((p) => [p.id, p.answer])),
      pendingReview: result.pendingReview,
      autoScore: result.totalScore,
      autoMax: result.maxScore,
      reviewStatus: pending ? 'pending' : 'none',
      ...(pending ? { status: 'pending-review' } : {}),
      completedAt: serverTimestamp(),
    }).catch(() => {});
    if (quiz.isPlacementTest) updateDoc(doc(fb.db, 'users', user.uid), { currentFrenchLevel: result.estimatedCEFR }).catch(() => {});
  }, [result, user, profile, locale, saved, quiz, updateMyProfile]);

  const q = questions[i];
  const answered = questions.filter((x) => answersRef.current[x.id] != null && answersRef.current[x.id] !== '').length;
  const setAnswer = (v: unknown) => setAnswers((a) => ({ ...a, [q.id]: v }));
  /** Go to question k (from any phase) and scroll its card into view. */
  const goTo = (k: number) => {
    setI(Math.max(0, Math.min(questions.length - 1, k)));
    setPhase('running');
    setJump((n) => n + 1);
  };
  const speak = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fr-FR';
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  };

  if (!questions.length) {
    return (
      <div className="card mx-auto max-w-lg p-10 text-center">
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
      <div className="card accent-top mx-auto max-w-2xl p-7 md:p-10">
        <span className="eyebrow text-rouge">{t.locale === 'bn' && quiz.banglaBadgeTag ? quiz.banglaBadgeTag : quiz.badgeTag}</span>
        <h2 className="font-display mt-4 text-3xl font-semibold">{t.locale === 'bn' ? quiz.banglaTitle : quiz.title}</h2>
        <p className="mt-3 leading-relaxed text-muted">{t.locale === 'bn' ? quiz.banglaDescription : quiz.description}</p>
        <dl className="mt-6 grid grid-cols-2 border-y border-line py-5">
          <div className="pr-4">
            <dt className="text-[11px] font-bold tracking-[0.14em] text-muted uppercase">{t({ en: 'Questions', bn: 'প্রশ্ন' })}</dt>
            <dd className="font-display mt-1 text-3xl font-semibold">{num(questions.length, t.locale)}</dd>
          </div>
          <div className="border-l border-line pl-4">
            <dt className="text-[11px] font-bold tracking-[0.14em] text-muted uppercase">{t({ en: 'Time', bn: 'সময়' })}</dt>
            <dd className="font-display mt-1 text-3xl font-semibold">
              {num(quiz.durationMinutes, t.locale)} <span className="text-lg text-muted">{t({ en: 'min', bn: 'মিনিট' })}</span>
            </dd>
          </div>
        </dl>
        {!user && (
          <p className="mt-5 rounded-xl bg-blue-soft p-4 text-sm leading-relaxed">
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
              if (!resuming || !startedAt.current) startedAt.current = Date.now();
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
                setPlays({});
                setLeft(quiz.durationMinutes * 60);
                startedAt.current = 0;
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
        {/* Report card */}
        <div className="card accent-top overflow-hidden">
          <div className="grid gap-8 p-7 md:grid-cols-[auto_1fr] md:gap-12 md:p-10">
            <div className="md:border-r md:border-line md:pr-12">
              <p className="eyebrow text-rouge">{t({ en: 'Score', bn: 'স্কোর' })}</p>
              <p className="font-display mt-3 text-[clamp(3.5rem,8vw,5.5rem)] leading-none font-semibold text-fg tabular-nums">
                {num(result.percentage, t.locale)}<span className="text-3xl text-muted">%</span>
              </p>
              <p className="mt-2 text-sm text-muted">
                {num(result.totalScore, t.locale)} / {num(result.maxScore, t.locale)}
              </p>
              {result.pendingMax > 0 && (
                <p className="mt-1 text-xs text-muted">
                  + {num(result.pendingMax, t.locale)} {t({ en: 'pts awaiting review', bn: 'পয়েন্ট রিভিউর অপেক্ষায়' })}
                </p>
              )}
            </div>
            <div>
              <div className="flex gap-1 text-rouge">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} size={18} fill={k < r.stars ? 'currentColor' : 'none'} className={k < r.stars ? '' : 'text-line'} />
                ))}
              </div>
              <p className="font-display mt-3 text-3xl font-semibold">{t(r.label)}</p>
              {r.nclc && <p className="mt-1 text-sm font-semibold text-rouge">{t(r.nclc)}</p>}
              <p className="mt-3 max-w-2xl leading-relaxed text-muted">{t.locale === 'bn' ? r.banglaFeedback : r.feedback}</p>
              <dl className="hairline mt-6 grid grid-cols-3 pt-4 text-sm">
                <div>
                  <dt className="text-[11px] font-bold tracking-[0.14em] text-muted uppercase">{t({ en: 'Correct', bn: 'সঠিক' })}</dt>
                  <dd className="font-display mt-1 text-xl font-semibold text-mint">{num(result.correct, t.locale)}</dd>
                </div>
                <div className="border-l border-line pl-4">
                  <dt className="text-[11px] font-bold tracking-[0.14em] text-muted uppercase">{t({ en: 'Wrong', bn: 'ভুল' })}</dt>
                  <dd className="font-display mt-1 text-xl font-semibold text-rouge">{num(result.wrong, t.locale)}</dd>
                </div>
                <div className="border-l border-line pl-4">
                  <dt className="text-[11px] font-bold tracking-[0.14em] text-muted uppercase">CEFR</dt>
                  <dd className="font-display mt-1 text-xl font-semibold">≈ {t(cefrLabel(result.estimatedCEFR))}</dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 border-t border-line bg-surface-2/60 p-6">
            <Link href={{ pathname: '/enroll', query: { course: result.recommendedCourseId } }} className={btn('rouge', 'md')}>
              {t({ en: 'Join', bn: 'ভর্তি হোন:' })} {courseTitle(result.recommendedCourseId, t.locale, courses).split(' - ')[0]} <ArrowRight size={16} />
            </Link>
            <a
              href={waLink(
                t.locale === 'bn'
                  ? `Bonjour! আমি "${quiz.banglaTitle}" টেস্টে ${result.percentage}% (${result.estimatedCEFR}) পেয়েছি। আমি একটি ফ্রি পরামর্শ নিতে চাই।`
                  : `Bonjour! I scored ${result.percentage}% (${result.estimatedCEFR}) on "${quiz.title}". I'd like a free consultation.`,
              )}
              target="_blank"
              rel="noopener"
              className={btn('ghost', 'md')}
            >
              <WhatsAppGlyph size={17} /> {t({ en: 'Free consultation', bn: 'ফ্রি পরামর্শ' })}
            </a>
            <Link href="/quiz" className={btn('ghost', 'md')}>
              {t({ en: 'More tests', bn: 'আরও টেস্ট' })}
            </Link>
          </div>
        </div>

        {result.pendingReview.length > 0 && (
          <section className="card border-gold/40 bg-gold/10 p-6">
            <p className="flex items-start gap-3 font-semibold">
              <Hourglass size={18} className="mt-0.5 shrink-0 text-[#9a6b00] dark:text-gold" />
              <span>
                {t({
                  en: 'Your writing answer is awaiting review by the instructor; your score will update once it has been marked.',
                  bn: 'আপনার রাইটিং উত্তরটি ইন্সট্রাক্টরের রিভিউর অপেক্ষায় আছে; মার্কিং হয়ে গেলে আপনার স্কোর আপডেট হবে।',
                })}
                {user && <> {t({ en: 'You will get an email when it is marked.', bn: 'মার্কিং হলে আপনাকে ইমেইল পাঠানো হবে।' })}</>}
              </span>
            </p>
            <ol className="mt-4 flex flex-col gap-4">
              {result.pendingReview.map((p, k) => (
                <li key={p.id} className="rounded-xl bg-surface p-4 text-sm">
                  <p className="font-semibold">
                    {num(k + 1, t.locale)}. {p.prompt}
                  </p>
                  <p className="mt-2 leading-relaxed whitespace-pre-line text-muted">{p.answer}</p>
                  <p className="mt-2 text-xs text-muted">
                    {num(wordCount(p.answer), t.locale)} {t({ en: 'words', bn: 'শব্দ' })} · {num(p.points, t.locale)} {t({ en: 'pts', bn: 'পয়েন্ট' })}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <section className="card p-6">
            <h3 className="font-display text-xl font-semibold">{t({ en: 'By skill', bn: 'দক্ষতা অনুযায়ী' })}</h3>
            <div className="mt-5 flex flex-col gap-4">
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
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-sm bg-surface-2">
                        <div className={cn('h-full', pct >= 70 ? 'bg-mint' : pct >= 40 ? 'bg-gold' : 'bg-rouge')} style={{ width: `${pct}%` }} />
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
          <section className="card p-6">
            <h3 className="font-display text-xl font-semibold">{t({ en: 'Answer review', bn: 'উত্তর পর্যালোচনা' })}</h3>
            <ol data-lenis-prevent className="mt-4 flex max-h-[560px] flex-col overflow-y-auto pr-1">
              {result.review.map((rv, k) => (
                <li key={rv.id} className="hairline py-4 text-sm first:border-t-0">
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
      <div className="card accent-top mx-auto max-w-2xl p-7">
        <h2 className="font-display text-2xl font-semibold">{t({ en: 'Ready to submit?', bn: 'জমা দিতে প্রস্তুত?' })}</h2>
        {missing > 0 && (
          <p className="mt-3 rounded-xl bg-red-soft p-4 text-sm font-medium text-rouge">
            {t({ en: `${missing} question(s) unanswered.`, bn: `${num(missing, 'bn')}টি প্রশ্নের উত্তর দেওয়া হয়নি।` })}
          </p>
        )}
        <Navigator questions={questions} answers={answers} flags={flags} current={-1} onGo={goTo} locale={t.locale} />
        <div className="hairline mt-6 flex flex-wrap gap-3 pt-6">
          <button onClick={() => goTo(i)} className={btn('ghost', 'md')}>
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
          'sticky top-[calc(84px+env(safe-area-inset-top))] z-20 flex items-center justify-between rounded-xl px-4 py-2.5 text-white shadow-[var(--shadow-card)] lg:hidden',
          left < 60 ? 'bg-rouge' : 'bg-ink',
        )}
      >
        <span className="flex items-center gap-2 text-sm font-semibold" aria-label={t({ en: 'Answered', bn: 'উত্তর দেওয়া হয়েছে' })}>
          <ListChecks size={16} /> {num(answered, t.locale)}/{num(questions.length, t.locale)}
        </span>
        <span className="flex items-center gap-2 font-display text-xl font-semibold tabular-nums" aria-label={t({ en: 'Time left', bn: 'বাকি সময়' })}>
          <Clock size={16} /> {fmt(left)}
        </span>
      </div>
      <div ref={cardRef} className="card scroll-mt-36 p-5 md:p-8">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-bold tracking-[0.14em] text-muted uppercase">
            {t({ en: 'Question', bn: 'প্রশ্ন' })} <span className="font-display text-base tracking-normal text-fg tabular-nums">{num(i + 1, t.locale)}</span> / {num(questions.length, t.locale)}
          </span>
          <span className="text-[11px] font-bold tracking-[0.14em] text-muted uppercase">{t(categoryLabel(q.category))}</span>
        </div>
        <div className="mt-3 h-[3px] overflow-hidden bg-surface-2">
          <div className="h-full bg-rouge transition-all" style={{ width: `${((i + 1) / questions.length) * 100}%` }} />
        </div>

        {q.passage && (
          <div data-lenis-prevent className="mt-6 max-h-72 overflow-y-auto rounded-xl bg-surface-2 p-5 text-[15px] leading-relaxed whitespace-pre-line">{q.passage}</div>
        )}
        {q.audioUrl ? (
          <AudioPlayer
            key={q.id}
            src={q.audioUrl}
            plays={plays[q.id] ?? 0}
            onEnded={() => setPlays((p) => ({ ...p, [q.id]: (p[q.id] ?? 0) + 1 }))}
            locale={t.locale}
          />
        ) : (
          q.type === 'audio-listening' &&
          q.audioText && (
            <button onClick={() => speak(q.audioText!)} className={btn('ink', 'sm', 'mt-6')}>
              <Volume2 size={16} /> {t({ en: 'Play audio', bn: 'অডিও শুনুন' })}
            </button>
          )
        )}
        <h2 className="font-display mt-6 text-2xl leading-snug font-semibold">{q.prompt}</h2>
        {t.locale === 'bn' && q.banglaPrompt && <p className="font-bangla mt-1 text-muted">{q.banglaPrompt}</p>}
        {q.frenchContext && <p className="font-display mt-2 text-lg text-muted italic">{q.frenchContext}</p>}

        <div className="mt-6">
          {needsReview(q) ? (
            <WritingAnswer q={q} value={String(given ?? '')} onChange={setAnswer} locale={t.locale} />
          ) : q.type === 'fill-blank' ? (
            <input
              value={String(given ?? '')}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={t({ en: 'Type your answer…', bn: 'উত্তর লিখুন…' })}
              className="w-full rounded-xl border border-line bg-surface px-4 py-3 outline-none transition focus:border-bleu focus:ring-2 focus:ring-bleu/20"
            />
          ) : q.type === 'matching' && q.matchPairs ? (
            <div className="flex flex-col gap-2">
              {q.matchPairs.map((p) => {
                const g = (given as Record<string, string>) ?? {};
                return (
                  <label key={p.id} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3">
                    <span className="flex-1 font-semibold">{p.french}</span>
                    <select
                      value={g[p.id] ?? ''}
                      onChange={(e) => setAnswer({ ...g, [p.id]: e.target.value })}
                      className="min-h-10 rounded-xl border border-line bg-surface px-3 py-2 outline-none focus:border-bleu focus:ring-2 focus:ring-bleu/20"
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
                  aria-pressed={given === o}
                  className={cn(
                    'flex min-h-12 items-center gap-3 rounded-xl border bg-surface p-4 text-left transition',
                    given === o ? 'border-ink ring-1 ring-ink dark:border-white dark:ring-white' : 'border-line hover:border-fg/30',
                  )}
                >
                  {/* Radio-style marker */}
                  <span
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition',
                      given === o ? 'border-rouge' : 'border-line',
                    )}
                  >
                    {given === o && <span className="h-2.5 w-2.5 rounded-full bg-rouge" />}
                  </span>
                  <span className="section-num w-4 shrink-0 text-xs">{String.fromCharCode(65 + k)}</span>
                  <span className="flex-1">{o}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hairline mt-8 flex items-center justify-between gap-2 pt-6">
          <button
            onClick={() => goTo(i - 1)}
            disabled={i === 0}
            className={btn('ghost', 'md', 'px-4 sm:px-6')}
            aria-label={t({ en: 'Previous', bn: 'আগের' })}
          >
            <ArrowLeft size={16} /> <span className="hidden sm:inline">{t({ en: 'Previous', bn: 'আগের' })}</span>
          </button>
          <button
            onClick={() => setFlags((f) => (f.includes(q.id) ? f.filter((x) => x !== q.id) : [...f, q.id]))}
            aria-pressed={flags.includes(q.id)}
            className={cn('flex h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold', flags.includes(q.id) ? 'text-rouge' : 'text-muted')}
          >
            <Flag size={15} fill={flags.includes(q.id) ? 'currentColor' : 'none'} /> {t({ en: 'Flag', bn: 'চিহ্নিত' })}
          </button>
          {i < questions.length - 1 ? (
            <button onClick={() => goTo(i + 1)} className={btn('ink', 'md')}>
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
        <div className={cn('hidden items-center justify-between rounded-[var(--radius)] p-5 text-white lg:flex', left < 60 ? 'bg-rouge' : 'bg-ink')}>
          <span className="flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase">
            <Clock size={15} /> {t({ en: 'Time left', bn: 'বাকি সময়' })}
          </span>
          <span className="font-display text-3xl font-semibold tabular-nums">{fmt(left)}</span>
        </div>
        <div className="card p-5">
          <p className="text-[11px] font-bold tracking-[0.14em] text-muted uppercase">
            <span className="font-display text-base tracking-normal text-fg tabular-nums">{num(answered, t.locale)}</span> / {num(questions.length, t.locale)} {t({ en: 'answered', bn: 'উত্তর দেওয়া হয়েছে' })}
          </p>
          <Navigator questions={questions} answers={answers} flags={flags} current={i} onGo={goTo} locale={t.locale} />
          <button onClick={() => setPhase('review')} className={btn('rouge', 'sm', 'mt-4 w-full')}>
            {t({ en: 'Finish test', bn: 'টেস্ট শেষ করুন' })}
          </button>
        </div>
        {profile && <p className="text-center text-xs text-muted">{profile.displayName}</p>}
      </aside>
    </div>
  );
}

/** Listening clip with a limit on full plays (counted on `ended`, so pausing/seeking doesn't use one up). */
function AudioPlayer({ src, plays, onEnded, locale }: { src: string; plays: number; onEnded: () => void; locale: 'en' | 'bn' }) {
  const ref = useRef<HTMLAudioElement>(null);
  const done = plays >= AUDIO_PLAY_LIMIT;
  useEffect(() => {
    if (done) ref.current?.pause();
  }, [done]);
  const remaining = Math.max(0, AUDIO_PLAY_LIMIT - plays);
  return (
    <div className="mt-6 rounded-xl border border-line bg-surface-2 p-4">
      <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] text-muted uppercase">
        <Volume2 size={14} /> {locale === 'bn' ? 'লিসেনিং' : 'Listening'}
      </p>
      <audio
        ref={ref}
        src={src}
        controls
        preload="metadata"
        controlsList="nodownload"
        aria-disabled={done}
        className={cn('mt-3 w-full', done && 'pointer-events-none opacity-50')}
        onPlay={(e) => {
          if (done) e.currentTarget.pause();
        }}
        onEnded={onEnded}
      />
      <p className={cn('mt-2 text-xs', done ? 'font-semibold text-rouge' : 'text-muted')}>
        {done
          ? locale === 'bn'
            ? 'প্লে সীমা শেষ — অডিওটি আর শোনা যাবে না।'
            : 'Play limit reached — the audio can no longer be played.'
          : locale === 'bn'
            ? `আপনি অডিওটি সর্বোচ্চ ${num(AUDIO_PLAY_LIMIT, 'bn')} বার শুনতে পারবেন (${num(remaining, 'bn')} বার বাকি)।`
            : `You may play the audio up to ${AUDIO_PLAY_LIMIT} times (${remaining} left).`}
      </p>
    </div>
  );
}

/** Free-text answer for writing tasks: marked by an instructor, so only a word count is shown here. */
function WritingAnswer({ q, value, onChange, locale }: { q: Question; value: string; onChange: (v: string) => void; locale: 'en' | 'bn' }) {
  const words = wordCount(value);
  const min = Number(q.minWords) > 0 ? Number(q.minWords) : undefined;
  const max = Number(q.maxWords) > 0 ? Number(q.maxWords) : undefined;
  const tooShort = min != null && words > 0 && words < min;
  const tooLong = max != null && words > max;
  const range =
    min != null && max != null
      ? locale === 'bn'
        ? `${num(min, 'bn')}–${num(max, 'bn')} শব্দ`
        : `${min}–${max} words`
      : min != null
        ? locale === 'bn'
          ? `কমপক্ষে ${num(min, 'bn')} শব্দ`
          : `At least ${min} words`
        : max != null
          ? locale === 'bn'
            ? `সর্বোচ্চ ${num(max, 'bn')} শব্দ`
            : `Up to ${max} words`
          : null;
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        lang="fr"
        spellCheck={false}
        placeholder={locale === 'bn' ? 'এখানে ফরাসিতে আপনার উত্তর লিখুন…' : 'Write your answer in French here…'}
        className="w-full rounded-xl border border-line bg-surface px-4 py-3 leading-relaxed outline-none transition focus:border-bleu focus:ring-2 focus:ring-bleu/20"
      />
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-muted">{range}</span>
        <span className={cn('font-semibold tabular-nums', tooShort || tooLong ? 'text-rouge' : 'text-muted')}>
          {num(words, locale)} {locale === 'bn' ? 'শব্দ' : 'words'}
          {tooShort && (locale === 'bn' ? ' · আরও লিখুন' : ' · too short')}
          {tooLong && (locale === 'bn' ? ' · সীমার বেশি' : ' · over the limit')}
        </span>
      </div>
      <p className="mt-2 text-xs text-muted">
        {locale === 'bn'
          ? 'এই উত্তরটি একজন ইন্সট্রাক্টর পড়ে মার্কিং করবেন; এটি স্বয়ংক্রিয়ভাবে মূল্যায়ন করা হয় না।'
          : 'This answer is read and marked by an instructor; it is not scored automatically.'}
      </p>
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
    // Phones/tablets: as many ≥44px cells per row as fit; the narrow desktop sidebar keeps its 8-column grid
    <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(44px,1fr))] gap-1.5 lg:grid-cols-8">
      {questions.map((q, k) => {
        const done = answers[q.id] != null && answers[q.id] !== '';
        return (
          <button
            key={q.id}
            onClick={() => onGo(k)}
            aria-label={locale === 'bn' ? `প্রশ্ন ${num(k + 1, 'bn')}` : `Question ${k + 1}`}
            className={cn(
              'relative h-11 rounded-md border text-xs font-bold transition tabular-nums lg:h-10',
              k === current
                ? 'border-rouge bg-rouge text-white'
                : done
                  ? 'border-ink bg-ink text-white dark:border-white/80 dark:bg-white/80 dark:text-ink'
                  : 'border-line bg-surface text-muted hover:border-fg/40',
            )}
          >
            {k + 1}
            {flags.includes(q.id) && <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-surface bg-rouge" />}
          </button>
        );
      })}
    </div>
  );
}
