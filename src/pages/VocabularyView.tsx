import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Volume2,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Search,
  Plus,
  Trash2,
  X,
  Brain,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Flame,
  Clock,
  Layers
} from 'lucide-react';
import { SavedPhrase, SRSItem } from '../types';
import { api } from '../services/api';

interface VocabularyViewProps {
  savedPhrases: SavedPhrase[];
  onSpeak: (text: string) => void;
  onLaunchPractice: (targetKannada: string, targetTransliteration: string, targetEnglish: string) => void;
  onDeleteSavedPhrase: (id: string) => void;
  onAddCustomPhrase: (phrase: { kannada: string; transliteration: string; english: string; category?: string; notes?: string }) => void;
}

const CURATED_VOCABULARY: Array<{
  id: string;
  kannada: string;
  transliteration: string;
  english: string;
  category: string;
  notes?: string;
}> = [
  { id: 'v-1', kannada: 'ನಮಸ್ಕಾರ', transliteration: 'Namaskāra', english: 'Hello / Greetings', category: 'basics' },
  { id: 'v-2', kannada: 'ನೀವು ಹೇಗಿದ್ದೀರಿ?', transliteration: 'Nīvu hēgiddīri?', english: 'How are you?', category: 'basics' },
  { id: 'v-3', kannada: 'ಧನ್ಯವಾದಗಳು', transliteration: 'Dhan\'yavādagaḷu', english: 'Thank you', category: 'basics' },
  { id: 'v-4', kannada: 'ಶುಭೋದಯ', transliteration: 'Śubhōdaya', english: 'Good morning', category: 'basics' },
  { id: 'v-5', kannada: 'ಮತ್ತೆ ಸಿಗೋಣ', transliteration: 'Matte sigōṇa', english: 'See you again', category: 'basics' },
  { id: 'v-6', kannada: 'ಮೀಟರ್ ಹಾಕಿ ಅಣ್ಣ', transliteration: 'Meter hāki aṇṇa', english: 'Turn on the meter, brother', category: 'travel' },
  { id: 'v-7', kannada: 'ಇಲ್ಲಿ ನಿಲ್ಲಿಸಿ', transliteration: 'Illi nillisi', english: 'Please stop here', category: 'travel' },
  { id: 'v-8', kannada: 'ಮೆಟ್ರೋ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?', transliteration: 'Metro nildāṇa ellide?', english: 'Where is the metro station?', category: 'travel' },
  { id: 'v-9', kannada: 'ಇದರ ಬೆಲೆ ಎಷ್ಟು?', transliteration: 'Idara bele eṣṭu?', english: 'How much does this cost?', category: 'shopping' },
  { id: 'v-10', kannada: 'ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ', transliteration: 'Svalpa kaḍime māḍi', english: 'Please reduce price a bit', category: 'shopping' },
  { id: 'v-11', kannada: 'ಒಂದು ಕಿಲೋ ಕೊಡಿ', transliteration: 'Ondu kilo koḍi', english: 'Give me one kilo', category: 'shopping' },
  { id: 'v-12', kannada: 'ಆನ್‌ಲೈನ್ ಪಾವತಿ ಇದೆಯೇ?', transliteration: 'Online pāvati ideyē?', english: 'Is online/UPI payment available?', category: 'shopping' },
  { id: 'v-13', kannada: 'ನನಗೆ ಒಂದು ಮಸಾಲೆ ದೋಸೆ ಬೇಕು', transliteration: 'Nanage ondu masāle dōse bēku', english: 'I want one masala dosa', category: 'food' },
  { id: 'v-14', kannada: 'ಬಿಸಿ ಫಿಲ್ಟರ್ ಕಾಫಿ ಕೊಡಿ', transliteration: 'Bisi filter coffee koḍi', english: 'Please give hot filter coffee', category: 'food' },
  { id: 'v-15', kannada: 'ಖಾರ ಕಡಿಮೆ ಇರಲಿ', transliteration: 'Khāra kaḍime irali', english: 'Keep spice low', category: 'food' },
  { id: 'v-16', kannada: 'ಊಟ ತುಂಬಾ ರುಚಿಯಾಗಿದೆ', transliteration: 'Ūṭa tumbā ruciyāgide', english: 'The food is very delicious', category: 'food' },
  { id: 'v-17', kannada: 'ನನಗೆ ಆರಾಮವಿಲ್ಲ', transliteration: 'Nanage ārāmavilla', english: 'I am not feeling well', category: 'health' },
  { id: 'v-18', kannada: 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ ಎಲ್ಲಿದೆ?', transliteration: 'Hattirada āspatre ellide?', english: 'Where is the nearest hospital?', category: 'health' },
  { id: 'v-19', kannada: 'ತುರ್ತು ಸಹಾಯ ಬೇಕು', transliteration: 'Turtu sahāya bēku', english: 'Need emergency help', category: 'health' },
  { id: 'v-20', kannada: 'ನನಗೆ ಕನ್ನಡ ಕಲಿಯಲು ಇಷ್ಟ', transliteration: 'Nanage kannada kaliyalu iṣṭa', english: 'I love learning Kannada', category: 'daily' },
  { id: 'v-21', kannada: 'ದಯವಿಟ್ಟು ನಿಧಾನವಾಗಿ ಮಾತನಾಡಿ', transliteration: 'Dayaviṭṭu nidhānavāgi mātanāḍi', english: 'Please speak slowly', category: 'daily' },
  { id: 'v-22', kannada: 'ಕನ್ನಡ ಸುಂದರವಾದ ಭಾಷೆ', transliteration: 'Kannada sundaravāda bhāṣe', english: 'Kannada is a beautiful language', category: 'daily' }
];

export const VocabularyView: React.FC<VocabularyViewProps> = ({
  savedPhrases,
  onSpeak,
  onLaunchPractice,
  onDeleteSavedPhrase,
  onAddCustomPhrase
}) => {
  const [viewMode, setViewMode] = useState<'notebook' | 'srs'>('notebook');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // SRS State
  const [srsItems, setSrsItems] = useState<SRSItem[]>([]);
  const [srsIndex, setSrsIndex] = useState<number>(0);
  const [srsRevealed, setSrsRevealed] = useState<boolean>(false);
  const [srsCompletedSession, setSrsCompletedSession] = useState<boolean>(false);
  const [srsReviewedCount, setSrsReviewedCount] = useState<number>(0);

  // New phrase form state
  const [newKannada, setNewKannada] = useState<string>('');
  const [newTransliteration, setNewTransliteration] = useState<string>('');
  const [newEnglish, setNewEnglish] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('general');
  const [newNotes, setNewNotes] = useState<string>('');

  const loadSRS = async () => {
    try {
      const items = await api.getSRSItems();
      setSrsItems(items);
    } catch (err) {
      console.warn('Failed to load SRS items:', err);
    }
  };

  useEffect(() => {
    loadSRS();
  }, []);

  const savedKannadaSet = new Set(savedPhrases.map(p => p.kannada.trim()));

  // Merge curated list with saved custom phrases
  const allPhrases = [
    ...savedPhrases.map(sp => ({
      id: sp.id,
      kannada: sp.kannada,
      transliteration: sp.transliteration,
      english: sp.english,
      category: sp.category || 'saved',
      notes: sp.notes,
      isCustomSaved: true
    })),
    ...CURATED_VOCABULARY.filter(cv => !savedKannadaSet.has(cv.kannada.trim())).map(cv => ({
      ...cv,
      isCustomSaved: false
    }))
  ];

  const filtered = allPhrases.filter(p => {
    if (selectedFilter === 'saved' && !savedKannadaSet.has(p.kannada.trim())) {
      return false;
    }
    if (selectedFilter !== 'all' && selectedFilter !== 'saved' && p.category !== selectedFilter) {
      return false;
    }
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.kannada.includes(q) ||
      p.transliteration.toLowerCase().includes(q) ||
      p.english.toLowerCase().includes(q)
    );
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKannada.trim() || !newEnglish.trim()) return;
    onAddCustomPhrase({
      kannada: newKannada.trim(),
      transliteration: newTransliteration.trim() || newKannada.trim(),
      english: newEnglish.trim(),
      category: newCategory,
      notes: newNotes.trim()
    });
    setNewKannada('');
    setNewTransliteration('');
    setNewEnglish('');
    setNewNotes('');
    setShowAddModal(false);
  };

  // SRS Review rating handler
  const handleRateSRS = async (rating: 1 | 2 | 3 | 4) => {
    const currentCard = srsItems[srsIndex];
    if (!currentCard) return;

    try {
      const updated = await api.reviewSRSItem(currentCard.id, rating);
      setSrsItems(prev => prev.map(item => item.id === updated.id ? updated : item));
      setSrsReviewedCount(prev => prev + 1);

      if (srsIndex + 1 < srsItems.length) {
        setSrsIndex(prev => prev + 1);
        setSrsRevealed(false);
      } else {
        setSrsCompletedSession(true);
      }
    } catch (err: any) {
      console.error('Failed to review SRS item:', err);
    }
  };

  const handleRestartSRS = () => {
    setSrsIndex(0);
    setSrsRevealed(false);
    setSrsCompletedSession(false);
    setSrsReviewedCount(0);
  };

  const currentSRSCard = srsItems[srsIndex];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* View Mode Segmented Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-2 rounded-2xl">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('notebook')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'notebook'
                ? 'bg-slate-800 text-emerald-300 shadow-sm border border-slate-700/80'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Vocabulary Notebook ({allPhrases.length})</span>
          </button>

          <button
            onClick={() => {
              setViewMode('srs');
              loadSRS();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'srs'
                ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/80'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Brain className="w-4 h-4 text-cyan-400" />
            <span>Spaced Repetition (SM-2)</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-mono">
              {srsItems.length}
            </span>
          </button>
        </div>

        {viewMode === 'notebook' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-semibold transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Phrase</span>
          </button>
        )}
      </div>

      {/* ================= MODE: SPACED REPETITION FLASHCARDS ================= */}
      {viewMode === 'srs' && (
        <div className="space-y-6">
          {srsCompletedSession ? (
            <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-[#071322] border border-cyan-500/30 p-8 text-center space-y-6 max-w-lg mx-auto shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Review Session Complete!</h3>
                <p className="text-xs text-slate-300 font-kannada">
                  ಅಭ್ಯಾಸ ಪೂರ್ಣಗೊಂಡಿದೆ! +{srsReviewedCount * 15} XP ಗಳಿಸಲಾಗಿದೆ.
                </p>
                <p className="text-xs text-slate-400">
                  You reviewed {srsReviewedCount} flashcards. Intervals have updated according to the SM-2 spaced repetition algorithm.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleRestartSRS}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Review Deck Again</span>
                </button>
                <button
                  onClick={() => setViewMode('notebook')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-semibold cursor-pointer"
                >
                  <span>Return to Notebook</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : currentSRSCard ? (
            <div className="max-w-xl mx-auto space-y-5">
              {/* Card Meta Header */}
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-emerald-400 font-semibold">
                    Card {srsIndex + 1} of {srsItems.length}
                  </span>
                  <span>·</span>
                  <span className="capitalize px-2 py-0.5 rounded-md bg-slate-800 text-[11px] font-medium text-slate-300">
                    State: {currentSRSCard.state}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span>Repetitions: {currentSRSCard.repetitions}</span>
                  <span>·</span>
                  <span>Ease: {currentSRSCard.easeFactor.toFixed(2)}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${Math.round(((srsIndex + 1) / srsItems.length) * 100)}%` }}
                />
              </div>

              {/* Interactive Flashcard */}
              <div className="rounded-2xl bg-slate-900/80 border border-slate-700/80 p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                  <button
                    onClick={() => onSpeak(currentSRSCard.kannada)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 cursor-pointer"
                    title="Listen to Kannada pronunciation"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      onLaunchPractice(
                        currentSRSCard.kannada,
                        currentSRSCard.transliteration,
                        currentSRSCard.english
                      )
                    }
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 cursor-pointer text-xs flex items-center gap-1"
                    title="Practice speaking this phrase"
                  >
                    <Sparkles className="w-4 h-4 text-teal-400" />
                  </button>
                </div>

                <div className="space-y-3 pt-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                    KANNADA PROMPT
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold font-kannada text-white leading-relaxed">
                    {currentSRSCard.kannada}
                  </h2>
                </div>

                {/* Answer Reveal Area */}
                {!srsRevealed ? (
                  <div className="pt-6 border-t border-slate-800">
                    <button
                      onClick={() => setSrsRevealed(true)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-slate-950 font-semibold text-sm transition-all cursor-pointer shadow-md"
                    >
                      Show Meaning & Transliteration
                    </button>
                  </div>
                ) : (
                  <div className="pt-6 border-t border-slate-800 space-y-5 animate-fadeIn">
                    <div className="space-y-1">
                      <p className="text-base text-cyan-300 font-mono font-medium">
                        {currentSRSCard.transliteration}
                      </p>
                      <p className="text-lg font-medium text-white">
                        {currentSRSCard.english}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                        How well did you recall this? (SM-2 Rating)
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <button
                          onClick={() => handleRateSRS(1)}
                          className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800/80 hover:bg-rose-900 text-rose-300 text-xs font-semibold cursor-pointer transition-colors"
                        >
                          <div className="font-mono">1 · Again</div>
                          <div className="text-[10px] text-rose-400/80 font-normal mt-0.5">1 day (Reset)</div>
                        </button>

                        <button
                          onClick={() => handleRateSRS(2)}
                          className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-800/80 hover:bg-amber-900 text-amber-300 text-xs font-semibold cursor-pointer transition-colors"
                        >
                          <div className="font-mono">2 · Hard</div>
                          <div className="text-[10px] text-amber-400/80 font-normal mt-0.5">2 days</div>
                        </button>

                        <button
                          onClick={() => handleRateSRS(3)}
                          className="p-2.5 rounded-xl bg-teal-950/60 border border-teal-800/80 hover:bg-teal-900 text-teal-300 text-xs font-semibold cursor-pointer transition-colors"
                        >
                          <div className="font-mono">3 · Good</div>
                          <div className="text-[10px] text-teal-400/80 font-normal mt-0.5">3-5 days</div>
                        </button>

                        <button
                          onClick={() => handleRateSRS(4)}
                          className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 hover:bg-emerald-900 text-emerald-300 text-xs font-semibold cursor-pointer transition-colors"
                        >
                          <div className="font-mono">4 · Easy</div>
                          <div className="text-[10px] text-emerald-400/80 font-normal mt-0.5">7+ days</div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">Loading SRS flashcards...</div>
          )}
        </div>
      )}

      {/* ================= MODE: NOTEBOOK & VOCABULARY DIRECTORY ================= */}
      {viewMode === 'notebook' && (
        <>
          {/* Search and Action Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 p-1 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                  selectedFilter === 'all'
                    ? 'bg-slate-800 text-emerald-300 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({allPhrases.length})
              </button>
              <button
                onClick={() => setSelectedFilter('saved')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                  selectedFilter === 'saved'
                    ? 'bg-slate-800 text-emerald-300 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Bookmarked ({savedPhrases.length})
              </button>
              <button
                onClick={() => setSelectedFilter('basics')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                  selectedFilter === 'basics'
                    ? 'bg-slate-800 text-emerald-300 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Basics
              </button>
              <button
                onClick={() => setSelectedFilter('travel')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                  selectedFilter === 'travel'
                    ? 'bg-slate-800 text-emerald-300 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Travel & Commute
              </button>
              <button
                onClick={() => setSelectedFilter('shopping')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                  selectedFilter === 'shopping'
                    ? 'bg-slate-800 text-emerald-300 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Market & Shopping
              </button>
              <button
                onClick={() => setSelectedFilter('food')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                  selectedFilter === 'food'
                    ? 'bg-slate-800 text-emerald-300 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Food & Darshini
              </button>
              <button
                onClick={() => setSelectedFilter('health')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                  selectedFilter === 'health'
                    ? 'bg-slate-800 text-emerald-300 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Health & Emergency
              </button>
              <button
                onClick={() => setSelectedFilter('daily')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                  selectedFilter === 'daily'
                    ? 'bg-slate-800 text-emerald-300 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Daily Life
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Kannada, English, phonetics..."
                className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/80 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => {
              const isBookmarked = savedKannadaSet.has(item.kannada.trim());

              return (
                <div
                  key={item.id}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="capitalize text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300">
                        {item.category}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onSpeak(item.kannada)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 cursor-pointer"
                          title="Listen Pronunciation"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>

                        {item.isCustomSaved ? (
                          <button
                            onClick={() => onDeleteSavedPhrase(item.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 cursor-pointer"
                            title="Delete custom phrase"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              onAddCustomPhrase({
                                kannada: item.kannada,
                                transliteration: item.transliteration,
                                english: item.english,
                                category: item.category,
                                notes: item.notes
                              });
                            }}
                            className={`p-1.5 rounded-lg cursor-pointer ${
                              isBookmarked
                                ? 'bg-emerald-950 text-emerald-400'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
                            }`}
                            title={isBookmarked ? 'Bookmarked' : 'Save to notebook'}
                          >
                            {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold font-kannada text-white group-hover:text-emerald-300 transition-colors">
                        {item.kannada}
                      </h3>
                      <p className="text-xs text-emerald-400 font-mono mt-0.5">
                        {item.transliteration}
                      </p>
                      <p className="text-xs text-slate-300 mt-1.5 font-medium">
                        {item.english}
                      </p>
                      {item.notes && (
                        <p className="text-[11px] text-slate-400 mt-2 italic bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Authentic vocabulary</span>
                    <button
                      onClick={() => onLaunchPractice(item.kannada, item.transliteration, item.english)}
                      className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 font-medium cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Practice Speaking</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center rounded-2xl bg-slate-900/30 border border-slate-800 space-y-2">
              <Search className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-400 font-medium">No phrases match your criteria</p>
              <p className="text-xs text-slate-400">Try adjusting your search terms or filter selection.</p>
            </div>
          )}
        </>
      )}

      {/* Modal: Add Custom Phrase */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">Add New Vocabulary Phrase</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Kannada Script *</label>
                <input
                  type="text"
                  required
                  value={newKannada}
                  onChange={e => setNewKannada(e.target.value)}
                  placeholder="e.g. ನನಗೆ ಕಾಫಿ ಬೇಕು"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white font-kannada focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">English Transliteration</label>
                <input
                  type="text"
                  value={newTransliteration}
                  onChange={e => setNewTransliteration(e.target.value)}
                  placeholder="e.g. Nanage coffee bēku"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">English Meaning *</label>
                <input
                  type="text"
                  required
                  value={newEnglish}
                  onChange={e => setNewEnglish(e.target.value)}
                  placeholder="e.g. I want coffee"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="basics">Basics</option>
                    <option value="travel">Travel</option>
                    <option value="shopping">Shopping</option>
                    <option value="food">Food</option>
                    <option value="health">Health</option>
                    <option value="daily">Daily Life</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Cultural Note (Optional)</label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={e => setNewNotes(e.target.value)}
                    placeholder="Usage context..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs text-slate-950 font-semibold cursor-pointer"
                >
                  Save to Notebook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
