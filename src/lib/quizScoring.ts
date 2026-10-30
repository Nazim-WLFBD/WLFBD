import { QUESTION_BANK, QUIZ_CATEGORIES } from '@/data/quizData';
import type { CEFRLevel, Question, QuizCategory } from '@/types/quiz';
import { COURSES_DATA } from '@/data/courses';

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

export function isCorrect(q: Question, given: unknown): boolean {
  if (given == null || given === '') return false;
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
  review: { id: string; prompt: string; given: string; correct: string; ok: boolean; explanation?: string }[];
}

const show = (v: unknown) =>
  v == null || v === '' ? '—' : typeof v === 'object' ? Object.values(v as object).join(', ') : String(v);

export function scoreQuiz(quiz: QuizCategory, questions: Question[], answers: Record<string, unknown>): ScoredQuiz {
  const breakdown = Object.fromEntries(CATS.map((c) => [c, { score: 0, max: 0 }])) as Breakdown;
  let total = 0;
  let max = 0;
  let correct = 0;
  const review: ScoredQuiz['review'] = [];
  for (const q of questions) {
    const ok = isCorrect(q, answers[q.id]);
    const cat = (CATS as readonly string[]).includes(q.category) ? (q.category as keyof Breakdown) : 'Grammar';
    breakdown[cat].max += q.points;
    max += q.points;
    if (ok) {
      total += q.points;
      breakdown[cat].score += q.points;
      correct++;
    }
    review.push({
      id: q.id,
      prompt: q.prompt,
      given: show(answers[q.id]),
      correct: q.matchPairs ? q.matchPairs.map((p) => `${p.french} = ${p.englishOrBangla}`).join(', ') : show(q.correctAnswer),
      ok,
      explanation: q.explanation,
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
  return { totalScore: total, maxScore: max, percentage, correct, wrong: questions.length - correct, breakdown, estimatedCEFR, recommendedCourseId, strengths, weaknesses, review };
}

export interface Rating {
  stars: number;
  label: string;
  feedback: string;
  banglaFeedback: string;
  nclc?: string;
}

/** Star rating + feedback, ported from the original result dashboard. */
export function rate(quiz: QuizCategory, s: ScoredQuiz): Rating {
  if (quiz.isPlacementTest) {
    const t = s.totalScore;
    if (t >= 22)
      return { stars: 5, label: 'Upper-Intermediate (B2)', nclc: 'Approx. NCLC/CLB: 6–7 (Upper-Intermediate)', feedback: 'Excellent result! You have reached Upper-Intermediate proficiency (B2, Approx. NCLC/CLB: 6–7). You are ready for DELF B2 / TEF Canada Masterclasses.', banglaFeedback: 'চমৎকার পারফরম্যান্স! আপনি আপার-ইন্টারমিডিয়েট (B2, Approx. NCLC/CLB: 6–7) লেভেল অর্জনে সক্ষম হয়েছেন। আপনি DELF B2 / TEF Canada মাস্টার ক্লাসের জন্য প্রস্তুত।' };
    if (t >= 15)
      return { stars: 4, label: 'Intermediate (B1)', nclc: 'Approx. NCLC/CLB: 5–6 (Intermediate)', feedback: 'Great job! You demonstrate solid Intermediate proficiency (B1, Approx. NCLC/CLB: 5–6). Join our B1 Target PR Batch to advance further.', banglaFeedback: 'খুব ভালো ফলাফল! আপনি ইন্টারমিডিয়েট (B1, Approx. NCLC/CLB: 5–6) লেভেলের দক্ষতা দেখিয়েছেন। উচ্চতর প্রস্তুতির জন্য B1 ব্যাচে যুক্ত হতে পারেন।' };
    if (t >= 8)
      return { stars: 3, label: 'Elementary (A2)', nclc: 'Approx. NCLC/CLB: 3–4 (Elementary)', feedback: 'Good effort! You demonstrate Elementary level proficiency (A2, Approx. NCLC/CLB: 3–4). Strengthen your grammar & vocabulary in DELF A2 Live Batch.', banglaFeedback: 'ভালো চেষ্টা! আপনি এলিমেন্টারি (A2, Approx. NCLC/CLB: 3–4) লেভেলে আছেন। ব্যাকরণ ও শব্দভাণ্ডার আরও জোরদার করতে A2 লাইভ ব্যাচে যোগ দিন।' };
    return { stars: 2, label: 'Beginner (A1)', nclc: 'Approx. NCLC/CLB: 1–2 (Beginner)', feedback: 'Welcome to your French journey! You are at Beginner level (A1, Approx. NCLC/CLB: 1–2). Start with our DELF A1 Foundation Live Preparation Batch.', banglaFeedback: 'ফরাসি ভাষা শেখার যাত্রায় স্বাগতম! আপনি শিক্ষানবিস (A1, Approx. NCLC/CLB: 1–2) স্তরে আছেন। আমাদের DELF A1 ফাউন্ডেশন ব্যাচ দিয়ে শুরু করুন।' };
  }
  if (quiz.id === 'tcf-canada-reading-c1-c2') {
    if (s.percentage >= 80) return { stars: 5, label: 'Excellent Performance', feedback: 'You demonstrate advanced reading comprehension skills close to the official TCF Canada C1–C2 level. Continue practicing full-length mock exams.', banglaFeedback: 'আপনি সরকারি TCF Canada C1–C2 লেভেলের কাছাকাছি উন্নত রিডিং কমপ্রিহেনশন দক্ষতা দেখিয়েছেন। পূর্ণাঙ্গ মক এক্সাম দিয়ে অনুশীলন অব্যাহত রাখুন।' };
    if (s.percentage >= 55) return { stars: 4, label: 'Good Progress', feedback: 'Your reading comprehension is strong. Focus on inference questions, discourse markers, and advanced vocabulary to reach a higher level.', banglaFeedback: 'আপনার রিডিং কমপ্রিহেনশন অত্যন্ত শক্তিশালী। আরও উচ্চ লেভেলে পৌঁছাতে ইনফ্যারেন্সিয়াল প্রশ্ন, কানেক্টর ও এডভান্সড ভোকাবুলারিতে মনোযোগ দিন।' };
    return { stars: 2, label: 'Needs Improvement', feedback: 'Continue practicing advanced articles, opinion texts, scientific texts, and critical reading exercises before attempting another full mock test.', banglaFeedback: 'পরবর্তী পূর্ণাঙ্গ মক টেস্টের আগে আরও উন্নত আর্টিকেল, অভিমতধর্মী টেক্সট, বৈজ্ঞানিক নিবন্ধ ও সমালোচনামূলক রিডিং অনুশীলন চালিয়ে যান।' };
  }
  if (quiz.id.startsWith('tcf-canada-reading')) {
    if (s.percentage >= 80) return { stars: 5, label: 'Excellent', feedback: 'Excellent! You demonstrate strong reading comprehension skills at the B1–B2 level. Continue preparing with full TCF mock exams.', banglaFeedback: 'চমৎকার! আপনি B1-B2 লেভেলে চমৎকার রিডিং কমপ্রিহেনশন দক্ষতা প্রদর্শন করেছেন। পূর্ণাঙ্গ TCF মক টেস্ট দিয়ে প্রস্তুতি অব্যাহত রাখুন।' };
    if (s.percentage >= 55) return { stars: 4, label: 'Good Progress', feedback: 'Good Progress! You have a solid understanding of intermediate texts. Focus on vocabulary and inference questions to improve further.', banglaFeedback: 'খুব ভালো উন্নতি! ইন্টারমিডিয়েট টেক্সট বোঝার ক্ষেত্রে আপনার ভালো ভিত্তি তৈরি হয়েছে। ভোকাবুলারি ও ইনফ্যারেন্সভিত্তিক প্রশ্নে বাড়তি নজর দিন।' };
    return { stars: 2, label: 'Needs Improvement', feedback: 'Needs Improvement. Practice more intermediate reading passages, notices, articles, workplace texts, and opinion-based questions before attempting another full mock test.', banglaFeedback: 'আরও অনুশীলন প্রয়োজন। পরবর্তী পূর্ণাঙ্গ মক টেস্টের আগে বিভিন্ন প্যাসেজ, নোটিশ, আর্টিকেল ও মতামতভিত্তিক প্রশ্নে বেশি বেশি প্র্যাকটিস করুন।' };
  }
  // Other quizzes: the original used raw-score cutoffs out of 20; scaled to percentage here
  const p = s.percentage;
  if (p >= 90) return { stars: 5, label: 'Excellent', feedback: "Excellent work! You're ready to begin DELF/TCF preparation.", banglaFeedback: 'চমৎকার পারফরম্যান্স! আপনি উচ্চতর প্রস্তুতির জন্য পুরোপুরি প্রস্তুত।' };
  if (p >= 75) return { stars: 4, label: 'Very Good', feedback: 'Great progress! Continue practicing before taking the next mock test.', banglaFeedback: 'খুব ভালো উন্নতি! পরবর্তী মক টেস্টের আগে আরও কিছু অনুশীলন চালিয়ে যান।' };
  if (p >= 60) return { stars: 3, label: 'Good', feedback: 'Good effort! Review grammar & vocabulary to reach the top band.', banglaFeedback: 'ভালো চেষ্টা! ব্যাকরণ ও শব্দভাণ্ডারের দুর্বল বিষয়গুলো রিভিশন দিন।' };
  if (p >= 40) return { stars: 2, label: 'Needs More Practice', feedback: 'You need more practice with grammar and vocabulary. Join our LIVE Batch for guided learning.', banglaFeedback: 'আপনার ব্যাকরণ ও শব্দভাণ্ডারে আরও অনুশীলন প্রয়োজন। আমাদের লাইভ ব্যাচে যুক্ত হতে পারেন।' };
  return { stars: 1, label: 'Revise the Topics Again', feedback: 'Revise basic grammar and vocabulary topics, then retake the test.', banglaFeedback: 'মৌলিক বিষয়গুলো রিভিশন দিয়ে আবারও টেস্টে অংশ নিন।' };
}

export const courseTitle = (id: string) => COURSES_DATA.find((c) => c.id === id)?.title ?? id;
