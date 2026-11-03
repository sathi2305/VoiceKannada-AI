/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  NavTab,
  Lesson,
  SavedPhrase,
  Conversation,
  UserProgress,
  AppSettings,
  SentenceBuilderExercise,
  ListeningExercise,
  RolePlayScenario,
  ScriptCharacter,
  UserProfile
} from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OnboardingModal } from './components/OnboardingModal';
import { DashboardView } from './pages/DashboardView';
import { AssistantView } from './pages/AssistantView';
import { LearningStudioView } from './pages/LearningStudioView';
import { SpeakingPracticeView } from './pages/SpeakingPracticeView';
import { SentenceBuilderView } from './pages/SentenceBuilderView';
import { ListeningComprehensionView } from './pages/ListeningComprehensionView';
import { RoleplayView } from './pages/RoleplayView';
import { ScriptMasterView } from './pages/ScriptMasterView';
import { VocabularyView } from './pages/VocabularyView';
import { HistoryView } from './pages/HistoryView';
import { ProgressView } from './pages/ProgressView';
import { SettingsView } from './pages/SettingsView';
import { AboutView } from './pages/AboutView';
import { VisualIntelligenceView } from './pages/VisualIntelligenceView';
import { TranslatorView } from './pages/TranslatorView';
import { CultureView } from './pages/CultureView';
import { QuestsView } from './pages/QuestsView';
import { MistakeCoachView } from './pages/MistakeCoachView';
import { OfflineIndicator } from './components/OfflineIndicator';
import { api } from './services/api';
import { speechService } from './services/speech';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('vok_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('vok_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  // Application Data States
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [savedPhrases, setSavedPhrases] = useState<SavedPhrase[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Specialized Studio Data States
  const [sentenceExercises, setSentenceExercises] = useState<SentenceBuilderExercise[]>([]);
  const [listeningExercises, setListeningExercises] = useState<ListeningExercise[]>([]);
  const [roleplayScenarios, setRoleplayScenarios] = useState<RolePlayScenario[]>([]);
  const [scriptCharacters, setScriptCharacters] = useState<ScriptCharacter[]>([]);

  // Onboarding Modal State
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  // App Settings with localStorage persistence
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('vok_app_settings');
      if (saved) {
        return {
          speechInputMode: 'browser',
          speechOutputMode: 'browser',
          voiceRate: 0.95,
          voicePitch: 1.0,
          transliterationStyle: 'standard',
          theme: 'dark',
          continuousModeDefault: false,
          explanationLanguage: 'english',
          textSize: 'normal',
          responseLength: 'detailed',
          ...JSON.parse(saved)
        };
      }
    } catch {
      // fallback
    }
    return {
      speechInputMode: 'browser',
      speechOutputMode: 'browser',
      voiceRate: 0.95,
      voicePitch: 1.0,
      transliterationStyle: 'standard',
      theme: 'dark',
      continuousModeDefault: false,
      explanationLanguage: 'english',
      textSize: 'normal',
      responseLength: 'detailed'
    };
  });

  // Persist settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vok_app_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Synchronize theme with DOM documentElement
  useEffect(() => {
    const isLight = settings.theme === 'light';
    if (isLight) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, [settings.theme]);

  // Practice initial target for cross-page launch
  const [practiceInitialTarget, setPracticeInitialTarget] = useState<{
    kannada: string;
    transliteration: string;
    english: string;
  } | undefined>(undefined);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch initial data
  const loadData = async () => {
    try {
      const [
        lessonsData,
        phrasesData,
        convoData,
        progressData,
        profileData,
        sentenceData,
        listeningData,
        roleplayData,
        charsData
      ] = await Promise.all([
        api.getLessons().catch(() => []),
        api.getSavedPhrases().catch(() => []),
        api.getConversations().catch(() => []),
        api.getProgress().catch(() => null),
        api.getUserProfile().catch(() => null),
        api.getSentenceBuilderExercises().catch(() => []),
        api.getListeningExercises().catch(() => []),
        api.getRoleplayScenarios().catch(() => []),
        api.getScriptCharacters().catch(() => [])
      ]);

      setLessons(lessonsData);
      setSavedPhrases(phrasesData);
      setConversations(convoData);
      setProgress(progressData);
      setUserProfile(profileData);
      setSentenceExercises(sentenceData);
      setListeningExercises(listeningData);
      setRoleplayScenarios(roleplayData);
      setScriptCharacters(charsData);

      // Trigger onboarding modal if user hasn't set their preferences
      if (profileData && !profileData.onboardingCompleted) {
        setShowOnboarding(true);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSpeak = (text: string) => {
    speechService.speakKannada(text, {
      rate: settings.voiceRate,
      pitch: settings.voicePitch,
      preferBackend: settings.speechOutputMode === 'backend',
      onStart: () => setIsAudioPlaying(true),
      onEnd: () => setIsAudioPlaying(false),
      onError: (err) => {
        setIsAudioPlaying(false);
        console.warn('Speech playback issue:', err);
      }
    });
  };

  const handleStopAudio = () => {
    speechService.stopSpeaking();
    setIsAudioPlaying(false);
  };

  const handleAwardXP = async (amount: number, reason: string) => {
    try {
      const res = await api.addXP(amount, reason);
      if (progress) {
        setProgress({
          ...progress,
          xp: res.xp,
          level: res.level
        });
      }
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          xp: res.xp,
          level: res.level
        });
      }

      if (res.unlockedAchievements && res.unlockedAchievements.length > 0) {
        const ach = res.unlockedAchievements[0];
        showToast(`🏆 Milestone Unlocked: ${ach.title} (+${ach.xpReward} XP)!`);
        speechService.playChime('success');
      } else {
        showToast(`+${amount} XP: ${reason}`);
      }
    } catch (err) {
      console.warn('Failed to award XP:', err);
    }
  };

  const handleSaveProfile = async (profileUpdate: Partial<UserProfile>) => {
    try {
      const updated = await api.updateUserProfile(profileUpdate);
      setUserProfile(updated);
      setShowOnboarding(false);
      showToast('Learning path and proficiency goals saved!');
    } catch (err: any) {
      alert(`Could not save profile: ${err.message}`);
    }
  };

  const handleToggleCompleteLesson = async (lessonId: string) => {
    try {
      const res = await api.toggleLessonComplete(lessonId);
      // Update local state
      setLessons(prev =>
        prev.map(l => (l.id === lessonId ? { ...l, isCompleted: res.completed } : l))
      );
      if (progress) {
        setProgress({
          ...progress,
          completedLessonIds: res.completedLessonIds,
          completedCount: res.completedLessonIds.length,
          completionPercentage: Math.round((res.completedLessonIds.length / (lessons.length || 6)) * 100),
          xp: res.completed ? (progress.xp || 0) + 100 : progress.xp
        });
      }
      showToast(res.completed ? 'Module completed! (+100 XP)' : 'Module marked as incomplete');
    } catch (err: any) {
      alert(`Error toggling lesson: ${err.message}`);
    }
  };

  const handleSavePhrase = async (phrase: {
    kannada: string;
    transliteration: string;
    english: string;
    category?: string;
    notes?: string;
  }) => {
    try {
      const saved = await api.savePhrase(phrase);
      setSavedPhrases(prev => {
        const exists = prev.some(p => p.kannada.trim() === saved.kannada.trim());
        return exists ? prev : [saved, ...prev];
      });
      showToast('Phrase saved to vocabulary notebook! (+10 XP)');
    } catch (err: any) {
      alert(`Could not save phrase: ${err.message}`);
    }
  };

  const handleDeleteSavedPhrase = async (id: string) => {
    try {
      await api.deleteSavedPhrase(id);
      setSavedPhrases(prev => prev.filter(p => p.id !== id));
      showToast('Phrase removed from notebook');
    } catch (err: any) {
      alert(`Could not delete phrase: ${err.message}`);
    }
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await api.deleteConversation(id);
      setConversations(prev => prev.filter(c => c.id !== id));
      showToast('Conversation deleted');
    } catch (err: any) {
      alert(`Could not delete conversation: ${err.message}`);
    }
  };

  const handleResetAllData = async () => {
    if (window.confirm('Are you sure you want to reset all learning progress, saved vocabulary, and chat history?')) {
      try {
        await api.resetData();
        await loadData();
        showToast('All progress and data reset successfully');
      } catch (err: any) {
        alert(`Reset failed: ${err.message}`);
      }
    }
  };

  const handleExtendStreak = async (): Promise<number> => {
    try {
      const res = await api.extendStreak();
      if (progress) {
        setProgress({
          ...progress,
          streakDays: res.streakDays,
          lastActiveDate: res.lastActiveDate,
          xp: (progress.xp || 0) + 30
        });
      } else {
        await loadData();
      }
      return res.streakDays;
    } catch (err: any) {
      console.error('Failed to extend streak:', err);
      const newStreak = (progress?.streakDays || 1) + 1;
      if (progress) {
        setProgress({
          ...progress,
          streakDays: newStreak
        });
      }
      return newStreak;
    }
  };

  const handleLaunchPractice = (targetKannada: string, targetTransliteration: string, targetEnglish: string) => {
    setPracticeInitialTarget({
      kannada: targetKannada,
      transliteration: targetTransliteration,
      english: targetEnglish
    });
    setCurrentTab('practice');
  };

  const savedPhraseKeys = new Set(savedPhrases.map(p => p.kannada.trim()));
  const isLight = settings.theme === 'light';
  const handleToggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-emerald-500/30 selection:text-emerald-800 ${isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#070d19] text-slate-100'}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 border border-emerald-500/50 text-emerald-300 px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Onboarding Wizard Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onSaveProfile={handleSaveProfile}
        initialProfile={userProfile || undefined}
      />

      {/* Main Layout Grid */}
      <div className="flex flex-1">
        {/* Left Sidebar Navigation */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          streakDays={progress?.streakDays || 1}
          completedLessonsCount={progress?.completedLessonIds?.length || 0}
          collapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />

        {/* Content Wrapper */}
        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
          {/* Header */}
          <Header
            currentTab={currentTab}
            onOpenMobile={() => setMobileOpen(true)}
            onNavigate={setCurrentTab}
            isAudioPlaying={isAudioPlaying}
            onStopAudio={handleStopAudio}
            theme={settings.theme}
            onToggleTheme={handleToggleTheme}
            isSidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={handleToggleSidebar}
          />

          {/* View Container */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
            {currentTab === 'dashboard' && (
              <DashboardView
                onNavigate={setCurrentTab}
                onLaunchPractice={handleLaunchPractice}
                onSpeak={handleSpeak}
                progress={progress}
                lessons={lessons}
                onExtendStreak={handleExtendStreak}
              />
            )}

            {currentTab === 'assistant' && (
              <AssistantView
                onSpeak={handleSpeak}
                onStopAudio={handleStopAudio}
                isAudioPlaying={isAudioPlaying}
                onSavePhrase={handleSavePhrase}
                savedPhraseKeys={savedPhraseKeys}
              />
            )}

            {currentTab === 'vision' && (
              <VisualIntelligenceView
                onSpeak={handleSpeak}
                onSavePhrase={handleSavePhrase}
                onLaunchPractice={(t) => handleLaunchPractice(t.kannada, t.transliteration, t.english)}
                savedPhraseKeys={savedPhraseKeys}
              />
            )}

            {currentTab === 'translator' && (
              <TranslatorView
                onSpeak={handleSpeak}
                onSavePhrase={handleSavePhrase}
              />
            )}

            {currentTab === 'culture' && (
              <CultureView
                onSpeak={handleSpeak}
                onSavePhrase={handleSavePhrase}
                onAwardXP={handleAwardXP}
              />
            )}

            {currentTab === 'quests' && (
              <QuestsView
                onNavigate={setCurrentTab}
                onAwardXP={handleAwardXP}
              />
            )}

            {currentTab === 'mistakes' && (
              <MistakeCoachView
                onSpeak={handleSpeak}
                onLaunchPractice={(t) => handleLaunchPractice(t.kannada, t.transliteration, t.english)}
                onSavePhrase={handleSavePhrase}
              />
            )}

            {currentTab === 'learning' && (
              <LearningStudioView
                lessons={lessons}
                onSpeak={handleSpeak}
                onLaunchPractice={handleLaunchPractice}
                onToggleCompleteLesson={handleToggleCompleteLesson}
                onSavePhrase={handleSavePhrase}
                savedPhraseKeys={savedPhraseKeys}
              />
            )}

            {currentTab === 'practice' && (
              <SpeakingPracticeView
                onSpeak={handleSpeak}
                onStopAudio={handleStopAudio}
                isAudioPlaying={isAudioPlaying}
                initialTarget={practiceInitialTarget}
                onSavePhrase={handleSavePhrase}
                savedPhraseKeys={savedPhraseKeys}
              />
            )}

            {currentTab === 'builder' && (
              <SentenceBuilderView
                exercises={sentenceExercises}
                onSpeak={handleSpeak}
                onAwardXP={handleAwardXP}
              />
            )}

            {currentTab === 'listening' && (
              <ListeningComprehensionView
                exercises={listeningExercises}
                onSpeak={handleSpeak}
                onAwardXP={handleAwardXP}
              />
            )}

            {currentTab === 'roleplay' && (
              <RoleplayView
                scenarios={roleplayScenarios}
                onSpeak={handleSpeak}
                onAwardXP={handleAwardXP}
              />
            )}

            {currentTab === 'characters' && (
              <ScriptMasterView
                characters={scriptCharacters}
                onSpeak={handleSpeak}
                onAwardXP={handleAwardXP}
              />
            )}

            {currentTab === 'vocabulary' && (
              <VocabularyView
                savedPhrases={savedPhrases}
                onSpeak={handleSpeak}
                onLaunchPractice={handleLaunchPractice}
                onDeleteSavedPhrase={handleDeleteSavedPhrase}
                onAddCustomPhrase={handleSavePhrase}
              />
            )}

            {currentTab === 'history' && (
              <HistoryView
                conversations={conversations}
                onSpeak={handleSpeak}
                onDeleteConversation={handleDeleteConversation}
                onNavigate={setCurrentTab}
              />
            )}

            {currentTab === 'progress' && (
              <ProgressView
                progress={progress}
                lessons={lessons}
                onNavigate={setCurrentTab}
                onLaunchPractice={handleLaunchPractice}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsView
                settings={settings}
                onUpdateSettings={(newVals) => setSettings(prev => ({ ...prev, ...newVals }))}
                onResetAllData={handleResetAllData}
              />
            )}

            {currentTab === 'about' && <AboutView />}
          </main>
        </div>
      </div>
      <OfflineIndicator />
    </div>
  );
}
