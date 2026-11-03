import React, { useState } from 'react';
import {
  Volume2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Headphones
} from 'lucide-react';
import { ListeningExercise } from '../types';

interface ListeningComprehensionViewProps {
  exercises: ListeningExercise[];
  onSpeak: (text: string) => void;
  onAwardXP: (amount: number, reason: string) => void;
}

export const ListeningComprehensionView: React.FC<ListeningComprehensionViewProps> = ({
  exercises,
  onSpeak,
  onAwardXP
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const current = exercises[currentIndex] || exercises[0];

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [revealTranscript, setRevealTranscript] = useState<boolean>(false);

  const handleSelectOption = (idx: number) => {
    if (hasSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null || hasSubmitted) return;
    setHasSubmitted(true);
    setRevealTranscript(true);

    if (selectedOption === current.correctIndex) {
      onAwardXP(40, 'Listening Comprehension Solved');
    }
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % exercises.length;
    setCurrentIndex(nextIdx);
    setSelectedOption(null);
    setHasSubmitted(false);
    setRevealTranscript(false);
  };

  if (!current) {
    return (
      <div className="p-8 text-center text-slate-400">
        Loading listening comprehension exercises...
      </div>
    );
  }

  const isCorrect = selectedOption === current.correctIndex;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-teal-400 font-semibold uppercase">LISTENING STUDIO</span>
            <span>·</span>
            <span>ಆಲಿಸುವಿಕೆ ಮತ್ತು ಗ್ರಹಿಕೆ</span>
            <span>·</span>
            <span>Exercise {currentIndex + 1} of {exercises.length}</span>
          </div>
          <h2 className="text-lg font-semibold text-white mt-0.5">
            {current.title}
          </h2>
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
        >
          <span>Next Challenge</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Audio Listening Station Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-[#0a1424] border border-slate-800 space-y-6 text-center shadow-xl">
        <div className="space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Listen to Spoken Kannada Audio
          </span>
          <p className="text-xs text-slate-400">
            Listen carefully to the Kannada phrase before answering the comprehension question.
          </p>
        </div>

        {/* Big Central Audio Trigger */}
        <div className="py-4 flex flex-col items-center justify-center gap-3">
          <button
            onClick={() => onSpeak(current.kannadaAudioText)}
            className="w-20 h-20 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-400 text-slate-950 flex items-center justify-center shadow-[0_0_30px_rgba(20,184,166,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Play Kannada audio"
            aria-label="Play Kannada audio"
          >
            <Volume2 className="w-9 h-9" />
          </button>
          <span className="text-xs font-medium text-teal-300">
            Click to Play Kannada Speech (ಆಲಿಸಿ)
          </span>
        </div>

        {/* Peek Transcript toggle */}
        <div className="pt-2 border-t border-slate-800 flex justify-center">
          <button
            onClick={() => setRevealTranscript(!revealTranscript)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors py-1 px-3 rounded-lg hover:bg-slate-800"
          >
            {revealTranscript ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{revealTranscript ? 'Hide Kannada Transcript' : 'Peek Transcript (ಪ್ರತಿಲೇಖನ ನೋಡಿ)'}</span>
          </button>
        </div>

        {/* Revealed Transcript Box */}
        {revealTranscript && (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-left animate-fadeIn">
            <span className="text-[11px] font-mono text-slate-500 uppercase">Spoken Kannada:</span>
            <p className="text-xl font-bold font-kannada text-white">{current.kannadaAudioText}</p>
            <p className="text-xs text-emerald-400 font-mono">{current.transliteration}</p>
            <p className="text-xs text-slate-300 pt-1 border-t border-slate-800/80">{current.englishMeaning}</p>
          </div>
        )}
      </div>

      {/* Comprehension Question & Options */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Comprehension Question
          </span>
          <h3 className="text-base font-semibold text-white mt-1">
            {current.question}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {current.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            let optionStyle = 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-200';

            if (hasSubmitted) {
              if (idx === current.correctIndex) {
                optionStyle = 'bg-emerald-950/50 border-emerald-500 text-emerald-300 font-semibold';
              } else if (isSelected && idx !== current.correctIndex) {
                optionStyle = 'bg-rose-950/50 border-rose-500 text-rose-300';
              } else {
                optionStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-50';
              }
            } else if (isSelected) {
              optionStyle = 'bg-teal-950/60 border-teal-500 text-teal-200 font-medium shadow-sm';
            }

            return (
              <button
                key={idx}
                disabled={hasSubmitted}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-center justify-between cursor-pointer disabled:cursor-default ${optionStyle}`}
              >
                <span>{opt}</span>
                {hasSubmitted && idx === current.correctIndex && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
                {hasSubmitted && isSelected && idx !== current.correctIndex && (
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Submit or Next Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            {!hasSubmitted ? 'Select an answer above' : isCorrect ? 'Great listening!' : 'Review the explanation'}
          </div>

          {!hasSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              <span>Next Exercise</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Explanation Card */}
        {hasSubmitted && (
          <div
            className={`p-4 rounded-xl border text-xs space-y-1 animate-fadeIn ${
              isCorrect ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-slate-950/60 border-slate-800 text-slate-300'
            }`}
          >
            <div className="font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Explanation & Linguistic Insight:</span>
            </div>
            <p className="leading-relaxed">{current.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};
