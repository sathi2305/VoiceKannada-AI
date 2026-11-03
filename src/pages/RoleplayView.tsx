import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  MapPin,
  Volume2,
  Mic,
  Send,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Info,
  Coffee,
  Car,
  ShoppingBag,
  Briefcase
} from 'lucide-react';
import { RolePlayScenario, ChatMessage } from '../types';
import { MicButton } from '../components/MicButton';
import { AudioVisualizer } from '../components/AudioVisualizer';
import { speechService } from '../services/speech';
import { api } from '../services/api';

interface RoleplayViewProps {
  scenarios: RolePlayScenario[];
  onSpeak: (text: string) => void;
  onAwardXP: (amount: number, reason: string) => void;
}

const ICONS: Record<string, React.ReactNode> = {
  'rp-darshini': <Coffee className="w-5 h-5 text-amber-400" />,
  'rp-auto': <Car className="w-5 h-5 text-emerald-400" />,
  'rp-market': <ShoppingBag className="w-5 h-5 text-teal-400" />,
  'rp-office': <Briefcase className="w-5 h-5 text-cyan-400" />
};

export const RoleplayView: React.FC<RoleplayViewProps> = ({
  scenarios,
  onSpeak,
  onAwardXP
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    scenarios.length > 0 ? scenarios[0].id : 'rp-darshini'
  );
  const activeScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [micState, setMicState] = useState<'idle' | 'listening' | 'processing' | 'speaking' | 'error' | 'blocked'>('idle');
  const [interimText, setInterimText] = useState<string>('');
  const [textInput, setTextInput] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or reset scenario dialogue
  useEffect(() => {
    if (activeScenario) {
      setMessages([
        {
          id: `init-${Date.now()}`,
          role: 'assistant',
          kannada: activeScenario.initialMessage.kannada,
          transliteration: activeScenario.initialMessage.transliteration,
          english: activeScenario.initialMessage.english,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setMicState('idle');
      setTextInput('');
    }
  }, [selectedScenarioId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimText]);

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || !activeScenario) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      kannada: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setTextInput('');
    setMicState('processing');

    try {
      const history = messages.slice(-4).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        text: m.kannada
      }));

      const res = await api.sendRoleplayMessage(activeScenario.id, trimmed, history);

      const aiMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        kannada: res.kannada,
        transliteration: res.transliteration,
        english: res.english,
        grammarNotes: res.grammarNotes,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setMicState('speaking');
      onSpeak(res.kannada);
      onAwardXP(15, 'Roleplay turn completed');
    } catch (err: any) {
      console.warn('Roleplay chat error:', err);
      setMicState('error');
    }
  };

  const handleStartListening = () => {
    setInterimText('');
    speechService.startWebSpeech(false, {
      onStart: () => setMicState('listening'),
      onInterimResult: (text) => setInterimText(text),
      onFinalResult: (finalText) => {
        setInterimText('');
        handleSendMessage(finalText);
      },
      onError: () => setMicState('error'),
      onEnd: () => {
        if (micState === 'listening') setMicState('idle');
      }
    });
  };

  const handleStopListening = () => {
    speechService.stopWebSpeech();
    setMicState('idle');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Scenario Selector Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {scenarios.map(scen => {
          const isSelected = scen.id === selectedScenarioId;
          const icon = ICONS[scen.id] || <Sparkles className="w-5 h-5 text-emerald-400" />;

          return (
            <button
              key={scen.id}
              onClick={() => setSelectedScenarioId(scen.id)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                isSelected
                  ? 'bg-slate-900 border-emerald-500 shadow-md shadow-emerald-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="p-2 rounded-lg bg-slate-800/80 shrink-0">
                {icon}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">
                  {scen.title}
                </h4>
                <p className="text-xs font-kannada text-emerald-400 truncate">
                  {scen.kannadaTitle}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 truncate">
                  {scen.location}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {activeScenario && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Briefing & Cheat Sheet */}
          <div className="space-y-4 lg:col-span-1">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{activeScenario.location}</span>
              </div>
              <h3 className="text-base font-bold text-white">
                {activeScenario.title}
              </h3>
              <p className="text-xs text-slate-300">
                {activeScenario.description}
              </p>

              <div className="pt-2 border-t border-slate-800 space-y-1.5 text-xs">
                <div className="text-slate-400 font-semibold uppercase text-[10px]">Your Objective:</div>
                <p className="text-emerald-300 font-medium">{activeScenario.objective}</p>
                <div className="flex justify-between text-slate-400 text-[11px] pt-1">
                  <span>You: <strong className="text-white">{activeScenario.roleUser}</strong></span>
                  <span>AI: <strong className="text-teal-300">{activeScenario.roleAI}</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Vocabulary Cheat Sheet */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                Scenario Cheat Sheet (Click to use)
              </span>

              <div className="space-y-2">
                {activeScenario.cheatSheetPhrases.map((phrase, pidx) => (
                  <div
                    key={pidx}
                    onClick={() => handleSendMessage(phrase.kannada)}
                    className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-kannada font-bold text-sm text-white group-hover:text-emerald-300">
                        {phrase.kannada}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSpeak(phrase.kannada);
                        }}
                        className="p-1 text-slate-400 hover:text-white"
                        title="Listen"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{phrase.transliteration}</p>
                    <p className="text-[11px] text-slate-300">{phrase.english}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Roleplay Conversation Box */}
          <div className="lg:col-span-2 rounded-2xl bg-slate-900/60 border border-slate-800 p-5 flex flex-col justify-between h-[600px]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-white">Live Role-Play Dialogue</span>
              </div>
              <button
                onClick={() => {
                  setMessages([
                    {
                      id: `init-${Date.now()}`,
                      role: 'assistant',
                      kannada: activeScenario.initialMessage.kannada,
                      transliteration: activeScenario.initialMessage.transliteration,
                      english: activeScenario.initialMessage.english,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  ]);
                }}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white py-1 px-2 rounded-lg hover:bg-slate-800"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart Dialogue</span>
              </button>
            </div>

            {/* Messages list */}
            <div className="flex-1 overflow-y-auto space-y-3.5 py-4 pr-1">
              {messages.map((m) => {
                const isUser = m.role === 'user';

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-xl ${
                      isUser ? 'ml-auto' : 'mr-auto'
                    }`}
                  >
                    <span className="text-[10px] text-slate-500 mb-0.5 px-1">
                      {isUser ? activeScenario.roleUser : activeScenario.roleAI} · {m.timestamp}
                    </span>

                    <div
                      className={`p-3.5 rounded-2xl transition-all ${
                        isUser
                          ? 'bg-gradient-to-tr from-emerald-950/90 to-slate-900 border border-emerald-500/30 text-white rounded-tr-none'
                          : 'bg-slate-950/80 border border-slate-800 text-slate-100 rounded-tl-none shadow-md'
                      }`}
                    >
                      <p className="text-lg font-kannada font-semibold text-white">
                        {m.kannada}
                      </p>

                      {m.transliteration && (
                        <p className="text-xs text-emerald-400 font-mono mt-1">
                          {m.transliteration}
                        </p>
                      )}

                      {m.english && (
                        <p className="text-xs text-slate-300 mt-1 border-t border-slate-800/80 pt-1">
                          {m.english}
                        </p>
                      )}

                      {!isUser && (
                        <div className="mt-2 pt-1 border-t border-slate-800/60 flex justify-end">
                          <button
                            onClick={() => onSpeak(m.kannada)}
                            className="p-1 text-slate-400 hover:text-emerald-400 transition-colors"
                            title="Listen"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {interimText && (
                <div className="flex flex-col items-end max-w-xl ml-auto animate-pulse">
                  <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-white font-kannada text-base">
                    {interimText}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Interaction Bar */}
            <div className="pt-3 border-t border-slate-800 flex items-center gap-3">
              <button
                type="button"
                onClick={micState === 'listening' ? handleStopListening : handleStartListening}
                className={`p-3 rounded-xl transition-all ${
                  micState === 'listening'
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 animate-pulse'
                    : 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
                }`}
                title="Speak your reply in Kannada"
              >
                <Mic className="w-5 h-5" />
              </button>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(textInput);
                }}
                className="flex-1 flex gap-2"
              >
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Respond in character (or click a phrase from the cheat sheet)..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!textInput.trim()}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
