import {
  Lesson,
  SavedPhrase,
  Conversation,
  UserProgress,
  PublicConfig,
  AssistantMode,
  UserProfile,
  SRSItem,
  SentenceBuilderExercise,
  ListeningExercise,
  ScriptCharacter,
  RolePlayScenario,
  Achievement,
  ExplanationLanguage,
  VisionAnalysisResult,
  CultureArticle,
  Quest,
  MistakeRecord,
  LearningBrainAnalysis
} from '../types';

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 30000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (err: any) {
    clearTimeout(id);
    if (err.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs / 1000} seconds`);
    }
    throw err;
  }
}

export const api = {
  async getHealth() {
    const res = await fetchWithTimeout('/health', {}, 5000);
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  },

  async getPublicConfig(): Promise<PublicConfig> {
    const res = await fetchWithTimeout('/api/config/public', {}, 5000);
    if (!res.ok) throw new Error('Failed to fetch public configuration');
    return res.json();
  },

  async sendChatMessage(
    message: string,
    history: Array<{ role: 'user' | 'model'; text: string }> = [],
    mode: AssistantMode = 'conversation',
    explanationLanguage: ExplanationLanguage = 'english',
    responseLength: 'concise' | 'detailed' = 'detailed'
  ) {
    try {
      const res = await fetchWithTimeout('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history, mode, explanationLanguage, responseLength })
      }, 20000);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned ${res.status}`);
      }
      return await res.json();
    } catch (err: any) {
      console.warn('Chat request failed or timed out, returning fallback:', err);
      const lower = message.toLowerCase();
      if (lower.includes('namaskara') || lower.includes('ನಮಸ್ಕಾರ') || lower.includes('hello')) {
        return {
          kannada: 'ನಮಸ್ಕಾರ! ಕನ್ನಡದ ಧ್ವನಿ ಸಹಾಯಕಕ್ಕೆ ಸುಸ್ವಾಗತ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?',
          transliteration: 'Namaskāra! Kannada dhvani sahāyakakke susvāgata. Nānu nimage hēge sahāya māḍali?',
          english: 'Hello! Welcome to Voice of Kannada assistant. How can I help you today?',
          grammarNotes: '"ಸುಸ್ವಾಗತ" (susvāgata) means welcome. "ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ" means "how shall I help".',
          suggestedReplies: [
            'ಕನ್ನಡ ಕಲಿಯಲು ಸಹಾಯ ಮಾಡಿ (Help me learn Kannada)',
            'ನೀವು ಹೇಗಿದ್ದೀರಿ? (How are you?)',
            'ಬೆಂಗಳೂರಿನ ಬಗ್ಗೆ ಹೇಳಿ (Tell me about Bengaluru)'
          ]
        };
      }
      return {
        kannada: 'ಖಂಡಿತ! ಕನ್ನಡ ಸಂಭಾಷಣೆ ಮತ್ತು ಕಲಿಕೆಯಲ್ಲಿ ನಾನು ನಿಮ್ಮೊಂದಿಗೆ ಇದ್ದೇನೆ. ನೀವು ಏನು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?',
        transliteration: 'Khaṇḍita! Kannaḍa sambhāṣaṇe mattu kalikeyalli nānu nimmondige iddēne. Nīvu ēnu tiḷiyalu bayasuttīri?',
        english: 'Certainly! I am here with you for Kannada conversation and learning. What would you like to know?',
        grammarNotes: 'Tip: You can practice speaking in Kannada using Push-to-Talk or Continuous voice.',
        suggestedReplies: [
          'ದಿನನಿತ್ಯದ ಮಾತುಗಳನ್ನು ಹೇಳಿಕೊಡಿ (Daily phrases)',
          'ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಹೇಗೆ ಮಾತನಾಡುವುದು? (Market conversation)',
          'ನನ್ನ ಉಚ್ಚಾರಣೆ ಪರೀಕ್ಷಿಸಿ (Check pronunciation)'
        ]
      };
    }
  },

  async summarizeChat(messages: any[]) {
    const res = await fetchWithTimeout('/api/chat/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages })
    }, 30000);

    if (!res.ok) throw new Error('Chat summarization failed');
    return res.json();
  },

  async transcribeAudio(audioBase64: string, mimeType: string = 'audio/webm') {
    const res = await fetchWithTimeout('/api/speech/transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioBase64, mimeType })
    }, 45000);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Transcription failed');
    }
    return res.json();
  },

  async synthesizeSpeech(text: string, voiceName: string = 'Kore') {
    const res = await fetchWithTimeout('/api/speech/synthesize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voiceName })
    }, 30000);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Speech synthesis failed');
    }
    return res.json();
  },

  async getUserProfile(): Promise<UserProfile> {
    const res = await fetchWithTimeout('/api/user-profile', {}, 10000);
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
  },

  async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetchWithTimeout('/api/user-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    }, 10000);
    if (!res.ok) throw new Error('Failed to update user profile');
    return res.json();
  },

  async getSRSItems(): Promise<SRSItem[]> {
    const res = await fetchWithTimeout('/api/srs/items', {}, 10000);
    if (!res.ok) throw new Error('Failed to fetch SRS items');
    return res.json();
  },

  async reviewSRSItem(id: string, rating: 1 | 2 | 3 | 4): Promise<SRSItem> {
    const res = await fetchWithTimeout('/api/srs/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, rating })
    }, 10000);
    if (!res.ok) throw new Error('Failed to review SRS item');
    return res.json();
  },

  async getSentenceBuilderExercises(): Promise<SentenceBuilderExercise[]> {
    const res = await fetchWithTimeout('/api/exercises/sentence-builder', {}, 10000);
    if (!res.ok) throw new Error('Failed to fetch sentence builder exercises');
    return res.json();
  },

  async getListeningExercises(): Promise<ListeningExercise[]> {
    const res = await fetchWithTimeout('/api/exercises/listening', {}, 10000);
    if (!res.ok) throw new Error('Failed to fetch listening exercises');
    return res.json();
  },

  async getScriptCharacters(): Promise<ScriptCharacter[]> {
    const res = await fetchWithTimeout('/api/exercises/characters', {}, 10000);
    if (!res.ok) throw new Error('Failed to fetch script characters');
    return res.json();
  },

  async getRoleplayScenarios(): Promise<RolePlayScenario[]> {
    const res = await fetchWithTimeout('/api/roleplay/scenarios', {}, 10000);
    if (!res.ok) throw new Error('Failed to fetch roleplay scenarios');
    return res.json();
  },

  async sendRoleplayMessage(scenarioId: string, message: string, history: any[] = []) {
    const res = await fetchWithTimeout('/api/roleplay/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenarioId, message, history })
    }, 45000);
    if (!res.ok) throw new Error('Failed to send roleplay message');
    return res.json();
  },

  async getAchievements(): Promise<Achievement[]> {
    const res = await fetchWithTimeout('/api/achievements', {}, 10000);
    if (!res.ok) throw new Error('Failed to fetch achievements');
    return res.json();
  },

  async unlockAchievement(id: string): Promise<{ success: boolean; achievement: Achievement | null }> {
    const res = await fetchWithTimeout('/api/achievements/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    }, 10000);
    if (!res.ok) throw new Error('Failed to unlock achievement');
    return res.json();
  },

  async getLessons(): Promise<Lesson[]> {
    const res = await fetchWithTimeout('/api/lessons', {}, 10000);
    if (!res.ok) throw new Error('Failed to fetch lessons');
    return res.json();
  },

  async getLesson(id: string): Promise<Lesson> {
    const res = await fetchWithTimeout(`/api/lessons/${id}`, {}, 10000);
    if (!res.ok) throw new Error('Failed to fetch lesson detail');
    return res.json();
  },

  async getProgress(): Promise<UserProgress> {
    const res = await fetchWithTimeout('/api/progress', {}, 10000);
    if (!res.ok) throw new Error('Failed to fetch progress');
    return res.json();
  },

  async toggleLessonComplete(lessonId: string) {
    const res = await fetchWithTimeout('/api/progress/lesson', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId })
    }, 10000);
    if (!res.ok) throw new Error('Failed to toggle lesson');
    return res.json();
  },

  async extendStreak(): Promise<{ streakDays: number; lastActiveDate: string }> {
    const res = await fetchWithTimeout('/api/progress/streak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, 10000);
    if (!res.ok) throw new Error('Failed to extend streak');
    return res.json();
  },

  async addXP(amount: number, reason?: string): Promise<{ xp: number; level: number; unlockedAchievements: Achievement[] }> {
    const res = await fetchWithTimeout('/api/progress/xp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, reason })
    }, 10000);
    if (!res.ok) throw new Error('Failed to add XP');
    return res.json();
  },

  async recordPracticeAttempt(data: {
    phraseId: string;
    targetText: string;
    recognizedText: string;
    matchRatio: number;
    matchedWords: string[];
    missingWords: string[];
    feedback: string;
  }) {
    const res = await fetchWithTimeout('/api/progress/practice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }, 10000);
    if (!res.ok) throw new Error('Failed to record practice');
    return res.json();
  },

  async getSavedPhrases(): Promise<SavedPhrase[]> {
    const res = await fetchWithTimeout('/api/saved-phrases', {}, 10000);
    if (!res.ok) throw new Error('Failed to fetch saved phrases');
    return res.json();
  },

  async savePhrase(phrase: {
    kannada: string;
    transliteration: string;
    english: string;
    category?: string;
    notes?: string;
  }): Promise<SavedPhrase> {
    const res = await fetchWithTimeout('/api/saved-phrases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(phrase)
    }, 10000);
    if (!res.ok) throw new Error('Failed to save phrase');
    return res.json();
  },

  async deleteSavedPhrase(id: string): Promise<boolean> {
    const res = await fetchWithTimeout(`/api/saved-phrases/${id}`, {
      method: 'DELETE'
    }, 10000);
    if (!res.ok) throw new Error('Failed to delete phrase');
    const data = await res.json();
    return data.success;
  },

  async getConversations(): Promise<Conversation[]> {
    const res = await fetchWithTimeout('/api/conversations', {}, 10000);
    if (!res.ok) throw new Error('Failed to fetch conversations');
    return res.json();
  },

  async saveConversation(convo: { title: string; mode?: string; messages: any[] }): Promise<Conversation> {
    const res = await fetchWithTimeout('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(convo)
    }, 10000);
    if (!res.ok) throw new Error('Failed to save conversation');
    return res.json();
  },

  async deleteConversation(id: string): Promise<boolean> {
    const res = await fetchWithTimeout(`/api/conversations/${id}`, {
      method: 'DELETE'
    }, 10000);
    if (!res.ok) throw new Error('Failed to delete conversation');
    const data = await res.json();
    return data.success;
  },

  async resetData(): Promise<boolean> {
    const res = await fetchWithTimeout('/api/reset', {
      method: 'POST'
    }, 10000);
    if (!res.ok) throw new Error('Failed to reset data');
    const data = await res.json();
    return data.success;
  },

  // Visual Intelligence
  async analyzeImage(image: string, mimeType: string = 'image/jpeg'): Promise<VisionAnalysisResult> {
    const res = await fetchWithTimeout('/api/vision/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image, mimeType })
    }, 25000);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Vision analysis failed');
    }
    return res.json();
  },

  // Two-Way Translator
  async translate(text: string, sourceLang: string = 'kn-IN', targetLang: string = 'en-US'): Promise<{ translatedText: string; transliteration?: string }> {
    const res = await fetchWithTimeout('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, sourceLang, targetLang })
    }, 15000);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Translation failed');
    }
    return res.json();
  },

  // Culture Library
  async getCultureArticles(): Promise<CultureArticle[]> {
    const res = await fetchWithTimeout('/api/culture/articles', {}, 10000);
    if (!res.ok) throw new Error('Failed to fetch culture articles');
    return res.json();
  },

  // Quests
  async getQuests(): Promise<Quest[]> {
    const res = await fetchWithTimeout('/api/quests', {}, 10000);
    if (!res.ok) throw new Error('Failed to fetch quests');
    return res.json();
  },

  async advanceQuest(questId: string, steps: number = 1): Promise<Quest> {
    const res = await fetchWithTimeout('/api/quests/advance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questId, steps })
    }, 10000);
    if (!res.ok) throw new Error('Failed to advance quest');
    return res.json();
  },

  async claimQuest(questId: string): Promise<{ quest: Quest; xpEarned: number }> {
    const res = await fetchWithTimeout('/api/quests/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questId })
    }, 10000);
    if (!res.ok) throw new Error('Failed to claim quest');
    return res.json();
  },

  // Mistake Coach
  async getMistakes(): Promise<MistakeRecord[]> {
    const res = await fetchWithTimeout('/api/mistakes', {}, 10000);
    if (!res.ok) throw new Error('Failed to fetch mistakes');
    return res.json();
  },

  async recordMistake(mistake: Partial<MistakeRecord>): Promise<MistakeRecord> {
    const res = await fetchWithTimeout('/api/mistakes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mistake)
    }, 10000);
    if (!res.ok) throw new Error('Failed to record mistake');
    return res.json();
  },

  async deleteMistake(id: string): Promise<boolean> {
    const res = await fetchWithTimeout(`/api/mistakes/${id}`, {
      method: 'DELETE'
    }, 10000);
    if (!res.ok) throw new Error('Failed to delete mistake');
    const data = await res.json();
    return data.success;
  },

  async clearMistakes(): Promise<boolean> {
    const res = await fetchWithTimeout('/api/mistakes/clear', {
      method: 'POST'
    }, 10000);
    if (!res.ok) throw new Error('Failed to clear mistakes');
    const data = await res.json();
    return data.success;
  },

  // Learning Brain
  async getLearningBrainAnalysis(): Promise<LearningBrainAnalysis> {
    const res = await fetchWithTimeout('/api/learning-brain/analysis', {}, 10000);
    if (!res.ok) throw new Error('Failed to fetch learning brain analysis');
    return res.json();
  },

  async resetLearningBrain(): Promise<boolean> {
    const res = await fetchWithTimeout('/api/learning-brain/reset', {
      method: 'POST'
    }, 10000);
    if (!res.ok) throw new Error('Failed to reset learning brain data');
    const data = await res.json();
    return data.success;
  }
};
