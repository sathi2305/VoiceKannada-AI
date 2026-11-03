import React, { useState } from 'react';
import {
  Mic,
  BookOpen,
  Sparkles,
  ArrowRight,
  Languages,
  Eye,
  Compass,
  Trophy,
  Activity,
  Zap,
  Volume2
} from 'lucide-react';
import { NavTab, UserProgress } from '../types';
import { VirtualTutor, TutorState } from './VirtualTutor';
import { RealisticHumanTutor3D } from './RealisticHumanTutor3D';

interface CinematicHeroProps {
  onNavigate: (tab: NavTab) => void;
  progress: UserProgress | null;
  onSpeakSample?: () => void;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({
  onNavigate,
  progress,
  onSpeakSample
}) => {
  const [heroTutorState, setHeroTutorState] = useState<TutorState>('idle');
  const currentStreak = progress?.streakDays || 1;
  const currentXP = progress?.xp || 150;

  const capabilities = [
    {
      id: 'assistant' as NavTab,
      icon: <Mic className="w-4 h-4 text-[#00E6A0]" />,
      title: 'Voice AI',
      kannada: 'ಧ್ವನಿ AI',
      desc: 'Bilingual conversational tutor'
    },
    {
      id: 'learning' as NavTab,
      icon: <BookOpen className="w-4 h-4 text-[#00D9FF]" />,
      title: 'Learning Studio',
      kannada: 'ಕಲಿಕಾ ಕೇಂದ್ರ',
      desc: 'Structured curriculum & modules'
    },
    {
      id: 'practice' as NavTab,
      icon: <Sparkles className="w-4 h-4 text-[#8257FF]" />,
      title: 'Speaking Practice',
      kannada: 'ಉಚ್ಚಾರಣೆ ಅಭ್ಯಾಸ',
      desc: 'Real-time phonetics matching'
    },
    {
      id: 'vision' as NavTab,
      icon: <Eye className="w-4 h-4 text-[#00E6A0]" />,
      title: 'Camera OCR',
      kannada: 'ಚಿತ್ರ ಗುರುತಿಸುವಿಕೆ',
      desc: 'Signboard & script scanner'
    },
    {
      id: 'translator' as NavTab,
      icon: <Languages className="w-4 h-4 text-[#00D9FF]" />,
      title: 'Live Translator',
      kannada: 'ದ್ವಿಮುಖ ಅನುವಾದ',
      desc: 'Two-way Kannada-English'
    },
    {
      id: 'culture' as NavTab,
      icon: <Compass className="w-4 h-4 text-[#8257FF]" />,
      title: 'Culture Engine',
      kannada: 'ಸಂಸ್ಕೃತಿ ಲೋಕ',
      desc: 'Dialects, heritage & etiquette'
    },
    {
      id: 'quests' as NavTab,
      icon: <Trophy className="w-4 h-4 text-[#00E6A0]" />,
      title: 'Missions & Quests',
      kannada: 'ಸಾಧನೆಗಳು',
      desc: 'Bengaluru city challenges'
    }
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#04111F] via-[#071D32] to-[#04111F] border border-[#00D9FF]/20 p-6 sm:p-8 lg:p-10 shadow-[0_10px_50px_rgba(4,17,31,0.8)]">
      {/* Cinematic Ambient Atmosphere Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00E6A0]/10 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-[#00D9FF]/12 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-72 h-72 bg-[#8257FF]/12 rounded-full blur-[90px] pointer-events-none" />

      {/* Subtle Grid Ambient Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #00D9FF 1px, transparent 0)',
          backgroundSize: '28px 28px'
        }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Brand Story, Typography, and CTAs (7 cols) */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Luminous Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#071D32]/80 border border-[#00E6A0]/30 backdrop-blur-md shadow-[0_0_20px_rgba(0,230,160,0.15)]">
            <span className="w-2 h-2 rounded-full bg-[#00E6A0] animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-[#00E6A0] uppercase font-mono">
              AI-Powered Kannada Intelligence
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs font-kannada text-[#00D9FF] font-medium">
              ಕನ್ನಡ ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ
            </span>
          </div>

          {/* Primary Kannada & English Headlines */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-kannada tracking-tight text-[#F1F7FF] leading-[1.2] drop-shadow-sm">
              ನಿಮ್ಮ ಧ್ವನಿ, <span className="bg-gradient-to-r from-[#00E6A0] via-[#00D9FF] to-[#8257FF] bg-clip-text text-transparent">ನಿಮ್ಮ ಕನ್ನಡ ಲೋಕ.</span>
            </h1>
            <p className="text-xl sm:text-2xl font-bold text-[#F1F7FF] tracking-tight">
              Your Voice. Your Language. Your World.
            </p>
          </div>

          {/* Visionary Product Description */}
          <p className="text-sm sm:text-base text-[#9BB1C8] leading-relaxed max-w-xl">
            Speak naturally, discover Kannada, and learn through intelligent voice conversations, immersive practice, and real-world experiences.
          </p>

          {/* Primary & Secondary Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('assistant')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#00E6A0] to-[#00D9FF] hover:from-[#00c98b] hover:to-[#00bfe0] text-[#04111F] font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(0,230,160,0.35)] hover:shadow-[0_0_35px_rgba(0,230,160,0.5)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Mic className="w-4 h-4 stroke-[2.5]" />
              <span>Start Speaking</span>
              <ArrowRight className="w-4 h-4 ml-1 stroke-[2.5]" />
            </button>

            <button
              onClick={() => onNavigate('learning')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#071D32]/80 hover:bg-[#071D32] text-[#F1F7FF] border border-[#00D9FF]/30 hover:border-[#00D9FF]/60 font-semibold text-sm transition-all backdrop-blur-md cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#00D9FF]" />
              <span>Explore Learning</span>
            </button>

            {onSpeakSample && (
              <button
                onClick={onSpeakSample}
                className="p-3 rounded-2xl bg-[#071D32]/60 hover:bg-[#071D32] text-[#00E6A0] border border-[#00E6A0]/30 hover:border-[#00E6A0]/60 transition-colors"
                title="Hear welcoming sample in Kannada"
                aria-label="Listen to welcome phrase"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Real-Time Metrics Strip */}
          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-[#9BB1C8]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E6A0]" />
              <span className="font-mono text-[#F1F7FF] font-bold">{currentStreak} Day</span>
              <span>Learning Streak</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8257FF]" />
              <span className="font-mono text-[#F1F7FF] font-bold">{currentXP} XP</span>
              <span>Earned</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF]" />
              <span>Model:</span>
              <span className="font-mono text-[#00D9FF]">Gemini 3.8 Flash</span>
            </div>
          </div>
        </div>

        {/* Right Column: VirtualTutor with AnimationController & Reduced 3D Size (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-full max-w-[310px] h-[330px] sm:h-[360px] rounded-3xl overflow-hidden border border-[#00D9FF]/30 bg-gradient-to-b from-[#04111F]/90 via-[#071D32]/60 to-[#04111F]/95 shadow-[0_0_30px_rgba(0,217,255,0.18)] flex items-center justify-center">
            {/* Interactive Full-Body 3D Virtual Tutor */}
            <VirtualTutor
              size="100%"
              state={heroTutorState}
              interactive={true}
              onClick={() => onNavigate('assistant')}
              showStatusLabel={true}
              showCameraControls={true}
              showActionControls={true}
              onStateChange={setHeroTutorState}
            />
          </div>
          <p className="text-[11px] text-[#9BB1C8] mt-2 flex items-center gap-1.5 font-mono">
            <Activity className="w-3 h-3 text-[#00E6A0]" />
            <span>Full-Body 3D Virtual Guru · Drag to rotate · ಸಂಭಾಷಣೆ ಆರಂಭಿಸಿ</span>
          </p>
        </div>
      </div>

      {/* Capabilities Strip: Live, Verified Implemented Features */}
      <div className="mt-8 pt-6 border-t border-[#00D9FF]/15">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-mono tracking-wider text-[#9BB1C8] uppercase font-bold">
            Interactive AI Ecosystem
          </span>
          <span className="text-xs font-kannada text-[#00E6A0]">
            ಸಮಗ್ರ ಕನ್ನಡ ಭಾಷಾ ತಂತ್ರಜ್ಞಾನ
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {capabilities.map((cap) => (
            <button
              key={cap.id}
              onClick={() => onNavigate(cap.id)}
              className="p-3 rounded-xl bg-[#04111F]/70 hover:bg-[#071D32] border border-[#00D9FF]/15 hover:border-[#00D9FF]/40 text-left transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="p-1 rounded-lg bg-[#071D32] group-hover:scale-110 transition-transform">
                  {cap.icon}
                </span>
                <span className="text-[10px] font-kannada text-[#9BB1C8] group-hover:text-[#00E6A0]">
                  {cap.kannada}
                </span>
              </div>
              <h4 className="text-xs font-semibold text-[#F1F7FF] truncate">
                {cap.title}
              </h4>
              <p className="text-[10px] text-[#9BB1C8] truncate">
                {cap.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
