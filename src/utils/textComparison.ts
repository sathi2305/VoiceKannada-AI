import { PracticeComparisonResult } from '../types';

/**
 * Normalizes Kannada and English text by trimming, standardizing whitespace,
 * and removing punctuation that might differ in speech transcripts.
 */
export function normalizeKannadaText(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // remove zero-width spaces/joiners
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'।॥]/g, '') // remove punctuation
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Calculates standard Levenshtein distance between two strings
 */
function calculateLevenshtein(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;

  const matrix = Array.from({ length: bn + 1 }, () => Array(an + 1).fill(0));

  for (let i = 0; i <= an; i++) matrix[0][i] = i;
  for (let j = 0; j <= bn; j++) matrix[j][0] = j;

  for (let j = 1; j <= bn; j++) {
    for (let i = 1; i <= an; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j - 1][i] + 1, // deletion
        matrix[j][i - 1] + 1, // insertion
        matrix[j - 1][i - 1] + cost // substitution
      );
    }
  }

  return matrix[bn][an];
}

/**
 * Grounded speech evaluation comparing target Kannada phrase with recognized transcript.
 * Provides transparent word-level matching and character similarity.
 */
export function compareSpeechTranscript(
  targetText: string,
  recognizedText: string
): PracticeComparisonResult {
  const cleanTarget = normalizeKannadaText(targetText);
  const cleanRecognized = normalizeKannadaText(recognizedText);

  if (!cleanRecognized) {
    const targetWords = cleanTarget.split(' ').filter(Boolean);
    return {
      targetText,
      recognizedText: '',
      matchRatio: 0,
      isFullMatch: false,
      matchedWords: [],
      missingWords: targetWords,
      extraWords: [],
      feedback: 'No speech recognized yet. Click the microphone button and speak clearly in Kannada.',
      detailedTokens: targetWords.map(w => ({ targetWord: w, matched: false }))
    };
  }

  const targetWords = cleanTarget.split(' ').filter(Boolean);
  const recognizedWords = cleanRecognized.split(' ').filter(Boolean);

  const matchedWords: string[] = [];
  const missingWords: string[] = [];
  const recognizedWordSet = new Set(recognizedWords);

  const detailedTokens = targetWords.map(targetWord => {
    // Check exact word match or high phonetic proximity
    const hasExact = recognizedWordSet.has(targetWord);
    let matched = hasExact;

    if (!matched) {
      // Check for slight pronunciation/transcription variance (distance <= 1 for short, <= 2 for long)
      const threshold = targetWord.length > 5 ? 2 : 1;
      const closeWord = recognizedWords.find(rw => calculateLevenshtein(targetWord, rw) <= threshold);
      if (closeWord) {
        matched = true;
      }
    }

    if (matched) {
      matchedWords.push(targetWord);
    } else {
      missingWords.push(targetWord);
    }

    return {
      targetWord,
      matched
    };
  });

  const extraWords = recognizedWords.filter(rw => {
    return !targetWords.some(tw => tw === rw || calculateLevenshtein(tw, rw) <= 1);
  });

  // Calculate genuine mathematical similarity ratio based on normalized character distance
  const maxLen = Math.max(cleanTarget.length, cleanRecognized.length);
  const distance = calculateLevenshtein(cleanTarget, cleanRecognized);
  const charSimilarity = maxLen === 0 ? 1 : Math.max(0, (maxLen - distance) / maxLen);

  const wordRatio = targetWords.length > 0 ? matchedWords.length / targetWords.length : 0;
  const matchRatio = Math.round(((wordRatio * 0.6) + (charSimilarity * 0.4)) * 100) / 100;
  const isFullMatch = cleanTarget === cleanRecognized || (missingWords.length === 0 && extraWords.length === 0);

  let feedback = '';
  if (isFullMatch) {
    feedback = `Perfect match! All ${targetWords.length} words were pronounced and transcribed accurately.`;
  } else if (missingWords.length === 0 && extraWords.length > 0) {
    feedback = `Good recognition! All target words matched, with extra spoken sound: "${extraWords.join(' ')}".`;
  } else if (matchedWords.length > 0) {
    feedback = `${matchedWords.length} of ${targetWords.length} words matched (${Math.round(matchRatio * 100)}% grounded alignment). Missing: "${missingWords.join(', ')}".`;
  } else {
    feedback = `Spoken transcript did not match the target phrase. You said: "${cleanRecognized}". Target is: "${cleanTarget}". Try speaking slowly.`;
  }

  return {
    targetText,
    recognizedText,
    matchRatio,
    isFullMatch,
    matchedWords,
    missingWords,
    extraWords,
    feedback,
    detailedTokens
  };
}
