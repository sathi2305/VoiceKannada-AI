import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  X,
  ArrowRight,
  Compass,
  Clock,
  Languages,
  Target
} from 'lucide-react';
import { UserProfile, ExplanationLanguage } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (profile: Partial<UserProfile>) => void;
  initialProfile?: UserProfile;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onSaveProfile,
  initialProfile
}) => {
  const [step, setStep] = useState<number>(1);
  const [proficiency, setProficiency] = useState<UserProfile['proficiency']>(
    initialProfile?.proficiency || 'beginner'
  );
  const [objective, setObjective] = useState<UserProfile['objective']>(
    initialProfile?.objective || 'travel'
  );
  const [explanationLang, setExplanationLang] = useState<ExplanationLanguage>(
    initialProfile?.explanationLang || 'english'
  );
  const [dailyMinutes, setDailyMinutes] = useState<number>(
    initialProfile?.dailyMinutes || 10
  );

  if (!isOpen) return null;

  const handleFinish = () => {
    let computedLevel = 1;
    if (proficiency === 'elementary') computedLevel = 2;
    if (proficiency === 'intermediate') computedLevel = 3;
    if (proficiency === 'advanced') computedLevel = 4;

    onSaveProfile({
      proficiency,
      objective,
      explanationLang,
      dailyMinutes,
      level: computedLevel,
      onboardingCompleted: true
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b1322] border border-slate-800 w-full max-w-xl rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 animate-celebrate-pop relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Close onboarding modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                s <= step ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Proficiency */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                Step 1 of 4 · Proficiency
              </span>
              <h3 className="text-xl font-bold text-white">
                What is your current Kannada level?
              </h3>
              <p className="text-xs text-slate-400">
                This helps us recommend the right starting curriculum and dialogue speed.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'beginner', title: 'Complete Beginner (ಆರಂಭಿಕ)', desc: 'I do not know any Kannada words yet.' },
                { id: 'elementary', title: 'Elementary (ಪ್ರಾಥಮಿಕ)', desc: 'I know basic words like Namaskara, Oota, etc.' },
                { id: 'intermediate', title: 'Intermediate (ಮಧ್ಯಮ)', desc: 'I can understand simple conversations with auto drivers or vendors.' },
                { id: 'advanced', title: 'Advanced (ಪ್ರವೀಣ)', desc: 'I want to polish fluent grammar, formal vocabulary, and literature.' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setProficiency(item.id as any)}
                  className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    proficiency === item.id
                      ? 'bg-slate-800/90 border-emerald-500 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <p className="font-semibold text-sm text-white">{item.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Goal / Objective */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                Step 2 of 4 · Learning Goal
              </span>
              <h3 className="text-xl font-bold text-white">
                What is your primary goal for learning Kannada?
              </h3>
              <p className="text-xs text-slate-400">
                We'll prioritize scenarios and phrases matched to your lifestyle.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'travel', title: 'Bengaluru Commute & Travel', desc: 'Auto rides, metro, buses, asking directions and navigation.' },
                { id: 'social', title: 'Everyday Social Life & Food', desc: 'Darshini hotels, grocery markets, making local friends.' },
                { id: 'work', title: 'Workplace & Colleagues', desc: 'Office watercooler conversations, polite requests, team bonding.' },
                { id: 'culture', title: 'Culture & Literature', desc: 'Appreciating Kannada poetry, cinema, and heritage.' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setObjective(item.id as any)}
                  className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    objective === item.id
                      ? 'bg-slate-800/90 border-emerald-500 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <p className="font-semibold text-sm text-white">{item.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Explanation Language */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                Step 3 of 4 · Multilingual Support
              </span>
              <h3 className="text-xl font-bold text-white">
                Preferred language for explanations?
              </h3>
              <p className="text-xs text-slate-400">
                Choose the language you are most comfortable understanding grammar explanations in.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'english', label: 'English', native: 'English' },
                { id: 'hindi', label: 'Hindi', native: 'हिन्दी' },
                { id: 'tamil', label: 'Tamil', native: 'தமிழ்' },
                { id: 'telugu', label: 'Telugu', native: 'తెలుగు' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setExplanationLang(item.id as any)}
                  className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                    explanationLang === item.id
                      ? 'bg-slate-800 border-teal-400 text-teal-300 font-bold'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <p className="text-base">{item.label}</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{item.native}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Daily Commitment */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                Step 4 of 4 · Daily Practice Plan
              </span>
              <h3 className="text-xl font-bold text-white">
                How many minutes can you practice daily?
              </h3>
              <p className="text-xs text-slate-400">
                Consistent short bursts build long-term fluency and preserve your streak.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { mins: 5, label: '5 minutes / day', badge: 'Casual' },
                { mins: 10, label: '10 minutes / day', badge: 'Recommended' },
                { mins: 15, label: '15 minutes / day', badge: 'Dedicated' },
                { mins: 30, label: '30 minutes / day', badge: 'Intensive' }
              ].map(item => (
                <button
                  key={item.mins}
                  onClick={() => setDailyMinutes(item.mins)}
                  className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                    dailyMinutes === item.mins
                      ? 'bg-slate-800 border-emerald-400 text-emerald-300 font-bold'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <p className="text-base">{item.label}</p>
                  <span className="text-[11px] text-slate-400">{item.badge}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Modal Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-medium cursor-pointer"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Generate My Learning Plan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
