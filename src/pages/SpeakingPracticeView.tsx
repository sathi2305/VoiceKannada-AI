import React, { useState, useEffect } from 'react';
import {
  Volume2,
  RotateCcw,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Bookmark,
  BookmarkCheck,
  ListFilter
} from 'lucide-react';
import { MicButton } from '../components/MicButton';
import { AudioVisualizer } from '../components/AudioVisualizer';
import { speechService } from '../services/speech';
import { compareSpeechTranscript } from '../utils/textComparison';
import { PracticeComparisonResult, LessonPhrase } from '../types';
import { api } from '../services/api';

interface SpeakingPracticeViewProps {
  onSpeak: (text: string) => void;
  onStopAudio: () => void;
  isAudioPlaying: boolean;
  initialTarget?: {
    kannada: string;
    transliteration: string;
    english: string;
  };
  onSavePhrase: (phrase: { kannada: string; transliteration: string; english: string; category?: string }) => void;
  savedPhraseKeys: Set<string>;
}

const DEFAULT_PRACTICE_PHRASES: Array<{
  id: string;
  kannada: string;
  transliteration: string;
  english: string;
  category: string;
}> = [
  {
    id: 'pr-1',
    kannada: 'ನಮಸ್ಕಾರ, ನೀವು ಹೇಗಿದ್ದೀರಿ?',
    transliteration: 'Namaskāra, nīvu hēgiddīri?',
    english: 'Hello, how are you doing?',
    category: 'basics'
  },
  {
    id: 'pr-2',
    kannada: 'ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ, ಧನ್ಯವಾದಗಳು',
    transliteration: 'Nānu cennāgiddēne, dhan\'yavādagaḷu',
    english: 'I am doing well, thank you',
    category: 'basics'
  },
  {
    id: 'pr-3',
    kannada: 'ಮೀಟರ್ ಹಾಕಿ ಅಣ್ಣ',
    transliteration: 'Meter hāki aṇṇa',
    english: 'Turn on the fare meter, brother',
    category: 'travel'
  },
  {
    id: 'pr-4',
    kannada: 'ಇದರ ಬೆಲೆ ಎಷ್ಟು?',
    transliteration: 'Idara bele eṣṭu?',
    english: 'How much does this cost?',
    category: 'shopping'
  },
  {
    id: 'pr-5',
    kannada: 'ಬಿಸಿ ಫಿಲ್ಟರ್ ಕಾಫಿ ಕೊಡಿ',
    transliteration: 'Bisi filter coffee koḍi',
    english: 'Please give me hot filter coffee',
    category: 'food'
  },
  {
    id: 'pr-6',
    kannada: 'ನನಗೆ ಕನ್ನಡ ಕಲಿಯಲು ಇಷ್ಟ',
    transliteration: 'Nanage kannada kaliyalu iṣṭa',
    english: 'I love learning Kannada',
    category: 'daily'
  }
];

export const SpeakingPracticeView: React.FC<SpeakingPracticeViewProps> = ({
  onSpeak,
  onStopAudio,
  isAudioPlaying,
  initialTarget,
  onSavePhrase,
  savedPhraseKeys
}) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState<number>(0);
  const [customTarget, setCustomTarget] = useState<string>('');
  const [targetPhrase, setTargetPhrase] = useState(
    initialTarget || DEFAULT_PRACTICE_PHRASES[0]
  );

  const [micState, setMicState] = useState<'idle' | 'listening' | 'processing' | 'speaking' | 'error' | 'blocked'>('idle');
  const [interimText, setInterimText] = useState<string>('');
  const [recognizedTranscript, setRecognizedTranscript] = useState<string>('');
  const [comparisonResult, setComparisonResult] = useState<PracticeComparisonResult | null>(null);
  const [recordingError, setRecordingError] = useState<string | null>(null);

  // When initialTarget changes from outside props
  useEffect(() => {
    if (initialTarget && initialTarget.kannada) {
      setTargetPhrase(initialTarget);
      setRecognizedTranscript('');
      setComparisonResult(null);
    }
  }, [initialTarget]);

  // Sync micState with audio playback
  useEffect(() => {
    if (isAudioPlaying) {
      setMicState('speaking');
    } else if (micState === 'speaking') {
      setMicState('idle');
    }
  }, [isAudioPlaying]);

  const handleStartRecording = () => {
    setRecordingError(null);
    setInterimText('');
    setRecognizedTranscript('');
    setComparisonResult(null);

    const success = speechService.startWebSpeech(false, {
      onStart: () => {
        setMicState('listening');
      },
      onInterimResult: (text) => {
        setInterimText(text);
      },
      onFinalResult: async (finalText) => {
        setInterimText('');
        setRecognizedTranscript(finalText);
        setMicState('processing');

        // Execute grounded text & phonetic comparison
        const result = compareSpeechTranscript(targetPhrase.kannada, finalText);
        setComparisonResult(result);
        setMicState('idle');

        // Persist practice attempt to backend
        try {
          await api.recordPracticeAttempt({
            phraseId: (targetPhrase as any).id || 'custom',
            targetText: targetPhrase.kannada,
            recognizedText: finalText,
            matchRatio: result.matchRatio,
            matchedWords: result.matchedWords,
            missingWords: result.missingWords,
            feedback: result.feedback
          });
        } catch (err) {
          console.warn('Could not persist practice attempt:', err);
        }
      },
      onError: (err, code) => {
        setRecordingError(err);
        setMicState(code === 'not-allowed' ? 'blocked' : 'error');
      },
      onEnd: () => {
        if (micState === 'listening') {
          setMicState('idle');
        }
      }
    });

    if (!success) {
      setMicState('error');
    }
  };

  const handleStopRecording = () => {
    speechService.stopWebSpeech();
    setMicState('idle');
  };

  const handleNextPhrase = () => {
    const nextIdx = (currentPhraseIndex + 1) % DEFAULT_PRACTICE_PHRASES.length;
    setCurrentPhraseIndex(nextIdx);
    setTargetPhrase(DEFAULT_PRACTICE_PHRASES[nextIdx]);
    setRecognizedTranscript('');
    setInterimText('');
    setComparisonResult(null);
    setRecordingError(null);
  };

  const handleApplyCustomTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTarget.trim()) return;
    setTargetPhrase({
      kannada: customTarget.trim(),
      transliteration: 'Custom phrase',
      english: 'Custom user-entered Kannada phrase'
    });
    setCustomTarget('');
    setRecognizedTranscript('');
    setComparisonResult(null);
  };

  const isSaved = savedPhraseKeys.has(targetPhrase.kannada.trim());

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Phrase Carousel & Selection Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold">SPEAKING PRACTICE</span>
            <span>·</span>
            <span>Target Phrase {currentPhraseIndex + 1} of {DEFAULT_PRACTICE_PHRASES.length}</span>
          </div>
          <h2 className="text-lg font-semibold text-white mt-0.5">
            Pronounce the Kannada Phrase
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleNextPhrase}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors cursor-pointer"
          >
            <span>Next Exercise</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Target Phrase Hero Card */}
      <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-[#0a1322] border border-slate-800 p-6 md:p-8 space-y-5 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Target Kannada Script (ಉದ್ದೇಶಿತ ವಾಕ್ಯ)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSpeak(targetPhrase.kannada)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 text-xs font-medium transition-colors"
              title="Listen to pristine Kannada reference"
            >
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>Listen Reference</span>
            </button>

            <button
              onClick={() =>
                onSavePhrase({
                  kannada: targetPhrase.kannada,
                  transliteration: targetPhrase.transliteration,
                  english: targetPhrase.english,
                  category: 'practice'
                })
              }
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              title={isSaved ? 'Saved in Vocabulary' : 'Save to Vocabulary'}
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-emerald-400" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Big Kannada Display */}
        <div className="space-y-2 text-center py-4">
          <h1 className="text-3xl md:text-4xl font-bold font-kannada text-white tracking-wide">
            {targetPhrase.kannada}
          </h1>
          <p className="text-base text-emerald-400 font-mono">
            {targetPhrase.transliteration}
          </p>
          <p className="text-sm text-slate-300">
            "{targetPhrase.english}"
          </p>
        </div>

        {/* Audio Visualizer */}
        <div className="flex justify-center pt-2">
          <AudioVisualizer state={micState} barsCount={20} />
        </div>

        {/* Microphone Recording Station */}
        <div className="pt-2 flex flex-col items-center justify-center">
          <MicButton
            state={micState}
            isContinuous={false}
            onClick={micState === 'listening' ? handleStopRecording : handleStartRecording}
            label={
              micState === 'listening'
                ? 'Listening... Click to finish'
                : 'Click or hold to speak target phrase'
            }
          />
        </div>

        {/* Error notification */}
        {recordingError && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{recordingError}</span>
          </div>
        )}

        {/* Live Interim Speech Preview */}
        {interimText && (
          <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/40 text-center animate-pulse">
            <span className="text-[11px] text-slate-400 block">Recognizing Spoken Words...</span>
            <p className="text-xl font-kannada text-emerald-300 mt-1">{interimText}</p>
          </div>
        )}
      </div>

      {/* Side-by-Side Grounded Comparison Panel */}
      {comparisonResult && (
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              {comparisonResult.isFullMatch ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-400" />
              )}
              <h3 className="text-base font-semibold text-white">
                Speech Recognition & Comparison Analysis
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Grounded Token Alignment
            </span>
          </div>

          {/* Side by side columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Target Column */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase">
                Expected Target Phrase
              </span>
              <p className="text-xl font-kannada font-semibold text-white">
                {targetPhrase.kannada}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {comparisonResult.detailedTokens.map((tok, tidx) => (
                  <span
                    key={tidx}
                    className={`px-2 py-0.5 rounded text-xs font-kannada ${
                      tok.matched
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-950/50 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {tok.matched ? '✓ ' : '✗ '}
                    {tok.targetWord}
                  </span>
                ))}
              </div>
            </div>

            {/* Recognized Column */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase">
                Recognized Spoken Transcript
              </span>
              <p className="text-xl font-kannada font-semibold text-emerald-300">
                {comparisonResult.recognizedText || '(Silence / No words recognized)'}
              </p>
              <div className="flex items-center gap-2 pt-2 text-xs text-slate-400">
                <span>Matched words: <strong className="text-white">{comparisonResult.matchedWords.length}</strong></span>
                <span>·</span>
                <span>Missing: <strong className="text-amber-400">{comparisonResult.missingWords.length}</strong></span>
              </div>
            </div>
          </div>

          {/* Transparent Feedback Message */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              comparisonResult.isFullMatch
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-300'
            }`}
          >
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Evaluation Feedback</p>
              <p className="text-xs text-slate-300">{comparisonResult.feedback}</p>
              <p className="text-[11px] text-slate-400 pt-1">
                *Note: Analysis is strictly based on direct string & token alignment with zero fabricated scores.
              </p>
            </div>
          </div>

          {/* Practice Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleStartRecording}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>

            <button
              onClick={handleNextPhrase}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>Next Exercise</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Custom Phrase Entry Option */}
      <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800 space-y-2">
        <span className="text-xs text-slate-400 block font-medium">
          Practice a Custom Kannada Word or Sentence:
        </span>
        <form onSubmit={handleApplyCustomTarget} className="flex gap-2">
          <input
            type="text"
            value={customTarget}
            onChange={(e) => setCustomTarget(e.target.value)}
            placeholder="Type any Kannada sentence (e.g., 'ನನಗೆ ಬಿಸಿ ನೀರು ಬೇಕು')..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!customTarget.trim()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-medium rounded-xl transition-colors"
          >
            Set Custom Target
          </button>
        </form>
      </div>
    </div>
  );
};
