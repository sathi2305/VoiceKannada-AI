import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Volume2,
  Compass,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Share2,
  Award,
  Layers,
  Check,
  BookmarkPlus,
  Quote
} from 'lucide-react';
import { CultureArticle } from '../types';
import { api } from '../services/api';

interface CultureViewProps {
  onSpeak: (text: string) => void;
  onSavePhrase?: (phrase: {
    kannada: string;
    transliteration: string;
    english: string;
    category: string;
  }) => void;
  onAwardXP?: (amount: number, reason: string) => void;
}

export const CultureView: React.FC<CultureViewProps> = ({ onSpeak, onSavePhrase, onAwardXP }) => {
  const [articles, setArticles] = useState<CultureArticle[]>([]);
  const [selectedArticleId, setSelectedArticleId] = useState<string>('cult-dialects-overview');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

  // Quiz state per article
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await api.getCultureArticles();
      setArticles(data);
      if (data.length > 0 && !selectedArticleId) {
        setSelectedArticleId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load culture articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedArticle = articles.find(a => a.id === selectedArticleId) || articles[0];

  const categories = [
    { id: 'all', label: 'All Heritage Topics', labelKannada: 'ಎಲ್ಲಾ ವಿಷಯಗಳು' },
    { id: 'dialects', label: 'Regional Dialects', labelKannada: 'ಪ್ರಾದೇಶಿಕ ಉಪಭಾಷೆಗಳು' },
    { id: 'festivals', label: 'Festivals & Dasara', labelKannada: 'ಹಬ್ಬಗಳು' },
    { id: 'food', label: 'Culinary Traditions', labelKannada: 'ಆಹಾರ ಪರಂಪರೆ' },
    { id: 'literature', label: 'Literature & Inscriptions', labelKannada: 'ಸಾಹಿತ್ಯ & ಇತಿಹಾಸ' },
    { id: 'etiquette', label: 'Respect & Etiquette', labelKannada: 'ಗೌರವ & ಶಿಷ್ಟಾಚಾರ' }
  ];

  const filteredArticles = articles.filter(a => {
    if (activeCategory === 'all') return true;
    return a.category === activeCategory;
  });

  const handleSelectQuizOption = (articleId: string, optionIdx: number) => {
    if (quizSubmitted[articleId]) return;
    setQuizAnswers(prev => ({ ...prev, [articleId]: optionIdx }));
  };

  const handleSubmitQuiz = (articleId: string, correctIdx: number) => {
    if (quizAnswers[articleId] === undefined || quizSubmitted[articleId]) return;
    setQuizSubmitted(prev => ({ ...prev, [articleId]: true }));
    if (quizAnswers[articleId] === correctIdx) {
      onAwardXP?.(25, 'Culture Quiz Answered Correctly');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Verified Heritage Library • ಸಂಸ್ಕೃತಿ ಮತ್ತು ಇತಿಹಾಸ</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              Kannada Culture & Context Engine
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Immerse yourself in authentic Karnataka heritage, regional linguistic varieties
              (Mysuru, Hubballi-Dharwad, Coastal, Kalaburagi), ancient inscriptions, culinary lore,
              and nuanced conversational etiquette.
            </p>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl font-medium shrink-0 transition-all ${
              activeCategory === cat.id
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/40'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>{cat.label}</span>
            <span className="text-[11px] font-kannada opacity-70 ml-1.5">{cat.labelKannada}</span>
          </button>
        ))}
      </div>

      {/* Main Grid: Articles Nav + Article Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Article Selector */}
        <div className="lg:col-span-4 space-y-2">
          {filteredArticles.map(article => {
            const isSelected = article.id === selectedArticleId;
            return (
              <button
                key={article.id}
                onClick={() => setSelectedArticleId(article.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-emerald-400 uppercase tracking-wide font-semibold mb-1">
                  <span>{article.region}</span>
                  <span className="text-slate-500">{article.keyPhrases.length} phrases</span>
                </div>
                <div className="text-base font-bold text-white font-kannada">
                  {article.titleKannada}
                </div>
                <div className="text-xs text-slate-300 mt-0.5">{article.titleEnglish}</div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Selected Article Reader */}
        {selectedArticle && (
          <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            {/* Title & Metadata */}
            <div className="border-b border-slate-800 pb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {selectedArticle.region}
                </span>
                <span className="text-xs text-slate-400 font-mono uppercase">
                  {selectedArticle.category}
                </span>
              </div>
              <h2 className="text-2xl font-bold font-kannada text-white">
                {selectedArticle.titleKannada}
              </h2>
              <h3 className="text-base font-medium text-slate-300 mt-0.5">
                {selectedArticle.titleEnglish}
              </h3>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                {selectedArticle.description}
              </p>
            </div>

            {/* Verified Historical Context */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                <BookOpen className="w-4 h-4" /> Verified Historical & Epigraphical Notes
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedArticle.verifiedHistoricalNotes}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <Quote className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Source: {selectedArticle.sourceCitation}</span>
              </div>
            </div>

            {/* Key Phrases in this Cultural Domain */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-400" />
                Key Phrases & Spoken Expressions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedArticle.keyPhrases.map((phrase, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 hover:border-emerald-500/40 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-lg font-bold font-kannada text-white">
                          {phrase.kannada}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => onSpeak(phrase.kannada)}
                            className="p-1 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-700 transition-colors"
                            title="Listen"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          {onSavePhrase && (
                            <button
                              onClick={() =>
                                onSavePhrase({
                                  kannada: phrase.kannada,
                                  transliteration: phrase.transliteration,
                                  english: phrase.english,
                                  category: 'culture'
                                })
                              }
                              className="p-1 text-slate-400 hover:text-teal-400 rounded-lg hover:bg-slate-700 transition-colors"
                              title="Save to notebook"
                            >
                              <BookmarkPlus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="text-xs font-mono text-emerald-400 mt-0.5">
                        {phrase.transliteration}
                      </div>
                      <div className="text-xs text-slate-200 mt-1">{phrase.english}</div>
                    </div>
                    {phrase.context && (
                      <p className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-700/40 italic">
                        {phrase.context}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Comprehension Quiz Card */}
            {selectedArticle.quiz && (
              <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/20 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                      Cultural Mastery Check • +25 XP
                    </span>
                  </div>
                  {quizSubmitted[selectedArticle.id] && (
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded ${
                        quizAnswers[selectedArticle.id] === selectedArticle.quiz.correctIndex
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {quizAnswers[selectedArticle.id] === selectedArticle.quiz.correctIndex
                        ? 'Correct Answer! +25 XP'
                        : 'Review Explanation'}
                    </span>
                  )}
                </div>

                <p className="text-sm font-medium text-slate-200">
                  {selectedArticle.quiz.question}
                </p>

                <div className="space-y-2">
                  {selectedArticle.quiz.options.map((option, idx) => {
                    const isSelected = quizAnswers[selectedArticle.id] === idx;
                    const isSubmitted = quizSubmitted[selectedArticle.id];
                    const isCorrect = idx === selectedArticle.quiz?.correctIndex;

                    let btnStyle = 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700';
                    if (isSubmitted) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isSubmitted}
                        onClick={() => handleSelectQuizOption(selectedArticle.id, idx)}
                        className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{option}</span>
                        {isSubmitted && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {!quizSubmitted[selectedArticle.id] ? (
                  <button
                    disabled={quizAnswers[selectedArticle.id] === undefined}
                    onClick={() =>
                      handleSubmitQuiz(selectedArticle.id, selectedArticle.quiz!.correctIndex)
                    }
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold transition-all shadow-md"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <div className="bg-slate-900/90 rounded-lg p-3 text-xs text-slate-300 border border-slate-800">
                    <span className="font-semibold text-emerald-400 block mb-0.5">
                      Heritage Explanation:
                    </span>
                    {selectedArticle.quiz.explanation}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
