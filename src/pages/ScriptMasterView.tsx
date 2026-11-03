import React, { useState } from 'react';
import {
  Volume2,
  Search,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  BookOpen,
  Keyboard,
  Grid,
  FileText,
  Copy,
  Check
} from 'lucide-react';
import { ScriptCharacter } from '../types';

interface ScriptMasterViewProps {
  characters: ScriptCharacter[];
  onSpeak: (text: string) => void;
  onAwardXP: (amount: number, reason: string) => void;
}

// Kagunitha Vowel Marks mapping
const KAGUNITHA_VOWELS = [
  { sign: '', name: 'ಅ (a)', audioSuffix: 'a' },
  { sign: 'ಾ', name: 'ಆ (aa)', audioSuffix: 'aa' },
  { sign: 'ಿ', name: 'ಇ (i)', audioSuffix: 'i' },
  { sign: 'ೀ', name: 'ಈ (ee)', audioSuffix: 'ee' },
  { sign: 'ು', name: 'ಉ (u)', audioSuffix: 'u' },
  { sign: 'ೂ', name: 'ಊ (oo)', audioSuffix: 'oo' },
  { sign: 'ೃ', name: 'ಋ (ru)', audioSuffix: 'ru' },
  { sign: 'ೆ', name: 'ಎ (e)', audioSuffix: 'e' },
  { sign: 'ೇ', name: 'ಏ (ae)', audioSuffix: 'ae' },
  { sign: 'ೈ', name: 'ಐ (ai)', audioSuffix: 'ai' },
  { sign: 'ೊ', name: 'ಒ (o)', audioSuffix: 'o' },
  { sign: 'ೋ', name: 'ಓ (oa)', audioSuffix: 'oa' },
  { sign: 'ೌ', name: 'ಔ (au)', audioSuffix: 'au' },
  { sign: 'ಂ', name: 'ಅಂ (am)', audioSuffix: 'am' },
  { sign: 'ಃ', name: 'ಅಃ (ah)', audioSuffix: 'ah' }
];

const ROOT_CONSONANTS = [
  { char: 'ಕ', roman: 'ka', base: 'ಕ್' },
  { char: 'ಖ', roman: 'kha', base: 'ಖ್' },
  { char: 'ಗ', roman: 'ga', base: 'ಗ್' },
  { char: 'ಘ', roman: 'gha', base: 'ಘ್' },
  { char: 'ಚ', roman: 'cha', base: 'ಚ್' },
  { char: 'ಜ', roman: 'ja', base: 'ಜ್' },
  { char: 'ಟ', roman: 'ta', base: 'ಟ್' },
  { char: 'ಡ', roman: 'da', base: 'ಡ್' },
  { char: 'ತ', roman: 'tha', base: 'ತ್' },
  { char: 'ದ', roman: 'dha', base: 'ದ್' },
  { char: 'ನ', roman: 'na', base: 'ನ್' },
  { char: 'ಪ', roman: 'pa', base: 'ಪ್' },
  { char: 'ಬ', roman: 'ba', base: 'ಬ್' },
  { char: 'ಮ', roman: 'ma', base: 'ಮ್' },
  { char: 'ಯ', roman: 'ya', base: 'ಯ್' },
  { char: 'ರ', roman: 'ra', base: 'ರ್' },
  { char: 'ಲ', roman: 'la', base: 'ಲ್' },
  { char: 'ವ', roman: 'va', base: 'ವ್' },
  { char: 'ಶ', roman: 'sha', base: 'ಶ್' },
  { char: 'ಸ', roman: 'sa', base: 'ಸ್' },
  { char: 'ಹ', roman: 'ha', base: 'ಹ್' }
];

// 7 Vibhakti Pratyayagalu (Case Endings in Kannada Grammar)
const VIBHAKTI_DATA = [
  {
    order: '1st (ಪ್ರಥಮಾ)',
    name: 'Prathama Vibhakti (Nominative)',
    marker: 'ವು (vu) / ಉ (u)',
    exampleKannada: 'ರಾಮನು ಕಾಡಿಗೆ ಹೋದನು (Ramanu kadige hodanu)',
    meaning: 'Rama went to the forest (Subject marker -ನು/-ವು)'
  },
  {
    order: '2nd (ದ್ವಿತೀಯಾ)',
    name: 'Dvitiya Vibhakti (Accusative)',
    marker: 'ಅನ್ನು (annu)',
    exampleKannada: 'ನಾನು ಪುಸ್ತಕವನ್ನು ಓದಿದೆನು (Naanu pustakavannu odidenu)',
    meaning: 'I read the book (Direct object marker -ಅನ್ನು)'
  },
  {
    order: '3rd (ತೃತೀಯಾ)',
    name: 'Trithiya Vibhakti (Instrumental)',
    marker: 'ಇಂದ (inda)',
    exampleKannada: 'ಪೆನ್ನಿನಿಂದ ಬರೆದೆನು (Pennininda baredenu)',
    meaning: 'Wrote with a pen / By or with marker -ಇಂದ'
  },
  {
    order: '4th (ಚತುರ್ಥೀ)',
    name: 'Chaturthi Vibhakti (Dative)',
    marker: 'ಗೆ / ಕ್ಕೆ / ಇಗೆ (ge / kke / ige)',
    exampleKannada: 'ಊರಿಗೆ ಹೋಗುತ್ತೇನೆ (Oorige hoguttene)',
    meaning: 'Going to my town / To or for marker -ಗೆ/-ಕ್ಕೆ'
  },
  {
    order: '5th (ಪಂಚಮೀ)',
    name: 'Panchami Vibhakti (Ablative)',
    marker: 'ದೆಸೆಯಿಂದ (deseyinda / inda)',
    exampleKannada: 'ಮರದಿಂದ ಹಣ್ಣು ಬಿತ್ತು (Maradinda hannu bittu)',
    meaning: 'Fruit fell from the tree (Separation / origin -ದಿಂದ)'
  },
  {
    order: '6th (ಷಷ್ಠೀ)',
    name: 'Shasthi Vibhakti (Genitive / Possessive)',
    marker: 'ಅ (a)',
    exampleKannada: 'ನನ್ನ ತಾಯಿಯ ಪ್ರೀತಿ (Nanna taayiya preeti)',
    meaning: 'My mother\'s love (Possession marker -ಅ/-ಯ)'
  },
  {
    order: '7th (ಸಪ್ತಮೀ)',
    name: 'Saptami Vibhakti (Locative)',
    marker: 'ಅಲ್ಲಿ (alli)',
    exampleKannada: 'ಮನೆಯಲ್ಲಿ ಎಲ್ಲರೂ ಇದ್ದಾರೆ (Maneyalli ellaroo iddaare)',
    meaning: 'Everyone is in the house (In / at marker -ಅಲ್ಲಿ)'
  }
];

// Simple Phonetic English to Kannada Transliteration Map
function simplePhoneticTransliterate(text: string): string {
  const map: Array<[RegExp, string]> = [
    [/namaskara/gi, 'ನಮಸ್ಕಾರ'],
    [/namaste/gi, 'ನಮಸ್ತೆ'],
    [/dhanyavada/gi, 'ಧನ್ಯವಾದ'],
    [/kannada/gi, 'ಕನ್ನಡ'],
    [/bengaluru/gi, 'ಬೆಂಗಳೂರು'],
    [/karnataka/gi, 'ಕರ್ನಾಟಕ'],
    [/hegiddeera/gi, 'ಹೇಗಿದ್ದೀರಾ'],
    [/hegiddiri/gi, 'ಹೇಗಿದ್ದೀರಿ'],
    [/chennagiddini/gi, 'ಚೆನ್ನಾಗಿದ್ದೀನಿ'],
    [/ooota/gi, 'ಊಟ'],
    [/oota/gi, 'ಊಟ'],
    [/aayitha/gi, 'ಆಯಿತಾ'],
    [/ayitha/gi, 'ಆಯಿತಾ'],
    [/neevu/gi, 'ನೀವು'],
    [/naanu/gi, 'ನಾನು'],
    [/beku/gi, 'ಬೇಕು'],
    [/beda/gi, 'ಬೇಡ'],
    [/coffee/gi, 'ಕಾಫಿ'],
    [/dosa/gi, 'ದೋಸೆ'],
    [/idli/gi, 'ಇಡ್ಲಿ'],
    [/mane/gi, 'ಮನೆ'],
    [/shale/gi, 'ಶಾಲೆ'],
    [/nodi/gi, 'ನೋಡಿ'],
    [/banni/gi, 'ಬನ್ನಿ'],
    [/hogi/gi, 'ಹೋಗಿ'],
    [/tumba/gi, 'ತುಂಬಾ'],
    [/eshtu/gi, 'ಎಷ್ಟು']
  ];

  let result = text;
  for (const [re, kn] of map) {
    result = result.replace(re, kn);
  }
  return result;
}

export const ScriptMasterView: React.FC<ScriptMasterViewProps> = ({
  characters,
  onSpeak,
  onAwardXP
}) => {
  const [labSection, setLabSection] = useState<'alphabet' | 'kagunitha' | 'typing' | 'grammar'>('alphabet');
  const [activeTab, setActiveTab] = useState<'all' | 'vowels' | 'consonants'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected consonant for Kagunitha
  const [selectedConsonant, setSelectedConsonant] = useState<typeof ROOT_CONSONANTS[0]>(ROOT_CONSONANTS[0]);

  // Typing pad state
  const [typingInput, setTypingInput] = useState<string>('namaskara! kannada tumba chennagide');
  const [copiedTyping, setCopiedTyping] = useState<boolean>(false);

  // Interactive Quiz state
  const [isQuizMode, setIsQuizMode] = useState<boolean>(false);
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizSelected, setQuizSelected] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const filtered = characters.filter(c => {
    if (activeTab === 'vowels' && c.type !== 'vowel' && c.type !== 'yogavahaka') return false;
    if (activeTab === 'consonants' && c.type !== 'consonant') return false;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.char.includes(q) ||
      c.transliteration.toLowerCase().includes(q) ||
      c.exampleWord.includes(q) ||
      c.exampleMeaning.toLowerCase().includes(q)
    );
  });

  const quizPool = characters.slice(0, 16);
  const currentQuizChar = quizPool[quizIndex] || quizPool[0];

  const generateOptions = (correct: ScriptCharacter) => {
    const wrong = characters
      .filter(c => c.char !== correct.char)
      .slice(0, 3)
      .map(c => c.transliteration);
    return [correct.transliteration, ...wrong].sort(() => Math.random() - 0.5);
  };

  const [quizOptions, setQuizOptions] = useState<string[]>(
    currentQuizChar ? generateOptions(currentQuizChar) : []
  );

  const handleNextQuiz = () => {
    const next = (quizIndex + 1) % quizPool.length;
    setQuizIndex(next);
    setQuizSelected(null);
    setQuizSubmitted(false);
    setQuizOptions(generateOptions(quizPool[next]));
  };

  const handleQuizSubmit = (opt: string) => {
    if (quizSubmitted) return;
    setQuizSelected(opt);
    setQuizSubmitted(true);
    if (opt === currentQuizChar.transliteration) {
      onAwardXP(20, 'Character Quiz Answered');
    }
  };

  const handleCopyTransliteration = () => {
    navigator.clipboard.writeText(simplePhoneticTransliterate(typingInput));
    setCopiedTyping(true);
    setTimeout(() => setCopiedTyping(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Script & Grammar Laboratory • ವರ್ಣಮಾಲೆ & ವ್ಯಾಕರಣ</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              Kannada Script & Grammar Lab
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Master the 49 foundational characters of the Kannada Aksharamale, explore the Kagunitha
              combinations matrix, type phonetically in English to generate Kannada script, and study
              Vibhakti Pratyayagalu (case endings).
            </p>
          </div>
        </div>
      </div>

      {/* Lab Section Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setLabSection('alphabet')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            labSection === 'alphabet'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Aksharamale (ವರ್ಣಮಾಲೆ)</span>
        </button>

        <button
          onClick={() => setLabSection('kagunitha')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            labSection === 'kagunitha'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Kagunitha Matrix (ಗುಣಿತಾಕ್ಷರ)</span>
        </button>

        <button
          onClick={() => setLabSection('typing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            labSection === 'typing'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Keyboard className="w-4 h-4" />
          <span>Phonetic Typing Pad (ಕನ್ನಡ ಟೈಪಿಂಗ್)</span>
        </button>

        <button
          onClick={() => setLabSection('grammar')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            labSection === 'grammar'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Case Endings (ವಿಭಕ್ತಿ ಪ್ರತ್ಯಯಗಳು)</span>
        </button>
      </div>

      {/* SECTION 1: Aksharamale */}
      {labSection === 'alphabet' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {(['all', 'vowels', 'consonants'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {tab === 'all' ? 'All (49)' : tab === 'vowels' ? 'Vowels (ಸ್ವರಗಳು - 14)' : 'Consonants (ವ್ಯಂಜನಗಳು - 34)'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search letter or word..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                onClick={() => setIsQuizMode(!isQuizMode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isQuizMode
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isQuizMode ? 'Exit Quiz' : 'Quiz Mode (+20 XP)'}
              </button>
            </div>
          </div>

          {/* Quiz Mode Banner */}
          {isQuizMode && currentQuizChar && (
            <div className="bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/40 rounded-2xl p-6 text-center shadow-lg space-y-4">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                Identify the Transliteration
              </span>
              <div className="text-6xl font-bold font-kannada text-white my-2">
                {currentQuizChar.char}
              </div>
              <p className="text-xs text-slate-400">
                Which Romanized transliteration correctly matches this character?
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
                {quizOptions.map((opt, i) => {
                  const isSelected = quizSelected === opt;
                  const isCorrect = opt === currentQuizChar.transliteration;
                  let style = 'bg-slate-900 border-slate-700 text-slate-200 hover:border-amber-400';
                  if (quizSubmitted) {
                    if (isCorrect) style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                    else if (isSelected && !isCorrect) style = 'bg-rose-950/60 border-rose-500 text-rose-200';
                  } else if (isSelected) {
                    style = 'bg-amber-950/60 border-amber-400 text-amber-200';
                  }

                  return (
                    <button
                      key={i}
                      disabled={quizSubmitted}
                      onClick={() => handleQuizSubmit(opt)}
                      className={`p-3 rounded-xl border text-sm font-mono font-bold transition-all ${style}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {quizSubmitted && (
                <div className="pt-2 flex flex-col items-center gap-2">
                  <div className="text-xs font-medium text-slate-300">
                    Example word: <span className="font-kannada font-bold text-white">{currentQuizChar.exampleWord}</span> ({currentQuizChar.exampleMeaning})
                  </div>
                  <button
                    onClick={handleNextQuiz}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                  >
                    Next Character
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Grid of Characters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filtered.map(c => (
              <div
                key={c.char}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 hover:border-emerald-500/50 hover:bg-slate-900 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      {c.type}
                    </span>
                    <button
                      onClick={() => onSpeak(c.char)}
                      className="p-1 text-slate-500 hover:text-emerald-400 rounded hover:bg-slate-800 transition-colors"
                      title="Pronounce letter"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-3xl font-bold font-kannada text-white my-1 text-center group-hover:scale-105 transition-transform">
                    {c.char}
                  </div>
                  <div className="text-xs font-mono text-emerald-400 text-center font-semibold">
                    {c.transliteration}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-center">
                  <div className="font-kannada text-slate-300">{c.exampleWord}</div>
                  <div className="text-slate-500 truncate">{c.exampleMeaning}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: Kagunitha Matrix */}
      {labSection === 'kagunitha' && (
        <div className="space-y-6">
          {/* Consonant Selector */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Select Base Consonant (ವ್ಯಂಜನ):
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {ROOT_CONSONANTS.map(con => (
                <button
                  key={con.char}
                  onClick={() => setSelectedConsonant(con)}
                  className={`px-3 py-1.5 rounded-lg font-kannada text-sm font-bold transition-all ${
                    selectedConsonant.char === con.char
                      ? 'bg-emerald-500 text-slate-950 shadow-md scale-105'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {con.char}
                </button>
              ))}
            </div>
          </div>

          {/* Kagunitha Combination Grid */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold font-kannada text-white">
                  {selectedConsonant.char} ಗುಣಿತಾಕ್ಷರ (Kagunitha for "{selectedConsonant.char}" / {selectedConsonant.roman})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Showing all 15 vowel marker combinations from ಅ to ಅಃ
                </p>
              </div>
              <button
                onClick={() => onSpeak(`${selectedConsonant.char} ಗುಣಿತಾಕ್ಷರ`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium"
              >
                <Volume2 className="w-3.5 h-3.5" /> Listen
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-3">
              {KAGUNITHA_VOWELS.map((vowel, idx) => {
                const combinedChar = `${selectedConsonant.char}${vowel.sign}`;
                return (
                  <div
                    key={idx}
                    onClick={() => onSpeak(combinedChar)}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 cursor-pointer text-center group transition-all"
                  >
                    <div className="text-2xl font-bold font-kannada text-white group-hover:text-emerald-400 group-hover:scale-110 transition-transform">
                      {combinedChar}
                    </div>
                    <div className="text-[11px] font-mono text-emerald-300 mt-1">
                      {vowel.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: Phonetic Typing Pad */}
      {labSection === 'typing' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Keyboard className="w-5 h-5 text-emerald-400" />
              English-to-Kannada Live Phonetic Converter
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Type Kannada phonetically using English letters (e.g. "namaskara", "kannada", "bengaluru",
              "chennagiddini", "oota aayitha", "coffee beku") to instantly see genuine Kannada script.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Box */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Type in English Phonetics:
              </span>
              <textarea
                rows={4}
                value={typingInput}
                onChange={e => setTypingInput(e.target.value)}
                placeholder="Type here: e.g. namaskara neevu hegiddeera..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono resize-none"
              />
            </div>

            {/* Output Kannada Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
                  Kannada Script Output:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSpeak(simplePhoneticTransliterate(typingInput))}
                    className="p-1 text-slate-400 hover:text-emerald-400 rounded hover:bg-slate-800"
                    title="Speak converted text"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCopyTransliteration}
                    className="p-1 text-slate-400 hover:text-emerald-400 rounded hover:bg-slate-800"
                    title="Copy Kannada text"
                  >
                    {copiedTyping ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="w-full bg-slate-950/80 border border-emerald-500/30 rounded-xl p-3 text-xl font-kannada text-white font-medium min-h-[105px] flex items-center">
                {simplePhoneticTransliterate(typingInput)}
              </div>
            </div>
          </div>

          {/* Quick Click Words */}
          <div className="pt-2">
            <span className="text-xs text-slate-400 block mb-2 font-medium">Quick Phonetic Samples:</span>
            <div className="flex items-center gap-2 flex-wrap text-xs">
              {[
                'namaskara',
                'dhanyavada',
                'hegiddiri',
                'chennagiddini',
                'oota aayitha',
                'coffee beku',
                'eshtu'
              ].map(sample => (
                <button
                  key={sample}
                  onClick={() => setTypingInput(prev => `${prev} ${sample}`.trim())}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono transition-colors"
                >
                  +{sample}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: Vibhakti Pratyayagalu */}
      {labSection === 'grammar' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div>
            <h3 className="text-lg font-bold font-kannada text-white">
              ವಿಭಕ್ತಿ ಪ್ರತ್ಯಯಗಳು (The 7 Case Endings of Kannada Grammar)
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              In Kannada, grammatical roles like direct object, instrument, destination, and origin
              are indicated by appending specific suffixes (ಪ್ರತ್ಯಯಗಳು) to nouns.
            </p>
          </div>

          <div className="space-y-3">
            {VIBHAKTI_DATA.map((v, i) => (
              <div
                key={i}
                className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-emerald-500/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {v.order}
                    </span>
                    <span className="text-xs font-medium text-slate-300">{v.name}</span>
                    <span className="text-xs font-mono text-teal-300 font-bold">Suffix: {v.marker}</span>
                  </div>
                  <div className="text-base font-kannada font-bold text-white mt-1">
                    {v.exampleKannada}
                  </div>
                  <div className="text-xs text-slate-400">{v.meaning}</div>
                </div>

                <button
                  onClick={() => onSpeak(v.exampleKannada)}
                  className="self-start md:self-center p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors shrink-0"
                  title="Listen to example"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
