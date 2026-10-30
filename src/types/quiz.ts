export type QuestionType =
  | 'multiple-choice'
  | 'multiple-select'
  | 'fill-blank'
  | 'true-false'
  | 'matching'
  | 'ordering'
  | 'reading-comp'
  | 'audio-listening'
  | 'writing-task'
  | 'speaking-eval';

export type CEFRLevel = 'Beginner (A0)' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'C1/C2' | 'TEF' | 'TCF';

export type QuestionCategory =
  | 'Grammar'
  | 'Vocabulary'
  | 'Reading'
  | 'Listening'
  | 'Writing'
  | 'Speaking'
  | 'Placement';

export interface MatchingPair {
  id: string;
  french: string;
  englishOrBangla: string;
}

export interface Question {
  id: string;
  quizId: string;
  type: QuestionType;
  category: QuestionCategory;
  cefrLevel: CEFRLevel;
  prompt: string;
  banglaPrompt?: string;
  frenchContext?: string;
  passage?: string; // For reading comprehension
  audioText?: string; // Text to synthesize or French transcript
  audioUrl?: string; // Optional audio file
  options?: string[]; // For multiple choice / select
  correctAnswer?: string | string[]; // Single string or array of correct options
  matchPairs?: MatchingPair[]; // For matching type
  orderItems?: string[]; // Correct sequence of sentences
  explanation?: string;
  banglaExplanation?: string;
  points: number;
}

export interface QuizCategory {
  id: string;
  slug: string;
  title: string;
  banglaTitle: string;
  description: string;
  banglaDescription: string;
  level: CEFRLevel;
  questionCount: number;
  durationMinutes: number;
  iconName: string;
  badgeTag: string;
  isPlacementTest?: boolean;
  isMockExam?: boolean;
  isChallenge?: boolean;
}

export interface UserAnswer {
  questionId: string;
  givenAnswer: unknown; // string, string[], object
  isCorrect?: boolean;
  pointsEarned: number;
  timeTakenSeconds?: number;
}

export interface QuizResult {
  id: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  quizId: string;
  quizTitle: string;
  completedAt: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  timeTakenSeconds: number;
  estimatedCEFR: CEFRLevel;
  categoryBreakdown: {
    Grammar: { score: number; max: number };
    Vocabulary: { score: number; max: number };
    Reading: { score: number; max: number };
    Listening: { score: number; max: number };
    Writing: { score: number; max: number };
    Speaking: { score: number; max: number };
  };
  strengths: string[];
  weaknesses: string[];
  recommendedCourseId: string;
  recommendedCourseTitle: string;
  userAnswers: UserAnswer[];
}

export interface QuizAttemptHistory {
  id: string;
  quizId: string;
  quizTitle: string;
  completedAt: string;
  percentage: number;
  estimatedCEFR: CEFRLevel;
  totalScore: number;
  maxScore: number;
}
