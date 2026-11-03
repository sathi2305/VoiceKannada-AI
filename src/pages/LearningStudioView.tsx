import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Volume2,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Search,
  Clock,
  ArrowRight,
  Info,
  X,
  ChevronRight,
  HelpCircle,
  MessageSquare,
  Award,
  Layers,
  Check,
  RotateCcw
} from 'lucide-react';
import { Lesson, LessonPhrase, LessonDialogueExample, LessonQuizQuestion } from '../types';
import { api } from '../services/api';

interface LearningStudioViewProps {
  lessons: Lesson[];
  onSpeak: (text: string) => void;
  onLaunchPractice: (targetKannada: string, targetTransliteration: string, targetEnglish: string) => void;
  onToggleCompleteLesson: (lessonId: string) => void;
  onSavePhrase: (phrase: { kannada: string; transliteration: string; english: string; category?: string }) => void;
  savedPhraseKeys: Set<string>;
}

export const LearningStudioView: React.FC<LearningStudioViewProps> = ({
  lessons,
  onSpeak,
  onLaunchPractice,
  onToggleCompleteLesson,
  onSavePhrase,
  savedPhraseKeys
}) => {
  const [selectedLevel, setSelectedLevel] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'phrases' | 'dialogue' | 'exercise' | 'quiz'>('phrases');
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Interactive exercise state
  const [exerciseAnswer, setExerciseAnswer] = useState<string>('');
  const [exerciseResult, setExerciseResult] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedWordOrder, setSelectedWordOrder] = useState<string[]>([]);

  // Count lessons per level
  const beginnerCount = lessons.filter(l => l.difficulty === 'Beginner').length;
  const intermediateCount = lessons.filter(l => l.difficulty === 'Intermediate').length;
  const advancedCount = lessons.filter(l => l.difficulty === 'Advanced').length;

  const categories = [
    { id: 'all', label: 'All Subjects' },
    { id: 'basics', label: 'Basics & Culture' },
    { id: 'daily', label: 'Daily Life' },
    { id: 'travel', label: 'Travel & Navigation' },
    { id: 'shopping', label: 'Market & Shopping' },
    { id: 'food', label: 'Food & Cuisine' },
    { id: 'health', label: 'Health & Medical' },
    { id: 'grammar', label: 'Grammar Mastery' }
  ];

  const filteredLessons = lessons.filter(l => {
    const matchesLevel = selectedLevel === 'All' || l.difficulty === selectedLevel;
    const matchesCategory = selectedCategory === 'all' || l.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      l.titleEnglish.toLowerCase().includes(query) ||
      l.titleKannada.toLowerCase().includes(query) ||
      l.description.toLowerCase().includes(query) ||
      l.objective?.toLowerCase().includes(query);
    return matchesLevel && matchesCategory && matchesSearch;
  });

  const handleOpenLesson = async (lesson: Lesson) => {
    setActiveModalTab('phrases');
    setQuizAnswers({});
    setQuizSubmitted(false);
    setExerciseAnswer('');
    setExerciseResult(null);
    setSelectedWordOrder([]);
    setLoadingDetail(true);

    try {
      const fullLesson = await api.getLesson(lesson.id);
      setActiveLesson(fullLesson || lesson);
    } catch {
      setActiveLesson(lesson);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSelectQuizOption = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const handleCheckExercise = () => {
    if (!activeLesson?.interactiveExercise) return;
    const ex = activeLesson.interactiveExercise;
    if (ex.type === 'fill_in') {
      const isCorrect = exerciseAnswer.trim() === ex.targetText.trim();
      setExerciseResult(isCorrect ? 'correct' : 'incorrect');
    } else if (ex.type === 'word_order') {
      const arranged = selectedWordOrder.join(' ');
      const target = ex.correctOrder ? ex.correctOrder.join(' ') : ex.targetText;
      const isCorrect = arranged === target;
      setExerciseResult(isCorrect ? 'correct' : 'incorrect');
    }
  };

  const handleAddWordToOrder = (word: string) => {
    setSelectedWordOrder(prev => [...prev, word]);
  };

  const handleRemoveWordFromOrder = (index: number) => {
    setSelectedWordOrder(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Studio Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#04111F] via-[#071D32] to-[#04111F] border border-[#00D9FF]/20 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#00E6A0] font-mono font-semibold uppercase">
            <BookOpen className="w-4 h-4" />
            <span>Complete 45-Module Kannada Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-kannada text-[#F1F7FF]">
            ಕನ್ನಡ ಕಲಿಕಾ ಕೇಂದ್ರ <span className="text-[#00D9FF] text-xl font-sans font-semibold">· Learning Studio</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#9BB1C8] max-w-2xl">
            Structured 3-tier master curriculum: 15 Beginner, 15 Intermediate, and 15 Advanced lessons with dialogues, phonetic audio, interactive exercises, and knowledge quizzes.
          </p>
        </div>

        {/* Global Progress Indicator */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#04111F]/80 border border-[#00D9FF]/20 shrink-0">
          <div className="flex flex-col text-right">
            <span className="text-xs font-semibold text-[#9BB1C8]">Completed</span>
            <span className="text-lg font-black font-mono text-[#00E6A0]">
              {lessons.filter(l => l.isCompleted).length} / {lessons.length}
            </span>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-[#00E6A0]/30 flex items-center justify-center font-mono text-xs font-bold text-[#F1F7FF]">
            {Math.round(((lessons.filter(l => l.isCompleted).length || 0) / (lessons.length || 1)) * 100)}%
          </div>
        </div>
      </div>

      {/* Filters Bar: Level Selector & Category Pills */}
      <div className="space-y-3">
        {/* Level Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedLevel('All')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedLevel === 'All'
                ? 'bg-gradient-to-r from-[#00E6A0] to-[#00D9FF] text-[#04111F] shadow-lg shadow-[#00E6A0]/20'
                : 'bg-[#071D32] hover:bg-[#0a2744] text-[#9BB1C8] border border-slate-800'
            }`}
          >
            All Modules ({lessons.length})
          </button>
          <button
            onClick={() => setSelectedLevel('Beginner')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedLevel === 'Beginner'
                ? 'bg-[#00E6A0] text-[#04111F] shadow-lg shadow-[#00E6A0]/20'
                : 'bg-[#071D32] hover:bg-[#0a2744] text-[#9BB1C8] border border-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#00E6A0]" />
            <span>Level 1: Beginner ({beginnerCount})</span>
          </button>
          <button
            onClick={() => setSelectedLevel('Intermediate')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedLevel === 'Intermediate'
                ? 'bg-[#00D9FF] text-[#04111F] shadow-lg shadow-[#00D9FF]/20'
                : 'bg-[#071D32] hover:bg-[#0a2744] text-[#9BB1C8] border border-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#00D9FF]" />
            <span>Level 2: Intermediate ({intermediateCount})</span>
          </button>
          <button
            onClick={() => setSelectedLevel('Advanced')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedLevel === 'Advanced'
                ? 'bg-[#8257FF] text-white shadow-lg shadow-[#8257FF]/30'
                : 'bg-[#071D32] hover:bg-[#0a2744] text-[#9BB1C8] border border-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#8257FF]" />
            <span>Level 3: Advanced ({advancedCount})</span>
          </button>
        </div>

        {/* Categories & Search */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex items-center gap-1 overflow-x-auto pb-1 p-1 bg-[#04111F]/80 rounded-2xl border border-slate-800 text-xs">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#071D32] text-[#00E6A0] border border-[#00E6A0]/30 font-semibold'
                    : 'text-[#9BB1C8] hover:text-[#F1F7FF]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search lessons, vocabulary, topics..."
              className="w-full bg-[#04111F]/90 border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-[#F1F7FF] placeholder-slate-500 focus:outline-none focus:border-[#00D9FF] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Lesson Cards Grid (45 Total Modules) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredLessons.map(lesson => {
          const isDone = lesson.isCompleted;

          const levelBadgeColor =
            lesson.difficulty === 'Beginner'
              ? 'text-[#00E6A0] bg-[#00E6A0]/10 border-[#00E6A0]/30'
              : lesson.difficulty === 'Intermediate'
              ? 'text-[#00D9FF] bg-[#00D9FF]/10 border-[#00D9FF]/30'
              : 'text-[#8257FF] bg-[#8257FF]/15 border-[#8257FF]/30';

          return (
            <div
              key={lesson.id}
              className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between p-5 ${
                isDone
                  ? 'bg-[#071D32]/80 border-[#00E6A0]/40 hover:border-[#00E6A0]/80 shadow-[0_4px_20px_rgba(0,230,160,0.1)]'
                  : 'bg-[#04111F]/90 border-slate-800 hover:border-[#00D9FF]/40'
              }`}
            >
              <div className="space-y-3">
                {/* Meta Header */}
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border ${levelBadgeColor}`}>
                    {lesson.difficulty.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-[#00D9FF]" />
                      {lesson.durationMinutes} min
                    </span>
                    <span>·</span>
                    <span className="uppercase text-[#9BB1C8]">{lesson.category}</span>
                  </div>
                </div>

                {/* Lesson Titles */}
                <div>
                  <h3 className="text-xl font-bold font-kannada text-[#F1F7FF] mb-1 line-clamp-1">
                    {lesson.titleKannada}
                  </h3>
                  <h4 className="text-xs font-semibold text-[#00D9FF] tracking-wide">
                    {lesson.titleEnglish}
                  </h4>
                </div>

                {/* Objective / Description */}
                <p className="text-xs text-[#9BB1C8] line-clamp-2 leading-relaxed">
                  {lesson.objective || lesson.description}
                </p>

                {/* Module Capabilities Indicators */}
                <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] text-[#9BB1C8] border-t border-slate-800">
                  <span className="font-mono text-[#F1F7FF]">
                    {lesson.phrasesCount || lesson.phrases?.length || 6} Phrases
                  </span>
                  <span>·</span>
                  <span className="text-[#00E6A0]">Dialogue</span>
                  <span>·</span>
                  <span className="text-[#00D9FF]">Interactive Quiz</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 flex items-center gap-2">
                <button
                  onClick={() => handleOpenLesson(lesson)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#071D32] hover:bg-[#0c2844] border border-[#00D9FF]/20 hover:border-[#00D9FF]/50 text-[#F1F7FF] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#00E6A0]" />
                  <span>Open Studio</span>
                </button>
                <button
                  onClick={() => onToggleCompleteLesson(lesson.id)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isDone
                      ? 'bg-[#00E6A0]/20 border-[#00E6A0]/50 text-[#00E6A0] hover:bg-[#00E6A0]/30'
                      : 'bg-[#071D32] border-slate-700 text-slate-400 hover:text-white'
                  }`}
                  title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                  aria-label={isDone ? 'Mark as incomplete' : 'Mark as completed'}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-12 rounded-3xl bg-[#04111F]/80 border border-slate-800 space-y-2">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm text-slate-400">No lessons match your search query.</p>
        </div>
      )}

      {/* =========================================================================
          DETAILED TABBED LESSON STUDY MODAL (Curriculum, Dialogues, Exercises, Quiz)
         ========================================================================= */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 bg-[#04111F]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="bg-[#071D32] border border-[#00D9FF]/30 w-full max-w-4xl max-h-[92vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-800 bg-[#04111F]/90 flex items-start justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-[#00E6A0]/20 text-[#00E6A0] border border-[#00E6A0]/40">
                    {activeLesson.difficulty}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-400 font-mono">{activeLesson.durationMinutes} min</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-[#00D9FF] font-medium">{activeLesson.category.toUpperCase()}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-kannada text-[#F1F7FF]">
                  {activeLesson.titleKannada}
                </h2>
                <h3 className="text-sm font-semibold text-[#00D9FF]">
                  {activeLesson.titleEnglish}
                </h3>
                {activeLesson.objective && (
                  <p className="text-xs text-[#9BB1C8] pt-1">
                    <strong className="text-[#F1F7FF]">Objective:</strong> {activeLesson.objective}
                  </p>
                )}
              </div>
              <button
                onClick={() => setActiveLesson(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close lesson studio"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs Navigation */}
            <div className="px-6 py-2.5 bg-[#04111F]/70 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
              <button
                onClick={() => setActiveModalTab('phrases')}
                className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeModalTab === 'phrases'
                    ? 'bg-[#00E6A0]/20 text-[#00E6A0] border border-[#00E6A0]/40'
                    : 'text-[#9BB1C8] hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Vocabulary & Phrases ({activeLesson.phrases?.length || 0})</span>
              </button>
              <button
                onClick={() => setActiveModalTab('dialogue')}
                className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeModalTab === 'dialogue'
                    ? 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40'
                    : 'text-[#9BB1C8] hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Practical Dialogue ({activeLesson.examples?.length || 1})</span>
              </button>
              <button
                onClick={() => setActiveModalTab('exercise')}
                className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeModalTab === 'exercise'
                    ? 'bg-[#8257FF]/20 text-[#8257FF] border border-[#8257FF]/40'
                    : 'text-[#9BB1C8] hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Exercise</span>
              </button>
              <button
                onClick={() => setActiveModalTab('quiz')}
                className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeModalTab === 'quiz'
                    ? 'bg-[#00E6A0]/20 text-[#00E6A0] border border-[#00E6A0]/40'
                    : 'text-[#9BB1C8] hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Knowledge Quiz ({activeLesson.quiz?.length || 2} Qs)</span>
              </button>
            </div>

            {/* Cultural Note & Pronunciation Tips Banner */}
            {activeLesson.culturalNote && activeModalTab === 'phrases' && (
              <div className="px-6 py-2.5 bg-[#00E6A0]/10 border-b border-[#00E6A0]/20 text-xs text-[#00E6A0] flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#00E6A0]" />
                <p>
                  <strong>Cultural Note:</strong> {activeLesson.culturalNote}
                </p>
              </div>
            )}

            {activeLesson.pronunciationTips && activeModalTab === 'phrases' && (
              <div className="px-6 py-2 bg-[#00D9FF]/10 border-b border-[#00D9FF]/20 text-xs text-[#00D9FF] flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#00D9FF]" />
                <p>
                  <strong>Pronunciation Tip:</strong> {activeLesson.pronunciationTips}
                </p>
              </div>
            )}

            {/* Tab 1: Phrases List */}
            {activeModalTab === 'phrases' && (
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                {activeLesson.phrases?.map((phrase: LessonPhrase) => {
                  const isSaved = savedPhraseKeys.has(phrase.kannada.trim());

                  return (
                    <div
                      key={phrase.id}
                      className="p-5 rounded-2xl bg-[#04111F]/80 border border-slate-800 hover:border-[#00D9FF]/40 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          {/* Kannada Script */}
                          <p className="text-2xl font-bold font-kannada text-[#F1F7FF] tracking-wide">
                            {phrase.kannada}
                          </p>
                          {/* Transliteration */}
                          <p className="text-xs text-[#00E6A0] font-mono font-medium">
                            {phrase.transliteration}
                          </p>
                          {/* English Meaning */}
                          <p className="text-sm text-[#F1F7FF] font-medium">
                            {phrase.english}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => onSpeak(phrase.kannada)}
                            className="p-2 rounded-xl bg-[#071D32] hover:bg-[#0c2844] text-[#00E6A0] border border-slate-800 hover:border-[#00E6A0]/40 transition-colors cursor-pointer"
                            title="Hear pronunciation in Kannada"
                            aria-label={`Listen to ${phrase.kannada}`}
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setActiveLesson(null);
                              onLaunchPractice(phrase.kannada, phrase.transliteration, phrase.english);
                            }}
                            className="p-2 rounded-xl bg-[#071D32] hover:bg-[#0c2844] text-[#00D9FF] border border-slate-800 hover:border-[#00D9FF]/40 transition-colors cursor-pointer"
                            title="Practice speaking in Speech Lab"
                            aria-label={`Practice speaking ${phrase.kannada}`}
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              onSavePhrase({
                                kannada: phrase.kannada,
                                transliteration: phrase.transliteration,
                                english: phrase.english,
                                category: activeLesson.category
                              })
                            }
                            className="p-2 rounded-xl bg-[#071D32] hover:bg-[#0c2844] text-slate-300 border border-slate-800 transition-colors cursor-pointer"
                            title={isSaved ? 'Saved in Vocabulary' : 'Save to Vocabulary'}
                            aria-label="Save phrase"
                          >
                            {isSaved ? (
                              <BookmarkCheck className="w-4 h-4 text-[#00E6A0]" />
                            ) : (
                              <Bookmark className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Word-by-Word Breakdown */}
                      {phrase.breakdown && phrase.breakdown.length > 0 && (
                        <div className="pt-2 border-t border-slate-800">
                          <div className="text-[11px] text-[#9BB1C8] mb-1.5">Word-by-Word Breakdown:</div>
                          <div className="flex flex-wrap gap-2">
                            {phrase.breakdown.map((item, bidx) => (
                              <div
                                key={bidx}
                                className="px-2.5 py-1 rounded-lg bg-[#071D32] border border-slate-700/80 text-xs"
                              >
                                <span className="font-kannada font-semibold text-[#00E6A0] mr-1.5">
                                  {item.word}
                                </span>
                                <span className="font-mono text-[11px] text-slate-400 mr-1.5">
                                  ({item.transliteration})
                                </span>
                                <span className="text-[#F1F7FF]">= {item.meaning}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {phrase.context && (
                        <p className="text-xs text-slate-400 italic">
                          Usage Context: {phrase.context}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab 2: Dialogue Examples */}
            {activeModalTab === 'dialogue' && (
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                <div className="text-xs text-[#9BB1C8] mb-2">
                  Read and listen to authentic conversational dialogue back-and-forth exchanges in Kannada:
                </div>
                {activeLesson.examples?.map((ex: LessonDialogueExample, eidx: number) => (
                  <div key={eidx} className="space-y-3 p-4 rounded-2xl bg-[#04111F]/80 border border-slate-800">
                    {/* Speaker A */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#00E6A0]/20 border border-[#00E6A0]/40 flex items-center justify-center font-bold text-xs text-[#00E6A0] shrink-0">
                        A
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-bold font-kannada text-[#F1F7FF]">{ex.speakerA}</p>
                          <button
                            onClick={() => onSpeak(ex.speakerA)}
                            className="p-1 rounded bg-[#071D32] hover:bg-[#0c2844] text-[#00E6A0]"
                            title="Hear Speaker A"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {ex.translitA && <p className="text-xs font-mono text-[#00E6A0]">{ex.translitA}</p>}
                        <p className="text-xs text-slate-300">{ex.englishA}</p>
                      </div>
                    </div>

                    {/* Speaker B */}
                    <div className="flex items-start gap-3 pl-6 border-l-2 border-[#00D9FF]/40">
                      <div className="w-8 h-8 rounded-full bg-[#00D9FF]/20 border border-[#00D9FF]/40 flex items-center justify-center font-bold text-xs text-[#00D9FF] shrink-0">
                        B
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-bold font-kannada text-[#F1F7FF]">{ex.speakerB}</p>
                          <button
                            onClick={() => onSpeak(ex.speakerB)}
                            className="p-1 rounded bg-[#071D32] hover:bg-[#0c2844] text-[#00D9FF]"
                            title="Hear Speaker B"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {ex.translitB && <p className="text-xs font-mono text-[#00D9FF]">{ex.translitB}</p>}
                        <p className="text-xs text-slate-300">{ex.englishB}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Interactive Practice */}
            {activeModalTab === 'exercise' && (
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
                {activeLesson.interactiveExercise ? (
                  <div className="p-6 rounded-2xl bg-[#04111F]/80 border border-slate-800 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#8257FF]">
                        {activeLesson.interactiveExercise.type === 'word_order' ? 'Sentence Builder' : 'Fill in the Blank'}
                      </span>
                      <h4 className="text-base font-bold text-[#F1F7FF]">
                        {activeLesson.interactiveExercise.prompt}
                      </h4>
                    </div>

                    {/* Fill in type */}
                    {activeLesson.interactiveExercise.type === 'fill_in' && (
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2 pt-2">
                          {activeLesson.interactiveExercise.options?.map((opt, oidx) => (
                            <button
                              key={oidx}
                              onClick={() => {
                                setExerciseAnswer(opt);
                                setExerciseResult(null);
                              }}
                              className={`px-4 py-2 rounded-xl text-sm font-kannada font-bold transition-all cursor-pointer ${
                                exerciseAnswer === opt
                                  ? 'bg-[#00E6A0] text-[#04111F] shadow-lg'
                                  : 'bg-[#071D32] hover:bg-[#0c2844] text-[#F1F7FF] border border-slate-700'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Word order type */}
                    {activeLesson.interactiveExercise.type === 'word_order' && (
                      <div className="space-y-4">
                        <div className="min-h-[50px] p-3 rounded-xl bg-[#071D32] border border-slate-700 flex flex-wrap gap-2 items-center">
                          {selectedWordOrder.length === 0 ? (
                            <span className="text-xs text-slate-500 italic">Click the words below to arrange them here...</span>
                          ) : (
                            selectedWordOrder.map((word, widx) => (
                              <button
                                key={widx}
                                onClick={() => handleRemoveWordFromOrder(widx)}
                                className="px-3 py-1 rounded-lg bg-[#00D9FF]/20 border border-[#00D9FF]/40 text-xs font-kannada font-bold text-[#F1F7FF] hover:bg-rose-950/50 hover:text-rose-300 transition-colors"
                              >
                                {word} ✕
                              </button>
                            ))
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {activeLesson.interactiveExercise.options?.map((opt, oidx) => (
                            <button
                              key={oidx}
                              onClick={() => handleAddWordToOrder(opt)}
                              className="px-3.5 py-1.5 rounded-xl bg-[#071D32] hover:bg-[#0c2844] text-xs font-kannada font-bold text-[#F1F7FF] border border-slate-700 cursor-pointer"
                            >
                              + {opt}
                            </button>
                          ))}
                          {selectedWordOrder.length > 0 && (
                            <button
                              onClick={() => setSelectedWordOrder([])}
                              className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
                            >
                              Reset Order
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Check Result */}
                    <div className="pt-3 flex items-center gap-3">
                      <button
                        onClick={handleCheckExercise}
                        className="px-5 py-2 rounded-xl bg-[#00E6A0] text-[#04111F] font-bold text-xs transition-colors cursor-pointer"
                      >
                        Check Answer
                      </button>

                      {exerciseResult === 'correct' && (
                        <div className="flex items-center gap-2 text-xs font-bold text-[#00E6A0]">
                          <Check className="w-4 h-4" />
                          <span>ಸರಿ! Correct answer!</span>
                        </div>
                      )}
                      {exerciseResult === 'incorrect' && (
                        <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                          <X className="w-4 h-4" />
                          <span>ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ! Try again.</span>
                        </div>
                      )}
                    </div>

                    {exerciseResult && (
                      <p className="text-xs text-slate-400 pt-2 border-t border-slate-800">
                        {activeLesson.interactiveExercise.explanation}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No interactive exercise configured for this module.</p>
                )}
              </div>
            )}

            {/* Tab 4: Knowledge Quiz */}
            {activeModalTab === 'quiz' && (
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                <div className="flex items-center justify-between text-xs text-[#9BB1C8]">
                  <span>Answer the questions to test your Kannada comprehension:</span>
                  {quizSubmitted && (
                    <span className="font-mono font-bold text-[#00E6A0]">
                      Score:{' '}
                      {activeLesson.quiz?.filter((q, idx) => quizAnswers[idx] === q.correctIndex).length} /{' '}
                      {activeLesson.quiz?.length || 0}
                    </span>
                  )}
                </div>

                {activeLesson.quiz?.map((q: LessonQuizQuestion, qidx: number) => {
                  const selected = quizAnswers[qidx];
                  const isAnswered = selected !== undefined;
                  const isCorrect = selected === q.correctIndex;

                  return (
                    <div
                      key={qidx}
                      className="p-5 rounded-2xl bg-[#04111F]/80 border border-slate-800 space-y-3"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-[#00D9FF] font-bold">
                          Question {qidx + 1}
                        </span>
                        <h4 className="text-sm font-bold text-[#F1F7FF]">{q.question}</h4>
                        {q.questionKannada && (
                          <p className="text-sm font-kannada text-[#00E6A0]">{q.questionKannada}</p>
                        )}
                      </div>

                      <div className="space-y-2 pt-1">
                        {q.options.map((opt, oidx) => {
                          let optStyle = 'bg-[#071D32] border-slate-700 text-[#F1F7FF] hover:bg-[#0c2844]';

                          if (quizSubmitted) {
                            if (oidx === q.correctIndex) {
                              optStyle = 'bg-emerald-950/80 border-[#00E6A0] text-[#00E6A0] font-bold';
                            } else if (selected === oidx) {
                              optStyle = 'bg-rose-950/80 border-rose-500 text-rose-300';
                            } else {
                              optStyle = 'bg-[#071D32]/50 border-slate-800 text-slate-500';
                            }
                          } else if (selected === oidx) {
                            optStyle = 'bg-[#00D9FF]/20 border-[#00D9FF] text-[#00D9FF] font-bold';
                          }

                          return (
                            <button
                              key={oidx}
                              onClick={() => handleSelectQuizOption(qidx, oidx)}
                              disabled={quizSubmitted}
                              className={`w-full text-left p-3 rounded-xl border text-xs transition-colors flex items-center justify-between cursor-pointer ${optStyle}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && oidx === q.correctIndex && (
                                <Check className="w-4 h-4 text-[#00E6A0]" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className="pt-2 text-xs text-[#9BB1C8] border-t border-slate-800">
                          <strong className="text-[#00D9FF]">Explanation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Quiz Submission Button */}
                <div className="flex items-center gap-3 pt-2">
                  {!quizSubmitted ? (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={Object.keys(quizAnswers).length === 0}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00E6A0] to-[#00D9FF] text-[#04111F] font-bold text-xs disabled:opacity-40 transition-all cursor-pointer"
                    >
                      Submit Quiz & Check Score
                    </button>
                  ) : (
                    <button
                      onClick={handleResetQuiz}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#071D32] text-xs text-[#9BB1C8] hover:text-white transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake Quiz</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-[#04111F]/90 flex items-center justify-between">
              <button
                onClick={() => onToggleCompleteLesson(activeLesson.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  activeLesson.isCompleted
                    ? 'bg-[#00E6A0]/20 text-[#00E6A0] border border-[#00E6A0]/40'
                    : 'bg-[#00E6A0] hover:bg-[#00c98b] text-[#04111F]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{activeLesson.isCompleted ? 'Module Completed (Click to Unmark)' : 'Mark as Completed (+25 XP)'}</span>
              </button>

              <button
                onClick={() => setActiveLesson(null)}
                className="px-5 py-2 rounded-xl bg-[#071D32] hover:bg-[#0c2844] text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              >
                Close Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
