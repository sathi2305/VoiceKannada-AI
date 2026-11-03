import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Send,
  Volume2,
  VolumeX,
  RotateCcw,
  Copy,
  Bookmark,
  BookmarkCheck,
  Trash2,
  Sparkles,
  Info,
  Radio,
  AlertCircle,
  FileText,
  Lightbulb,
  X,
  Layers,
  ChevronDown,
  Edit3,
  Check,
  Compass,
  MessageSquare,
  GraduationCap
} from 'lucide-react';
import { ChatMessage, AssistantMode } from '../types';
import { MicButton } from '../components/MicButton';
import { AudioVisualizer } from '../components/AudioVisualizer';
import { VirtualTutor } from '../components/VirtualTutor';
import { RealisticHumanTutor3D } from '../components/RealisticHumanTutor3D';
import { speechService } from '../services/speech';
import { api } from '../services/api';

interface AssistantViewProps {
  onSpeak: (text: string) => void;
  onStopAudio: () => void;
  isAudioPlaying: boolean;
  onSavePhrase: (phrase: { kannada: string; transliteration: string; english: string; category?: string }) => void;
  savedPhraseKeys: Set<string>;
}

const MODES_CONFIG: Array<{ id: AssistantMode; label: string; kannadaLabel: string; hint: string }> = [
  { id: 'conversation', label: 'Free Conversation', kannadaLabel: 'ಮುಕ್ತ ಸಂಭಾಷಣೆ', hint: 'Natural open-ended discussion' },
  { id: 'kannada_tutor', label: 'Kannada Tutor', kannadaLabel: 'ಕನ್ನಡ ಗುರು', hint: 'Step-by-step instruction & vocab breakdown' },
  { id: 'daily_practice', label: 'Daily Practice', kannadaLabel: 'ದಿನನಿತ್ಯದ ಅಭ್ಯಾಸ', hint: 'Short guided everyday questions' },
  { id: 'roleplay', label: 'Role-Play', kannadaLabel: 'ಸನ್ನಿವೇಶ ಅಭಿನಯ', hint: 'Simulated everyday Karnataka situations' },
  { id: 'translator', label: 'Translation Assistant', kannadaLabel: 'ಅನುವಾದಕ', hint: 'Bilingual translations with semantic nuances' },
  { id: 'interview_prep', label: 'Interview Practice', kannadaLabel: 'ಸಂದರ್ಶನ ತಯಾರಿ', hint: 'Professional intro and interview questions' },
  { id: 'travel_companion', label: 'Travel Companion', kannadaLabel: 'ಪ್ರಯಾಣ ಒಡನಾಡಿ', hint: 'Metro, auto, directions & route assistance' },
  { id: 'grammar_coach', label: 'Grammar Coach', kannadaLabel: 'ವ್ಯಾಕರಣ ತರಬೇತಿ', hint: 'SOV word order, vibhakti cases & conjugation' }
];

const SUGGESTED_STARTERS: Record<AssistantMode, string[]> = {
  conversation: [
    'ನೀವು ಹೇಗಿದ್ದೀರಿ? (How are you?)',
    'ಬೆಂಗಳೂರಿನ ಇತಿಹಾಸ ಹೇಳಿ (Tell me about Bengaluru)',
    'ಕನ್ನಡ ಭಾಷೆಯ ವಿಶೇಷತೆ ಏನು? (What is special about Kannada?)'
  ],
  kannada_tutor: [
    'ಕನ್ನಡದಲ್ಲಿ ಶುಭೋದಯ ಹೇಳುವುದು ಹೇಗೆ? (How to say Good Morning?)',
    'ಕನ್ನಡ ವಿಭಕ್ತಿ ಪ್ರತ್ಯಯಗಳನ್ನು ವಿವರಿಸಿ (Explain Kannada vibhakti cases)',
    'ದಿನನಿತ್ಯ ಬಳಸುವ 5 ಪದಗಳನ್ನು ಹೇಳಿಕೊಡಿ (Teach 5 daily words)'
  ],
  daily_practice: [
    'ಇವತ್ತು ಹವಾಮಾನ ಹೇಗಿದೆ? (How is the weather today?)',
    'ನೀವು ಏನು ತಿಂಡಿ ತಿಂದಿರಿ? (What did you have for breakfast?)',
    'ನನ್ನ ಉಚ್ಚಾರಣೆಯನ್ನು ಪರೀಕ್ಷಿಸಿ (Test my pronunciation)'
  ],
  roleplay: [
    'ಹೊಟೇಲ್‌ನಲ್ಲಿ ಮಸಾಲೆ ದೋಸೆ ಆರ್ಡರ್ ಮಾಡುವುದು (Ordering Dosa in hotel)',
    'ಆಟೋ ಚಾಲಕರೊಂದಿಗೆ ಚೌಕಾಶಿ (Bargaining with auto driver)',
    'ತರಕಾರಿ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಖರೀದಿ (Buying in vegetable market)'
  ],
  translator: [
    'Translate: "Where is the nearest metro station?" to Kannada',
    '"ಬಹಳ ಧನ್ಯವಾದಗಳು" ಪದದ ಇಂಗ್ಲಿಷ್ ಅರ್ಥವೇನು?',
    'Translate: "I would like a cup of filter coffee, please"'
  ],
  interview_prep: [
    'ನನ್ನ ಪರಿಚಯ ಮಾಡಿಕೊಳ್ಳುವುದು ಹೇಗೆ? (How to introduce myself?)',
    'ನಿಮ್ಮ ಅನುಭವದ ಬಗ್ಗೆ ಹೇಳಿ (Tell about your experience)',
    'ಕನ್ನಡದಲ್ಲಿ ಸಂದರ್ಶನ ಪ್ರಶ್ನೆಗಳಿಗೆ ಅಭ್ಯಾಸ (Practice interview questions)'
  ],
  travel_companion: [
    'ಮೆಜೆಸ್ಟಿಕ್ ಬಸ್ ನಿಲ್ದಾಣಕ್ಕೆ ಹೋಗುವ ದಾರಿ ಯಾವುದು? (Route to Majestic)',
    'ಮೆಟ್ರೋ ಟಿಕೆಟ್ ಕೌಂಟರ್ ಎಲ್ಲಿದೆ? (Where is the metro ticket counter?)',
    'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ ಎಲ್ಲಿದೆ? (Where is the nearest hospital?)'
  ],
  grammar_coach: [
    'ಕನ್ನಡ ಕರ್ತೃ-ಕರ್ಮ-ಕ್ರಿಯಾ ಜೋಡಣೆ ನಿಯಮ (Explain Kannada SOV order)',
    'ಪ್ರಶ್ನಾರ್ಥಕ ವಾಕ್ಯಗಳನ್ನು ಹೇಗೆ ರಚಿಸುವುದು? (How to form question sentences?)',
    'ಭೂತಕಾಲ ಮತ್ತು ಭವಿಷ್ಯತ್ಕಾಲ ರೂಪಗಳು (Past and future tense forms)'
  ]
};

export const AssistantView: React.FC<AssistantViewProps> = ({
  onSpeak,
  onStopAudio,
  isAudioPlaying,
  onSavePhrase,
  savedPhraseKeys
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      kannada: 'ನಮಸ್ಕಾರ! ನಾನು "ಕನ್ನಡದ ಧ್ವನಿ" AI ಸಹಾಯಕ. ನೀವು ನನ್ನೊಂದಿಗೆ ಕನ್ನಡದಲ್ಲಿ ಮುಕ್ತವಾಗಿ ಮಾತನಾಡಬಹುದು. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?',
      transliteration: 'Namaskāra! Nānu "Kannaḍada Dhvani" AI sahāyaka. Nīvu nannondige kannaḍadalli muktavāgi mātanāḍabahudu. Nānu nimage hēge sahāya māḍali?',
      english: 'Hello! I am "Voice of Kannada" AI assistant. You can speak freely with me in Kannada. How can I help you today?',
      grammarNotes: '"ಮುಕ್ತವಾಗಿ" (muktavāgi) means "freely", and "ಸಹಾಯ ಮಾಡಲಿ" means "how shall I help".',
      suggestedReplies: [
        'ನನಗೆ ಬೆಂಗಳೂರಿನಲ್ಲಿ ಆಟೋ ಚಾಲಕರೊಂದಿಗೆ ಮಾತನಾಡಲು ಹೇಳಿಕೊಡಿ',
        'ನೀವು ಹೇಗಿದ್ದೀರಿ?',
        'ಕನ್ನಡ ಕಲಿಯಲು ನನಗೆ ಸುಲಭವಾದ ಉಪಾಯಗಳನ್ನು ತಿಳಿಸಿ'
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputMode, setInputMode] = useState<'pushtotalk' | 'continuous'>('pushtotalk');
  const [micState, setMicState] = useState<'idle' | 'listening' | 'processing' | 'speaking' | 'error' | 'blocked'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [editableTranscript, setEditableTranscript] = useState<string>('');
  const [isEditingTranscript, setIsEditingTranscript] = useState<boolean>(false);
  const [textInput, setTextInput] = useState<string>('');
  const [assistantMode, setAssistantMode] = useState<AssistantMode>('conversation');
  const [responseLength, setResponseLength] = useState<'concise' | 'detailed'>('detailed');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Summarize state
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);
  const [summaryData, setSummaryData] = useState<{
    summaryKannada: string;
    summaryEnglish: string;
    keyTakeaways: string[];
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, interimTranscript]);

  // Sync micState with audio playback
  useEffect(() => {
    if (isAudioPlaying) {
      setMicState('speaking');
    } else if (micState === 'speaking') {
      setMicState('idle');
    }
  }, [isAudioPlaying]);

  const handleStartListening = () => {
    setErrorMessage(null);
    setInterimTranscript('');
    setEditableTranscript('');
    setIsEditingTranscript(false);

    const success = speechService.startWebSpeech(inputMode === 'continuous', {
      onStart: () => {
        setMicState('listening');
      },
      onInterimResult: (text) => {
        setInterimTranscript(text);
        setEditableTranscript(text);
      },
      onFinalResult: (finalText) => {
        setInterimTranscript('');
        setEditableTranscript(finalText);
        // If continuous, submit immediately; otherwise let user review/send
        if (inputMode === 'continuous') {
          handleSendMessage(finalText);
        }
      },
      onError: (err, code) => {
        setErrorMessage(err);
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

  const handleStopListening = () => {
    speechService.stopWebSpeech();
    setMicState('idle');
  };

  const handleMicClick = () => {
    if (micState === 'listening') {
      handleStopListening();
    } else if (micState === 'speaking') {
      onStopAudio();
      setMicState('idle');
    } else {
      handleStartListening();
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      kannada: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setTextInput('');
    setEditableTranscript('');
    setIsEditingTranscript(false);
    setMicState('processing');
    setErrorMessage(null);

    try {
      const history = messages.slice(-6).map(m => ({
        role: m.role === 'assistant' ? ('model' as const) : ('user' as const),
        text: m.kannada
      }));

      const res = await api.sendChatMessage(trimmed, history, assistantMode, 'english', responseLength);

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        kannada: res.kannada,
        transliteration: res.transliteration,
        english: res.english,
        grammarNotes: res.grammarNotes,
        correction: res.correction,
        suggestedReplies: res.suggestedReplies || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
      setMicState('speaking');
      onSpeak(res.kannada);
    } catch (err: any) {
      console.error('Send message error:', err);
      setErrorMessage(err?.message || 'Response delayed. Switched to offline assistant.');
      setMicState('idle');

      const fallbackMsg: ChatMessage = {
        id: `asst-fb-${Date.now()}`,
        role: 'assistant',
        kannada: 'ನಮಸ್ಕಾರ! ಕನ್ನಡ ಸಂಭಾಷಣೆ ಮತ್ತು ಕಲಿಕೆಯಲ್ಲಿ ನಾನು ನಿಮ್ಮೊಂದಿಗೆ ಇದ್ದೇನೆ. ನೀವು ಏನು ಕಲಿಯಲು ಬಯಸುತ್ತೀರಿ?',
        transliteration: 'Namaskāra! Kannaḍa sambhāṣaṇe mattu kalikeyalli nānu nimmondige iddēne. Nīvu ēnu kaliyalu bayasuttīri?',
        english: 'Hello! I am here with you for Kannada conversation and learning. What would you like to learn?',
        suggestedReplies: [
          'ಕನ್ನಡ ಕಲಿಯಲು ಸಹಾಯ ಮಾಡಿ (Help me learn Kannada)',
          'ನೀವು ಹೇಗಿದ್ದೀರಿ? (How are you?)',
          'ದಿನನಿತ್ಯದ ಮಾತುಗಳು (Daily phrases)'
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    }
  };

  const handleReplayLastResponse = () => {
    const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
    if (lastAssistantMsg) {
      onSpeak(lastAssistantMsg.kannada);
    }
  };

  const handleSummarize = async () => {
    if (messages.length <= 1) return;
    setIsSummarizing(true);
    try {
      const summary = await api.summarizeChat(
        messages.map(m => ({ role: m.role, kannada: m.kannada, english: m.english }))
      );
      setSummaryData(summary);
    } catch (err: any) {
      alert(`Summarization error: ${err.message}`);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveConversation = async () => {
    if (messages.length <= 1) return;
    try {
      const title = messages[1]?.kannada.slice(0, 30) || 'Kannada Chat Session';
      await api.saveConversation({ title, mode: assistantMode, messages });
      alert('Conversation saved to History!');
    } catch (err: any) {
      alert(`Could not save conversation: ${err.message}`);
    }
  };

  const handleClearConversation = () => {
    if (window.confirm('Clear all conversation messages?')) {
      onStopAudio();
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: 'assistant',
          kannada: 'ಸಂಭಾಷಣೆಯನ್ನು ಮರುಹೊಂದಿಸಲಾಗಿದೆ. ಹೊಸ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ!',
          transliteration: 'Sambhāṣaṇeyannu maruhondisalāgide. Hosa praśneyannu kēḷi!',
          english: 'Conversation has been cleared. Ask a new question or speak in Kannada!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const currentModeInfo = MODES_CONFIG.find(m => m.id === assistantMode) || MODES_CONFIG[0];
  const starters = SUGGESTED_STARTERS[assistantMode] || SUGGESTED_STARTERS.conversation;

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-4">
      {/* Permission / Error Guidance Banner */}
      {errorMessage && (
        <div className="p-3 bg-rose-950/50 border border-rose-800/80 rounded-2xl text-xs text-rose-300 flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Speech Recognition Notice</p>
              <p className="text-slate-300 mt-0.5">{errorMessage}</p>
            </div>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-slate-400 hover:text-white font-mono p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* 3-Zone Immersive Grid Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ===================================================================
            ZONE 1 (LEFT): Conversation Modes, System Presets & Actions (3 cols)
           =================================================================== */}
        <div className="lg:col-span-3 space-y-4">
          {/* Active Mode Card */}
          <div className="p-4 rounded-2xl bg-[#04111F]/80 border border-[#00D9FF]/20 backdrop-blur-xl shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono tracking-wider uppercase text-[#00E6A0] font-bold">
                Assistant Mode
              </span>
              <span className="text-xs font-kannada text-[#00D9FF] font-medium">
                {currentModeInfo.kannadaLabel}
              </span>
            </div>

            <div className="space-y-1.5">
              {MODES_CONFIG.map((m) => {
                const isActive = assistantMode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setAssistantMode(m.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#071D32] border border-[#00E6A0]/40 text-[#F1F7FF] font-semibold shadow-[0_0_15px_rgba(0,230,160,0.15)]'
                        : 'text-[#9BB1C8] hover:bg-[#071D32]/50 hover:text-[#F1F7FF] border border-transparent'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="truncate">{m.label}</p>
                      <p className="text-[10px] text-slate-400 font-kannada truncate -mt-0.5">
                        {m.kannadaLabel}
                      </p>
                    </div>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00E6A0] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Conversation Starters */}
          <div className="p-4 rounded-2xl bg-[#04111F]/70 border border-[#00D9FF]/15 backdrop-blur-xl space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F1F7FF]">
              <Sparkles className="w-3.5 h-3.5 text-[#00E6A0]" />
              <span>Suggested Starters</span>
            </div>
            <div className="space-y-1.5">
              {starters.map((starter, sidx) => (
                <button
                  key={sidx}
                  onClick={() => handleSendMessage(starter)}
                  className="w-full text-left p-2 rounded-lg bg-[#071D32]/40 hover:bg-[#071D32] border border-slate-800 hover:border-[#00E6A0]/30 text-[11px] text-[#9BB1C8] hover:text-[#F1F7FF] transition-all cursor-pointer"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>

          {/* Session Controls: Length, Summarize & Save */}
          <div className="p-4 rounded-2xl bg-[#04111F]/70 border border-[#00D9FF]/15 backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between text-xs text-[#9BB1C8]">
              <span>Response Length:</span>
              <div className="flex items-center p-0.5 bg-[#071D32] rounded-lg border border-slate-800 text-[11px]">
                <button
                  onClick={() => setResponseLength('concise')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    responseLength === 'concise' ? 'bg-[#00E6A0]/20 text-[#00E6A0] font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Concise
                </button>
                <button
                  onClick={() => setResponseLength('detailed')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    responseLength === 'detailed' ? 'bg-[#00E6A0]/20 text-[#00E6A0] font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Detailed
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleSummarize}
                disabled={messages.length <= 1 || isSummarizing}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#071D32] hover:bg-[#092540] disabled:opacity-40 text-xs text-[#00D9FF] font-medium border border-[#00D9FF]/20 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{isSummarizing ? 'Summarizing...' : 'Summarize'}</span>
              </button>

              <button
                onClick={handleSaveConversation}
                disabled={messages.length <= 1}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#071D32] hover:bg-[#092540] disabled:opacity-40 text-xs text-[#F1F7FF] font-medium border border-slate-700 transition-colors cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#00E6A0]" />
                <span>Save Chat</span>
              </button>
            </div>

            <button
              onClick={handleClearConversation}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs text-rose-400/80 hover:text-rose-300 hover:bg-rose-950/30 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Conversation</span>
            </button>
          </div>
        </div>

        {/* ===================================================================
            ZONE 2 (CENTER): Signature 3D Voice Core, Mic Controls & Transcript (5 cols)
           =================================================================== */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Main 3D Centerpiece Stage */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#04111F] via-[#071D32]/80 to-[#04111F] border border-[#00D9FF]/25 p-6 flex flex-col items-center justify-center shadow-[0_10px_40px_rgba(4,17,31,0.9)] overflow-hidden min-h-[460px]">
            {/* Background lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00E6A0]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Input Mode Selector (Push-to-Talk vs Continuous Hands-free) */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1 p-1 bg-[#04111F]/80 rounded-xl border border-[#00D9FF]/20 text-xs backdrop-blur-md">
              <button
                onClick={() => {
                  handleStopListening();
                  setInputMode('pushtotalk');
                }}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  inputMode === 'pushtotalk'
                    ? 'bg-[#00E6A0]/20 text-[#00E6A0] font-semibold border border-[#00E6A0]/40'
                    : 'text-[#9BB1C8] hover:text-[#F1F7FF]'
                }`}
              >
                Push-to-Talk
              </button>
              <button
                onClick={() => {
                  handleStopListening();
                  setInputMode('continuous');
                }}
                className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                  inputMode === 'continuous'
                    ? 'bg-[#00D9FF]/20 text-[#00D9FF] font-semibold border border-[#00D9FF]/40'
                    : 'text-[#9BB1C8] hover:text-[#F1F7FF]'
                }`}
              >
                <Radio className="w-3 h-3 text-[#00D9FF] animate-pulse" />
                <span>Hands-Free</span>
              </button>
            </div>

            {/* Quick Playback Actions */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
              {isAudioPlaying && (
                <button
                  onClick={onStopAudio}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-300 text-xs animate-pulse hover:bg-rose-900 transition-colors"
                  title="Stop audio playback"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop</span>
                </button>
              )}
              <button
                onClick={handleReplayLastResponse}
                className="p-1.5 rounded-lg bg-[#071D32]/80 border border-slate-700 text-[#9BB1C8] hover:text-[#00E6A0] transition-colors"
                title="Replay last assistant response"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* VirtualTutor with AnimationController (Skeletal Animations & Morph Targets) */}
            <div className="w-full max-w-[290px] h-[310px] sm:h-[340px] my-2 rounded-2xl overflow-hidden border border-[#00D9FF]/25 bg-gradient-to-b from-[#04111F]/90 to-[#071D32]/80 flex items-center justify-center relative shadow-[0_0_25px_rgba(0,230,160,0.1)]">
              <VirtualTutor
                size="100%"
                state={micState}
                isSpeechPlaying={isAudioPlaying}
                audioLevel={isAudioPlaying ? 0.65 : 0}
                interactive={true}
                onClick={handleMicClick}
                showStatusLabel={true}
                showCameraControls={true}
                showActionControls={false}
              />
            </div>

            {/* Audio Waveform Meter */}
            <div className="w-full max-w-xs mt-2">
              <AudioVisualizer state={micState} barsCount={28} />
            </div>

            {/* Center Microphone Activation Button */}
            <div className="mt-4 flex flex-col items-center gap-2">
              <MicButton
                state={micState}
                isContinuous={inputMode === 'continuous'}
                onClick={handleMicClick}
                onMouseDown={inputMode === 'pushtotalk' ? handleStartListening : undefined}
                onMouseUp={inputMode === 'pushtotalk' ? handleStopListening : undefined}
              />
              <p className="text-[11px] text-[#9BB1C8] font-mono">
                {micState === 'listening'
                  ? 'Listening to Kannada speech... (ಮಾತನಾಡಿ)'
                  : micState === 'processing'
                  ? 'Gemini 3.8 Flash is thinking...'
                  : micState === 'speaking'
                  ? 'Speaking response in Kannada...'
                  : inputMode === 'pushtotalk'
                  ? 'Hold or click to speak in Kannada'
                  : 'Hands-free voice mode active'}
              </p>
            </div>
          </div>

          {/* Editable Live Transcript / Text Submission Box */}
          <div className="p-4 rounded-2xl bg-[#04111F]/80 border border-[#00D9FF]/20 backdrop-blur-xl space-y-3">
            {/* Header: Transcript Title and Edit Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#F1F7FF]">
                <Edit3 className="w-3.5 h-3.5 text-[#00D9FF]" />
                <span>Recognized Speech & Input (ಧ್ವನಿ ಪಠ್ಯ)</span>
              </div>
              {editableTranscript && (
                <button
                  onClick={() => setIsEditingTranscript(!isEditingTranscript)}
                  className="text-[11px] text-[#00E6A0] hover:underline cursor-pointer flex items-center gap-1"
                >
                  {isEditingTranscript ? 'Done Editing' : 'Edit Before Send'}
                </button>
              )}
            </div>

            {/* Transcript Preview or Edit Area */}
            {editableTranscript ? (
              <div className="space-y-2">
                {isEditingTranscript ? (
                  <textarea
                    value={editableTranscript}
                    onChange={(e) => setEditableTranscript(e.target.value)}
                    rows={2}
                    className="w-full bg-[#071D32] border border-[#00E6A0]/40 rounded-xl p-3 text-sm font-kannada text-white focus:outline-none focus:border-[#00E6A0]"
                  />
                ) : (
                  <div className="p-3 rounded-xl bg-[#071D32]/60 border border-slate-800 text-sm font-kannada text-[#F1F7FF] flex items-center justify-between">
                    <span>{editableTranscript}</span>
                    <button
                      onClick={() => setEditableTranscript('')}
                      className="text-xs text-slate-500 hover:text-rose-400 ml-2"
                      title="Clear transcript"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleSendMessage(editableTranscript)}
                    disabled={micState === 'processing'}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00E6A0] to-[#00D9FF] text-[#04111F] font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Verified Speech</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Text Input fallback bar */
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(textInput);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={`Type in Kannada or English (${currentModeInfo.label})...`}
                  className="flex-1 bg-[#071D32]/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-[#F1F7FF] placeholder-[#9BB1C8] focus:outline-none focus:border-[#00E6A0] transition-colors"
                />
                <button
                  type="submit"
                  disabled={!textInput.trim() || micState === 'processing'}
                  className="px-4 py-2.5 bg-[#00E6A0] hover:bg-[#00c98b] disabled:bg-slate-800 disabled:text-slate-600 text-[#04111F] font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ===================================================================
            ZONE 3 (RIGHT): Live Conversation Stream & Intel Hub (4 cols)
           =================================================================== */}
        <div className="lg:col-span-4 flex flex-col h-[680px] rounded-3xl bg-[#04111F]/80 border border-[#00D9FF]/20 backdrop-blur-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-3.5 border-b border-slate-800/80 bg-[#071D32]/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#00E6A0]" />
              <span className="text-xs font-semibold text-[#F1F7FF]">Conversation Stream</span>
            </div>
            <span className="text-[11px] font-mono text-[#9BB1C8]">
              {messages.length} {messages.length === 1 ? 'Turn' : 'Turns'}
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              const isSaved = savedPhraseKeys.has(msg.kannada.trim());

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
                >
                  {/* Author & Time */}
                  <div className="flex items-center gap-1.5 text-[10px] text-[#9BB1C8] px-1 font-mono">
                    <span>{isUser ? 'You (ನೀವು)' : 'AI Voice of Kannada'}</span>
                    <span>·</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`p-3.5 rounded-2xl max-w-[92%] transition-all ${
                      isUser
                        ? 'bg-gradient-to-br from-[#071D32] to-[#04111F] border border-[#00E6A0]/40 text-[#F1F7FF] rounded-tr-none shadow-md'
                        : 'bg-[#071D32]/90 border border-slate-800 text-[#F1F7FF] rounded-tl-none shadow-md'
                    }`}
                  >
                    {/* Gentle Correction Note if present */}
                    {msg.correction && (
                      <div className="mb-2 p-2 rounded-lg bg-amber-950/40 border border-amber-800/60 text-xs text-amber-200 flex items-start gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{msg.correction}</span>
                      </div>
                    )}

                    {/* Kannada Script (Primary) */}
                    <p className="text-base font-kannada font-medium leading-relaxed text-[#F1F7FF]">
                      {msg.kannada}
                    </p>

                    {/* Transliteration */}
                    {msg.transliteration && (
                      <p className="text-xs text-[#00E6A0] font-mono mt-1">
                        {msg.transliteration}
                      </p>
                    )}

                    {/* English Translation */}
                    {msg.english && (
                      <p className="text-xs text-[#9BB1C8] mt-1.5 border-t border-slate-800/60 pt-1.5">
                        {msg.english}
                      </p>
                    )}

                    {/* Grammar & Cultural Notes */}
                    {msg.grammarNotes && (
                      <div className="mt-2 p-2 rounded-lg bg-[#04111F]/70 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-1.5">
                        <Info className="w-3 h-3 text-[#00D9FF] shrink-0 mt-0.5" />
                        <p>{msg.grammarNotes}</p>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center gap-3 mt-2.5 pt-2 border-t border-slate-800/50 text-[11px] text-[#9BB1C8]">
                      <button
                        onClick={() => onSpeak(msg.kannada)}
                        className="flex items-center gap-1 hover:text-[#00E6A0] transition-colors py-0.5 cursor-pointer"
                        title="Listen in Kannada"
                      >
                        <Volume2 className="w-3 h-3 text-[#00E6A0]" />
                        <span>Listen</span>
                      </button>

                      <button
                        onClick={() => handleCopy(msg.id, msg.kannada)}
                        className="flex items-center gap-1 hover:text-white transition-colors py-0.5 cursor-pointer"
                        title="Copy text"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>

                      {!isUser && (
                        <button
                          onClick={() =>
                            onSavePhrase({
                              kannada: msg.kannada,
                              transliteration: msg.transliteration || '',
                              english: msg.english || '',
                              category: 'assistant'
                            })
                          }
                          className="flex items-center gap-1 hover:text-[#00D9FF] transition-colors py-0.5 cursor-pointer"
                          title={isSaved ? 'Saved in Vocabulary' : 'Save to Vocabulary'}
                        >
                          {isSaved ? (
                            <>
                              <BookmarkCheck className="w-3 h-3 text-[#00E6A0]" />
                              <span className="text-[#00E6A0]">Saved</span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="w-3 h-3" />
                              <span>Save</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Suggested Follow-up Replies */}
                  {!isUser && msg.suggestedReplies && msg.suggestedReplies.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1 max-w-[92%]">
                      {msg.suggestedReplies.map((reply, ridx) => (
                        <button
                          key={ridx}
                          onClick={() => handleSendMessage(reply)}
                          className="text-[11px] px-2 py-0.5 rounded-lg bg-[#071D32] hover:bg-[#071D32]/80 border border-slate-800 text-[#9BB1C8] hover:text-[#00E6A0] hover:border-[#00E6A0]/40 transition-colors text-left font-kannada cursor-pointer"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Live interim transcript bubble */}
            {interimTranscript && (
              <div className="flex flex-col items-end animate-pulse">
                <span className="text-[10px] text-[#00E6A0] mb-0.5 font-mono">Listening...</span>
                <div className="p-3 rounded-2xl bg-[#00E6A0]/10 border border-[#00E6A0]/40 text-[#F1F7FF] font-kannada text-sm">
                  {interimTranscript}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Conversation Summary Modal */}
      {summaryData && (
        <div className="fixed inset-0 z-50 bg-[#04111F]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#071D32] border border-[#00D9FF]/30 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 animate-celebrate-pop relative">
            <button
              onClick={() => setSummaryData(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[#00E6A0] font-bold text-base">
              <FileText className="w-5 h-5 text-[#00D9FF]" />
              <span>Conversation Summary (ಸಾರಾಂಶ)</span>
            </div>

            <div className="p-4 rounded-xl bg-[#04111F]/80 border border-slate-800 space-y-2">
              <p className="text-base font-kannada font-semibold text-white">
                {summaryData.summaryKannada}
              </p>
              <p className="text-xs text-[#9BB1C8]">
                {summaryData.summaryEnglish}
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-mono uppercase text-[#00D9FF] font-bold">Key Takeaways Learned:</span>
              <ul className="space-y-1">
                {summaryData.keyTakeaways.map((point, pidx) => (
                  <li key={pidx} className="text-xs text-[#F1F7FF] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E6A0]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSummaryData(null)}
                className="px-5 py-2.5 bg-gradient-to-r from-[#00E6A0] to-[#00D9FF] text-[#04111F] font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
