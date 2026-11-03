import React, { useState, useEffect } from 'react';
import { Menu, VolumeX, Mic, Sparkles, Sun, Moon, Search, X, BookOpen, ArrowRight, PanelLeft, PanelLeftClose } from 'lucide-react';
import { NavTab } from '../types';

interface HeaderProps {
  currentTab: NavTab;
  onOpenMobile: () => void;
  onNavigate: (tab: NavTab) => void;
  isAudioPlaying: boolean;
  onStopAudio: () => void;
  theme?: 'dark' | 'light' | string;
  onToggleTheme?: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

const TAB_TITLES: Record<NavTab, { title: string; subtitle: string; kannada: string }> = {
  dashboard: {
    title: 'Workspace Dashboard',
    subtitle: 'AI Kannada Voice Assistant & Learning Platform',
    kannada: 'ಕನ್ನಡದ ಧ್ವನಿ ಮುಖಪುಟ'
  },
  assistant: {
    title: 'AI Voice Assistant',
    subtitle: 'Bilingual Kannada & English Conversational AI',
    kannada: 'ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಧ್ವನಿ ಸಹಾಯಕ'
  },
  learning: {
    title: 'Kannada Learning Studio',
    subtitle: 'Curated structured lessons, authentic script, & transliteration',
    kannada: 'ಕನ್ನಡ ಭಾಷಾ ಕಲಿಕಾ ಕೇಂದ್ರ'
  },
  practice: {
    title: 'Speaking Practice Studio',
    subtitle: 'Target phrase pronunciation & transparent transcript matching',
    kannada: 'ಉಚ್ಚಾರಣೆ ಮತ್ತು ಮಾತನಾಡುವ ಅಭ್ಯಾಸ'
  },
  builder: {
    title: 'Sentence Builder Studio',
    subtitle: 'Interactive Kannada word order & grammar construction',
    kannada: 'ಪದ ಜೋಡಣೆ ಮತ್ತು ವ್ಯಾಕರಣ'
  },
  listening: {
    title: 'Listening Comprehension Studio',
    subtitle: 'Ear training and comprehension exercises with native audio',
    kannada: 'ಆಲಿಸುವಿಕೆ ಮತ್ತು ಗ್ರಹಿಕೆ'
  },
  roleplay: {
    title: 'Real-World Role-Play Simulator',
    subtitle: 'Everyday Bengaluru scenarios with character personas & voice dialogue',
    kannada: 'ಸನ್ನಿವೇಶ ಅಭಿನಯ'
  },
  characters: {
    title: 'Script & Alphabet Master',
    subtitle: 'Kannada vowels, consonants, examples, and identification quiz',
    kannada: 'ಅಕ್ಷರಮಾಲೆ'
  },
  vocabulary: {
    title: 'Vocabulary & Phrases',
    subtitle: 'Practical words, everyday phrases, & expressions notebook',
    kannada: 'ನಿತ್ಯೋಪಯೋಗಿ ಶಬ್ದಕೋಶ'
  },
  history: {
    title: 'Conversation History',
    subtitle: 'Past voice interactions and transcript logs',
    kannada: 'ಹಿಂದಿನ ಸಂಭಾಷಣೆಗಳ ದಾಖಲೆ'
  },
  progress: {
    title: 'Progress & Mastery',
    subtitle: 'Track actual completed lessons and pronunciation sessions',
    kannada: 'ನಿಜವಾದ ಕಲಿಕಾ ಪ್ರಗತಿ'
  },
  settings: {
    title: 'Settings & Privacy',
    subtitle: 'Speech providers, voice preferences, and privacy controls',
    kannada: 'ಆದ್ಯತೆಗಳು ಮತ್ತು ಗೌಪ್ಯತೆ'
  },
  vision: {
    title: 'Visual Signboard & Object OCR',
    subtitle: 'Camera Kannada sign reader, menu translation, & vocabulary breakdown',
    kannada: 'ದೃಷ್ಟಿ ಜ್ಞಾನ ಮತ್ತು ನಾಮಫಲಕ ಓದುಗ'
  },
  translator: {
    title: 'Two-Way Voice Translator',
    subtitle: 'Live bidirectional speech bridge between Kannada and English',
    kannada: 'ದ್ವಿಮುಖ ಧ್ವನಿ ಭಾಷಾಂತರ'
  },
  culture: {
    title: 'Kannada Culture & Context Engine',
    subtitle: 'Regional dialects, historical inscriptions, and heritage traditions',
    kannada: 'ಕನ್ನಡ ಸಂಸ್ಕೃತಿ ಮತ್ತು ಇತಿಹಾಸ'
  },
  quests: {
    title: 'Quest-Based Language Missions',
    subtitle: 'Real-world practical Kannada challenges with XP rewards',
    kannada: 'ಕಲಿಕಾ ಅಭಿಯಾನಗಳು'
  },
  mistakes: {
    title: 'Personal Mistake Coach',
    subtitle: 'Real-time diagnosis of mispronounced words and targeted revision drills',
    kannada: 'ಉಚ್ಚಾರಣೆ ತಿದ್ದುಪಡಿ ತರಬೇತುದಾರ'
  },
  about: {
    title: 'Project & Challenge Info',
    subtitle: 'Kannada Technology Challenge requirements traceability & architecture',
    kannada: 'ತಾಂತ್ರಿಕ ಸವಾಲು ಮತ್ತು ವಿನ್ಯಾಸ ಮಾಹಿತಿ'
  }
};

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenMobile,
  onNavigate,
  isAudioPlaying,
  onStopAudio,
  theme = 'dark',
  onToggleTheme,
  isSidebarCollapsed = false,
  onToggleSidebar
}) => {
  const currentInfo = TAB_TITLES[currentTab] || TAB_TITLES.dashboard;
  const isLight = theme === 'light';

  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Search index of lessons, features & tools
  const SEARCH_ITEMS: Array<{ title: string; kannada: string; tab: NavTab; category: string }> = [
    { title: 'AI Voice Assistant', kannada: 'ಧ್ವನಿ ಸಹಾಯಕ', tab: 'assistant', category: 'Voice AI' },
    { title: 'Essential Kannada Basics & Greetings', kannada: 'ಮೂಲ ಪರಿಚಯ ಮತ್ತು ಶುಭಾಶಯಗಳು', tab: 'learning', category: 'Lesson' },
    { title: 'Travel & Metro Navigation', kannada: 'ಪ್ರಯಾಣ ಮತ್ತು ಸಾರಿಗೆ', tab: 'learning', category: 'Lesson' },
    { title: 'Darshini & Food Ordering', kannada: 'ಹೊಟೇಲ್ ಮತ್ತು ಆಹಾರ', tab: 'learning', category: 'Lesson' },
    { title: 'Speaking Practice & Pronunciation', kannada: 'ಉಚ್ಚಾರಣೆ ಅಭ್ಯಾಸ', tab: 'practice', category: 'Speaking' },
    { title: 'Sentence Builder & Grammar Cases', kannada: 'ಪದ ಜೋಡಣೆ ಮತ್ತು ವ್ಯಾಕರಣ', tab: 'builder', category: 'Grammar' },
    { title: 'Listening Comprehension', kannada: 'ಆಲಿಸುವಿಕೆ ಮತ್ತು ಗ್ರಹಿಕೆ', tab: 'listening', category: 'Listening' },
    { title: 'Camera & Signboard OCR', kannada: 'ದೃಷ್ಟಿ ಜ್ಞಾನ', tab: 'vision', category: 'Vision' },
    { title: 'Two-Way Live Voice Translator', kannada: 'ದ್ವಿಭಾಷಾ ಸಂವಾದ', tab: 'translator', category: 'Translator' },
    { title: 'Kannada Alphabet & Kagunitha Lab', kannada: 'ವರ್ಣಮಾಲೆ & ಗುಣಿತಾಕ್ಷರ', tab: 'characters', category: 'Script' },
    { title: 'Culture, Dialects & Heritage', kannada: 'ಸಂಸ್ಕೃತಿ & ಉಪಭಾಷೆಗಳು', tab: 'culture', category: 'Culture' },
    { title: 'Missions & Quest Mode', kannada: 'ಸಾಧನೆಗಳು & ಅಭಿಯಾನ', tab: 'quests', category: 'Quests' },
    { title: 'Personal Mistake Coach', kannada: 'ಉಚ್ಚಾರಣೆ ತಿದ್ದುಪಡಿ', tab: 'mistakes', category: 'Coach' },
    { title: 'Vocabulary Notebook & SRS Review', kannada: 'ಶಬ್ದಕೋಶ', tab: 'vocabulary', category: 'Vocabulary' },
    { title: 'Progress & Analytics', kannada: 'ಪ್ರಗತಿ ವಿವರ', tab: 'progress', category: 'Progress' },
    { title: 'Settings & Appearance Mode', kannada: 'ಸೆಟ್ಟಿಂಗ್ಸ್', tab: 'settings', category: 'Settings' }
  ];

  const filteredItems = searchQuery.trim()
    ? SEARCH_ITEMS.filter(
        item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.kannada.includes(searchQuery) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SEARCH_ITEMS.slice(0, 6);

  // Global keyboard shortcut '/' to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || (e.metaKey && e.key === 'k')) && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-[#090e17]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile drawer hamburger */}
          <button
            onClick={onOpenMobile}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 lg:hidden"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop collapsible rail toggle */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="hidden lg:flex p-2 text-slate-400 hover:text-[#00E6A0] hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
              title={isSidebarCollapsed ? "Expand sidebar rail (ವಿಸ್ತರಿಸಿ)" : "Collapse sidebar rail (ಸಂಕುಚಿತಗೊಳಿಸಿ)"}
              aria-label="Toggle sidebar"
            >
              {isSidebarCollapsed ? (
                <PanelLeft className="w-5 h-5 text-[#00E6A0]" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white tracking-tight">
                {currentInfo.title}
              </h2>
              <span className="text-xs font-kannada text-emerald-400 font-medium hidden sm:inline">
                · {currentInfo.kannada}
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden md:block">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Global Search Bar Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            title="Search lessons, vocabulary, and features"
          >
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <span>Search modules...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 rounded border border-slate-700">
              /
            </kbd>
          </button>

          {/* Stop speech button if speaking */}
          {isAudioPlaying && (
            <button
              onClick={onStopAudio}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-300 bg-rose-950/60 border border-rose-800/80 rounded-lg hover:bg-rose-900 transition-colors animate-pulse cursor-pointer"
              title="Stop audio playback"
            >
              <VolumeX className="w-4 h-4 text-rose-400" />
              <span>Stop Audio</span>
            </button>
          )}

          {/* Quick Theme Toggle Button */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
              title={isLight ? 'Switch to Dark Mode (ಗಾಢ ಶೈಲಿ)' : 'Switch to Light Mode (ಬೆಳಕಿನ ಶೈಲಿ)'}
              aria-label="Toggle Theme"
            >
              {isLight ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden md:inline text-[11px] font-medium text-slate-700">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden md:inline text-[11px] font-medium text-slate-300">Light</span>
                </>
              )}
            </button>
          )}

          {/* Locale indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-emerald-300">ಕನ್ನಡ</span>
            <span className="text-slate-500">|</span>
            <span className="font-mono text-slate-400">kn-IN</span>
          </div>

          {/* Quick Launch Buttons */}
          {currentTab !== 'assistant' && (
            <button
              onClick={() => onNavigate('assistant')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-lg transition-colors font-medium shadow-sm cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Voice Assistant</span>
            </button>
          )}

          {currentTab !== 'practice' && (
            <button
              onClick={() => onNavigate('practice')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Practice</span>
            </button>
          )}
        </div>
      </header>

      {/* Global Quick Search Modal Dialog */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 p-4">
          <div className="bg-[#071D32] border border-[#00D9FF]/30 w-full max-w-xl rounded-2xl p-4 shadow-2xl space-y-3 animate-celebrate-pop relative">
            <div className="flex items-center gap-3 px-3 py-2 bg-[#04111F] rounded-xl border border-slate-800">
              <Search className="w-4 h-4 text-[#00E6A0]" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lessons, vocabulary, grammar or features..."
                className="w-full bg-transparent text-sm text-[#F1F7FF] placeholder-slate-500 focus:outline-none"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded bg-slate-800"
              >
                ESC
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-1.5">
              {filteredItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onNavigate(item.tab);
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#04111F]/60 hover:bg-[#071D32] border border-transparent hover:border-[#00D9FF]/30 text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#071D32] text-[#00D9FF] border border-slate-800">
                      {item.category}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#F1F7FF] group-hover:text-[#00E6A0] truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] font-kannada text-[#9BB1C8] truncate">
                        {item.kannada}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#00E6A0] transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
