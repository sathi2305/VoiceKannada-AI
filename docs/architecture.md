# Voice of Kannada — System Architecture

## 1. High-Level Architecture

The system is structured as a full-stack, decoupled web application:

```
[ User Microphone / Speaker ]
              │
              ▼
    [ React 19 Frontend (SPA) ]
    ├── Web Speech API (kn-IN STT)
    ├── SpeechSynthesis API (kn-IN TTS)
    ├── Canvas / CSS Audio Visualizer
    ├── Grounded Token Comparator
    └── Views & Dashboards
              │
              ▼ (HTTP REST / JSON)
    [ Express Full-Stack Server (server.ts) ]
    ├── Security & Middleware (CORS, JSON 30MB limit)
    ├── /health & /api/config/public
    ├── /api/chat (Bilingual Kannada Assistant)
    ├── /api/speech/transcribe (Audio Multimodal)
    ├── /api/speech/synthesize (TTS)
    ├── /api/lessons & /api/progress
    └── /api/saved-phrases & /api/conversations
              │
         ┌────┴───────────────────────────┐
         ▼                               ▼
 [ Google GenAI SDK ]           [ Atomic Storage Engine ]
  - Gemini 3.8 Flash             - data/storage.json
  - Gemini 3.8 Flash-Lite TTS    - Progress & History
```

## 2. Component Design

### Frontend Architecture
- **Framework**: React 19 + TypeScript on Vite 8.
- **Styling**: Tailwind CSS v4 with custom typography layer supporting Noto Sans Kannada and high-contrast navy/midnight palettes.
- **Audio Subsystem**:
  - `SpeechService`: Abstracts Web Speech API (`SpeechRecognition` with `kn-IN`), `MediaRecorder` for audio chunk capture, and `speechSynthesis` with voice detection.
  - `AudioVisualizer`: Live waveform reacting to listening, speaking, processing, and idle states.
  - `MicButton`: Responsive multi-state button with animated ping/pulse rings for push-to-talk and continuous interaction.

### Backend Architecture
- **Runtime**: Node.js + Express with TSX execution.
- **Gemini Integration**: `@google/genai` TypeScript SDK:
  - Text model: `gemini-3.8-flash` with JSON response mode and strict system instructions for authentic Kannada grammar, transliteration, and English meanings.
  - Speech synthesis model: `gemini-3.8-flash-lite-tts` for cloud audio synthesis.
  - Audio transcription: `gemini-3.8-flash` / `gemini-3.5-transcribe` multimodal audio part decoder.
- **Persistence Engine**: Atomic JSON file store with temporary file swapping (`data/storage.json.tmp` -> `data/storage.json`) preventing write corruption.

## 3. Grounded Evaluation Engine (`src/utils/textComparison.ts`)
- **No Fabricated Scores**: Uses a transparent mathematical formula based on normalized word intersection ($W$) and Levenshtein character distance ($D$):
  $$\text{Match Ratio} = 0.6 \times \frac{|\text{Matched Words}|}{|\text{Target Words}|} + 0.4 \times \left(1 - \frac{D}{\max(|T|, |R|)}\right)$$
- Displays individual token match status: `[✓]` for accurately spoken words and `[✗]` for missing/mispronounced tokens.
