import { api } from './api';

// Declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export interface SpeechRecognitionHandlers {
  onStart?: () => void;
  onInterimResult?: (interimText: string) => void;
  onFinalResult?: (finalText: string) => void;
  onError?: (errorMessage: string, errorCode?: string) => void;
  onEnd?: () => void;
}

export class SpeechService {
  private recognition: any = null;
  private isListening: boolean = false;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private mediaStream: MediaStream | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  public isWebSpeechSupported(): boolean {
    return typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  public isSpeechSynthesisSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  /**
   * Discovers available Kannada voices in the browser
   */
  public getKannadaVoice(): SpeechSynthesisVoice | null {
    if (!this.isSpeechSynthesisSupported()) return null;
    const voices = window.speechSynthesis.getVoices();
    // 1. Exact match for kn-IN
    let voice = voices.find(v => v.lang.toLowerCase() === 'kn-in' || v.lang.toLowerCase().startsWith('kn'));
    if (voice) return voice;
    // 2. Name contains Kannada
    voice = voices.find(v => v.name.toLowerCase().includes('kannada'));
    if (voice) return voice;
    // 3. Indian English / Hindi voice fallback if Kannada specific is absent on client OS
    voice = voices.find(v => v.lang.toLowerCase() === 'en-in' || v.lang.toLowerCase() === 'hi-in');
    return voice || null;
  }

  /**
   * Play simple Web Audio chime when microphone turns on/off
   */
  public playChime(type: 'start' | 'stop' | 'success') {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'start') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'stop') {
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.exponentialRampToValueAtTime(330, now + 0.15);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else {
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch {
      // AudioContext might be blocked or inactive
    }
  }

  /**
   * Starts listening to Kannada speech using browser Web Speech API
   */
  public startWebSpeech(
    continuous: boolean,
    handlers: SpeechRecognitionHandlers
  ): boolean {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      handlers.onError?.('Web Speech API is not supported in this browser. You can record audio using backend mode or type messages.', 'UNSUPPORTED');
      return false;
    }

    try {
      if (this.recognition) {
        this.recognition.abort();
      }

      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'kn-IN'; // Kannada - India
      this.recognition.continuous = continuous;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      let finalAccumulated = '';

      this.recognition.onstart = () => {
        this.isListening = true;
        this.playChime('start');
        handlers.onStart?.();
      };

      this.recognition.onresult = (event: any) => {
        let interimText = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalAccumulated += item[0].transcript;
          } else {
            interimText += item[0].transcript;
          }
        }

        if (interimText) {
          handlers.onInterimResult?.(interimText);
        }
        if (finalAccumulated) {
          handlers.onFinalResult?.(finalAccumulated.trim());
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition event error:', event.error);
        let userMessage = 'Speech recognition error occurred.';
        if (event.error === 'not-allowed') {
          userMessage = 'Microphone permission denied. Please allow microphone access in your browser settings to speak in Kannada.';
        } else if (event.error === 'no-speech') {
          userMessage = 'No speech detected. Please speak closer to your microphone.';
        } else if (event.error === 'network') {
          userMessage = 'Network error during speech recognition. Please check your internet connection.';
        }
        handlers.onError?.(userMessage, event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.playChime('stop');
        handlers.onEnd?.();
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      handlers.onError?.(err?.message || 'Failed to initialize speech recognition', 'INIT_FAILED');
      return false;
    }
  }

  public stopWebSpeech() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // ignore if already stopped
      }
      this.isListening = false;
    }
  }

  public stopListening() {
    this.stopWebSpeech();
  }

  public startListening(
    lang: string = 'kn-IN',
    onResult?: (text: string, isFinal: boolean) => void,
    onError?: (err: string) => void
  ): boolean {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onError?.('Web Speech API is not supported in this browser.');
      return false;
    }

    try {
      if (this.recognition) {
        this.recognition.abort();
      }
      this.recognition = new SpeechRecognition();
      this.recognition.lang = lang;
      this.recognition.continuous = false;
      this.recognition.interimResults = true;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.playChime('start');
      };

      this.recognition.onresult = (event: any) => {
        let finalAccumulated = '';
        let interimText = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalAccumulated += item[0].transcript;
          } else {
            interimText += item[0].transcript;
          }
        }
        if (finalAccumulated) {
          onResult?.(finalAccumulated.trim(), true);
        } else if (interimText) {
          onResult?.(interimText, false);
        }
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        onError?.(event?.error || 'Speech error');
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.playChime('stop');
      };

      this.recognition.start();
      return true;
    } catch (e: any) {
      onError?.(e?.message || 'Failed to start speech');
      return false;
    }
  }

  /**
   * Starts microphone audio recording via MediaRecorder (for backend transcription)
   */
  public async startMediaRecorder(
    onStarted?: () => void,
    onError?: (err: string) => void
  ): Promise<boolean> {
    try {
      this.audioChunks = [];
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.mediaStream);

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.audioChunks.push(e.data);
        }
      };

      this.mediaRecorder.onstart = () => {
        this.playChime('start');
        onStarted?.();
      };

      this.mediaRecorder.start();
      return true;
    } catch (err: any) {
      console.error('MediaRecorder start failed:', err);
      onError?.(err?.name === 'NotAllowedError' ? 'Microphone permission denied' : 'Could not access microphone');
      return false;
    }
  }

  /**
   * Stops recording and transcribes via backend API
   */
  public async stopMediaRecorderAndTranscribe(): Promise<{
    kannadaText: string;
    englishTranslation: string;
    transliteration: string;
  }> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        return reject(new Error('Recorder not initialized'));
      }

      this.mediaRecorder.onstop = async () => {
        this.playChime('stop');
        try {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          // Stop mic tracks
          if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            this.mediaStream = null;
          }

          // Convert blob to base64
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64data = (reader.result as string).split(',')[1];
            try {
              const res = await api.transcribeAudio(base64data, 'audio/webm');
              resolve(res);
            } catch (err) {
              reject(err);
            }
          };
        } catch (err) {
          reject(err);
        }
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * Speaks Kannada text using browser SpeechSynthesis or fallback to backend TTS
   */
  public async speakKannada(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      preferBackend?: boolean;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: string) => void;
    } = {}
  ): Promise<void> {
    this.stopSpeaking();

    // If preferBackend or SpeechSynthesis is unavailable
    if (options.preferBackend || !this.isSpeechSynthesisSupported()) {
      try {
        options.onStart?.();
        const res = await api.synthesizeSpeech(text);
        if (res.audioBase64) {
          const audio = new Audio(`data:${res.mimeType || 'audio/wav'};base64,${res.audioBase64}`);
          this.currentAudioElement = audio;
          audio.onended = () => {
            this.currentAudioElement = null;
            options.onEnd?.();
          };
          audio.onerror = () => {
            this.currentAudioElement = null;
            options.onError?.('Audio playback failed');
          };
          await audio.play();
          return;
        }
      } catch (err: any) {
        console.warn('Backend TTS failed, trying browser synthesis fallback:', err);
      }
    }

    if (!this.isSpeechSynthesisSupported()) {
      options.onError?.('Text-to-speech is not supported on this browser.');
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'kn-IN';
      utterance.rate = options.rate || 0.95;
      utterance.pitch = options.pitch || 1.0;

      const voice = this.getKannadaVoice();
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        options.onStart?.();
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        options.onEnd?.();
      };

      utterance.onerror = (e) => {
        this.currentUtterance = null;
        options.onError?.(`Speech synthesis error: ${e.error}`);
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err: any) {
      options.onError?.(err?.message || 'Failed to speak text');
    }
  }

  public stopSpeaking() {
    if (this.isSpeechSynthesisSupported()) {
      window.speechSynthesis.cancel();
    }
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }
    this.currentUtterance = null;
  }
}

export const speechService = new SpeechService();
