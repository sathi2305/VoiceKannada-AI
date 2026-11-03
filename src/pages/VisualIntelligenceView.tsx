import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  RefreshCw,
  Volume2,
  BookmarkPlus,
  Mic,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Info,
  Layers,
  Check,
  Eye,
  FileImage,
  ArrowRight
} from 'lucide-react';
import { VisionAnalysisResult } from '../types';
import { api } from '../services/api';

interface VisualIntelligenceViewProps {
  onSpeak: (text: string) => void;
  onSavePhrase: (phrase: {
    kannada: string;
    transliteration: string;
    english: string;
    category: string;
  }) => void;
  onLaunchPractice: (target: {
    kannada: string;
    transliteration: string;
    english: string;
  }) => void;
  savedPhraseKeys?: Set<string>;
}

const SAMPLE_IMAGES = [
  {
    id: 'metro-sign',
    title: 'Metro Signboard',
    titleKannada: 'ಮೆಟ್ರೋ ನಾಮಫಲಕ',
    category: 'Signboard',
    previewColor: 'from-emerald-900 to-teal-950',
    description: 'Namma Metro entrance & platform signboard',
    // 1x1 green transparent placeholder or data URI
    textSim: 'ನಮ್ಮ ಮೆಟ್ರೋ - ನಿಲ್ದಾಣ ಪ್ರವೇಶ'
  },
  {
    id: 'darshini-menu',
    title: 'Darshini Hotel Menu',
    titleKannada: 'ತಿಂಡಿ ಪಟ್ಟಿ',
    category: 'Menu',
    previewColor: 'from-amber-950 to-orange-950',
    description: 'Traditional Bengaluru breakfast menu board',
    textSim: 'ಬಿಸಿ ಬಿಸಿ ಮಸಾಲೆ ದೋಸೆ ಮತ್ತು ಫಿಲ್ಟರ್ ಕಾಫಿ'
  },
  {
    id: 'heritage-arch',
    title: 'Heritage Archway',
    titleKannada: 'ಪಾರಂಪರಿಕ ಕಮಾನು',
    category: 'Heritage',
    previewColor: 'from-indigo-950 to-slate-900',
    description: 'Mysuru Palace golden gate welcoming banner',
    textSim: 'ಮೈಸೂರು ಅರಮನೆಗೆ ಸುಸ್ವಾಗತ'
  }
];

export const VisualIntelligenceView: React.FC<VisualIntelligenceViewProps> = ({
  onSpeak,
  onSavePhrase,
  onLaunchPractice,
  savedPhraseKeys = new Set()
}) => {
  const [mode, setMode] = useState<'camera' | 'upload'>('upload');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<VisionAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize camera when camera mode is selected
  useEffect(() => {
    if (mode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [mode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera is not supported on this browser or platform.');
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError(err.message || 'Camera permission denied or camera device unavailable.');
      setMode('upload');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setSelectedImage(dataUrl);
    setMimeType('image/jpeg');
    stopCamera();
    analyzeImageData(dataUrl, 'image/jpeg');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setSelectedImage(result);
      setMimeType(file.type || 'image/jpeg');
      analyzeImageData(result, file.type || 'image/jpeg');
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: typeof SAMPLE_IMAGES[0]) => {
    // Generate a clean sample SVG canvas for testing
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Gradient background
      const grad = ctx.createLinearGradient(0, 0, 600, 360);
      grad.addColorStop(0, '#064e3b');
      grad.addColorStop(1, '#022c22');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 600, 360);

      // Yellow header banner
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(20, 20, 560, 50);
      ctx.font = 'bold 22px sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';
      ctx.fillText(sample.category.toUpperCase() + ' • KANNADA SIGN', 300, 52);

      // Main Kannada Text
      ctx.font = 'bold 36px "Noto Sans Kannada", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(sample.textSim, 300, 180);

      // Subtitle
      ctx.font = '20px sans-serif';
      ctx.fillStyle = '#34d399';
      ctx.fillText(sample.description, 300, 240);

      // Decorative border
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 4;
      ctx.strokeRect(10, 10, 580, 340);
    }
    const dataUrl = canvas.toDataURL('image/jpeg');
    setSelectedImage(dataUrl);
    setMimeType('image/jpeg');
    analyzeImageData(dataUrl, 'image/jpeg');
  };

  const analyzeImageData = async (base64String: string, mime: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setSavedSuccess(false);

    try {
      const result = await api.analyzeImage(base64String, mime);
      setAnalysis(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to analyze image. Please try again or test with another photo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToNotebook = () => {
    if (!analysis) return;
    onSavePhrase({
      kannada: analysis.extractedKannada,
      transliteration: analysis.transliteration,
      english: analysis.english,
      category: 'visual_sign'
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const isAlreadySaved = analysis
    ? savedPhraseKeys.has(analysis.extractedKannada.trim())
    : false;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium mb-2">
              <Eye className="w-3.5 h-3.5" />
              <span>Multimodal Visual Intelligence • ದೃಷ್ಟಿ ಜ್ಞಾನ</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              Kannada Signboard & Object Reader
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Point your camera or upload a photo of any Bengaluru signboard, BMTC/Metro sign,
              restaurant menu, or everyday item to instantly extract Kannada text, hear pronunciation,
              and learn relevant vocabulary.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMode('upload');
                fileInputRef.current?.click();
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                mode === 'upload'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload Image
            </button>
            <button
              onClick={() => {
                setMode('camera');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                mode === 'camera'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Camera className="w-4 h-4" />
              Live Camera
            </button>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera Error Alert */}
      {cameraError && (
        <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-4 text-amber-300 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
            <span>{cameraError} Switched to photo upload mode.</span>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 rounded-lg text-xs font-medium border border-amber-500/30"
          >
            Choose File
          </button>
        </div>
      )}

      {/* Main Grid: Input / Preview on Left, Analysis on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Capture or Upload Zone */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Camera className="w-4 h-4 text-emerald-400" />
              {mode === 'camera' ? 'Camera Viewfinder' : 'Image Source'}
            </h3>

            {mode === 'camera' ? (
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video border border-slate-800 flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-4 flex justify-center">
                  <button
                    onClick={captureFrame}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-full shadow-lg transform active:scale-95 transition-all"
                  >
                    <Camera className="w-5 h-5" />
                    Capture & Scan
                  </button>
                </div>
              </div>
            ) : selectedImage ? (
              <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center group">
                <img
                  src={selectedImage}
                  alt="Scanned Kannada subject"
                  className="w-full h-full object-contain"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 text-white font-medium text-sm transition-opacity"
                >
                  <RefreshCw className="w-4 h-4" /> Change Image
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-950/40 transition-colors group"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
                  <Upload className="w-7 h-7" />
                </div>
                <p className="text-sm font-medium text-slate-200">
                  Drop a sign, menu, or photo here
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports JPG, PNG, WEBP up to 10MB
                </p>
                <span className="mt-3 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30">
                  Browse files
                </span>
              </div>
            )}

            {/* Quick Sample Presets */}
            <div className="mt-5 pt-4 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
                Or test with verified Karnataka samples:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_IMAGES.map(sample => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition-all hover:border-emerald-500/40 group"
                  >
                    <div className="text-xs font-medium text-slate-200 group-hover:text-emerald-400 truncate">
                      {sample.title}
                    </div>
                    <div className="text-[11px] font-kannada text-slate-400 truncate mt-0.5">
                      {sample.titleKannada}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Analysis Output */}
        <div className="lg:col-span-7">
          {isLoading ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[420px]">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-spin">
                  <RefreshCw className="w-8 h-8" />
                </div>
                <Sparkles className="w-5 h-5 text-teal-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <h4 className="text-lg font-bold text-white mt-5">Analyzing with Gemini Vision...</h4>
              <p className="text-sm text-slate-400 mt-1 max-w-sm">
                Extracting Kannada script, computing phonetic transliteration, and generating bilingual breakdown.
              </p>
            </div>
          ) : error ? (
            <div className="bg-rose-950/20 border border-rose-500/40 rounded-2xl p-8 flex flex-col items-center text-center min-h-[350px] justify-center">
              <AlertTriangle className="w-10 h-10 text-rose-400 mb-3" />
              <h4 className="text-base font-semibold text-rose-200">Analysis Error</h4>
              <p className="text-sm text-slate-400 mt-1 max-w-md">{error}</p>
              <button
                onClick={() => selectedImage && analyzeImageData(selectedImage, mimeType)}
                className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium"
              >
                Try Again
              </button>
            </div>
          ) : analysis ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              {/* Badge & Detection Tag */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wide">
                    {analysis.detectedType}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified OCR
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSpeak(analysis.extractedKannada)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-md transition-colors"
                  >
                    <Volume2 className="w-4 h-4" /> Listen
                  </button>
                  <button
                    onClick={handleSaveToNotebook}
                    disabled={isAlreadySaved || savedSuccess}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      savedSuccess || isAlreadySaved
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {savedSuccess || isAlreadySaved ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" /> Saved
                      </>
                    ) : (
                      <>
                        <BookmarkPlus className="w-4 h-4" /> Save
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Primary Detected Text Card */}
              <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-teal-950/30 border border-emerald-500/30 rounded-xl p-5">
                <span className="text-xs text-emerald-400 font-medium tracking-wide uppercase block mb-1">
                  Recognized Kannada Script
                </span>
                <div className="text-2xl sm:text-3xl font-bold font-kannada text-white leading-relaxed">
                  {analysis.extractedKannada}
                </div>
                <div className="text-sm font-mono text-emerald-300/90 mt-1">
                  {analysis.transliteration}
                </div>
                <div className="text-base text-slate-200 mt-2 font-medium">
                  {analysis.english}
                </div>
              </div>

              {/* Vocabulary Breakdown Table */}
              {analysis.vocabularyBreakdown && analysis.vocabularyBreakdown.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    Word-by-Word Vocabulary Breakdown
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {analysis.vocabularyBreakdown.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex items-start justify-between hover:border-emerald-500/40 transition-colors"
                      >
                        <div>
                          <div className="font-kannada font-bold text-white text-base">
                            {item.word}
                          </div>
                          <div className="text-xs font-mono text-emerald-400">{item.transliteration}</div>
                          <div className="text-xs text-slate-300 mt-0.5">{item.meaning}</div>
                        </div>
                        <button
                          onClick={() => onSpeak(item.word)}
                          className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-700 transition-colors"
                          title="Listen to word"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cultural Context Note */}
              {analysis.culturalContext && (
                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex items-start gap-3">
                  <Info className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-teal-300 uppercase tracking-wider block">
                      Karnataka Context & Etiquette
                    </span>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {analysis.culturalContext}
                    </p>
                  </div>
                </div>
              )}

              {/* Action: Practice in Speaking Lab */}
              <div className="pt-2">
                <button
                  onClick={() =>
                    onLaunchPractice({
                      kannada: analysis.extractedKannada,
                      transliteration: analysis.transliteration,
                      english: analysis.english
                    })
                  }
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-sm shadow-lg shadow-emerald-950/50 transition-all group"
                >
                  <Mic className="w-4 h-4 text-emerald-200" />
                  Practice Speaking This Phrase in Lab
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[420px]">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 mb-4">
                <FileImage className="w-8 h-8" />
              </div>
              <h4 className="text-base font-semibold text-slate-200">No Image Selected Yet</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Capture a photo through your camera or select one of the Karnataka presets on the left to start instant visual analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
