import React from 'react';

interface AudioVisualizerProps {
  state: 'idle' | 'listening' | 'processing' | 'speaking' | 'error' | 'blocked';
  barsCount?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ state, barsCount = 16 }) => {
  const bars = Array.from({ length: barsCount });

  return (
    <div className="flex items-center justify-center gap-1.5 h-12 px-4 py-2 bg-slate-900/60 rounded-xl border border-slate-800/80 backdrop-blur-sm">
      {bars.map((_, i) => {
        let heightClass = 'h-1.5 bg-slate-700';
        let animationStyle: React.CSSProperties = {};

        if (state === 'listening') {
          // Dynamic bouncing waves for microphone listening
          const delays = [0.1, 0.3, 0.5, 0.2, 0.4, 0.6, 0.15, 0.35];
          const delay = delays[i % delays.length];
          animationStyle = {
            animation: `voiceWave 0.8s ease-in-out infinite`,
            animationDelay: `${delay}s`
          };
          heightClass = 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]';
        } else if (state === 'speaking') {
          // Harmonic wave for audio output playback
          const delay = (i * 0.08) % 0.8;
          animationStyle = {
            animation: `voiceWave 1.1s ease-in-out infinite`,
            animationDelay: `${delay}s`
          };
          heightClass = 'bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.4)]';
        } else if (state === 'processing') {
          // Sequential scanning wave
          const delay = i * 0.05;
          animationStyle = {
            animation: `voiceWave 1.4s ease-in-out infinite`,
            animationDelay: `${delay}s`
          };
          heightClass = 'bg-cyan-400';
        } else if (state === 'error' || state === 'blocked') {
          heightClass = 'h-2 bg-rose-800';
        }

        return (
          <div
            key={i}
            style={animationStyle}
            className={`w-1 rounded-full transition-all duration-200 ${heightClass}`}
          />
        );
      })}
      <span className="ml-3 text-xs font-mono tracking-wider text-slate-400 select-none">
        {state === 'listening' && <span className="text-emerald-400 font-medium">LISTENING (ಧ್ವನಿ ಗ್ರಹಿಕೆ)</span>}
        {state === 'speaking' && <span className="text-teal-300 font-medium">SPEAKING (ಉತ್ತರ ಆಲಿಸಿ)</span>}
        {state === 'processing' && <span className="text-cyan-400 font-medium">PROCESSING (ವಿಶ್ಲೇಷಣೆ)</span>}
        {(state === 'error' || state === 'blocked') && <span className="text-rose-400 font-medium">MIC NOTICE</span>}
        {state === 'idle' && <span className="text-slate-500">READY (ಸಿದ್ಧವಾಗಿದೆ)</span>}
      </span>
    </div>
  );
};
