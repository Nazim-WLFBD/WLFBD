import { QUESTION_BANK, QUIZ_CATEGORIES } from '@/data/quizData';
import { needsReview, type CEFRLevel, type PendingReview, type Question, type QuizCategory } from '@/types/quiz';
import { COURSES_DATA } from '@/data/courses';
import type { Course } from '@/types';
import type { L } from '@/i18n/t';

/** Quizzes that share another quiz's question set. */
const SHARED: Record<string, string> = { 'placement-test': 'french-level-test' };

export function findQuiz(slugParts: string[]) {
  const slug = slugParts.join('/');
  return QUIZ_CATEGORIES.find((q) => q.slug === slug || q.slug === `quiz/${slug}`);
}

/** Built-in questions for a quiz (empty → the quiz is shown as "coming soon"). */
export function builtInQuestions(quizId: string): Question[] {
  const id = SHARED[quizId] ?? quizId;
  return QUESTION_BANK.filter((q) => q.quizId === id);
}

/** Word count for writing answers (whitespace-separated tokens). */
export const wordCount = (s: unknown) => String(s ?? '').trim().split(/\s+/).filter(Boolean).length;

export function isCorrect(q: Question, given: unknown): boolean {
  if (given == null || given === '') return false;
  if (needsReview(q)) return false; // writing answers are marked by an instructor, never auto-scored
  if (q.type === 'matching' && q.matchPairs) {
    const g = given as Record<string, string>;
    return q.matchPairs.every((p) => g[p.id] === p.englishOrBangla);
  }
  const norm = (s: unknown) => String(s).trim().toLowerCase().replace(/\s+/g, ' ');
  if (Array.isArray(q.correctAnswer)) {
    const g = Array.isArray(given) ? given : [given];
    return g.length === q.correctAnswer.length && q.correctAnswer.every((c) => g.map(norm).includes(norm(c)));
  }
  return norm(given) === norm(q.correctAnswer ?? '');
}

const CATS = ['Grammar', 'Vocabulary', 'Reading', 'Listening', 'Writing', 'Speaking'] as const;
export type Breakdown = Record<(typeof CATS)[number], { score: number; max: number }>;

/** Display names for skill categories (the keys stay English for storage and scoring). */
export const CATEGORY_LABELS: Record<string, L> = {
  Grammar: { en: 'Grammar', bn: 'ব্যাকরণ' },
  Vocabulary: { en: 'Vocabulary', bn: 'শব্দভাণ্ডার' },
  Reading: { en: 'Reading', bn: 'রিডিং' },
  Listening: { en: 'Listening', bn: 'লিসেনিং' },
  Writing: { en: 'Writing', bn: 'রাইটিং' },
  Speaking: { en: 'Speaking', bn: 'স্পিকিং' },
  Placement: { en: 'Placement', bn: 'লেভেল নির্ণয়' },
};
export const categoryLabel = (c: string): L => CATEGORY_LABELS[c] ?? { en: c, bn: c };

/** Display names for CEFR levels (the stored value stays as-is; plain codes like "A1" need no translation). */
export const CEFR_LABELS: Partial<Record<CEFRLevel, L>> = {
  'Beginner (A0)': { en: 'Beginner (A0)', bn: 'শিক্ষানবিস (A0)' },
};
export const cefrLabel = (lvl: string): L => CEFR_LABELS[lvl as CEFRLevel] ?? { en: lvl, bn: lvl };

export interface ScoredQuiz {
  totalScore: number;
  maxScore: number;
  percentage: number;
  correct: number;
  wrong: number;
  breakdown: Breakdown;
  estimatedCEFR: CEFRLevel;
  recommendedCourseId: string;
  strengths: string[];
  weaknesses: string[];
  /** Writing answers awaiting an instructor's mark; their points are not in totalScore/maxScore yet. */
  pendingReview: PendingReview[];
  /** Points reserved for the pending writing answers (added to the max once marked). */
  pendingMax: number;
  review: {
    id: string;
    prompt: string;
    banglaPrompt?: string;
    given: string;
    correct: string;
    ok: boolean;
    explanation?: string;
    banglaExplanation?: string;
  }[];
}

const show = (v: unknown) =>
  v == null || v === '' ? '—' : typeof v === 'object' ? Object.values(v as object).join(', ') : String(v);

export function scoreQuiz(quiz: QuizCategory, questions: Question[], answers: Record<string, unknown>): ScoredQuiz {
  const breakdown = Object.fromEntries(CATS.map((c) => [c, { score: 0, max: 0 }])) as Breakdown;
  let total = 0;
  let max = 0;
  let correct = 0;
  const review: ScoredQuiz['review'] = [];
  const pendingReview: PendingReview[] = [];
  let pendingMax = 0;
  let autoCount = 0;
  for (const q of questions) {
    const pts = Number(q.points) > 0 ? Number(q.points) : 1; // admin-entered questions may lack points
    const cat = (CATS as readonly string[]).includes(q.category) ? (q.category as keyof Breakdown) : 'Grammar';
    if (needsReview(q)) {
      // Writing tasks: kept out of the auto score and max until an instructor marks them
      const answer = String(answers[q.id] ?? '').trim();
      if (answer) {
        pendingReview.push({
          id: q.id,
          prompt: q.prompt,
          answer,
          points: pts,
          ...(q.minWords != null ? { minWords: Number(q.minWords) } : {}),
          ...(q.maxWords != null ? { maxWords: Number(q.maxWords) } : {}),
          ...(q.modelAnswer ? { modelAnswer: q.modelAnswer } : {}),
        });
        pendingMax += pts;
      }
      continue;
    }
    autoCount++;
    const ok = isCorrect(q, answers[q.id]);
    breakdown[cat].max += pts;
    max += pts;
    if (ok) {
      total += pts;
      breakdown[cat].score += pts;
      correct++;
    }
    review.push({
      id: q.id,
      prompt: q.prompt,
      banglaPrompt: q.banglaPrompt,
      given: show(answers[q.id]),
      correct: q.matchPairs ? q.matchPairs.map((p) => `${p.french} = ${p.englishOrBangla}`).join(', ') : show(q.correctAnswer),
      ok,
      explanation: q.explanation,
      banglaExplanation: q.banglaExplanation,
    });
  }
  const percentage = max ? Math.round((total / max) * 100) : 0;

  // Placement tests use the raw score bands from the original site; others use percentage
  let estimatedCEFR: CEFRLevel;
  if (quiz.isPlacementTest) {
    estimatedCEFR = total >= 22 ? 'B2' : total >= 15 ? 'B1' : total >= 8 ? 'A2' : 'A1';
  } else {
    estimatedCEFR = percentage < 30 ? 'Beginner (A0)' : percentage < 55 ? 'A1' : percentage < 75 ? 'A2' : percentage < 90 ? 'B1' : 'B2';
  }
  const rec: Record<string, string> = { 'Beginner (A0)': 'delf-a1', A1: 'delf-a2', A2: 'delf-b1', B1: 'delf-b2', B2: 'tef-canada' };
  const recommendedCourseId = quiz.isPlacementTest
    ? ({ A1: 'delf-a1', A2: 'delf-a2', B1: 'delf-b1', B2: 'delf-b2' } as Record<string, string>)[estimatedCEFR]
    : rec[estimatedCEFR] ?? 'delf-a1';

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  for (const c of CATS) {
    const b = breakdown[c];
    if (!b.max) continue;
    (b.score / b.max >= 0.7 ? strengths : weaknesses).push(c);
  }
  return {
    totalScore: total,
    maxScore: max,
    percentage,
    correct,
    wrong: autoCount - correct,
    breakdown,
    estimatedCEFR,
    recommendedCourseId,
    strengths,
    weaknesses,
    pendingReview,
    pendingMax,
    review,
  };
}

export interface Rating {
  stars: number;
  label: L;
  feedback: string;
  banglaFeedback: string;
  nclc?: L;
}

/** Star rating + feedback, ported from the original result dashboard. */
export function rate(quiz: QuizCategory, s: ScoredQuiz): Rating {
  if (quiz.isPlacementTest) {
    const t = s.totalScore;
    if (t >= 22)
      return {
        stars: 5,
        label: { en: 'Upper-Intermediate (B2)', bn: 'আপার-ইন্টারমিডিয়েট (B2)' },
        nclc: { en: 'Approx. NCLC/CLB: 6–7 (Upper-Intermediate)', bn: 'আনুমানিক NCLC/CLB: ৬–৭ (আপার-ইন্টারমিডিয়েট)' },
        feedback: 'Excellent result! You have reached Upper-Intermediate proficiency (B2, Approx. NCLC/CLB: 6–7). You are ready for DELF B2 / TEF Canada Masterclasses.',
        banglaFeedback: 'চমৎকার পারফরম্যান্স! আপনি আপার-ইন্টারমিডিয়েট (B2, আনুমানিক NCLC/CLB: ৬–৭) লেভেল অর্জন করেছেন। আপনি DELF B2 / TEF Canada মাস্টারক্লাসের জন্য প্রস্তুত।',
      };
    if (t >= 15)
      return {
        stars: 4,
        label: { en: 'Intermediate (B1)', bn: 'ইন্টারমিডিয়েট (B1)' },
        nclc: { en: 'Approx. NCLC/CLB: 5–6 (Intermediate)', bn: 'আনুমানিক NCLC/CLB: ৫–৬ (ইন্টারমিডিয়েট)' },
        feedback: 'Great job! You demonstrate solid Intermediate proficiency (B1, Approx. NCLC/CLB: 5–6). Join our B1 Target PR Batch to advance further.',
        banglaFeedback: 'খুব ভালো ফলাফল! আপনি ইন্টারমিডিয়েট (B1, আনুমানিক NCLC/CLB: ৫–৬) লেভেলের দক্ষতা দেখিয়েছেন। আরও এগিয়ে যেতে আমাদের B1 PR টার্গেট ব্যাচে যুক্ত হতে পারেন।',
      };
    if (t >= 8)
      return {
        stars: 3,
        label: { en: 'Elementary (A2)', bn: 'এলিমেন্টারি (A2)' },
        nclc: { en: 'Approx. NCLC/CLB: 3–4 (Elementary)', bn: 'আনুমানিক NCLC/CLB: ৩–৪ (এলিমেন্টারি)' },
        feedback: 'Good effort! You demonstrate Elementary level proficiency (A2, Approx. NCLC/CLB: 3–4). Strengthen your grammar & vocabulary in DELF A2 Live Batch.',
        banglaFeedback: 'ভালো চেষ্টা! আপনি এলিমেন্টারি (A2, আনুমানিক NCLC/CLB: ৩–৪) লেভেলে আছেন। ব্যাকরণ ও শব্দভাণ্ডার আরও মজবুত করতে DELF A2 লাইভ ব্যাচে যোগ দিন।',
      };
    return {
      stars: 2,
      label: { en: 'Beginner (A1)', bn: 'শিক্ষানবিস (A1)' },
      nclc: { en: 'Approx. NCLC/CLB: 1–2 (Beginner)', bn: 'আনুমানিক NCLC/CLB: ১–২ (শিক্ষানবিস)' },
      feedback: 'Welcome to your French journey! You are at Beginner level (A1, Approx. NCLC/CLB: 1–2). Start with our DELF A1 Foundation Live Preparation Batch.',
      banglaFeedback: 'ফরাসি ভাষা শেখার যাত্রায় স্বাগতম! আপনি শিক্ষানবিস (A1, আনুমানিক NCLC/CLB: ১–২) স্তরে আছেন। আমাদের DELF A1 ফাউন্ডেশন লাইভ ব্যাচ দিয়ে শুরু করুন।',
    };
  }
  if (quiz.id === 'tcf-canada-reading-c1-c2') {
    if (s.percentage >= 80)
      return {
        stars: 5,
        label: { en: 'Excellent Performance', bn: 'চমৎকার পারফরম্যান্স' },
        feedback: 'You demonstrate advanced reading comprehension skills close to the official TCF Canada C1–C2 level. Continue practicing full-length mock exams.',
        banglaFeedback: 'আপনি অফিশিয়াল TCF Canada C1–C2 লেভেলের কাছাকাছি উন্নত রিডিং কমপ্রিহেনশন দক্ষতা দেখিয়েছেন। পূর্ণাঙ্গ মক এক্সাম দিয়ে অনুশীলন অব্যাহত রাখুন।',
      };
    if (s.percentage >= 55)
      return {
        stars: 4,
        label: { en: 'Good Progress', bn: 'ভালো অগ্রগতি' },
        feedback: 'Your reading comprehension is strong. Focus on inference questions, discourse markers, and advanced vocabulary to reach a higher level.',
        banglaFeedback: 'আপনার রিডিং কমপ্রিহেনশন বেশ শক্তিশালী। আরও উঁচু লেভেলে পৌঁছাতে ইনফারেন্স প্রশ্ন, কানেক্টর ও অ্যাডভান্সড ভোকাবুলারিতে মনোযোগ দিন।',
      };
    return {
      stars: 2,
      label: { en: 'Needs Improvement', bn: 'আরও উন্নতি প্রয়োজন' },
      feedback: 'Continue practicing advanced articles, opinion texts, scientific texts, and critical reading exercises before attempting another full mock test.',
      banglaFeedback: 'পরবর্তী পূর্ণাঙ্গ মক টেস্টের আগে আরও উন্নত আর্টিকেল, মতামতধর্মী টেক্সট, বৈজ্ঞানিক নিবন্ধ ও সমালোচনামূলক রিডিং অনুশীলন চালিয়ে যান।',
    };
  }
  if (quiz.id.startsWith('tcf-canada-reading')) {
    if (s.percentage >= 80)
      return {
        stars: 5,
        label: { en: 'Excellent', bn: 'চমৎকার' },
        feedback: 'Excellent! You demonstrate strong reading comprehension skills at the B1–B2 level. Continue preparing with full TCF mock exams.',
        banglaFeedback: 'চমৎকার! আপনি B1–B2 লেভেলে দারুণ রিডিং কমপ্রিহেনশন দক্ষতা দেখিয়েছেন। পূর্ণাঙ্গ TCF মক টেস্ট দিয়ে প্রস্তুতি অব্যাহত রাখুন।',
      };
    if (s.percentage >= 55)
      return {
        stars: 4,
        label: { en: 'Good Progress', bn: 'ভালো অগ্রগতি' },
        feedback: 'Good Progress! You have a solid understanding of intermediate texts. Focus on vocabulary and inference questions to improve further.',
        banglaFeedback: 'ভালো অগ্রগতি! ইন্টারমিডিয়েট টেক্সট বোঝার ক্ষেত্রে আপনার ভিত্তি মজবুত। ভোকাবুলারি ও ইনফারেন্সভিত্তিক প্রশ্নে বাড়তি নজর দিন।',
      };
    return {
      stars: 2,
      label: { en: 'Needs Improvement', bn: 'আরও উন্নতি প্রয়োজন' },
      feedback: 'Needs Improvement. Practice more intermediate reading passages, notices, articles, workplace texts, and opinion-based questions before attempting another full mock test.',
      banglaFeedback: 'আরও অনুশীলন প্রয়োজন। পরবর্তী পূর্ণাঙ্গ মক টেস্টের আগে বিভিন্ন প্যাসেজ, নোটিশ, আর্টিকেল, কর্মক্ষেত্রের টেক্সট ও মতামতভিত্তিক প্রশ্নে বেশি বেশি প্র্যাকটিস করুন।',
    };
  }
  // Other quizzes: the original used raw-score cutoffs out of 20; scaled to percentage here
  const p = s.percentage;
  if (p >= 90)
    return {
      stars: 5,
      label: { en: 'Excellent', bn: 'চমৎকার' },
      feedback: "Excellent work! You're ready to begin DELF/TCF preparation.",
      banglaFeedback: 'চমৎকার পারফরম্যান্স! আপনি DELF/TCF প্রস্তুতি শুরু করার জন্য পুরোপুরি প্রস্তুত।',
    };
  if (p >= 75)
    return {
      stars: 4,
      label: { en: 'Very Good', bn: 'খুব ভালো' },
      feedback: 'Great progress! Continue practicing before taking the next mock test.',
      banglaFeedback: 'খুব ভালো অগ্রগতি! পরবর্তী মক টেস্টের আগে আরও কিছু অনুশীলন চালিয়ে যান।',
    };
  if (p >= 60)
    return {
      stars: 3,
      label: { en: 'Good', bn: 'ভালো' },
      feedback: 'Good effort! Review grammar & vocabulary to reach the top band.',
      banglaFeedback: 'ভালো চেষ্টা! সর্বোচ্চ ব্যান্ডে পৌঁছাতে ব্যাকরণ ও শব্দভাণ্ডার রিভিশন দিন।',
    };
  if (p >= 40)
    return {
      stars: 2,
      label: { en: 'Needs More Practice', bn: 'আরও অনুশীলন প্রয়োজন' },
      feedback: 'You need more practice with grammar and vocabulary. Join our LIVE Batch for guided learning.',
      banglaFeedback: 'আপনার ব্যাকরণ ও শব্দভাণ্ডারে আরও অনুশীলন প্রয়োজন। গাইডেড শেখার জন্য আমাদের লাইভ ব্যাচে যুক্ত হতে পারেন।',
    };
  return {
    stars: 1,
    label: { en: 'Revise the Topics Again', bn: 'বিষয়গুলো আবার রিভিশন দিন' },
    feedback: 'Revise basic grammar and vocabulary topics, then retake the test.',
    banglaFeedback: 'মৌলিক ব্যাকরণ ও শব্দভাণ্ডারের বিষয়গুলো রিভিশন দিয়ে আবারও টেস্টে অংশ নিন।',
  };
}

/** Course name for a recommendation in the given locale (falls back to the id). Pass the admin-edited list when available. */
export const courseTitle = (id: string, locale: 'en' | 'bn' = 'en', courses: Course[] = COURSES_DATA) => {
  const c = courses.find((x) => x.id === id);
  if (!c) return id;
  return locale === 'bn' ? c.banglaTitle || c.title : c.title;
};
