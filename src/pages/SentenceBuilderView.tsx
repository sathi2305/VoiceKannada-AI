import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Volume2,
  Sparkles,
  ArrowRight,
  Info,
  HelpCircle
} from 'lucide-react';
import { SentenceBuilderExercise } from '../types';

interface SentenceBuilderViewProps {
  exercises: SentenceBuilderExercise[];
  onSpeak: (text: string) => void;
  onAwardXP: (amount: number, reason: string) => void;
}

export const SentenceBuilderView: React.FC<SentenceBuilderViewProps> = ({
  exercises,
  onSpeak,
  onAwardXP
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentExercise = exercises[currentIndex] || exercises[0];

  const [availableWords, setAvailableWords] = useState<string[]>(
    currentExercise ? [...currentExercise.scrambledWords] : []
  );
  const [placedWords, setPlacedWords] = useState<string[]>([]);
  const [validationState, setValidationState] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [showHint, setShowHint] = useState<boolean>(false);

  // When switching exercise
  const loadExercise = (idx: number) => {
    const ex = exercises[idx];
    if (ex) {
      setCurrentIndex(idx);
      setAvailableWords([...ex.scrambledWords]);
      setPlacedWords([]);
      setValidationState('idle');
      setShowHint(false);
    }
  };

  const handlePickWord = (word: string, index: number) => {
    if (validationState === 'correct') return;
    setPlacedWords(prev => [...prev, word]);
    setAvailableWords(prev => prev.filter((_, i) => i !== index));
    setValidationState('idle');
  };

  const handleRemoveWord = (word: string, index: number) => {
    if (validationState === 'correct') return;
    setPlacedWords(prev => prev.filter((_, i) => i !== index));
    setAvailableWords(prev => [...prev, word]);
    setValidationState('idle');
  };

  const handleReset = () => {
    if (currentExercise) {
      setAvailableWords([...currentExercise.scrambledWords]);
      setPlacedWords([]);
      setValidationState('idle');
      setShowHint(false);
    }
  };

  const handleCheckOrder = () => {
    if (!currentExercise) return;
    const isCorrect =
      placedWords.length === currentExercise.correctWords.length &&
      placedWords.every((w, idx) => w === currentExercise.correctWords[idx]);

    if (isCorrect) {
      setValidationState('correct');
      onAwardXP(30, 'Sentence Builder solved');
      onSpeak(currentExercise.correctKannada);
    } else {
      setValidationState('incorrect');
    }
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % exercises.length;
    loadExercise(nextIdx);
  };

  if (!currentExercise) {
    return (
      <div className="p-8 text-center text-slate-400">
        Loading sentence building exercises...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Exercise Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold uppercase">SENTENCE BUILDER</span>
            <span>·</span>
            <span>ಪದ ಜೋಡಣೆ (Syntax Workshop)</span>
            <span>·</span>
            <span>Exercise {currentIndex + 1} of {exercises.length}</span>
          </div>
          <h2 className="text-lg font-semibold text-white mt-0.5">
            Assemble the Kannada Sentence in Correct SOV Order
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>{showHint ? 'Hide Hint' : 'Hint'}</span>
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-slate-950 font-semibold transition-colors"
          >
            <span>Next Exercise</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Target Challenge Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-[#0a1424] border border-slate-800 space-y-6 shadow-xl">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Target Meaning (ಇಂಗ್ಲಿಷ್ ಅರ್ಥ)
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            "{currentExercise.targetEnglish}"
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Build this in authentic Kannada word order (Subject + Object + Verb)
          </p>
        </div>

        {/* Hint banner */}
        {showHint && (
          <div className="p-3 bg-amber-950/40 border border-amber-800/80 rounded-xl text-xs text-amber-200 flex items-start gap-2 animate-fadeIn">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Transliteration Hint:</p>
              <p className="font-mono text-emerald-300 mt-0.5">{currentExercise.transliteration}</p>
            </div>
          </div>
        )}

        {/* Sentence Assembly Slot Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Your Sentence Assembly Area:</span>
            <span>{placedWords.length} of {currentExercise.correctWords.length} words placed</span>
          </div>

          <div
            className={`min-h-[80px] p-4 rounded-xl border-2 border-dashed flex flex-wrap items-center gap-2.5 transition-colors ${
              validationState === 'correct'
                ? 'bg-emerald-950/30 border-emerald-500/60'
                : validationState === 'incorrect'
                ? 'bg-rose-950/20 border-rose-500/50'
                : placedWords.length > 0
                ? 'bg-slate-950/70 border-slate-700'
                : 'bg-slate-950/40 border-slate-800'
            }`}
          >
            {placedWords.length === 0 ? (
              <p className="text-xs text-slate-500 italic select-none">
                Click word tiles below to place them in order here...
              </p>
            ) : (
              placedWords.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRemoveWord(word, idx)}
                  className={`px-4 py-2.5 rounded-xl font-kannada text-lg font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                    validationState === 'correct'
                      ? 'bg-emerald-600 text-slate-950'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-600'
                  }`}
                  title="Click to remove from slot"
                >
                  <span>{word}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Scrambled Word Tile Bank */}
        <div className="space-y-2">
          <div className="text-xs text-slate-400 px-1">Word Bank (Click to choose):</div>
          <div className="flex flex-wrap gap-2.5 p-4 rounded-xl bg-slate-950/40 border border-slate-800">
            {availableWords.map((word, idx) => (
              <button
                key={idx}
                onClick={() => handlePickWord(word, idx)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-emerald-900/60 hover:border-emerald-500 text-white border border-slate-700 font-kannada text-lg font-semibold transition-all shadow-md cursor-pointer active:scale-95"
              >
                {word}
              </button>
            ))}

            {availableWords.length === 0 && placedWords.length > 0 && (
              <p className="text-xs text-slate-500 italic select-none py-2">
                All words placed! Click "Check Order" to test your grammar.
              </p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Slots</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSpeak(currentExercise.correctKannada)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
              title="Listen to full sentence"
            >
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>Listen Sentence</span>
            </button>

            <button
              onClick={handleCheckOrder}
              disabled={placedWords.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Check Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* Validation Result & Linguistic Grammar Breakdown */}
      {validationState === 'correct' && (
        <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/50 space-y-4 animate-celebrate-pop">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Correct! ನಿಖರವಾದ ಕನ್ನಡ ಪದ ರಚನೆ (+30 XP)</span>
            </div>
            <span className="font-mono text-xs text-emerald-400">SOV Validated</span>
          </div>

          <div className="space-y-1">
            <p className="text-2xl font-bold font-kannada text-white">
              {currentExercise.correctKannada}
            </p>
            <p className="text-sm font-mono text-emerald-400">
              {currentExercise.transliteration}
            </p>
          </div>

          {/* Grammatical Syntax Lesson */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1.5">
            <div className="font-semibold text-white flex items-center gap-1.5">
              <Info className="w-4 h-4 text-teal-400" />
              <span>Linguistic Structure & Grammar Notes:</span>
            </div>
            <p className="leading-relaxed">{currentExercise.grammarExplanation}</p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              <span>Next Sentence Challenge</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {validationState === 'incorrect' && (
        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/80 text-xs text-rose-300 flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Word order is not quite right.</p>
              <p className="text-slate-300 mt-0.5">
                In Kannada, remember that the verb (ಕ್ರಿಯಾಪದ) usually finishes the sentence. Click tiles to re-order them and try again!
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowHint(true)}
            className="text-amber-400 hover:underline shrink-0"
          >
            Show Hint
          </button>
        </div>
      )}
    </div>
  );
};
