import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  ArrowRightLeft,
  Send,
  Trash2,
  Download,
  Copy,
  Check,
  Languages,
  User,
  Sparkles,
  Edit2
} from 'lucide-react';
import { TranslationTurn } from '../types';
import { api } from '../services/api';
import { speechService } from '../services/speech';

interface TranslatorViewProps {
  onSpeak: (text: string) => void;
  onSavePhrase?: (phrase: {
    kannada: string;
    transliteration: string;
    english: string;
    category: string;
  }) => void;
}

const CONVERSATION_PRESETS = [
  {
    title: 'Auto Rickshaw Fare',
    titleKannada: 'ಆಟೋ ಬಾಡಿಗೆ',
    speaker: 'speaker2' as const,
    sourceText: 'How much to go to Majestic railway station?'
  },
  {
    title: 'Filter Coffee Order',
    titleKannada: 'ಫಿಲ್ಟರ್ ಕಾಫಿ',
    speaker: 'speaker2' as const,
    sourceText: 'One strong filter coffee with less sugar, please.'
  },
  {
    title: 'Directions to Lalbagh',
    titleKannada: 'ಲಾಲ್‌ಬಾಗ್ ದಾರಿ',
    speaker: 'speaker1' as const,
    sourceText: 'ಇಲ್ಲಿಂದ ನೇರವಾಗಿ ಹೋಗಿ, ಸಿಗ್ನಲ್ ಹತ್ತಿರ ಎಡಕ್ಕೆ ತಿರುಗಿ.'
  }
];

export const TranslatorView: React.FC<TranslatorViewProps> = ({ onSpeak, onSavePhrase }) => {
  const [activeSpeaker, setActiveSpeaker] = useState<'speaker1' | 'speaker2'>('speaker1');
  // speaker1: Kannada speaker, speaker2: English speaker
  const [turns, setTurns] = useState<TranslationTurn[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const turnsEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    turnsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns]);

  const handleToggleMic = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      return;
    }

    const lang = activeSpeaker === 'speaker1' ? 'kn-IN' : 'en-US';
    setIsListening(true);

    speechService.startListening(
      lang,
      (transcript: string, isFinal: boolean) => {
        setInputText(transcript);
        if (isFinal) {
          setIsListening(false);
        }
      },
      (err: string) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      }
    );
  };

  const handleTranslateTurn = async (textToTranslate?: string) => {
    const raw = (textToTranslate || inputText).trim();
    if (!raw) return;

    setIsTranslating(true);
    const sourceLang = activeSpeaker === 'speaker1' ? 'kn-IN' : 'en-US';
    const targetLang = activeSpeaker === 'speaker1' ? 'en-US' : 'kn-IN';

    try {
      const result = await api.translate(raw, sourceLang, targetLang);
      const newTurn: TranslationTurn = {
        id: `turn-${Date.now()}`,
        speaker: activeSpeaker,
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
        sourceText: raw,
        translatedText: result.translatedText,
        transliteration: result.transliteration,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setTurns(prev => [...prev, newTurn]);
      setInputText('');

      // Auto-toggle speaker role for seamless dialogue
      setActiveSpeaker(prev => (prev === 'speaker1' ? 'speaker2' : 'speaker1'));

      // If translated to Kannada, speak translation
      if (targetLang === 'kn-IN') {
        onSpeak(result.translatedText);
      }
    } catch (err: any) {
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExport = () => {
    if (turns.length === 0) return;
    const content = turns
      .map(
        t =>
          `[${t.timestamp}] ${t.speaker === 'speaker1' ? 'Kannada Speaker' : 'English Speaker'}:\n` +
          `Original: ${t.sourceText}\n` +
          `Translated: ${t.translatedText}${t.transliteration ? ` (${t.transliteration})` : ''}\n`
      )
      .join('\n---\n\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kannada-translation-dialogue-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (window.confirm('Clear all conversation turns?')) {
      setTurns([]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-medium mb-2">
              <Languages className="w-3.5 h-3.5" />
              <span>Bilingual Live Dialogue • ದ್ವಿಭಾಷಾ ಸಂವಾದ</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              Two-Way Kannada-English Voice Translator
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Natural conversation bridge designed for Bengaluru and Karnataka. Speak in either Kannada or
              English, view synchronized translations with phonetic script, and hear authentic audio playback.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {turns.length > 0 && (
              <>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                  title="Export Transcript"
                >
                  <Download className="w-4 h-4" /> Export
                </button>
                <button
                  onClick={handleClear}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 transition-colors"
                  title="Clear Dialogue"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Speaker Selector Bar */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setActiveSpeaker('speaker1')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeSpeaker === 'speaker1'
              ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-500/40'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Speaker 1 (ಕನ್ನಡ)
            </span>
            {activeSpeaker === 'speaker1' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold">
                Active Turn
              </span>
            )}
          </div>
          <div className="text-base font-bold text-white font-kannada">ಕನ್ನಡ ಸ್ಪೀಕರ್ (Kannada)</div>
          <div className="text-xs text-slate-400 mt-0.5">Spoken speech in kn-IN • Translated to English</div>
        </button>

        <button
          onClick={() => setActiveSpeaker('speaker2')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeSpeaker === 'speaker2'
              ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/40'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Speaker 2 (English)
            </span>
            {activeSpeaker === 'speaker2' && (
              <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-bold">
                Active Turn
              </span>
            )}
          </div>
          <div className="text-base font-bold text-white">English Speaker</div>
          <div className="text-xs text-slate-400 mt-0.5">Spoken speech in English • Translated to Kannada</div>
        </button>
      </div>

      {/* Preset Starters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 shrink-0 font-medium">Quick Starters:</span>
        {CONVERSATION_PRESETS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              setActiveSpeaker(preset.speaker);
              setInputText(preset.sourceText);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white shrink-0 transition-colors flex items-center gap-1.5"
          >
            <span className="text-emerald-400 font-kannada">{preset.titleKannada}</span>
            <span>({preset.title})</span>
          </button>
        ))}
      </div>

      {/* Conversation Turns Thread */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 min-h-[360px] max-h-[520px] overflow-y-auto space-y-4">
        {turns.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400">
            <Languages className="w-12 h-12 text-slate-600 mb-3" />
            <h4 className="text-base font-semibold text-slate-300">No Dialogue Yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Tap the microphone or type below as Speaker 1 (Kannada) or Speaker 2 (English) to start the
              live two-way translation.
            </p>
          </div>
        ) : (
          turns.map(turn => {
            const isSpeaker1 = turn.speaker === 'speaker1';
            return (
              <div
                key={turn.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isSpeaker1
                    ? 'bg-gradient-to-r from-emerald-950/20 to-slate-900 border-emerald-500/30 ml-0 mr-8'
                    : 'bg-gradient-to-l from-cyan-950/20 to-slate-900 border-cyan-500/30 ml-8 mr-0'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span
                    className={`font-semibold flex items-center gap-1 ${
                      isSpeaker1 ? 'text-emerald-400' : 'text-cyan-400'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    {isSpeaker1 ? 'Speaker 1 (Kannada)' : 'Speaker 2 (English)'}
                  </span>
                  <span>{turn.timestamp}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Source Block */}
                  <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      Original ({isSpeaker1 ? 'Kannada' : 'English'})
                    </span>
                    <p
                      className={`text-base font-medium ${
                        isSpeaker1 ? 'font-kannada text-white' : 'text-slate-100'
                      }`}
                    >
                      {turn.sourceText}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => onSpeak(turn.sourceText)}
                        className="p-1 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition-colors"
                        title="Listen to original"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleCopy(turn.id + '-src', turn.sourceText)}
                        className="p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
                        title="Copy text"
                      >
                        {copiedId === turn.id + '-src' ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Translated Block */}
                  <div
                    className={`rounded-xl p-3 border ${
                      isSpeaker1
                        ? 'bg-teal-950/30 border-teal-500/30'
                        : 'bg-emerald-950/30 border-emerald-500/30'
                    }`}
                  >
                    <span
                      className={`text-[10px] uppercase tracking-wider block mb-1 ${
                        isSpeaker1 ? 'text-teal-400' : 'text-emerald-400'
                      }`}
                    >
                      Translated ({isSpeaker1 ? 'English' : 'Kannada'})
                    </span>
                    <p
                      className={`text-base font-medium ${
                        isSpeaker1 ? 'text-slate-100' : 'font-kannada text-white'
                      }`}
                    >
                      {turn.translatedText}
                    </p>
                    {turn.transliteration && (
                      <div className="text-xs font-mono text-emerald-300/80 mt-1">
                        {turn.transliteration}
                      </div>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSpeak(turn.translatedText)}
                          className="p-1 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Listen to translation"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCopy(turn.id + '-trn', turn.translatedText)}
                          className="p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Copy translation"
                        >
                          {copiedId === turn.id + '-trn' ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {onSavePhrase && !isSpeaker1 && (
                        <button
                          onClick={() =>
                            onSavePhrase({
                              kannada: turn.translatedText,
                              transliteration: turn.transliteration || '',
                              english: turn.sourceText,
                              category: 'translator'
                            })
                          }
                          className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20"
                        >
                          + Save to Vocab
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={turnsEndRef} />
      </div>

      {/* Input Composer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                activeSpeaker === 'speaker1' ? 'bg-emerald-400' : 'bg-cyan-400'
              }`}
            />
            <span className="font-semibold text-slate-200">
              Speaking as {activeSpeaker === 'speaker1' ? 'Speaker 1 (Kannada)' : 'Speaker 2 (English)'}
            </span>
          </div>
          <button
            onClick={() => setActiveSpeaker(prev => (prev === 'speaker1' ? 'speaker2' : 'speaker1'))}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" /> Switch Speaker
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleMic}
            className={`p-3.5 rounded-2xl transition-all shadow-md shrink-0 ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse shadow-rose-900/50'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
            }`}
            title={isListening ? 'Stop listening' : 'Start speech recognition'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleTranslateTurn();
            }}
            placeholder={
              activeSpeaker === 'speaker1'
                ? 'ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ (Type or speak in Kannada)...'
                : 'Speak or type in English...'
            }
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors font-medium"
          />

          <button
            onClick={() => handleTranslateTurn()}
            disabled={!inputText.trim() || isTranslating}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:pointer-events-none text-white font-medium text-sm shadow-lg shadow-emerald-950/40 transition-all shrink-0"
          >
            {isTranslating ? (
              <span className="inline-block animate-spin">⌛</span>
            ) : (
              <Send className="w-4 h-4" />
            )}
            Translate
          </button>
        </div>
      </div>
    </div>
  );
};
