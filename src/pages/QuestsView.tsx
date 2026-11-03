import React, { useState, useEffect } from 'react';
import {
  Trophy,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Flame,
  Award,
  Clock,
  Compass,
  Zap,
  Gift
} from 'lucide-react';
import { Quest, NavTab } from '../types';
import { api } from '../services/api';

interface QuestsViewProps {
  onNavigate: (tab: NavTab) => void;
  onAwardXP: (amount: number, reason: string) => void;
}

export const QuestsView: React.FC<QuestsViewProps> = ({ onNavigate, onAwardXP }) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTier, setActiveTier] = useState<'all' | 'daily' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [justClaimedId, setJustClaimedId] = useState<string | null>(null);

  useEffect(() => {
    loadQuests();
  }, []);

  const loadQuests = async () => {
    try {
      setLoading(true);
      const data = await api.getQuests();
      setQuests(data);
    } catch (err) {
      console.error('Failed to load quests:', err);
    } finally {
      setLoading(false);
    }
  };

  const [claimedIds, setClaimedIds] = useState<Set<string>>(new Set());

  const handleClaim = async (quest: Quest) => {
    if (!quest.isCompleted || claimedIds.has(quest.id)) return;
    setClaimingId(quest.id);
    try {
      const res = await api.claimQuest(quest.id);
      onAwardXP(res.xpEarned, `Quest Reward: ${quest.title}`);
      setJustClaimedId(quest.id);
      setClaimedIds(prev => new Set(prev).add(quest.id));
      setTimeout(() => setJustClaimedId(null), 3000);
    } catch (err) {
      console.error('Failed to claim quest:', err);
    } finally {
      setClaimingId(null);
    }
  };

  const handleAdvanceManually = async (questId: string) => {
    try {
      const updated = await api.advanceQuest(questId, 1);
      setQuests(prev => prev.map(q => (q.id === questId ? updated : q)));
    } catch (err) {
      console.error('Failed to advance quest:', err);
    }
  };

  const filteredQuests = quests.filter(q => {
    if (activeTier === 'all') return true;
    return q.category === activeTier;
  });

  const completedCount = quests.filter(q => q.isCompleted || claimedIds.has(q.id)).length;
  const totalXPAvailable = quests.reduce((acc, q) => acc + q.xpReward, 0);
  const totalXPEarned = quests
    .filter(q => claimedIds.has(q.id))
    .reduce((acc, q) => acc + q.xpReward, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium mb-2">
              <Trophy className="w-3.5 h-3.5" />
              <span>Quest-Based Language Missions • ಕನ್ನಡ ಅಭಿಯಾನಗಳು</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              Learning Quests & Milestones
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Complete guided real-world missions—from ordering Bengaluru morning coffee and deciphering
              Metro signboards to speaking with authentic polite honorifics.
            </p>
          </div>

          {/* Stats Widget */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-center min-w-[100px]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Missions</span>
              <span className="text-lg font-bold text-emerald-400">
                {completedCount}/{quests.length}
              </span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-center min-w-[110px]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">XP Claimed</span>
              <span className="text-lg font-bold text-teal-400">
                {totalXPEarned} / {totalXPAvailable}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Quests', count: quests.length },
          { id: 'daily', label: 'Daily Challenges', count: quests.filter(q => q.category === 'daily').length },
          { id: 'beginner', label: 'Beginner Quests', count: quests.filter(q => q.category === 'beginner').length },
          { id: 'intermediate', label: 'Intermediate', count: quests.filter(q => q.category === 'intermediate').length },
          { id: 'advanced', label: 'Advanced Scholar', count: quests.filter(q => q.category === 'advanced').length }
        ].map(tier => (
          <button
            key={tier.id}
            onClick={() => setActiveTier(tier.id as any)}
            className={`px-4 py-2 rounded-xl font-medium shrink-0 transition-all flex items-center gap-2 ${
              activeTier === tier.id
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>{tier.label}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-800/80 text-emerald-300">
              {tier.count}
            </span>
          </button>
        ))}
      </div>

      {/* Quests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQuests.map(quest => {
          const isCompleted = quest.isCompleted;
          const isClaimed = claimedIds.has(quest.id);
          const isLocked = !quest.isUnlocked;
          const isJustClaimed = justClaimedId === quest.id;
          const progressPercent = Math.min(100, Math.round((quest.currentSteps / quest.totalSteps) * 100));

          return (
            <div
              key={quest.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isJustClaimed
                  ? 'animate-celebrate-pop ring-2 ring-emerald-400 bg-emerald-950/50 border-emerald-400'
                  : isClaimed
                  ? 'bg-slate-900/40 border-slate-800/60 opacity-80'
                  : isCompleted
                  ? 'bg-gradient-to-br from-emerald-950/40 to-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-950/30'
                  : isLocked
                  ? 'bg-slate-950/40 border-slate-900 opacity-60'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        quest.category === 'daily'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : quest.category === 'beginner'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : quest.category === 'intermediate'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      {quest.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {quest.currentSteps}/{quest.totalSteps}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    +{quest.xpReward} XP
                  </div>
                </div>

                {/* Title & Description */}
                <div className="mt-1">
                  <h3 className="text-base font-bold text-white font-kannada">
                    {quest.titleKannada}
                  </h3>
                  <h4 className="text-sm font-semibold text-slate-200 mt-0.5">
                    {quest.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {quest.description}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Mission Progress</span>
                    <span className="font-mono text-emerald-400">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isClaimed
                          ? 'bg-slate-600'
                          : isCompleted
                          ? 'bg-gradient-to-r from-emerald-400 to-teal-300'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                {isClaimed ? (
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Reward Claimed
                  </span>
                ) : isCompleted ? (
                  <button
                    onClick={() => handleClaim(quest)}
                    disabled={claimingId === quest.id}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all animate-pulse"
                  >
                    <Gift className="w-4 h-4" />
                    Claim +{quest.xpReward} XP Reward!
                  </button>
                ) : isLocked ? (
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-slate-400" /> Locked until previous tiers are unlocked
                  </span>
                ) : (
                  <div className="flex items-center gap-2 w-full">
                    <button
                      onClick={() => onNavigate(quest.actionTab)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-medium text-xs transition-colors"
                    >
                      <span>Start Mission</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleAdvanceManually(quest.id)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                      title="Log completed step"
                    >
                      +1 Step
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
