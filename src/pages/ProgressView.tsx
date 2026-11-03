import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Calendar,
  Flame,
  Award,
  ArrowRight,
  Clock,
  Trophy,
  Brain,
  Layers,
  Lock,
  Zap,
  BookOpen
} from 'lucide-react';
import { UserProgress, Lesson, NavTab, Achievement, SRSItem } from '../types';
import { api } from '../services/api';

interface ProgressViewProps {
  progress: UserProgress | null;
  lessons: Lesson[];
  onNavigate: (tab: NavTab) => void;
  onLaunchPractice: (targetKannada: string, targetTransliteration: string, targetEnglish: string) => void;
}

const LEVEL_DETAILS: Record<number, { title: string; kannada: string; maxXP: number; minXP: number; desc: string }> = {
  1: { title: 'Novice', kannada: 'ಆರಂಭಿಕ (Arambhika)', minXP: 0, maxXP: 250, desc: 'Foundational greetings and basic words' },
  2: { title: 'Learner', kannada: 'ವಿದ್ಯಾರ್ಥಿ (Vidyarthi)', minXP: 250, maxXP: 500, desc: 'Everyday transit, market interactions, and numbers' },
  3: { title: 'Intermediate', kannada: 'ಮಧ್ಯಮ (Madhyama)', minXP: 500, maxXP: 1000, desc: 'Conversational fluency, restaurant orders, and grammar' },
  4: { title: 'Advanced', kannada: 'ಪ್ರವೀಣ (Praveena)', minXP: 1000, maxXP: 2000, desc: 'Nuanced roleplay, complex SOV sentence syntax' },
  5: { title: 'Master', kannada: 'ಪಂಡಿತ (Pandita)', minXP: 2000, maxXP: 5000, desc: 'Native-like ease across all conversational domains' }
};

export const ProgressView: React.FC<ProgressViewProps> = ({
  progress,
  lessons,
  onNavigate,
  onLaunchPractice
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [srsItems, setSRSItems] = useState<SRSItem[]>([]);
  const [loadingExtras, setLoadingExtras] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      api.getAchievements().catch(() => []),
      api.getSRSItems().catch(() => [])
    ]).then(([achData, srsData]) => {
      setAchievements(achData);
      setSRSItems(srsData);
      setLoadingExtras(false);
    });
  }, []);

  const completedIds = new Set(progress?.completedLessonIds || []);
  const totalLessons = lessons.length || 6;
  const completedCount = completedIds.size;
  const completionPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const practiceHistory = progress?.practiceHistory || [];

  const currentXP = progress?.xp || 0;
  const currentLevel = progress?.level || 1;
  const levelInfo = LEVEL_DETAILS[currentLevel] || LEVEL_DETAILS[1];

  const nextLevelMinXP = levelInfo.maxXP;
  const levelBaseXP = levelInfo.minXP;
  const progressInLevel = Math.max(0, currentXP - levelBaseXP);
  const neededInLevel = Math.max(1, nextLevelMinXP - levelBaseXP);
  const xpPercentage = Math.min(100, Math.round((progressInLevel / neededInLevel) * 100));

  // SRS breakdown
  const srsMastered = srsItems.filter(i => i.state === 'mastered').length;
  const srsReview = srsItems.filter(i => i.state === 'review').length;
  const srsLearning = srsItems.filter(i => i.state === 'learning').length;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Level and XP Progression Hero Card */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-[#0a1829] to-slate-900 border border-slate-800 p-6 md:p-8 space-y-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <Trophy className="w-4 h-4" />
              <span>LEARNER PROFICIENCY TIER</span>
              <span>·</span>
              <span className="font-kannada">ಕಲಿಕಾ ಹಂತ</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <span>Level {currentLevel}: {levelInfo.title}</span>
              <span className="text-lg md:text-xl font-normal font-kannada text-emerald-300">
                ({levelInfo.kannada})
              </span>
            </h2>
            <p className="text-xs md:text-sm text-slate-400">
              {levelInfo.desc}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 px-4 py-3 rounded-xl shrink-0">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
            <div>
              <div className="text-xl font-bold font-mono text-white leading-tight">
                {currentXP} <span className="text-xs font-normal text-slate-400">XP</span>
              </div>
              <p className="text-[10px] text-slate-400">Total Experience Points</p>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Progress to {currentLevel < 5 ? `Level ${currentLevel + 1}` : 'Mastery Cap'}
            </span>
            <span className="font-mono text-emerald-400 font-semibold">
              {currentXP} / {nextLevelMinXP} XP ({xpPercentage}%)
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800/80 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-700"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Overview Cards (Real data only) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>ACTIVE STREAK</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            {progress?.streakDays || 1} <span className="text-sm font-normal text-slate-400">days</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Last active: {progress?.lastActiveDate || 'Today'}
          </p>
        </div>

        {/* Modules Completed */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>CURRICULUM</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-emerald-400">
            {completedCount}/{totalLessons}
          </div>
          <p className="text-[11px] text-slate-400">
            {completionPercentage}% of structured syllabus
          </p>
        </div>

        {/* Verified Practice Sessions */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>PRONUNCIATION</span>
            <Sparkles className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-teal-300">
            {progress?.totalPracticed || 0}
          </div>
          <p className="text-[11px] text-slate-400">
            Verified speech evaluations
          </p>
        </div>

        {/* SRS Memory Retained */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>SRS MEMORY</span>
            <Brain className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-cyan-300">
            {srsItems.length} <span className="text-xs font-normal text-slate-400">cards</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {srsMastered} mastered · {srsReview} review
          </p>
        </div>
      </div>

      {/* Spaced Repetition Flashcards Status */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-cyan-400" />
              <span>Spaced Repetition Memory (SM-2 SRS)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Vocabulary retention tracked using the SuperMemo-2 interval algorithm.
            </p>
          </div>
          <button
            onClick={() => onNavigate('vocabulary')}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Review Flashcards</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Learning (New)</p>
              <p className="text-xl font-bold font-mono text-amber-400">{srsLearning}</p>
            </div>
            <span className="text-[10px] text-amber-500/80 px-2 py-1 rounded bg-amber-950/40 border border-amber-800/50">
              Interval: 1-2 days
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Review (Active)</p>
              <p className="text-xl font-bold font-mono text-teal-400">{srsReview}</p>
            </div>
            <span className="text-[10px] text-teal-500/80 px-2 py-1 rounded bg-teal-950/40 border border-teal-800/50">
              Interval: 3-6 days
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Mastered (Long-term)</p>
              <p className="text-xl font-bold font-mono text-emerald-400">{srsMastered}</p>
            </div>
            <span className="text-[10px] text-emerald-500/80 px-2 py-1 rounded bg-emerald-950/40 border border-emerald-800/50">
              Interval: 7+ days
            </span>
          </div>
        </div>
      </div>

      {/* Achievements Showcase */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Kannada Learning Achievements & Badges</span>
            </h3>
            <p className="text-xs text-slate-400">
              Milestones unlocked based on real conversational and practice achievements.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {achievements.filter(a => a.isUnlocked).length} / {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-xl border transition-all ${
                ach.isUnlocked
                  ? 'bg-slate-950/80 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-950/40 border-slate-800/60 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    ach.isUnlocked
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                      : 'bg-slate-900 text-slate-600 border border-slate-800'
                  }`}
                >
                  {ach.isUnlocked ? <Trophy className="w-4 h-4 text-amber-400" /> : <Lock className="w-4 h-4" />}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-semibold text-white truncate">
                      {ach.title}
                    </h4>
                    <span className="text-[10px] font-mono font-medium text-amber-400 shrink-0">
                      +{ach.xpReward} XP
                    </span>
                  </div>
                  <p className="text-[11px] font-kannada text-emerald-400/90">
                    {ach.titleKannada}
                  </p>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {ach.description}
                  </p>
                  {ach.isUnlocked && ach.unlockedAt && (
                    <p className="text-[10px] text-emerald-400 font-mono pt-1">
                      ✓ Unlocked {new Date(ach.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Completion Breakdown */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">
              Curriculum Module Status
            </h3>
            <p className="text-xs text-slate-400">
              Completed modules reflect true user activity persisted in local database.
            </p>
          </div>
          <button
            onClick={() => onNavigate('learning')}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Open Learning Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {lessons.map(lesson => {
            const isDone = completedIds.has(lesson.id);

            return (
              <div
                key={lesson.id}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      isDone
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold font-kannada text-white">
                      {lesson.titleKannada} · {lesson.titleEnglish}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {lesson.category.toUpperCase()} · {lesson.phrasesCount || lesson.phrases?.length || 0} phrases · {lesson.durationMinutes} min
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs font-mono font-medium ${
                    isDone ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  {isDone ? 'Completed' : 'Pending'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grounded Speaking Practice History Log */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">
              Recent Speech Evaluation Log
            </h3>
            <p className="text-xs text-slate-400">
              Verified speech recognition attempts with target vs recognized transcript comparison.
            </p>
          </div>
          <button
            onClick={() => onNavigate('practice')}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Practice Speaking</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {practiceHistory.length === 0 ? (
          <div className="text-center py-8 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400">
              No speaking practice sessions recorded yet. Try practicing a phrase in the Speaking Practice Studio!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {practiceHistory.slice(0, 10).map((record) => (
              <div
                key={record.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-[11px]">
                    {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span
                    className={`font-mono text-xs font-semibold ${
                      record.matchRatio >= 0.8
                        ? 'text-emerald-400'
                        : record.matchRatio >= 0.5
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {Math.round(record.matchRatio * 100)}% Token Match
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">Target:</span>
                    <p className="font-kannada font-medium text-white">{record.targetText}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">You Spoke:</span>
                    <p className="font-kannada font-medium text-emerald-300">
                      {record.recognizedText || '(No speech)'}
                    </p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 pt-1 border-t border-slate-800/60">
                  {record.feedback}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
