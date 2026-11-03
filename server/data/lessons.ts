export interface PhraseBreakdownItem {
  word: string;
  transliteration: string;
  meaning: string;
}

export interface LessonPhrase {
  id: string;
  kannada: string;
  transliteration: string;
  english: string;
  context?: string;
  audioHint?: string;
  breakdown?: PhraseBreakdownItem[];
}

export interface LessonDialogueExample {
  speakerA: string;
  speakerB: string;
  translitA?: string;
  translitB?: string;
  englishA: string;
  englishB: string;
}

export interface LessonQuizQuestion {
  question: string;
  questionKannada?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonInteractiveExercise {
  type: 'fill_in' | 'word_order';
  prompt: string;
  targetText: string;
  options?: string[];
  correctOrder?: string[];
  explanation: string;
}

export interface Lesson {
  id: string;
  titleKannada: string;
  titleEnglish: string;
  category: 'basics' | 'travel' | 'shopping' | 'food' | 'health' | 'daily' | 'grammar';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  durationMinutes: number;
  phrasesCount: number;
  culturalNote?: string;
  objective?: string;
  pronunciationTips?: string;
  examples?: LessonDialogueExample[];
  quiz?: LessonQuizQuestion[];
  interactiveExercise?: LessonInteractiveExercise;
  phrases: LessonPhrase[];
}

export const KANNADA_LESSONS: Lesson[] = [
  // =========================================================================
  // LEVEL 1: BEGINNER (Lessons 1 - 15)
  // =========================================================================
  {
    id: 'lesson-1',
    titleKannada: 'ಶುಭಾಶಯಗಳು ಮತ್ತು ಪರಿಚಯ',
    titleEnglish: 'Greetings & Introduction',
    category: 'basics',
    difficulty: 'Beginner',
    description: 'Essential polite greetings and how to introduce yourself respectfully in Kannada.',
    durationMinutes: 10,
    phrasesCount: 6,
    objective: 'Learn respectful greetings, asking someone how they are, and saying your name.',
    pronunciationTips: 'Roll the "r" gently in "Namaskāra". Distinguish short "a" from long "ā".',
    culturalNote: 'In Kannada culture, greeting with both hands joined while saying "ನಮಸ್ಕಾರ" (Namaskāra) conveys deep respect.',
    examples: [
      {
        speakerA: 'ನಮಸ್ಕಾರ, ನಿಮ್ಮ ಹೆಸರೇನು?',
        translitA: 'Namaskāra, nimma hesarēnu?',
        englishA: 'Hello, what is your name?',
        speakerB: 'ನಮಸ್ಕಾರ! ನನ್ನ ಹೆಸರು ಆನಂದ್. ನೀವು ಹೇಗಿದ್ದೀರಿ?',
        translitB: 'Namaskāra! Nanna hesaru Ānand. Nīvu hēgiddīri?',
        englishB: 'Hello! My name is Anand. How are you?'
      }
    ],
    interactiveExercise: {
      type: 'word_order',
      prompt: 'Arrange the words to say: "What is your name?"',
      targetText: 'ನಿಮ್ಮ ಹೆಸರೇನು?',
      options: ['ಹೆಸರೇನು', 'ನಿಮ್ಮ', 'ನನ್ನ'],
      correctOrder: ['ನಿಮ್ಮ', 'ಹೆಸರೇನು'],
      explanation: '"ನಿಮ್ಮ" means your (polite), followed by "ಹೆಸರೇನು" (what is the name).'
    },
    quiz: [
      {
        question: 'Which word is the universal polite greeting in Kannada?',
        questionKannada: 'ಕನ್ನಡದಲ್ಲಿ ಗೌರವಯುತವಾದ ಸಾಮಾನ್ಯ ಶುಭಾಶಯ ಯಾವುದು?',
        options: ['ಧನ್ಯವಾದಗಳು (Dhan\'yavādagaḷu)', 'ನಮಸ್ಕಾರ (Namaskāra)', 'ಹೋಗಿ ಬನ್ನಿ (Hōgi banni)', 'ಏನು (Ēnu)'],
        correctIndex: 1,
        explanation: '"ನಮಸ್ಕಾರ" (Namaskāra) is the traditional, respectful greeting.'
      },
      {
        question: 'How do you say "My name is..." in Kannada?',
        questionKannada: '"ನನ್ನ ಹೆಸರು..." ಎಂದು ಹೇಳುವುದು ಹೇಗೆ?',
        options: ['ನಿಮ್ಮ ಹೆಸರು (Nimma hesaru)', 'ನನ್ನ ಹೆಸರು (Nanna hesaru)', 'ಅವರ ಹೆಸರು (Avara hesaru)', 'ಯಾರ ಹೆಸರು (Yāra hesaru)'],
        correctIndex: 1,
        explanation: '"ನನ್ನ ಹೆಸರು" translates directly to "My name".'
      }
    ],
    phrases: [
      {
        id: 'p-1-1',
        kannada: 'ನಮಸ್ಕಾರ',
        transliteration: 'Namaskāra',
        english: 'Hello / Greetings / Respectful salutation',
        context: 'Universal polite greeting suitable at any time of day.',
        breakdown: [{ word: 'ನಮಸ್ಕಾರ', transliteration: 'Namaskāra', meaning: 'Salutation' }]
      },
      {
        id: 'p-1-2',
        kannada: 'ನೀವು ಹೇಗಿದ್ದೀರಿ?',
        transliteration: 'Nīvu hēgiddīri?',
        english: 'How are you? (Respectful / Formal)',
        context: 'Polite honorific form used for elders, strangers, and professional settings.',
        breakdown: [
          { word: 'ನೀವು', transliteration: 'Nīvu', meaning: 'You (formal)' },
          { word: 'ಹೇಗಿದ್ದೀರಿ', transliteration: 'hēgiddīri', meaning: 'how are you' }
        ]
      },
      {
        id: 'p-1-3',
        kannada: 'ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ',
        transliteration: 'Nānu cennāgiddēne',
        english: 'I am doing well',
        context: 'Standard positive response to "ನೀವು ಹೇಗಿದ್ದೀರಿ?".',
        breakdown: [
          { word: 'ನಾನು', transliteration: 'Nānu', meaning: 'I' },
          { word: 'ಚೆನ್ನಾಗಿದ್ದೇನೆ', transliteration: 'cennāgiddēne', meaning: 'am fine / well' }
        ]
      },
      {
        id: 'p-1-4',
        kannada: 'ನಿಮ್ಮ ಹೆಸರೇನು?',
        transliteration: 'Nimma hesarēnu?',
        english: 'What is your name? (Polite)',
        context: 'Respectful way to ask someone their name.',
        breakdown: [
          { word: 'ನಿಮ್ಮ', transliteration: 'Nimma', meaning: 'Your (formal)' },
          { word: 'ಹೆಸರು', transliteration: 'hesaru', meaning: 'name' },
          { word: 'ಏನು', transliteration: 'ēnu', meaning: 'what' }
        ]
      },
      {
        id: 'p-1-5',
        kannada: 'ಧನ್ಯವಾದಗಳು',
        transliteration: 'Dhan\'yavādagaḷu',
        english: 'Thank you very much',
        context: 'Expressing genuine gratitude.',
        breakdown: [{ word: 'ಧನ್ಯವಾದಗಳು', transliteration: 'Dhan\'yavādagaḷu', meaning: 'Thanks (plural)' }]
      },
      {
        id: 'p-1-6',
        kannada: 'ಮತ್ತೆ ಸಿಗೋಣ',
        transliteration: 'Matte sigōṇa',
        english: 'See you again / Until next time',
        context: 'Warm parting phrase instead of a blunt goodbye.',
        breakdown: [
          { word: 'ಮತ್ತೆ', transliteration: 'matte', meaning: 'again' },
          { word: 'ಸಿಗೋಣ', transliteration: 'sigōṇa', meaning: 'let us meet' }
        ]
      }
    ]
  },
  {
    id: 'lesson-2',
    titleKannada: 'ಕನ್ನಡ ಸ್ವರಗಳು (ಸ್ವರಮಾಲೆ)',
    titleEnglish: 'Kannada Vowels (Swaragalu)',
    category: 'basics',
    difficulty: 'Beginner',
    description: 'Learn the foundational 14 Kannada vowels (ಅ to ಔ), their sounds, and phonetic classification.',
    durationMinutes: 12,
    phrasesCount: 6,
    objective: 'Master short vowels (Hrasva), long vowels (Dīrgha), and diphthongs.',
    pronunciationTips: 'Contrast short "ಅ" (as in "up") with long "ಆ" (as in "father"). Hold long vowels for two beats.',
    culturalNote: 'Kannada has a strictly scientific phonetic script where every letter represents exactly one sound.',
    examples: [
      {
        speakerA: 'ಕನ್ನಡದಲ್ಲಿ ಎಷ್ಟು ಸ್ವರಗಳಿವೆ?',
        translitA: 'Kannaḍadalli eṣṭu svaragaḷive?',
        englishA: 'How many vowels are there in Kannada?',
        speakerB: 'ಕನ್ನಡದಲ್ಲಿ 14 ಮುಖ್ಯ ಸ್ವರಗಳಿವೆ: ಅ, ಆ, ಇ, ಈ...',
        translitB: 'Kannaḍadalli 14 mukhya svaragaḷive: a, ā, i, ī...',
        englishB: 'There are 14 primary vowels in Kannada: a, ā, i, ī...'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Complete the pair: ಅ (short a) -> ___ (long ā)',
      targetText: 'ಆ',
      options: ['ಇ', 'ಆ', 'ಉ', 'ಎ'],
      explanation: '"ಆ" is the elongated counterpart of "ಅ".'
    },
    quiz: [
      {
        question: 'Which of the following represents the short vowel "i"?',
        options: ['ಈ', 'ಇ', 'ಉ', 'ಋ'],
        correctIndex: 1,
        explanation: '"ಇ" is the short "i" sound, as in "bit". "ಈ" is the long vowel, as in "meet".'
      }
    ],
    phrases: [
      {
        id: 'p-2-1',
        kannada: 'ಅ, ಆ',
        transliteration: 'a, ā',
        english: 'Short "a" (as in cut) and Long "ā" (as in calm)',
        context: 'Foundation vowel pair.',
        breakdown: [{ word: 'ಅ, ಆ', transliteration: 'a, ā', meaning: 'Vowel sounds a and ā' }]
      },
      {
        id: 'p-2-2',
        kannada: 'ಇ, ಈ',
        transliteration: 'i, ī',
        english: 'Short "i" (as in sit) and Long "ī" (as in seat)',
        context: 'Palatal vowels.',
        breakdown: [{ word: 'ಇ, ಈ', transliteration: 'i, ī', meaning: 'Vowel sounds i and ī' }]
      },
      {
        id: 'p-2-3',
        kannada: 'ಉ, ಊ',
        transliteration: 'u, ū',
        english: 'Short "u" (as in put) and Long "ū" (as in boot)',
        context: 'Labial vowels.',
        breakdown: [{ word: 'ಉ, ಊ', transliteration: 'u, ū', meaning: 'Vowel sounds u and ū' }]
      },
      {
        id: 'p-2-4',
        kannada: 'ಋ',
        transliteration: 'ru / ṛ',
        english: 'Vocalic "ru" sound (as in Rushi - sage)',
        context: 'Traditional Sanskrit-derived vowel.',
        breakdown: [{ word: 'ಋ', transliteration: 'ru', meaning: 'Vocalic r' }]
      },
      {
        id: 'p-2-5',
        kannada: 'ಎ, ಏ, ಐ',
        transliteration: 'e, ē, ai',
        english: 'Short "e" (bed), Long "ē" (fade), and Diphthong "ai" (sky)',
        context: 'Front vowel series unique to Dravidian languages having distinct short "e".',
        breakdown: [{ word: 'ಎ, ಏ, ಐ', transliteration: 'e, ē, ai', meaning: 'e, ē, ai vowels' }]
      },
      {
        id: 'p-2-6',
        kannada: 'ಒ, ಓ, ಔ',
        transliteration: 'o, ō, au',
        english: 'Short "o" (lot), Long "ō" (boat), and Diphthong "au" (cow)',
        context: 'Back vowel series.',
        breakdown: [{ word: 'ಒ, ಓ, ಔ', transliteration: 'o, ō, au', meaning: 'o, ō, au vowels' }]
      }
    ]
  },
  {
    id: 'lesson-3',
    titleKannada: 'ಕನ್ನಡ ವ್ಯಂಜನಗಳು (ವರ್ಗೀಯ ಮತ್ತು ಅವರ್ಗೀಯ)',
    titleEnglish: 'Kannada Consonants (Vyanjanagalu)',
    category: 'basics',
    difficulty: 'Beginner',
    description: 'Explore the 34 consonants classified by place of articulation: Ka, Cha, Ta, Tha, Pa vargas.',
    durationMinutes: 14,
    phrasesCount: 6,
    objective: 'Understand unvoiced, voiced, and aspirated consonant series.',
    pronunciationTips: 'Retroflex letters (ಟ, ಠ, ಡ, ಢ, ಣ) require curling the tongue back to touch the roof of the mouth.',
    culturalNote: 'The Kannada script is celebrated for its graceful rounded curves, historically written with styluses on palm leaves.',
    examples: [
      {
        speakerA: 'ಕ-ವರ್ಗದ ಮೊದಲ ಅಕ್ಷರ ಯಾವುದು?',
        translitA: 'Ka-vargada modala akṣara yāvudu?',
        englishA: 'What is the first letter of the Ka series?',
        speakerB: 'ಅದು "ಕ" (Ka), ನಂತರ ಖ, ಗ, ಘ, ಙ ಬರುತ್ತವೆ.',
        translitB: 'Adu "ka" (Ka), nanthara kha, ga, gha, ṅa baruttave.',
        englishB: 'It is "ಕ" (Ka), followed by kha, ga, gha, ṅa.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'What letter follows "ಕ" (unvoiced) with aspiration?',
      targetText: 'ಖ',
      options: ['ಗ', 'ಖ', 'ಚ', 'ತ'],
      explanation: '"ಖ" is the aspirated "Kha" consonant.'
    },
    quiz: [
      {
        question: 'How many categorized groups (Vargas) are in Kannada consonants?',
        options: ['3', '5', '7', '10'],
        correctIndex: 1,
        explanation: 'There are 5 vargas: Ka-varga, Cha-varga, Ta-varga, Tha-varga, and Pa-varga.'
      }
    ],
    phrases: [
      {
        id: 'p-3-1',
        kannada: 'ಕ, ಖ, ಗ, ಘ, ಙ',
        transliteration: 'ka, kha, ga, gha, ṅa',
        english: 'Ka-varga (Velar consonants)',
        context: 'Pronounced at the throat/velum.',
        breakdown: [{ word: 'ಕ-ಙ', transliteration: 'ka-ṅa', meaning: 'Velar group' }]
      },
      {
        id: 'p-3-2',
        kannada: 'ಚ, ಛ, ಜ, ಝ, ಞ',
        transliteration: 'ca, cha, ja, jha, ña',
        english: 'Cha-varga (Palatal consonants)',
        context: 'Pronounced with tongue against the hard palate.',
        breakdown: [{ word: 'ಚ-ಞ', transliteration: 'ca-ña', meaning: 'Palatal group' }]
      },
      {
        id: 'p-3-3',
        kannada: 'ಟ, ಠ, ಡ, ಢ, ಣ',
        transliteration: 'ṭa, ṭha, ḍa, ḍha, ṇa',
        english: 'Ta-varga (Retroflex consonants)',
        context: 'Pronounced with tongue curled back against the roof of the mouth.',
        breakdown: [{ word: 'ಟ-ಣ', transliteration: 'ṭa-ṇa', meaning: 'Retroflex group' }]
      },
      {
        id: 'p-3-4',
        kannada: 'ತ, ಥ, ದ, ಧ, ನ',
        transliteration: 'ta, tha, da, dha, na',
        english: 'Tha-varga (Dental consonants)',
        context: 'Pronounced with tip of tongue touching upper front teeth.',
        breakdown: [{ word: 'ತ-ನ', transliteration: 'ta-na', meaning: 'Dental group' }]
      },
      {
        id: 'p-3-5',
        kannada: 'ಪ, ಫ, ಬ, ಭ, ಮ',
        transliteration: 'pa, pha, ba, bha, ma',
        english: 'Pa-varga (Labial consonants)',
        context: 'Pronounced with both lips touching.',
        breakdown: [{ word: 'ಪ-ಮ', transliteration: 'pa-ma', meaning: 'Labial group' }]
      },
      {
        id: 'p-3-6',
        kannada: 'ಯ, ರ, ಲ, ವ, ಶ, ಷ, ಸ, ಹ, ಳ',
        transliteration: 'ya, ra, la, va, śa, ṣa, sa, ha, ḷa',
        english: 'Avargīya Vyanjanagalu (Semi-vowels, sibilants & retroflex ḷa)',
        context: 'Non-classified consonants, including distinctive Kannada "ಳ" (retroflex L).',
        breakdown: [{ word: 'ಯ-ಳ', transliteration: 'ya-ḷa', meaning: 'Unclassified consonants' }]
      }
    ]
  },
  {
    id: 'lesson-4',
    titleKannada: 'ಸಂಖ್ಯೆಗಳು 1 ರಿಂದ 20',
    titleEnglish: 'Numbers 1 to 20',
    category: 'basics',
    difficulty: 'Beginner',
    description: 'Learn to count from 1 to 20 in Kannada with real-life usage for prices and counting.',
    durationMinutes: 10,
    phrasesCount: 6,
    objective: 'Count objects, understand prices, and read Kannada numerals.',
    pronunciationTips: 'Stress "ondhu" clearly. "Hattu" has a double "t" dental sound.',
    culturalNote: 'Traditional Kannada numerals (೧, ೨, ೩...) are still widely seen on vintage milestones and RTC buses.',
    examples: [
      {
        speakerA: 'ನಿಮ್ಮ ಬಳಿ ಎಷ್ಟು ಪುಸ್ತಕಗಳಿವೆ?',
        translitA: 'Nimma baḷi eṣṭu pustakagaḷive?',
        englishA: 'How many books do you have?',
        speakerB: 'ನನ್ನ ಬಳಿ ಐದು ಪುಸ್ತಕಗಳಿವೆ.',
        translitB: 'Nanna baḷi aidu pustakagaḷive.',
        englishB: 'I have five books.'
      }
    ],
    interactiveExercise: {
      type: 'word_order',
      prompt: 'Arrange to say: "Give me two coffee"',
      targetText: 'ಎರಡು ಕಾಫಿ ಕೊಡಿ',
      options: ['ಕೊಡಿ', 'ಎರಡು', 'ಕಾಫಿ'],
      correctOrder: ['ಎರಡು', 'ಕಾಫಿ', 'ಕೊಡಿ'],
      explanation: 'Number (ಎರಡು) + Noun (ಕಾಫಿ) + Verb (ಕೊಡಿ).'
    },
    quiz: [
      {
        question: 'What is the Kannada word for number 10?',
        options: ['ಐದು (Aidu)', 'ಹತ್ತು (Hattu)', 'ಎಂಟು (Enṭu)', 'ಹದಿನೈದು (Hadinoidu)'],
        correctIndex: 1,
        explanation: '"ಹತ್ತು" (Hattu) is 10.'
      }
    ],
    phrases: [
      {
        id: 'p-4-1',
        kannada: 'ಒಂದು, ಎರಡು, ಮೂರು, ನಾಲ್ಕು',
        transliteration: 'Ondu, eraḍu, mūru, nālku',
        english: 'One (1), Two (2), Three (3), Four (4)',
        context: 'First four cardinal numbers.',
        breakdown: [{ word: 'ಒಂದು-ನಾಲ್ಕು', transliteration: 'ondu-nālku', meaning: '1 to 4' }]
      },
      {
        id: 'p-4-2',
        kannada: 'ಐದು, ಆರು, ಏಳು, ಎಂಟು',
        transliteration: 'Aidu, āru, ēḷu, eṇṭu',
        english: 'Five (5), Six (6), Seven (7), Eight (8)',
        context: 'Numbers 5 to 8.',
        breakdown: [{ word: 'ಐದು-ಎಂಟು', transliteration: 'aidu-eṇṭu', meaning: '5 to 8' }]
      },
      {
        id: 'p-4-3',
        kannada: 'ಒಂಬತ್ತು, ಹತ್ತು',
        transliteration: 'Ombattu, hattu',
        english: 'Nine (9), Ten (10)',
        context: 'Completing the first decade.',
        breakdown: [{ word: 'ಒಂಬತ್ತು, ಹತ್ತು', transliteration: 'ombattu, hattu', meaning: '9 and 10' }]
      },
      {
        id: 'p-4-4',
        kannada: 'ಹನ್ನೊಂದು, ಹನ್ನೆರಡು, ಹದಿಮೂರು',
        transliteration: 'Hannondu, hanneradu, hadimūru',
        english: 'Eleven (11), Twelve (12), Thirteen (13)',
        context: 'Numbers 11 to 13.',
        breakdown: [{ word: 'ಹನ್ನೊಂದು-ಹದಿಮೂರು', transliteration: 'hannondu-hadimūru', meaning: '11 to 13' }]
      },
      {
        id: 'p-4-5',
        kannada: 'ಹದಿನಾಲ್ಕು, ಹದಿನೈದು, ಹದಿನಾರು',
        transliteration: 'Hadinālku, hadinaidu, hadināru',
        english: 'Fourteen (14), Fifteen (15), Sixteen (16)',
        context: 'Numbers 14 to 16.',
        breakdown: [{ word: 'ಹದಿನಾಲ್ಕು-ಹದಿನಾರು', transliteration: 'hadinālku-hadināru', meaning: '14 to 16' }]
      },
      {
        id: 'p-4-6',
        kannada: 'ಹದಿನೇಳು, ಹದಿನೆಂಟು, ಹತ್ತೊಂಬತ್ತು, ಇಪ್ಪತ್ತು',
        transliteration: 'Hadinēḷu, hadineṇṭu, hattombattu, ippattu',
        english: 'Seventeen (17), Eighteen (18), Nineteen (19), Twenty (20)',
        context: 'Counting through 20.',
        breakdown: [{ word: 'ಹದಿನೇಳು-ಇಪ್ಪತ್ತು', transliteration: 'hadinēḷu-ippattu', meaning: '17 to 20' }]
      }
    ]
  },
  {
    id: 'lesson-5',
    titleKannada: 'ಕುಟುಂಬ ಮತ್ತು ಸಂಬಂಧಗಳು',
    titleEnglish: 'Family & Relationships',
    category: 'basics',
    difficulty: 'Beginner',
    description: 'Learn terms for family members including parents, siblings, grandparents, and respectful suffixes.',
    durationMinutes: 10,
    phrasesCount: 6,
    objective: 'Introduce family members and address relatives with customary respect.',
    pronunciationTips: 'The retroflex "ṇ" in "Aṇṇa" is distinct from dental "n".',
    culturalNote: 'In Kannada, elder siblings and relatives always receive honorific terms such as "ಅಣ್ಣ" (elder brother) and "ಅಕ್ಕ" (elder sister).',
    examples: [
      {
        speakerA: 'ಇವರು ಯಾರು?',
        translitA: 'Ivaru yāru?',
        englishA: 'Who is this (person)?',
        speakerB: 'ಇವರು ನನ್ನ ತಂದೆ, ಇವರು ನನ್ನ ತಾಯಿ.',
        translitB: 'Ivaru nanna tande, ivaru nanna tāyi.',
        englishB: 'This is my father, this is my mother.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Word for father: "ಇವರು ನನ್ನ ___"',
      targetText: 'ತಂದೆ',
      options: ['ತಂದೆ', 'ತಾಯಿ', 'ಅಕ್ಕ', 'ಸ್ನೇಹಿತ'],
      explanation: '"ತಂದೆ" (tande) or "ಅಪ್ಪ" (appa) means father.'
    },
    quiz: [
      {
        question: 'What is the respectful Kannada word for elder brother?',
        options: ['ತಮ್ಮ (Tamma)', 'ಅಣ್ಣ (Aṇṇa)', 'ಅಕ್ಕ (Akka)', 'ಮಾವ (Māva)'],
        correctIndex: 1,
        explanation: '"ಅಣ್ಣ" (Aṇṇa) refers specifically to an elder brother.'
      }
    ],
    phrases: [
      {
        id: 'p-5-1',
        kannada: 'ಅಪ್ಪ / ತಂದೆ',
        transliteration: 'Appa / Tande',
        english: 'Father / Dad',
        context: 'Appa is affectionate; Tande is formal.',
        breakdown: [{ word: 'ಅಪ್ಪ / ತಂದೆ', transliteration: 'appa / tande', meaning: 'Father' }]
      },
      {
        id: 'p-5-2',
        kannada: 'ಅಮ್ಮ / ತಾಯಿ',
        transliteration: 'Amma / Tāyi',
        english: 'Mother / Mom',
        context: 'Amma is universally used with deep affection.',
        breakdown: [{ word: 'ಅಮ್ಮ / ತಾಯಿ', transliteration: 'amma / tāyi', meaning: 'Mother' }]
      },
      {
        id: 'p-5-3',
        kannada: 'ಅಣ್ಣ ಮತ್ತು ತಮ್ಮ',
        transliteration: 'Aṇṇa mattu tamma',
        english: 'Elder brother and younger brother',
        context: 'Distinct words distinguish elder vs younger sibling.',
        breakdown: [
          { word: 'ಅಣ್ಣ', transliteration: 'aṇṇa', meaning: 'elder brother' },
          { word: 'ತಮ್ಮ', transliteration: 'tamma', meaning: 'younger brother' }
        ]
      },
      {
        id: 'p-5-4',
        kannada: 'ಅಕ್ಕ ಮತ್ತು ತಂಗಿ',
        transliteration: 'Akka mattu tangi',
        english: 'Elder sister and younger sister',
        context: 'Distinct words for sisters.',
        breakdown: [
          { word: 'ಅಕ್ಕ', transliteration: 'akka', meaning: 'elder sister' },
          { word: 'ತಂಗಿ', transliteration: 'tangi', meaning: 'younger sister' }
        ]
      },
      {
        id: 'p-5-5',
        kannada: 'ತಾತ ಮತ್ತು ಅಜ್ಜಿ',
        transliteration: 'Tāta mattu ajji',
        english: 'Grandfather and grandmother',
        context: 'Paternal and maternal grandparents.',
        breakdown: [
          { word: 'ತಾತ', transliteration: 'tāta', meaning: 'grandfather' },
          { word: 'ಅಜ್ಜಿ', transliteration: 'ajji', meaning: 'grandmother' }
        ]
      },
      {
        id: 'p-5-6',
        kannada: 'ಸ್ನೇಹಿತ / ಸ್ನೇಹಿತೆ',
        transliteration: 'Snēhita / Snēhite',
        english: 'Friend (Male / Female)',
        context: 'Also colloquially referred to as "geḷeya / geḷati".',
        breakdown: [{ word: 'ಸ್ನೇಹಿತ', transliteration: 'snēhita', meaning: 'Friend' }]
      }
    ]
  },
  {
    id: 'lesson-6',
    titleKannada: 'ದಿನನಿತ್ಯದ ವಸ್ತುಗಳು',
    titleEnglish: 'Everyday Objects',
    category: 'daily',
    difficulty: 'Beginner',
    description: 'Learn common items in your room, office, and pocket.',
    durationMinutes: 9,
    phrasesCount: 6,
    objective: 'Name everyday objects around you in home and workspace.',
    pronunciationTips: 'In "Pustaka", stress the first syllable.',
    culturalNote: 'Borrow words from English like "Phone" or "Pen" are commonly used, but knowing the pure Kannada words enriches vocabulary.',
    examples: [
      {
        speakerA: 'ಇದು ಏನು?',
        translitA: 'Idu ēnu?',
        englishA: 'What is this?',
        speakerB: 'ಇದು ಕನ್ನಡ ಪುಸ್ತಕ.',
        translitB: 'Idu kannada pustaka.',
        englishB: 'This is a Kannada book.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Word for water: "ನನಗೆ ___ ಬೇಕು"',
      targetText: 'ನೀರು',
      options: ['ನೀರು', 'ಹಾಲು', 'ಹಣ್ಣು', 'ಮನೆ'],
      explanation: '"ನೀರು" (nīru) means water.'
    },
    quiz: [
      {
        question: 'What is the Kannada word for "house / home"?',
        options: ['ಪುಸ್ತಕ (Pustaka)', 'ಮನೆ (Mane)', 'ಗಡಿಯಾರ (Gaḍiyāra)', 'ದಾರ (Dāra)'],
        correctIndex: 1,
        explanation: '"ಮನೆ" (Mane) means house or home.'
      }
    ],
    phrases: [
      {
        id: 'p-6-1',
        kannada: 'ಪುಸ್ತಕ',
        transliteration: 'Pustaka',
        english: 'Book',
        context: 'Everyday study object.',
        breakdown: [{ word: 'ಪುಸ್ತಕ', transliteration: 'pustaka', meaning: 'Book' }]
      },
      {
        id: 'p-6-2',
        kannada: 'ಮನೆ',
        transliteration: 'Mane',
        english: 'House / Home',
        context: 'Everyday place.',
        breakdown: [{ word: 'ಮನೆ', transliteration: 'mane', meaning: 'House' }]
      },
      {
        id: 'p-6-3',
        kannada: 'ನೀರು',
        transliteration: 'Nīru',
        english: 'Water',
        context: 'Essential beverage.',
        breakdown: [{ word: 'ನೀರು', transliteration: 'nīru', meaning: 'Water' }]
      },
      {
        id: 'p-6-4',
        kannada: 'ಬಾಗಿಲು ಮತ್ತು ಕಿಟಕಿ',
        transliteration: 'Bāgilu mattu kiṭaki',
        english: 'Door and Window',
        context: 'Parts of a house.',
        breakdown: [
          { word: 'ಬಾಗಿಲು', transliteration: 'bāgilu', meaning: 'door' },
          { word: 'ಕಿಟಕಿ', transliteration: 'kiṭaki', meaning: 'window' }
        ]
      },
      {
        id: 'p-6-5',
        kannada: 'ಗಡಿಯಾರ',
        transliteration: 'Gaḍiyāra',
        english: 'Clock / Watch',
        context: 'Timekeeper.',
        breakdown: [{ word: 'ಗಡಿಯಾರ', transliteration: 'gaḍiyāra', meaning: 'clock' }]
      },
      {
        id: 'p-6-6',
        kannada: 'ಬಟ್ಟೆ',
        transliteration: 'Baṭṭe',
        english: 'Clothes / Garment',
        context: 'Attire.',
        breakdown: [{ word: 'ಬಟ್ಟೆ', transliteration: 'baṭṭe', meaning: 'clothes' }]
      }
    ]
  },
  {
    id: 'lesson-7',
    titleKannada: 'ಬಣ್ಣಗಳು (ವರ್ಣಗಳು)',
    titleEnglish: 'Colors (Varṇagaḷu)',
    category: 'basics',
    difficulty: 'Beginner',
    description: 'Master the names of primary and secondary colors in Kannada.',
    durationMinutes: 9,
    phrasesCount: 6,
    objective: 'Describe objects by their visual appearance and colors.',
    pronunciationTips: '"Kempu" (red) and "Hasiru" (green) are core Dravidian color roots.',
    culturalNote: 'The red and yellow (ಕೆಂಪು-ಹಳದಿ) Karnataka flag is a beloved cultural emblem.',
    examples: [
      {
        speakerA: 'ಕರ್ನಾಟಕ ಧ್ವಜದಲ್ಲಿ ಯಾವ ಬಣ್ಣಗಳಿವೆ?',
        translitA: 'Karnāṭaka dhvajadalli yāva baṇṇagaḷive?',
        englishA: 'Which colors are in the Karnataka flag?',
        speakerB: 'ಅದರಲ್ಲಿ ಹಳದಿ ಮತ್ತು ಕೆಂಪು ಬಣ್ಣಗಳಿವೆ.',
        translitB: 'Adaralli haḷadi mattu kempu baṇṇagaḷive.',
        englishB: 'It has yellow and red colors.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Word for white: "ಹಾಲು ___ ಬಣ್ಣದಲ್ಲಿದೆ"',
      targetText: 'ಬಿಳಿ',
      options: ['ಬಿಳಿ', 'ಕಪ್ಪು', 'ನೀಲಿ', 'ಕೆಂಪು'],
      explanation: '"ಬಿಳಿ" (biḷi) means white.'
    },
    quiz: [
      {
        question: 'What color is "ಹಸಿರು" (Hasiru)?',
        options: ['Red', 'Green', 'Blue', 'Yellow'],
        correctIndex: 1,
        explanation: '"ಹಸಿರು" (hasiru) translates to green.'
      }
    ],
    phrases: [
      {
        id: 'p-7-1',
        kannada: 'ಕೆಂಪು',
        transliteration: 'Kempu',
        english: 'Red',
        context: 'Bright primary color.',
        breakdown: [{ word: 'ಕೆಂಪು', transliteration: 'kempu', meaning: 'Red' }]
      },
      {
        id: 'p-7-2',
        kannada: 'ಹಳದಿ',
        transliteration: 'Haḷadi',
        english: 'Yellow',
        context: 'Auspicious color of turmeric and the flag.',
        breakdown: [{ word: 'ಹಳದಿ', transliteration: 'haḷadi', meaning: 'Yellow' }]
      },
      {
        id: 'p-7-3',
        kannada: 'ಹಸಿರು',
        transliteration: 'Hasiru',
        english: 'Green',
        context: 'Color of vegetation.',
        breakdown: [{ word: 'ಹಸಿರು', transliteration: 'hasiru', meaning: 'Green' }]
      },
      {
        id: 'p-7-4',
        kannada: 'ನೀಲಿ',
        transliteration: 'Nīli',
        english: 'Blue',
        context: 'Color of the sky and ocean.',
        breakdown: [{ word: 'ನೀಲಿ', transliteration: 'nīli', meaning: 'Blue' }]
      },
      {
        id: 'p-7-5',
        kannada: 'ಬಿಳಿ ಮತ್ತು ಕಪ್ಪು',
        transliteration: 'Biḷi mattu kappu',
        english: 'White and Black',
        context: 'Monochrome base colors.',
        breakdown: [
          { word: 'ಬಿಳಿ', transliteration: 'biḷi', meaning: 'white' },
          { word: 'ಕಪ್ಪು', transliteration: 'kappu', meaning: 'black' }
        ]
      },
      {
        id: 'p-7-6',
        kannada: 'ಕಿತ್ತಳೆ ಮತ್ತು ನೇರಳೆ',
        transliteration: 'Kittaḷe mattu nēraḷe',
        english: 'Orange and Purple / Violet',
        context: 'Secondary colors named after fruits (orange and jamun).',
        breakdown: [
          { word: 'ಕಿತ್ತಳೆ', transliteration: 'kittaḷe', meaning: 'orange' },
          { word: 'ನೇರಳೆ', transliteration: 'nēraḷe', meaning: 'purple' }
        ]
      }
    ]
  },
  {
    id: 'lesson-8',
    titleKannada: 'ವಾರದ ದಿನಗಳು ಮತ್ತು ಸಮಯ',
    titleEnglish: 'Days of the Week & Time',
    category: 'daily',
    difficulty: 'Beginner',
    description: 'Learn the 7 days of the week, yesterday/today/tomorrow, and asking the time.',
    durationMinutes: 11,
    phrasesCount: 6,
    objective: 'Schedule appointments and discuss daily planning.',
    pronunciationTips: 'Notice the common suffix "-vāra" (day) in Somavāra, Mangalavāra.',
    culturalNote: 'Sunday in Kannada is "ಭಾನುವಾರ" (Bhānuvāra), named after Bhanu (Sun).',
    examples: [
      {
        speakerA: 'ಇವತ್ತು ಯಾವ ವಾರ?',
        translitA: 'Ivattu yāva vāra?',
        englishA: 'What day is today?',
        speakerB: 'ಇವತ್ತು ಸೋಮವಾರ. ಈಗ ಸಮಯ ಎಷ್ಟು?',
        translitB: 'Ivattu sōmavāra. Īga samaya eṣṭu?',
        englishB: 'Today is Monday. What time is it now?'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Word for tomorrow: "ನಾಳೆ ___"',
      targetText: 'ನಾಳೆ',
      options: ['ನಿನ್ನೆ', 'ಇವತ್ತು', 'ನಾಳೆ', 'ಈಗ'],
      explanation: '"ನಾಳೆ" (nāḷe) means tomorrow. "ನಿನ್ನೆ" is yesterday; "ಇವತ್ತು" is today.'
    },
    quiz: [
      {
        question: 'Which word means "Yesterday" in Kannada?',
        options: ['ಇವತ್ತು (Ivattu)', 'ನಾಳೆ (Nāḷe)', 'ನಿನ್ನೆ (Ninne)', 'ಈಗ (Īga)'],
        correctIndex: 2,
        explanation: '"ನಿನ್ನೆ" (Ninne) signifies yesterday.'
      }
    ],
    phrases: [
      {
        id: 'p-8-1',
        kannada: 'ಇವತ್ತು, ನಿನ್ನೆ, ನಾಳೆ',
        transliteration: 'Ivattu, ninne, nāḷe',
        english: 'Today, Yesterday, Tomorrow',
        context: 'Crucial time markers.',
        breakdown: [
          { word: 'ಇವತ್ತು', transliteration: 'ivattu', meaning: 'today' },
          { word: 'ನಿನ್ನೆ', transliteration: 'ninne', meaning: 'yesterday' },
          { word: 'ನಾಳೆ', transliteration: 'nāḷe', meaning: 'tomorrow' }
        ]
      },
      {
        id: 'p-8-2',
        kannada: 'ಸೋಮವಾರ, ಮಂಗಳವಾರ',
        transliteration: 'Sōmavāra, maṅgaḷavāra',
        english: 'Monday, Tuesday',
        context: 'First two work days.',
        breakdown: [{ word: 'ಸೋಮವಾರ', transliteration: 'sōmavāra', meaning: 'Monday' }]
      },
      {
        id: 'p-8-3',
        kannada: 'ಬುಧವಾರ, ಗುರುವಾರ, ಶುಕ್ರವಾರ',
        transliteration: 'Budhavāra, guruvāra, śukravāra',
        english: 'Wednesday, Thursday, Friday',
        context: 'Midweek and end of week.',
        breakdown: [{ word: 'ಶುಕ್ರವಾರ', transliteration: 'śukravāra', meaning: 'Friday' }]
      },
      {
        id: 'p-8-4',
        kannada: 'ಶನಿವಾರ ಮತ್ತು ಭಾನುವಾರ',
        transliteration: 'Śanivāra mattu bhānuvāra',
        english: 'Saturday and Sunday (Weekend)',
        context: 'Weekend days.',
        breakdown: [{ word: 'ಭಾನುವಾರ', transliteration: 'bhānuvāra', meaning: 'Sunday' }]
      },
      {
        id: 'p-8-5',
        kannada: 'ಈಗ ಸಮಯ ಎಷ್ಟು?',
        transliteration: 'Īga samaya eṣṭu?',
        english: 'What time is it now?',
        context: 'Asking for the clock time.',
        breakdown: [
          { word: 'ಈಗ', transliteration: 'īga', meaning: 'now' },
          { word: 'ಸಮಯ', transliteration: 'samaya', meaning: 'time' },
          { word: 'ಎಷ್ಟು', transliteration: 'eṣṭu', meaning: 'how much' }
        ]
      },
      {
        id: 'p-8-6',
        kannada: 'ಬೆಳಗ್ಗೆ, ಮಧ್ಯಾಹ್ನ, ಸಂಜೆ, ರಾತ್ರಿ',
        transliteration: 'Beḷagge, madhyāhna, sanje, rātri',
        english: 'Morning, Afternoon, Evening, Night',
        context: 'Four periods of the day.',
        breakdown: [
          { word: 'ಬೆಳಗ್ಗೆ', transliteration: 'beḷagge', meaning: 'morning' },
          { word: 'ರಾತ್ರಿ', transliteration: 'rātri', meaning: 'night' }
        ]
      }
    ]
  },
  {
    id: 'lesson-9',
    titleKannada: 'ಆಹಾರ, ಹಣ್ಣುಗಳು ಮತ್ತು ಪಾನೀಯಗಳು',
    titleEnglish: 'Food, Fruits & Beverages',
    category: 'food',
    difficulty: 'Beginner',
    description: 'Learn terms for staple Karnataka foods, fruits, filter coffee, and asking for meals.',
    durationMinutes: 10,
    phrasesCount: 6,
    objective: 'Order food, name South Indian delicacies, and state food preferences.',
    pronunciationTips: 'Filter coffee in Karnataka is universally known as "ಫಿಲ್ಟರ್ ಕಾಫಿ" (philṭar kāphi).',
    culturalNote: 'Traditional Karnataka breakfast includes Masale Dose, Bisi Bele Bath, Idli-Vade, and Ragi Mudde.',
    examples: [
      {
        speakerA: 'ತಿಂಡಿಗೆ ಏನು ಬೇಕು?',
        translitA: 'Tiṇḍige ēnu bēku?',
        englishA: 'What would you like for breakfast?',
        speakerB: 'ನನಗೆ ಒಂದು ಮಸಾಲೆ ದೋಸೆ ಮತ್ತು ಕಾಫಿ ಬೇಕು.',
        translitB: 'Nanage ondu masāle dōse mattu kāphi bēku.',
        englishB: 'I want one masala dosa and a coffee.'
      }
    ],
    interactiveExercise: {
      type: 'word_order',
      prompt: 'Arrange to say: "I want water"',
      targetText: 'ನನಗೆ ನೀರು ಬೇಕು',
      options: ['ಬೇಕು', 'ನೀರು', 'ನನಗೆ'],
      correctOrder: ['ನನಗೆ', 'ನೀರು', 'ಬೇಕು'],
      explanation: 'Dative pronoun (ನನಗೆ) + Object (ನೀರು) + Modal (ಬೇಕು).'
    },
    quiz: [
      {
        question: 'What is the word for "Food / Meal" in Kannada?',
        options: ['ಊಟ (Ūṭa)', 'ನೀರು (Nīru)', 'ಹಾಲು (Hālu)', 'ಹಣ್ಣು (Haṇṇu)'],
        correctIndex: 0,
        explanation: '"ಊಟ" (Ūṭa) means lunch, dinner, or meal.'
      }
    ],
    phrases: [
      {
        id: 'p-9-1',
        kannada: 'ತಿಂಡಿ ಮತ್ತು ಊಟ',
        transliteration: 'Tiṇḍi mattu ūṭa',
        english: 'Breakfast / Snack and Meal / Lunch',
        context: 'Tiṇḍi is light morning meal; Ūṭa is a full meal.',
        breakdown: [
          { word: 'ತಿಂಡಿ', transliteration: 'tiṇḍi', meaning: 'snack/breakfast' },
          { word: 'ಊಟ', transliteration: 'ūṭa', meaning: 'full meal' }
        ]
      },
      {
        id: 'p-9-2',
        kannada: 'ದೋಸೆ, ಇಡ್ಲಿ, ವಡೆ',
        transliteration: 'Dōse, iḍli, vaḍe',
        english: 'Dosa, Idli, Vada',
        context: 'Classic Darshini staples.',
        breakdown: [{ word: 'ದೋಸೆ', transliteration: 'dōse', meaning: 'Crispy crepe' }]
      },
      {
        id: 'p-9-3',
        kannada: 'ಕಾಫಿ ಮತ್ತು ಚಹಾ',
        transliteration: 'Kāphi mattu cahā',
        english: 'Coffee and Tea',
        context: 'Hot beverages.',
        breakdown: [{ word: 'ಕಾಫಿ', transliteration: 'kāphi', meaning: 'Coffee' }]
      },
      {
        id: 'p-9-4',
        kannada: 'ಹಾಲು ಮತ್ತು ಮೊಸರು',
        transliteration: 'Hālu mattu mosaru',
        english: 'Milk and Yogurt / Curd',
        context: 'Dairy staples.',
        breakdown: [
          { word: 'ಹಾಲು', transliteration: 'hālu', meaning: 'milk' },
          { word: 'ಮೊಸರು', transliteration: 'mosaru', meaning: 'curd' }
        ]
      },
      {
        id: 'p-9-5',
        kannada: 'ಬಾಳೆಹಣ್ಣು ಮತ್ತು ಸೇಬು',
        transliteration: 'Bāḷehaṇṇu mattu sēbu',
        english: 'Banana and Apple',
        context: 'Common fruits.',
        breakdown: [
          { word: 'ಬಾಳೆಹಣ್ಣು', transliteration: 'bāḷehaṇṇu', meaning: 'banana' },
          { word: 'ಸೇಬು', transliteration: 'sēbu', meaning: 'apple' }
        ]
      },
      {
        id: 'p-9-6',
        kannada: 'ಊಟ ತುಂಬಾ ರುಚಿಯಾಗಿದೆ',
        transliteration: 'Ūṭa tumbā ruciyāgide',
        english: 'The food is very delicious',
        context: 'Complimenting the cook or restaurant.',
        breakdown: [
          { word: 'ಊಟ', transliteration: 'ūṭa', meaning: 'food' },
          { word: 'ತುಂಬಾ', transliteration: 'tumbā', meaning: 'very' },
          { word: 'ರುಚಿಯಾಗಿದೆ', transliteration: 'ruciyāgide', meaning: 'is tasty' }
        ]
      }
    ]
  },
  {
    id: 'lesson-10',
    titleKannada: 'ಬೇಕು ಮತ್ತು ಬೇಡ (ಇಷ್ಟ ಮತ್ತು ಅನಿಷ್ಟ)',
    titleEnglish: 'Beku & Beda (Want & Do Not Want)',
    category: 'grammar',
    difficulty: 'Beginner',
    description: 'Master the two most important modal verbs in Kannada: "ಬೇಕು" (want/need) and "ಬೇಡ" (don\'t want).',
    durationMinutes: 12,
    phrasesCount: 6,
    objective: 'Express desires, refusal, and needs using dative case subjects (Nanage / Nimage).',
    pronunciationTips: '"Bēku" has an elongated "ē". "Bēḍa" has a retroflex "ḍ".',
    culturalNote: 'Politely declining with "ಬೇಡ, ಧನ್ಯವಾದಗಳು" (No, thank you) is gracious and respected.',
    examples: [
      {
        speakerA: 'ನಿಮಗೆ ಇನ್ನಷ್ಟು ಅನ್ನ ಬೇಕಾ?',
        translitA: 'Nimage innaṣṭu anna bēkā?',
        englishA: 'Do you want some more rice?',
        speakerB: 'ಸಾಕು, ನನಗೆ ಬೇಡ, ಧನ್ಯವಾದಗಳು.',
        translitB: 'Sāku, nanage bēḍa, dhan\'yavādagaḷu.',
        englishB: 'Enough, I don\'t want, thank you.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Say: "I do not want tea" -> "ನನಗೆ ಚಹಾ ___"',
      targetText: 'ಬೇಡ',
      options: ['ಬೇಕು', 'ಬೇಡ', 'ಇದೆ', 'ಇಲ್ಲ'],
      explanation: '"ಬೇಡ" means do not want.'
    },
    quiz: [
      {
        question: 'Which pronoun form is paired with "ಬೇಕು" to say "I want"?',
        options: ['ನಾನು (Nānu)', 'ನನ್ನ (Nanna)', 'ನನಗೆ (Nanage)', 'ನನ್ನಲ್ಲಿ (Nannalli)'],
        correctIndex: 2,
        explanation: 'In Kannada, modals like "ಬೇಕು" require the dative case pronoun "ನನಗೆ" (to me).'
      }
    ],
    phrases: [
      {
        id: 'p-10-1',
        kannada: 'ನನಗೆ ಬೇಕು',
        transliteration: 'Nanage bēku',
        english: 'I want / I need',
        context: 'Expressing personal desire.',
        breakdown: [
          { word: 'ನನಗೆ', transliteration: 'nanage', meaning: 'to me' },
          { word: 'ಬೇಕು', transliteration: 'bēku', meaning: 'is needed' }
        ]
      },
      {
        id: 'p-10-2',
        kannada: 'ನನಗೆ ಬೇಡ',
        transliteration: 'Nanage bēḍa',
        english: 'I do not want',
        context: 'Polite refusal.',
        breakdown: [
          { word: 'ನನಗೆ', transliteration: 'nanage', meaning: 'to me' },
          { word: 'ಬೇಡ', transliteration: 'bēḍa', meaning: 'is not needed' }
        ]
      },
      {
        id: 'p-10-3',
        kannada: 'ನಿಮಗೆ ಏನು ಬೇಕು?',
        transliteration: 'Nimage ēnu bēku?',
        english: 'What do you want? (Polite)',
        context: 'Asking a customer or guest.',
        breakdown: [
          { word: 'ನಿಮಗೆ', transliteration: 'nimage', meaning: 'to you' },
          { word: 'ಏನು', transliteration: 'ēnu', meaning: 'what' },
          { word: 'ಬೇಕು', transliteration: 'bēku', meaning: 'want' }
        ]
      },
      {
        id: 'p-10-4',
        kannada: 'ನನಗೆ ಸ್ವಲ್ಪ ನೀರು ಬೇಕು',
        transliteration: 'Nanage svalpa nīru bēku',
        english: 'I want a little water',
        context: 'Asking for water at a table.',
        breakdown: [
          { word: 'ಸ್ವಲ್ಪ', transliteration: 'svalpa', meaning: 'a little' },
          { word: 'ನೀರು', transliteration: 'nīru', meaning: 'water' }
        ]
      },
      {
        id: 'p-10-5',
        kannada: 'ಸಾಕು, ಬೇಡ',
        transliteration: 'Sāku, bēḍa',
        english: 'Enough, no more needed',
        context: 'When server is pouring extra food.',
        breakdown: [
          { word: 'ಸಾಕು', transliteration: 'sāku', meaning: 'enough' },
          { word: 'ಬೇಡ', transliteration: 'bēḍa', meaning: 'don\'t want' }
        ]
      },
      {
        id: 'p-10-6',
        kannada: 'ನಿಮಗೆ ಸಹಾಯ ಬೇಕೇ?',
        transliteration: 'Nimage sahāya bēkē?',
        english: 'Do you need help?',
        context: 'Offering assistance.',
        breakdown: [
          { word: 'ಸಹಾಯ', transliteration: 'sahāya', meaning: 'help' },
          { word: 'ಬೇಕೇ', transliteration: 'bēkē', meaning: 'do you need?' }
        ]
      }
    ]
  },
  {
    id: 'lesson-11',
    titleKannada: 'ಸರ್ವನಾಮಗಳು (ನಾನು, ನೀವು, ಅವನು, ಅವಳು)',
    titleEnglish: 'Pronouns in Kannada',
    category: 'grammar',
    difficulty: 'Beginner',
    description: 'Learn personal pronouns: I, you (informal & formal), he, she, it, we, and they.',
    durationMinutes: 12,
    phrasesCount: 6,
    objective: 'Distinguish informal "Nīnu" from respectful "Nīvu", and third-person pronouns.',
    pronunciationTips: 'Use "Nīvu" by default when addressing anyone unfamiliar.',
    culturalNote: 'Addressing elders as "Nīnu" is considered rude; "Nīvu" shows cultured respect.',
    examples: [
      {
        speakerA: 'ಅವರು ಯಾರು?',
        translitA: 'Avaru yāru?',
        englishA: 'Who is he/she (respectful)?',
        speakerB: 'ಅವರು ನಮ್ಮ ಶಿಕ್ಷಕರು.',
        translitB: 'Avaru namma śikṣakaru.',
        englishB: 'They/He is our teacher.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Respectful pronoun for "You": "___ ಹೇಗಿದ್ದೀರಿ?"',
      targetText: 'ನೀವು',
      options: ['ನೀನು', 'ನೀವು', 'ಅವನು', 'ನಾವು'],
      explanation: '"ನೀವು" is the respectful/formal pronoun for you.'
    },
    quiz: [
      {
        question: 'Which pronoun represents "We" in Kannada?',
        options: ['ನಾನು (Nānu)', 'ನಾವು (Nāvu)', 'ಅವರು (Avaru)', 'ಇವರು (Ivaru)'],
        correctIndex: 1,
        explanation: '"ನಾವು" (Nāvu) means we.'
      }
    ],
    phrases: [
      {
        id: 'p-11-1',
        kannada: 'ನಾನು ಮತ್ತು ನಾವು',
        transliteration: 'Nānu mattu nāvu',
        english: 'I and We',
        context: 'First-person singular and plural.',
        breakdown: [
          { word: 'ನಾನು', transliteration: 'nānu', meaning: 'I' },
          { word: 'ನಾವು', transliteration: 'nāvu', meaning: 'we' }
        ]
      },
      {
        id: 'p-11-2',
        kannada: 'ನೀನು ಮತ್ತು ನೀವು',
        transliteration: 'Nīnu mattu nīvu',
        english: 'You (informal) and You (polite/plural)',
        context: 'Crucial distinction for social etiquette.',
        breakdown: [
          { word: 'ನೀನು', transliteration: 'nīnu', meaning: 'you (informal)' },
          { word: 'ನೀವು', transliteration: 'nīvu', meaning: 'you (polite)' }
        ]
      },
      {
        id: 'p-11-3',
        kannada: 'ಅವನು ಮತ್ತು ಅವಳು',
        transliteration: 'Avanu mattu avaḷu',
        english: 'He (informal) and She (informal)',
        context: 'Third-person singular for peers/younger people.',
        breakdown: [
          { word: 'ಅವನು', transliteration: 'avanu', meaning: 'he' },
          { word: 'ಅವಳು', transliteration: 'avaḷu', meaning: 'she' }
        ]
      },
      {
        id: 'p-11-4',
        kannada: 'ಅವರು ಮತ್ತು ಇವರು',
        transliteration: 'Avaru mattu ivaru',
        english: 'He/She (honorific far) and He/She (honorific near)',
        context: 'Polite third person singular or plural.',
        breakdown: [
          { word: 'ಅವರು', transliteration: 'avaru', meaning: 'they/he/she (far)' },
          { word: 'ಇವರು', transliteration: 'ivaru', meaning: 'they/he/she (near)' }
        ]
      },
      {
        id: 'p-11-5',
        kannada: 'ಇದು ಮತ್ತು ಅದು',
        transliteration: 'Idu mattu adu',
        english: 'This (near) and That (far)',
        context: 'Neuter demonstrative pronouns for objects.',
        breakdown: [
          { word: 'ಇದು', transliteration: 'idu', meaning: 'this' },
          { word: 'ಅದು', transliteration: 'adu', meaning: 'that' }
        ]
      },
      {
        id: 'p-11-6',
        kannada: 'ಇವು ಮತ್ತು ಅವು',
        transliteration: 'Ivu mattu avu',
        english: 'These and Those (neuter plural)',
        context: 'Plural objects.',
        breakdown: [
          { word: 'ಇವು', transliteration: 'ivu', meaning: 'these' },
          { word: 'ಅವು', transliteration: 'avu', meaning: 'those' }
        ]
      }
    ]
  },
  {
    id: 'lesson-12',
    titleKannada: 'ಸ್ಥಳಗಳು (ಎಲ್ಲಿ, ಇಲ್ಲಿ, ಅಲ್ಲಿ)',
    titleEnglish: 'Locations & Directions (Elli, Illi, Alli)',
    category: 'travel',
    difficulty: 'Beginner',
    description: 'Learn where things are: here (illi), there (alli), and where (elli).',
    durationMinutes: 10,
    phrasesCount: 6,
    objective: 'Ask for locations and point out places in your vicinity.',
    pronunciationTips: 'Double consonants in "illi", "alli", "elli" must be sustained.',
    culturalNote: '"ಹತ್ತಿರ" (hattira) means near, while "ದೂರ" (dūra) means far.',
    examples: [
      {
        speakerA: 'ಮೆಟ್ರೋ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?',
        translitA: 'Meṭrō nildāṇa ellide?',
        englishA: 'Where is the metro station?',
        speakerB: 'ಅದು ಅಲ್ಲಿ ಹತ್ತಿರದಲ್ಲಿದೆ.',
        translitB: 'Adu alli hattiradallide.',
        englishB: 'It is right there nearby.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Word for "Here": "ದಯವಿಟ್ಟು ___ ಬನ್ನಿ"',
      targetText: 'ಇಲ್ಲಿ',
      options: ['ಇಲ್ಲಿ', 'ಅಲ್ಲಿ', 'ಎಲ್ಲಿ', 'ಹೇಗೆ'],
      explanation: '"ಇಲ್ಲಿ" (illi) means here.'
    },
    quiz: [
      {
        question: 'Which word means "Where" in Kannada?',
        options: ['ಇಲ್ಲಿ (Illi)', 'ಅಲ್ಲಿ (Alli)', 'ಎಲ್ಲಿ (Elli)', 'ಯಾವಾಗ (Yāvāga)'],
        correctIndex: 2,
        explanation: '"ಎಲ್ಲಿ" (Elli) is the interrogative word for "where".'
      }
    ],
    phrases: [
      {
        id: 'p-12-1',
        kannada: 'ಎಲ್ಲಿ?',
        transliteration: 'Elli?',
        english: 'Where?',
        context: 'Universal question for location.',
        breakdown: [{ word: 'ಎಲ್ಲಿ', transliteration: 'elli', meaning: 'Where' }]
      },
      {
        id: 'p-12-2',
        kannada: 'ಇಲ್ಲಿ ಮತ್ತು ಅಲ್ಲಿ',
        transliteration: 'Illi mattu alli',
        english: 'Here and There',
        context: 'Relative proximity.',
        breakdown: [
          { word: 'ಇಲ್ಲಿ', transliteration: 'illi', meaning: 'here' },
          { word: 'ಅಲ್ಲಿ', transliteration: 'alli', meaning: 'there' }
        ]
      },
      {
        id: 'p-12-3',
        kannada: 'ಹತ್ತಿರ ಮತ್ತು ದೂರ',
        transliteration: 'Hattira mattu dūra',
        english: 'Near and Far',
        context: 'Distance indicators.',
        breakdown: [
          { word: 'ಹತ್ತಿರ', transliteration: 'hattira', meaning: 'near' },
          { word: 'ದೂರ', transliteration: 'dūra', meaning: 'far' }
        ]
      },
      {
        id: 'p-12-4',
        kannada: 'ಮುಂದೆ ಮತ್ತು ಹಿಂದೆ',
        transliteration: 'Munde mattu hinde',
        english: 'In front / Ahead and Behind / Back',
        context: 'Spatial directions.',
        breakdown: [
          { word: 'ಮುಂದೆ', transliteration: 'munde', meaning: 'ahead' },
          { word: 'ಹಿಂದೆ', transliteration: 'hinde', meaning: 'behind' }
        ]
      },
      {
        id: 'p-12-5',
        kannada: 'ಬಲಗಡೆ ಮತ್ತು ಎಡಗಡೆ',
        transliteration: 'Balagaḍe mattu eḍagaḍe',
        english: 'Right side and Left side',
        context: 'Turning directions for navigation.',
        breakdown: [
          { word: 'ಬಲಗಡೆ', transliteration: 'balagaḍe', meaning: 'right side' },
          { word: 'ಎಡಗಡೆ', transliteration: 'eḍagaḍe', meaning: 'left side' }
        ]
      },
      {
        id: 'p-12-6',
        kannada: 'ನೇರವಾಗಿ ಹೋಗಿ',
        transliteration: 'Nēravāgi hōgi',
        english: 'Go straight',
        context: 'Telling a driver to proceed straight ahead.',
        breakdown: [
          { word: 'ನೇರವಾಗಿ', transliteration: 'nēravāgi', meaning: 'straight' },
          { word: 'ಹೋಗಿ', transliteration: 'hōgi', meaning: 'go (polite)' }
        ]
      }
    ]
  },
  {
    id: 'lesson-13',
    titleKannada: 'ಖರೀದಿ ಮತ್ತು ಬೆಲೆ (ಎಷ್ಟು?)',
    titleEnglish: 'Shopping & Prices (How Much?)',
    category: 'shopping',
    difficulty: 'Beginner',
    description: 'Learn to ask the price of items, negotiate gently, and pay bills.',
    durationMinutes: 11,
    phrasesCount: 6,
    objective: 'Inquire about costs, ask for discounts, and complete shopping purchases.',
    pronunciationTips: '"Idara bele eṣṭu?" (How much is the price of this?) is the key shopping question.',
    culturalNote: 'In local markets, polite negotiation starting with "ಸ್ವಲ್ಪ ಕಮ್ಮಿ ಮಾಡಿ" (reduce a little) is common.',
    examples: [
      {
        speakerA: 'ಈ ಸೇಬಿನ ಬೆಲೆ ಎಷ್ಟು?',
        translitA: 'Ī sēbina bele eṣṭu?',
        englishA: 'How much is the price of this apple?',
        speakerB: 'ಒಂದು ಕೆಜಿಗೆ ನೂರು ರೂಪಾಯಿ.',
        translitB: 'Ondu kejige nūru rūpāyi.',
        englishB: 'One hundred rupees per kilogram.'
      }
    ],
    interactiveExercise: {
      type: 'word_order',
      prompt: 'Arrange to ask: "What is the price of this?"',
      targetText: 'ಇದರ ಬೆಲೆ ಎಷ್ಟು?',
      options: ['ಎಷ್ಟು', 'ಬೆಲೆ', 'ಇದರ'],
      correctOrder: ['ಇದರ', 'ಬೆಲೆ', 'ಎಷ್ಟು'],
      explanation: 'Genitive (ಇದರ - of this) + Noun (ಬೆಲೆ - price) + Question word (ಎಷ್ಟು).'
    },
    quiz: [
      {
        question: 'How do you say "How much?" in Kannada?',
        options: ['ಯಾವಾಗ (Yāvāga)', 'ಎಷ್ಟು (Eṣṭu)', 'ಯಾಕೆ (Yāke)', 'ಹೇಗೆ (Hēge)'],
        correctIndex: 1,
        explanation: '"ಎಷ್ಟು" (Eṣṭu) means how much / how many.'
      }
    ],
    phrases: [
      {
        id: 'p-13-1',
        kannada: 'ಇದರ ಬೆಲೆ ಎಷ್ಟು?',
        transliteration: 'Idara bele eṣṭu?',
        english: 'How much does this cost?',
        context: 'Standard shopping question.',
        breakdown: [
          { word: 'ಇದರ', transliteration: 'idara', meaning: 'of this' },
          { word: 'ಬೆಲೆ', transliteration: 'bele', meaning: 'price' },
          { word: 'ಎಷ್ಟು', transliteration: 'eṣṭu', meaning: 'how much' }
        ]
      },
      {
        id: 'p-13-2',
        kannada: 'ತುಂಬಾ ಜಾಸ್ತಿ ಆಯಿತು',
        transliteration: 'Tumbā jāsti āyitu',
        english: 'That is too expensive / too much',
        context: 'Stating a price is steep.',
        breakdown: [
          { word: 'ತುಂಬಾ', transliteration: 'tumbā', meaning: 'very' },
          { word: 'ಜಾಸ್ತಿ', transliteration: 'jāsti', meaning: 'more / excess' }
        ]
      },
      {
        id: 'p-13-3',
        kannada: 'ಸ್ವಲ್ಪ ಕಮ್ಮಿ ಮಾಡಿ',
        transliteration: 'Svalpa kammi māḍi',
        english: 'Please reduce the price a little',
        context: 'Gentle bargaining phrase.',
        breakdown: [
          { word: 'ಸ್ವಲ್ಪ', transliteration: 'svalpa', meaning: 'a little' },
          { word: 'ಕಮ್ಮಿ', transliteration: 'kammi', meaning: 'less' },
          { word: 'ಮಾಡಿ', transliteration: 'māḍi', meaning: 'make / do (polite)' }
        ]
      },
      {
        id: 'p-13-4',
        kannada: 'ಒಂದು ಕೆಜಿ ಕೊಡಿ',
        transliteration: 'Ondu keji koḍi',
        english: 'Please give one kilogram',
        context: 'Ordering fruits/vegetables.',
        breakdown: [
          { word: 'ಒಂದು', transliteration: 'ondu', meaning: 'one' },
          { word: 'ಕೊಡಿ', transliteration: 'koḍi', meaning: 'give (polite)' }
        ]
      },
      {
        id: 'p-13-5',
        kannada: 'ಆನ್‌ಲೈನ್ ಪಾವತಿ (UPI) ಇದೆಯಾ?',
        transliteration: 'Online pāvati (UPI) ideyā?',
        english: 'Is online / UPI payment available?',
        context: 'Inquiring about QR code / phone payment.',
        breakdown: [
          { word: 'ಪಾವತಿ', transliteration: 'pāvati', meaning: 'payment' },
          { word: 'ಇದೆಯಾ', transliteration: 'ideyā', meaning: 'is it there?' }
        ]
      },
      {
        id: 'p-13-6',
        kannada: 'ಬಿಲ್ ಕೊಡಿ',
        transliteration: 'Bil koḍi',
        english: 'Please give the bill',
        context: 'Finishing a meal or purchase.',
        breakdown: [
          { word: 'ಬಿಲ್', transliteration: 'bil', meaning: 'bill' },
          { word: 'ಕೊಡಿ', transliteration: 'koḍi', meaning: 'give' }
        ]
      }
    ]
  },
  {
    id: 'lesson-14',
    titleKannada: 'ಹೌದು, ಇಲ್ಲ ಮತ್ತು ಅಲ್ಲ (ಸಮ್ಮತಿ ಮತ್ತು ನಿರಾಕರಣೆ)',
    titleEnglish: 'Haudu, Illa & Alla (Yes, No, Not)',
    category: 'grammar',
    difficulty: 'Beginner',
    description: 'Master the crucial difference between "ಇಲ್ಲ" (absence / does not exist) and "ಅಲ್ಲ" (identity negation / not that).',
    durationMinutes: 11,
    phrasesCount: 6,
    objective: 'Affirm and deny correctly without confusing "Illa" and "Alla".',
    pronunciationTips: '"Haudu" is affirmative; "Illa" denotes absence; "Alla" denotes identity negation.',
    culturalNote: 'Using "Alla" when correcting someone\'s misidentification shows precise Kannada grammar mastery.',
    examples: [
      {
        speakerA: 'ಇದು ನಿಮ್ಮ ಕಾರಾ?',
        translitA: 'Idu nimma kārā?',
        englishA: 'Is this your car?',
        speakerB: 'ಇಲ್ಲ, ಇದು ನನ್ನ ಕಾರಲ್ಲ (ಕಾರು + ಅಲ್ಲ).',
        translitB: 'Illa, idu nanna kāralla (kāru + alla).',
        englishB: 'No, this is not my car.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Identity negation: "ಅವರು ವೈದ್ಯರಲ್ಲ (ವೈದ್ಯರು + ___)"',
      targetText: 'ಅಲ್ಲ',
      options: ['ಇಲ್ಲ', 'ಅಲ್ಲ', 'ಹೌದು', 'ಬೇಡ'],
      explanation: '"ಅಲ್ಲ" negates identity ("is not a doctor"). "ಇಲ್ಲ" negates existence ("there is no doctor").'
    },
    quiz: [
      {
        question: 'Which word means affirmative "Yes" in Kannada?',
        options: ['ಇಲ್ಲ (Illa)', 'ಹೌದು (Haudu)', 'ಅಲ್ಲ (Alla)', 'ಯಾಕೆ (Yāke)'],
        correctIndex: 1,
        explanation: '"ಹೌದು" (Haudu) is the formal affirmative word for "Yes".'
      }
    ],
    phrases: [
      {
        id: 'p-14-1',
        kannada: 'ಹೌದು',
        transliteration: 'Haudu',
        english: 'Yes (Affirmative)',
        context: 'Standard confirmation.',
        breakdown: [{ word: 'ಹೌದು', transliteration: 'haudu', meaning: 'Yes' }]
      },
      {
        id: 'p-14-2',
        kannada: 'ಇಲ್ಲ',
        transliteration: 'Illa',
        english: 'No / Does not exist / None',
        context: 'Negates existence or possession.',
        breakdown: [{ word: 'ಇಲ್ಲ', transliteration: 'illa', meaning: 'No / absent' }]
      },
      {
        id: 'p-14-3',
        kannada: 'ಅಲ್ಲ',
        transliteration: 'Alla',
        english: 'Not (Negation of identity / predicate)',
        context: 'Negates what an object or person is.',
        breakdown: [{ word: 'ಅಲ್ಲ', transliteration: 'alla', meaning: 'is not' }]
      },
      {
        id: 'p-14-4',
        kannada: 'ಖಂಡಿತವಾಗಿ',
        transliteration: 'Khaṇḍitavāgi',
        english: 'Certainly / Definitely',
        context: 'Strong enthusiastic agreement.',
        breakdown: [{ word: 'ಖಂಡಿತವಾಗಿ', transliteration: 'khaṇḍitavāgi', meaning: 'definitely' }]
      },
      {
        id: 'p-14-5',
        kannada: 'ನನಗೆ ಗೊತ್ತಿಲ್ಲ',
        transliteration: 'Nanage gottilla',
        english: 'I do not know',
        context: 'Expressing lack of knowledge.',
        breakdown: [
          { word: 'ನನಗೆ', transliteration: 'nanage', meaning: 'to me' },
          { word: 'ಗೊತ್ತಿಲ್ಲ', transliteration: 'gottilla', meaning: 'is unknown' }
        ]
      },
      {
        id: 'p-14-6',
        kannada: 'ಸರಿ, ಆಯಿತು',
        transliteration: 'Sari, āyitu',
        english: 'Okay, understood / Done',
        context: 'Casual everyday agreement.',
        breakdown: [
          { word: 'ಸರಿ', transliteration: 'sari', meaning: 'okay / right' },
          { word: 'ಆಯಿತು', transliteration: 'āyitu', meaning: 'became / done' }
        ]
      }
    ]
  },
  {
    id: 'lesson-15',
    titleKannada: 'ದೈನಂದಿನ ದಿನಚರಿ (ಏಳುವುದು, ತಿನ್ನುವುದು, ಮಲಗುವುದು)',
    titleEnglish: 'Daily Routine & Basic Verbs',
    category: 'daily',
    difficulty: 'Beginner',
    description: 'Describe what you do from waking up in the morning to sleeping at night.',
    durationMinutes: 12,
    phrasesCount: 6,
    objective: 'Narrate your daily habits using simple first-person present verb endings.',
    pronunciationTips: 'First-person present habitual ends in "-ttēne" (e.g., ēḷuttēne, hōguttēne).',
    culturalNote: 'Waking up during Brahma Muhurta (early morning) is praised in traditional Karnataka households.',
    examples: [
      {
        speakerA: 'ನೀವು ಎಷ್ಟು ಗಂಟೆಗೆ ಏಳುತ್ತೀರಿ?',
        translitA: 'Nīvu eṣṭu gaṇṭege ēḷuttīri?',
        englishA: 'At what time do you wake up?',
        speakerB: 'ನಾನು ಬೆಳಗ್ಗೆ 6 ಗಂಟೆಗೆ ಏಳುತ್ತೇನೆ.',
        translitB: 'Nānu beḷagge 6 gaṇṭege ēḷuttēne.',
        englishB: 'I wake up at 6 AM in the morning.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'First-person verb ending: "ನಾನು ಕೆಲಸಕ್ಕೆ ಹೋಗು___"',
      targetText: 'ತ್ತೇನೆ',
      options: ['ತ್ತೇನೆ', 'ತ್ತೀರಿ', 'ತ್ತಾನೆ', 'ತ್ತಾರೆ'],
      explanation: 'First-person singular "ನಾನು" pairs with "-ತ್ತೇನೆ" (-ttēne).'
    },
    quiz: [
      {
        question: 'What does "ಮಲಗುತ್ತೇನೆ" (Malaguttēne) mean?',
        options: ['I wake up', 'I eat food', 'I sleep / go to bed', 'I read a book'],
        correctIndex: 2,
        explanation: '"ಮಲಗುತ್ತೇನೆ" means "I sleep / go to bed".'
      }
    ],
    phrases: [
      {
        id: 'p-15-1',
        kannada: 'ನಾನು ಬೆಳಗ್ಗೆ ಬೇಗ ಏಳುತ್ತೇನೆ',
        transliteration: 'Nānu beḷagge bēga ēḷuttēne',
        english: 'I wake up early in the morning',
        context: 'Starting your day.',
        breakdown: [
          { word: 'ಬೆಳಗ್ಗೆ', transliteration: 'beḷagge', meaning: 'morning' },
          { word: 'ಬೇಗ', transliteration: 'bēga', meaning: 'early / fast' },
          { word: 'ಏಳುತ್ತೇನೆ', transliteration: 'ēḷuttēne', meaning: 'I wake up' }
        ]
      },
      {
        id: 'p-15-2',
        kannada: 'ಸ್ನಾನ ಮಾಡುತ್ತೇನೆ',
        transliteration: 'Snāna māḍuttēne',
        english: 'I take a bath',
        context: 'Morning hygiene.',
        breakdown: [
          { word: 'ಸ್ನಾನ', transliteration: 'snāna', meaning: 'bath' },
          { word: 'ಮಾಡುತ್ತೇನೆ', transliteration: 'māḍuttēne', meaning: 'I do' }
        ]
      },
      {
        id: 'p-15-3',
        kannada: 'ತಿಂಡಿ ತಿನ್ನುತ್ತೇನೆ',
        transliteration: 'Tiṇḍi tinnuttēne',
        english: 'I eat breakfast',
        context: 'Morning meal.',
        breakdown: [
          { word: 'ತಿಂಡಿ', transliteration: 'tiṇḍi', meaning: 'breakfast' },
          { word: 'ತಿನ್ನುತ್ತೇನೆ', transliteration: 'tinnuttēne', meaning: 'I eat' }
        ]
      },
      {
        id: 'p-15-4',
        kannada: 'ಕಚೇರಿಗೆ / ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ',
        transliteration: 'Kacērige / śālege hōguttēne',
        english: 'I go to office / school',
        context: 'Commuting to daily work.',
        breakdown: [
          { word: 'ಕಚೇರಿಗೆ', transliteration: 'kacērige', meaning: 'to office' },
          { word: 'ಹೋಗುತ್ತೇನೆ', transliteration: 'hōguttēne', meaning: 'I go' }
        ]
      },
      {
        id: 'p-15-5',
        kannada: 'ಕನ್ನಡ ಕಲಿಯುತ್ತೇನೆ',
        transliteration: 'Kannaḍa kaliyuttēne',
        english: 'I learn Kannada',
        context: 'Study routine.',
        breakdown: [
          { word: 'ಕನ್ನಡ', transliteration: 'kannaḍa', meaning: 'Kannada' },
          { word: 'ಕಲಿಯುತ್ತೇನೆ', transliteration: 'kaliyuttēne', meaning: 'I learn' }
        ]
      },
      {
        id: 'p-15-6',
        kannada: 'ರಾತ್ರಿ 10 ಗಂಟೆಗೆ ಮಲಗುತ್ತೇನೆ',
        transliteration: 'Rātri 10 gaṇṭege malaguttēne',
        english: 'I go to bed at 10 PM',
        context: 'Concluding your day.',
        breakdown: [
          { word: 'ರಾತ್ರಿ', transliteration: 'rātri', meaning: 'night' },
          { word: 'ಮಲಗುತ್ತೇನೆ', transliteration: 'malaguttēne', meaning: 'I sleep' }
        ]
      }
    ]
  },

  // =========================================================================
  // LEVEL 2: INTERMEDIATE (Lessons 16 - 30)
  // =========================================================================
  {
    id: 'lesson-16',
    titleKannada: 'ಮುಖ್ಯ ಕ್ರಿಯಾಪದಗಳು ಮತ್ತು ಧಾತುಗಳು',
    titleEnglish: 'Core Verbs & Verb Roots',
    category: 'grammar',
    difficulty: 'Intermediate',
    description: 'Master high-frequency verb roots: māḍu (do), hōgu (go), bā (come), kodu (give), tago (take).',
    durationMinutes: 14,
    phrasesCount: 6,
    objective: 'Derive imperative and polite forms from underlying verb roots.',
    pronunciationTips: 'Adding "-i" to verb roots creates the polite imperative: māḍu -> māḍi; bā -> banni.',
    culturalNote: 'Irregular polite imperatives like "ಬನ್ನಿ" (banni - come) and "ಕೊಡಿ" (kodi - give) reflect Kannada courtesy.',
    examples: [
      {
        speakerA: 'ದಯವಿಟ್ಟು ಒಳಗೆ ಬನ್ನಿ ಮತ್ತು ಕುಳಿತುಕೊಳ್ಳಿ.',
        translitA: 'Dayaviṭṭu oḷage banni mattu kuḷitukoḷḷi.',
        englishA: 'Please come inside and take a seat.',
        speakerB: 'ಧನ್ಯವಾದಗಳು, ನಮಸ್ಕಾರ.',
        translitB: 'Dhan\'yavādagaḷu, namaskāra.',
        englishB: 'Thank you, hello.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Polite command for "Come": "ದಯವಿಟ್ಟು ಇಲ್ಲಿ ___"',
      targetText: 'ಬನ್ನಿ',
      options: ['ಬಾ', 'ಬನ್ನಿ', 'ಹೋಗು', 'ಮಾಡು'],
      explanation: '"ಬನ್ನi" is the polite honorific command for "Come".'
    },
    quiz: [
      {
        question: 'What is the polite imperative form of the verb "ಹೋಗು" (Hōgu - to go)?',
        options: ['ಹೋಗಿ (Hōgi)', 'ಬನ್ನಿ (Banni)', 'ಮಾಡಿ (Māḍi)', 'ಕೊಡಿ (Koḍi)'],
        correctIndex: 0,
        explanation: 'Adding "-i" produces the polite request "ಹೋಗಿ" (Please go).'
      }
    ],
    phrases: [
      {
        id: 'p-16-1',
        kannada: 'ಮಾಡು -> ಮಾಡಿ',
        transliteration: 'Māḍu -> Māḍi',
        english: 'Do (informal) -> Please do (polite)',
        context: 'Action verb root.',
        breakdown: [{ word: 'ಮಾಡು/ಮಾಡಿ', transliteration: 'māḍu/māḍi', meaning: 'To do' }]
      },
      {
        id: 'p-16-2',
        kannada: 'ಬಾ -> ಬನ್ನಿ',
        transliteration: 'Bā -> Banni',
        english: 'Come (informal) -> Please come (polite)',
        context: 'Welcoming someone.',
        breakdown: [{ word: 'ಬಾ/ಬನ್ನಿ', transliteration: 'bā/banni', meaning: 'To come' }]
      },
      {
        id: 'p-16-3',
        kannada: 'ಹೋಗು -> ಹೋಗಿ',
        transliteration: 'Hōgu -> Hōgi',
        english: 'Go (informal) -> Please go (polite)',
        context: 'Directional motion.',
        breakdown: [{ word: 'ಹೋಗು/ಹೋಗಿ', transliteration: 'hōgu/hōgi', meaning: 'To go' }]
      },
      {
        id: 'p-16-4',
        kannada: 'ಕೊಡು -> ಕೊಡಿ',
        transliteration: 'Koḍu -> Koḍi',
        english: 'Give (informal) -> Please give (polite)',
        context: 'Handing over items.',
        breakdown: [{ word: 'ಕೊಡು/ಕೊಡಿ', transliteration: 'koḍu/koḍi', meaning: 'To give' }]
      },
      {
        id: 'p-16-5',
        kannada: 'ತಗೋ -> ತಗೊಳ್ಳಿ',
        transliteration: 'Tagō -> Tagoḷḷi',
        english: 'Take (informal) -> Please take (polite)',
        context: 'Receiving something.',
        breakdown: [{ word: 'ತಗೋ/ತಗೊಳ್ಳಿ', transliteration: 'tagō/tagoḷḷi', meaning: 'To take' }]
      },
      {
        id: 'p-16-6',
        kannada: 'ನೋಡು -> ನೋಡಿ',
        transliteration: 'Nōḍu -> Nōḍi',
        english: 'Look / Watch (informal) -> Please look (polite)',
        context: 'Directing attention.',
        breakdown: [{ word: 'ನೋಡು/ನೋಡಿ', transliteration: 'nōḍu/nōḍi', meaning: 'To see' }]
      }
    ]
  },
  {
    id: 'lesson-17',
    titleKannada: 'ಪ್ರಸ್ತುತ ನಿರಂತರ ಕಾಲ (ಮಾಡುತ್ತಿದ್ದೇನೆ, ಹೋಗುತ್ತಿದ್ದಾನೆ)',
    titleEnglish: 'Present Continuous Tense',
    category: 'grammar',
    difficulty: 'Intermediate',
    description: 'Learn how to describe ongoing actions happening right now using "-uttiddēne".',
    durationMinutes: 13,
    phrasesCount: 6,
    objective: 'Form present continuous statements across different subjects.',
    pronunciationTips: 'Combine verb root + "utt" + present auxiliary: māḍu + utt + iddēne = māḍuttiddēne.',
    culturalNote: 'In Kannada, ongoing state verbs convey immediacy and responsiveness.',
    examples: [
      {
        speakerA: 'ನೀವು ಈಗ ಏನು ಮಾಡುತ್ತಿದ್ದೀರಿ?',
        translitA: 'Nīvu īga ēnu māḍuttiddīri?',
        englishA: 'What are you doing right now?',
        speakerB: 'ನಾನು ಕನ್ನಡ ಅಭ್ಯಾಸ ಮಾಡುತ್ತಿದ್ದೇನೆ.',
        translitB: 'Nānu kannada abhyāsa māḍuttiddēne.',
        englishB: 'I am practicing Kannada.'
      }
    ],
    interactiveExercise: {
      type: 'word_order',
      prompt: 'Arrange to say: "I am reading a book"',
      targetText: 'ನಾನು ಪುಸ್ತಕ ಓದುತ್ತಿದ್ದೇನೆ',
      options: ['ಓದುತ್ತಿದ್ದೇನೆ', 'ಪುಸ್ತಕ', 'ನಾನು'],
      correctOrder: ['ನಾನು', 'ಪುಸ್ತಕ', 'ಓದುತ್ತಿದ್ದೇನೆ'],
      explanation: 'Subject (ನಾನು) + Object (ಪುಸ್ತಕ) + Continuous verb (ಓದುತ್ತಿದ್ದೇನೆ).'
    },
    quiz: [
      {
        question: 'Which suffix marks the present continuous for "He is going"?',
        options: ['ಹೋಗುತ್ತಾನೆ (Hōguttāne)', 'ಹೋಗುತ್ತಿದ್ದಾನೆ (Hōguttiddāne)', 'ಹೋದನು (Hōdanu)', 'ಹೋಗು (Hōgu)'],
        correctIndex: 1,
        explanation: '"ಹೋಗುತ್ತಿದ್ದಾನೆ" indicates he is actively going right now.'
      }
    ],
    phrases: [
      {
        id: 'p-17-1',
        kannada: 'ನಾನು ಮಾಡುತ್ತಿದ್ದೇನೆ',
        transliteration: 'Nānu māḍuttiddēne',
        english: 'I am doing',
        context: 'Action in progress by speaker.',
        breakdown: [{ word: 'ಮಾಡುತ್ತಿದ್ದೇನೆ', transliteration: 'māḍuttiddēne', meaning: 'am doing' }]
      },
      {
        id: 'p-17-2',
        kannada: 'ನೀವು ಏನು ಮಾಡುತ್ತಿದ್ದೀರಿ?',
        transliteration: 'Nīvu ēnu māḍuttiddīri?',
        english: 'What are you doing?',
        context: 'Polite inquiry about current activity.',
        breakdown: [
          { word: 'ಏನು', transliteration: 'ēnu', meaning: 'what' },
          { word: 'ಮಾಡುತ್ತಿದ್ದೀರಿ', transliteration: 'māḍuttiddīri', meaning: 'are you doing' }
        ]
      },
      {
        id: 'p-17-3',
        kannada: 'ಅವನು ಊಟ ಮಾಡುತ್ತಿದ್ದಾನೆ',
        transliteration: 'Avanu ūṭa māḍuttiddāne',
        english: 'He is having his meal',
        context: 'Describing third person male.',
        breakdown: [{ word: 'ಮಾಡುತ್ತಿದ್ದಾನೆ', transliteration: 'māḍuttiddāne', meaning: 'he is doing' }]
      },
      {
        id: 'p-17-4',
        kannada: 'ಅವಳು ಬರುತ್ತಿದ್ದಾಳೆ',
        transliteration: 'Avaḷu baruttiddāḷe',
        english: 'She is coming',
        context: 'Third person female continuous.',
        breakdown: [{ word: 'ಬರುತ್ತಿದ್ದಾಳೆ', transliteration: 'baruttiddāḷe', meaning: 'she is coming' }]
      },
      {
        id: 'p-17-5',
        kannada: 'ನಾವು ಕಾಯುತ್ತಿದ್ದೇವೆ',
        transliteration: 'Nāvu kāyuttiddēve',
        english: 'We are waiting',
        context: 'First person plural continuous.',
        breakdown: [
          { word: 'ನಾವು', transliteration: 'nāvu', meaning: 'we' },
          { word: 'ಕಾಯುತ್ತಿದ್ದೇವೆ', transliteration: 'kāyuttiddēve', meaning: 'are waiting' }
        ]
      },
      {
        id: 'p-17-6',
        kannada: 'ಮಳೆ ಬರುತ್ತಿದೆ',
        transliteration: 'Maḷe baruttide',
        english: 'It is raining',
        context: 'Weather in progress (neuter).',
        breakdown: [
          { word: 'ಮಳೆ', transliteration: 'maḷe', meaning: 'rain' },
          { word: 'ಬರುತ್ತಿದೆ', transliteration: 'baruttide', meaning: 'is coming' }
        ]
      }
    ]
  },
  {
    id: 'lesson-18',
    titleKannada: 'ಭೂತಕಾಲ (ಮಾಡಿದೆ, ಹೋದೆ, ಬಂದೆ)',
    titleEnglish: 'Past Tense in Kannada',
    category: 'grammar',
    difficulty: 'Intermediate',
    description: 'Learn how to talk about completed events in the past: "I did", "I went", "I came".',
    durationMinutes: 14,
    phrasesCount: 6,
    objective: 'Narrate past events and verify past actions.',
    pronunciationTips: 'Notice past markers: "d" or "id" followed by person ending (e.g., māḍ-ide = I did).',
    culturalNote: 'Checking "ಊಟ ಆಯ್ತಾ?" (Ūṭa āytā? - Had meals?) is the quintessential warm Kannada greeting.',
    examples: [
      {
        speakerA: 'ನಿನ್ನೆ ನೀವು ಎಲ್ಲಿಗೆ ಹೋಗಿದ್ದಿರಿ?',
        translitA: 'Ninne nīvu ellige hōgiddiri?',
        englishA: 'Where had you gone yesterday?',
        speakerB: 'ನಾನು ಮೈಸೂರಿಗೆ ಹೋಗಿದ್ದೆ.',
        translitB: 'Nānu maisūrige hōgidde.',
        englishB: 'I had gone to Mysuru.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Past tense of "I came": "ನಾನು ಮನೆಗೆ ___"',
      targetText: 'ಬಂದೆ',
      options: ['ಬಂದೆ', 'ಬರುತ್ತೇನೆ', 'ಹೋದೆ', 'ನೋಡಿದೆ'],
      explanation: '"ಬಂದೆ" (bande) is the first person past form of to come.'
    },
    quiz: [
      {
        question: 'What does "ಊಟ ಆಯ್ತಾ?" (Ūṭa āytā?) literally ask?',
        options: ['What did you eat?', 'Did the meal happen? / Had food?', 'Where is the restaurant?', 'Is the food hot?'],
        correctIndex: 1,
        explanation: '"ಊಟ ಆಯ್ತಾ?" is a beloved friendly inquiry meaning "Had your meal?".'
      }
    ],
    phrases: [
      {
        id: 'p-18-1',
        kannada: 'ನಾನು ಮಾಡಿದೆ',
        transliteration: 'Nānu māḍide',
        english: 'I did / I made',
        context: 'First person past action.',
        breakdown: [{ word: 'ಮಾಡಿದೆ', transliteration: 'māḍide', meaning: 'did' }]
      },
      {
        id: 'p-18-2',
        kannada: 'ನಾನು ಹೋದೆ',
        transliteration: 'Nānu hōde',
        english: 'I went',
        context: 'First person motion in past.',
        breakdown: [{ word: 'ಹೋದೆ', transliteration: 'hōde', meaning: 'went' }]
      },
      {
        id: 'p-18-3',
        kannada: 'ಅವರು ಬಂದರು',
        transliteration: 'Avaru bandaru',
        english: 'They / He (honorific) came',
        context: 'Polite third person arrival.',
        breakdown: [{ word: 'ಬಂದರು', transliteration: 'bandaru', meaning: 'came' }]
      },
      {
        id: 'p-18-4',
        kannada: 'ನೀವು ನೋಡಿದಿರಾ?',
        transliteration: 'Nīvu nōḍidirā?',
        english: 'Did you see? / Have you seen?',
        context: 'Past question.',
        breakdown: [{ word: 'ನೋಡಿದಿರಾ', transliteration: 'nōḍidirā', meaning: 'did you see?' }]
      },
      {
        id: 'p-18-5',
        kannada: 'ಊಟ ಆಯ್ತಾ?',
        transliteration: 'Ūṭa āytā?',
        english: 'Did you have food? / Has meal concluded?',
        context: 'Everyday friendly check-in.',
        breakdown: [
          { word: 'ಊಟ', transliteration: 'ūṭa', meaning: 'meal' },
          { word: 'ಆಯ್ತಾ', transliteration: 'āytā', meaning: 'did it finish?' }
        ]
      },
      {
        id: 'p-18-6',
        kannada: 'ಕೆಲಸ ಮುಗಿಯಿತು',
        transliteration: 'Kelasa mugiyitu',
        english: 'The work got completed / finished',
        context: 'Neuter past completion.',
        breakdown: [
          { word: 'ಕೆಲಸ', transliteration: 'kelasa', meaning: 'work' },
          { word: 'ಮುಗಿಯಿತು', transliteration: 'mugiyitu', meaning: 'finished' }
        ]
      }
    ]
  },
  {
    id: 'lesson-19',
    titleKannada: 'ಭವಿಷ್ಯತ್ಕಾಲ (ಮಾಡುತ್ತೇನೆ, ಹೋಗುವೆವು)',
    titleEnglish: 'Future Tense & Intentions',
    category: 'grammar',
    difficulty: 'Intermediate',
    description: 'Learn to discuss tomorrow, upcoming plans, and promises using future tense forms.',
    durationMinutes: 12,
    phrasesCount: 6,
    objective: 'Express future commitments, schedules, and promises.',
    pronunciationTips: 'Colloquially, present-future verbs share forms with "-ttēne" or "-v-".',
    culturalNote: '"ಖಂಡಿತ ಬರುತ್ತೇನೆ" (I will definitely come) is a gracious social commitment.',
    examples: [
      {
        speakerA: 'ನಾಳೆ ನೀವು ಬರುತ್ತೀರಾ?',
        translitA: 'Nāḷe nīvu baruttīrā?',
        englishA: 'Will you come tomorrow?',
        speakerB: 'ಹೌದು, ನಾನು ಖಂಡಿತ ಬರುತ್ತೇನೆ.',
        translitB: 'Haudu, nānu khaṇḍita baruttēne.',
        englishB: 'Yes, I will definitely come.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Say: "I will call tomorrow" -> "ನಾನು ನಾಳೆ ಕರೆ ___"',
      targetText: 'ಮಾಡುತ್ತೇನೆ',
      options: ['ಮಾಡಿದೆ', 'ಮಾಡುತ್ತೇನೆ', 'ಮಾಡಬೇಡಿ', 'ಮಾಡಿದೆನು'],
      explanation: '"ಮಾಡುತ್ತೇನೆ" expresses future intention ("I will make a call").'
    },
    quiz: [
      {
        question: 'Which word indicates future commitment for "We will go"?',
        options: ['ಹೋದೆವು (Hōdevu)', 'ಹೋಗುತ್ತೇವೆ (Hōguttēve)', 'ಹೋಗಬೇಡಿ (Hōgabēḍi)', 'ಹೋಗು (Hōgu)'],
        correctIndex: 1,
        explanation: '"ಹೋಗುತ್ತೇವೆ" means "We will go".'
      }
    ],
    phrases: [
      {
        id: 'p-19-1',
        kannada: 'ನಾನು ನಾಳೆ ಬರುತ್ತೇನೆ',
        transliteration: 'Nānu nāḷe baruttēne',
        english: 'I will come tomorrow',
        context: 'Future arrival.',
        breakdown: [
          { word: 'ನಾಳೆ', transliteration: 'nāḷe', meaning: 'tomorrow' },
          { word: 'ಬರುತ್ತೇನೆ', transliteration: 'baruttēne', meaning: 'I will come' }
        ]
      },
      {
        id: 'p-19-2',
        kannada: 'ನಾವು ಸಂಜೆ ಭೇಟಿಯಾಗುತ್ತೇವೆ',
        transliteration: 'Nāvu sanje bhēṭiyāguttēve',
        english: 'We will meet this evening',
        context: 'Mutual future plan.',
        breakdown: [
          { word: 'ಸಂಜೆ', transliteration: 'sanje', meaning: 'evening' },
          { word: 'ಭೇಟಿಯಾಗುತ್ತೇವೆ', transliteration: 'bhēṭiyāguttēve', meaning: 'we will meet' }
        ]
      },
      {
        id: 'p-19-3',
        kannada: 'ಅವನು ನಂತರ ಕರೆಯುತ್ತಾನೆ',
        transliteration: 'Avanu nanthara kareyuttāne',
        english: 'He will call later',
        context: 'Third person future.',
        breakdown: [
          { word: 'ನಂತರ', transliteration: 'nanthara', meaning: 'later' },
          { word: 'ಕರೆಯುತ್ತಾನೆ', transliteration: 'kareyuttāne', meaning: 'will call' }
        ]
      },
      {
        id: 'p-19-4',
        kannada: 'ನೀವು ಯಾವಾಗ ಪ್ರಾರಂಭಿಸುತ್ತೀರಿ?',
        transliteration: 'Nīvu yāvāga prārambhisuttīri?',
        english: 'When will you start?',
        context: 'Inquiring about launch time.',
        breakdown: [
          { word: 'ಯಾವಾಗ', transliteration: 'yāvāga', meaning: 'when' },
          { word: 'ಪ್ರಾರಂಭಿಸುತ್ತೀರಿ', transliteration: 'prārambhisuttīri', meaning: 'will you start' }
        ]
      },
      {
        id: 'p-19-5',
        kannada: 'ನಾನು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ',
        transliteration: 'Nānu sahāya māḍuttēne',
        english: 'I will help',
        context: 'Volunteering assistance.',
        breakdown: [{ word: 'ಸಹಾಯ ಮಾಡುತ್ತೇನೆ', transliteration: 'sahāya māḍuttēne', meaning: 'I will help' }]
      },
      {
        id: 'p-19-6',
        kannada: 'ಮುಂದಿನ ವಾರ ನೋಡೋಣ',
        transliteration: 'Mundina vāra nōḍōṇa',
        english: 'Let us see next week',
        context: 'Deferring a decision warmly.',
        breakdown: [
          { word: 'ಮುಂದಿನ ವಾರ', transliteration: 'mundina vāra', meaning: 'next week' },
          { word: 'ನೋಡೋಣ', transliteration: 'nōḍōṇa', meaning: 'let us see' }
        ]
      }
    ]
  },
  {
    id: 'lesson-20',
    titleKannada: 'ಆಟೋ ಮತ್ತು ಮೆಟ್ರೋ ಪ್ರಯಾಣ ಸಂಭಾಷಣೆ',
    titleEnglish: 'Auto & Metro Travel Dialogue',
    category: 'travel',
    difficulty: 'Intermediate',
    description: 'Practical conversations with Bengaluru auto drivers and metro ticket counters.',
    durationMinutes: 13,
    phrasesCount: 6,
    objective: 'Negotiate fares by meter, give route directions, and navigate transit.',
    pronunciationTips: '"Mīṭar hāki" (put the meter) is the most famous Bengaluru commuter phrase.',
    culturalNote: 'Addressing auto drivers with respect as "ಅಣ್ಣ" (Aṇṇa) usually ensures a courteous response.',
    examples: [
      {
        speakerA: 'ಅಣ್ಣ, ಇಂದಿರಾನಗರಕ್ಕೆ ಬರ್ತೀರಾ?',
        translitA: 'Aṇṇa, indiranagarakke bartīrā?',
        englishA: 'Brother, will you come to Indiranagar?',
        speakerB: 'ಹೌದು, ಬನ್ನಿ. ಮೀಟರ್ ಹಾಕ್ತೀನಿ.',
        translitB: 'Haudu, banni. Mīṭar hāktīni.',
        englishB: 'Yes, please get in. I will turn on the meter.'
      }
    ],
    interactiveExercise: {
      type: 'word_order',
      prompt: 'Arrange to tell driver: "Please turn on the meter"',
      targetText: 'ಮೀಟರ್ ಹಾಕಿ ಅಣ್ಣ',
      options: ['ಅಣ್ಣ', 'ಹಾಕಿ', 'ಮೀಟರ್'],
      correctOrder: ['ಮೀಟರ್', 'ಹಾಕಿ', 'ಅಣ್ಣ'],
      explanation: '"ಮೀಟರ್ ಹಾಕಿ" means put meter; "ಅಣ್ಣ" adds polite address.'
    },
    quiz: [
      {
        question: 'How do you ask an auto driver to drop you at the next signal?',
        options: ['ಮುಂದಿನ ಸಿಗ್ನಲ್‌ನಲ್ಲಿ ನಿಲ್ಲಿಸಿ (Mundina signalnalli nillisi)', 'ಬೇಗ ಹೋಗಿ (Bēga hōgi)', 'ಮೀಟರ್ ಬೇಡ (Mīṭar bēḍa)', 'ಹಿಂದೆ ಬನ್ನಿ (Hinde banni)'],
        correctIndex: 0,
        explanation: '"ಮುಂದಿನ ಸಿಗ್ನಲ್‌ನಲ್ಲಿ ನಿಲ್ಲಿಸಿ" means "Please stop at the next signal".'
      }
    ],
    phrases: [
      {
        id: 'p-20-1',
        kannada: 'ಅಣ್ಣ, [ಸ್ಥಳ]ಕ್ಕೆ ಬರ್ತೀರಾ?',
        transliteration: 'Aṇṇa, [sthala]kke bartīrā?',
        english: 'Brother, will you come to [Place]?',
        context: 'Hailing an auto rickshaw.',
        breakdown: [
          { word: 'ಅಣ್ಣ', transliteration: 'aṇṇa', meaning: 'brother' },
          { word: 'ಬರ್ತೀರಾ', transliteration: 'bartīrā', meaning: 'will you come?' }
        ]
      },
      {
        id: 'p-20-2',
        kannada: 'ಮೀಟರ್ ಹಾಕಿ',
        transliteration: 'Mīṭar hāki',
        english: 'Please turn on the meter',
        context: 'Requesting metered fare.',
        breakdown: [
          { word: 'ಮೀಟರ್', transliteration: 'mīṭar', meaning: 'meter' },
          { word: 'ಹಾಕಿ', transliteration: 'hāki', meaning: 'put / engage' }
        ]
      },
      {
        id: 'p-20-3',
        kannada: 'ಮುಂದೆ ಎಡಕ್ಕೆ ತಗೊಳ್ಳಿ',
        transliteration: 'Munde eḍakke tagoḷḷi',
        english: 'Take a left ahead',
        context: 'Navigating driver.',
        breakdown: [
          { word: 'ಮುಂದೆ', transliteration: 'munde', meaning: 'ahead' },
          { word: 'ಎಡಕ್ಕೆ', transliteration: 'eḍakke', meaning: 'to the left' },
          { word: 'ತಗೊಳ್ಳಿ', transliteration: 'tagoḷḷi', meaning: 'take' }
        ]
      },
      {
        id: 'p-20-4',
        kannada: 'ಇಲ್ಲೇ ನಿಲ್ಲಿಸಿ',
        transliteration: 'Illē nillisi',
        english: 'Please stop right here',
        context: 'Arriving at destination.',
        breakdown: [
          { word: 'ಇಲ್ಲೇ', transliteration: 'illē', meaning: 'right here' },
          { word: 'ನಿಲ್ಲಿಸಿ', transliteration: 'nillisi', meaning: 'stop' }
        ]
      },
      {
        id: 'p-20-5',
        kannada: 'ಮೆಟ್ರೋ ಟಿಕೆಟ್ ಕೌಂಟರ್ ಎಲ್ಲಿದೆ?',
        transliteration: 'Meṭrō ṭikeṭ kaunṭar ellide?',
        english: 'Where is the metro ticket counter?',
        context: 'Transit station inquiry.',
        breakdown: [{ word: 'ಕೌಂಟರ್ ಎಲ್ಲಿದೆ', transliteration: 'kaunṭar ellide', meaning: 'where is counter' }]
      },
      {
        id: 'p-20-6',
        kannada: 'ನಮ್ಮ ಮೆಟ್ರೋ ಸ್ಮಾರ್ಟ್ ಕಾರ್ಡ್ ರೀಚಾರ್ಜ್ ಮಾಡಬೇಕು',
        transliteration: 'Namma Meṭrō smārṭ kārḍ rīcārj māḍabēku',
        english: 'I need to recharge my Namma Metro smart card',
        context: 'At metro station.',
        breakdown: [{ word: 'ರೀಚಾರ್ಜ್ ಮಾಡಬೇಕು', transliteration: 'rīcārj māḍabēku', meaning: 'need to recharge' }]
      }
    ]
  },
  {
    id: 'lesson-21',
    titleKannada: 'ದರ್ಶಿನಿ ಹೋಟೆಲ್‌ನಲ್ಲಿ ಆರ್ಡರ್ ಮಾಡುವುದು',
    titleEnglish: 'Ordering at a Darshini Restaurant',
    category: 'food',
    difficulty: 'Intermediate',
    description: 'Navigate token counters, pick up hot plates, and ask for extra chutney at Bengaluru Darshinis.',
    durationMinutes: 12,
    phrasesCount: 6,
    objective: 'Order food fluently at self-service counters and coffee stations.',
    pronunciationTips: '"Bisi bisi" means steaming hot.',
    culturalNote: 'Darshinis are Bengaluru\'s iconic fast, standing vegetarian eateries created in the 1980s.',
    examples: [
      {
        speakerA: 'ಒಂದು ಮಸಾಲೆ ದೋಸೆ ಟೋಕನ್ ಕೊಡಿ.',
        translitA: 'Ondu masāle dōse ṭōkan koḍi.',
        englishA: 'Please give one masala dosa token.',
        speakerB: 'ಐವತ್ತು ರೂಪಾಯಿ ಆಗುತ್ತೆ. ಅಲ್ಲಿ ಕೊಡಿ.',
        translitB: 'Aivattu rūpāyi āgutte. Alli koḍi.',
        englishB: 'That will be fifty rupees. Hand it over there.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Ask for extra condiment: "ಸ್ವಲ್ಪ ಚಟ್ನಿ ___"',
      targetText: 'ಕೊಡಿ',
      options: ['ಕೊಡಿ', 'ತಗೊಳ್ಳಿ', 'ಮಾಡಿ', 'ಬೇಡ'],
      explanation: '"ಸ್ವಲ್ಪ ಚಟ್ನಿ ಕೊಡಿ" means please give some chutney.'
    },
    quiz: [
      {
        question: 'What does "ಬಿಸಿ ಬಿಸಿ" (Bisi bisi) describe in food?',
        options: ['Very spicy', 'Steaming hot', 'Sweet', 'Cold'],
        correctIndex: 1,
        explanation: '"ಬಿಸಿ ಬಿಸಿ" means fresh and piping hot.'
      }
    ],
    phrases: [
      {
        id: 'p-21-1',
        kannada: 'ಒಂದು ಪ್ಲೇಟ್ ಇಡ್ಲಿ-ವಡೆ ಕೊಡಿ',
        transliteration: 'Ondu plēṭ iḍli-vaḍe koḍi',
        english: 'Give one plate of Idli-Vada',
        context: 'Token counter order.',
        breakdown: [{ word: 'ಒಂದು ಪ್ಲೇಟ್', transliteration: 'ondu plēṭ', meaning: 'one plate' }]
      },
      {
        id: 'p-21-2',
        kannada: 'ದೋಸೆ ಗರಿಗರಿಯಾಗಿರಲಿ',
        transliteration: 'Dōse garigariyāgirali',
        english: 'Let the dosa be crispy',
        context: 'Special preparation request.',
        breakdown: [{ word: 'ಗರಿಗರಿಯಾಗಿರಲಿ', transliteration: 'garigariyāgirali', meaning: 'let it be crisp' }]
      },
      {
        id: 'p-21-3',
        kannada: 'ಸ್ವಲ್ಪ ಜಾಸ್ತಿ ಚಟ್ನಿ ಹಾಕಿ',
        transliteration: 'Svalpa jāsti caṭni hāki',
        english: 'Put a little extra chutney, please',
        context: 'At the food pickup counter.',
        breakdown: [
          { word: 'ಜಾಸ್ತಿ', transliteration: 'jāsti', meaning: 'more' },
          { word: 'ಹಾಕಿ', transliteration: 'hāki', meaning: 'put / serve' }
        ]
      },
      {
        id: 'p-21-4',
        kannada: 'ಒಂದು ಬಿಸಿ ಫಿಲ್ಟರ್ ಕಾಫಿ',
        transliteration: 'Ondu bisi philṭar kāphi',
        english: 'One hot filter coffee',
        context: 'At the coffee counter.',
        breakdown: [
          { word: 'ಬಿಸಿ', transliteration: 'bisi', meaning: 'hot' },
          { word: 'ಕಾಫಿ', transliteration: 'kāphi', meaning: 'coffee' }
        ]
      },
      {
        id: 'p-21-5',
        kannada: 'ಸಕ್ಕರೆ ಕಮ್ಮಿ / ಸಕ್ಕರೆ ಬೇಡ',
        transliteration: 'Sakkare kammi / sakkare bēḍa',
        english: 'Less sugar / No sugar',
        context: 'Customizing your drink.',
        breakdown: [
          { word: 'ಸಕ್ಕರೆ', transliteration: 'sakkare', meaning: 'sugar' },
          { word: 'ಕಮ್ಮಿ', transliteration: 'kammi', meaning: 'less' }
        ]
      },
      {
        id: 'p-21-6',
        kannada: 'ಪಾರ್ಸಲ್ ಮಾಡಿಕೊಡಿ',
        transliteration: 'Pārsal māḍikoḍi',
        english: 'Please pack it for takeaway',
        context: 'Takeout request.',
        breakdown: [{ word: 'ಪಾರ್ಸಲ್', transliteration: 'pārsal', meaning: 'takeaway / parcel' }]
      }
    ]
  },
  {
    id: 'lesson-22',
    titleKannada: 'ತರಕಾರಿ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಚೌಕಾಶಿ',
    titleEnglish: 'Bargaining at the Vegetable Market',
    category: 'shopping',
    difficulty: 'Intermediate',
    description: 'Ask for fresh produce, verify weights, and bargain courteously.',
    durationMinutes: 12,
    phrasesCount: 6,
    objective: 'Purchase fresh greens, tomatoes, onions and verify freshness.',
    pronunciationTips: '"Taja" means fresh; "Tarakāri" means vegetables.',
    culturalNote: 'Sunday morning visits to local santhe (open markets) or Gandhi Bazaar are staple Karnataka traditions.',
    examples: [
      {
        speakerA: 'ಟೊಮ್ಯಾಟೊ ತಾಜಾವಾಗಿದೆಯಾ?',
        translitA: 'Ṭomyāṭo tājāvāgideyā?',
        englishA: 'Are the tomatoes fresh?',
        speakerB: 'ಇವತ್ತೇ ತೋಟದಿಂದ ಬಂದಿದ್ದು, ತುಂಬಾ ತಾಜಾ ಇದೆ.',
        translitB: 'Ivattē tōṭadinda bandiddu, tumbā tājā ide.',
        englishB: 'Arrived just today from the farm, very fresh.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Word for fresh: "ಇದು ___ ತರಕಾರಿ"',
      targetText: 'ತಾಜಾ',
      options: ['ತಾಜಾ', 'ಹಳೇ', 'ಕಹಿ', 'ಉಪ್ಪು'],
      explanation: '"ತಾಜಾ" (tājā) means fresh.'
    },
    quiz: [
      {
        question: 'What is the Kannada word for "Onion"?',
        options: ['ಈರುಳ್ಳಿ (Īruḷḷi)', 'ಬೆಳ್ಳುಳ್ಳಿ (Beḷḷuḷḷi)', 'ಆಲೂಗಡ್ಡೆ (Ālūgaḍḍe)', 'ಕ್ಯಾರೆಟ್ (Kyāreṭ)'],
        correctIndex: 0,
        explanation: '"ಈರುಳ್ಳಿ" (Īruḷḷi) is onion. "ಬೆಳ್ಳುಳ್ಳಿ" is garlic.'
      }
    ],
    phrases: [
      {
        id: 'p-22-1',
        kannada: 'ತರಕಾರಿ ತಾಜಾವಾಗಿದೆಯಾ?',
        transliteration: 'Tarakāri tājāvāgideyā?',
        english: 'Are the vegetables fresh?',
        context: 'Checking quality.',
        breakdown: [
          { word: 'ತರಕಾರಿ', transliteration: 'tarakāri', meaning: 'vegetables' },
          { word: 'ತಾಜಾ', transliteration: 'tājā', meaning: 'fresh' }
        ]
      },
      {
        id: 'p-22-2',
        kannada: 'ಈರುಳ್ಳಿ ಮತ್ತು ಆಲೂಗಡ್ಡೆ ಬೆಲೆ ಎಷ್ಟು?',
        transliteration: 'Īruḷḷi mattu ālūgaḍḍe bele eṣṭu?',
        english: 'How much are onions and potatoes?',
        context: 'Asking rates.',
        breakdown: [
          { word: 'ಈರುಳ್ಳಿ', transliteration: 'īruḷḷi', meaning: 'onions' },
          { word: 'ಆಲೂಗಡ್ಡೆ', transliteration: 'ālūgaḍḍe', meaning: 'potatoes' }
        ]
      },
      {
        id: 'p-22-3',
        kannada: 'ಸ್ವಲ್ಪ ಕೊತ್ತಂಬರಿ ಸೊಪ್ಪು ಹಾಕಿ',
        transliteration: 'Svalpa kottambari soppu hāki',
        english: 'Please add a little coriander greens',
        context: 'Traditional complimentary herbs request.',
        breakdown: [{ word: 'ಕೊತ್ತಂಬರಿ ಸೊಪ್ಪು', transliteration: 'kottambari soppu', meaning: 'coriander leaves' }]
      },
      {
        id: 'p-22-4',
        kannada: 'ಅರ್ಧ ಕೆಜಿ ಕೊಡಿ',
        transliteration: 'Ardha keji koḍi',
        english: 'Give half a kilo',
        context: 'Weight measurement.',
        breakdown: [{ word: 'ಅರ್ಧ', transliteration: 'ardha', meaning: 'half' }]
      },
      {
        id: 'p-22-5',
        kannada: 'ಚಿಲ್ಲರೆ ಇದೆಯಾ?',
        transliteration: 'Cillare ideyā?',
        english: 'Do you have loose change?',
        context: 'Cash payment exchange.',
        breakdown: [{ word: 'ಚಿಲ್ಲರೆ', transliteration: 'cillare', meaning: 'loose change' }]
      },
      {
        id: 'p-22-6',
        kannada: 'ಒಂದು ಬ್ಯಾಗ್ ಕೊಡ್ತೀರಾ?',
        transliteration: 'Ondu byāg koḍtīrā?',
        english: 'Will you give a carry bag?',
        context: 'Bag request.',
        breakdown: [{ word: 'ಬ್ಯಾಗ್', transliteration: 'byāg', meaning: 'bag' }]
      }
    ]
  },
  {
    id: 'lesson-23',
    titleKannada: 'ದಾರಿ ಕೇಳುವುದು ಮತ್ತು ವಿಳಾಸ ಹುಡುಕುವುದು',
    titleEnglish: 'Asking Directions & Finding Addresses',
    category: 'travel',
    difficulty: 'Intermediate',
    description: 'Learn landmark-based directions, cross streets, main roads, and building landmarks.',
    durationMinutes: 11,
    phrasesCount: 6,
    objective: 'Navigate Bengaluru streets and understand local landmark references.',
    pronunciationTips: '"Dāri" means path or way. "Kūḍalu" means junction or circle.',
    culturalNote: 'In Bengaluru, directions are often given relative to circles (e.g., Ashoka Pillar, Anil Kumble Circle) or temples.',
    examples: [
      {
        speakerA: 'ಕ್ಷಮಿಸಿ, ಮುಖ್ಯ ರಸ್ತೆಗೆ ಹೋಗುವ ದಾರಿ ಯಾವುದು?',
        translitA: 'Kṣamisi, mukhya rastege hōguva dāri yāvudu?',
        englishA: 'Excuse me, which is the way to the main road?',
        speakerB: 'ಮುಂದಿನ ವೃತ್ತದಲ್ಲಿ ಬಲಕ್ಕೆ ತಿರುಗಿ, ಅದೇ ಮುಖ್ಯ ರಸ್ತೆ.',
        translitB: 'Mundina vr̥ttadalli balakke tirugi, adē mukhya raste.',
        englishB: 'Turn right at the next circle, that is the main road.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Word for circle / junction: "ಮುಂದಿನ ___ದಲ್ಲಿ ಬಲಕ್ಕೆ ಹೋಗಿ"',
      targetText: 'ವೃತ್ತ',
      options: ['ವೃತ್ತ', 'ಮನೆ', 'ನೀರು', 'ಬೆಲೆ'],
      explanation: '"ವೃತ್ತ" (vr̥tta) or ಸರ್ಕಲ್ (circle) means traffic circle / junction.'
    },
    quiz: [
      {
        question: 'What is the polite phrase for "Excuse me"?',
        options: ['ಧನ್ಯವಾದಗಳು (Dhan\'yavādagaḷu)', 'ಕ್ಷಮಿಸಿ (Kṣamisi)', 'ಬೇಗ ಬನ್ನಿ (Bēga banni)', 'ನೋಡಿ (Nōḍi)'],
        correctIndex: 1,
        explanation: '"ಕ್ಷಮಿಸಿ" (Kṣamisi) means excuse me or forgive me.'
      }
    ],
    phrases: [
      {
        id: 'p-23-1',
        kannada: 'ಕ್ಷಮಿಸಿ, ಈ ವಿಳಾಸ ಎಲ್ಲಿದೆ?',
        transliteration: 'Kṣamisi, ī viḷāsa ellide?',
        english: 'Excuse me, where is this address located?',
        context: 'Asking a passerby.',
        breakdown: [
          { word: 'ಕ್ಷಮಿಸಿ', transliteration: 'kṣamisi', meaning: 'excuse me' },
          { word: 'ವಿಳಾಸ', transliteration: 'viḷāsa', meaning: 'address' }
        ]
      },
      {
        id: 'p-23-2',
        kannada: 'ಮುಖ್ಯ ರಸ್ತೆ ಯಾವುದು?',
        transliteration: 'Mukhya raste yāvudu?',
        english: 'Which one is the main road?',
        context: 'Street orientation.',
        breakdown: [
          { word: 'ಮುಖ್ಯ', transliteration: 'mukhya', meaning: 'main' },
          { word: 'ರಸ್ತೆ', transliteration: 'raste', meaning: 'road' }
        ]
      },
      {
        id: 'p-23-3',
        kannada: 'ಸಿಗ್ನಲ್ ದಾಟಿ ಮುಂದೆ ಹೋಗಿ',
        transliteration: 'Signal dāṭi munde hōgi',
        english: 'Cross the traffic signal and go ahead',
        context: 'Landmark instruction.',
        breakdown: [
          { word: 'ದಾಟಿ', transliteration: 'dāṭi', meaning: 'having crossed' },
          { word: 'ಮುಂದೆ', transliteration: 'munde', meaning: 'ahead' }
        ]
      },
      {
        id: 'p-23-4',
        kannada: 'ಇಲ್ಲಿಂದ ಎಷ್ಟು ದೂರ?',
        transliteration: 'Illinda eṣṭu dūra?',
        english: 'How far is it from here?',
        context: 'Estimating walk/drive.',
        breakdown: [
          { word: 'ಇಲ್ಲಿಂದ', transliteration: 'illinda', meaning: 'from here' },
          { word: 'ದೂರ', transliteration: 'dūra', meaning: 'far / distance' }
        ]
      },
      {
        id: 'p-23-5',
        kannada: 'ನಡೆದುಕೊಂಡು ಹೋಗಬಹುದಾ?',
        transliteration: 'Naḍedukoṇḍu hōgabahudā?',
        english: 'Can one go by walking?',
        context: 'Feasibility check.',
        breakdown: [
          { word: 'ನಡೆದುಕೊಂಡು', transliteration: 'naḍedukoṇḍu', meaning: 'by walking' },
          { word: 'ಹೋಗಬಹುದಾ', transliteration: 'hōgabahudā', meaning: 'can we go?' }
        ]
      },
      {
        id: 'p-23-6',
        kannada: 'ಅದು ಆಸ್ಪತ್ರೆಯ ಎದುರುಗಡೆ ಇದೆ',
        transliteration: 'Adu āspatreya edurugaḍe ide',
        english: 'It is right opposite the hospital',
        context: 'Opposite landmark.',
        breakdown: [
          { word: 'ಎದುರುಗಡೆ', transliteration: 'edurugaḍe', meaning: 'in front / opposite' },
          { word: 'ಆಸ್ಪತ್ರೆ', transliteration: 'āspatre', meaning: 'hospital' }
        ]
      }
    ]
  },
  {
    id: 'lesson-24',
    titleKannada: 'ಆರೋಗ್ಯ, ವೈದ್ಯರು ಮತ್ತು ಔಷಧಿ ಅಂಗಡಿ',
    titleEnglish: 'Health, Doctors & Pharmacy',
    category: 'health',
    difficulty: 'Intermediate',
    description: 'Explain symptoms (headache, fever, stomach ache) and purchase medicines at a pharmacy.',
    durationMinutes: 13,
    phrasesCount: 6,
    objective: 'Express medical distress, describe pain, and consult a pharmacist.',
    pronunciationTips: '"Nōvu" means pain/ache. "Jvara" means fever.',
    culturalNote: 'Pharmacists in Karnataka are very supportive; describing symptoms clearly helps them locate the right remedy.',
    examples: [
      {
        speakerA: 'ನಿಮಗೆ ಏನು ತೊಂದರೆ ಆಗಿದೆ?',
        translitA: 'Nimage ēnu tondare āgide?',
        englishA: 'What trouble / symptom are you experiencing?',
        speakerB: 'ನನಗೆ ತಲೆನೋವು ಮತ್ತು ಜ್ವರ ಇದೆ.',
        translitB: 'Nanage talenōvu mattu jvara ide.',
        englishB: 'I have a headache and a fever.'
      }
    ],
    interactiveExercise: {
      type: 'word_order',
      prompt: 'Arrange to say: "I have a headache"',
      targetText: 'ನನಗೆ ತಲೆನೋವು ಇದೆ',
      options: ['ಇದೆ', 'ತಲೆನೋವು', 'ನನಗೆ'],
      correctOrder: ['ನನಗೆ', 'ತಲೆನೋವು', 'ಇದೆ'],
      explanation: 'Dative pronoun (ನನಗೆ) + Symptom (ತಲೆನೋವು) + Auxiliary (ಇದೆ).'
    },
    quiz: [
      {
        question: 'What is the Kannada word for "Fever"?',
        options: ['ತಲೆನೋವು (Talenōvu)', 'ಜ್ವರ (Jvara)', 'ಕೆಮ್ಮು (Kemmu)', 'ಶೀತ (Śīta)'],
        correctIndex: 1,
        explanation: '"ಜ್ವರ" (Jvara) means fever.'
      }
    ],
    phrases: [
      {
        id: 'p-24-1',
        kannada: 'ನನಗೆ ಹುಷಾರಿಲ್ಲ',
        transliteration: 'Nanage huṣārilla',
        english: 'I am not feeling well / I am sick',
        context: 'General expression of illness.',
        breakdown: [
          { word: 'ಹುಷಾರು', transliteration: 'huṣāru', meaning: 'well / cautious' },
          { word: 'ಇಲ್ಲ', transliteration: 'illa', meaning: 'not' }
        ]
      },
      {
        id: 'p-24-2',
        kannada: 'ತಲೆನೋವು ಮತ್ತು ಹೊಟ್ಟೆನೋವು',
        transliteration: 'Talenōvu mattu hoṭṭenōvu',
        english: 'Headache and Stomach ache',
        context: 'Common aches.',
        breakdown: [
          { word: 'ತಲೆನೋವು', transliteration: 'talenōvu', meaning: 'headache' },
          { word: 'ಹೊಟ್ಟೆನೋವು', transliteration: 'hoṭṭenōvu', meaning: 'stomach ache' }
        ]
      },
      {
        id: 'p-24-3',
        kannada: 'ಶೀತ ಮತ್ತು ಕೆಮ್ಮು ಇದೆ',
        transliteration: 'Śīta mattu kemmu ide',
        english: 'I have cold and cough',
        context: 'Respiratory symptoms.',
        breakdown: [
          { word: 'ಶೀತ', transliteration: 'śīta', meaning: 'cold' },
          { word: 'ಕೆಮ್ಮು', transliteration: 'kemmu', meaning: 'cough' }
        ]
      },
      {
        id: 'p-24-4',
        kannada: 'ಜ್ವರಕ್ಕೆ ಮಾತ್ರೆ ಕೊಡಿ',
        transliteration: 'Jvarakke mātre koḍi',
        english: 'Please give medicine / tablets for fever',
        context: 'At the medical store.',
        breakdown: [
          { word: 'ಮಾತ್ರೆ', transliteration: 'mātre', meaning: 'tablet / pill' },
          { word: 'ಜ್ವರಕ್ಕೆ', transliteration: 'jvarakke', meaning: 'for fever' }
        ]
      },
      {
        id: 'p-24-5',
        kannada: 'ದಿನಕ್ಕೆ ಎಷ್ಟು ಬಾರಿ ತಗೋಬೇಕು?',
        transliteration: 'Dinakke eṣṭu bāri tagōbēku?',
        english: 'How many times a day should this be taken?',
        context: 'Dosage instructions.',
        breakdown: [
          { word: 'ದಿನಕ್ಕೆ', transliteration: 'dinakke', meaning: 'per day' },
          { word: 'ಎಷ್ಟು ಬಾರಿ', transliteration: 'eṣṭu bāri', meaning: 'how many times' }
        ]
      },
      {
        id: 'p-24-6',
        kannada: 'ಊಟದ ನಂತರ ತಗೊಳ್ಳಿ',
        transliteration: 'Ūṭada nanthara tagoḷḷi',
        english: 'Take it after meals',
        context: 'Doctor / pharmacist guidance.',
        breakdown: [
          { word: 'ಊಟದ ನಂತರ', transliteration: 'ūṭada nanthara', meaning: 'after meals' },
          { word: 'ತಗೊಳ್ಳಿ', transliteration: 'tagoḷḷi', meaning: 'take (polite)' }
        ]
      }
    ]
  },
  {
    id: 'lesson-25',
    titleKannada: 'ಬೆಂಗಳೂರು ಹವಾಮಾನ ಮತ್ತು ಋತುಗಳು',
    titleEnglish: 'Bengaluru Weather & Seasons',
    category: 'daily',
    difficulty: 'Intermediate',
    description: 'Discuss Bengaluru\'s pleasant breeze, sudden evening showers, and seasonal changes.',
    durationMinutes: 11,
    phrasesCount: 6,
    objective: 'Make pleasant small talk about temperature, rain, sunshine, and coolness.',
    pronunciationTips: '"Havāmāna" means weather or climate.',
    culturalNote: 'Bengaluru is renowned across India for its pleasant year-round salubrious climate.',
    examples: [
      {
        speakerA: 'ಇವತ್ತು ಸಂಜೆ ಮಳೆ ಬರಬಹುದಾ?',
        translitA: 'Ivattu sanje maḷe barabahudā?',
        englishA: 'Might it rain this evening?',
        speakerB: 'ಹೌದು, ಮೋಡ ಕವಿದಿದೆ, ತಂಪಾದ ಗಾಳಿ ಬೀಸುತ್ತಿದೆ.',
        translitB: 'Haudu, mōḍa kavidide, tampāda gāḷi bīsuttide.',
        englishB: 'Yes, it is cloudy and a cool breeze is blowing.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Word for rain: "ಇವತ್ತು ___ ಬರುತ್ತಿದೆ"',
      targetText: 'ಮಳೆ',
      options: ['ಮಳೆ', 'ಬಿಸಿಲು', 'ಚಳಿ', 'ಗಾಳಿ'],
      explanation: '"ಮಳೆ" (maḷe) means rain.'
    },
    quiz: [
      {
        question: 'What does "ಚಳಿ" (Chaḷi) mean?',
        options: ['Heat / Sun', 'Cold / Chill', 'Rain', 'Breeze'],
        correctIndex: 1,
        explanation: '"ಚಳಿ" means cold or chilly weather.'
      }
    ],
    phrases: [
      {
        id: 'p-25-1',
        kannada: 'ಹವಾಮಾನ ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ',
        transliteration: 'Havāmāna tumbā cennāgide',
        english: 'The weather is very pleasant',
        context: 'Complimenting the climate.',
        breakdown: [{ word: 'ಹವಾಮಾನ', transliteration: 'havāmāna', meaning: 'weather' }]
      },
      {
        id: 'p-25-2',
        kannada: 'ತಂಪಾದ ಗಾಳಿ ಬೀಸುತ್ತಿದೆ',
        transliteration: 'Tampāda gāḷi bīsuttide',
        english: 'A cool breeze is blowing',
        context: 'Evening breeze.',
        breakdown: [
          { word: 'ತಂಪಾದ', transliteration: 'tampāda', meaning: 'cool' },
          { word: 'ಗಾಳಿ', transliteration: 'gāḷi', meaning: 'wind / air' }
        ]
      },
      {
        id: 'p-25-3',
        kannada: 'ಇವತ್ತು ತುಂಬಾ ಬಿಸಿಲಿದೆ',
        transliteration: 'Ivattu tumbā bisilide',
        english: 'It is very sunny / hot today',
        context: 'Sunny noon.',
        breakdown: [{ word: 'ಬಿಸಿಲು', transliteration: 'bisilu', meaning: 'sunshine / heat' }]
      },
      {
        id: 'p-25-4',
        kannada: 'ಮಳೆಗಾಲ ಮತ್ತು ಚಳಿಗಾಲ',
        transliteration: 'Maḷegāla mattu caḷigāla',
        english: 'Monsoon (Rainy season) and Winter',
        context: 'Seasons of Karnataka.',
        breakdown: [
          { word: 'ಮಳೆಗಾಲ', transliteration: 'maḷegāla', meaning: 'rainy season' },
          { word: 'ಚಳಿಗಾಲ', transliteration: 'caḷigāla', meaning: 'winter' }
        ]
      },
      {
        id: 'p-25-5',
        kannada: 'ಕೊಡೆ ತಗೊಂಡು ಹೋಗಿ',
        transliteration: 'Koḍe tagoṇḍu hōgi',
        english: 'Take an umbrella with you',
        context: 'Advice before stepping out.',
        breakdown: [
          { word: 'ಕೊಡೆ', transliteration: 'koḍe', meaning: 'umbrella' },
          { word: 'ತಗೊಂಡು', transliteration: 'tagoṇḍu', meaning: 'having taken' }
        ]
      },
      {
        id: 'p-25-6',
        kannada: 'ಆಕಾಶದಲ್ಲಿ ಮೋಡಗಳು ಕವಿದಿವೆ',
        transliteration: 'Ākāśadalli mōḍagaḷu kavidive',
        english: 'The sky is overcast with clouds',
        context: 'Pre-monsoon atmosphere.',
        breakdown: [{ word: 'ಮೋಡಗಳು', transliteration: 'mōḍagaḷu', meaning: 'clouds' }]
      }
    ]
  },
  {
    id: 'lesson-26',
    titleKannada: 'ದೂರವಾಣಿ ಸಂಭಾಷಣೆ ಕನ್ನಡದಲ್ಲಿ',
    titleEnglish: 'Telephone Kannada',
    category: 'daily',
    difficulty: 'Intermediate',
    description: 'Answering phone calls, asking for people politely, leaving messages, and managing call drops.',
    durationMinutes: 11,
    phrasesCount: 6,
    objective: 'Conduct polite phone conversations in Kannada.',
    pronunciationTips: '"Hēḷi" (Please tell) is standard polite phone parlance.',
    culturalNote: 'Answering with "ಹೇಳಿ, ನಮಸ್ಕಾರ" (Hēḷi, Namaskāra) immediately establishes a helpful tone.',
    examples: [
      {
        speakerA: 'ಹಲೋ, ನಾನು ರಾಜೇಶ್ ಅವರ ಜೊತೆ ಮಾತನಾಡಬಹುದಾ?',
        translitA: 'Halō, nānu rājēś avara jote mātanāḍabahudā?',
        englishA: 'Hello, may I speak with Mr. Rajesh?',
        speakerB: 'ಒಂದು ನಿಮಿಷ ಇರಿ, ನಾನು ಫೋನ್ ಕೊಡ್ತೇನೆ.',
        translitB: 'Ondu nimiṣa iri, nānu phōn koḍtēne.',
        englishB: 'Hold on a minute, I will hand over the phone.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Say: "Can you hear my voice?" -> "ನನ್ನ ಧ್ವನಿ ___?"',
      targetText: 'ಕೇಳಿಸುತ್ತಿದೆಯಾ',
      options: ['ಕೇಳಿಸುತ್ತಿದೆಯಾ', 'ನೋಡುತ್ತಿದ್ದೀರಾ', 'ಹೋಗುತ್ತಿದ್ದೀರಾ', 'ಬರುತ್ತಿದ್ದೀರಾ'],
      explanation: '"ಕೇಳಿಸುತ್ತಿದೆಯಾ" means "is it audible / can you hear?".'
    },
    quiz: [
      {
        question: 'How do you say "Wait a minute" on the phone?',
        options: ['ಬೇಗ ಬನ್ನಿ (Bēga banni)', 'ಒಂದು ನಿಮಿಷ ಇರಿ (Ondu nimiṣa iri)', 'ಫೋನ್ ಇಡಿ (Phōn iḍi)', 'ಹೋಗಿ (Hōgi)'],
        correctIndex: 1,
        explanation: '"ಒಂದು ನಿಮಿಷ ಇರಿ" translates to "Wait a minute".'
      }
    ],
    phrases: [
      {
        id: 'p-26-1',
        kannada: 'ಹೇಳಿ, ನಮಸ್ಕಾರ',
        transliteration: 'Hēḷi, namaskāra',
        english: 'Hello, please tell me (greetings)',
        context: 'Standard telephone greeting.',
        breakdown: [{ word: 'ಹೇಳಿ', transliteration: 'hēḷi', meaning: 'tell / please speak' }]
      },
      {
        id: 'p-26-2',
        kannada: 'ನನ್ನ ಧ್ವನಿ ಕೇಳಿಸುತ್ತಿದೆಯಾ?',
        transliteration: 'Nanna dhvani kēḷisuttideyā?',
        english: 'Is my voice audible to you?',
        context: 'Checking connection.',
        breakdown: [
          { word: 'ಧ್ವನಿ', transliteration: 'dhvani', meaning: 'voice' },
          { word: 'ಕೇಳಿಸುತ್ತಿದೆಯಾ', transliteration: 'kēḷisuttideyā', meaning: 'is it heard?' }
        ]
      },
      {
        id: 'p-26-3',
        kannada: 'ಒಂದು ನಿಮಿಷ ಕಾಯಿರಿ',
        transliteration: 'Ondu nimiṣa kāyiri',
        english: 'Please hold for a minute',
        context: 'Putting someone on hold.',
        breakdown: [
          { word: 'ಒಂದು ನಿಮಿಷ', transliteration: 'ondu nimiṣa', meaning: 'one minute' },
          { word: 'ಕಾಯಿರಿ', transliteration: 'kāyiri', meaning: 'wait (polite)' }
        ]
      },
      {
        id: 'p-26-4',
        kannada: 'ನಾನು ಸ್ವಲ್ಪ ಹೊತ್ತಿನಲ್ಲಿ ಮತ್ತೆ ಕರೆಯುತ್ತೇನೆ',
        transliteration: 'Nānu svalpa hottinalli matte kareyuttēne',
        english: 'I will call back in a short while',
        context: 'Rescheduling a busy call.',
        breakdown: [
          { word: 'ಸ್ವಲ್ಪ ಹೊತ್ತಿನಲ್ಲಿ', transliteration: 'svalpa hottinalli', meaning: 'in a little while' },
          { word: 'ಮತ್ತೆ', transliteration: 'matte', meaning: 'again' }
        ]
      },
      {
        id: 'p-26-5',
        kannada: 'ಯಾರು ಮಾತನಾಡುತ್ತಿರುವುದು?',
        transliteration: 'Yāru mātanāḍuttiruvudu?',
        english: 'May I know who is speaking?',
        context: 'Inquiring caller identity.',
        breakdown: [{ word: 'ಯಾರು', transliteration: 'yāru', meaning: 'who' }]
      },
      {
        id: 'p-26-6',
        kannada: 'ಧ್ವನಿ ಕಟ್ ಆಗುತ್ತಿದೆ',
        transliteration: 'Dhvani kaṭ āguttide',
        english: 'The voice is breaking up',
        context: 'Poor network reception.',
        breakdown: [{ word: 'ಕಟ್ ಆಗುತ್ತಿದೆ', transliteration: 'kaṭ āguttide', meaning: 'is breaking' }]
      }
    ]
  },
  {
    id: 'lesson-27',
    titleKannada: 'ಭಾವನೆಗಳು ಮತ್ತು ಮನಸ್ಥಿತಿ',
    titleEnglish: 'Emotions & Feelings',
    category: 'daily',
    difficulty: 'Intermediate',
    description: 'Express happiness, excitement, tiredness, worry, and surprise in Kannada.',
    durationMinutes: 11,
    phrasesCount: 6,
    objective: 'Share how you feel and empathize with friends and colleagues.',
    pronunciationTips: '"Santoṣa" means happiness/joy; "Khushi" is its popular everyday synonym.',
    culturalNote: '"ತುಂಬಾ ಖುಷಿಯಾಯಿತು" (I am very delighted) conveys deep warmth and friendship.',
    examples: [
      {
        speakerA: 'ನಿಮ್ಮ ಹೊಸ ಕೆಲಸ ಹೇಗೆ ಅನಿಸುತ್ತಿದೆ?',
        translitA: 'Nimma hosa kelasa hēge anisuttide?',
        englishA: 'How do you feel about your new job?',
        speakerB: 'ನನಗೆ ತುಂಬಾ ಖುಷಿ ಮತ್ತು ಉತ್ಸಾಹ ಇದೆ.',
        translitB: 'Nanage tumbā khuṣi mattu utsāha ide.',
        englishB: 'I am feeling very happy and enthusiastic.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Express happiness: "ನನಗೆ ತುಂಬಾ ___ ಆಯಿತು"',
      targetText: 'ಖುಷಿ',
      options: ['ಖುಷಿ', 'ಬೇಸರ', 'ಕೋಪ', 'ಭಯ'],
      explanation: '"ಖುಷಿ" (khuṣi) or ಸಂತೋಷ (santoṣa) means happiness.'
    },
    quiz: [
      {
        question: 'What does "ಆಯಾಸವಾಗಿದೆ" (Āyāsavāgide) mean?',
        options: ['I am angry', 'I am tired / fatigued', 'I am excited', 'I am hungry'],
        correctIndex: 1,
        explanation: '"ಆಯಾಸವಾಗಿದೆ" denotes physical tiredness or fatigue.'
      }
    ],
    phrases: [
      {
        id: 'p-27-1',
        kannada: 'ತುಂಬಾ ಸಂತೋಷ / ಖುಷಿ ಆಯಿತು',
        transliteration: 'Tumbā santoṣa / khuṣi āyitu',
        english: 'I felt very happy / delighted',
        context: 'Joyful reaction.',
        breakdown: [{ word: 'ಸಂತೋಷ', transliteration: 'santoṣa', meaning: 'happiness' }]
      },
      {
        id: 'p-27-2',
        kannada: 'ನನಗೆ ತುಂಬಾ ಆಯಾಸವಾಗಿದೆ',
        transliteration: 'Nanage tumbā āyāsavāgide',
        english: 'I am feeling very tired',
        context: 'After a long work day.',
        breakdown: [{ word: 'ಆಯಾಸ', transliteration: 'āyāsa', meaning: 'tiredness' }]
      },
      {
        id: 'p-27-3',
        kannada: 'ಚಿಂತೆ ಮಾಡಬೇಡಿ',
        transliteration: 'Cinte māḍabēḍi',
        english: 'Do not worry',
        context: 'Reassuring someone.',
        breakdown: [
          { word: 'ಚಿಂತೆ', transliteration: 'cinte', meaning: 'worry' },
          { word: 'ಮಾಡಬೇಡಿ', transliteration: 'māḍabēḍi', meaning: 'do not do' }
        ]
      },
      {
        id: 'p-27-4',
        kannada: 'ಆಶ್ಚರ್ಯವಾಯಿತು!',
        transliteration: 'Āścaryavāyitu!',
        english: 'That was a surprise!',
        context: 'Expressing amazement.',
        breakdown: [{ word: 'ಆಶ್ಚರ್ಯ', transliteration: 'āścarya', meaning: 'wonder / surprise' }]
      },
      {
        id: 'p-27-5',
        kannada: 'ಬೇಸರ ಮಾಡ್ಕೋಬೇಡಿ',
        transliteration: 'Bēsara māḍkōbēḍi',
        english: 'Please don\'t feel sad / disheartened',
        context: 'Comforting someone in sorrow.',
        breakdown: [{ word: 'ಬೇಸರ', transliteration: 'bēsara', meaning: 'sadness / boredom' }]
      },
      {
        id: 'p-27-6',
        kannada: 'ಶಾಂತವಾಗಿರಿ',
        transliteration: 'Śāntavāgiri',
        english: 'Stay calm / peaceful',
        context: 'Diffusing tense moments.',
        breakdown: [{ word: 'ಶಾಂತವಾಗಿರಿ', transliteration: 'śāntavāgiri', meaning: 'remain calm' }]
      }
    ]
  },
  {
    id: 'lesson-28',
    titleKannada: 'ಸಾಮರ್ಥ್ಯ ಮತ್ತು ನಿರಾಕರಣೆ (ಬರಲ್ಲ, ಆಗಲ್ಲ, ಗೊತ್ತಿಲ್ಲ)',
    titleEnglish: 'Ability & Inability (Baralla, Agalla, Gottilla)',
    category: 'grammar',
    difficulty: 'Intermediate',
    description: 'Master colloquial negative modals: cannot do (āgalla), don\'t know (gottilla), cannot come (baralla).',
    durationMinutes: 12,
    phrasesCount: 6,
    objective: 'Politely express constraints, inability, and lack of knowledge.',
    pronunciationTips: 'Double "l" in "-lla" suffix gives crisp negative assertion.',
    culturalNote: '"ಸ್ವಲ್ಪ ಸ್ವಲ್ಪ ಕನ್ನಡ ಬರುತ್ತೆ" (I know a little Kannada) will win every Kannadiga\'s heart instantly.',
    examples: [
      {
        speakerA: 'ನಿಮಗೆ ಕನ್ನಡ ಮಾತನಾಡಲು ಬರುತ್ತಾ?',
        translitA: 'Nimage kannada mātanāḍalu baruttā?',
        englishA: 'Do you know how to speak Kannada?',
        speakerB: 'ನನಗೆ ಸ್ವಲ್ಪ ಸ್ವಲ್ಪ ಬರುತ್ತೆ, ಈಗ ಕಲಿಯುತ್ತಿದ್ದೇನೆ.',
        translitB: 'Nanage svalpa svalpa barutte, īga kaliyuttiddēne.',
        englishB: 'I know a little bit, currently learning.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Say: "I cannot do this" -> "ನನ್ನಿಂದ ಇದು ___"',
      targetText: 'ಆಗಲ್ಲ',
      options: ['ಆಗಲ್ಲ', 'ಆಗುತ್ತೆ', 'ಬೇಕು', 'ಇದೆ'],
      explanation: '"ಆಗಲ್ಲ" (āgalla) expresses inability ("cannot be done").'
    },
    quiz: [
      {
        question: 'How do you say "I cannot come" in conversational Kannada?',
        options: ['ನಾನು ಬರ್ತೇನೆ (Nānu bartēne)', 'ನನಗೆ ಬರಲು ಆಗಲ್ಲ / ಬರಲ್ಲ (Baralla)', 'ಬನ್ನಿ (Banni)', 'ಹೋಗಿ (Hōgi)'],
        correctIndex: 1,
        explanation: '"ಬರಲ್ಲ" (baralla) means cannot come.'
      }
    ],
    phrases: [
      {
        id: 'p-28-1',
        kannada: 'ನನಗೆ ಕನ್ನಡ ಸ್ವಲ್ಪ ಬರುತ್ತೆ',
        transliteration: 'Nanage kannada svalpa barutte',
        english: 'I know a little Kannada',
        context: 'Humility and willingness to converse.',
        breakdown: [
          { word: 'ಸ್ವಲ್ಪ', transliteration: 'svalpa', meaning: 'a little' },
          { word: 'ಬರುತ್ತೆ', transliteration: 'barutte', meaning: 'comes / is known' }
        ]
      },
      {
        id: 'p-28-2',
        kannada: 'ನನಗೆ ಬರಲು ಆಗಲ್ಲ',
        transliteration: 'Nanage baralu āgalla',
        english: 'I will not be able to come',
        context: 'Declining an invitation politely.',
        breakdown: [
          { word: 'ಬರಲು', transliteration: 'baralu', meaning: 'to come' },
          { word: 'ಆಗಲ್ಲ', transliteration: 'āgalla', meaning: 'cannot happen' }
        ]
      },
      {
        id: 'p-28-3',
        kannada: 'ನನಗೆ ಅದು ಗೊತ್ತಿಲ್ಲ',
        transliteration: 'Nanage adu gottilla',
        english: 'I do not know that',
        context: 'Lack of specific information.',
        breakdown: [{ word: 'ಗೊತ್ತಿಲ್ಲ', transliteration: 'gottilla', meaning: 'is unknown' }]
      },
      {
        id: 'p-28-4',
        kannada: 'ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ',
        transliteration: 'Māḍalu sādhyavilla',
        english: 'It is not possible to do',
        context: 'Formal impossibility.',
        breakdown: [{ word: 'ಸಾಧ್ಯವಿಲ್ಲ', transliteration: 'sādhyavilla', meaning: 'not possible' }]
      },
      {
        id: 'p-28-5',
        kannada: 'ಚಿಂತೆ ಇಲ್ಲ, ಪರವಾಗಿಲ್ಲ',
        transliteration: 'Cinte illa, paravāgilla',
        english: 'No worries, it is fine / you\'re welcome',
        context: 'Dismissing apologies.',
        breakdown: [{ word: 'ಪರವಾಗಿಲ್ಲ', transliteration: 'paravāgilla', meaning: 'never mind / no problem' }]
      },
      {
        id: 'p-28-6',
        kannada: 'ನನಗೆ ಅರ್ಥವಾಗುತ್ತಿಲ್ಲ',
        transliteration: 'Nanage arthavāguttilla',
        english: 'I am not understanding',
        context: 'Asking speaker to slow down.',
        breakdown: [
          { word: 'ಅರ್ಥ', transliteration: 'artha', meaning: 'meaning' },
          { word: 'ಆಗುತ್ತಿಲ್ಲ', transliteration: 'āguttilla', meaning: 'is not happening' }
        ]
      }
    ]
  },
  {
    id: 'lesson-29',
    titleKannada: 'ಮನೆ ಭೇಟಿ ಮತ್ತು ಆತಿಥ್ಯ ಸತ್ಕಾರ',
    titleEnglish: 'Home Visits & Guest Hospitality',
    category: 'daily',
    difficulty: 'Intermediate',
    description: 'Etiquette when visiting a Kannada home: greeting elders, accepting refreshments, and warm departures.',
    durationMinutes: 12,
    phrasesCount: 6,
    objective: 'Be a gracious guest or welcoming host in a Karnataka household.',
    pronunciationTips: '"Banni banni" with repeated emphasis expresses joyous hospitality.',
    culturalNote: '"ಅತಿಥಿ ದೇವೋ ಭವ" (The guest is god) is deeply woven into Karnataka heritage.',
    examples: [
      {
        speakerA: 'ಬನ್ನಿ ಬನ್ನಿ! ಒಳಗೆ ಬನ್ನಿ. ಕಾಫಿ ಕುಡಿಯುತ್ತೀರಾ?',
        translitA: 'Banni banni! Oḷage banni. Kāphi kuḍiyuttīrā?',
        englishA: 'Welcome, welcome! Please come in. Will you have coffee?',
        speakerB: 'ನಮಸ್ಕಾರ ಆಂಟಿ, ತುಂಬಾ ಧನ್ಯವಾದಗಳು.',
        translitB: 'Namaskāra ānṭi, tumbā dhan\'yavādagaḷu.',
        englishB: 'Greetings auntie, thank you very much.'
      }
    ],
    interactiveExercise: {
      type: 'word_order',
      prompt: 'Arrange to invite a guest: "Please come inside"',
      targetText: 'ದಯವಿಟ್ಟು ಒಳಗೆ ಬನ್ನಿ',
      options: ['ಬನ್ನಿ', 'ಒಳಗೆ', 'ದಯವಿಟ್ಟು'],
      correctOrder: ['ದಯವಿಟ್ಟು', 'ಒಳಗೆ', 'ಬನ್ನಿ'],
      explanation: 'Polite adverb (ದಯವಿಟ್ಟು) + Location (ಒಳಗೆ) + Imperative (ಬನ್ನಿ).'
    },
    quiz: [
      {
        question: 'How do you politely announce departure from someone\'s home?',
        options: ['ಹೋಗ್ತೀನಿ (Blunt goodbye)', 'ಬರ್ತೇನೆ / ಹೋಗಿ ಬರ್ತೇನೆ (Will take leave and return)', 'ಇಲ್ಲ (No)', 'ಬೇಡ (Don\'t want)'],
        correctIndex: 1,
        explanation: 'In Kannada culture, one says "ಹೋಗಿ ಬರ್ತೇನೆ" (I will go and come back) rather than a blunt goodbye.'
      }
    ],
    phrases: [
      {
        id: 'p-29-1',
        kannada: 'ಬನ್ನಿ ಬನ್ನಿ, ಒಳಗೆ ಬನ್ನಿ',
        transliteration: 'Banni banni, oḷage banni',
        english: 'Welcome, please come inside',
        context: 'Welcoming guests at the threshold.',
        breakdown: [
          { word: 'ಒಳಗೆ', transliteration: 'oḷage', meaning: 'inside' },
          { word: 'ಬನ್ನಿ', transliteration: 'banni', meaning: 'come' }
        ]
      },
      {
        id: 'p-29-2',
        kannada: 'ಕುಳಿತುಕೊಳ್ಳಿ, ಕಾಫಿ ತರ್ತೇನೆ',
        transliteration: 'Kuḷitukoḷḷi, kāphi tartēne',
        english: 'Please sit down, I will bring coffee',
        context: 'Offering hospitality.',
        breakdown: [
          { word: 'ಕುಳಿತುಕೊಳ್ಳಿ', transliteration: 'kuḷitukoḷḷi', meaning: 'please sit' },
          { word: 'ತರ್ತೇನೆ', transliteration: 'tartēne', meaning: 'I will bring' }
        ]
      },
      {
        id: 'p-29-3',
        kannada: 'ನಿಮ್ಮ ಮನೆ ತುಂಬಾ ಸುಂದರವಾಗಿದೆ',
        transliteration: 'Nimma mane tumbā sundaravāgide',
        english: 'Your house is very beautiful',
        context: 'Complimenting host\'s home.',
        breakdown: [
          { word: 'ಮನೆ', transliteration: 'mane', meaning: 'home' },
          { word: 'ಸುಂದರ', transliteration: 'sundara', meaning: 'beautiful' }
        ]
      },
      {
        id: 'p-29-4',
        kannada: 'ಇನ್ನೊಂದು ಸ್ವಲ್ಪ ಸ್ವೀಟ್ ತಗೊಳ್ಳಿ',
        transliteration: 'Innondu svalpa svīṭ tagoḷḷi',
        english: 'Please have a little more sweet',
        context: 'Encouraging guest to eat.',
        breakdown: [{ word: 'ಇನ್ನೊಂದು ಸ್ವಲ್ಪ', transliteration: 'innondu svalpa', meaning: 'a little more' }]
      },
      {
        id: 'p-29-5',
        kannada: 'ತುಂಬಾ ಸಂತೋಷವಾಯಿತು ಬಂದಿದ್ದಕ್ಕೆ',
        transliteration: 'Tumbā santoṣavāyitu bandiddakke',
        english: 'We are very happy that you came',
        context: 'Expressing gratitude to guests.',
        breakdown: [{ word: 'ಬಂದಿದ್ದಕ್ಕೆ', transliteration: 'bandiddakke', meaning: 'for having visited' }]
      },
      {
        id: 'p-29-6',
        kannada: 'ಹೋಗಿ ಬರ್ತೇನೆ',
        transliteration: 'Hōgi bartēne',
        english: 'I shall take your leave (lit. I go and return)',
        context: 'Auspicious parting statement.',
        breakdown: [
          { word: 'ಹೋಗಿ', transliteration: 'hōgi', meaning: 'having gone' },
          { word: 'ಬರ್ತೇನೆ', transliteration: 'bartēne', meaning: 'I will come' }
        ]
      }
    ]
  },
  {
    id: 'lesson-30',
    titleKannada: 'ಪ್ರಶ್ನಾರ್ಥಕ ವಾಕ್ಯಗಳು (ಏನು, ಯಾರು, ಯಾವಾಗ, ಎಲ್ಲಿ, ಯಾಕೆ, ಹೇಗೆ)',
    titleEnglish: 'Mastering the 6 Question Words (Wh- Questions)',
    category: 'grammar',
    difficulty: 'Intermediate',
    description: 'Master the 6 Kannada interrogative pillars: Ēnu (what), Yāru (who), Yāvāga (when), Elli (where), Yāke (why), Hēge (how).',
    durationMinutes: 13,
    phrasesCount: 6,
    objective: 'Construct any information-seeking question in Kannada with natural SOV intonation.',
    pronunciationTips: 'In Kannada, question words naturally sit immediately before the verb: "Nīvu yāvāga bartīri?".',
    culturalNote: 'Knowing all 6 interrogatives unlocks effortless conversational curiosity.',
    examples: [
      {
        speakerA: 'ನೀವು ಯಾಕೆ ಕನ್ನಡ ಕಲಿಯುತ್ತಿದ್ದೀರಿ?',
        translitA: 'Nīvu yāke kannada kaliyuttiddīri?',
        englishA: 'Why are you learning Kannada?',
        speakerB: 'ನಾನು ಬೆಂಗಳೂರಿನಲ್ಲಿ ಕೆಲಸ ಮಾಡುತ್ತಿದ್ದೇನೆ, ಅದಕ್ಕಾಗಿ ಕಲಿಯುತ್ತಿದ್ದೇನೆ.',
        translitB: 'Nānu beṅgaḷūrinalli kelasa māḍuttiddēne, adakkāgi kaliyuttiddēne.',
        englishB: 'I work in Bengaluru, that is why I am learning.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Word for "Why": "ನೀವು ___ ತಡವಾಗಿ ಬಂದಿರಿ?"',
      targetText: 'ಯಾಕೆ',
      options: ['ಯಾಕೆ', 'ಎಲ್ಲಿ', 'ಯಾರು', 'ಹೇಗೆ'],
      explanation: '"ಯಾಕೆ" (Yāke) means "Why".'
    },
    quiz: [
      {
        question: 'Match the question word: "ಹೇಗೆ" (Hēge) means:',
        options: ['When', 'How', 'Who', 'Where'],
        correctIndex: 1,
        explanation: '"ಹೇಗೆ" (Hēge) translates to "How".'
      }
    ],
    phrases: [
      {
        id: 'p-30-1',
        kannada: 'ಏನು? (Ēnu?)',
        transliteration: 'Ēnu?',
        english: 'What?',
        context: 'Object / action inquiry.',
        breakdown: [{ word: 'ಏನು', transliteration: 'ēnu', meaning: 'What' }]
      },
      {
        id: 'p-30-2',
        kannada: 'ಯಾರು? (Yāru?)',
        transliteration: 'Yāru?',
        english: 'Who?',
        context: 'Person inquiry.',
        breakdown: [{ word: 'ಯಾರು', transliteration: 'yāru', meaning: 'Who' }]
      },
      {
        id: 'p-30-3',
        kannada: 'ಯಾವಾಗ? (Yāvāga?)',
        transliteration: 'Yāvāga?',
        english: 'When?',
        context: 'Time inquiry.',
        breakdown: [{ word: 'ಯಾವಾಗ', transliteration: 'yāvāga', meaning: 'When' }]
      },
      {
        id: 'p-30-4',
        kannada: 'ಎಲ್ಲಿ? (Elli?)',
        transliteration: 'Elli?',
        english: 'Where?',
        context: 'Location inquiry.',
        breakdown: [{ word: 'ಎಲ್ಲಿ', transliteration: 'elli', meaning: 'Where' }]
      },
      {
        id: 'p-30-5',
        kannada: 'ಯಾಕೆ? (Yāke?)',
        transliteration: 'Yāke?',
        english: 'Why?',
        context: 'Reason inquiry.',
        breakdown: [{ word: 'ಯಾಕೆ', transliteration: 'yāke', meaning: 'Why' }]
      },
      {
        id: 'p-30-6',
        kannada: 'ಹೇಗೆ? (Hēge?)',
        transliteration: 'Hēge?',
        english: 'How?',
        context: 'Manner / condition inquiry.',
        breakdown: [{ word: 'ಹೇಗೆ', transliteration: 'hēge', meaning: 'How' }]
      }
    ]
  },

  // =========================================================================
  // LEVEL 3: ADVANCED (Lessons 31 - 45)
  // =========================================================================
  {
    id: 'lesson-31',
    titleKannada: 'ವಿಭಕ್ತಿ ಪ್ರತ್ಯಯಗಳು (ಕನ್ನಡದ 7 ವಿಭಕ್ತಿಗಳು)',
    titleEnglish: 'Kannada Case Markers (Vibhakti Pratyayagalu)',
    category: 'grammar',
    difficulty: 'Advanced',
    description: 'Master the 7 foundational noun cases: Nominative, Accusative, Instrumental, Dative, Ablative, Genitive, Locative.',
    durationMinutes: 16,
    phrasesCount: 7,
    objective: 'Apply precise suffixes (-annu, -inda, -ige, -alli, etc.) to build grammatical sentences.',
    pronunciationTips: 'Dative "-ige" and Locative "-alli" appear in nearly every sentence.',
    culturalNote: 'The 7 Vibhaktis form the bedrock of classical and spoken Kannada grammar documented since Kavirajamarga.',
    examples: [
      {
        speakerA: 'ಮರದಿಂದ ಹಣ್ಣು ಬಿದ್ದಿತು - ಇದರಲ್ಲಿ ಯಾವ ವಿಭಕ್ತಿ ಇದೆ?',
        translitA: 'Maradinda haṇṇu bidditu - idaralli yāva vibhakti ide?',
        englishA: '"Fruit fell from the tree" - which case is used here?',
        speakerB: '"ಮರದಿಂದ" ಪದದಲ್ಲಿ ಪಂಚಮೀ ವಿಭಕ್ತಿ (-ಇಂದ) ಇದೆ.',
        translitB: '"Maradinda" padadalli pañcamī vibhakti (-inda) ide.',
        englishB: 'In "maradinda", the 5th ablative case (-inda) is used.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Locative case ("In the house"): "ಮನೆ + ___ = ಮನೆಯಲ್ಲಿ"',
      targetText: 'ಯಲ್ಲಿ',
      options: ['ಯಲ್ಲಿ', 'ಯನ್ನು', 'ಯಿಂದ', 'ಗೆ'],
      explanation: '"-ಅಲ್ಲಿ / -ಯಲ್ಲಿ" denotes the 7th Saptamī locative case (in / at).'
    },
    quiz: [
      {
        question: 'Which suffix marks the Dative case (to / for) in Kannada?',
        options: ['-ಅನ್ನು (-annu)', '-ಇಂದ (-inda)', '-ಗೆ / -ಇಗೆ (-ge / -ige)', '-ಅಲ್ಲಿ (-alli)'],
        correctIndex: 2,
        explanation: 'The 4th Chaturthī vibhakti uses "-ge / -ige" meaning "to" or "for".'
      }
    ],
    phrases: [
      {
        id: 'p-31-1',
        kannada: 'ಪ್ರಥಮಾ: ರಾಮನು (Nominative)',
        transliteration: 'Prathamā: Rāmanu (-u)',
        english: 'Raman (Subject case)',
        context: '1st case: subject of the sentence.',
        breakdown: [{ word: 'ರಾಮನು', transliteration: 'rāmanu', meaning: 'Rama (subject)' }]
      },
      {
        id: 'p-31-2',
        kannada: 'ದ್ವಿತೀಯಾ: ಪುಸ್ತಕವನ್ನು (Accusative)',
        transliteration: 'Dvitīyā: Pustakavannu (-annu)',
        english: 'The book (Direct object case)',
        context: '2nd case: target of action.',
        breakdown: [{ word: 'ಪುಸ್ತಕವನ್ನು', transliteration: 'pustakavannu', meaning: 'the book (obj)' }]
      },
      {
        id: 'p-31-3',
        kannada: 'ತೃತೀಯಾ: ಕೈಯಿಂದ (Instrumental / By)',
        transliteration: 'Tr̥tīyā: Kaiyinda (-inda)',
        english: 'By / With the hand',
        context: '3rd case: means or instrument.',
        breakdown: [{ word: 'ಕೈಯಿಂದ', transliteration: 'kaiyinda', meaning: 'with the hand' }]
      },
      {
        id: 'p-31-4',
        kannada: 'ಚತುರ್ಥೀ: ಮನೆಗೆ / ನನಗಾಗಿ (Dative / To, For)',
        transliteration: 'Caturthī: Manege / Nanakāgi (-ge / -kāgi)',
        english: 'To the house / For me',
        context: '4th case: recipient or purpose.',
        breakdown: [{ word: 'ಮನೆಗೆ', transliteration: 'manege', meaning: 'to the home' }]
      },
      {
        id: 'p-31-5',
        kannada: 'ಪಂಚಮೀ: ಊರಿನಿಂದ (Ablative / From)',
        transliteration: 'Pañcamī: Ūrininda (-inda)',
        english: 'From the town / hometown',
        context: '5th case: point of origin.',
        breakdown: [{ word: 'ಊರಿನಿಂದ', transliteration: 'ūrininda', meaning: 'from the hometown' }]
      },
      {
        id: 'p-31-6',
        kannada: 'ಷಷ್ಠೀ: ಕರ್ನಾಟಕದ (Genitive / Of)',
        transliteration: 'Ṣaṣṭhī: Karnāṭakada (-a)',
        english: 'Of Karnataka / Karnataka\'s',
        context: '6th case: possession or association.',
        breakdown: [{ word: 'ಕರ್ನಾಟಕದ', transliteration: 'karnāṭakada', meaning: 'of Karnataka' }]
      },
      {
        id: 'p-31-7',
        kannada: 'ಸಪ್ತಮೀ: ಊರಿನಲ್ಲಿ (Locative / In, At)',
        transliteration: 'Saptamī: Ūrinalli (-alli)',
        english: 'In the town / In the city',
        context: '7th case: spatial or temporal location.',
        breakdown: [{ word: 'ಊರಿನಲ್ಲಿ', transliteration: 'ūrinalli', meaning: 'in the town' }]
      }
    ]
  },
  {
    id: 'lesson-32',
    titleKannada: 'ಸಮುಚ್ಚಯಗಳು ಮತ್ತು ಸಂಯೋಜಕಗಳು (ಮತ್ತು, ಆದರೆ, ಆದ್ದರಿಂದ)',
    titleEnglish: 'Conjunctions & Connectors (Mattu, Aadare, Aaddarinda)',
    category: 'grammar',
    difficulty: 'Advanced',
    description: 'Chain complex thoughts using connectors: and (mattu), but (ādare), therefore (āddarinda), because (ēkendre).',
    durationMinutes: 13,
    phrasesCount: 6,
    objective: 'Build flowing, compound, and complex paragraphs in speech.',
    pronunciationTips: '"Ēkendre" introduces reasons; "Āddarinda" introduces consequences.',
    culturalNote: 'Connectors elevate spoken Kannada from fragmented phrases to eloquent conversation.',
    examples: [
      {
        speakerA: 'ನೀವು ನಿನ್ನೆ ಬರಲಿಲ್ಲ, ಯಾಕೆ?',
        translitA: 'Nīvu ninne baralilla, yāke?',
        englishA: 'You did not come yesterday, why?',
        speakerB: 'ನನಗೆ ಹುಷಾರಿರಲಿಲ್ಲ, ಆದ್ದರಿಂದ ಬರಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.',
        translitB: 'Nanage huṣāriralilla, āddarinda baralu sādhyavāgalilla.',
        englishB: 'I was unwell, therefore I was not able to come.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Word for "Because": "ನಾನು ಬಂದೆ, ___ ನೀವು ಕರೆದಿದ್ದಿರಿ"',
      targetText: 'ಏಕೆಂದರೆ',
      options: ['ಏಕೆಂದರೆ', 'ಆದರೆ', 'ಆದ್ದರಿಂದ', 'ಅಥವಾ'],
      explanation: '"ಏಕೆಂದರೆ" (ēkendre) means because.'
    },
    quiz: [
      {
        question: 'Which word means "Therefore / Hence" in Kannada?',
        options: ['ಆದರೆ (Ādare)', 'ಮತ್ತು (Mattu)', 'ಆದ್ದರಿಂದ (Āddarinda)', 'ಅಥವಾ (Athavā)'],
        correctIndex: 2,
        explanation: '"ಆದ್ದರಿಂದ" (Āddarinda) means therefore / so.'
      }
    ],
    phrases: [
      {
        id: 'p-32-1',
        kannada: 'ಮತ್ತು / ಹಾಗೂ',
        transliteration: 'Mattu / hāgū',
        english: 'And / As well as',
        context: 'Joining elements.',
        breakdown: [{ word: 'ಮತ್ತು', transliteration: 'mattu', meaning: 'and' }]
      },
      {
        id: 'p-32-2',
        kannada: 'ಆದರೆ',
        transliteration: 'Ādare',
        english: 'But / However',
        context: 'Expressing contrast.',
        breakdown: [{ word: 'ಆದರೆ', transliteration: 'ādare', meaning: 'but' }]
      },
      {
        id: 'p-32-3',
        kannada: 'ಆದ್ದರಿಂದ / ಹೀಗಾಗಿ',
        transliteration: 'Āddarinda / hīgāgi',
        english: 'Therefore / Hence / As a result',
        context: 'Stating cause-effect.',
        breakdown: [{ word: 'ಆದ್ದರಿಂದ', transliteration: 'āddarinda', meaning: 'therefore' }]
      },
      {
        id: 'p-32-4',
        kannada: 'ಏಕೆಂದರೆ',
        transliteration: 'Ēkendre',
        english: 'Because / Since',
        context: 'Providing reasons.',
        breakdown: [{ word: 'ಏಕೆಂದರೆ', transliteration: 'ēkendre', meaning: 'because' }]
      },
      {
        id: 'p-32-5',
        kannada: 'ಅಥವಾ',
        transliteration: 'Athavā',
        english: 'Or / Alternatively',
        context: 'Offering options.',
        breakdown: [{ word: 'ಅಥವಾ', transliteration: 'athavā', meaning: 'or' }]
      },
      {
        id: 'p-32-6',
        kannada: 'ಅದರ ಜೊತೆಗೆ',
        transliteration: 'Adara jotege',
        english: 'In addition to that / Along with that',
        context: 'Expanding points.',
        breakdown: [{ word: 'ಅದರ ಜೊತೆಗೆ', transliteration: 'adara jotege', meaning: 'along with that' }]
      }
    ]
  },
  {
    id: 'lesson-33',
    titleKannada: 'ಷರತ್ತು ವಾಕ್ಯಗಳು (ಮಾಡಿದರೆ, ಬಂದರೆ, ಹೋದರೆ)',
    titleEnglish: 'Conditionals in Kannada (If... Then)',
    category: 'grammar',
    difficulty: 'Advanced',
    description: 'Express conditions and hypotheses: "If you come, we will go"; "If it rains, stay inside".',
    durationMinutes: 14,
    phrasesCount: 6,
    objective: 'Create conditional clauses using past stem + "-re" ending.',
    pronunciationTips: 'Attach "-re" to past stem: band-re (if you come), māḍid-re (if you do).',
    culturalNote: 'Conditionals are extensively used in business planning and daily negotiations.',
    examples: [
      {
        speakerA: 'ನಾಳೆ ಮಳೆ ಬಂದರೆ ಏನು ಮಾಡೋಣ?',
        translitA: 'Nāḷe maḷe bandare ēnu māḍōṇa?',
        englishA: 'If it rains tomorrow, what shall we do?',
        speakerB: 'ಮಳೆ ಬಂದರೆ ಮನೆಯಲ್ಲೇ ಓದೋಣ.',
        translitB: 'Maḷe bandare maneyallē ōdōṇa.',
        englishB: 'If it rains, let us study at home.'
      }
    ],
    interactiveExercise: {
      type: 'word_order',
      prompt: 'Arrange to say: "If you come, I will come"',
      targetText: 'ನೀವು ಬಂದರೆ ನಾನು ಬರುತ್ತೇನೆ',
      options: ['ಬರುತ್ತೇನೆ', 'ಬಂದರೆ', 'ನಾನು', 'ನೀವು'],
      correctOrder: ['ನೀವು', 'ಬಂದರೆ', 'ನಾನು', 'ಬರುತ್ತೇನೆ'],
      explanation: 'Condition (ನೀವು ಬಂದರೆ) + Main clause (ನಾನು ಬರುತ್ತೇನೆ).'
    },
    quiz: [
      {
        question: 'What is the conditional form of "ಮಾಡಿದರೆ" (Māḍidare)?',
        options: ['If one does', 'After doing', 'Without doing', 'While doing'],
        correctIndex: 0,
        explanation: '"ಮಾಡಿದರೆ" means "If one does / If you do".'
      }
    ],
    phrases: [
      {
        id: 'p-33-1',
        kannada: 'ನೀವು ಬಂದರೆ, ನಾವೂ ಬರುತ್ತೇವೆ',
        transliteration: 'Nīvu bandare, nāvū baruttēve',
        english: 'If you come, we too will come',
        context: 'Mutual conditional agreement.',
        breakdown: [
          { word: 'ಬಂದರೆ', transliteration: 'bandare', meaning: 'if you come' },
          { word: 'ಬರುತ್ತೇವೆ', transliteration: 'baruttēve', meaning: 'we will come' }
        ]
      },
      {
        id: 'p-33-2',
        kannada: 'ಸಮಯ ಸಿಕ್ಕಿದರೆ ಭೇಟಿಯಾಗೋಣ',
        transliteration: 'Samaya sikkidare bhēṭiyāgōṇa',
        english: 'If we get time, let us meet',
        context: 'Tentative plan.',
        breakdown: [{ word: 'ಸಿಕ್ಕಿದರೆ', transliteration: 'sikkidare', meaning: 'if obtained / found' }]
      },
      {
        id: 'p-33-3',
        kannada: 'ಅಭ್ಯಾಸ ಮಾಡಿದರೆ ಸುಲಭವಾಗುತ್ತದೆ',
        transliteration: 'Abhyāsa māḍidare sulabhavāguttade',
        english: 'If you practice, it will become easy',
        context: 'Encouraging advice.',
        breakdown: [
          { word: 'ಮಾಡಿದರೆ', transliteration: 'māḍidare', meaning: 'if done' },
          { word: 'ಸುಲಭವಾಗುತ್ತದೆ', transliteration: 'sulabhavāguttade', meaning: 'becomes easy' }
        ]
      },
      {
        id: 'p-33-4',
        kannada: 'ಹಾಗಾದರೆ (Hāgādare)',
        transliteration: 'Hāgādare',
        english: 'If so / In that case',
        context: 'Conversational pivot.',
        breakdown: [{ word: 'ಹಾಗಾದರೆ', transliteration: 'hāgādare', meaning: 'in that case' }]
      },
      {
        id: 'p-33-5',
        kannada: 'ಇಲ್ಲದಿದ್ದರೆ (Illadiddare)',
        transliteration: 'Illadiddare',
        english: 'Otherwise / If not',
        context: 'Alternative contingency.',
        breakdown: [{ word: 'ಇಲ್ಲದಿದ್ದರೆ', transliteration: 'illadiddare', meaning: 'if it is not there' }]
      },
      {
        id: 'p-33-6',
        kannada: 'ಹೇಳಿದಂತೆ ಕೇಳಿದರೆ ಒಳ್ಳೆಯದು',
        transliteration: 'Hēḷidante kēḷidare oḷḷeyadu',
        english: 'It is good if one listens as advised',
        context: 'Wise recommendation.',
        breakdown: [{ word: 'ಒಳ್ಳೆಯದು', transliteration: 'oḷḷeyadu', meaning: 'good' }]
      }
    ]
  },
  {
    id: 'lesson-34',
    titleKannada: 'ಕಚೇರಿ ಮತ್ತು ವೃತ್ತಿಪರ ಕನ್ನಡ',
    titleEnglish: 'Office & Professional Kannada',
    category: 'daily',
    difficulty: 'Advanced',
    description: 'Professional workplace communication: meetings, deadlines, emails, and collaborative etiquette.',
    durationMinutes: 14,
    phrasesCount: 6,
    objective: 'Interact with colleagues, managers, and government liaisons professionally in Karnataka.',
    pronunciationTips: '"Sabhā" means meeting. "Kāryakrama" means program / schedule.',
    culturalNote: 'Conducting meetings with Kannada introductory courtesies fosters strong local camaraderie in Bengaluru tech parks.',
    examples: [
      {
        speakerA: 'ನಮ್ಮ ಪ್ರಾಜೆಕ್ಟ್ ಸಭೆ ಯಾವಾಗ ನಿಗದಿಯಾಗಿದೆ?',
        translitA: 'Namma prājekṭ sabhe yāvāga nigadiyāgide?',
        englishA: 'When is our project meeting scheduled?',
        speakerB: 'ಮಧ್ಯಾಹ್ನ ಮೂರು ಗಂಟೆಗೆ ಸಭೆ ಇದೆ.',
        translitB: 'Madhyāhna mūru gaṇṭege sabhe ide.',
        englishB: 'The meeting is at three in the afternoon.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Word for meeting: "ಇವತ್ತು ಮಧ್ಯಾಹ್ನ ಒಂದು ___ ಇದೆ"',
      targetText: 'ಸಭೆ',
      options: ['ಸಭೆ', 'ಊಟ', 'ಮನೆ', 'ದಾರ'],
      explanation: '"ಸಭೆ" (sabhe) means meeting or conference.'
    },
    quiz: [
      {
        question: 'What is the Kannada term for "Deadline / Due Date"?',
        options: ['ಕೊನೆಯ ದಿನಾಂಕ (Koneya dināṅka)', 'ಸಮಯ (Samaya)', 'ರಜೆ (Raje)', 'ವೇತನ (Vētana)'],
        correctIndex: 0,
        explanation: '"ಕೊನೆಯ ದಿನಾಂಕ" means the last date or deadline.'
      }
    ],
    phrases: [
      {
        id: 'p-34-1',
        kannada: 'ಸಭೆಯನ್ನು ಪ್ರಾರಂಭಿಸೋಣ',
        transliteration: 'Sabheyannu prārambhisōṇa',
        english: 'Let us begin the meeting',
        context: 'Starting a conference call.',
        breakdown: [
          { word: 'ಸಭೆಯನ್ನು', transliteration: 'sabheyannu', meaning: 'the meeting' },
          { word: 'ಪ್ರಾರಂಭಿಸೋಣ', transliteration: 'prārambhisōṇa', meaning: 'let us start' }
        ]
      },
      {
        id: 'p-34-2',
        kannada: 'ಈ ಕೆಲಸದ ಕೊನೆಯ ದಿನಾಂಕ ಯಾವಾಗ?',
        transliteration: 'Ī kelasada koneya dināṅka yāvāga?',
        english: 'When is the deadline for this task?',
        context: 'Project scheduling.',
        breakdown: [{ word: 'ಕೊನೆಯ ದಿನಾಂಕ', transliteration: 'koneya dināṅka', meaning: 'last date' }]
      },
      {
        id: 'p-34-3',
        kannada: 'ನಾನು ಇಮೇಲ್ ಕಳುಹಿಸಿದ್ದೇನೆ',
        transliteration: 'Nānu imēl kaḷuhisiddēne',
        english: 'I have sent the email',
        context: 'Written confirmation.',
        breakdown: [{ word: 'ಕಳುಹಿಸಿದ್ದೇನೆ', transliteration: 'kaḷuhisiddēne', meaning: 'have sent' }]
      },
      {
        id: 'p-34-4',
        kannada: 'ನಾವು ಒಟ್ಟಿಗೆ ಕೆಲಸ ಮಾಡೋಣ',
        transliteration: 'Nāvu oṭṭige kelasa māḍōṇa',
        english: 'Let us work together',
        context: 'Team collaboration.',
        breakdown: [
          { word: 'ಒಟ್ಟಿಗೆ', transliteration: 'oṭṭige', meaning: 'together' },
          { word: 'ಮಾಡೋಣ', transliteration: 'māḍōṇa', meaning: 'let us do' }
        ]
      },
      {
        id: 'p-34-5',
        kannada: 'ವರದಿಯನ್ನು ಪರಿಶೀಲಿಸಿ',
        transliteration: 'Varadiyannu pariśīlisi',
        english: 'Please review the report',
        context: 'Requesting review.',
        breakdown: [
          { word: 'ವರದಿ', transliteration: 'varadi', meaning: 'report' },
          { word: 'ಪರಿಶೀಲಿಸಿ', transliteration: 'pariśīlisi', meaning: 'review / inspect' }
        ]
      },
      {
        id: 'p-34-6',
        kannada: 'ಯಶಸ್ಸಿಗೆ ಅಭಿನಂದನೆಗಳು',
        transliteration: 'Yaśassige abhinandanegaḷu',
        english: 'Congratulations on your success!',
        context: 'Celebrating an achievement.',
        breakdown: [{ word: 'ಅಭಿನಂದನೆಗಳು', transliteration: 'abhinandanegaḷu', meaning: 'congratulations' }]
      }
    ]
  },
  {
    id: 'lesson-35',
    titleKannada: 'ಕನ್ನಡ ಗಾದೆಗಳು ಮತ್ತು ನಾಣ್ಣುಡಿಗಳು',
    titleEnglish: 'Kannada Idioms & Proverbs (Gaadegalu)',
    category: 'basics',
    difficulty: 'Advanced',
    description: 'Learn timeless Kannada proverbs: "Gāde vēdakke samāna" (A proverb equals the Vedas in wisdom).',
    durationMinutes: 14,
    phrasesCount: 6,
    objective: 'Enrich speech with cultural proverbs that show cultural fluency.',
    pronunciationTips: 'Proverbs carry traditional rhythmic meter; recite them with confident cadence.',
    culturalNote: 'Proverbs reflect centuries of rural Karnataka philosophy and observation of nature.',
    examples: [
      {
        speakerA: 'ಕನ್ನಡದಲ್ಲಿ ಪ್ರಸಿದ್ಧ ಗಾದೆ ಯಾವುದು?',
        translitA: 'Kannaḍadalli prasiddha gāde yāvudu?',
        englishA: 'What is a famous proverb in Kannada?',
        speakerB: '"ಹಾಸಿಗೆ ಇದ್ದಷ್ಟು ಕಾಲು ಚಾಚು" - ನಮ್ಮ ಮಿತಿಯಲ್ಲಿ ಬದುಕಬೇಕು ಎಂಬ ಅರ್ಥ.',
        translitB: '"Hāsige iddaṣṭu kālu cācu" - namma mitiyalli badukabēku emba artha.',
        englishB: '"Stretch your legs only as far as the bed" - meaning live within your means.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Complete proverb: "ಹಾಸಿಗೆ ಇದ್ದಷ್ಟು ಕಾಲು ___"',
      targetText: 'ಚಾಚು',
      options: ['ಚಾಚು', 'ಮುರಿ', 'ತೊಳೆ', 'ಇಡು'],
      explanation: '"ಹಾಸಿಗೆ ಇದ್ದಷ್ಟು ಕಾಲು ಚಾಚು" advises living within one\'s resources.'
    },
    quiz: [
      {
        question: 'What does "ಮಾತು ಬೆಳ್ಳಿ, ಮೌನ ಬಂಗಾರ" mean?',
        options: ['Speech is silver, silence is gold', 'Words are heavy', 'Gold is expensive', 'Speak loudly'],
        correctIndex: 0,
        explanation: 'This classic proverb highlights the precious value of thoughtful silence.'
      }
    ],
    phrases: [
      {
        id: 'p-35-1',
        kannada: 'ಹಾಸಿಗೆ ಇದ್ದಷ್ಟು ಕಾಲು ಚಾಚು',
        transliteration: 'Hāsige iddaṣṭu kālu cācu',
        english: 'Stretch your legs only as long as your mattress (Live within means)',
        context: 'Prudent financial wisdom.',
        breakdown: [{ word: 'ಹಾಸಿಗೆ', transliteration: 'hāsige', meaning: 'mattress / bed' }]
      },
      {
        id: 'p-35-2',
        kannada: 'ಮಾತು ಬೆಳ್ಳಿ, ಮೌನ ಬಂಗಾರ',
        transliteration: 'Mātu beḷḷi, mauna baṅgāra',
        english: 'Speech is silver, silence is gold',
        context: 'Value of discretion.',
        breakdown: [
          { word: 'ಬೆಳ್ಳಿ', transliteration: 'beḷḷi', meaning: 'silver' },
          { word: 'ಬಂಗಾರ', transliteration: 'baṅgāra', meaning: 'gold' }
        ]
      },
      {
        id: 'p-35-3',
        kannada: 'ಕೈ ಕೆಸರಾದರೆ ಬಾಯಿ ಮೊಸರು',
        transliteration: 'Kai kesarādare bāyi mosaru',
        english: 'If hands get muddy with hard work, the mouth enjoys curd (Hard work bears sweet fruit)',
        context: 'Dignity of labor.',
        breakdown: [
          { word: 'ಕೆಸರು', transliteration: 'kesaru', meaning: 'mud' },
          { word: 'ಮೊಸರು', transliteration: 'mosaru', meaning: 'curd' }
        ]
      },
      {
        id: 'p-35-4',
        kannada: 'ಕುಂಬಾರನಿಗೆ ವರುಷ, ದೊಣ್ಣೆಗೆ ನಿಮಿಷ',
        transliteration: 'Kumbāranige varuṣa, doṇṇege nimiṣa',
        english: 'A year for the potter to make, a minute for the club to break (Building takes effort, destruction is instant)',
        context: 'Constructive patience.',
        breakdown: [{ word: 'ಕುಂಬಾರ', transliteration: 'kumbāra', meaning: 'potter' }]
      },
      {
        id: 'p-35-5',
        kannada: 'ಹನಿ ಹನಿ ಗೂಡಿದರೆ ಹಳ್ಳ',
        transliteration: 'Hani hani gūḍidare haḷḷa',
        english: 'Drops gathered together form a stream (Small steps lead to great achievements)',
        context: 'Patience and small savings.',
        breakdown: [{ word: 'ಹನಿ', transliteration: 'hani', meaning: 'drop' }]
      },
      {
        id: 'p-35-6',
        kannada: 'ಆಪತ್ತಿಗೆ ಆದವನೇ ನೆಂಟ',
        transliteration: 'Āpattige ādavanē neṇṭa',
        english: 'A friend in need is a friend indeed',
        context: 'True loyalty.',
        breakdown: [{ word: 'ಆಪತ್ತು', transliteration: 'āpattu', meaning: 'calamity / trouble' }]
      }
    ]
  },
  {
    id: 'lesson-36',
    titleKannada: 'ಶಿಷ್ಟ ಕನ್ನಡ ಮತ್ತು ಆಡುಮಾತಿನ ಕನ್ನಡ',
    titleEnglish: 'Formal vs Informal Register in Kannada',
    category: 'grammar',
    difficulty: 'Advanced',
    description: 'Learn to code-switch between literary/written Kannada (Grānthika) and everyday spoken colloquial forms (Āḍumātu).',
    durationMinutes: 14,
    phrasesCount: 6,
    objective: 'Seamlessly transition between formal literature and natural street conversations.',
    pronunciationTips: 'Spoken Kannada contracts endings: "hōguttēne" becomes "hōgtīni"; "māḍuttiddēne" becomes "māḍtiddīni".',
    culturalNote: 'Formal Kannada is used in media and literature; spoken Kannada is used in daily banter.',
    examples: [
      {
        speakerA: 'ಗ್ರಾಂಥಿಕ: "ನಾನು ನಾಳೆ ಬರುತ್ತೇನೆ". ಆಡುಮಾತಿನಲ್ಲಿ ಹೇಗೆ?',
        translitA: 'Grānthika: "Nānu nāḷe baruttēne". Āḍumātinali hēge?',
        englishA: 'Formal: "I will come tomorrow". How is it in spoken Kannada?',
        speakerB: 'ಆಡುಮಾತಿನಲ್ಲಿ: "ನಾನು ನಾಳೆ ಬರ್ತೀನಿ" ಎನ್ನುತ್ತಾರೆ.',
        translitB: 'Āḍumātinali: "Nānu nāḷe bartīni" ennuttāre.',
        englishB: 'In spoken Kannada: They say "Nānu nāḷe bartīni".'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Colloquial spoken contraction: "ಹೋಗುತ್ತೇನೆ" -> "ಹೋಗ್___"',
      targetText: 'ತೀನಿ',
      options: ['ತೀನಿ', 'ತಾರೆ', 'ತೀರಿ', 'ತೇವೆ'],
      explanation: 'In spoken Kannada, "-uttēne" contracts to "-tīni" (hōgtīni).'
    },
    quiz: [
      {
        question: 'Which of the following is the colloquial spoken form of "ಮಾಡುತ್ತಿದ್ದೀರಿ"?',
        options: ['ಮಾಡುತ್ತಿದ್ದಿರಿ', 'ಮಾಡ್ತಿದ್ದೀರಾ', 'ಮಾಡು', 'ಮಾಡಿದಿರಾ'],
        correctIndex: 1,
        explanation: '"ಮಾಡ್ತಿದ್ದೀರಾ" (māḍtiddīrā) is the ubiquitous spoken phrasing.'
      }
    ],
    phrases: [
      {
        id: 'p-36-1',
        kannada: 'ಗ್ರಾಂಥಿಕ: ಹೋಗುತ್ತೇನೆ -> ಆಡುಮಾತು: ಹೋಗ್ತೀನಿ',
        transliteration: 'Hōguttēne -> Hōgtīni',
        english: 'Formal: I will go -> Spoken: I\'ll go',
        context: '1st person contraction.',
        breakdown: [{ word: 'ಹೋಗ್ತೀನಿ', transliteration: 'hōgtīni', meaning: 'I will go (spoken)' }]
      },
      {
        id: 'p-36-2',
        kannada: 'ಗ್ರಾಂಥಿಕ: ಮಾಡುತ್ತಿದ್ದೇನೆ -> ಆಡುಮಾತು: ಮಾಡ್ತಿದ್ದೀನಿ',
        transliteration: 'Māḍuttiddēne -> Māḍtiddīni',
        english: 'Formal: I am doing -> Spoken: Doing it',
        context: 'Continuous contraction.',
        breakdown: [{ word: 'ಮಾಡ್ತಿದ್ದೀನಿ', transliteration: 'māḍtiddīni', meaning: 'am doing (spoken)' }]
      },
      {
        id: 'p-36-3',
        kannada: 'ಗ್ರಾಂಥಿಕ: ಏನು ಮಾಡುತ್ತಿದ್ದೀರಿ? -> ಆಡುಮಾತು: ಏನ್ ಮಾಡ್ತಿದ್ದೀರಾ?',
        transliteration: 'Ēnu māḍuttiddīri? -> Ēn māḍtiddīrā?',
        english: 'Formal: What are you doing? -> Spoken: What\'s up / what are you up to?',
        context: 'Everyday street inquiry.',
        breakdown: [{ word: 'ಏನ್ ಮಾಡ್ತಿದ್ದೀರಾ', transliteration: 'ēn māḍtiddīrā', meaning: 'what are you doing' }]
      },
      {
        id: 'p-36-4',
        kannada: 'ಗ್ರಾಂಥಿಕ: ಬರುವುದಿಲ್ಲ -> ಆಡುಮಾತು: ಬರಲ್ಲ',
        transliteration: 'Baruvudilla -> Baralla',
        english: 'Formal: Will not come -> Spoken: Won\'t come',
        context: 'Negative contraction.',
        breakdown: [{ word: 'ಬರಲ್ಲ', transliteration: 'baralla', meaning: 'won\'t come' }]
      },
      {
        id: 'p-36-5',
        kannada: 'ಗ್ರಾಂಥಿಕ: ಏಕೆ? -> ಆಡುಮಾತು: ಯಾಕೆ?',
        transliteration: 'Ēke? -> Yāke?',
        english: 'Formal: Why? -> Spoken: Why?',
        context: 'Interrogative shift.',
        breakdown: [{ word: 'ಯಾಕೆ', transliteration: 'yāke', meaning: 'why' }]
      },
      {
        id: 'p-36-6',
        kannada: 'ಗ್ರಾಂಥಿಕ: ಇರುವುದಿಲ್ಲ -> ಆಡುಮಾತು: ಇರಲ್ಲ',
        transliteration: 'Iruvudilla -> Iralla',
        english: 'Formal: Does not remain -> Spoken: Won\'t be there',
        context: 'Existence contraction.',
        breakdown: [{ word: 'ಇರಲ್ಲ', transliteration: 'iralla', meaning: 'won\'t be' }]
      }
    ]
  },
  {
    id: 'lesson-37',
    titleKannada: 'ಕರ್ನಾಟಕದ ಹಬ್ಬಗಳು ಮತ್ತು ಆಚರಣೆಗಳು',
    titleEnglish: 'Karnataka Festivals & Celebrations',
    category: 'basics',
    difficulty: 'Advanced',
    description: 'Learn cultural vocabulary for Ugadi (New Year), Mysuru Dasara, Kannada Rajyotsava, and Sankranti.',
    durationMinutes: 13,
    phrasesCount: 6,
    objective: 'Wish friends and share joy during premier Karnataka festivals.',
    pronunciationTips: 'Recite "Rajyotsava" clearly: Rāj-yōt-sava.',
    culturalNote: 'Kannada Rajyotsava on November 1st celebrates the unified Karnataka state formed in 1956.',
    examples: [
      {
        speakerA: 'ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವದ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು!',
        translitA: 'Kannaḍa rājyōtsavada hārdika śubhāśayagaḷu!',
        englishA: 'Hearty greetings on Kannada Rajyotsava!',
        speakerB: 'ನಿಮಗೂ ರಾಜ್ಯೋತ್ಸವದ ಶುಭಾಶಯಗಳು! ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ!',
        translitB: 'Nimagu rājyōtsavada śubhāśayagaḷu! Sirigannaḍaṁ gelge!',
        englishB: 'Greetings to you too on Rajyotsava! May prosperous Kannada triumph!'
      }
    ],
    interactiveExercise: {
      type: 'word_order',
      prompt: 'Arrange to say: "Happy Ugadi greetings to you"',
      targetText: 'ನಿಮಗೆ ಯುಗಾದಿ ಹಬ್ಬದ ಶುಭಾಶಯಗಳು',
      options: ['ಶುಭಾಶಯಗಳು', 'ಹಬ್ಬದ', 'ಯುಗಾದಿ', 'ನಿಮಗೆ'],
      correctOrder: ['ನಿಮಗೆ', 'ಯುಗಾದಿ', 'ಹಬ್ಬದ', 'ಶುಭಾಶಯಗಳು'],
      explanation: 'Dative (ನಿಮಗೆ) + Festival (ಯುಗಾದಿ ಹಬ್ಬದ) + Greetings (ಶುಭಾಶಯಗಳು).'
    },
    quiz: [
      {
        question: 'Which city hosts the world-famous 10-day Dasara Jamboo Savari procession?',
        options: ['ಬೆಂಗಳೂರು (Bengaluru)', 'ಮೈಸೂರು (Mysuru)', 'ಹುಬ್ಬಳ್ಳಿ (Hubballi)', 'ಮಂಗಳೂರು (Mangaluru)'],
        correctIndex: 1,
        explanation: 'Mysuru Dasara is celebrated with legendary royal majesty and the golden howdah.'
      }
    ],
    phrases: [
      {
        id: 'p-37-1',
        kannada: 'ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವದ ಶುಭಾಶಯಗಳು',
        transliteration: 'Kannaḍa rājyōtsavada śubhāśayagaḷu',
        english: 'Happy Kannada Rajyotsava (Karnataka Formation Day)',
        context: 'November 1st celebrations.',
        breakdown: [{ word: 'ರಾಜ್ಯೋತ್ಸವ', transliteration: 'rājyōtsava', meaning: 'state festival' }]
      },
      {
        id: 'p-37-2',
        kannada: 'ಯುಗಾದಿ ಹಬ್ಬದ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು',
        transliteration: 'Yugādi habbada hārdika śubhāśayagaḷu',
        english: 'Warm greetings for Ugadi New Year',
        context: 'Kannada New Year greeting.',
        breakdown: [{ word: 'ಯುಗಾದಿ', transliteration: 'yugādi', meaning: 'beginning of an era' }]
      },
      {
        id: 'p-37-3',
        kannada: 'ಬೇವಿನ ಬೆಲ್ಲ (Bēvina bella)',
        transliteration: 'Bēvina bella',
        english: 'Neem and Jaggery (Symbolizing acceptance of bitter and sweet in life)',
        context: 'Ugadi symbolic food.',
        breakdown: [
          { word: 'ಬೇವು', transliteration: 'bēvu', meaning: 'neem (bitter)' },
          { word: 'ಬೆಲ್ಲ', transliteration: 'bella', meaning: 'jaggery (sweet)' }
        ]
      },
      {
        id: 'p-37-4',
        kannada: 'ಮೈಸೂರು ದಸರಾ ವೈಭವ',
        transliteration: 'Maisūru dasarā vaibhava',
        english: 'The grandeur of Mysuru Dasara',
        context: 'Karnataka Nadahabba.',
        breakdown: [{ word: 'ವೈಭವ', transliteration: 'vaibhava', meaning: 'grandeur / majesty' }]
      },
      {
        id: 'p-37-5',
        kannada: 'ಎಳ್ಳು-ಬೆಲ್ಲ ತಿಂದು ಒಳ್ಳೆಯ ಮಾತಾಡಿ',
        transliteration: 'Eḷḷu-bella tindu oḷḷeya mātāḍi',
        english: 'Eat sesame and jaggery, and speak sweet words (Sankranti saying)',
        context: 'Makara Sankranti tradition.',
        breakdown: [{ word: 'ಎಳ್ಳು-ಬೆಲ್ಲ', transliteration: 'eḷḷu-bella', meaning: 'sesame-jaggery' }]
      },
      {
        id: 'p-37-6',
        kannada: 'ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ',
        transliteration: 'Sirigannaḍaṁ gelge, sirigannaḍaṁ bāḷge',
        english: 'May glorious Kannada flourish, may glorious Kannada prosper',
        context: 'Historic cultural motto coined in 5th-century Kadamba inscriptions.',
        breakdown: [{ word: 'ಗೆಲ್ಗೆ', transliteration: 'gelge', meaning: 'may it win/triumph' }]
      }
    ]
  },
  {
    id: 'lesson-38',
    titleKannada: 'ಕರ್ನಾಟಕ ಇತಿಹಾಸ ಮತ್ತು ಪರಂಪರೆ',
    titleEnglish: 'Karnataka History & Heritage',
    category: 'basics',
    difficulty: 'Advanced',
    description: 'Explore the dynasties, architecture, and milestones: Kadambas, Chalukyas, Hoysalas, and Vijayanagara.',
    durationMinutes: 14,
    phrasesCount: 6,
    objective: 'Narrate Karnataka\'s civilizational contributions in fluent Kannada.',
    pronunciationTips: '"Halmidi" is the site of the oldest known Kannada inscription (450 CE).',
    culturalNote: 'Hampi and Belur-Halebeedu are UNESCO World Heritage sites showcasing extraordinary stone craftsmanship.',
    examples: [
      {
        speakerA: 'ಕನ್ನಡದ ಅತ್ಯಂತ ಹಳೆಯ ಶಾಸನ ಯಾವುದು?',
        translitA: 'Kannaḍada atyanta haḷeya śāsana yāvudu?',
        englishA: 'Which is the oldest inscription in Kannada?',
        speakerB: 'ಅದು ಕ್ರಿ.ಶ. 450 ರ "ಹಲ್ಮಿಡಿ ಶಾಸನ"ವಾಗಿದೆ.',
        translitB: 'Adu kri.śa. 450 ra "Halmiḍi śāsanavāgide".',
        englishB: 'It is the "Halmidi inscription" of 450 CE.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Word for stone inscription: "ಹಲ್ಮಿಡಿ ___"',
      targetText: 'ಶಾಸನ',
      options: ['ಶಾಸನ', 'ಪುಸ್ತಕ', 'ಮನೆ', 'ದಾರ'],
      explanation: '"ಶಾಸನ" (śāsana) means stone edict / inscription.'
    },
    quiz: [
      {
        question: 'Which empire had its magnificent capital at Hampi on the banks of Tungabhadra?',
        options: ['ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯ (Vijayanagara Empire)', 'ಮೊಘಲ್ (Mughals)', 'ಚೋಳ (Cholas)', 'ಮೌರ್ಯ (Mauryas)'],
        correctIndex: 0,
        explanation: 'Vijayanagara Empire ruled from Hampi during the 14th to 16th centuries.'
      }
    ],
    phrases: [
      {
        id: 'p-38-1',
        kannada: 'ಹಲ್ಮಿಡಿ ಶಾಸನ (ಕ್ರಿ.ಶ. 450)',
        transliteration: 'Halmiḍi śāsana',
        english: 'Halmidi Inscription (Earliest recorded Kannada epigraph)',
        context: 'Historical milestone.',
        breakdown: [{ word: 'ಶಾಸನ', transliteration: 'śāsana', meaning: 'inscription' }]
      },
      {
        id: 'p-38-2',
        kannada: 'ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯ ಮತ್ತು ಹಂಪಿ',
        transliteration: 'Vijayanagara sāmrājya mattu hampi',
        english: 'Vijayanagara Empire and Hampi',
        context: 'Golden era of southern architecture.',
        breakdown: [{ word: 'ಸಾಮ್ರಾಜ್ಯ', transliteration: 'sāmrājya', meaning: 'empire' }]
      },
      {
        id: 'p-38-3',
        kannada: 'ಹೊಯ್ಸಳರ ಶಿಲ್ಪಕಲೆ (ಬೇಲೂರು-ಹಳೇಬೀಡು)',
        transliteration: 'Hoysaḷara śilpakale (Bēlūru-Haḷēbīḍu)',
        english: 'Hoysala temple sculpture (Belur and Halebidu)',
        context: 'Soapstone masterworks.',
        breakdown: [{ word: 'ಶಿಲ್ಪಕಲೆ', transliteration: 'śilpakale', meaning: 'sculpture / architecture' }]
      },
      {
        id: 'p-38-4',
        kannada: 'ಕವಿರಾಜಮಾರ್ಗ (ಕ್ರಿ.ಶ. 850)',
        transliteration: 'Kavirājamārga',
        english: 'Kavirajamarga (First available literary and poetics work in Kannada)',
        context: 'Rashtrakuta era literary landmark.',
        breakdown: [{ word: 'ಕವಿರಾಜಮಾರ್ಗ', transliteration: 'kavirājamārga', meaning: 'Path of royal poets' }]
      },
      {
        id: 'p-38-5',
        kannada: 'ಕಾವೇರಿಯಿಂದಮಾ ಗೋದಾವರಿವರಮಿರ್ಪ ನಾಡದು ಕನ್ನಡ',
        transliteration: 'Kāvēriyindamā gōdāvarivaramirpa nāḍadu kannaḍa',
        english: '"The land that stretches from Kaveri to Godavari is Kannada" (Kavirajamarga definition)',
        context: 'Ancient geography of Kannada region.',
        breakdown: [{ word: 'ನಾಡದು', transliteration: 'nāḍadu', meaning: 'that is the land' }]
      },
      {
        id: 'p-38-6',
        kannada: 'ಶ್ರವಣಬೆಳಗೊಳದ ಗೊಮ್ಮಟೇಶ್ವರ ಬಾಹುಬಲಿ',
        transliteration: 'Śravaṇabeḷagoḷada Gommaṭēśvara Bāhubali',
        english: 'Gommateshwara statue at Shravanabelagola (57-foot monolithic masterpiece)',
        context: 'World-renowned monolithic sculpture.',
        breakdown: [{ word: 'ಗೊಮ್ಮಟೇಶ್ವರ', transliteration: 'gommaṭēśvara', meaning: 'Lord Bahubali' }]
      }
    ]
  },
  {
    id: 'lesson-39',
    titleKannada: 'ವಚನ ಸಾಹಿತ್ಯ ಮತ್ತು ಬಸವಣ್ಣನವರ ತತ್ವ',
    titleEnglish: 'Vachana Literature & Philosophy of Basavanna',
    category: 'basics',
    difficulty: 'Advanced',
    description: 'Learn the egalitarian poetry of the 12th century Sharana movement: Basavanna, Allama Prabhu, and Akka Mahadevi.',
    durationMinutes: 14,
    phrasesCount: 6,
    objective: 'Appreciate moral, ethical, and spiritual verses composed in simple, spoken Kannada.',
    pronunciationTips: 'Recite "Kāyakavē Kailāsa" with reverence for hard work.',
    culturalNote: 'Vachanas democratized literature by writing profound philosophy in the language of common workers.',
    examples: [
      {
        speakerA: 'ಬಸವಣ್ಣನವರ ಪ್ರಮುಖ ಸಂದೇಶ ಯಾವುದು?',
        translitA: 'Basavaṇṇanavara pramukha sandēśa yāvudu?',
        englishA: 'What is the primary message of Basavanna?',
        speakerB: '"ಕಾಯಕವೇ ಕೈಲಾಸ" (Work is worship) ಅವರ ಪ್ರಮುಖ ಸಂದೇಶ.',
        translitB: '"Kāyakavē kailāsa" avara pramukha sandēśa.',
        englishB: '"Work is worship" is his foremost message.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Complete Basavanna\'s motto: "ಕಾಯಕವೇ ___"',
      targetText: 'ಕೈಲಾಸ',
      options: ['ಕೈಲಾಸ', 'ಮನೆ', 'ದೇವಸ್ಥಾನ', 'ಪುಸ್ತಕ'],
      explanation: '"ಕಾಯಕವೇ ಕೈಲಾಸ" equates sincere honest labor with heaven itself.'
    },
    quiz: [
      {
        question: 'Who is the celebrated 12th century female mystic poet of the Vachana movement?',
        options: ['ಅಕ್ಕ ಮಹಾದೇವಿ (Akka Mahadevi)', 'ಕಿತ್ತೂರು ಚೆನ್ನಮ್ಮ', 'ಒನಕೆ ಓಬವ್ವ', 'ರಾಣಿ ಅಬ್ಬಕ್ಕ'],
        correctIndex: 0,
        explanation: 'Akka Mahadevi composed sublime mystical vachanas addressed to Chennamallikarjuna.'
      }
    ],
    phrases: [
      {
        id: 'p-39-1',
        kannada: 'ಕಾಯಕವೇ ಕೈಲಾಸ',
        transliteration: 'Kāyakavē kailāsa',
        english: 'Work is heaven / Work is worship',
        context: 'Core philosophy of Basavanna.',
        breakdown: [
          { word: 'ಕಾಯಕ', transliteration: 'kāyaka', meaning: 'dedicated honest work' },
          { word: 'ಕೈಲಾಸ', transliteration: 'kailāsa', meaning: 'heaven / divine abode' }
        ]
      },
      {
        id: 'p-39-2',
        kannada: 'ಇವನಾರವ ಇವನಾರವ ಎಂದೆನಿಸದಿರಯ್ಯ',
        transliteration: 'Ivanārava ivanārava endenisadirayya',
        english: 'Do not ask "Who is he, who is he?" (Treat no one as an outsider)',
        context: 'Universal brotherhood.',
        breakdown: [{ word: 'ಇವನಾರವ', transliteration: 'ivanārava', meaning: 'whose man is he?' }]
      },
      {
        id: 'p-39-3',
        kannada: 'ಇವ ನಮ್ಮವ, ಇವ ನಮ್ಮವ ಎಂದೆನಿಸಯ್ಯ',
        transliteration: 'Iva nammava, iva nammava endenisayya',
        english: 'Say "He is ours, he is ours" (Embrace all with love)',
        context: 'Inclusivity verse.',
        breakdown: [{ word: 'ಇವ ನಮ್ಮವ', transliteration: 'iva nammava', meaning: 'he is one of us' }]
      },
      {
        id: 'p-39-4',
        kannada: 'ನುಡಿದರೆ ಮುತ್ತಿನ ಹಾರದಂತಿರಬೇಕು',
        transliteration: 'Nuḍidare muttina hāradantirabēku',
        english: 'When you speak, your words should be like a pearl necklace',
        context: 'Etiquette of speech.',
        breakdown: [
          { word: 'ನುಡಿದರೆ', transliteration: 'nuḍidare', meaning: 'if you speak' },
          { word: 'ಮುತ್ತು', transliteration: 'muttu', meaning: 'pearl' }
        ]
      },
      {
        id: 'p-39-5',
        kannada: 'ಆಚಾರವೇ ಸ್ವರ್ಗ, ಅನಾಚಾರವೇ ನರಕ',
        transliteration: 'Ācāravē svarga, anācāravē naraka',
        english: 'Right conduct is heaven; misconduct is hell',
        context: 'Moral compass.',
        breakdown: [{ word: 'ಆಚಾರ', transliteration: 'ācāra', meaning: 'right conduct' }]
      },
      {
        id: 'p-39-6',
        kannada: 'ಕಳಬೇಡ, ಕೊಲಬೇಡ, ಹುಸಿಯ ನುಡಿಯಲು ಬೇಡ',
        transliteration: 'Kaḷabēḍa, kolabēḍa, husiya nuḍiyalu bēḍa',
        english: 'Do not steal, do not kill, do not utter lies (Basavanna\'s 7 commandments)',
        context: 'Foundational moral code.',
        breakdown: [
          { word: 'ಕಳಬೇಡ', transliteration: 'kaḷabēḍa', meaning: 'do not steal' },
          { word: 'ಹುಸಿ', transliteration: 'husi', meaning: 'lie' }
        ]
      }
    ]
  },
  {
    id: 'lesson-40',
    titleKannada: 'ಸಾಮಾಜಿಕ ಶಿಷ್ಟಾಚಾರ ಮತ್ತು ಸೌಜನ್ಯದ ಸಂಭಾಷಣೆ',
    titleEnglish: 'Social Etiquette & Gracious Discourse',
    category: 'daily',
    difficulty: 'Advanced',
    description: 'Learn honorific titles (Re, Avare, Sir/Madam), respectful disagreement, and diplomatic conversation.',
    durationMinutes: 13,
    phrasesCount: 6,
    objective: 'Express differing opinions without causing offense in professional and personal contexts.',
    pronunciationTips: 'Appending "-avare" to names shows immense polite regard: e.g. "Kumar avare".',
    culturalNote: 'Respectful address creates instant goodwill and deep mutual trust in Karnataka society.',
    examples: [
      {
        speakerA: 'ನನ್ನ ಅಭಿಪ್ರಾಯ ಸ್ವಲ್ಪ ಭಿನ್ನವಾಗಿದೆ, ಕುಮಾರ್ ಅವರೇ.',
        translitA: 'Nanna abhiprāya svalpa bhinnavāgide, Kumār avarē.',
        englishA: 'My opinion is slightly different, Mr. Kumar.',
        speakerB: 'ಖಂಡಿತ, ನಿಮ್ಮ ಅನಿಸಿಕೆಯನ್ನು ಹೇಳಿ.',
        translitB: 'Khaṇḍita, nimma anisikeyannu hēḷi.',
        englishB: 'Certainly, please share your thought.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Polite name honorific: "ರಮೇಶ್ ___"',
      targetText: 'ಅವರೇ',
      options: ['ಅವರೇ', 'ಅವನು', 'ಇವನು', 'ನೀನು'],
      explanation: 'Appending "-ಅವರೇ" (-avarē) creates polite respectful address.'
    },
    quiz: [
      {
        question: 'How do you say "In my humble opinion" in Kannada?',
        options: ['ನನ್ನ ಅಭಿಪ್ರಾಯದಲ್ಲಿ (Nanna abhiprāyadalli)', 'ನನಗೆ ಬೇಡ', 'ಹೋಗಿ ಬನ್ನಿ', 'ನೋಡಿ'],
        correctIndex: 0,
        explanation: '"ನನ್ನ ಅಭಿಪ್ರಾಯದಲ್ಲಿ" translates to "In my opinion".'
      }
    ],
    phrases: [
      {
        id: 'p-40-1',
        kannada: 'ನನ್ನ ಅಭಿಪ್ರಾಯದಲ್ಲಿ...',
        transliteration: 'Nanna abhiprāyadalli...',
        english: 'In my humble opinion...',
        context: 'Introducing personal viewpoint.',
        breakdown: [{ word: 'ಅಭಿಪ್ರಾಯ', transliteration: 'abhiprāya', meaning: 'opinion' }]
      },
      {
        id: 'p-40-2',
        kannada: 'ನೀವು ಹೇಳುವುದು ಸರಿ, ಆದರೂ...',
        transliteration: 'Nīvu hēḷuvudu sari, ādarū...',
        english: 'What you say is right, however...',
        context: 'Diplomatic partial agreement.',
        breakdown: [
          { word: 'ಸರಿ', transliteration: 'sari', meaning: 'correct' },
          { word: 'ಆದರೂ', transliteration: 'ādarū', meaning: 'still / however' }
        ]
      },
      {
        id: 'p-40-3',
        kannada: 'ದಯವಿಟ್ಟು ಬೇಸರ ಮಾಡಿಕೊಳ್ಳಬೇಡಿ',
        transliteration: 'Dayaviṭṭu bēsara māḍikoḷḷabēḍi',
        english: 'Please do not take it amiss / feel offended',
        context: 'Polite pre-caution.',
        breakdown: [{ word: 'ಬೇಸರ', transliteration: 'bēsara', meaning: 'offense / displeasure' }]
      },
      {
        id: 'p-40-4',
        kannada: 'ನಿಮ್ಮ ಸಹಕಾರಕ್ಕೆ ಧನ್ಯವಾದಗಳು',
        transliteration: 'Nimma sahakārakke dhan\'yavādagaḷu',
        english: 'Thank you very much for your cooperation',
        context: 'Acknowledging teamwork.',
        breakdown: [{ word: 'ಸಹಕಾರ', transliteration: 'sahakāra', meaning: 'cooperation' }]
      },
      {
        id: 'p-40-5',
        kannada: 'ತುಂಬಾ ಉಪಕಾರವಾಯಿತು',
        transliteration: 'Tumbā upakāravāyitu',
        english: 'You have done a great kindness / favor',
        context: 'Deep heartfelt gratitude.',
        breakdown: [{ word: 'ಉಪಕಾರ', transliteration: 'upakāra', meaning: 'benefaction / favor' }]
      },
      {
        id: 'p-40-6',
        kannada: 'ನಾನು ನಿಮ್ಮೊಂದಿಗೆ ಸಂಪೂರ್ಣವಾಗಿ ಸಮ್ಮತಿಸುತ್ತೇನೆ',
        transliteration: 'Nānu nimmondige sampūrṇavāgi sammatisuttēne',
        english: 'I completely agree with you',
        context: 'Total consensus.',
        breakdown: [{ word: 'ಸಮ್ಮತಿಸುತ್ತೇನೆ', transliteration: 'sammatisuttēne', meaning: 'I agree' }]
      }
    ]
  },
  {
    id: 'lesson-41',
    titleKannada: 'ಬ್ಯಾಂಕಿಂಗ್ ಮತ್ತು ಆರ್ಥಿಕ ವಹಿವಾಟುಗಳು',
    titleEnglish: 'Banking & Financial Transactions',
    category: 'shopping',
    difficulty: 'Advanced',
    description: 'Learn terms for bank accounts, deposits, loans, interest, cheques, and official procedures.',
    durationMinutes: 13,
    phrasesCount: 6,
    objective: 'Manage bank teller interactions, account openings, and documentation in Kannada.',
    pronunciationTips: '"Khāte" means account. "Hana" means money / funds.',
    culturalNote: 'Public sector banks in Karnataka offer comprehensive service in Kannada at all counters.',
    examples: [
      {
        speakerA: 'ನಾನು ಹೊಸ ಉಳಿತಾಯ ಖಾತೆ ತೆರೆಯಬೇಕು.',
        translitA: 'Nānu hosa uḷitāya khāte tereyabēku.',
        englishA: 'I need to open a new savings account.',
        speakerB: 'ದಯವಿಟ್ಟು ಈ ಅರ್ಜಿ ತುಂಬಿ ಮತ್ತು ಆಧಾರ್ ಕಾರ್ಡ್ ನಕಲು ಕೊಡಿ.',
        translitB: 'Dayaviṭṭu ī arji tumbi mattu ādhār kārḍ nakalu koḍi.',
        englishB: 'Please fill this application and provide an Aadhaar card photocopy.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Word for savings account: "ಉಳಿತಾಯ ___"',
      targetText: 'ಖಾತೆ',
      options: ['ಖಾತೆ', 'ಮನೆ', 'ದಾರ', 'ರಸ್ತೆ'],
      explanation: '"ಖಾತೆ" (khāte) means account.'
    },
    quiz: [
      {
        question: 'What is the Kannada term for "Loan / Debt"?',
        options: ['ಸಾಲ (Sāla)', 'ಉಡುಗೊರೆ (Uḍugore)', 'ವೇತನ (Vētana)', 'ಖರ್ಚು (Kharcu)'],
        correctIndex: 0,
        explanation: '"ಸಾಲ" (Sāla) means loan or debt.'
      }
    ],
    phrases: [
      {
        id: 'p-41-1',
        kannada: 'ಹೊಸ ಖಾತೆ ತೆರೆಯಬೇಕು',
        transliteration: 'Hosa khāte tereyabēku',
        english: 'I want to open a new account',
        context: 'Bank manager inquiry.',
        breakdown: [
          { word: 'ಖಾತೆ', transliteration: 'khāte', meaning: 'account' },
          { word: 'ತೆರೆಯಬೇಕು', transliteration: 'tereyabēku', meaning: 'need to open' }
        ]
      },
      {
        id: 'p-41-2',
        kannada: 'ಹಣ ಜಮೆ ಮಾಡುವುದು ಮತ್ತು ಹಿಂಪಡೆಯುವುದು',
        transliteration: 'Haṇa jame māḍuvudu mattu himpaḍeyuvudu',
        english: 'Depositing money and Withdrawing money',
        context: 'Cash counter transactions.',
        breakdown: [
          { word: 'ಜಮೆ', transliteration: 'jame', meaning: 'deposit' },
          { word: 'ಹಿಂಪಡೆಯುವುದು', transliteration: 'himpaḍeyuvudu', meaning: 'withdrawal' }
        ]
      },
      {
        id: 'p-41-3',
        kannada: 'ಪಾಸ್‌ಬುಕ್ ಎಂಟ್ರಿ ಮಾಡಿಸಬೇಕು',
        transliteration: 'Pāsbuk enṭri māḍisabēku',
        english: 'I need to get my passbook printed / updated',
        context: 'Kiosk printing.',
        breakdown: [{ word: 'ಪಾಸ್‌ಬುಕ್', transliteration: 'pāsbuk', meaning: 'passbook' }]
      },
      {
        id: 'p-41-4',
        kannada: 'ಬಡ್ಡಿ ದರ ಎಷ್ಟು?',
        transliteration: 'Baḍḍi dara eṣṭu?',
        english: 'What is the interest rate?',
        context: 'Fixed deposit inquiry.',
        breakdown: [
          { word: 'ಬಡ್ಡಿ', transliteration: 'baḍḍi', meaning: 'interest' },
          { word: 'ದರ', transliteration: 'dara', meaning: 'rate' }
        ]
      },
      {
        id: 'p-41-5',
        kannada: 'ಸಹಿ ಇಲ್ಲಿ ಮಾಡಿ',
        transliteration: 'Sahi illi māḍi',
        english: 'Please sign here',
        context: 'Document execution.',
        breakdown: [
          { word: 'ಸಹಿ', transliteration: 'sahi', meaning: 'signature' },
          { word: 'ಮಾಡಿ', transliteration: 'māḍi', meaning: 'do / put' }
        ]
      },
      {
        id: 'p-41-6',
        kannada: 'ಅರ್ಜಿ ನಮೂನೆ (Arji namūne)',
        transliteration: 'Arji namūne',
        english: 'Application form',
        context: 'Official paperwork.',
        breakdown: [{ word: 'ಅರ್ಜಿ', transliteration: 'arji', meaning: 'application' }]
      }
    ]
  },
  {
    id: 'lesson-42',
    titleKannada: 'ತುರ್ತು ಪರಿಸ್ಥಿತಿ ಮತ್ತು ಸಹಾಯ ಕೋರಿಕೆ',
    titleEnglish: 'Emergency Situations & Calling for Help',
    category: 'health',
    difficulty: 'Advanced',
    description: 'Crucial emergency vocabulary: police, ambulance, fire accidents, lost belongings, and reporting incidents.',
    durationMinutes: 12,
    phrasesCount: 6,
    objective: 'Summon urgent help, report road accidents, and guide first responders.',
    pronunciationTips: '"Kāpāḍi" (Save me/us!) is the distress cry for life-threatening situations.',
    culturalNote: 'Emergency helpline 112 connects immediately to integrated emergency services in Karnataka.',
    examples: [
      {
        speakerA: 'ಕಾಪಾಡಿ! ಇಲ್ಲಿ ಅಪಘಾತವಾಗಿದೆ!',
        translitA: 'Kāpāḍi! Illi apaghātavāgide!',
        englishA: 'Save us! An accident has occurred here!',
        speakerB: 'ತಕ್ಷಣ ಆಂಬ್ಯುಲೆನ್ಸ್‌ಗೆ ಕರೆ ಮಾಡಿ, ನಾನು ಸಹಾಯಕ್ಕೆ ಬರುತ್ತೇನೆ.',
        translitB: 'Takṣaṇa āmbyulens\'ge kare māḍi, nānu sahāyakke baruttēne.',
        englishB: 'Call an ambulance immediately, I am coming to help.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Word for accident: "ಇಲ್ಲಿ ಒಂದು ___ ಆಗಿದೆ"',
      targetText: 'ಅಪಘಾತ',
      options: ['ಅಪಘಾತ', 'ಊಟ', 'ಮನೆ', 'ಖಾತೆ'],
      explanation: '"ಅಪಘಾತ" (apaghāta) means accident.'
    },
    quiz: [
      {
        question: 'What does "ಕಾಪಾಡಿ!" (Kāpāḍi!) mean?',
        options: ['Look here!', 'Help / Save me!', 'Stop now!', 'Go away!'],
        correctIndex: 1,
        explanation: '"ಕಾಪಾಡಿ!" is the urgent distress plea meaning "Save / Rescue me!".'
      }
    ],
    phrases: [
      {
        id: 'p-42-1',
        kannada: 'ಕಾಪಾಡಿ! / ಸಹಾಯ ಮಾಡಿ!',
        transliteration: 'Kāpāḍi! / Sahāya māḍi!',
        english: 'Save me! / Help me!',
        context: 'Urgent distress shout.',
        breakdown: [{ word: 'ಕಾಪಾಡಿ', transliteration: 'kāpāḍi', meaning: 'save / protect' }]
      },
      {
        id: 'p-42-2',
        kannada: 'ತಕ್ಷಣ ಆಂಬ್ಯುಲೆನ್ಸ್ ಕರೆಯಿರಿ',
        transliteration: 'Takṣaṇa āmbyulens kareyiri',
        english: 'Call an ambulance immediately',
        context: 'Medical crisis.',
        breakdown: [
          { word: 'ತಕ್ಷಣ', transliteration: 'takṣaṇa', meaning: 'immediately' },
          { word: 'ಕರೆಯಿರಿ', transliteration: 'kareyiri', meaning: 'call (polite)' }
        ]
      },
      {
        id: 'p-42-3',
        kannada: 'ಪೊಲೀಸ್ ಠಾಣೆ ಎಲ್ಲಿದೆ?',
        transliteration: 'Polīs ṭhāṇe ellide?',
        english: 'Where is the police station?',
        context: 'Reporting a crime or issue.',
        breakdown: [{ word: 'ಠಾಣೆ', transliteration: 'ṭhāṇe', meaning: 'station' }]
      },
      {
        id: 'p-42-4',
        kannada: 'ನನ್ನ ಬ್ಯಾಗ್ ಕಳೆದುಹೋಗಿದೆ',
        transliteration: 'Nanna byāg kaḷeduhōgide',
        english: 'My bag has been lost / misplaced',
        context: 'Reporting lost property.',
        breakdown: [{ word: 'ಕಳೆದುಹೋಗಿದೆ', transliteration: 'kaḷeduhōgide', meaning: 'is lost' }]
      },
      {
        id: 'p-42-5',
        kannada: 'ಇಲ್ಲಿ ಬೆಂಕಿ ಬಿದ್ದಿದೆ',
        transliteration: 'Illi benki biddide',
        english: 'A fire has broken out here',
        context: 'Fire department alarm.',
        breakdown: [
          { word: 'ಬೆಂಕಿ', transliteration: 'benki', meaning: 'fire' },
          { word: 'ಬಿದ್ದಿದೆ', transliteration: 'biddide', meaning: 'has fallen / occurred' }
        ]
      },
      {
        id: 'p-42-6',
        kannada: 'ಹೆದರಬೇಡಿ, ಎಲ್ಲವೂ ಸರಿಹೋಗುತ್ತದೆ',
        transliteration: 'Hedarabēḍi, ellavū sarihōguttade',
        english: 'Do not be afraid, everything will be all right',
        context: 'Calming an injured or anxious person.',
        breakdown: [{ word: 'ಹೆದರಬೇಡಿ', transliteration: 'hedarabēḍi', meaning: 'do not fear' }]
      }
    ]
  },
  {
    id: 'lesson-43',
    titleKannada: 'ಕರ್ನಾಟಕ ಪ್ರವಾಸ (ಹಂಪಿ, ಕೊಡಗು, ಕರಾವಳಿ)',
    titleEnglish: 'Karnataka Travel Guide (Hampi, Coorg, Coastal Karavali)',
    category: 'travel',
    difficulty: 'Advanced',
    description: 'Explore Karnataka\'s top destinations: Western Ghats, coffee estates of Madikeri, and pristine beaches of Gokarna.',
    durationMinutes: 14,
    phrasesCount: 6,
    objective: 'Plan travel itineraries, book homestays, and discuss tourism in Kannada.',
    pronunciationTips: '"Karāvaḷi" refers to Karnataka\'s 320-kilometer Arabian Sea coastline.',
    culturalNote: 'Karnataka\'s official tourism tagline is "ಒಂದು ರಾಜ್ಯ, ಹಲವು ಜಗತ್ತುಗಳು" (One State, Many Worlds).',
    examples: [
      {
        speakerA: 'ಕರ್ನಾಟಕದಲ್ಲಿ ಭೇಟಿ ನೀಡಲು ಅತ್ಯುತ್ತಮ ಸ್ಥಳ ಯಾವುದು?',
        translitA: 'Karnāṭakadalli bhēṭi nīḍalu atyuttama sthaḷa yāvudu?',
        englishA: 'Which is the best place to visit in Karnataka?',
        speakerB: 'ಇತಿಹಾಸಕ್ಕೆ ಹಂಪಿ, ಪ್ರಕೃತಿಗೆ ಕೊಡಗು ಮತ್ತು ಕಡಲತೀರಕ್ಕೆ ಗೋಕರ್ಣ ಅದ್ಭುತ.',
        translitB: 'Itihāsakke hampi, prakr̥tige koḍagu mattu kaḍalatīrakke gōkarṇa adbhuta.',
        englishB: 'Hampi for history, Coorg for nature, and Gokarna for beaches are magnificent.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Word for beach / coastline: "ಗೋಕರ್ಣದ ___ ತುಂಬಾ ಸುಂದರ"',
      targetText: 'ಕಡಲತೀರ',
      options: ['ಕಡಲತೀರ', 'ಮನೆ', 'ರಸ್ತೆ', 'ಸಂತೆ'],
      explanation: '"ಕಡಲತೀರ" (kaḍalatīra) means seashore or beach.'
    },
    quiz: [
      {
        question: 'What is Karnataka\'s tourism motto?',
        options: ['ಒಂದು ರಾಜ್ಯ, ಹಲವು ಜಗತ್ತುಗಳು (One State, Many Worlds)', 'ದೇವರ ಸ್ವಂತ ನಾಡು', 'ಬೆಳೆಯುವ ನಾಡು', 'ಶಾಂತಿಯ ತೋಟ'],
        correctIndex: 0,
        explanation: '"ಒಂದು ರಾಜ್ಯ, ಹಲವು ಜಗತ್ತುಗಳು" (One State, Many Worlds) is Karnataka Tourism\'s motto.'
      }
    ],
    phrases: [
      {
        id: 'p-43-1',
        kannada: 'ಒಂದು ರಾಜ್ಯ, ಹಲವು ಜಗತ್ತುಗಳು',
        transliteration: 'Ondu rājya, halavu jagattugaḷu',
        english: 'One State, Many Worlds (Karnataka Tourism Motto)',
        context: 'Celebrated cultural slogan.',
        breakdown: [
          { word: 'ರಾಜ್ಯ', transliteration: 'rājya', meaning: 'state' },
          { word: 'ಜಗತ್ತುಗಳು', transliteration: 'jagattugaḷu', meaning: 'worlds' }
        ]
      },
      {
        id: 'p-43-2',
        kannada: 'ಕೊಡಗಿನ ಕಾಫಿ ತೋಟಗಳು',
        transliteration: 'Koḍagina kāphi tōṭagaḷu',
        english: 'The lush coffee plantations of Coorg',
        context: 'Hill station travel.',
        breakdown: [{ word: 'ತೋಟಗಳು', transliteration: 'tōṭagaḷu', meaning: 'estates / plantations' }]
      },
      {
        id: 'p-43-3',
        kannada: 'ಗೋಕರ್ಣದ ಕಡಲತೀರ ಮತ್ತು ಸೂರ್ಯಾಸ್ತ',
        transliteration: 'Gōkarṇada kaḍalatīra mattu sūryāsta',
        english: 'The beaches and sunset of Gokarna',
        context: 'Coastal travel.',
        breakdown: [
          { word: 'ಕಡಲತೀರ', transliteration: 'kaḍalatīra', meaning: 'seashore' },
          { word: 'ಸೂರ್ಯಾಸ್ತ', transliteration: 'sūryāsta', meaning: 'sunset' }
        ]
      },
      {
        id: 'p-43-4',
        kannada: 'ಜೋಗ ಜಲಪಾತದ ರುದ್ರರಮಣೀಯ ನೋಟ',
        transliteration: 'Jōga jalapātada rudraramaṇīya nōṭa',
        english: 'The majestic view of Jog Falls (Sharavathi river)',
        context: 'Waterfalls of Western Ghats.',
        breakdown: [{ word: 'ಜಲಪಾತ', transliteration: 'jalapāta', meaning: 'waterfall' }]
      },
      {
        id: 'p-43-5',
        kannada: 'ಹೋಂಸ್ಟೇ ಬುಕಿಂಗ್ ಮಾಡಬೇಕಿತ್ತು',
        transliteration: 'Hōmsṭē bukkiṅg māḍabēkittu',
        english: 'I needed to book a homestay in advance',
        context: 'Accommodations in Malnad.',
        breakdown: [{ word: 'ಮಾಡಬೇಕಿತ್ತು', transliteration: 'māḍabēkittu', meaning: 'needed to do' }]
      },
      {
        id: 'p-43-6',
        kannada: 'ಪ್ರವಾಸ ತುಂಬಾ ಸ್ಮರಣೀಯವಾಗಿತ್ತು',
        transliteration: 'Pravāsa tumbā smaraṇīyavāgittu',
        english: 'The journey was truly memorable',
        context: 'Travel reflections.',
        breakdown: [{ word: 'ಸ್ಮರಣೀಯ', transliteration: 'smaraṇīya', meaning: 'memorable' }]
      }
    ]
  },
  {
    id: 'lesson-44',
    titleKannada: 'ವಾದ-ವಿವಾದ, ಚರ್ಚೆ ಮತ್ತು ವಿಚಾರ ಮಂಡನೆ',
    titleEnglish: 'Debate, Discussion & Articulating Arguments',
    category: 'grammar',
    difficulty: 'Advanced',
    description: 'Learn sophisticated debate language: thesis statements, corroborating evidence, and polite rebuttal.',
    durationMinutes: 15,
    phrasesCount: 6,
    objective: 'Participate in intellectual discussions, seminars, and panels in Kannada.',
    pronunciationTips: '"Vāda" means argument / debate; "Samarthane" means justification / defense.',
    culturalNote: 'Karnataka has an ancient tradition of intellectual discourse dating to the court of Amoghavarsha Nrupatunga.',
    examples: [
      {
        speakerA: 'ಈ ವಿಷಯದ ಬಗ್ಗೆ ನಿಮ್ಮ ಸಿದ್ಧಾಂತವೇನು?',
        translitA: 'Ī viṣayada bagge nimma siddhāntavēnu?',
        englishA: 'What is your theoretical perspective on this subject?',
        speakerB: 'ನನ್ನ ಪ್ರಕಾರ, ನಾವು ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಪರಂಪರೆ ಎರಡನ್ನೂ ಸಮತೋಲನದಲ್ಲಿಡಬೇಕು.',
        translitB: 'Nanna prakāra, nāvu tantrajñāna mattu parampara eraḍannū samatōlanadalliḍabēku.',
        englishB: 'In my view, we must balance both technology and tradition.'
      }
    ],
    interactiveExercise: {
      type: 'fill_in',
      prompt: 'Word for evidence / proof: "ಇದಕ್ಕೆ ಸೂಕ್ತ ___ ಬೇಕು"',
      targetText: 'ಸಾಕ್ಷಿ',
      options: ['ಸಾಕ್ಷಿ', 'ನೀರು', 'ಬೆಲೆ', 'ದಾರಿ'],
      explanation: '"ಸಾಕ್ಷಿ" (sākṣi) or "ಆಧಾರ" (ādhāra) means proof / evidence.'
    },
    quiz: [
      {
        question: 'What does "ಸಮತೋಲನ" (Samatōlana) signify in discussion?',
        options: ['Extreme stance', 'Balance / Equilibrium', 'Anger', 'Absence'],
        correctIndex: 1,
        explanation: '"ಸಮತೋಲನ" means balance, poise, or equilibrium.'
      }
    ],
    phrases: [
      {
        id: 'p-44-1',
        kannada: 'ನನ್ನ ವಾದವೇನೆಂದರೆ...',
        transliteration: 'Nanna vādavēnendare...',
        english: 'My argument is that...',
        context: 'Stating central thesis.',
        breakdown: [{ word: 'ವಾದ', transliteration: 'vāda', meaning: 'argument / proposition' }]
      },
      {
        id: 'p-44-2',
        kannada: 'ಇದಕ್ಕೆ ಸಾಕಷ್ಟು ಆಧಾರಗಳಿವೆ',
        transliteration: 'Idakke sākaṣṭu ādhāragaḷive',
        english: 'There is ample evidence for this',
        context: 'Supporting a point with data.',
        breakdown: [{ word: 'ಆಧಾರಗಳು', transliteration: 'ādhāragaḷu', meaning: 'foundations / proofs' }]
      },
      {
        id: 'p-44-3',
        kannada: 'ಮತ್ತೊಂದು ದೃಷ್ಟಿಕೋನದಿಂದ ನೋಡಿದರೆ...',
        transliteration: 'Mattondu dr̥ṣṭikōnadinda nōḍidare...',
        english: 'Looking from another perspective...',
        context: 'Offering nuanced view.',
        breakdown: [{ word: 'ದೃಷ್ಟಿಕೋನ', transliteration: 'dr̥ṣṭikōna', meaning: 'viewpoint / perspective' }]
      },
      {
        id: 'p-44-4',
        kannada: 'ಇದು ದೀರ್ಘಾವಧಿಯಲ್ಲಿ ಉಪಯುಕ್ತ',
        transliteration: 'Idu dīrghāvadhiyalli upayukta',
        english: 'This is beneficial in the long term',
        context: 'Strategic evaluation.',
        breakdown: [
          { word: 'ದೀರ್ಘಾವಧಿ', transliteration: 'dīrghāvadhi', meaning: 'long term' },
          { word: 'ಉಪಯುಕ್ತ', transliteration: 'upayukta', meaning: 'useful' }
        ]
      },
      {
        id: 'p-44-5',
        kannada: 'ಸಮಸ್ಯೆಗೆ ಸೂಕ್ತ ಪರಿಹಾರ ಕಂಡುಹಿಡಿಯಬೇಕು',
        transliteration: 'Samasyege sūkta parihāra kaṇḍuhiḍiyabēku',
        english: 'We must find a suitable solution for the problem',
        context: 'Action-oriented conclusion.',
        breakdown: [{ word: 'ಪರಿಹಾರ', transliteration: 'parihāra', meaning: 'remedy / solution' }]
      },
      {
        id: 'p-44-6',
        kannada: 'ಕೊನೆಯದಾಗಿ ಹೇಳಬೇಕೆಂದರೆ...',
        transliteration: 'Koneyadāgi hēḷabēkendare...',
        english: 'To conclude / In final summary...',
        context: 'Closing remarks.',
        breakdown: [{ word: 'ಕೊನೆಯದಾಗಿ', transliteration: 'koneyadāgi', meaning: 'finally' }]
      }
    ]
  },
  {
    id: 'lesson-45',
    titleKannada: 'ಅನರ್ಘ್ಯ ಕನ್ನಡ: ನಿರರ್ಗಳತೆ ಮತ್ತು ಆತ್ಮವಿಶ್ವಾಸ',
    titleEnglish: 'Fluent Colloquial Mastery & Graduation',
    category: 'basics',
    difficulty: 'Advanced',
    description: 'The mastercap module: blending colloquial flair, rapid responses, cultural wit, and genuine Kannadiga pride.',
    durationMinutes: 16,
    phrasesCount: 6,
    objective: 'Speak Kannada like a true native with authentic cadence, proverbs, and spontaneous humor.',
    pronunciationTips: 'Speak with joyful cadence and self-assurance; mistakes are just stepping stones.',
    culturalNote: '"ಕನ್ನಡ ಕಸ್ತೂರಿ" - Kannada is fragrant like musk. Speaking it with heart opens every door in Karnataka.',
    examples: [
      {
        speakerA: 'ಕನ್ನಡ ಕಲಿಕೆ ಹೇಗನಿಸಿತು?',
        translitA: 'Kannaḍa kalike hēganisitu?',
        englishA: 'How did your Kannada learning journey feel?',
        speakerB: 'ಕನ್ನಡ ಕಲಿಯುವುದು ನನ್ನ ಜೀವನದ ಅದ್ಭುತ ಅನುಭವ! ಈಗ ನಾನು ಆತ್ಮವಿಶ್ವಾಸದಿಂದ ಮಾತನಾಡಬಲ್ಲೆ.',
        translitB: 'Kannaḍa kaliyuvudu nanna jīvanada adbhuta anubhava! Īga nānu ātmaviśvāsadinda mātanāḍaballe.',
        englishB: 'Learning Kannada has been an extraordinary experience in my life! Now I can speak with confidence.'
      }
    ],
    interactiveExercise: {
      type: 'word_order',
      prompt: 'Arrange to proclaim: "I can speak Kannada with confidence"',
      targetText: 'ನಾನು ಆತ್ಮವಿಶ್ವಾಸದಿಂದ ಕನ್ನಡ ಮಾತನಾಡಬಲ್ಲೆ',
      options: ['ಕನ್ನಡ', 'ಮಾತನಾಡಬಲ್ಲೆ', 'ನಾನು', 'ಆತ್ಮವಿಶ್ವಾಸದಿಂದ'],
      correctOrder: ['ನಾನು', 'ಆತ್ಮವಿಶ್ವಾಸದಿಂದ', 'ಕನ್ನಡ', 'ಮಾತನಾಡಬಲ್ಲೆ'],
      explanation: 'Subject (ನಾನು) + Adverb (ಆತ್ಮವಿಶ್ವಾಸದಿಂದ) + Object (ಕನ್ನಡ) + Modal verb (ಮಾತನಾಡಬಲ್ಲೆ).'
    },
    quiz: [
      {
        question: 'What does "ಕನ್ನಡ ಎನ್ನ ಹೃದಯದ ಭಾಷೆ" mean?',
        options: ['Kannada is difficult', 'Kannada is the language of my heart', 'Kannada is old', 'Kannada is fast'],
        correctIndex: 1,
        explanation: '"ಕನ್ನಡ ಎನ್ನ ಹೃದಯದ ಭಾಷೆ" means "Kannada is the language of my heart".'
      }
    ],
    phrases: [
      {
        id: 'p-45-1',
        kannada: 'ನಾನು ಈಗ ಆತ್ಮವಿಶ್ವಾಸದಿಂದ ಕನ್ನಡ ಮಾತನಾಡಬಲ್ಲೆ',
        transliteration: 'Nānu īga ātmaviśvāsadinda kannada mātanāḍaballe',
        english: 'I can now speak Kannada with supreme confidence',
        context: 'Mastery declaration.',
        breakdown: [
          { word: 'ಆತ್ಮವಿಶ್ವಾಸ', transliteration: 'ātmaviśvāsa', meaning: 'self-confidence' },
          { word: 'ಮಾತನಾಡಬಲ್ಲೆ', transliteration: 'mātanāḍaballe', meaning: 'I can speak' }
        ]
      },
      {
        id: 'p-45-2',
        kannada: 'ಕನ್ನಡ ನಾಡು ಮತ್ತು ಭಾಷೆ ನನ್ನ ಹೆಮ್ಮೆ',
        transliteration: 'Kannaḍa nāḍu mattu bhāṣe nanna hemme',
        english: 'The Kannada land and language are my pride',
        context: 'Cultural bonding.',
        breakdown: [{ word: 'ಹೆಮ್ಮೆ', transliteration: 'hemme', meaning: 'pride' }]
      },
      {
        id: 'p-45-3',
        kannada: 'ಕಲಿಕೆಗೆ ಕೊನೆಯಿಲ್ಲ (Kalikege koneyilla)',
        transliteration: 'Kalikege koneyilla',
        english: 'There is no end to learning (Lifelong journey)',
        context: 'Humility in mastery.',
        breakdown: [
          { word: 'ಕಲಿಕೆ', transliteration: 'kalike', meaning: 'learning' },
          { word: 'ಕೊನೆಯಿಲ್ಲ', transliteration: 'koneyilla', meaning: 'has no end' }
        ]
      },
      {
        id: 'p-45-4',
        kannada: 'ಸ್ನೇಹಪೂರ್ವಕವಾಗಿ ಮಾತನಾಡೋಣ',
        transliteration: 'Snēhapūrvakavāgi mātanāḍōṇa',
        english: 'Let us always speak with friendliness',
        context: 'Universal goodwill.',
        breakdown: [{ word: 'ಸ್ನೇಹಪೂರ್ವಕವಾಗಿ', transliteration: 'snēhapūrvakavāgi', meaning: 'amicably' }]
      },
      {
        id: 'p-45-5',
        kannada: 'ಕನ್ನಡದಲ್ಲಿ ಯೋಚಿಸಿ ಮತ್ತು ಮಾತನಾಡಿ',
        transliteration: 'Kannaḍadalli yōcisi mattu mātanāḍi',
        english: 'Think in Kannada and speak in Kannada',
        context: 'The key to natural fluency.',
        breakdown: [{ word: 'ಯೋಚಿಸಿ', transliteration: 'yōcisi', meaning: 'think' }]
      },
      {
        id: 'p-45-6',
        kannada: 'ಎಲ್ಲರಿಗೂ ಶುಭವಾಗಲಿ, ಜೈ ಕರ್ನಾಟಕ ಮಾತೆ!',
        transliteration: 'Ellarigū śubhavāgali, jai karnāṭaka māte!',
        english: 'May good fortune befall everyone, victory to Mother Karnataka!',
        context: 'Celebratory benediction.',
        breakdown: [
          { word: 'ಶುಭವಾಗಲಿ', transliteration: 'śubhavāgali', meaning: 'may good happen' },
          { word: 'ಜೈ', transliteration: 'jai', meaning: 'victory' }
        ]
      }
    ]
  }
];
