import React from 'react';
import {
  Settings,
  Mic,
  Volume2,
  Shield,
  Trash2,
  Sliders,
  Sparkles,
  HelpCircle,
  Check,
  Sun,
  Moon
} from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onResetAllData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetAllData
}) => {
  const isLight = settings.theme === 'light';
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Speech Providers Section */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-6">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Mic className="w-4 h-4 text-emerald-400" />
            <span>Speech Recognition (ಧ್ವನಿ ಗ್ರಹಿಕೆ)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Choose how your spoken Kannada speech is captured and transcribed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => onUpdateSettings({ speechInputMode: 'browser' })}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              settings.speechInputMode === 'browser'
                ? 'bg-slate-800/80 border-emerald-500/50 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-white">Browser Web Speech API</span>
              {settings.speechInputMode === 'browser' && (
                <span className="text-emerald-400 text-xs flex items-center gap-1 font-mono">
                  <Check className="w-3.5 h-3.5" /> Selected
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Low-latency native browser recognition configured for <code className="text-emerald-400">kn-IN</code>. Delivers instant interim speech updates.
            </p>
          </div>

          <div
            onClick={() => onUpdateSettings({ speechInputMode: 'backend' })}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              settings.speechInputMode === 'backend'
                ? 'bg-slate-800/80 border-emerald-500/50 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-white">Cloud Gemini Audio Engine</span>
              {settings.speechInputMode === 'backend' && (
                <span className="text-emerald-400 text-xs flex items-center gap-1 font-mono">
                  <Check className="w-3.5 h-3.5" /> Selected
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              High-accuracy server-side multimodal audio transcription via Gemini 3.8. Recommended for unsupported browsers.
            </p>
          </div>
        </div>
      </div>

      {/* Speech Synthesis Section */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-6">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-teal-400" />
            <span>Text-to-Speech Output (ಧ್ವನಿ ಉತ್ಪತ್ತಿ)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Select the voice synthesizer for assistant responses and phrase pronunciations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => onUpdateSettings({ speechOutputMode: 'browser' })}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              settings.speechOutputMode === 'browser'
                ? 'bg-slate-800/80 border-teal-500/50 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-white">Browser Native Voice</span>
              {settings.speechOutputMode === 'browser' && (
                <span className="text-teal-400 text-xs flex items-center gap-1 font-mono">
                  <Check className="w-3.5 h-3.5" /> Selected
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Plays locally using installed Kannada voice (or Indian phonetic engine) with zero network latency.
            </p>
          </div>

          <div
            onClick={() => onUpdateSettings({ speechOutputMode: 'backend' })}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              settings.speechOutputMode === 'backend'
                ? 'bg-slate-800/80 border-teal-500/50 shadow-sm'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-white">Gemini 3.8 Flash-Lite TTS</span>
              {settings.speechOutputMode === 'backend' && (
                <span className="text-teal-400 text-xs flex items-center gap-1 font-mono">
                  <Check className="w-3.5 h-3.5" /> Selected
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Server-generated high-fidelity audio streams for natural Kannada cadence and expressive intonation.
            </p>
          </div>
        </div>

        {/* Sliders for Rate */}
        <div className="pt-2 border-t border-slate-800 space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
              <span>Speech Playback Speed</span>
              <span className="font-mono text-emerald-400">{settings.voiceRate.toFixed(2)}x</span>
            </div>
            <input
              type="range"
              min="0.75"
              max="1.25"
              step="0.05"
              value={settings.voiceRate}
              onChange={(e) => onUpdateSettings({ voiceRate: parseFloat(e.target.value) })}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0.75x (Slow for learners)</span>
              <span>1.0x (Natural)</span>
              <span>1.25x (Fast)</span>
            </div>
          </div>
        </div>
      </div>

      {/* UI Theme Switcher */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-6">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            {isLight ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
            <span>Interface Theme Mode (ಬಣ್ಣದ ಶೈಲಿ)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Switch between Dark and Light mode to personalize your visual workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Dark Mode Option */}
          <div
            onClick={() => onUpdateSettings({ theme: 'dark' })}
            className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
              !isLight
                ? 'bg-slate-800/80 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/20'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-indigo-400">
                  <Moon className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm text-white">Dark Mode (ಗಾಢ ಶೈಲಿ)</span>
              </div>
              {!isLight && (
                <span className="text-emerald-400 text-xs flex items-center gap-1 font-mono font-medium">
                  <Check className="w-3.5 h-3.5" /> Selected
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Deep navy and slate palette with emerald accents. Eases eye strain in low-light environments.
            </p>
            {/* Visual preview swatch */}
            <div className="h-8 rounded-lg bg-[#070d19] border border-slate-800 p-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-slate-400 font-mono">Dark Navy Canvas</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-medium">ಕನ್ನಡ</span>
            </div>
          </div>

          {/* Light Mode Option */}
          <div
            onClick={() => onUpdateSettings({ theme: 'light' })}
            className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
              isLight
                ? 'bg-slate-800/80 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/20'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Sun className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm text-white">Light Mode (ಬೆಳಕಿನ ಶೈಲಿ)</span>
              </div>
              {isLight && (
                <span className="text-emerald-400 text-xs flex items-center gap-1 font-mono font-medium">
                  <Check className="w-3.5 h-3.5" /> Selected
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Crisp, high-contrast light slate canvas with vivid emerald accents for daylight clarity.
            </p>
            {/* Visual preview swatch */}
            <div className="h-8 rounded-lg bg-slate-100 border border-slate-200 p-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span className="text-[10px] text-slate-700 font-mono">Clean Slate Canvas</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">ಕನ್ನಡ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transliteration Preferences */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-6">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Display & Romanization</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure how Kannada script is transliterated into English letters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => onUpdateSettings({ transliterationStyle: 'standard' })}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              settings.transliterationStyle === 'standard'
                ? 'bg-slate-800/80 border-cyan-500/50'
                : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <span className="text-xs font-semibold text-white block mb-1">
              ISO 15919 Standard
            </span>
            <p className="text-xs text-slate-400">
              Diacritic precision (e.g. <em>Namaskāra, nīvu hēgiddīri?</em>). Highly recommended for accurate pronunciation learning.
            </p>
          </div>

          <div
            onClick={() => onUpdateSettings({ transliterationStyle: 'phonetic' })}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              settings.transliterationStyle === 'phonetic'
                ? 'bg-slate-800/80 border-cyan-500/50'
                : 'bg-slate-950/60 border-slate-800'
            }`}
          >
            <span className="text-xs font-semibold text-white block mb-1">
              Casual English Phonetic
            </span>
            <p className="text-xs text-slate-400">
              Simple Latin letters without macrons (e.g. <em>Namaskara, neevu hegiddiri?</em>).
            </p>
          </div>
        </div>
      </div>

      {/* Privacy & Microphone Security Disclosure */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-3">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Microphone & Data Privacy Disclosure</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong>Voice of Kannada</strong> is committed to strict privacy and data minimization:
        </p>
        <ul className="list-disc list-inside text-xs text-slate-400 space-y-1 pl-1">
          <li>The microphone is accessed <em>only</em> while you actively hold or click the Push-to-Talk button or activate Continuous Mode.</li>
          <li>Raw audio buffers are transcribed in real-time and are <strong>never stored permanently</strong> on servers.</li>
          <li>All your progress, saved phrases, and conversation history are persisted in your local application database and can be cleared at any time below.</li>
        </ul>
      </div>

      {/* Danger Zone: Reset Data */}
      <div className="rounded-2xl bg-rose-950/20 border border-rose-900/40 p-6 flex items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-rose-300">
            Reset Learning Data & Conversations
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Clears all completed lessons, custom saved vocabulary, and chat history.
          </p>
        </div>
        <button
          onClick={onResetAllData}
          className="flex items-center gap-1.5 px-4 py-2 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/80 rounded-xl text-xs font-medium transition-colors cursor-pointer shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reset All Data</span>
        </button>
      </div>
    </div>
  );
};
