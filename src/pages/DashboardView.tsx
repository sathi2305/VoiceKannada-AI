import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Sparkles,
  BookOpen,
  Volume2,
  ArrowRight,
  TrendingUp,
  MapPin,
  Coffee,
  ShoppingBag,
  ShieldAlert,
  Flame,
  Award,
  CheckCircle2,
  PartyPopper,
  Calendar,
  X,
  Zap,
  Layers,
  Headphones,
  MessageSquare,
  Type,
  Eye,
  Languages,
  Compass,
  Trophy,
  BrainCircuit,
  RotateCcw
} from 'lucide-react';
import { NavTab, UserProgress, Lesson, LearningBrainAnalysis } from '../types';
import { speechService } from '../services/speech';
import { StreakMilestones } from '../components/StreakMilestones';
import { CinematicHero } from '../components/CinematicHero';
import { api } from '../services/api';

interface DashboardViewProps {
  onNavigate: (tab: NavTab) => void;
  onLaunchPractice: (targetKannada: string, targetTransliteration: string, targetEnglish: string) => void;
  onSpeak: (text: string) => void;
  progress: UserProgress | null;
  lessons: Lesson[];
  onExtendStreak?: () => Promise<number>;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onLaunchPractice,
  onSpeak,
  progress,
  lessons,
  onExtendStreak
}) => {
  const currentStreak = progress?.streakDays || 1;
  const prevStreakRef = useRef<number>(currentStreak);

  // Celebratory modal & confetti state
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [celebratedStreak, setCelebratedStreak] = useState<number>(currentStreak);
  const [isExtending, setIsExtending] = useState<boolean>(false);
  const [isStreakAnimating, setIsStreakAnimating] = useState<boolean>(false);
  const [animTriggerKey, setAnimTriggerKey] = useState<number>(0);

  // Confetti particles generator
  const [confettiPieces, setConfettiPieces] = useState<Array<{
    id: number;
    left: number;
    color: string;
    delay: number;
    size: number;
    shape: 'square' | 'circle' | 'strip';
  }>>([]);

  const triggerCelebration = (streakCount: number) => {
    setCelebratedStreak(streakCount);
    setShowCelebration(true);
    setIsStreakAnimating(true);
    setAnimTriggerKey((prev) => prev + 1);
    speechService.playChime('success');

    // Generate confetti pieces
    const colors = ['#10b981', '#f59e0b', '#14b8a6', '#06b6d4', '#ec4899', '#f97316', '#eab308'];
    const pieces = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      left: Math.random() * 96 + 2, // 2% to 98%
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.8,
      size: Math.floor(Math.random() * 8) + 6,
      shape: (['square', 'circle', 'strip'] as const)[Math.floor(Math.random() * 3)]
    }));
    setConfettiPieces(pieces);

    // Reset inline UI celebrate-pop animation after 3.2s
    const animTimer = setTimeout(() => {
      setIsStreakAnimating(false);
    }, 3200);

    // Auto-dismiss modal after 6.5s
    const timer = setTimeout(() => {
      setShowCelebration(false);
    }, 6500);

    return () => {
      clearTimeout(timer);
      clearTimeout(animTimer);
    };
  };

  // Watch for external streak increases
  useEffect(() => {
    if (progress && progress.streakDays > prevStreakRef.current) {
      triggerCelebration(progress.streakDays);
    }
    if (progress) {
      prevStreakRef.current = progress.streakDays;
    }
  }, [progress?.streakDays]);

  const [brainAnalysis, setBrainAnalysis] = useState<LearningBrainAnalysis | null>(null);

  const loadBrainData = async () => {
    try {
      const data = await api.getLearningBrainAnalysis();
      setBrainAnalysis(data);
    } catch (e) {
      console.warn('Failed to fetch learning brain data:', e);
    }
  };

  useEffect(() => {
    loadBrainData();
  }, [progress?.streakDays, progress?.totalPracticed]);

  const handleResetBrain = async () => {
    if (!window.confirm('Reset learning brain activity recommendations and error logs?')) return;
    try {
      await api.resetLearningBrain();
      await loadBrainData();
    } catch (e) {
      console.warn('Reset brain error:', e);
    }
  };

  const handleManualExtendStreak = async () => {
    if (isExtending) return;
    setIsExtending(true);
    try {
      if (onExtendStreak) {
        const newStreak = await onExtendStreak();
        triggerCelebration(newStreak);
      } else {
        const newStreak = currentStreak + 1;
        triggerCelebration(newStreak);
      }
    } catch (err) {
      console.warn('Streak extension error:', err);
    } finally {
      setIsExtending(false);
    }
  };

  const dailyPhrase = {
    kannada: 'ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ, ಕನ್ನಡ ಉಳಿಸಿ',
    transliteration: 'Kannaḍadalli mātanāḍi, kannaḍa uḷisi',
    english: 'Speak in Kannada, preserve and cherish Kannada',
    context: 'Inspiring phrase celebrating the classical language of Karnataka.'
  };

  const quickScenarios = [
    {
      title: 'Auto-Rickshaw Ride',
      kannada: 'ಮೀಟರ್ ಹಾಕಿ ಅಣ್ಣ',
      transliteration: 'Meter hāki aṇṇa',
      english: 'Turn on the meter, brother',
      icon: <MapPin className="w-4 h-4 text-emerald-400" />,
      tag: 'Travel'
    },
    {
      title: 'Darshini Coffee Order',
      kannada: 'ಬಿಸಿ ಫಿಲ್ಟರ್ ಕಾಫಿ ಕೊಡಿ',
      transliteration: 'Bisi filter coffee koḍi',
      english: 'Give hot filter coffee',
      icon: <Coffee className="w-4 h-4 text-amber-400" />,
      tag: 'Food'
    },
    {
      title: 'Market Bargaining',
      kannada: 'ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ',
      transliteration: 'Svalpa kaḍime māḍi',
      english: 'Please reduce the price a little bit',
      icon: <ShoppingBag className="w-4 h-4 text-teal-400" />,
      tag: 'Shopping'
    },
    {
      title: 'Emergency Help',
      kannada: 'ತುರ್ತು ಸಹಾಯ ಬೇಕು',
      transliteration: 'Turtu sahāya bēku',
      english: 'I need urgent assistance',
      icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
      tag: 'Health'
    }
  ];

  const completedCount = progress?.completedLessonIds.length || 0;
  const totalLessons = lessons.length || 6;
  const percentage = Math.round((completedCount / totalLessons) * 100);

  // Generate 7-day tracker representation
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayIndex = (new Date().getDay() + 6) % 7; // Monday is 0

  return (
    <div className="space-y-8 max-w-6xl mx-auto relative">
      {/* Celebratory Fullscreen Confetti Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
          {/* Confetti particles */}
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              style={{
                left: `${piece.left}%`,
                top: `-20px`,
                backgroundColor: piece.color,
                width: piece.shape === 'strip' ? `${piece.size * 2}px` : `${piece.size}px`,
                height: `${piece.size}px`,
                borderRadius: piece.shape === 'circle' ? '50%' : piece.shape === 'strip' ? '2px' : '3px',
                animationDelay: `${piece.delay}s`
              }}
              className="absolute animate-confetti opacity-90 shadow-sm"
            />
          ))}

          {/* Celebratory Dialog Card */}
          <div className="pointer-events-auto bg-gradient-to-b from-slate-900 via-slate-900 to-[#071322] border-2 border-amber-500/60 p-6 md:p-8 rounded-3xl max-w-md w-full mx-4 shadow-[0_0_60px_rgba(245,158,11,0.35)] animate-celebrate-pop relative text-center space-y-4">
            <button
              onClick={() => setShowCelebration(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              aria-label="Close celebration dialog"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Flame Trophy */}
            <div className="relative inline-flex items-center justify-center">
              <span className="absolute w-24 h-24 rounded-full bg-amber-500/20 animate-ping" />
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-[0_0_30px_rgba(245,158,11,0.7)] animate-flame">
                <Flame className="w-12 h-12 text-slate-950 fill-amber-950" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest">
                <PartyPopper className="w-4 h-4" />
                <span>Streak Extended!</span>
                <PartyPopper className="w-4 h-4" />
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white">
                {celebratedStreak} Day Streak!
              </h3>
              <p className="text-sm font-kannada text-emerald-300 font-semibold pt-1">
                ಅದ್ಭುತ! ಸರಣಿ ವಿಸ್ತರಿಸಿದೆ
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1">
              <p className="font-medium text-white">
                "ಪ್ರಯತ್ನವೇ ಸರ್ವಸಿದ್ಧಿಯ ಮೂಲ"
              </p>
              <p className="text-slate-400 text-[11px]">
                (Effort is the root of all accomplishment)
              </p>
              <p className="text-emerald-400 text-xs pt-1">
                You've completed your daily Kannada practice and kept your learning habit alive!
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowCelebration(false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                Keep Learning (ಮುಂದುವರಿಯಿರಿ)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cinematic 3D Hero Screen */}
      <CinematicHero
        onNavigate={onNavigate}
        progress={progress}
        onSpeakSample={() => onSpeak('ನಮಸ್ಕಾರ! ಕನ್ನಡದ ಧ್ವನಿ ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ವೇದಿಕೆಗೆ ಸುಸ್ವಾಗತ. ನಿಮ್ಮ ಧ್ವನಿ, ನಿಮ್ಮ ಕನ್ನಡ ಲೋಕ.')}
      />

      {/* Prominent Featured Daily Learning Streak Showcase Banner */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-[#0d1829] to-[#0a1f33] border-2 transition-all duration-500 p-6 md:p-8 shadow-2xl ${
        isStreakAnimating 
          ? 'border-amber-400/90 shadow-[0_0_50px_rgba(245,158,11,0.35)] ring-2 ring-amber-400/40' 
          : 'border-emerald-500/40'
      }`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-500/15 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
          {/* Left: Streak Counter & Fire Badge */}
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              {/* Outer pulsing ring */}
              <span className={`absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 opacity-60 blur-sm ${
                isStreakAnimating ? 'animate-ping opacity-90' : 'animate-pulse'
              }`} />
              <div 
                key={`flame-badge-${animTriggerKey}`}
                className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 flex flex-col items-center justify-center text-slate-950 shadow-xl animate-flame transition-all ${
                  isStreakAnimating 
                    ? 'animate-celebrate-pop ring-4 ring-amber-300 ring-offset-2 ring-offset-slate-950 shadow-[0_0_35px_rgba(245,158,11,0.9)]' 
                    : ''
                }`}
              >
                <Flame className="w-8 h-8 md:w-10 md:h-10 text-slate-950 fill-amber-950 drop-shadow-md" />
                <span className="text-xs md:text-sm font-black tracking-wider uppercase -mt-0.5 font-mono">
                  ACTIVE
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider text-amber-400 uppercase">
                  DAILY LEARNING STREAK
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-xs font-kannada text-emerald-400 font-medium">
                  ದೈನಂದಿನ ಕಲಿಕಾ ಸರಣಿ
                </span>
                {isStreakAnimating && (
                  <span 
                    key={`celebrate-pill-${animTriggerKey}`}
                    className="animate-celebrate-pop inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-[11px] shadow-[0_0_15px_rgba(245,158,11,0.8)] uppercase tracking-wider"
                  >
                    <Sparkles className="w-3 h-3 fill-slate-950" />
                    <span>Streak Extended! +30 XP</span>
                  </span>
                )}
              </div>

              <div 
                key={`streak-num-${animTriggerKey}`}
                className={`flex items-baseline gap-2 transition-transform ${isStreakAnimating ? 'animate-celebrate-pop' : ''}`}
              >
                <h2 className={`text-3xl md:text-5xl font-black font-mono tracking-tight transition-colors ${
                  isStreakAnimating ? 'text-amber-300 drop-shadow-[0_0_20px_rgba(245,158,11,0.9)]' : 'text-white'
                }`}>
                  {currentStreak}
                </h2>
                <span className={`text-base md:text-xl font-bold ${isStreakAnimating ? 'text-amber-200' : 'text-amber-300'}`}>
                  {currentStreak === 1 ? 'Day Streak' : 'Days Streak'}
                </span>
                {isStreakAnimating && (
                  <span className="animate-celebrate-pop text-sm font-bold text-emerald-400 font-mono flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" /> +1
                  </span>
                )}
              </div>

              <p className="text-xs md:text-sm text-slate-300 max-w-md">
                {currentStreak > 1
                  ? `Incredible dedication! You have practiced Kannada for ${currentStreak} consecutive days.`
                  : 'Start strong! Practice speaking or complete a lesson today to build your streak.'}
              </p>
            </div>
          </div>

          {/* Center-Right: 7-Day Week Calendar & Goal Progress */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
            {/* Week days circles */}
            <div className="space-y-1.5">
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>Weekly Activity</span>
                <span className="font-mono text-emerald-400 text-[10px]">Mon - Sun</span>
              </div>
              <div className="flex items-center gap-1.5">
                {daysOfWeek.map((day, idx) => {
                  const isToday = idx === todayIndex;
                  const isPast = idx < todayIndex;

                  return (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <div
                        key={`${idx}-${animTriggerKey}`}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                          isToday
                            ? `bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.5)] scale-105 ${
                                isStreakAnimating ? 'animate-celebrate-pop ring-2 ring-amber-300 ring-offset-1 ring-offset-slate-950' : ''
                              }`
                            : isPast
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-900 text-slate-500 border border-slate-800'
                        }`}
                      >
                        {isToday ? <Flame className="w-3.5 h-3.5 fill-slate-950" /> : isPast ? <CheckCircle2 className="w-3.5 h-3.5" /> : day}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Extension Trigger Button */}
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={handleManualExtendStreak}
                disabled={isExtending}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                title="Log daily check-in and extend streak"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>{isExtending ? 'Extending...' : 'Extend Streak Today'}</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Streak Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Streak Milestones & Upcoming Reward Showcase */}
      <StreakMilestones
        currentStreak={currentStreak}
        onExtendStreak={handleManualExtendStreak}
        onNavigateToPractice={() => onNavigate('practice')}
        onSpeakPhrase={onSpeak}
      />

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-[#0c1a2e] border border-slate-800 p-6 md:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>KANNADA VOICE ASSISTANT & LEARNING PLATFORM</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              ನಮಸ್ಕಾರ! Voice of Kannada ಗೆ ಸುಸ್ವಾಗತ
            </h1>
            <p className="text-sm md:text-base text-slate-300">
              Converse naturally in Kannada with intelligent AI, master authentic pronunciation with speech recognition, and learn real-world conversational phrases.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('assistant')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-semibold text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>Start Talking in Kannada</span>
              </button>
              <button
                onClick={() => onNavigate('practice')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-medium transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>Pronunciation Practice</span>
              </button>
            </div>
          </div>

          {/* Clean Unboxed Stats Container */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 min-w-[240px]">
            <div>
              <div className="text-xs text-slate-400">Current Streak</div>
              <div 
                key={`stat-streak-${animTriggerKey}`}
                className={`text-2xl font-bold text-amber-400 font-mono flex items-center gap-1 ${
                  isStreakAnimating ? 'animate-celebrate-pop text-amber-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]' : ''
                }`}
              >
                <Flame className={`w-5 h-5 fill-amber-400 text-amber-400 ${isStreakAnimating ? 'animate-bounce' : ''}`} />
                <span>{currentStreak}d</span>
                {isStreakAnimating && (
                  <span className="text-xs font-bold text-emerald-400 font-sans animate-celebrate-pop">
                    +1!
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400">Active progress</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Lessons Finished</div>
              <div className="text-2xl font-bold text-teal-300 font-mono">
                {completedCount}/{totalLessons}
              </div>
              <div className="text-[11px] text-slate-400">{percentage}% completion</div>
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-800/80">
              <div className="text-xs text-slate-400">Phrases Practiced</div>
              <div className="text-xl font-bold text-cyan-300 font-mono">
                {progress?.totalPracticed || 0} <span className="text-xs text-slate-400 font-normal">verified sessions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Personal Learning Brain */}
      {brainAnalysis && (
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/20 to-slate-900 border border-emerald-500/30 p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">AI Personal Learning Brain</h3>
                  <span className="text-xs font-kannada text-emerald-400">ಕಲಿಕಾ ಮೆದುಳು</span>
                </div>
                <p className="text-xs text-slate-400">
                  Transparent, explainable suggestions calculated from your real practice attempts and mistakes.
                </p>
              </div>
            </div>

            <button
              onClick={handleResetBrain}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-medium border border-slate-700/60 transition-colors self-start sm:self-center"
              title="Reset learning brain history"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Brain Data
            </button>
          </div>

          {/* Brain Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Mastery Score</span>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                {brainAnalysis.masteryScore}/100
              </div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Accuracy Rate</span>
              <div className="text-xl font-bold font-mono text-teal-400 mt-0.5">
                {brainAnalysis.accuracyRate}%
              </div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Weekly Activities</span>
              <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">
                {brainAnalysis.weeklyActivityCount} sessions
              </div>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Recurrent Mistakes</span>
              <div className="text-xl font-bold font-mono text-amber-400 mt-0.5">
                {brainAnalysis.recurrentMistakes.length} logged
              </div>
            </div>
          </div>

          {/* Explainable Recommendations */}
          {brainAnalysis.recommendations && brainAnalysis.recommendations.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Explainable Daily Recommendations:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {brainAnalysis.recommendations.map(rec => (
                  <div
                    key={rec.id}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] uppercase font-bold text-emerald-400 mb-1">
                        <span>{rec.priority} Priority</span>
                        <span className="font-kannada text-slate-400">{rec.titleKannada}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-white">{rec.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{rec.reason}</p>
                    </div>

                    <button
                      onClick={() => onNavigate(rec.targetTab)}
                      className="mt-3 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-colors"
                    >
                      <span>Go to Activity</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Next-Generation Multimodal Feature Launchers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Multimodal & Innovation Hub</h3>
            <p className="text-xs text-slate-400">Advanced AI features for everyday life and travel in Karnataka</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Visual Intelligence */}
          <div
            onClick={() => onNavigate('vision')}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
                <Eye className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-emerald-300">
                Visual Intelligence
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Camera signboard OCR, menu translation, and Karnataka object reader.
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <span>Scan & Read</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Two-Way Translator */}
          <div
            onClick={() => onNavigate('translator')}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-teal-500/50 cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-2">
                <Languages className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-teal-300">
                Voice Translator
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Two-way speech bridge between Kannada and English speakers.
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-teal-400 font-medium">
              <span>Translate Live</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Culture Library */}
          <div
            onClick={() => onNavigate('culture')}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2">
                <Compass className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300">
                Culture & Dialects
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Regional dialects (Mysuru, Hubballi, Karavali), Dasara, and food lore.
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-cyan-400 font-medium">
              <span>Explore Heritage</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Quests */}
          <div
            onClick={() => onNavigate('quests')}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2">
                <Trophy className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-amber-300">
                Learning Quests
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Gamified missions with step completion tracking and XP unlocks.
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-amber-400 font-medium">
              <span>View Missions</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Mistake Coach */}
          <div
            onClick={() => onNavigate('mistakes')}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/50 cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-2">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-rose-300">
                Mistake Coach
              </h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Targeted revision for mispronounced words and missing grammar.
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-rose-400 font-medium">
              <span>Review Errors</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Phrase of the Day Card */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-emerald-400">DAILY PHRASE</span>
            <span>·</span>
            <span>ದಿನದ ನುಡಿಮುತ್ತು</span>
          </div>
          <button
            onClick={() => onSpeak(dailyPhrase.kannada)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Listen Pronunciation</span>
          </button>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-semibold font-kannada text-white">
            {dailyPhrase.kannada}
          </h2>
          <p className="text-sm text-emerald-400/90 font-mono">
            {dailyPhrase.transliteration}
          </p>
          <p className="text-sm text-slate-300">
            {dailyPhrase.english}
          </p>
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
          <span className="text-xs text-slate-400">{dailyPhrase.context}</span>
          <button
            onClick={() =>
              onLaunchPractice(
                dailyPhrase.kannada,
                dailyPhrase.transliteration,
                dailyPhrase.english
              )
            }
            className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
          >
            <span>Practice saying this</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid of Workspaces */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assistant Card */}
        <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Mic className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              AI Kannada Voice Assistant
            </h3>
            <p className="text-sm text-slate-400">
              Speak in Kannada using Push-to-Talk or Continuous mode. Get real-time answers with Kannada script, readable transliteration, English breakdown, and native audio voice playback.
            </p>
          </div>
          <div className="pt-6">
            <button
              onClick={() => onNavigate('assistant')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors cursor-pointer"
            >
              <span>Open Voice Assistant</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Learning Studio Card */}
        <div className="rounded-xl bg-slate-900/50 border border-slate-800 p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-950/60 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Structured Kannada Curriculum
            </h3>
            <p className="text-sm text-slate-400">
              Explore 6 foundational modules covering greetings, Bengaluru commute, market shopping, hotel dining, healthcare emergencies, and daily life etiquette with authentic vocabulary cards.
            </p>
          </div>
          <div className="pt-6">
            <button
              onClick={() => onNavigate('learning')}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-colors cursor-pointer"
            >
              <span>Browse Kannada Lessons</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Learning Studios Grid */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Interactive Kannada Learning Studios</h3>
          <p className="text-xs text-slate-400">Master word construction, ear comprehension, cultural roleplay, and the Kannada script</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Sentence Builder */}
          <div
            onClick={() => onNavigate('builder')}
            className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                Sentence Builder
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Reconstruct Kannada SOV (Subject-Object-Verb) word order with interactive word tiles and grammar notes.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs text-emerald-400 font-medium">
              <span>Start Puzzle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Listening Comprehension */}
          <div
            onClick={() => onNavigate('listening')}
            className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-teal-500/50 cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-950/60 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Headphones className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-teal-300 transition-colors">
                Listening Comprehension
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Audio-first ear training. Listen to authentic Kannada speech and test your comprehension with questions.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs text-teal-400 font-medium">
              <span>Listen & Answer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Real-World Roleplay */}
          <div
            onClick={() => onNavigate('roleplay')}
            className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                Role-Play Simulator
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Simulate authentic Bengaluru conversations with auto drivers, darshini waiters, and KR Market vendors.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs text-cyan-400 font-medium">
              <span>Launch Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Script Master */}
          <div
            onClick={() => onNavigate('characters')}
            className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all flex flex-col justify-between group"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Type className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                Script & Alphabet Master
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Explore all 49 Kannada characters (Swaragalu & Vyanjanagalu) with example vocabulary and quiz challenges.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1 text-xs text-amber-400 font-medium">
              <span>Explore Letters</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Everyday Bengaluru Scenarios */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Everyday Karnataka Scenarios</h3>
            <p className="text-xs text-slate-400">Quick-practice popular expressions spoken every day across Karnataka</p>
          </div>
          <button
            onClick={() => onNavigate('vocabulary')}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Vocabulary</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickScenarios.map((scen, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-slate-900/40 border border-slate-800/80 p-4 flex flex-col justify-between hover:border-emerald-500/40 transition-all group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    {scen.icon}
                    <span className="font-medium text-slate-300">{scen.title}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{scen.tag}</span>
                </div>
                <div className="pt-1">
                  <p className="text-base font-semibold font-kannada text-white group-hover:text-emerald-300 transition-colors">
                    {scen.kannada}
                  </p>
                  <p className="text-xs text-emerald-400/80 font-mono">{scen.transliteration}</p>
                  <p className="text-xs text-slate-400 mt-1">{scen.english}</p>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-2">
                <button
                  onClick={() => onSpeak(scen.kannada)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                  title="Listen"
                  aria-label={`Listen to ${scen.kannada}`}
                >
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                </button>
                <button
                  onClick={() => onLaunchPractice(scen.kannada, scen.transliteration, scen.english)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-200 text-center font-medium transition-colors cursor-pointer"
                >
                  Practice Speaking
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
