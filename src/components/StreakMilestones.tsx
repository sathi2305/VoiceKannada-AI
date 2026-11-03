import React, { useState } from 'react';
import {
  Flame,
  Award,
  Trophy,
  Zap,
  Shield,
  Crown,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Volume2,
  X,
  Gift,
  Target,
  ChevronRight
} from 'lucide-react';
import { speechService } from '../services/speech';

export interface Milestone {
  days: number;
  kannadaTitle: string;
  transliteration: string;
  englishTitle: string;
  xpReward: number;
  badgeName: string;
  badgeKannada: string;
  perkDescription: string;
  proverbKannada: string;
  proverbTransliteration: string;
  proverbEnglish: string;
  iconType: 'flame' | 'award' | 'zap' | 'trophy' | 'crown' | 'shield';
  accentColor: string;
}

export const STREAK_MILESTONES: Milestone[] = [
  {
    days: 3,
    kannadaTitle: 'ಸ್ಥಿರತೆ',
    transliteration: 'Sthirathe',
    englishTitle: 'Consistency Spark',
    xpReward: 50,
    badgeName: 'Habit Builder',
    badgeKannada: 'ಅಭ್ಯಾಸ ಪಟು',
    perkDescription: 'Streak freeze safety buffer & audio study tips unlocked',
    proverbKannada: 'ಹನಿ ಹನಿ ಸೇರಿದರೆ ಹಳ್ಳ',
    proverbTransliteration: 'Hani hani sēridare haḷḷa',
    proverbEnglish: 'Every single drop together forms a mighty stream',
    iconType: 'flame',
    accentColor: 'from-amber-500 to-orange-500'
  },
  {
    days: 7,
    kannadaTitle: 'ವಾರದ ವ್ರತ',
    transliteration: 'Vārada Vrata',
    englishTitle: 'Weekly Dedication',
    xpReward: 100,
    badgeName: 'Week Warrior',
    badgeKannada: 'ವಾರದ ವೀರ',
    perkDescription: 'Silver flame aura ring & exclusive cultural folk phrase pack',
    proverbKannada: 'ಕಾಯಕವೇ ಕೈಲಾಸ',
    proverbTransliteration: 'Kāyakavē kailāsa',
    proverbEnglish: 'Work and dedicated practice are truly divine',
    iconType: 'award',
    accentColor: 'from-emerald-500 to-teal-500'
  },
  {
    days: 14,
    kannadaTitle: 'ಪರಿಶ್ರಮ',
    transliteration: 'Parishrama',
    englishTitle: 'Fortnight Champion',
    xpReward: 250,
    badgeName: 'Perseverance Master',
    badgeKannada: 'ಪಕ್ಷ ವಿಜೇತ',
    perkDescription: 'Transliteration booster & advanced conversation dialogue scenarios',
    proverbKannada: 'ಪ್ರಯತ್ನವಿದ್ದರೆ ಫಲ ನಿಶ್ಚಿತ',
    proverbTransliteration: 'Prayatnaviddare phala niśchita',
    proverbEnglish: 'With sincere daily effort, sweet fruits are certain',
    iconType: 'shield',
    accentColor: 'from-cyan-500 to-blue-500'
  },
  {
    days: 30,
    kannadaTitle: 'ಮಾಸಿಕ ಸಾಧನೆ',
    transliteration: 'Māsika Sādhane',
    englishTitle: 'Monthly Champion',
    xpReward: 500,
    badgeName: 'Kannada Devotee',
    badgeKannada: 'ಕನ್ನಡ ಅಭಿಮಾನಿ',
    perkDescription: 'Exclusive Golden Devotee border & high-speed spaced repetition review',
    proverbKannada: 'ನಿರಂತರ ಅಭ್ಯಾಸವೇ ಜಯದ ರಹಸ್ಯ',
    proverbTransliteration: 'Nirantara abhyāsavē jayada rahasya',
    proverbEnglish: 'Consistent practice is the true secret of mastery',
    iconType: 'trophy',
    accentColor: 'from-amber-400 to-yellow-500'
  },
  {
    days: 60,
    kannadaTitle: 'ಪ್ರವೀಣ ಸಾಧಕ',
    transliteration: 'Pravīṇa Sādhaka',
    englishTitle: 'Fluent Scholar',
    xpReward: 1000,
    badgeName: 'Kannada Vidwan',
    badgeKannada: 'ಕನ್ನಡ ವಿದ್ವಾಂಸ',
    perkDescription: 'Regional dialect simulator & custom voice pitch tuning',
    proverbKannada: 'ವಿದ್ಯೆಯೇ ಸರ್ವೋತ್ತಮ ಧನ',
    proverbTransliteration: 'Vidyēyē sarvōttama dhana',
    proverbEnglish: 'Knowledge and language fluency are the supreme wealth',
    iconType: 'crown',
    accentColor: 'from-teal-400 to-emerald-600'
  },
  {
    days: 100,
    kannadaTitle: 'ಶತದಿನ ಪಂಡಿತ',
    transliteration: 'Shatadina Paṇḍita',
    englishTitle: 'Centurion Laureate',
    xpReward: 2500,
    badgeName: 'Kannada Ratna',
    badgeKannada: 'ಕನ್ನಡ ರತ್ನ',
    perkDescription: 'Permanent Hall of Fame badge, Master Crest & unlimited custom TTS modes',
    proverbKannada: 'ಕನ್ನಡವೇ ಸತ್ಯ, ಕನ್ನಡವೇ ನಿತ್ಯ',
    proverbTransliteration: 'Kannaḍavē satya, kannaḍavē nitya',
    proverbEnglish: 'Kannada is eternal truth, Kannada is our daily breath',
    iconType: 'award',
    accentColor: 'from-rose-500 via-amber-500 to-emerald-400'
  }
];

interface StreakMilestonesProps {
  currentStreak: number;
  onExtendStreak?: () => Promise<unknown> | void;
  onNavigateToPractice?: () => void;
  onSpeakPhrase?: (phrase: string) => void;
}

export const StreakMilestones: React.FC<StreakMilestonesProps> = ({
  currentStreak,
  onExtendStreak,
  onNavigateToPractice,
  onSpeakPhrase
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Find next unreached milestone (or the highest one if all completed)
  const nextMilestone =
    STREAK_MILESTONES.find((m) => currentStreak < m.days) ||
    STREAK_MILESTONES[STREAK_MILESTONES.length - 1];

  const isNextMilestoneReached = currentStreak >= nextMilestone.days;
  const daysRemaining = Math.max(0, nextMilestone.days - currentStreak);

  // Find the previous milestone boundary to calculate accurate relative tier progress
  const previousMilestoneDays = (() => {
    const nextIdx = STREAK_MILESTONES.findIndex((m) => m.days === nextMilestone.days);
    if (nextIdx > 0) {
      return STREAK_MILESTONES[nextIdx - 1].days;
    }
    return 0;
  })();

  const tierSpan = nextMilestone.days - previousMilestoneDays;
  const tierProgress = Math.max(0, currentStreak - previousMilestoneDays);
  const progressPercent = Math.min(
    100,
    Math.max(8, Math.round((tierProgress / Math.max(1, tierSpan)) * 100))
  );

  const handleSpeak = (text: string) => {
    if (onSpeakPhrase) {
      onSpeakPhrase(text);
    } else {
      setIsPlayingAudio(true);
      speechService.speakKannada(text, {
        onEnd: () => setIsPlayingAudio(false),
        onError: () => setIsPlayingAudio(false)
      });
    }
  };

  const renderMilestoneIcon = (iconType: Milestone['iconType'], className = 'w-5 h-5') => {
    switch (iconType) {
      case 'flame':
        return <Flame className={className} />;
      case 'award':
        return <Award className={className} />;
      case 'trophy':
        return <Trophy className={className} />;
      case 'crown':
        return <Crown className={className} />;
      case 'shield':
        return <Shield className={className} />;
      default:
        return <Zap className={className} />;
    }
  };

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800/90 p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      {/* Background radial gradient accent */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-b from-amber-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header with Title & Summary */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400">
              <Trophy className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-mono font-bold tracking-wider text-amber-400 uppercase">
              STREAK MILESTONES & REWARDS
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-kannada text-emerald-400 font-medium">
              ಸರಣಿ ಮೈಲಿಗಲ್ಲುಗಳು ಮತ್ತು ಬಹುಮಾನಗಳು
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight mt-1">
            Journey of Consistency
          </h3>
          <p className="text-xs md:text-sm text-slate-400 mt-0.5">
            Maintain your daily Kannada habit to unlock exclusive cultural titles, XP boosts, and advanced learning tools.
          </p>
        </div>

        {/* Current status chip */}
        <div className="flex items-center gap-3 self-start sm:self-auto bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-slate-800 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Flame className="w-5 h-5 fill-amber-400/40" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase text-slate-400">Current Progress</div>
            <div className="text-base font-bold text-white font-mono flex items-center gap-1.5">
              <span>{currentStreak} Days</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-sans">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Spotlight: Next Upcoming Reward Card */}
      <div className="relative z-10 rounded-2xl bg-gradient-to-r from-slate-950 via-[#0a182b] to-[#071f28] border-2 border-amber-500/30 p-5 md:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left info */}
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                Next Upcoming Reward
              </span>

              {daysRemaining === 0 ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold">
                  🎉 Goal Achieved Today!
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono">
                  {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-3">
              <h4 className="text-2xl md:text-3xl font-bold font-kannada text-white">
                {nextMilestone.kannadaTitle}
              </h4>
              <span className="text-lg md:text-xl font-semibold text-emerald-300">
                {nextMilestone.englishTitle}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800/80 text-amber-400 border border-slate-700">
                {nextMilestone.days}-Day Goal
              </span>
            </div>

            <p className="text-xs md:text-sm text-slate-300 max-w-2xl">
              {nextMilestone.perkDescription}
            </p>

            {/* Progress bar towards next milestone */}
            <div className="space-y-1.5 pt-1 max-w-xl">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">
                  Tier Progress: <strong className="text-white">{currentStreak}</strong> of {nextMilestone.days} Days
                </span>
                <span className="text-amber-400 font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden relative">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400 transition-all duration-700 relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  <span className="absolute right-0 top-0 bottom-0 w-2 bg-white/40 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Right reward pill box & quick actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 lg:w-72">
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 space-y-2">
              <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
                <span>Unlockables Preview</span>
                <span className="text-emerald-400 font-bold">+{nextMilestone.xpReward} XP</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${nextMilestone.accentColor} flex items-center justify-center text-slate-950 font-bold shadow-lg shrink-0`}>
                  {renderMilestoneIcon(nextMilestone.iconType, 'w-5 h-5 text-slate-950')}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">
                    {nextMilestone.badgeName}
                  </div>
                  <div className="text-xs font-kannada text-emerald-400 truncate">
                    {nextMilestone.badgeKannada}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedMilestone(nextMilestone)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
              >
                <span>View Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {onNavigateToPractice && (
                <button
                  onClick={onNavigateToPractice}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Practice Now</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Timeline Track */}
      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-mono uppercase tracking-wider">Milestone Timeline</span>
          <span className="text-[11px] text-slate-500">Click any milestone card to inspect rewards & proverbs</span>
        </div>

        {/* Scrollable / Responsive Stepper Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {STREAK_MILESTONES.map((milestone, index) => {
            const isCompleted = currentStreak >= milestone.days;
            const isCurrentTarget = milestone.days === nextMilestone.days && !isCompleted;
            const isSelected = selectedMilestone?.days === milestone.days;

            return (
              <button
                key={milestone.days}
                onClick={() => setSelectedMilestone(milestone)}
                className={`group relative text-left p-4 rounded-2xl transition-all duration-300 border flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-emerald-400 border-emerald-500 bg-slate-900 shadow-lg'
                    : isCurrentTarget
                    ? 'border-amber-500/80 bg-gradient-to-b from-amber-950/40 to-slate-950/90 shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:border-amber-400'
                    : isCompleted
                    ? 'border-emerald-500/30 bg-emerald-950/20 hover:border-emerald-500/60'
                    : 'border-slate-800/80 bg-slate-950/60 opacity-70 hover:opacity-100 hover:border-slate-700'
                }`}
              >
                {/* Top Badge: Days & Status Icon */}
                <div className="flex items-center justify-between gap-1 mb-3">
                  <div
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                      isCurrentTarget
                        ? 'bg-amber-500 text-slate-950'
                        : isCompleted
                        ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {milestone.days} DAYS
                  </div>

                  <div className="shrink-0">
                    {isCompleted ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 fill-emerald-500/30" />
                      </span>
                    ) : isCurrentTarget ? (
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center animate-pulse">
                        <Target className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-slate-600 flex items-center justify-center">
                        <Lock className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Milestone Kannada & English Titles */}
                <div className="space-y-1 mb-3">
                  <div className="text-base font-bold font-kannada text-white group-hover:text-emerald-300 transition-colors">
                    {milestone.kannadaTitle}
                  </div>
                  <div className="text-xs font-semibold text-slate-300 truncate">
                    {milestone.englishTitle}
                  </div>
                </div>

                {/* Reward XP & Icon Footer */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="font-mono text-emerald-400 font-bold">
                    +{milestone.xpReward} XP
                  </span>
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      isCompleted
                        ? 'text-emerald-400 bg-emerald-950/60'
                        : isCurrentTarget
                        ? 'text-amber-400 bg-amber-950/60'
                        : 'text-slate-600 bg-slate-900'
                    }`}
                  >
                    {renderMilestoneIcon(milestone.iconType, 'w-3.5 h-3.5')}
                  </div>
                </div>

                {/* Status indicator line at bottom */}
                <div
                  className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full ${
                    isCompleted
                      ? 'bg-emerald-500'
                      : isCurrentTarget
                      ? 'bg-amber-500 animate-pulse'
                      : 'bg-transparent'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail Modal when a milestone is clicked */}
      {selectedMilestone && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedMilestone(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl bg-slate-900 border-2 border-slate-700 p-6 md:p-8 space-y-6 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient decorative glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Close button */}
            <button
              onClick={() => setSelectedMilestone(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${selectedMilestone.accentColor} flex items-center justify-center text-slate-950 shadow-lg shrink-0`}
              >
                {renderMilestoneIcon(selectedMilestone.iconType, 'w-8 h-8 text-slate-950')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                    {selectedMilestone.days}-DAY MILESTONE
                  </span>
                  {currentStreak >= selectedMilestone.days ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      UNLOCKED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
                      {Math.max(0, selectedMilestone.days - currentStreak)} DAYS TO GO
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold font-kannada text-white">
                  {selectedMilestone.kannadaTitle}
                </h3>
                <p className="text-sm text-slate-300 font-medium">
                  {selectedMilestone.englishTitle} ({selectedMilestone.transliteration})
                </p>
              </div>
            </div>

            {/* Rewards Breakdown */}
            <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 space-y-3">
              <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Rewards & Perks Breakdown
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] text-slate-400">XP Bonus</div>
                  <div className="text-xl font-bold font-mono text-emerald-400">
                    +{selectedMilestone.xpReward} XP
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[11px] text-slate-400">Badge Title</div>
                  <div className="text-sm font-bold text-amber-300 truncate">
                    {selectedMilestone.badgeName}
                  </div>
                  <div className="text-xs font-kannada text-slate-400 truncate">
                    {selectedMilestone.badgeKannada}
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-300 pt-1 flex items-start gap-2">
                <Gift className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{selectedMilestone.perkDescription}</span>
              </div>
            </div>

            {/* Cultural Proverb / Inspirational Kannada Note */}
            <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-950/70 border border-emerald-500/30 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
                  ಕನ್ನಡ ಗಾದೆ (Kannada Proverb)
                </span>
                <button
                  onClick={() => handleSpeak(selectedMilestone.proverbKannada)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-200 text-xs transition-colors cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isPlayingAudio ? 'Playing...' : 'ಕೇಳಿ (Listen)'}</span>
                </button>
              </div>

              <div className="text-lg font-bold font-kannada text-white">
                "{selectedMilestone.proverbKannada}"
              </div>
              <div className="text-xs font-mono text-emerald-400/90">
                {selectedMilestone.proverbTransliteration}
              </div>
              <div className="text-xs text-slate-300">
                Meaning: {selectedMilestone.proverbEnglish}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSelectedMilestone(null)}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer text-center"
              >
                Close
              </button>

              {currentStreak < selectedMilestone.days && onNavigateToPractice && (
                <button
                  onClick={() => {
                    setSelectedMilestone(null);
                    onNavigateToPractice();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Practice Towards Goal</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
