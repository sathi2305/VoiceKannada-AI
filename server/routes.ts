import { Router, Request, Response } from 'express';
import { KANNADA_LESSONS } from './data/lessons.js';
import {
  SENTENCE_BUILDER_EXERCISES,
  LISTENING_EXERCISES,
  SCRIPT_CHARACTERS,
  ROLEPLAY_SCENARIOS
} from './data/exercises.js';
import { db } from './db.js';
import {
  generateKannadaAssistantResponse,
  transcribeKannadaAudio,
  synthesizeKannadaSpeech,
  summarizeConversation,
  analyzeImageWithVision,
  translateText,
  isGeminiConfigured
} from './gemini.js';
import { KANNADA_CULTURE_ARTICLES } from './data/culture.js';

export const apiRouter = Router();

// Health endpoint
apiRouter.get('/health', (_req: Request, res: Response) => {
  const geminiReady = isGeminiConfigured();
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    geminiConfigured: geminiReady,
    features: {
      aiAssistant: true,
      speechRecognition: true,
      speechSynthesis: true,
      learningStudio: true,
      speakingPractice: true,
      sentenceBuilder: true,
      listeningComprehension: true,
      rolePlaySimulator: true,
      spacedRepetition: true,
      scriptPractice: true,
      persistentStorage: true
    }
  });
});

// Safe public configuration
apiRouter.get('/api/config/public', (_req: Request, res: Response) => {
  res.json({
    appName: 'Voice of Kannada',
    version: '2.0.0',
    geminiConfigured: isGeminiConfigured(),
    defaultAiModel: 'gemini-3.8-flash',
    ttsModel: 'gemini-3.8-flash-lite-tts',
    locale: 'kn-IN',
    speechRecognitionOptions: ['browser_web_speech', 'gemini_multimodal_audio'],
    speechSynthesisOptions: ['browser_speech_synthesis', 'gemini_tts'],
    sampleRate: 24000
  });
});

// Chat endpoint supporting all 8 assistant modes
apiRouter.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, mode, explanationLanguage, responseLength } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required and must be non-empty.' });
    }

    const structuredResponse = await generateKannadaAssistantResponse(
      message.trim(),
      Array.isArray(history) ? history : [],
      mode || 'conversation',
      explanationLanguage || 'english',
      responseLength || 'detailed'
    );

    // Award XP for conversing in Kannada
    db.addXP(10, 'Voice chat interaction');

    return res.json(structuredResponse);
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({
      error: 'Failed to generate assistant response.',
      details: error?.message || 'Unknown error'
    });
  }
});

// Summarize conversation endpoint
apiRouter.post('/api/chat/summarize', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages array is required' });
    }
    const summary = await summarizeConversation(messages);
    return res.json(summary);
  } catch (error: any) {
    return res.status(500).json({ error: 'Summarization failed', details: error?.message });
  }
});

// Audio transcription endpoint
apiRouter.post('/api/speech/transcribe', async (req: Request, res: Response) => {
  try {
    const { audioBase64, mimeType } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'audioBase64 is required.' });
    }
    const result = await transcribeKannadaAudio(audioBase64, mimeType || 'audio/webm');
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: 'Audio transcription failed.', details: error?.message });
  }
});

// Speech synthesis endpoint
apiRouter.post('/api/speech/synthesize', async (req: Request, res: Response) => {
  try {
    const { text, voiceName } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'text is required.' });
    }
    const result = await synthesizeKannadaSpeech(text, voiceName || 'Kore');
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: 'Speech synthesis failed.', details: error?.message });
  }
});

// User Profile / Onboarding endpoints
apiRouter.get('/api/user-profile', (_req: Request, res: Response) => {
  res.json(db.getUserProfile());
});

apiRouter.post('/api/user-profile', (req: Request, res: Response) => {
  const updated = db.updateUserProfile(req.body);
  res.json(updated);
});

// Spaced Repetition SRS endpoints
apiRouter.get('/api/srs/items', (_req: Request, res: Response) => {
  res.json(db.getSRSItems());
});

apiRouter.post('/api/srs/review', (req: Request, res: Response) => {
  const { id, rating } = req.body;
  if (!id || typeof rating !== 'number' || rating < 1 || rating > 4) {
    return res.status(400).json({ error: 'id and rating (1-4) are required' });
  }
  const updated = db.reviewSRSItem(id, rating as 1 | 2 | 3 | 4);
  res.json(updated);
});

// Sentence Builder exercises
apiRouter.get('/api/exercises/sentence-builder', (_req: Request, res: Response) => {
  res.json(SENTENCE_BUILDER_EXERCISES);
});

// Listening Comprehension exercises
apiRouter.get('/api/exercises/listening', (_req: Request, res: Response) => {
  res.json(LISTENING_EXERCISES);
});

// Script / Alphabet characters
apiRouter.get('/api/exercises/characters', (_req: Request, res: Response) => {
  res.json(SCRIPT_CHARACTERS);
});

// Role-Play scenarios
apiRouter.get('/api/roleplay/scenarios', (_req: Request, res: Response) => {
  res.json(ROLEPLAY_SCENARIOS);
});

apiRouter.post('/api/roleplay/chat', async (req: Request, res: Response) => {
  try {
    const { scenarioId, message, history } = req.body;
    const scenario = ROLEPLAY_SCENARIOS.find(s => s.id === scenarioId) || ROLEPLAY_SCENARIOS[0];

    const promptMessage = `[Scenario: ${scenario.title} at ${scenario.location}. You are playing: ${scenario.roleAI}. The learner is: ${scenario.roleUser}. Objective: ${scenario.objective}]\nLearner said: "${message}"`;

    const result = await generateKannadaAssistantResponse(
      promptMessage,
      Array.isArray(history) ? history : [],
      'roleplay'
    );

    db.addXP(15, 'Roleplay interaction');
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: 'Roleplay chat failed', details: err?.message });
  }
});

// Achievements
apiRouter.get('/api/achievements', (_req: Request, res: Response) => {
  res.json(db.getAchievements());
});

apiRouter.post('/api/achievements/unlock', (req: Request, res: Response) => {
  const { id } = req.body;
  const unlocked = db.unlockAchievement(id);
  res.json({ success: Boolean(unlocked), achievement: unlocked });
});

// Lessons list
apiRouter.get('/api/lessons', (_req: Request, res: Response) => {
  const progress = db.getProgress();
  const completedIds = new Set(progress.completedLessonIds || []);

  const lessonsOverview = KANNADA_LESSONS.map(l => ({
    id: l.id,
    titleKannada: l.titleKannada,
    titleEnglish: l.titleEnglish,
    category: l.category,
    difficulty: l.difficulty,
    description: l.description,
    durationMinutes: l.durationMinutes,
    phrasesCount: l.phrasesCount,
    objective: l.objective,
    pronunciationTips: l.pronunciationTips,
    examplesCount: l.examples?.length || 0,
    quizCount: l.quiz?.length || 0,
    hasExercise: Boolean(l.interactiveExercise),
    isCompleted: completedIds.has(l.id)
  }));

  res.json(lessonsOverview);
});

// Lesson detail
apiRouter.get('/api/lessons/:id', (req: Request, res: Response) => {
  const lesson = KANNADA_LESSONS.find(l => l.id === req.params.id);
  if (!lesson) {
    return res.status(404).json({ error: 'Lesson not found' });
  }

  const progress = db.getProgress();
  const isCompleted = (progress.completedLessonIds || []).includes(lesson.id);

  return res.json({
    ...lesson,
    isCompleted
  });
});

// Progress data with XP and level
apiRouter.get('/api/progress', (_req: Request, res: Response) => {
  const progress = db.getProgress();
  const totalLessons = KANNADA_LESSONS.length;
  const completedCount = progress.completedLessonIds.length;
  const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  res.json({
    ...progress,
    totalLessons,
    completedCount,
    completionPercentage: percentage
  });
});

// Toggle lesson completion
apiRouter.post('/api/progress/lesson', (req: Request, res: Response) => {
  const { lessonId } = req.body;
  if (!lessonId) {
    return res.status(400).json({ error: 'lessonId is required' });
  }
  const result = db.toggleCompleteLesson(lessonId);
  return res.json(result);
});

// Extend learning streak
apiRouter.post('/api/progress/streak', (_req: Request, res: Response) => {
  const result = db.extendStreak();
  return res.json(result);
});

// Award XP
apiRouter.post('/api/progress/xp', (req: Request, res: Response) => {
  const { amount, reason } = req.body;
  const numAmount = typeof amount === 'number' ? amount : 10;
  const result = db.addXP(numAmount, reason);
  return res.json(result);
});

// Record practice attempt
apiRouter.post('/api/progress/practice', (req: Request, res: Response) => {
  const {
    phraseId,
    targetText,
    recognizedText,
    matchRatio,
    matchedWords,
    missingWords,
    feedback
  } = req.body;

  if (!targetText) {
    return res.status(400).json({ error: 'targetText is required' });
  }

  const record = db.recordPractice({
    phraseId: phraseId || 'custom',
    targetText,
    recognizedText: recognizedText || '',
    matchRatio: typeof matchRatio === 'number' ? matchRatio : 0,
    matchedWords: Array.isArray(matchedWords) ? matchedWords : [],
    missingWords: Array.isArray(missingWords) ? missingWords : [],
    feedback: feedback || ''
  });

  return res.json(record);
});

// Saved phrases
apiRouter.get('/api/saved-phrases', (_req: Request, res: Response) => {
  res.json(db.getSavedPhrases());
});

apiRouter.post('/api/saved-phrases', (req: Request, res: Response) => {
  const { kannada, transliteration, english, category, notes } = req.body;
  if (!kannada || !english) {
    return res.status(400).json({ error: 'kannada and english are required' });
  }
  const saved = db.addSavedPhrase({
    kannada,
    transliteration: transliteration || '',
    english,
    category: category || 'general',
    notes: notes || ''
  });
  return res.json(saved);
});

apiRouter.delete('/api/saved-phrases/:id', (req: Request, res: Response) => {
  const deleted = db.deleteSavedPhrase(req.params.id);
  res.json({ success: deleted });
});

// Conversations
apiRouter.get('/api/conversations', (_req: Request, res: Response) => {
  res.json(db.getConversations());
});

apiRouter.post('/api/conversations', (req: Request, res: Response) => {
  const { title, mode, messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }
  const convo = db.saveConversation({ title: title || 'Kannada Chat', mode, messages });
  return res.json(convo);
});

apiRouter.delete('/api/conversations/:id', (req: Request, res: Response) => {
  const deleted = db.deleteConversation(req.params.id);
  res.json({ success: deleted });
});

// Visual Intelligence OCR & Object Analysis
apiRouter.post('/api/vision/analyze', async (req: Request, res: Response) => {
  try {
    const { image, mimeType } = req.body;
    if (!image || typeof image !== 'string') {
      return res.status(400).json({ error: 'image base64 string is required.' });
    }
    const result = await analyzeImageWithVision(image, mimeType || 'image/jpeg');
    db.addXP(20, 'Visual Intelligence Signboard/Object Analysis');
    return res.json(result);
  } catch (error: any) {
    console.error('Vision analysis endpoint error:', error);
    return res.status(500).json({
      error: 'Vision analysis failed.',
      details: error?.message || 'Unknown error'
    });
  }
});

// Two-Way Translator
apiRouter.post('/api/translate', async (req: Request, res: Response) => {
  try {
    const { text, sourceLang, targetLang } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'text is required.' });
    }
    const result = await translateText(
      text.trim(),
      sourceLang || 'kn-IN',
      targetLang || 'en-US'
    );
    return res.json(result);
  } catch (error: any) {
    console.error('Translate endpoint error:', error);
    return res.status(500).json({
      error: 'Translation failed.',
      details: error?.message || 'Unknown error'
    });
  }
});

// Culture Articles
apiRouter.get('/api/culture/articles', (_req: Request, res: Response) => {
  res.json(KANNADA_CULTURE_ARTICLES);
});

// Quests
apiRouter.get('/api/quests', (_req: Request, res: Response) => {
  res.json(db.getQuests());
});

apiRouter.post('/api/quests/advance', (req: Request, res: Response) => {
  const { questId, steps } = req.body;
  if (!questId) {
    return res.status(400).json({ error: 'questId is required.' });
  }
  const updated = db.advanceQuest(questId, typeof steps === 'number' ? steps : 1);
  if (!updated) {
    return res.status(404).json({ error: 'Quest not found.' });
  }
  return res.json(updated);
});

apiRouter.post('/api/quests/claim', (req: Request, res: Response) => {
  const { questId } = req.body;
  if (!questId) {
    return res.status(400).json({ error: 'questId is required.' });
  }
  const result = db.claimQuest(questId);
  if (!result) {
    return res.status(400).json({ error: 'Quest could not be claimed or is not completed.' });
  }
  return res.json(result);
});

// Mistakes & Mistake Coach
apiRouter.get('/api/mistakes', (_req: Request, res: Response) => {
  res.json(db.getMistakes());
});

apiRouter.post('/api/mistakes', (req: Request, res: Response) => {
  const { targetKannada, targetTransliteration, targetEnglish, recognizedText, errorWord, errorType, explanation } = req.body;
  if (!targetKannada) {
    return res.status(400).json({ error: 'targetKannada is required.' });
  }
  const record = db.recordMistake({
    targetKannada,
    targetTransliteration: targetTransliteration || '',
    targetEnglish: targetEnglish || 'Speaking Practice',
    recognizedText: recognizedText || '',
    errorWord: errorWord || '',
    errorType: errorType || 'pronunciation',
    explanation: explanation || 'Phonetic or word divergence identified during practice.'
  });
  return res.json(record);
});

apiRouter.delete('/api/mistakes/:id', (req: Request, res: Response) => {
  const success = db.deleteMistake(req.params.id);
  res.json({ success });
});

apiRouter.post('/api/mistakes/clear', (_req: Request, res: Response) => {
  db.clearMistakes();
  res.json({ success: true, message: 'All mistake records have been cleared.' });
});

// AI Personal Learning Brain
apiRouter.get('/api/learning-brain/analysis', (_req: Request, res: Response) => {
  res.json(db.getLearningBrainAnalysis());
});

apiRouter.post('/api/learning-brain/reset', (_req: Request, res: Response) => {
  db.resetLearningBrainData();
  res.json({ success: true, message: 'Learning brain activity history and mistakes have been reset.' });
});

// Reset data endpoint
apiRouter.post('/api/reset', (_req: Request, res: Response) => {
  db.resetAll();
  res.json({ success: true, message: 'All local progress, exercises, and conversations have been reset.' });
});
