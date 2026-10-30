export type FrenchLevel = 'A1' | 'A2' | 'B1' | 'B2';

export type LearningGoal =
  | 'Learn French from zero'
  | 'DELF A1'
  | 'DELF A2'
  | 'DELF B1'
  | 'DELF B2'
  | 'TEF Canada'
  | 'TCF Canada'
  | 'Canada PR'
  | 'Study in France'
  | 'Work in France'
  | 'Everyday French'
  | 'Conversation practice';

export type ResponseLevel = 'beginner' | 'learning' | 'immersion';

export type TutorMode =
  | 'dashboard'
  | 'conversation'
  | 'grammar'
  | 'vocabulary'
  | 'speaking'
  | 'writing'
  | 'listening'
  | 'reading'
  | 'delf'
  | 'tef'
  | 'tcf'
  | 'mock_test'
  | 'daily_lesson'
  | 'saved';

export interface StudentAiProfile {
  level: FrenchLevel;
  goal: LearningGoal;
  responseLevel: ResponseLevel;
  streakDays: number;
  totalSessionsCount: number;
  grammarScoreAvg: number;
  vocabScoreAvg: number;
  speakingScoreAvg: number;
  writingScoreAvg: number;
  readingScoreAvg: number;
  weakWords: string[];
  weakGrammar: string[];
  topicsPracticed: string[];
  lastPracticedDate?: string;
  onboardingCompleted: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  frenchCorrection?: {
    incorrect: string;
    correct: string;
    explanation: string;
  };
  banglaTranslation?: string;
  pronunciationGuide?: {
    ipa?: string;
    simple?: string;
    banglaApprox?: string;
  };
  timestamp: string;
}

export interface VocabularyWord {
  id: string;
  french: string;
  pronunciation: string;
  banglaApprox: string;
  banglaMeaning: string;
  frenchMeaning?: string;
  category: 'Daily life' | 'Family' | 'Work' | 'Education' | 'Travel' | 'Food' | 'Canada' | 'France' | 'Business' | 'Academic';
  exampleSentence: string;
  exampleBangla: string;
  isWeak?: boolean;
}

export interface SavedItem {
  id: string;
  type: 'word' | 'sentence' | 'grammar' | 'lesson';
  french: string;
  translation: string;
  notes?: string;
  createdAt: string;
}

export interface AiSessionRecord {
  id: string;
  date: string;
  mode: TutorMode;
  topic: string;
  scorePercentage: number;
  durationMinutes: number;
}

export interface WritingEvaluationResult {
  original: string;
  corrected: string;
  explanation: string;
  betterVersion: string;
  grammarScore: number;
  vocabularyScore: number;
  coherenceScore: number;
  overallFeedback: string;
}

export interface DailyLessonData {
  topic: string;
  title: string;
  vocabulary: Array<{
    french: string;
    pronunciation: string;
    banglaApprox: string;
    bangla: string;
    example: string;
  }>;
  grammarPoint: {
    rule: string;
    banglaExplanation: string;
    exampleCorrect: string;
    exampleIncorrect: string;
  };
  miniConversation: Array<{
    speaker: string;
    french: string;
    bangla: string;
  }>;
  quickQuiz: Array<{
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  }>;
}

export interface MockTestResult {
  id: string;
  examType: 'DELF' | 'TEF Canada' | 'TCF Canada';
  level: FrenchLevel;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  date: string;
  weakAreas: string[];
}

export interface AdminAiConfig {
  aiEnabled: boolean;
  dailyLimit: number;
  maintenanceMode: boolean;
  systemPromptOverride: string;
  allowedLevels: FrenchLevel[];
  examModesEnabled: boolean;
  voiceEnabled: boolean;
}
