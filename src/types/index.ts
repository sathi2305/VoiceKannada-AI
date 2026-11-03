export type NavTab =
  | 'dashboard'
  | 'assistant'
  | 'translator'
  | 'vision'
  | 'learning'
  | 'practice'
  | 'builder'
  | 'listening'
  | 'roleplay'
  | 'quests'
  | 'characters'
  | 'culture'
  | 'mistakes'
  | 'vocabulary'
  | 'history'
  | 'progress'
  | 'settings'
  | 'about';

export type AssistantMode =
  | 'conversation'
  | 'kannada_tutor'
  | 'daily_practice'
  | 'roleplay'
  | 'translator'
  | 'interview_prep'
  | 'travel_companion'
  | 'grammar_coach';

export type ExplanationLanguage = 'english' | 'hindi' | 'tamil' | 'telugu';

export interface UserProfile {
  proficiency: 'beginner' | 'elementary' | 'intermediate' | 'advanced';
  objective: 'travel' | 'work' | 'social' | 'culture' | 'exam';
  explanationLang: ExplanationLanguage;
  dailyMinutes: number;
  topics: string[];
  level: number;
  xp: number;
  onboardingCompleted: boolean;
}

export interface PhraseBreakdownItem {
  word: string;
  transliteration: string;
  meaning: string;
}

export interface LessonPhrase {
  id: string;
  kannada: string;
  transliteration: string;
  english: string;
  context?: string;
  breakdown?: PhraseBreakdownItem[];
}

export interface LessonDialogueExample {
  speakerA: string;
  speakerB: string;
  translitA?: string;
  translitB?: string;
  englishA: string;
  englishB: string;
}

export interface LessonQuizQuestion {
  question: string;
  questionKannada?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonInteractiveExercise {
  type: 'fill_in' | 'word_order';
  prompt: string;
  targetText: string;
  options?: string[];
  correctOrder?: string[];
  explanation: string;
}

export interface Lesson {
  id: string;
  titleKannada: string;
  titleEnglish: string;
  category: 'basics' | 'travel' | 'shopping' | 'food' | 'health' | 'daily' | 'grammar';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  durationMinutes: number;
  phrasesCount: number;
  culturalNote?: string;
  isCompleted?: boolean;
  objective?: string;
  pronunciationTips?: string;
  examples?: LessonDialogueExample[];
  quiz?: LessonQuizQuestion[];
  interactiveExercise?: LessonInteractiveExercise;
  phrases?: LessonPhrase[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  kannada: string;
  transliteration?: string;
  english?: string;
  grammarNotes?: string;
  suggestedReplies?: string[];
  correction?: string;
  timestamp: string;
  audioPlaying?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  mode?: AssistantMode;
  timestamp: string;
  messages: ChatMessage[];
}

export interface SavedPhrase {
  id: string;
  kannada: string;
  transliteration: string;
  english: string;
  category: string;
  notes?: string;
  savedAt: string;
}

export interface PracticeComparisonResult {
  targetText: string;
  recognizedText: string;
  matchRatio: number;
  isFullMatch: boolean;
  matchedWords: string[];
  missingWords: string[];
  extraWords: string[];
  feedback: string;
  detailedTokens: Array<{
    targetWord: string;
    targetTransliteration?: string;
    matched: boolean;
  }>;
}

export interface PracticeHistoryItem {
  id: string;
  phraseId: string;
  targetText: string;
  recognizedText: string;
  matchRatio: number;
  matchedWords: string[];
  missingWords: string[];
  feedback: string;
  timestamp: string;
}

export interface UserProgress {
  completedLessonIds: string[];
  totalPracticed: number;
  streakDays: number;
  lastActiveDate: string;
  totalLessons: number;
  completedCount: number;
  completionPercentage: number;
  xp: number;
  level: number;
  practiceHistory: PracticeHistoryItem[];
}

export interface PublicConfig {
  appName: string;
  version: string;
  geminiConfigured: boolean;
  defaultAiModel: string;
  ttsModel: string;
  locale: string;
  speechRecognitionOptions: string[];
  speechSynthesisOptions: string[];
}

export interface AppSettings {
  speechInputMode: 'browser' | 'backend';
  speechOutputMode: 'browser' | 'backend';
  voiceRate: number;
  voicePitch: number;
  transliterationStyle: 'standard' | 'phonetic';
  theme: 'dark' | 'light' | 'navy' | 'midnight' | 'emerald';
  continuousModeDefault: boolean;
  explanationLanguage: ExplanationLanguage;
  textSize: 'normal' | 'large';
  responseLength: 'concise' | 'detailed';
}

// Spaced Repetition Item
export interface SRSItem {
  id: string;
  kannada: string;
  transliteration: string;
  english: string;
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  nextReviewDate: string;
  lastReviewedDate?: string;
  state: 'learning' | 'review' | 'mastered';
}

// Sentence Builder Exercise
export interface SentenceBuilderExercise {
  id: string;
  targetEnglish: string;
  correctKannada: string;
  correctWords: string[];
  scrambledWords: string[];
  transliteration: string;
  grammarExplanation: string;
  audioPrompt?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

// Listening Comprehension Exercise
export interface ListeningExercise {
  id: string;
  title: string;
  kannadaAudioText: string;
  transliteration: string;
  englishMeaning: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Beginner' | 'Intermediate';
}

// Role-Play Scenario
export interface RolePlayScenario {
  id: string;
  title: string;
  kannadaTitle: string;
  location: string;
  description: string;
  objective: string;
  roleUser: string;
  roleAI: string;
  initialMessage: {
    kannada: string;
    transliteration: string;
    english: string;
  };
  cheatSheetPhrases: Array<{
    kannada: string;
    transliteration: string;
    english: string;
  }>;
}

// Tasteful Achievement
export interface Achievement {
  id: string;
  title: string;
  titleKannada: string;
  description: string;
  iconName: string;
  xpReward: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

// Script Character
export interface ScriptCharacter {
  char: string;
  transliteration: string;
  type: 'vowel' | 'consonant' | 'yogavahaka';
  category: string;
  exampleWord: string;
  exampleTranslit: string;
  exampleMeaning: string;
}

// Vision Analysis Result
export interface VisionAnalysisResult {
  extractedKannada: string;
  transliteration: string;
  english: string;
  confidence: 'High' | 'Medium' | 'Low';
  detectedType: 'signboard' | 'text' | 'object' | 'scene' | 'menu';
  culturalContext: string;
  vocabularyBreakdown: Array<{
    word: string;
    transliteration: string;
    meaning: string;
  }>;
  suggestedPractice: string;
  practiceTransliteration?: string;
  practiceEnglish?: string;
}

// Two-Way Voice Translator
export interface TranslationTurn {
  id: string;
  speaker: 'speaker1' | 'speaker2';
  sourceLanguage: 'kn-IN' | 'en-US';
  targetLanguage: 'en-US' | 'kn-IN';
  sourceText: string;
  translatedText: string;
  transliteration?: string;
  timestamp: string;
}

// Culture & Context Engine
export interface CultureArticle {
  id: string;
  titleKannada: string;
  titleEnglish: string;
  category: 'dialects' | 'festivals' | 'food' | 'literature' | 'etiquette';
  region: string;
  description: string;
  verifiedHistoricalNotes: string;
  sourceCitation: string;
  keyPhrases: Array<{
    kannada: string;
    transliteration: string;
    english: string;
    context: string;
  }>;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

// Quest-Based Learning
export interface Quest {
  id: string;
  title: string;
  titleKannada: string;
  category: 'beginner' | 'intermediate' | 'advanced' | 'daily';
  description: string;
  xpReward: number;
  totalSteps: number;
  currentSteps: number;
  isCompleted: boolean;
  isUnlocked: boolean;
  requiredLevel: number;
  actionTab: NavTab;
  steps: string[];
}

// Personal Mistake Coach
export interface MistakeRecord {
  id: string;
  targetKannada: string;
  targetTransliteration: string;
  targetEnglish: string;
  recognizedText: string;
  errorType: 'pronunciation' | 'missing_word' | 'word_order' | 'spelling';
  errorWord: string;
  diffTokens?: Array<{
    text: string;
    type: 'correct' | 'missing' | 'unexpected';
  }>;
  explanation: string;
  attemptCount: number;
  lastAttemptDate: string;
}

// AI Personal Learning Brain
export interface LearningBrainAnalysis {
  masteryScore: number;
  weeklyActivityCount: number;
  totalVocabularyLearned: number;
  accuracyRate: number;
  streakDays: number;
  recurrentMistakes: Array<{
    word: string;
    count: number;
    category: string;
  }>;
  recommendations: Array<{
    id: string;
    title: string;
    titleKannada: string;
    reason: string;
    priority: 'high' | 'medium' | 'normal';
    targetTab: NavTab;
  }>;
  learningSummary: string;
}

