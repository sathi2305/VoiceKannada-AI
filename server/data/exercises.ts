import {
  SentenceBuilderExercise,
  ListeningExercise,
  RolePlayScenario,
  Achievement,
  ScriptCharacter,
  SRSItem
} from '../../src/types/index.js';

export const SENTENCE_BUILDER_EXERCISES: SentenceBuilderExercise[] = [
  {
    id: 'sb-1',
    targetEnglish: 'I want hot filter coffee',
    correctKannada: 'ನನಗೆ ಬಿಸಿ ಫಿಲ್ಟರ್ ಕಾಫಿ ಬೇಕು',
    correctWords: ['ನನಗೆ', 'ಬಿಸಿ', 'ಫಿಲ್ಟರ್ ಕಾಫಿ', 'ಬೇಕು'],
    scrambledWords: ['ಬೇಕು', 'ನನಗೆ', 'ಫಿಲ್ಟರ್ ಕಾಫಿ', 'ಬಿಸಿ'],
    transliteration: 'Nanage bisi filter coffee bēku',
    grammarExplanation: 'In Kannada syntax (SOV), the indirect subject pronoun "ನನಗೆ" (to me) comes first, followed by modifiers "ಬಿಸಿ" (hot) and noun "ಫಿಲ್ಟರ್ ಕಾಫಿ", concluding with the defective verb "ಬೇಕು" (wanted/needed).',
    difficulty: 'Beginner'
  },
  {
    id: 'sb-2',
    targetEnglish: 'Where is the metro station?',
    correctKannada: 'ಮೆಟ್ರೋ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?',
    correctWords: ['ಮೆಟ್ರೋ', 'ನಿಲ್ದಾಣ', 'ಎಲ್ಲಿದೆ'],
    scrambledWords: ['ಎಲ್ಲಿದೆ', 'ಮೆಟ್ರೋ', 'ನಿಲ್ದಾಣ'],
    transliteration: 'Metro nildāṇa ellide?',
    grammarExplanation: 'The subject "ಮೆಟ್ರೋ ನಿಲ್ದಾಣ" (metro station) precedes the interrogative locative verb "ಎಲ್ಲಿದೆ" (where is it?). In Kannada questions, interrogative words (ಎಲ್ಲಿ, ಏನು, ಹೇಗೆ) typically precede the verb.',
    difficulty: 'Beginner'
  },
  {
    id: 'sb-3',
    targetEnglish: 'Please turn on the meter brother',
    correctKannada: 'ಮೀಟರ್ ಹಾಕಿ ಅಣ್ಣ',
    correctWords: ['ಮೀಟರ್', 'ಹಾಕಿ', 'ಅಣ್ಣ'],
    scrambledWords: ['ಅಣ್ಣ', 'ಹಾಕಿ', 'ಮೀಟರ್'],
    transliteration: 'Meter hāki aṇṇa',
    grammarExplanation: 'Noun "ಮೀಟರ್" (meter) is followed by the polite imperative verb "ಹಾಕಿ" (put/switch on), addressed honorifically to "ಅಣ್ಣ" (elder brother).',
    difficulty: 'Beginner'
  },
  {
    id: 'sb-4',
    targetEnglish: 'Please reduce the price a little',
    correctKannada: 'ಸ್ವಲ್ಪ ಬೆಲೆ ಕಡಿಮೆ ಮಾಡಿ',
    correctWords: ['ಸ್ವಲ್ಪ', 'ಬೆಲೆ', 'ಕಡಿಮೆ', 'ಮಾಡಿ'],
    scrambledWords: ['ಮಾಡಿ', 'ಸ್ವಲ್ಪ', 'ಕಡಿಮೆ', 'ಬೆಲೆ'],
    transliteration: 'Svalpa bele kaḍime māḍi',
    grammarExplanation: '"ಸ್ವಲ್ಪ" (a little) modifies "ಬೆಲೆ" (price), while "ಕಡಿಮೆ ಮಾಡಿ" is a compound verb meaning "make lower / discount".',
    difficulty: 'Intermediate'
  },
  {
    id: 'sb-5',
    targetEnglish: 'I like learning Kannada',
    correctKannada: 'ನನಗೆ ಕನ್ನಡ ಕಲಿಯಲು ಇಷ್ಟ',
    correctWords: ['ನನಗೆ', 'ಕನ್ನಡ', 'ಕಲಿಯಲು', 'ಇಷ್ಟ'],
    scrambledWords: ['ಕಲಿಯಲು', 'ಇಷ್ಟ', 'ನನಗೆ', 'ಕನ್ನಡ'],
    transliteration: 'Nanage kannada kaliyalu iṣṭa',
    grammarExplanation: 'Dative subject "ನನಗೆ" (to me) + object "ಕನ್ನಡ" + infinitive verb "ಕಲಿಯಲು" (to learn) + predicate adjective "ಇಷ್ಟ" (liked/pleasing).',
    difficulty: 'Intermediate'
  },
  {
    id: 'sb-6',
    targetEnglish: 'Please speak slowly',
    correctKannada: 'ದಯವಿಟ್ಟು ನಿಧಾನವಾಗಿ ಮಾತನಾಡಿ',
    correctWords: ['ದಯವಿಟ್ಟು', 'ನಿಧಾನವಾಗಿ', 'ಮಾತನಾಡಿ'],
    scrambledWords: ['ಮಾತನಾಡಿ', 'ದಯವಿಟ್ಟು', 'ನಿಧಾನವಾಗಿ'],
    transliteration: 'Dayaviṭṭu nidhānavāgi mātanāḍi',
    grammarExplanation: '"ದಯವಿಟ್ಟು" (please) + adverb "ನಿಧಾನವಾಗಿ" (slowly, formed from ನಿಧಾನ + ಆಗಿ) + formal imperative "ಮಾತನಾಡಿ" (speak).',
    difficulty: 'Beginner'
  }
];

export const LISTENING_EXERCISES: ListeningExercise[] = [
  {
    id: 'lc-1',
    title: 'Breakfast Order at a Bengaluru Darshini',
    kannadaAudioText: 'ನನಗೆ ಒಂದು ತಟ್ಟೆ ಇಡ್ಲಿ ವಡೆ ಮತ್ತು ಬಿಸಿ ಫಿಲ್ಟರ್ ಕಾಫಿ ಕೊಡಿ',
    transliteration: 'Nanage ondu taṭṭe iḍli vaḍe mattu bisi filter coffee koḍi',
    englishMeaning: 'Give me one plate of idli-vada and a hot filter coffee.',
    question: 'What beverage did the speaker order with their breakfast?',
    options: ['Cold water', 'Hot tea', 'Filter coffee', 'Fresh juice'],
    correctIndex: 2,
    explanation: 'The speaker explicitly requested "ಬಿಸಿ ಫಿಲ್ಟರ್ ಕಾಫಿ" (bisi filter coffee), where "ಬಿಸಿ" means hot.',
    difficulty: 'Beginner'
  },
  {
    id: 'lc-2',
    title: 'Negotiating an Auto-Rickshaw Ride',
    kannadaAudioText: 'ಇಂದಿರಾನಗರಕ್ಕೆ ಎಷ್ಟು ಆಗುತ್ತದೆ? ದಯವಿಟ್ಟು ಮೀಟರ್ ಹಾಕಿ.',
    transliteration: 'Indiranagarakke eṣṭu āguttade? Dayaviṭṭu meter hāki.',
    englishMeaning: 'How much to Indiranagar? Please turn on the meter.',
    question: 'What is the passenger asking the auto driver to do?',
    options: ['Take a shortcut', 'Switch on the fare meter', 'Wait for 10 minutes', 'Stop at the bank'],
    correctIndex: 1,
    explanation: '"ಮೀಟರ್ ಹಾಕಿ" (meter hāki) is the standard Kannada phrase requesting the auto driver to engage the fare meter.',
    difficulty: 'Beginner'
  },
  {
    id: 'lc-3',
    title: 'Enquiring About Train Timings',
    kannadaAudioText: 'ಮೈಸೂರಿಗೆ ಮುಂದಿನ ರೈಲು ಎಷ್ಟು ಗಂಟೆಗೆ ಹೊರಡುತ್ತದೆ?',
    transliteration: 'Mysūru-ge mundina railu eṣṭu gaṇṭege horaḍuttade?',
    englishMeaning: 'At what time does the next train leave for Mysuru?',
    question: 'Which city is the passenger travelling to?',
    options: ['Mangaluru', 'Hubballi', 'Mysuru', 'Belagavi'],
    correctIndex: 2,
    explanation: 'The destination mentioned is "ಮೈಸೂರಿಗೆ" (Mysuru-ge), where "-ಗೆ" is the dative case marker meaning "to Mysuru".',
    difficulty: 'Intermediate'
  },
  {
    id: 'lc-4',
    title: 'Asking for Medical Assistance',
    kannadaAudioText: 'ನನಗೆ ತುಂಬಾ ತಲೆನೋವು ಇದೆ, ಹತ್ತಿರದ ಔಷಧ ಅಂಗಡಿ ಎಲ್ಲಿದೆ?',
    transliteration: 'Nanage tumbā talenōvu ide, hattirada auṣadha aṅgaḍi ellide?',
    englishMeaning: 'I have a severe headache, where is the nearest pharmacy?',
    question: 'What symptom is the speaker experiencing?',
    options: ['Stomach ache', 'Headache', 'Fever', 'Sprained ankle'],
    correctIndex: 1,
    explanation: '"ತಲೆನೋವು" (talenōvu) translates to headache ("ತಲೆ" = head, "ನೋವು" = pain).',
    difficulty: 'Beginner'
  }
];

export const SCRIPT_CHARACTERS: ScriptCharacter[] = [
  // Vowels (ಸ್ವರಗಳು - Swaragalu)
  { char: 'ಅ', transliteration: 'a', type: 'vowel', category: 'Short Vowel (ಹ್ರಸ್ವ)', exampleWord: 'ಅಮ್ಮ', exampleTranslit: 'Amma', exampleMeaning: 'Mother' },
  { char: 'ಆ', transliteration: 'ā', type: 'vowel', category: 'Long Vowel (ದೀರ್ಘ)', exampleWord: 'ಆನೆ', exampleTranslit: 'Āne', exampleMeaning: 'Elephant' },
  { char: 'ಇ', transliteration: 'i', type: 'vowel', category: 'Short Vowel (ಹ್ರಸ್ವ)', exampleWord: 'ಇಲಿ', exampleTranslit: 'Ili', exampleMeaning: 'Mouse' },
  { char: 'ಈ', transliteration: 'ī', type: 'vowel', category: 'Long Vowel (ದೀರ್ಘ)', exampleWord: 'ಈಜು', exampleTranslit: 'Īju', exampleMeaning: 'Swimming' },
  { char: 'ಉ', transliteration: 'u', type: 'vowel', category: 'Short Vowel (ಹ್ರಸ್ವ)', exampleWord: 'ಉಡುಪು', exampleTranslit: 'Uḍupu', exampleMeaning: 'Clothing' },
  { char: 'ಊ', transliteration: 'ū', type: 'vowel', category: 'Long Vowel (ದೀರ್ಘ)', exampleWord: 'ಊಟ', exampleTranslit: 'Ūṭa', exampleMeaning: 'Meal' },
  { char: 'ಋ', transliteration: 'r̥', type: 'vowel', category: 'Vocalic R', exampleWord: 'ಋಷಿ', exampleTranslit: 'R̥ṣi', exampleMeaning: 'Sage' },
  { char: 'ಎ', transliteration: 'e', type: 'vowel', category: 'Short Vowel (ಹ್ರಸ್ವ)', exampleWord: 'ಎಲೆ', exampleTranslit: 'Ele', exampleMeaning: 'Leaf' },
  { char: 'ಏ', transliteration: 'ē', type: 'vowel', category: 'Long Vowel (ದೀರ್ಘ)', exampleWord: 'ಏಣಿ', exampleTranslit: 'Ēṇi', exampleMeaning: 'Ladder' },
  { char: 'ಐ', transliteration: 'ai', type: 'vowel', category: 'Diphthong', exampleWord: 'ಐದು', exampleTranslit: 'Aidu', exampleMeaning: 'Five' },
  { char: 'ಒ', transliteration: 'o', type: 'vowel', category: 'Short Vowel (ಹ್ರಸ್ವ)', exampleWord: 'ಒಂಟೆ', exampleTranslit: 'Onṭe', exampleMeaning: 'Camel' },
  { char: 'ಓ', transliteration: 'ō', type: 'vowel', category: 'Long Vowel (ದೀರ್ಘ)', exampleWord: 'ಓಟ', exampleTranslit: 'Ōṭa', exampleMeaning: 'Running' },
  { char: 'ಔ', transliteration: 'au', type: 'vowel', category: 'Diphthong', exampleWord: 'ಔಷಧ', exampleTranslit: 'Auṣadha', exampleMeaning: 'Medicine' },
  // Yogavahakagalu
  { char: 'ಅಂ', transliteration: 'aṁ', type: 'yogavahaka', category: 'Anusvara (ಅನುಸ್ವಾರ)', exampleWord: 'ಅಂಗಡಿ', exampleTranslit: 'Aṅgaḍi', exampleMeaning: 'Shop' },
  { char: 'ಅಃ', transliteration: 'aḥ', type: 'yogavahaka', category: 'Visarga (ವಿಸರ್ಗ)', exampleWord: 'ದುಃಖ', exampleTranslit: 'Duḥkha', exampleMeaning: 'Sorrow' },
  // Consonants (ವ್ಯಂಜನಗಳು - Vyanjanagalu)
  { char: 'ಕ', transliteration: 'ka', type: 'consonant', category: 'Velar (ಕಂಠ್ಯ)', exampleWord: 'ಕಮಲ', exampleTranslit: 'Kamala', exampleMeaning: 'Lotus' },
  { char: 'ಖ', transliteration: 'kha', type: 'consonant', category: 'Velar (ಕಂಠ್ಯ)', exampleWord: 'ಖಡ್ಗ', exampleTranslit: 'Khaḍga', exampleMeaning: 'Sword' },
  { char: 'ಗ', transliteration: 'ga', type: 'consonant', category: 'Velar (ಕಂಠ್ಯ)', exampleWord: 'ಗಣೇಶ', exampleTranslit: 'Gaṇēśa', exampleMeaning: 'Ganesha' },
  { char: 'ಘ', transliteration: 'gha', type: 'consonant', category: 'Velar (ಕಂಠ್ಯ)', exampleWord: 'ಘಂಟೆ', exampleTranslit: 'Ghaṇṭe', exampleMeaning: 'Bell' },
  { char: 'ಚ', transliteration: 'ca', type: 'consonant', category: 'Palatal (ತಾಲವ್ಯ)', exampleWord: 'ಚಮಚ', exampleTranslit: 'Camaca', exampleMeaning: 'Spoon' },
  { char: 'ಜ', transliteration: 'ja', type: 'consonant', category: 'Palatal (ತಾಲವ್ಯ)', exampleWord: 'ಜನ', exampleTranslit: 'Jana', exampleMeaning: 'People' },
  { char: 'ಟ', transliteration: 'ṭa', type: 'consonant', category: 'Retroflex (ಮೂರ್ಧನ್ಯ)', exampleWord: 'ಟೊಮ್ಯಾಟೊ', exampleTranslit: 'Ṭomyāṭo', exampleMeaning: 'Tomato' },
  { char: 'ಡ', transliteration: 'ḍa', type: 'consonant', category: 'Retroflex (ಮೂರ್ಧನ್ಯ)', exampleWord: 'ಡಬ್ಬಿ', exampleTranslit: 'Ḍabbi', exampleMeaning: 'Box' },
  { char: 'ತ', transliteration: 'ta', type: 'consonant', category: 'Dental (ದಂತ್ಯ)', exampleWord: 'ತಾರೆ', exampleTranslit: 'Tāre', exampleMeaning: 'Star' },
  { char: 'ದ', transliteration: 'da', type: 'consonant', category: 'Dental (ದಂತ್ಯ)', exampleWord: 'ದೀಪ', exampleTranslit: 'Dīpa', exampleMeaning: 'Lamp' },
  { char: 'ನ', transliteration: 'na', type: 'consonant', category: 'Dental (ದಂತ್ಯ)', exampleWord: 'ನಮಸ್ಕಾರ', exampleTranslit: 'Namaskāra', exampleMeaning: 'Hello' },
  { char: 'ಪ', transliteration: 'pa', type: 'consonant', category: 'Labial (ಓಷ್ಠ್ಯ)', exampleWord: 'ಪುಸ್ತಕ', exampleTranslit: 'Pustaka', exampleMeaning: 'Book' },
  { char: 'ಬ', transliteration: 'ba', type: 'consonant', category: 'Labial (ಓಷ್ಠ್ಯ)', exampleWord: 'ಬೆಂಗಳೂರು', exampleTranslit: 'Bengalūru', exampleMeaning: 'Bengaluru' },
  { char: 'ಮ', transliteration: 'ma', type: 'consonant', category: 'Labial (ಓಷ್ಠ್ಯ)', exampleWord: 'ಮನೆ', exampleTranslit: 'Mane', exampleMeaning: 'Home' },
  { char: 'ಯ', transliteration: 'ya', type: 'consonant', category: 'Semivowel', exampleWord: 'ಯಾರವರು', exampleTranslit: 'Yāravaru', exampleMeaning: 'Who is that' },
  { char: 'ರ', transliteration: 'ra', type: 'consonant', category: 'Liquid', exampleWord: 'ರಸ್ತೆ', exampleTranslit: 'Raste', exampleMeaning: 'Road' },
  { char: 'ಲ', transliteration: 'la', type: 'consonant', category: 'Lateral', exampleWord: 'ಲಡ್ಡು', exampleTranslit: 'Laḍḍu', exampleMeaning: 'Sweet Laddu' },
  { char: 'ವ', transliteration: 'va', type: 'consonant', category: 'Labiodental', exampleWord: 'ವಿದ್ಯಾರ್ಥಿ', exampleTranslit: 'Vidyārthi', exampleMeaning: 'Student' },
  { char: 'ಶ', transliteration: 'śa', type: 'consonant', category: 'Sibilant', exampleWord: 'ಶಾಲೆ', exampleTranslit: 'Śāle', exampleMeaning: 'School' },
  { char: 'ಸ', transliteration: 'sa', type: 'consonant', category: 'Sibilant', exampleWord: 'ಸೂರ್ಯ', exampleTranslit: 'Sūrya', exampleMeaning: 'Sun' },
  { char: 'ಹ', transliteration: 'ha', type: 'consonant', category: 'Aspirate', exampleWord: 'ಹೂವು', exampleTranslit: 'Hūvu', exampleMeaning: 'Flower' },
  { char: 'ಳ', transliteration: 'ḷa', type: 'consonant', category: 'Retroflex Lateral', exampleWord: 'ಕನ್ನಡ', exampleTranslit: 'Kannaḍa', exampleMeaning: 'Kannada' }
];

export const ROLEPLAY_SCENARIOS: RolePlayScenario[] = [
  {
    id: 'rp-darshini',
    title: 'Darshini Restaurant Order',
    kannadaTitle: 'ಹೋಟೆಲ್‌ನಲ್ಲಿ ಉಪಹಾರ ಆರ್ಡರ್',
    location: 'Brahmin\'s Coffee Bar / Vidyarthi Bhavan',
    description: 'You are ordering morning breakfast at an iconic Bengaluru Darshini.',
    objective: 'Order crispy masala dosa, filter coffee, specify spice level, and ask for the bill.',
    roleUser: 'Customer (ಗ್ರಾಹಕ)',
    roleAI: 'Friendly Darshini Server (ಸರ್ವರ್)',
    initialMessage: {
      kannada: 'ನಮಸ್ಕಾರ ಸರ್! ಬಿಸಿ ಬಿಸಿ ಇಡ್ಲಿ, ವಡೆ, ಮಸಾಲೆ ದೋಸೆ ರೆಡಿ ಇದೆ. ಏನು ತರಲಿ?',
      transliteration: 'Namaskāra sir! Bisi bisi iḍli, vaḍe, masāle dōse ready ide. Ēnu tarali?',
      english: 'Hello sir! Hot idli, vada, masala dosa are ready. What shall I bring for you?'
    },
    cheatSheetPhrases: [
      { kannada: 'ನನಗೆ ಒಂದು ಮಸಾಲೆ ದೋಸೆ ಕೊಡಿ', transliteration: 'Nanage ondu masāle dōse koḍi', english: 'Give me one masala dosa' },
      { kannada: 'ಖಾರ ಸ್ವಲ್ಪ ಕಡಿಮೆ ಇರಲಿ', transliteration: 'Khāra svalpa kaḍime irali', english: 'Keep spice a little low' },
      { kannada: 'ಒಂದು ಬಿಸಿ ಫಿಲ್ಟರ್ ಕಾಫಿ', transliteration: 'Ondu bisi filter coffee', english: 'One hot filter coffee' },
      { kannada: 'ಬಿಲ್ ಎಷ್ಟು ಆಯಿತು?', transliteration: 'Bill eṣṭu āyitu?', english: 'How much is the bill?' }
    ]
  },
  {
    id: 'rp-auto',
    title: 'Auto-Rickshaw Ride',
    kannadaTitle: 'ಆಟೋ ಚಾಲಕರೊಂದಿಗೆ ಸಂಭಾಷಣೆ',
    location: 'MG Road to Indiranagar Metro',
    description: 'Hailing an auto-rickshaw in busy Bengaluru traffic to reach your destination on meter.',
    objective: 'Agree on destination, ask for meter fare politely, give turn directions, and pay with UPI.',
    roleUser: 'Commuter (ಪ್ರಯಾಣಿಕ)',
    roleAI: 'Bengaluru Auto Driver (ಆಟೋ ಅಣ್ಣ)',
    initialMessage: {
      kannada: 'ಎಲ್ಲಿಗೆ ಹೋಗಬೇಕು ಸರ್? ಬನ್ನಿ ಕುಳಿತುಕೊಳ್ಳಿ.',
      transliteration: 'Ellige hōgabēku sir? Banni kuḷitukoḷḷi.',
      english: 'Where do you need to go sir? Come, have a seat.'
    },
    cheatSheetPhrases: [
      { kannada: 'ಇಂದಿರಾನಗರ ಮೆಟ್ರೋಗೆ ಹೋಗಬೇಕು', transliteration: 'Indiranagar metro-ge hōgabēku', english: 'Need to go to Indiranagar Metro' },
      { kannada: 'ಮೀಟರ್ ಹಾಕಿ ಅಣ್ಣ', transliteration: 'Meter hāki aṇṇa', english: 'Please turn on the meter brother' },
      { kannada: 'ಮುಂದೆ ಬಲಕ್ಕೆ ತಿರುಗಿ', transliteration: 'Munde balakke tirugi', english: 'Turn right up ahead' },
      { kannada: 'ಆನ್‌ಲೈನ್ ಪಾವತಿ ಇದೆಯೇ?', transliteration: 'Online pāvati ideyē?', english: 'Do you accept UPI/online payment?' }
    ]
  },
  {
    id: 'rp-market',
    title: 'KR Market Vegetable Shopping',
    kannadaTitle: 'ತರಕಾರಿ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಖರೀದಿ',
    location: 'KR Market (City Market), Bengaluru',
    description: 'Buying fresh vegetables and fruits while bargaining politely with a local vendor.',
    objective: 'Ask prices per kilo, request fresh produce, negotiate politely, and pay.',
    roleUser: 'Shopper (ಖರೀದಿದಾರ)',
    roleAI: 'Market Vendor (ತರಕಾರಿ ವ್ಯಾಪಾರಿ)',
    initialMessage: {
      kannada: 'ಬನ್ನಿ ಅಮ್ಮಾ/ಸರ್, ತಾಜಾ ಟೊಮೆಟೊ, ಈರುಳ್ಳಿ, ಕ್ಯಾರೆಟ್ ಬಂದಿದೆ. ಎಷ್ಟು ಬೇಕು?',
      transliteration: 'Banni ammā/sir, tājā tomato, īruḷḷi, carrot bandide. Eṣṭu bēku?',
      english: 'Welcome madam/sir! Fresh tomatoes, onions, carrots have arrived. How much do you need?'
    },
    cheatSheetPhrases: [
      { kannada: 'ಟೊಮೆಟೊ ಕೆಜಿಗೆ ಎಷ್ಟು?', transliteration: 'Tomato kg-ge eṣṭu?', english: 'How much per kg for tomatoes?' },
      { kannada: 'ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ', transliteration: 'Svalpa kaḍime māḍi', english: 'Please reduce the price a little bit' },
      { kannada: 'ಒಂದು ಕೆಜಿ ತಾಜಾ ಈರುಳ್ಳಿ ಕೊಡಿ', transliteration: 'Ondu kg tājā īruḷḷi koḍi', english: 'Give me one kilo of fresh onions' },
      { kannada: 'ಚಿಲ್ಲರೆ ಇದೆಯೇ?', transliteration: 'Chillare ideyē?', english: 'Do you have change?' }
    ]
  },
  {
    id: 'rp-office',
    title: 'Office Break Conversation',
    kannadaTitle: 'ಕಚೇರಿಯ ಸಹೋದ್ಯೋಗಿಗಳೊಂದಿಗೆ ಮಾತುಕತೆ',
    location: 'Tech Park Cafeteria, Whitefield',
    description: 'Making friendly Kannada conversation with your local colleague over evening tea.',
    objective: 'Ask about weekend plans, discuss work, and practice polite everyday questions.',
    roleUser: 'Colleague (ಸಹೋದ್ಯೋಗಿ)',
    roleAI: 'Friendly Teammate (ಸ್ನೇಹಪರ ಸಹೋದ್ಯೋಗಿ)',
    initialMessage: {
      kannada: 'ಹಾಯ್! ಚಹಾ ಕುಡಿಯಲು ಬಂದಿರಾ? ಈ ವಾರದ ಕೆಲಸ ಹೇಗಿದೆ?',
      transliteration: 'Hi! Chahā kuḍiyalu bandirā? Ī vārada kelasa hēgide?',
      english: 'Hi! Came for tea? How is this week\'s work going?'
    },
    cheatSheetPhrases: [
      { kannada: 'ಕೆಲಸ ಸ್ವಲ್ಪ ಬಿಡುವಿಲ್ಲದೆ ಇದೆ', transliteration: 'Kelasa svalpa biḍuvillade ide', english: 'Work is a bit busy' },
      { kannada: 'ವೀಕೆಂಡ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಪ್ಲಾನ್ ಏನು?', transliteration: 'Weekend-nalli nimma plan ēnu?', english: 'What is your weekend plan?' },
      { kannada: 'ನಾನು ಕನ್ನಡ ಕಲಿಯುತ್ತಿದ್ದೇನೆ', transliteration: 'Nānu kannaḍa kaliyuttiddēne', english: 'I am learning Kannada' },
      { kannada: 'ಸಹಾಯ ಮಾಡಿದ್ದಕ್ಕೆ ಧನ್ಯವಾದಗಳು', transliteration: 'Sahāya māḍiddakke dhan\'yavādagaḷu', english: 'Thanks for helping' }
    ]
  }
];

export const INITIAL_SRS_ITEMS: SRSItem[] = [
  {
    id: 'srs-1',
    kannada: 'ನಮಸ್ಕಾರ',
    transliteration: 'Namaskāra',
    english: 'Hello / Greetings',
    intervalDays: 1,
    easeFactor: 2.5,
    repetitions: 1,
    nextReviewDate: new Date().toISOString().split('T')[0],
    state: 'learning'
  },
  {
    id: 'srs-2',
    kannada: 'ನೀವು ಹೇಗಿದ್ದೀರಿ?',
    transliteration: 'Nīvu hēgiddīri?',
    english: 'How are you?',
    intervalDays: 1,
    easeFactor: 2.5,
    repetitions: 1,
    nextReviewDate: new Date().toISOString().split('T')[0],
    state: 'learning'
  },
  {
    id: 'srs-3',
    kannada: 'ಧನ್ಯವಾದಗಳು',
    transliteration: 'Dhan\'yavādagaḷu',
    english: 'Thank you very much',
    intervalDays: 2,
    easeFactor: 2.5,
    repetitions: 2,
    nextReviewDate: new Date().toISOString().split('T')[0],
    state: 'review'
  },
  {
    id: 'srs-4',
    kannada: 'ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ',
    transliteration: 'Svalpa kaḍime māḍi',
    english: 'Please reduce the price a bit',
    intervalDays: 1,
    easeFactor: 2.5,
    repetitions: 0,
    nextReviewDate: new Date().toISOString().split('T')[0],
    state: 'learning'
  },
  {
    id: 'srs-5',
    kannada: 'ಮೀಟರ್ ಹಾಕಿ ಅಣ್ಣ',
    transliteration: 'Meter hāki aṇṇa',
    english: 'Turn on the meter, brother',
    intervalDays: 1,
    easeFactor: 2.5,
    repetitions: 0,
    nextReviewDate: new Date().toISOString().split('T')[0],
    state: 'learning'
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-first-chat',
    title: 'First Kannada Conversation',
    titleKannada: 'ಮೊದಲ ಸಂಭಾಷಣೆ',
    description: 'Had your first voice or text dialogue with the AI assistant in Kannada.',
    iconName: 'MessageSquare',
    xpReward: 50,
    isUnlocked: false
  },
  {
    id: 'ach-first-lesson',
    title: 'Curriculum Pioneer',
    titleKannada: 'ಮೊದಲ ಪಾಠದ ಹೆಜ್ಜೆ',
    description: 'Completed your first structured Kannada learning module.',
    iconName: 'GraduationCap',
    xpReward: 100,
    isUnlocked: false
  },
  {
    id: 'ach-pronunciation',
    title: 'Speaking Champion',
    titleKannada: 'ಉಚ್ಚಾರಣಾ ಪ್ರವೀಣ',
    description: 'Completed 5 verified Kannada speaking practice sessions.',
    iconName: 'Mic',
    xpReward: 150,
    isUnlocked: false
  },
  {
    id: 'ach-sentence-builder',
    title: 'Sentence Architect',
    titleKannada: 'ಪದ ಜೋಡಣೆ ಜಾಣ',
    description: 'Successfully reassembled a scrambled Kannada sentence in the correct SOV order.',
    iconName: 'Layers',
    xpReward: 75,
    isUnlocked: false
  },
  {
    id: 'ach-listening-ear',
    title: 'Attentive Ear',
    titleKannada: 'ಕಿವಿಗೊಟ್ಟ ಶ್ರೋತೃ',
    description: 'Solved a listening comprehension question accurately.',
    iconName: 'Headphones',
    xpReward: 75,
    isUnlocked: false
  },
  {
    id: 'ach-roleplay-master',
    title: 'Bengaluru Roleplay Explorer',
    titleKannada: 'ನಗರ ಜೀವನ ನಾಯಕ',
    description: 'Concluded an interactive role-play scenario with full dialogue.',
    iconName: 'Sparkles',
    xpReward: 120,
    isUnlocked: false
  },
  {
    id: 'ach-streak-week',
    title: 'Weekly Flame',
    titleKannada: 'ಸಪ್ತಾಹ ಸಾಧಕ',
    description: 'Maintained a 7-day continuous learning streak.',
    iconName: 'Flame',
    xpReward: 200,
    isUnlocked: false
  }
];
