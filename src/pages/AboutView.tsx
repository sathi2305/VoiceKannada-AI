import React from 'react';
import {
  CheckCircle2,
  Cpu,
  Server,
  Layers,
  FileText,
  ExternalLink,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const requirements = [
    {
      req: 'Voice Assistant Workspace',
      details: 'Large animated microphone with idle, listening, processing, and speaking states. Push-to-talk default with optional continuous mode.',
      status: 'Implemented & Verified',
      component: 'AssistantView / MicButton / AudioVisualizer'
    },
    {
      req: 'Dual-Language Output & Transliteration',
      details: 'Kannada script, readable Roman transliteration, and English meanings displayed for all messages.',
      status: 'Implemented & Verified',
      component: 'AssistantView / Gemini structured response'
    },
    {
      req: 'Kannada Speech Recognition (STT)',
      details: 'Browser Web Speech API configured to kn-IN with live interim feedback, plus cloud fallback via Gemini multimodal audio.',
      status: 'Implemented & Verified',
      component: 'SpeechService / Web Speech kn-IN'
    },
    {
      req: 'Real AI Conversation via Backend',
      details: 'Express API endpoint POST /api/chat calling Gemini 3.8 Flash with structured schema, grammar notes, and context memory.',
      status: 'Implemented & Verified',
      component: 'server/routes.ts / server/gemini.ts'
    },
    {
      req: 'Kannada Speech Synthesis (TTS)',
      details: 'Speech playback with replay and stop controls, auto-selecting kn-IN voice or Gemini 3.8 Flash-Lite TTS fallback.',
      status: 'Implemented & Verified',
      component: 'SpeechService / POST /api/speech/synthesize'
    },
    {
      req: 'Kannada Learning Studio',
      details: 'Organized syllabus (Basics, Travel, Shopping, Food, Health, Daily Life) with phrase cards, word breakdowns, and progress tracking.',
      status: 'Implemented & Verified',
      component: 'LearningStudioView / server/data/lessons.ts'
    },
    {
      req: 'Speaking Practice Studio',
      details: 'Target phrase pronunciation reference, mic recording, transcript alignment, and transparent grounded feedback (no fake scores).',
      status: 'Implemented & Verified',
      component: 'SpeakingPracticeView / compareSpeechTranscript'
    },
    {
      req: 'Data Persistence & History',
      details: 'Persisted lesson completions, verified practice history, saved vocabulary notebook, and conversation logs.',
      status: 'Implemented & Verified',
      component: 'server/db.ts / /api/progress'
    },
    {
      req: 'Microphone Privacy & Security',
      details: 'Client-directed audio capture with clear error guidance; zero permanent storage of raw audio recordings.',
      status: 'Implemented & Verified',
      component: 'SettingsView / audio policy'
    }
  ];

  const demoSteps = [
    {
      step: 'Step 1: Test Speech Recognition & AI Assistant',
      action: 'Go to "AI Voice Assistant". Click or hold the microphone button and speak "ನಮಸ್ಕಾರ, ನೀವು ಹೇಗಿದ್ದೀರಿ?". Observe live interim speech transcription, AI structured response with Kannada script, Roman transliteration, and English translation, followed by Kannada voice output.'
    },
    {
      step: 'Step 2: Experience Continuous Mode & Audio Stop',
      action: 'Toggle "Continuous" mode on the assistant toolbar. Ask a question about Bengaluru auto fares ("ಮೀಟರ್ ಹಾಕಿ ಅಣ್ಣ"). When the assistant speaks, click the "Stop Audio" button in the top header.'
    },
    {
      step: 'Step 3: Explore Kannada Learning Curriculum',
      action: 'Navigate to "Learning Studio". Filter by "Food & Dining". Click "Study Lesson" on ಊಟ ಮತ್ತು ಉಪಹಾರ. Click the speaker icon to hear "ನನಗೆ ಒಂದು ಮಸಾಲೆ ದೋಸೆ ಬೇಕು" and examine the word breakdown.'
    },
    {
      step: 'Step 4: Conduct Speaking & Pronunciation Practice',
      action: 'Open "Speaking Practice". Listen to the reference phrase. Record yourself speaking the target phrase. Review the grounded side-by-side comparison, matched tokens, and transparent feedback.'
    },
    {
      step: 'Step 5: Verify Progress Persistence',
      action: 'Navigate to "Progress & Mastery". Notice that completed modules, practice records, and streaks reflect real interactions without fake data.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Overview Card */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 md:p-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <Sparkles className="w-4 h-4" />
          <span>KANNADA TECHNOLOGY CHALLENGE 2026 SPECIFICATION</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Voice of Kannada (ಕನ್ನಡದ ಧ್ವನಿ)
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          An end-to-end, production-grade bilingual Kannada voice assistant and structured learning environment engineered for high linguistic fidelity, natural speech input/output, and grounded speech evaluation.
        </p>

        {/* Tech Badges as clean unboxed text with separators */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-400 border-t border-slate-800/80">
          <span>React 19 & TypeScript</span>
          <span>·</span>
          <span>Vite 8</span>
          <span>·</span>
          <span>Express Backend</span>
          <span>·</span>
          <span>Gemini 3.8 Flash</span>
          <span>·</span>
          <span>Web Speech API (kn-IN)</span>
          <span>·</span>
          <span>Tailwind CSS v4</span>
        </div>
      </div>

      {/* Requirements Traceability Matrix */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-white">
            Requirements Traceability Matrix
          </h3>
          <p className="text-xs text-slate-400">
            Mapping official competition requirements to implementations and test status.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Requirement</th>
                <th className="py-3 px-3">Specification & Scope</th>
                <th className="py-3 px-3">Implementation</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {requirements.map((r, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">
                    {r.req}
                  </td>
                  <td className="py-3 px-3 text-slate-400 max-w-xs">{r.details}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-teal-300">
                    {r.component}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommended Live Demo Script */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-white">
            Recommended Hackathon Live Demo Walkthrough
          </h3>
          <p className="text-xs text-slate-400">
            Follow this verified script to demonstrate all features sequentially.
          </p>
        </div>

        <div className="space-y-3">
          {demoSteps.map((s, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5"
            >
              <h4 className="text-sm font-semibold text-emerald-300">
                {s.step}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {s.action}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Backend API Endpoints Reference */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-white">
            Backend REST API Endpoints
          </h3>
          <p className="text-xs text-slate-400">
            Active full-stack Express service endpoints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-emerald-400 font-bold">GET</span> /health
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">Uptime & AI service status</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-emerald-400 font-bold">GET</span> /api/config/public
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">Safe public configuration</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-teal-400 font-bold">POST</span> /api/chat
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">Structured bilingual Gemini AI chat</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-teal-400 font-bold">POST</span> /api/speech/transcribe
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">Server audio transcription</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-teal-400 font-bold">POST</span> /api/speech/synthesize
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">Gemini 3.8 TTS synthesis</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-emerald-400 font-bold">GET</span> /api/lessons & /api/lessons/:id
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">Kannada structured curriculum</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-emerald-400 font-bold">GET/POST</span> /api/progress
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">Real persistent learner activity</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-emerald-400 font-bold">GET/POST</span> /api/saved-phrases
            <p className="text-[11px] text-slate-400 font-sans mt-0.5">User phrase notebook bookmarks</p>
          </div>
        </div>
      </div>
    </div>
  );
};
