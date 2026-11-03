# Voice of Kannada — API Reference

All backend endpoints are hosted on port 3000 under `/` and `/api/*`.

---

### 1. `GET /health`
Returns backend health, uptime, and availability of AI credentials.

**Response (200 OK):**
```json
{
  "status": "ok",
  "uptime": 142.5,
  "timestamp": "2026-10-24T10:15:30.000Z",
  "geminiConfigured": true,
  "features": {
    "aiAssistant": true,
    "speechRecognition": true,
    "speechSynthesis": true,
    "learningStudio": true,
    "speakingPractice": true,
    "persistentStorage": true
  }
}
```

---

### 2. `GET /api/config/public`
Returns safe public configurations without disclosing secrets.

**Response (200 OK):**
```json
{
  "appName": "Voice of Kannada",
  "version": "1.0.0",
  "geminiConfigured": true,
  "defaultAiModel": "gemini-3.8-flash",
  "ttsModel": "gemini-3.8-flash-lite-tts",
  "locale": "kn-IN",
  "speechRecognitionOptions": ["browser_web_speech", "gemini_multimodal_audio"],
  "speechSynthesisOptions": ["browser_speech_synthesis", "gemini_tts"],
  "sampleRate": 24000
}
```

---

### 3. `POST /api/chat`
Conversational endpoint using Gemini 3.8 Flash.

**Request:**
```json
{
  "message": "ನಮಸ್ಕಾರ, ನೀವು ಹೇಗಿದ್ದೀರಿ?",
  "history": [],
  "mode": "conversation"
}
```

**Response (200 OK):**
```json
{
  "kannada": "ನಮಸ್ಕಾರ! ನಾನು ತುಂಬಾ ಚೆನ್ನಾಗಿದ್ದೇನೆ, ಧನ್ಯವಾದಗಳು. ನೀವು ಹೇಗಿದ್ದೀರಿ?",
  "transliteration": "Namaskāra! Nānu tumbā cennāgiddēne, dhan'yavādagaḷu. Nīvu hēgiddīri?",
  "english": "Hello! I am doing very well, thank you. How are you doing?",
  "grammarNotes": "\"ತುಂಬಾ\" means \"very\", \"ಚೆನ್ನಾಗಿದ್ದೇನೆ\" means \"I am doing fine\".",
  "suggestedReplies": [
    "ನಾನೂ ಚೆನ್ನಾಗಿದ್ದೇನೆ",
    "ಕನ್ನಡ ಕಲಿಯಲು ಸಹಾಯ ಮಾಡಿ"
  ]
}
```

---

### 4. `POST /api/speech/transcribe`
Transcribes base64-encoded audio.

**Request:**
```json
{
  "audioBase64": "<base64_string>",
  "mimeType": "audio/webm"
}
```

**Response (200 OK):**
```json
{
  "kannadaText": "ನಮಸ್ಕಾರ",
  "transliteration": "Namaskāra",
  "englishTranslation": "Hello / Greetings",
  "detectedLanguage": "kn-IN"
}
```

---

### 5. `POST /api/speech/synthesize`
Generates Kannada audio via Gemini 3.8 TTS.

**Request:**
```json
{
  "text": "ನಮಸ್ಕಾರ, Voice of Kannada ಗೆ ಸುಸ್ವಾಗತ",
  "voiceName": "Kore"
}
```

**Response (200 OK):**
```json
{
  "audioBase64": "<base64_wav_data>",
  "mimeType": "audio/wav"
}
```

---

### 6. `GET /api/lessons` & `GET /api/lessons/:id`
Returns Kannada structured curriculum and lesson details.

---

### 7. `GET /api/progress` & `POST /api/progress/practice`
Retrieves and records learner activities, streak days, and verified token comparisons.

---

### 8. `GET /api/saved-phrases` & `POST /api/saved-phrases`
Manages bookmarked vocabulary notebook entries.
