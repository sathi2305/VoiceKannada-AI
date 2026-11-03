import fs from 'node:fs';
import path from 'node:path';
import {
  UserProfile,
  SRSItem,
  Achievement,
  Quest,
  MistakeRecord,
  LearningBrainAnalysis
} from '../src/types/index.js';
import { INITIAL_SRS_ITEMS, INITIAL_ACHIEVEMENTS } from './data/exercises.js';
import { INITIAL_QUESTS } from './data/quests.js';

export interface PracticeRecord {
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

export interface ProgressData {
  completedLessonIds: string[];
  totalPracticed: number;
  streakDays: number;
  lastActiveDate: string;
  xp: number;
  level: number;
  practiceHistory: PracticeRecord[];
  completedExerciseIds: string[];
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

export interface ChatMessageRecord {
  id: string;
  role: 'user' | 'assistant';
  kannada: string;
  transliteration?: string;
  english?: string;
  grammarNotes?: string;
  correction?: string;
  timestamp: string;
}

export interface ConversationRecord {
  id: string;
  title: string;
  mode?: string;
  timestamp: string;
  messages: ChatMessageRecord[];
}

export interface DatabaseSchema {
  userProfile: UserProfile;
  progress: ProgressData;
  savedPhrases: SavedPhrase[];
  srsItems: SRSItem[];
  achievements: Achievement[];
  conversations: ConversationRecord[];
  quests: Quest[];
  mistakes: MistakeRecord[];
  settings: {
    speechInputMode: 'browser' | 'backend';
    speechOutputMode: 'browser' | 'backend';
    voiceRate: number;
    voicePitch: number;
    transliterationStyle: 'standard' | 'phonetic';
    theme: 'navy' | 'midnight' | 'emerald';
    explanationLanguage: 'english' | 'hindi' | 'tamil' | 'telugu';
    textSize: 'normal' | 'large';
    responseLength: 'concise' | 'detailed';
  };
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'storage.json');

const DEFAULT_PROFILE: UserProfile = {
  proficiency: 'beginner',
  objective: 'travel',
  explanationLang: 'english',
  dailyMinutes: 10,
  topics: ['greetings', 'travel', 'food'],
  level: 1,
  xp: 150,
  onboardingCompleted: true
};

const DEFAULT_DB: DatabaseSchema = {
  userProfile: DEFAULT_PROFILE,
  progress: {
    completedLessonIds: [],
    totalPracticed: 0,
    streakDays: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    xp: 150,
    level: 1,
    practiceHistory: [],
    completedExerciseIds: []
  },
  savedPhrases: [
    {
      id: 'default-1',
      kannada: 'ನಮಸ್ಕಾರ',
      transliteration: 'Namaskāra',
      english: 'Hello / Greetings',
      category: 'basics',
      notes: 'Universal polite greeting',
      savedAt: new Date().toISOString()
    },
    {
      id: 'default-2',
      kannada: 'ಧನ್ಯವಾದಗಳು',
      transliteration: 'Dhan\'yavādagaḷu',
      english: 'Thank you very much',
      category: 'basics',
      notes: 'Expression of gratitude',
      savedAt: new Date().toISOString()
    }
  ],
  srsItems: INITIAL_SRS_ITEMS,
  achievements: INITIAL_ACHIEVEMENTS,
  conversations: [],
  quests: INITIAL_QUESTS,
  mistakes: [],
  settings: {
    speechInputMode: 'browser',
    speechOutputMode: 'browser',
    voiceRate: 1.0,
    voicePitch: 1.0,
    transliterationStyle: 'standard',
    theme: 'navy',
    explanationLanguage: 'english',
    textSize: 'normal',
    responseLength: 'detailed'
  }
};

function calculateLevel(xp: number): number {
  if (xp >= 2000) return 5;
  if (xp >= 1000) return 4;
  if (xp >= 500) return 3;
  if (xp >= 250) return 2;
  return 1;
}

function ensureDbFileExists(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
      return DEFAULT_DB;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      userProfile: { ...DEFAULT_PROFILE, ...(parsed.userProfile || {}) },
      progress: {
        ...DEFAULT_DB.progress,
        ...(parsed.progress || {}),
        xp: parsed.progress?.xp ?? DEFAULT_DB.progress.xp,
        level: calculateLevel(parsed.progress?.xp ?? DEFAULT_DB.progress.xp),
        completedExerciseIds: parsed.progress?.completedExerciseIds || []
      },
      savedPhrases: Array.isArray(parsed.savedPhrases) ? parsed.savedPhrases : DEFAULT_DB.savedPhrases,
      srsItems: Array.isArray(parsed.srsItems) && parsed.srsItems.length > 0 ? parsed.srsItems : INITIAL_SRS_ITEMS,
      achievements: Array.isArray(parsed.achievements) && parsed.achievements.length > 0 ? parsed.achievements : INITIAL_ACHIEVEMENTS,
      conversations: Array.isArray(parsed.conversations) ? parsed.conversations : [],
      quests: Array.isArray(parsed.quests) && parsed.quests.length > 0 ? parsed.quests : INITIAL_QUESTS,
      mistakes: Array.isArray(parsed.mistakes) ? parsed.mistakes : [],
      settings: { ...DEFAULT_DB.settings, ...(parsed.settings || {}) }
    };
  } catch (err) {
    console.error('Error reading DB file, using fallback default:', err);
    return DEFAULT_DB;
  }
}

function writeDbFile(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error writing DB file:', err);
  }
}

export const db = {
  get(): DatabaseSchema {
    return ensureDbFileExists();
  },

  getUserProfile(): UserProfile {
    return ensureDbFileExists().userProfile;
  },

  updateUserProfile(profile: Partial<UserProfile>): UserProfile {
    const current = ensureDbFileExists();
    current.userProfile = {
      ...current.userProfile,
      ...profile
    };
    writeDbFile(current);
    return current.userProfile;
  },

  getProgress(): ProgressData {
    return ensureDbFileExists().progress;
  },

  addXP(amount: number, reason?: string): { xp: number; level: number; unlockedAchievements: Achievement[] } {
    const current = ensureDbFileExists();
    current.progress.xp = (current.progress.xp || 0) + amount;
    const newLevel = calculateLevel(current.progress.xp);
    current.progress.level = newLevel;
    current.userProfile.xp = current.progress.xp;
    current.userProfile.level = newLevel;

    // Check automatic achievement unlocks
    const newlyUnlocked: Achievement[] = [];
    current.achievements.forEach(ach => {
      if (!ach.isUnlocked) {
        let shouldUnlock = false;
        if (ach.id === 'ach-first-chat' && current.conversations.length > 0) shouldUnlock = true;
        if (ach.id === 'ach-first-lesson' && current.progress.completedLessonIds.length > 0) shouldUnlock = true;
        if (ach.id === 'ach-pronunciation' && current.progress.totalPracticed >= 5) shouldUnlock = true;
        if (ach.id === 'ach-streak-week' && current.progress.streakDays >= 7) shouldUnlock = true;

        if (shouldUnlock) {
          ach.isUnlocked = true;
          ach.unlockedAt = new Date().toISOString();
          newlyUnlocked.push(ach);
        }
      }
    });

    writeDbFile(current);
    return { xp: current.progress.xp, level: newLevel, unlockedAchievements: newlyUnlocked };
  },

  recordPractice(record: Omit<PracticeRecord, 'id' | 'timestamp'>): PracticeRecord {
    const current = ensureDbFileExists();
    const newRecord: PracticeRecord = {
      ...record,
      id: `prac-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString()
    };

    const today = new Date().toISOString().split('T')[0];
    let streakDays = current.progress.streakDays || 1;
    if (current.progress.lastActiveDate !== today) {
      const lastDate = new Date(current.progress.lastActiveDate);
      const diffDays = Math.floor((new Date(today).getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        streakDays += 1;
      } else if (diffDays > 1) {
        streakDays = 1;
      }
    }

    current.progress.practiceHistory.unshift(newRecord);
    current.progress.totalPracticed = (current.progress.totalPracticed || 0) + 1;
    current.progress.streakDays = streakDays;
    current.progress.lastActiveDate = today;

    // Award +25 XP for speaking practice
    current.progress.xp = (current.progress.xp || 0) + 25;
    current.progress.level = calculateLevel(current.progress.xp);

    if (current.progress.practiceHistory.length > 50) {
      current.progress.practiceHistory = current.progress.practiceHistory.slice(0, 50);
    }

    writeDbFile(current);
    return newRecord;
  },

  extendStreak(): { streakDays: number; lastActiveDate: string } {
    const current = ensureDbFileExists();
    current.progress.streakDays = (current.progress.streakDays || 1) + 1;
    current.progress.lastActiveDate = new Date().toISOString().split('T')[0];
    current.progress.xp = (current.progress.xp || 0) + 30; // Streak bonus
    writeDbFile(current);
    return { streakDays: current.progress.streakDays, lastActiveDate: current.progress.lastActiveDate };
  },

  toggleCompleteLesson(lessonId: string): { completed: boolean; completedLessonIds: string[] } {
    const current = ensureDbFileExists();
    const set = new Set(current.progress.completedLessonIds || []);
    let completed = false;
    if (set.has(lessonId)) {
      set.delete(lessonId);
      completed = false;
    } else {
      set.add(lessonId);
      completed = true;
      current.progress.xp = (current.progress.xp || 0) + 100; // +100 XP per lesson!
    }
    current.progress.completedLessonIds = Array.from(set);
    writeDbFile(current);
    return { completed, completedLessonIds: current.progress.completedLessonIds };
  },

  // Spaced Repetition SM-2 Implementation
  getSRSItems(): SRSItem[] {
    return ensureDbFileExists().srsItems;
  },

  reviewSRSItem(id: string, rating: 1 | 2 | 3 | 4): SRSItem {
    const current = ensureDbFileExists();
    let item = current.srsItems.find(i => i.id === id);

    if (!item) {
      // Create if doesn't exist
      item = {
        id,
        kannada: 'ಕನ್ನಡ',
        transliteration: 'Kannada',
        english: 'Kannada',
        intervalDays: 1,
        easeFactor: 2.5,
        repetitions: 0,
        nextReviewDate: new Date().toISOString().split('T')[0],
        state: 'learning'
      };
      current.srsItems.push(item);
    }

    // SuperMemo-2 Algorithm
    if (rating >= 3) {
      if (item.repetitions === 0) {
        item.intervalDays = 1;
      } else if (item.repetitions === 1) {
        item.intervalDays = 3;
      } else {
        item.intervalDays = Math.round(item.intervalDays * item.easeFactor);
      }
      item.repetitions += 1;
      item.state = item.repetitions >= 4 ? 'mastered' : 'review';
    } else {
      item.repetitions = 0;
      item.intervalDays = 1;
      item.state = 'learning';
    }

    // Update ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    const q = rating + 1; // map 1..4 to 2..5
    item.easeFactor = Math.max(1.3, item.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + item.intervalDays);
    item.nextReviewDate = nextDate.toISOString().split('T')[0];
    item.lastReviewedDate = new Date().toISOString().split('T')[0];

    // Award XP
    current.progress.xp = (current.progress.xp || 0) + 15;

    writeDbFile(current);
    return item;
  },

  getAchievements(): Achievement[] {
    return ensureDbFileExists().achievements;
  },

  unlockAchievement(id: string): Achievement | null {
    const current = ensureDbFileExists();
    const ach = current.achievements.find(a => a.id === id);
    if (ach && !ach.isUnlocked) {
      ach.isUnlocked = true;
      ach.unlockedAt = new Date().toISOString();
      current.progress.xp = (current.progress.xp || 0) + ach.xpReward;
      writeDbFile(current);
      return ach;
    }
    return null;
  },

  getSavedPhrases(): SavedPhrase[] {
    return ensureDbFileExists().savedPhrases;
  },

  addSavedPhrase(phrase: Omit<SavedPhrase, 'id' | 'savedAt'>): SavedPhrase {
    const current = ensureDbFileExists();
    const existing = current.savedPhrases.find(p => p.kannada.trim() === phrase.kannada.trim());
    if (existing) {
      return existing;
    }
    const newPhrase: SavedPhrase = {
      ...phrase,
      id: `sp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      savedAt: new Date().toISOString()
    };
    current.savedPhrases.unshift(newPhrase);

    // Also add to SRS items so it can be reviewed!
    const srsExists = current.srsItems.find(s => s.kannada.trim() === phrase.kannada.trim());
    if (!srsExists) {
      current.srsItems.push({
        id: `srs-${newPhrase.id}`,
        kannada: newPhrase.kannada,
        transliteration: newPhrase.transliteration,
        english: newPhrase.english,
        intervalDays: 1,
        easeFactor: 2.5,
        repetitions: 0,
        nextReviewDate: new Date().toISOString().split('T')[0],
        state: 'learning'
      });
    }

    current.progress.xp = (current.progress.xp || 0) + 10;
    writeDbFile(current);
    return newPhrase;
  },

  deleteSavedPhrase(id: string): boolean {
    const current = ensureDbFileExists();
    const before = current.savedPhrases.length;
    current.savedPhrases = current.savedPhrases.filter(p => p.id !== id);
    writeDbFile(current);
    return current.savedPhrases.length < before;
  },

  getConversations(): ConversationRecord[] {
    return ensureDbFileExists().conversations;
  },

  saveConversation(convo: { title: string; mode?: string; messages: ChatMessageRecord[] }): ConversationRecord {
    const current = ensureDbFileExists();
    const newConvo: ConversationRecord = {
      id: `convo-${Date.now()}`,
      title: convo.title || 'Kannada Conversation',
      mode: convo.mode || 'conversation',
      timestamp: new Date().toISOString(),
      messages: convo.messages
    };
    current.conversations.unshift(newConvo);
    if (current.conversations.length > 30) {
      current.conversations = current.conversations.slice(0, 30);
    }
    current.progress.xp = (current.progress.xp || 0) + 20;

    // Check first conversation achievement
    const ach = current.achievements.find(a => a.id === 'ach-first-chat');
    if (ach && !ach.isUnlocked) {
      ach.isUnlocked = true;
      ach.unlockedAt = new Date().toISOString();
      current.progress.xp += ach.xpReward;
    }

    writeDbFile(current);
    return newConvo;
  },

  deleteConversation(id: string): boolean {
    const current = ensureDbFileExists();
    const before = current.conversations.length;
    current.conversations = current.conversations.filter(c => c.id !== id);
    writeDbFile(current);
    return current.conversations.length < before;
  },

  // Quests management
  getQuests(): Quest[] {
    const current = ensureDbFileExists();
    const userLevel = current.progress.level || 1;
    // Auto-unlock quests matching level
    current.quests.forEach(q => {
      if (q.requiredLevel <= userLevel) {
        q.isUnlocked = true;
      }
    });
    return current.quests;
  },

  advanceQuest(questId: string, stepsToAdd: number = 1): Quest | null {
    const current = ensureDbFileExists();
    const quest = current.quests.find(q => q.id === questId);
    if (!quest) return null;

    quest.currentSteps = Math.min(quest.totalSteps, quest.currentSteps + stepsToAdd);
    if (quest.currentSteps >= quest.totalSteps) {
      quest.isCompleted = true;
    }
    writeDbFile(current);
    return quest;
  },

  claimQuest(questId: string): { success: boolean; xpEarned: number; quest: Quest | null } {
    const current = ensureDbFileExists();
    const quest = current.quests.find(q => q.id === questId);
    if (!quest || !quest.isCompleted) {
      return { success: false, xpEarned: 0, quest: null };
    }

    const xpEarned = quest.xpReward;
    current.progress.xp = (current.progress.xp || 0) + xpEarned;
    current.progress.level = calculateLevel(current.progress.xp);
    current.userProfile.xp = current.progress.xp;
    current.userProfile.level = current.progress.level;

    // Reset quest step for repeatable daily quests or mark as claimed
    if (quest.category === 'daily') {
      quest.currentSteps = 0;
      quest.isCompleted = false;
    }

    writeDbFile(current);
    return { success: true, xpEarned, quest };
  },

  // Personal Mistake Coach
  getMistakes(): MistakeRecord[] {
    return ensureDbFileExists().mistakes || [];
  },

  recordMistake(data: {
    targetKannada: string;
    targetTransliteration: string;
    targetEnglish: string;
    recognizedText: string;
    errorType: 'pronunciation' | 'missing_word' | 'word_order' | 'spelling';
    errorWord: string;
    diffTokens?: Array<{ text: string; type: 'correct' | 'missing' | 'unexpected' }>;
    explanation: string;
  }): MistakeRecord {
    const current = ensureDbFileExists();
    const existing = current.mistakes.find(
      m => m.targetKannada.trim() === data.targetKannada.trim()
    );

    if (existing) {
      existing.attemptCount += 1;
      existing.lastAttemptDate = new Date().toISOString();
      existing.recognizedText = data.recognizedText;
      existing.diffTokens = data.diffTokens;
      writeDbFile(current);
      return existing;
    }

    const newMistake: MistakeRecord = {
      ...data,
      id: `mistake-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      attemptCount: 1,
      lastAttemptDate: new Date().toISOString()
    };

    current.mistakes.unshift(newMistake);
    if (current.mistakes.length > 50) {
      current.mistakes = current.mistakes.slice(0, 50);
    }

    writeDbFile(current);
    return newMistake;
  },

  deleteMistake(id: string): boolean {
    const current = ensureDbFileExists();
    const before = current.mistakes.length;
    current.mistakes = current.mistakes.filter(m => m.id !== id);
    writeDbFile(current);
    return current.mistakes.length < before;
  },

  clearMistakes(): void {
    const current = ensureDbFileExists();
    current.mistakes = [];
    writeDbFile(current);
  },

  // AI Personal Learning Brain
  getLearningBrainAnalysis(): LearningBrainAnalysis {
    const current = ensureDbFileExists();
    const history = current.progress.practiceHistory || [];
    const totalPracticed = current.progress.totalPracticed || history.length;
    const completedLessons = current.progress.completedLessonIds || [];
    const mistakes = current.mistakes || [];

    // Calculate real average match ratio
    let accuracyRate = 88;
    if (history.length > 0) {
      const sum = history.reduce((acc, h) => acc + (h.matchRatio || 0), 0);
      accuracyRate = Math.round((sum / history.length) * 100);
    }

    // Mastery score based on completed modules, practice count, and accuracy
    const lessonScore = Math.min(40, (completedLessons.length / 6) * 40);
    const practiceScore = Math.min(30, (totalPracticed / 10) * 30);
    const accuracyScore = Math.round((accuracyRate / 100) * 30);
    const masteryScore = Math.min(100, Math.round(lessonScore + practiceScore + accuracyScore));

    // Recurrent mistakes
    const recurrentMistakes: Array<{ word: string; count: number; category: string }> = [];
    mistakes.slice(0, 5).forEach(m => {
      recurrentMistakes.push({
        word: m.errorWord || m.targetKannada,
        count: m.attemptCount,
        category: m.errorType
      });
    });

    // Dynamic explainable recommendations
    const recommendations: LearningBrainAnalysis['recommendations'] = [];

    if (mistakes.length > 0) {
      const topMistake = mistakes[0];
      recommendations.push({
        id: 'rec-mistake-coach',
        title: `Pronunciation Drill: "${topMistake.targetKannada}"`,
        titleKannada: 'ಉಚ್ಚಾರಣೆ ತಿದ್ದುಪಡಿ ಅಭ್ಯಾಸ',
        reason: `Targeted because you had difficulty with "${topMistake.errorWord || topMistake.targetKannada}" (${topMistake.attemptCount} attempt${topMistake.attemptCount > 1 ? 's' : ''}).`,
        priority: 'high',
        targetTab: 'mistakes'
      });
    }

    if (completedLessons.length === 0) {
      recommendations.push({
        id: 'rec-start-basics',
        title: 'Master Essential Kannada Greetings',
        titleKannada: 'ಮೂಲ ಪರಿಚಯ ಮತ್ತು ಶುಭಾಶಯಗಳು',
        reason: 'Recommended because you have not completed Module 1 (Basics & Greetings) yet.',
        priority: 'high',
        targetTab: 'learning'
      });
    } else if (completedLessons.length < 3) {
      recommendations.push({
        id: 'rec-expand-vocab',
        title: 'Bengaluru Commute & Travel Phrases',
        titleKannada: 'ಪ್ರಯಾಣ ಮತ್ತು ಸಂಚಾರ ಮಾತುಗಳು',
        reason: 'Recommended to expand practical conversation for Namma Metro and BMTC transit.',
        priority: 'medium',
        targetTab: 'learning'
      });
    }

    recommendations.push({
      id: 'rec-speaking-streak',
      title: 'Daily Speaking Challenge',
      titleKannada: 'ದೈನಂದಿನ ಮಾತುಗಾರಿಕೆ',
      reason: `You have a ${current.progress.streakDays}-day streak! Practice speaking 1 phrase to extend your momentum.`,
      priority: 'normal',
      targetTab: 'practice'
    });

    recommendations.push({
      id: 'rec-culture-dialect',
      title: 'Explore Regional Dialects',
      titleKannada: 'ಪ್ರಾದೇಶಿಕ ಉಪಭಾಷೆಗಳ ಪರಿಚಯ',
      reason: 'Deepen cultural comprehension by comparing Mysuru and Hubballi-Dharwad dialects.',
      priority: 'normal',
      targetTab: 'culture'
    });

    return {
      masteryScore,
      weeklyActivityCount: history.length + completedLessons.length,
      totalVocabularyLearned: (current.savedPhrases?.length || 0) + (current.srsItems?.length || 0),
      accuracyRate,
      streakDays: current.progress.streakDays || 1,
      recurrentMistakes,
      recommendations: recommendations.slice(0, 3),
      learningSummary: `Your Kannada learning profile is currently Level ${current.progress.level} with ${current.progress.xp} XP. Accuracy rate is ${accuracyRate}%.`
    };
  },

  resetLearningBrainData(): void {
    const current = ensureDbFileExists();
    current.progress.practiceHistory = [];
    current.progress.totalPracticed = 0;
    current.mistakes = [];
    writeDbFile(current);
  },

  resetAll(): void {
    writeDbFile(DEFAULT_DB);
  }
};

