import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Volume2,
  Trash2,
  Sparkles,
  ArrowRight,
  Mic,
  BookmarkPlus,
  ShieldAlert,
  Info
} from 'lucide-react';
import { MistakeRecord } from '../types';
import { api } from '../services/api';

interface MistakeCoachViewProps {
  onSpeak: (text: string) => void;
  onLaunchPractice: (target: {
    kannada: string;
    transliteration: string;
    english: string;
  }) => void;
  onSavePhrase?: (phrase: {
    kannada: string;
    transliteration: string;
    english: string;
    category: string;
  }) => void;
}

export const MistakeCoachView: React.FC<MistakeCoachViewProps> = ({
  onSpeak,
  onLaunchPractice,
  onSavePhrase
}) => {
  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [clearing, setClearing] = useState<boolean>(false);

  useEffect(() => {
    loadMistakes();
  }, []);

  const loadMistakes = async () => {
    try {
      setLoading(true);
      const data = await api.getMistakes();
      setMistakes(data);
    } catch (err) {
      console.error('Failed to load mistakes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteMistake(id);
      setMistakes(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error('Failed to delete mistake record:', err);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Clear all logged pronunciation mistakes and practice records?')) return;
    setClearing(true);
    try {
      await api.clearMistakes();
      setMistakes([]);
    } catch (err) {
      console.error('Failed to clear mistakes:', err);
    } finally {
      setClearing(false);
    }
  };

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
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Targeted Revision Engine • ಉಚ್ಚಾರಣೆ ತಿದ್ದುಪಡಿ</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              Personal Mistake Coach
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Real-time diagnosis of mispronounced words and missing grammatical endings. Every record is
              derived from your actual microphone attempts, highlighting exact phonetic divergences.
            </p>
          </div>

          {mistakes.length > 0 && (
            <button
              onClick={handleClearAll}
              disabled={clearing}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-300 text-xs font-medium transition-colors border border-slate-700 hover:border-rose-500/40"
            >
              <Trash2 className="w-4 h-4" /> Clear All Mistakes
            </button>
          )}
        </div>
      </div>

      {mistakes.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Clean Pronunciation Slate!</h3>
          <p className="text-sm text-slate-400 max-w-md mt-1">
            You currently have no persistent speaking or grammar mistakes. When you practice in the Speaking
            Lab or Voice Assistant, any mispronounced words will automatically appear here for targeted drills.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs text-slate-400 flex items-center justify-between px-1">
            <span>Showing {mistakes.length} recorded pronunciation / grammar gaps:</span>
            <span>Sorted by recurrent frequency</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mistakes.map(mistake => (
              <div
                key={mistake.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {mistake.attemptCount} attempt{mistake.attemptCount > 1 ? 's' : ''} logged
                    </span>
                    <button
                      onClick={() => handleDelete(mistake.id)}
                      className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Dismiss this mistake"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Target Phrase */}
                  <div className="bg-slate-950/60 rounded-xl p-3.5 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">
                        Expected Kannada Phrase
                      </span>
                      <button
                        onClick={() => onSpeak(mistake.targetKannada)}
                        className="p-1 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition-colors"
                        title="Listen to standard pronunciation"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xl font-bold font-kannada text-white mt-1">
                      {mistake.targetKannada}
                    </div>
                    {mistake.targetTransliteration && (
                      <div className="text-xs font-mono text-emerald-300/80 mt-0.5">
                        {mistake.targetTransliteration}
                      </div>
                    )}
                  </div>

                  {/* Word Diff Comparison */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/30">
                      <span className="text-[10px] text-rose-400 uppercase tracking-wider block mb-0.5">
                        Recognized Speech
                      </span>
                      <span className="font-kannada text-rose-200 font-medium">
                        {mistake.recognizedText || '(empty audio)'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30">
                      <span className="text-[10px] text-amber-400 uppercase tracking-wider block mb-0.5">
                        Phonetic Gap
                      </span>
                      <span className="font-kannada text-amber-200 font-medium">
                        {mistake.errorWord || 'Missing word'}
                      </span>
                    </div>
                  </div>

                  {/* Phonetic Tip */}
                  <div className="mt-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-2 text-xs text-slate-300">
                    <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-teal-300">Coach Guidance:</span> Pay
                      close attention to Kannada retroflex consonants (ಟ, ಠ, ಡ, ಣ) versus dental
                      sounds (ತ, ಥ, ದ, ನ). Ensure vowel duration is clear.
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  {onSavePhrase && (
                    <button
                      onClick={() =>
                        onSavePhrase({
                          kannada: mistake.targetKannada,
                          transliteration: mistake.targetTransliteration || '',
                          english: `Target phrase for ${mistake.errorWord}`,
                          category: 'mistake_review'
                        })
                      }
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5" /> Save to Vocab
                    </button>
                  )}

                  <button
                    onClick={() =>
                      onLaunchPractice({
                        kannada: mistake.targetKannada,
                        transliteration: mistake.targetTransliteration || '',
                        english: `Drill: ${mistake.errorWord || mistake.targetKannada}`
                      })
                    }
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs shadow-md transition-all group"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Practice Drill Now</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
