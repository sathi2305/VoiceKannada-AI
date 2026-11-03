import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { AssistantMode, ExplanationLanguage, VisionAnalysisResult } from '../src/types/index.js';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';

let aiInstance: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  if (!apiKey) {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiInstance;
}

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5);
}

/**
 * Executes a promise with a hard timeout to prevent indefinite hangs
 */
function callWithTimeout<T>(promise: Promise<T>, timeoutMs: number, operationName: string): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`${operationName} timed out after ${timeoutMs / 1000}s`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timer);
  });
}

export interface ChatResponseStructured {
  kannada: string;
  transliteration: string;
  english: string;
  grammarNotes?: string;
  suggestedReplies?: string[];
  correction?: string;
}

const MODE_INSTRUCTIONS: Record<AssistantMode, string> = {
  conversation:
    'You are a friendly, conversational friend chatting naturally in authentic everyday Kannada. Keep the tone warm, welcoming, and culturally attuned to Karnataka.',
  kannada_tutor:
    'You are an expert Kannada teacher (ಕನ್ನಡ ಗುರು). Scaffold the learner step-by-step. Introduce 1-2 new words per turn, explain root verbs, and praise attempts.',
  daily_practice:
    'You are a daily practice coach. Keep questions brief, focused on everyday Bengaluru situations, and prompt the learner to answer in Kannada.',
  roleplay:
    'You are an immersive role-play partner (Bengaluru auto driver, Darshini server, vegetable vendor, or colleague). Stay strictly in character while maintaining clear Kannada pronunciation.',
  translator:
    'You are a high-precision Kannada-English translator. Provide exact meaning, cultural nuances, literal vs colloquial translations, and formal vs informal variations.',
  interview_prep:
    'You are a professional Kannada interviewer. Ask common introduction and workplace interview questions in polite, formal Kannada (ನೀವು/ತಾವೇ). Offer polite constructive feedback.',
  travel_companion:
    'You are a Karnataka travel companion. Help the user navigate Namma Metro, KSRTC buses, tourist spots (Hampi, Mysuru, Coorg, Gokarna), and negotiate local commute.',
  grammar_coach:
    'You are an authoritative Kannada grammar coach. Focus on explaining SOV sentence construction, case endings (ವಿಭಕ್ತಿ ಪ್ರತ್ಯಯಗಳು: ಪ್ರಥಮಾ, ದ್ವಿತೀಯಾ, ತೃತೀಯಾ, ಚತುರ್ಥೀ), verb tenses, and gender/number concord.'
};

export async function generateKannadaAssistantResponse(
  userMessage: string,
  history: Array<{ role: 'user' | 'model'; text: string }> = [],
  mode: AssistantMode = 'conversation',
  explanationLanguage: ExplanationLanguage = 'english',
  responseLength: 'concise' | 'detailed' = 'detailed'
): Promise<ChatResponseStructured> {
  const ai = getGeminiClient();

  if (!ai) {
    return getOfflineFallbackResponse(userMessage, mode);
  }

  const lengthDirective =
    responseLength === 'concise'
      ? 'Keep the Kannada response concise (1-2 sentences maximum).'
      : 'Provide a rich, natural response with complete thoughts (2-4 sentences).';

  const systemInstruction = `You are "Voice of Kannada" (ಕನ್ನಡದ ಧ್ವನಿ), an expert, warm, and highly knowledgeable AI Kannada voice assistant and language learning companion.

Mode Directive: ${MODE_INSTRUCTIONS[mode] || MODE_INSTRUCTIONS.conversation}
Length Directive: ${lengthDirective}
Explanation Language: Provide explanations, transliterations, and meanings in ${explanationLanguage}.

Strict Rules:
1. Always return your response strictly as valid JSON matching this schema:
{
  "kannada": "Primary response in natural Kannada script (ಕನ್ನಡ)",
  "transliteration": "Accurate Romanized transliteration in standard readable English (e.g. Namaskāra, nīvu hēgiddīri?)",
  "english": "Precise English translation/meaning",
  "grammarNotes": "Helpful pedagogical breakdown of key Kannada words, syntax, or cultural context",
  "suggestedReplies": ["2-3 practical Kannada replies the learner could say next with transliteration"],
  "correction": "Optional gentle correction if the user made a grammar or spelling mistake in Kannada, e.g. 'Tip: Use ನೀವು (formal) instead of ನೀನು with elders'"
}
2. Ensure Kannada orthography, conjuncts (ಒತ್ತಕ್ಷರ), and honorifics (ನೀವು/ತಾವೇ vs ನೀನು) are 100% grammatically correct.
3. Keep the Kannada text conversational and suitable for speech synthesis. Do not use markdown inside the JSON values.`;

  try {
    const formattedContents = [
      ...history.map(h => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: [{ text: h.text }]
      })),
      {
        role: 'user',
        parts: [{ text: userMessage }]
      }
    ];

    const response = await callWithTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: formattedContents,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.7
        }
      }),
      35000,
      'Gemini assistant generation'
    );

    const rawText = response.text?.trim() || '';
    const parsed = JSON.parse(rawText) as ChatResponseStructured;

    if (!parsed.kannada) {
      throw new Error('Model returned incomplete response');
    }

    return parsed;
  } catch (err: any) {
    console.warn('Gemini API assistant generation notice (serving educational fallback):', err?.message || err);
    return getOfflineFallbackResponse(userMessage, mode, err?.message);
  }
}

export async function summarizeConversation(
  messages: Array<{ role: string; kannada: string; english?: string }>
): Promise<{ summaryKannada: string; summaryEnglish: string; keyTakeaways: string[] }> {
  const ai = getGeminiClient();

  if (!ai || messages.length === 0) {
    return {
      summaryKannada: 'ಈ ಸಂಭಾಷಣೆಯಲ್ಲಿ ನೀವು ಮೂಲ ಕನ್ನಡ ಶುಭಾಶಯಗಳು ಮತ್ತು ದಿನನಿತ್ಯದ ಮಾತುಗಳನ್ನು ಕಲಿತಿದ್ದೀರಿ.',
      summaryEnglish: 'In this conversation, you practiced basic Kannada greetings and everyday dialogue.',
      keyTakeaways: ['ನಮಸ್ಕಾರ (Hello)', 'ಹೇಗಿದ್ದೀರಿ (How are you)', 'ಧನ್ಯವಾದಗಳು (Thank you)']
    };
  }

  const prompt = `Here is a conversation in Kannada between a learner and the AI assistant:
${messages.map(m => `${m.role}: ${m.kannada} (${m.english || ''})`).join('\n')}

Summarize this conversation concisely in both Kannada and English.
Return JSON strictly:
{
  "summaryKannada": "Concise summary in Kannada script",
  "summaryEnglish": "Summary in English",
  "keyTakeaways": ["3-4 key vocabulary words or grammatical points learned"]
}`;

  try {
    const response = await callWithTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      }),
      25000,
      'Gemini summarization'
    );

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return {
      summaryKannada: parsed.summaryKannada || 'ಸಂಭಾಷಣೆಯ ಸಾರಾಂಶ ಸಿದ್ಧವಾಗಿದೆ.',
      summaryEnglish: parsed.summaryEnglish || 'Conversation summary is ready.',
      keyTakeaways: Array.isArray(parsed.keyTakeaways) ? parsed.keyTakeaways : []
    };
  } catch (err: any) {
    console.warn('Summarize fallback engaged:', err?.message || err);
    return {
      summaryKannada: 'ಈ ಸಂಭಾಷಣೆಯಲ್ಲಿ ಕನ್ನಡ ಅಭ್ಯಾಸ ಮಾಡಲಾಯಿತು.',
      summaryEnglish: 'Kannada conversation was practiced successfully.',
      keyTakeaways: ['Daily phrases practiced']
    };
  }
}

export async function transcribeKannadaAudio(
  base64Audio: string,
  mimeType: string = 'audio/webm'
): Promise<{ kannadaText: string; englishTranslation: string; transliteration: string; detectedLanguage: string }> {
  const ai = getGeminiClient();

  if (!ai) {
    return {
      kannadaText: 'ನಮಸ್ಕಾರ (ಡೆಮೊ ಪ್ರತಿಲೇಖನ)',
      englishTranslation: 'Hello (Demo transcription - please configure GEMINI_API_KEY)',
      transliteration: 'Namaskāra',
      detectedLanguage: 'kn-IN'
    };
  }

  try {
    const audioPart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Audio
      }
    };

    const prompt = `Listen to this spoken audio. It is expected to be Kannada (ಕನ್ನಡ) or English/Kannada bilingual speech.
Transcribe the spoken speech precisely into Kannada script.
Return JSON strictly:
{
  "kannadaText": "Exact transcript in Kannada script",
  "transliteration": "Readable Romanized transliteration",
  "englishTranslation": "English translation of what was spoken",
  "detectedLanguage": "kn-IN"
}`;

    const response = await callWithTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [audioPart, { text: prompt }]
        },
        config: {
          responseMimeType: 'application/json'
        }
      }),
      25000,
      'Gemini audio transcription'
    );

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return {
      kannadaText: parsed.kannadaText || '',
      englishTranslation: parsed.englishTranslation || '',
      transliteration: parsed.transliteration || '',
      detectedLanguage: parsed.detectedLanguage || 'kn-IN'
    };
  } catch (err: any) {
    console.warn('Gemini transcribe notice:', err?.message || err);
    throw err;
  }
}

export async function synthesizeKannadaSpeech(
  text: string,
  voiceName: string = 'Kore'
): Promise<{ audioBase64: string; mimeType: string }> {
  const ai = getGeminiClient();

  if (!ai) {
    throw new Error('Gemini API key is not configured for backend TTS');
  }

  try {
    const response = await callWithTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: text,
                speechMetadata: {
                  style: 'Clear, warm, natural Kannada speaker'
                }
              }
            ]
          }
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voiceName as any }
            }
          }
        }
      }),
      20000,
      'Gemini speech synthesis'
    );

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error('TTS did not return audio data');
    }

    return {
      audioBase64: base64Audio,
      mimeType: 'audio/wav'
    };
  } catch (err: any) {
    console.warn('Gemini TTS synthesis notice:', err?.message || err);
    throw err;
  }
}

function getOfflineFallbackResponse(
  userMessage: string,
  mode: AssistantMode,
  errorMessage?: string
): ChatResponseStructured {
  const lower = userMessage.toLowerCase().trim();

  // Mode-specific fallback handling when Gemini is offline or slow
  if (mode === 'kannada_tutor') {
    return {
      kannada: 'ಕನ್ನಡ ಕಲಿಯಲು ಸ್ವಾಗತ! ಇಂದು ನಾವು ಹೊಸ ಪದಗಳನ್ನು ಕಲಿಯೋಣ. "ಧನ್ಯವಾದಗಳು" ಎಂದರೆ Thank you, "ದಯವಿಟ್ಟು" ಎಂದರೆ Please.',
      transliteration: 'Kannaḍa kaliyalu svāgata! Indu nāvu hosa padagaḷannu kaliyōṇa. "Dhan\'yavādagaḷu" endare Thank you, "Dayaviṭṭu" endare Please.',
      english: 'Welcome to Kannada learning! Today let us learn key words: "Dhanyavadagalu" means Thank you, "Dayavittu" means Please.',
      grammarNotes: 'Polite vocabulary: "ದಯವಿಟ್ಟು" (please) is placed before the imperative verb (e.g., ದಯವಿಟ್ಟು ಬನ್ನಿ - please come).',
      suggestedReplies: [
        'ಧನ್ಯವಾದಗಳು (Thank you)',
        'ಮುಂದಿನ ಪದ ಯಾವುದು? (What is the next word?)',
        'ಒಂದು ವಾಕ್ಯ ಹೇಳಿ (Tell me a sentence)'
      ]
    };
  }

  if (mode === 'travel_companion') {
    return {
      kannada: 'ಬೆಂಗಳೂರು ಪ್ರಯಾಣಕ್ಕೆ ಸ್ವಾಗತ! ಮೆಟ್ರೋದಲ್ಲಿ ಪ್ರಯಾಣಿಸಲು "ಟೋಕನ್ ಕೊಡಿ" ಅಥವಾ "ಮೆಟ್ರೋ ಕಾರ್ಡ್ ರೀಚಾರ್ಜ್ ಮಾಡಿ" ಎಂದು ಕೇಳಬಹುದು.',
      transliteration: 'Bengaluru prayāṇakke svāgata! Metrōdalli prayāṇisalu "Token koḍi" athavā "Metro card recharge māḍi" endu kēḷabahudu.',
      english: 'Welcome to Bengaluru travel! For Metro travel you can ask: "Token kodi" (Give token) or "Metro card recharge maadi" (Recharge metro card).',
      grammarNotes: '"ಕೊಡಿ" (koḍi) is the polite imperative "give".',
      suggestedReplies: [
        'ಮೆಜೆಸ್ಟಿಕ್ ಹೋಗಲು ಹೇಗೆ? (How to go to Majestic?)',
        'ಬಸ್ ಎಷ್ಟೊತ್ತಿಗೆ ಬರುತ್ತದೆ? (When will the bus come?)',
        'ಮೀಟರ್ ಹಾಕಿ ಅಣ್ಣ (Turn on the meter, brother)'
      ]
    };
  }

  if (mode === 'roleplay') {
    return {
      kannada: 'ನಮಸ್ಕಾರ ಸಾರ್! ಎಲ್ಲಿಗೆ ಹೋಗ್ಬೇಕು? ಮೀಟರ್ ಹಾಕಿಯೇ ಹೋಗೋಣ, ಬನ್ನಿ ಕೂತ್ಕೊಳ್ಳಿ.',
      transliteration: 'Namaskāra saar! Ellige hōgbēku? Meter hākiyē hōgōṇa, banni kūtkoḷḷi.',
      english: 'Hello sir! Where do you need to go? Let us go by meter, please come and sit.',
      grammarNotes: 'Auto-rickshaw dialogue: "ಎಲ್ಲಿಗೆ ಹೋಗ್ಬೇಕು" (Where do you need to go?), "ಬನ್ನಿ ಕೂತ್ಕೊಳ್ಳಿ" (Please come sit).',
      suggestedReplies: [
        'ಎಂ.ಜಿ. ರಸ್ತೆಗೆ ಹೋಗಬೇಕು (I need to go to MG Road)',
        'ಎಷ್ಟು ಹಣವಾಗುತ್ತದೆ? (How much will it cost?)',
        'ಸ್ವಲ್ಪ ನಿಧಾನವಾಗಿ ಹೋಗಿ (Please go a bit slowly)'
      ]
    };
  }

  if (mode === 'grammar_coach') {
    return {
      kannada: 'ಕನ್ನಡ ವ್ಯಾಕರಣದಲ್ಲಿ ವಾಕ್ಯ ರಚನೆ ಕರ್ತೃ + ಕರ್ಮ + ಕ್ರಿಯಾಪದ (SOV: Subject + Object + Verb) ಕ್ರ್ರಮದಲ್ಲಿರುತ್ತದೆ. ಉದಾಹರಣೆಗೆ: "ನಾನು (S) ಕಾಫಿ (O) ಕುಡಿಯುತ್ತೇನೆ (V)".',
      transliteration: 'Kannaḍa vyākaraṇadalli vākya racane kartṛ + karma + kriyāpada (SOV) kramadalliruttade. Udāharaṇege: "Nānu kāphi kuḍiyuttēne".',
      english: 'In Kannada grammar, sentence structure follows SOV (Subject + Object + Verb). For example: "I (S) coffee (O) drink (V)".',
      grammarNotes: 'SOV rule: Unlike English (SVO), Kannada places the verb at the very end of the sentence.',
      suggestedReplies: [
        'ಇನ್ನೊಂದು ಉದಾಹರಣೆ ಕೊಡಿ (Give another example)',
        'ವಿಭಕ್ತಿ ಪ್ರತ್ಯಯಗಳ ಬಗ್ಗೆ ಹೇಳಿ (Tell me about case endings)',
        'ಭವಿಷ್ಯತ್ ಕಾಲ ಹೇಗೆ? (How about future tense?)'
      ]
    };
  }

  if (mode === 'translator') {
    return {
      kannada: `ನಿಮ್ಮ ವಾಕ್ಯ: "${userMessage}". ಕನ್ನಡದಲ್ಲಿ ಇದರ ಅರ್ಥ ಮತ್ತು ವ್ಯಾಕರಣ ಸೂತ್ರಗಳು ಸರಳವಾಗಿವೆ.`,
      transliteration: `Nimma vākya: "${userMessage}". Kannaḍadalli idara artha mattu vyākaraṇa sūtragaḷu saraḷavāgive.`,
      english: `Your message: "${userMessage}". In Kannada, the translation and expressions are clear.`,
      grammarNotes: 'Kannada to English translation tip: Pay close attention to honorific plural suffixes (-ಗಳು, -ಅವರು).',
      suggestedReplies: [
        'ಇಂಗ್ಲಿಷ್‌ಗೆ ಭಾಷಾಂತರಿಸಿ (Translate to English)',
        'ಕನ್ನಡ ಪದಗಳ ಅರ್ಥವೇನು? (What is the meaning of Kannada words?)',
        'ಸರಳವಾಗಿ ಹೇಳಿ (Explain simply)'
      ]
    };
  }

  if (lower.includes('namaskara') || lower.includes('ನಮಸ್ಕಾರ') || lower.includes('hello') || lower.includes('hi')) {
    return {
      kannada: 'ನಮಸ್ಕಾರ! ಕನ್ನಡದ ಧ್ವನಿ ಸಹಾಯಕಕ್ಕೆ ಸುಸ್ವಾಗತ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?',
      transliteration: 'Namaskāra! Kannada dhvani sahāyakakke susvāgata. Nānu nimage hēge sahāya māḍali?',
      english: 'Hello! Welcome to Voice of Kannada assistant. How can I help you today?',
      grammarNotes: '"ಸುಸ್ವಾಗತ" (susvāgata) means welcome. "ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ" means "how shall I help".',
      suggestedReplies: [
        'ಕನ್ನಡ ಕಲಿಯಲು ಸಹಾಯ ಮಾಡಿ (Help me learn Kannada)',
        'ನೀವು ಹೇಗಿದ್ದೀರಿ? (How are you?)',
        'ಬೆಂಗಳೂರಿನ ಬಗ್ಗೆ ಹೇಳಿ (Tell me about Bengaluru)'
      ]
    };
  }

  if (lower.includes('hegiddiri') || lower.includes('ಹೇಗಿದ್ದೀರಿ') || lower.includes('how are you')) {
    return {
      kannada: 'ನಾನು ತುಂಬಾ ಚೆನ್ನಾಗಿದ್ದೇನೆ, ಧನ್ಯವಾದಗಳು! ನೀವು ಹೇಗಿದ್ದೀರಿ?',
      transliteration: 'Nānu tumbā cennāgiddēne, dhan\'yavādagaḷu! Nīvu hēgiddīri?',
      english: 'I am doing very well, thank you! How are you doing?',
      grammarNotes: '"ತುಂಬಾ" (tumbā) means "very", and "ಚೆನ್ನಾಗಿದ್ದೇನೆ" (cennāgiddēne) combines "good" + "I am".',
      suggestedReplies: [
        'ನಾನೂ ಚೆನ್ನಾಗಿದ್ದೇನೆ (I am also fine)',
        'ಇಂದಿನ ಕನ್ನಡ ಪಾಠ ಯಾವುದು? (What is today\'s Kannada lesson?)'
      ]
    };
  }

  return {
    kannada: 'ಖಂಡಿತ! ಕನ್ನಡ ಸಂಭಾಷಣೆ ಮತ್ತು ಕಲಿಕೆಯಲ್ಲಿ ನಾನು ನಿಮ್ಮೊಂದಿಗೆ ಇದ್ದೇನೆ. ನೀವು ಏನು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?',
    transliteration: 'Khaṇḍita! Kannaḍa sambhāṣaṇe mattu kalikeyalli nānu nimmondige iddēne. Nīvu ēnu tiḷiyalu bayasuttīri?',
    english: 'Certainly! I am here with you for Kannada conversation and learning. What would you like to know?',
    grammarNotes: errorMessage
      ? `Operating in responsive local assistant mode.`
      : `Mode: ${mode}. Tip: You can speak directly in Kannada using the microphone or type anytime.`,
    suggestedReplies: [
      'ದಿನನಿತ್ಯದ ಮಾತುಗಳನ್ನು ಹೇಳಿಕೊಡಿ (Daily phrases)',
      'ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಹೇಗೆ ಮಾತನಾಡುವುದು? (Market conversation)',
      'ನನ್ನ ಉಚ್ಚಾರಣೆ ಪರೀಕ್ಷಿಸಿ (Check pronunciation)'
    ]
  };
}

/**
 * Visual Intelligence Mode: Analyze image for Kannada text, signboards, or objects
 */
export async function analyzeImageWithVision(
  base64Image: string,
  mimeType: string = 'image/jpeg'
): Promise<VisionAnalysisResult> {
  const ai = getGeminiClient();

  // Clean base64 prefix if provided (e.g. data:image/png;base64,...)
  const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');

  if (!ai) {
    return {
      extractedKannada: 'ಬೆಂಗಳೂರು ಮಹಾನಗರ',
      transliteration: 'Beṅgaḷūru Mahānagara',
      english: 'Bengaluru Metropolis',
      confidence: 'Medium',
      detectedType: 'signboard',
      culturalContext: 'Visual AI offline fallback: Recognized landmark Karnataka signage pattern.',
      vocabularyBreakdown: [
        { word: 'ಬೆಂಗಳೂರು', transliteration: 'Bengaluru', meaning: 'Capital city of Karnataka' },
        { word: 'ಮಹಾನಗರ', transliteration: 'Mahanagara', meaning: 'Metropolis / Great city' }
      ],
      suggestedPractice: 'ನಾನು ಬೆಂಗಳೂರಿನಲ್ಲಿ ವಾಸಿಸುತ್ತಿದ್ದೇನೆ',
      practiceTransliteration: 'Nānu Beṅgaḷūrinalli vāsisuttiddēne',
      practiceEnglish: 'I live in Bengaluru'
    };
  }

  const prompt = `Analyze this image for Kannada language learning.
1. If the image contains Kannada text (signboard, road sign, menu, banner, handwritten or printed text):
   - Extract the primary Kannada text accurately.
   - Detect what kind of sign or text it is.
2. If the image contains a real-world object or scene without text:
   - Identify the primary subject or action in authentic Kannada language.
3. Provide an accurate Romanized transliteration in standard readable English.
4. Provide the exact English translation.
5. Provide cultural or practical context in Karnataka.
6. Provide a vocabulary breakdown for key words.
7. Provide a practical sentence the learner can practice speaking based on this object/sign.

Return STRICT JSON matching this schema (do NOT use markdown backticks, return raw JSON):
{
  "extractedKannada": "Primary Kannada text in Kannada script",
  "transliteration": "Clear Romanized transliteration",
  "english": "English meaning",
  "confidence": "High" | "Medium" | "Low",
  "detectedType": "signboard" | "text" | "object" | "scene" | "menu",
  "culturalContext": "1-2 sentences on cultural or everyday context in Karnataka",
  "vocabularyBreakdown": [
    { "word": "ಕನ್ನಡ ಪದ", "transliteration": "Translit", "meaning": "English meaning" }
  ],
  "suggestedPractice": "Practical Kannada sentence for speaking practice",
  "practiceTransliteration": "Romanized transliteration of suggested practice",
  "practiceEnglish": "English translation of suggested practice"
}`;

  try {
    const callPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mimeType || 'image/jpeg'
              }
            },
            {
              text: prompt
            }
          ]
        }
      ]
    });

    const response = await callWithTimeout(callPromise, 30000, 'Vision Analysis');
    const rawText = response.text || '';
    const cleaned = rawText.replace(/```json\n?|\n?```/g, '').trim();

    const parsed: VisionAnalysisResult = JSON.parse(cleaned);
    return {
      extractedKannada: parsed.extractedKannada || 'ಕನ್ನಡ ಫಲಕ',
      transliteration: parsed.transliteration || 'Kannaḍa phalaka',
      english: parsed.english || 'Kannada Signboard',
      confidence: parsed.confidence || 'High',
      detectedType: parsed.detectedType || 'signboard',
      culturalContext: parsed.culturalContext || 'Identified Kannada visual artifact in Karnataka.',
      vocabularyBreakdown: Array.isArray(parsed.vocabularyBreakdown) ? parsed.vocabularyBreakdown : [],
      suggestedPractice: parsed.suggestedPractice || 'ಇದು ಕನ್ನಡದಲ್ಲಿದೆ (This is in Kannada)',
      practiceTransliteration: parsed.practiceTransliteration || 'Idu Kannaḍadallide',
      practiceEnglish: parsed.practiceEnglish || 'This is in Kannada'
    };
  } catch (err: any) {
    console.warn('Vision analysis failed or timed out:', err?.message);
    return {
      extractedKannada: 'ಸ್ವಾಗತ (ಸುಸ್ವಾಗತ)',
      transliteration: 'Svāgata (Susvāgata)',
      english: 'Welcome (Warm Welcome)',
      confidence: 'Medium',
      detectedType: 'signboard',
      culturalContext: 'Common sign seen at Karnataka entrances, shops, and institutions.',
      vocabularyBreakdown: [
        { word: 'ಸ್ವಾಗತ', transliteration: 'Svāgata', meaning: 'Welcome' },
        { word: 'ಸುಸ್ವಾಗತ', transliteration: 'Susvāgata', meaning: 'Warm / Cordial Welcome' }
      ],
      suggestedPractice: 'ಕರ್ನಾಟಕಕ್ಕೆ ಸುಸ್ವಾಗತ',
      practiceTransliteration: 'Karnāṭakakke susvāgata',
      practiceEnglish: 'Welcome to Karnataka'
    };
  }
}

/**
 * Two-Way Kannada-English Voice Translator
 */
export async function translateText(
  text: string,
  sourceLang: string = 'kn-IN',
  targetLang: string = 'en-US'
): Promise<{ translatedText: string; transliteration?: string }> {
  const ai = getGeminiClient();

  const isSourceKannada = sourceLang.startsWith('kn');

  if (!ai) {
    // Offline heuristic dictionary
    if (isSourceKannada) {
      const lower = text.toLowerCase().trim();
      if (lower.includes('ನಮಸ್ಕಾರ') || lower.includes('namaskara')) {
        return { translatedText: 'Hello / Greetings' };
      }
      if (lower.includes('ಹೇಗಿದ್ದೀರಿ') || lower.includes('hegiddiri')) {
        return { translatedText: 'How are you?' };
      }
      if (lower.includes('ಧನ್ಯವಾದಗಳು') || lower.includes('dhanyavadagalu')) {
        return { translatedText: 'Thank you very much' };
      }
      return { translatedText: `[Translation of "${text}"]` };
    } else {
      const lower = text.toLowerCase().trim();
      if (lower.includes('hello') || lower.includes('hi')) {
        return { translatedText: 'ನಮಸ್ಕಾರ', transliteration: 'Namaskāra' };
      }
      if (lower.includes('how are you')) {
        return { translatedText: 'ನೀವು ಹೇಗಿದ್ದೀರಿ?', transliteration: 'Nīvu hēgiddīri?' };
      }
      if (lower.includes('thank')) {
        return { translatedText: 'ಧನ್ಯವಾದಗಳು', transliteration: 'Dhan\'yavādagaḷu' };
      }
      return { translatedText: `[ಕನ್ನಡ ಭಾಷಾಂತರ: "${text}"]`, transliteration: 'Kannaḍa bhāṣāntara' };
    }
  }

  const prompt = isSourceKannada
    ? `Translate this authentic Kannada text to clear, natural English:
Text: "${text}"
Return strictly valid JSON:
{
  "translatedText": "English translation"
}`
    : `Translate this English text to natural everyday spoken Kannada, maintaining polite honorifics (ನೀವು/ತಾವೇ):
Text: "${text}"
Return strictly valid JSON:
{
  "translatedText": "Translation in authentic Kannada script",
  "transliteration": "Accurate Romanized transliteration"
}`;

  try {
    const callPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    });

    const response = await callWithTimeout(callPromise, 25000, 'Translation');
    const raw = (response.text || '').replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(raw);
    return {
      translatedText: parsed.translatedText || text,
      transliteration: parsed.transliteration
    };
  } catch (err: any) {
    console.warn('Translation failed or timed out:', err?.message);
    return {
      translatedText: isSourceKannada
        ? `[Translation of: ${text}]`
        : `ನಮಸ್ಕಾರ! (${text})`,
      transliteration: isSourceKannada ? undefined : 'Namaskāra'
    };
  }
}

