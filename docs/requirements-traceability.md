# Kannada Technology Challenge — Requirements Traceability Matrix

## 1. Official Challenge Requirements

| Requirement ID | Official Requirement Title | Description & Scope | Source / Priority | Implemented In | Verification Method | Status |
|---|---|---|---|---|---|---|
| **REQ-1.1** | Voice Assistant Workspace | Premium AI conversation workspace with large animated microphone control, distinct states (idle, listening, processing, speaking, error), push-to-talk default, continuous mode toggle, and clear audio controls. | Priority 1 & 2 | `src/pages/AssistantView.tsx`<br>`src/components/MicButton.tsx`<br>`src/components/AudioVisualizer.tsx` | Visual state verification, mic click/hold triggers, audio waveform rendering. | **VERIFIED** |
| **REQ-1.2** | Dual-Language Presentation | Every conversation bubble and phrase card displays authentic Kannada script (ಕನ್ನಡ), readable Roman transliteration, and precise English translation. | Priority 1 | `src/pages/AssistantView.tsx`<br>`src/types/index.ts` | Inspection of user & assistant chat messages, lesson phrase cards. | **VERIFIED** |
| **REQ-2.1** | Kannada Speech Input (STT) | Capture user speech via microphone, request browser permissions gracefully, and transcribe spoken Kannada using Web Speech API (`kn-IN`) with interim live streaming and backend cloud fallback. | Priority 2 | `src/services/speech.ts`<br>`server/routes.ts` (`/api/speech/transcribe`) | Microphone audio capture test in Chromium browser with Kannada phrases. | **VERIFIED** |
| **REQ-2.2** | Permission & Error Handling | Handle permission denied (`not-allowed`), no speech detected (`no-speech`), network errors, and unsupported browser states with clear instructional banners. | Priority 2 | `src/services/speech.ts`<br>`src/pages/AssistantView.tsx` | Error banner rendering when permissions are denied or mock error triggered. | **VERIFIED** |
| **REQ-3.1** | Real AI Conversation | Connect frontend to backend Express endpoint (`POST /api/chat`) calling Google GenAI SDK with Gemini 3.8 Flash (`gemini-3.8-flash`). Preserves conversation history, outputs structured JSON, and includes grammar notes. | Priority 3 | `server/routes.ts`<br>`server/gemini.ts`<br>`src/services/api.ts` | Automated curl test & browser assistant dialogue testing. | **VERIFIED** |
| **REQ-4.1** | Kannada Speech Output (TTS) | Genuine text-to-speech for Kannada responses with replay, pause, and stop controls. Detects native Kannada voice or falls back to Gemini TTS (`gemini-3.8-flash-lite-tts`). | Priority 4 | `src/services/speech.ts`<br>`server/gemini.ts`<br>`src/components/Header.tsx` | Audio playback on clicking "Listen" or assistant auto-speak. Stop audio button stops immediately. | **VERIFIED** |
| **REQ-5.1** | Kannada Learning Studio | Organized syllabus (Basics & Greetings, Travel & Transport, Market Shopping, Food & Dining, Healthcare Emergencies, Daily Life) with phrase cards, word breakdowns, and completion tracking. | Priority 5 | `src/pages/LearningStudioView.tsx`<br>`server/data/lessons.ts` | Filter modules, view phrase breakdown, click "Complete Module", verify persistence. | **VERIFIED** |
| **REQ-5.2** | Grounded Speaking Practice | Target Kannada phrase → reference audio pronunciation → user recording → recognized transcript → side-by-side token comparison → transparent feedback. No fake scores. | Priority 5 | `src/pages/SpeakingPracticeView.tsx`<br>`src/utils/textComparison.ts` | Speak target phrase, inspect matched vs missing words and token similarity score. | **VERIFIED** |
| **REQ-6.1** | Real Progress & Persistence | Persist lesson completions, verified practice history, saved phrases, and conversations to atomic local storage (`data/storage.json`). | Priority 6 | `server/db.ts`<br>`src/pages/ProgressView.tsx`<br>`src/pages/HistoryView.tsx` | Complete lesson, practice phrase, refresh page, verify data persistence. | **VERIFIED** |
| **REQ-6.2** | Privacy & Security | Zero permanent retention of raw microphone audio recordings; client-side audio processing option; transparent privacy disclosure; reset data control. | Priority 6 | `src/pages/SettingsView.tsx` | Verified privacy banner and atomic data reset button. | **VERIFIED** |

---

## 2. Additional Proposed Enhancements (Clearly Distinguished)

| Enhancement ID | Feature Name | Description | Reason for Inclusion | Status |
|---|---|---|---|---|
| **ENH-01** | Everyday Karnataka Scenarios | Quick-practice cards for iconic situations (Auto ride, Darshini coffee, Metro, Market bargaining). | Immediate practical utility for newcomers in Bengaluru. | Implemented |
| **ENH-02** | Custom Phrase Notebook | Ability for learners to add their own custom Kannada phrases into the vocabulary notebook. | Allows customized study and real-life personalization. | Implemented |
| **ENH-03** | Assistant Mode Selector | Modes for Free Conversation, Grammar Explanation, Translator, and Bengaluru Roleplay. | Enhances learning depth by structuring AI prompts to specific pedagogical goals. | Implemented |
| **ENH-04** | Web Audio Haptic Chimes | Soft tone chimes (sine waves) indicating microphone start, stop, and success. | Provides tactile, non-visual cues for accessibility. | Implemented |
| **ENH-05** | JSON Chat Export | Export conversation history as structured JSON. | Enables learners to take conversation transcripts offline for study. | Implemented |
| **ENH-06** | Prominent Daily Learning Streak Showcase & Celebration | Dedicated streak showcase card with live progress binding, 7-day week activity tracker, flame pulse animations, and celebratory confetti explosion with Web Audio success chime when streak is extended. | Motivate daily consistency and habit formation for Kannada language acquisition. | Implemented |
