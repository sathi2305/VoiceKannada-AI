import React from 'react';
import { Mic, MicOff, Loader2, Volume2, AlertCircle } from 'lucide-react';

interface MicButtonProps {
  state: 'idle' | 'listening' | 'processing' | 'speaking' | 'error' | 'blocked';
  isContinuous: boolean;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  label?: string;
}

export const MicButton: React.FC<MicButtonProps> = ({
  state,
  isContinuous,
  onMouseDown,
  onMouseUp,
  onClick,
  disabled = false,
  label
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative flex items-center justify-center">
        {/* Animated Pulse Waves when listening */}
        {state === 'listening' && (
          <>
            <span className="absolute inline-flex h-28 w-28 rounded-full bg-emerald-500/20 animate-ping" />
            <span className="absolute inline-flex h-36 w-36 rounded-full bg-emerald-500/10 animate-pulse" />
          </>
        )}

        {/* Animated Pulse Waves when speaking */}
        {state === 'speaking' && (
          <span className="absolute inline-flex h-28 w-28 rounded-full bg-teal-500/20 animate-pulse" />
        )}

        <button
          type="button"
          disabled={disabled}
          onClick={onClick}
          onMouseDown={!isContinuous ? onMouseDown : undefined}
          onMouseUp={!isContinuous ? onMouseUp : undefined}
          onTouchStart={!isContinuous ? onMouseDown : undefined}
          onTouchEnd={!isContinuous ? onMouseUp : undefined}
          aria-label={
            state === 'listening'
              ? 'Stop listening'
              : state === 'speaking'
              ? 'Stop speaking'
              : 'Start speaking in Kannada'
          }
          className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-500/50 cursor-pointer ${
            state === 'listening'
              ? 'bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 scale-105 shadow-[0_0_30px_rgba(16,185,129,0.5)]'
              : state === 'speaking'
              ? 'bg-gradient-to-tr from-teal-600 to-cyan-500 text-slate-950 shadow-[0_0_25px_rgba(20,184,166,0.5)]'
              : state === 'processing'
              ? 'bg-slate-800 text-cyan-400 border border-cyan-500/40 cursor-wait'
              : state === 'error' || state === 'blocked'
              ? 'bg-rose-950/80 text-rose-300 border border-rose-500/50 hover:bg-rose-900'
              : 'bg-gradient-to-b from-slate-800 to-slate-900 text-emerald-400 border border-slate-700/80 hover:border-emerald-500/50 hover:text-emerald-300 hover:scale-102 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]'
          }`}
        >
          {state === 'listening' ? (
            <Mic className="w-9 h-9 animate-pulse" />
          ) : state === 'speaking' ? (
            <Volume2 className="w-9 h-9 animate-bounce" />
          ) : state === 'processing' ? (
            <Loader2 className="w-9 h-9 animate-spin text-cyan-400" />
          ) : state === 'error' || state === 'blocked' ? (
            <AlertCircle className="w-9 h-9 text-rose-400" />
          ) : (
            <Mic className="w-9 h-9" />
          )}
        </button>
      </div>

      {/* Button Sub-Label */}
      <div className="text-center">
        <p className="text-sm font-medium text-slate-200">
          {label || (
            state === 'listening'
              ? 'Listening to Kannada speech...'
              : state === 'speaking'
              ? 'Speaking response...'
              : state === 'processing'
              ? 'Thinking and understanding...'
              : isContinuous
              ? 'Click to start continuous talk'
              : 'Push & hold to speak (or click)'
          )}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">
          {state === 'listening' ? (
            <span className="text-emerald-400 font-kannada">ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ (kn-IN)</span>
          ) : (
            <span>Kannada speech recognition active</span>
          )}
        </p>
      </div>
    </div>
  );
};
