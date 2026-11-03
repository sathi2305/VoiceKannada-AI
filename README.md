# Voice of Kannada (ಕನ್ನಡದ ಧ್ವನಿ)
### Advanced AI Voice Assistant, Realistic 3D Human AI Tutor & Kannada Learning Platform

[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r174-black.svg)](https://threejs.org/)
[![Gemini](https://img.shields.io/badge/Gemini-3.8--flash-orange.svg)](https://ai.google.dev/)
[![Locale](https://img.shields.io/badge/Locale-kn--IN-emerald.svg)](https://en.wikipedia.org/wiki/Kannada)

---

## 1. Project Overview

**Voice of Kannada** is a cinematic, production-grade AI language platform and conversational tutor designed for the **Kannada Technology Challenge** and hackathon competitions:
- **Realistic Human 3D AI Tutor**: An interactive 3D virtual teacher rendered with Three.js featuring tailored traditional attire (Nehru jacket/kurta with emerald silk trim), realistic PBR skin and eyes, procedural eyelid blinking, jaw/lip visemes synchronized to speech audio playback, cursor head-tracking, and cultural Namaskara salutation / celebration animations.
- **Complete 45-Module Learning Studio**: A comprehensive 3-tier master curriculum:
  - **Level 1 (Beginner - 15 Modules)**: Greetings, Swaragalu vowels, Vyanjanagalu consonants, Numbers 1-20, Family, Everyday Objects, Colors, Days & Time, Food & Fruits, Beku/Beda modal verbs, Pronouns, Location (Elli/Illi/Alli), Shopping & Prices, Haudu/Illa/Alla negations, Daily Routine.
  - **Level 2 (Intermediate - 15 Modules)**: Core Verbs, Present Continuous, Past Tense, Future Tense, Auto & Metro dialogues, Darshini ordering, Market bargaining, Directions & Addresses, Health/Doctor, Bengaluru Weather, Telephone Kannada, Emotions, Negation (Baralla/Gotthilla), Home Visits, 6 Wh- Questions.
  - **Level 3 (Advanced - 15 Modules)**: Vibhakti Pratyayagalu (7 Cases), Conjunctions (Mattu/Aadare/Aaddarinda), Conditionals (If... then), Office/Professional Kannada, Idioms/Gaadegalu, Formal vs Informal Register, Karnataka Festivals, Heritage & History, Vachana Sahitya, Social Etiquette, Banking, Emergency Reporting, Karnataka Travel (Hampi-Coorg), Debates & Discourse, Fluent Colloquial Flow.
  - Every module contains objectives, phrases with word-by-word breakdowns, practical dialogue examples, pronunciation tips, interactive exercises (fill-in & word-order), and knowledge quizzes.
- **8 AI Assistant Modes**: Free Conversation, Kannada Tutor, Daily Practice, Role-Play Simulator, Translation Assistant, Interview Prep, Travel Companion, Grammar Coach.
- **Genuine Speech Input & Output**: Native Web Speech API (`kn-IN`) with interim transcripts, multimodal transcription fallback, and synthesized Kannada audio.
- **Speaking Practice Lab**: Real-time phonetic comparison, reference audio, learner audio recording, and alignment.
- **Camera-to-Kannada (Vision OCR)**: Multimodal sign/menu translation powered by Gemini Vision.
- **Culture Engine & Quests**: 10 deep Karnataka cultural guides and gamified Bengaluru city quests.

---

## 2. Realistic 3D Human AI Tutor

The 3D AI Tutor is rendered inside `src/components/RealisticHumanTutor3D.tsx` utilizing Three.js and PBR materials:
1. **Procedural Rigged Anatomy**:
   - Cranium, jawline, ears, nose, and sculpted hair.
   - Tailored midnight navy Nehru jacket with emerald silk piping and brass buttons.
   - Detailed eye assembly with sclera, radiating brown/hazel iris texture, and procedural eyelids.
2. **Animation Engine**:
   - **Idle Breathing**: Natural expansion and contraction of chest and shoulders.
   - **Organic Blinking**: Eyelids close and open naturally every 2.5–5 seconds (~160ms burst).
   - **Pointer Tracking**: Smooth exponential damping head tracking of user mouse movement.
   - **Lip-Sync Visemes**: Articulated jaw movement synchronized to audio playback state.
   - **Interactive States**:
     - `listening`: Attentive forward lean, illuminated emerald aura.
     - `thinking`: Thoughtful upward gaze, royal violet aura.
     - `speaking`: Expressive head nods with real-time lip movement.
     - `success`: Traditional Namaskara salutation gesture with palms joined at chest, golden celebration aura.
     - `error`: Sympathetic head tilt with soft red accent.
3. **Custom Model Extensibility**:
   - Supports external rigged GLB models. Simply place an `avatar.glb` file into the `/public` folder and `GLTFLoader` will mount it seamlessly while preserving animation state logic.

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Three.js (r174), Lucide React.
- **Backend**: Node.js, Express, TSX.
- **AI & Speech**:
  - `@google/genai` TypeScript SDK:
    - Text Conversation: `gemini-3.8-flash`
    - Text-to-Speech: `gemini-3.8-flash-lite-tts`
    - Vision Analysis: `gemini-3.8-flash`
    - Audio Transcription: `gemini-3.8-flash`
  - Browser Speech APIs: Web Speech API (`kn-IN` locale) & SpeechSynthesis.
- **Persistence**: Atomic local storage file engine (`data/storage.json`).

---

## 4. Quickstart & Windows Development Guide

### Environment Setup
Create a `.env` file in the project root:
```ini
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
```

### Installation & Launch (PowerShell / Bash)
```powershell
# 1. Install dependencies
npm install

# 2. Run typecheck & lint
npm run lint

# 3. Start full-stack development server
npm run dev
```

The application will start on **http://localhost:3000**.

### Production Build
```powershell
# Build client production bundle
npm run build

# Start production server
npm run start
```

---

## 5. API Endpoints

- `GET /health` — Service readiness & Gemini configuration check.
- `GET /api/config/public` — Safe public features, models, and locale config.
- `POST /api/chat` — Conversational AI with Kannada script, transliteration, and grammar notes.
- `POST /api/chat/summarize` — Conversation summary.
- `POST /api/speech/transcribe` — Multimodal audio transcription.
- `POST /api/speech/synthesize` — Cloud Kannada speech synthesis.
- `GET /api/lessons` — 45-module curriculum overview with objectives and metadata.
- `GET /api/lessons/:id` — Full lesson payload including dialogues, interactive exercises, and quizzes.
- `GET /api/progress` & `POST /api/progress/lesson` — Lesson progress & XP tracking.
- `GET /api/exercises/*` — Sentence builder, listening comprehension, and script character data.
- `GET /api/culture/articles` — Cultural articles and etiquette guides.
- `POST /api/vision/analyze` — Camera signboard translation.
- `POST /api/translate` — Two-way bidirectional translator.

---

## 6. Privacy & Security

- Microphone access is requested only during active voice interaction.
- Audio streams are processed in memory and never permanently stored.
- User data, XP, and lesson progress are stored locally and can be cleared at any time via Settings.
