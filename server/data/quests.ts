import { Quest } from '../../src/types/index.js';

export const INITIAL_QUESTS: Quest[] = [
  // Daily Quests
  {
    id: 'quest-daily-practice',
    title: 'Daily Speaking Workout',
    titleKannada: 'ದೈನಂದಿನ ಮಾತುಗಾರಿಕೆ',
    category: 'daily',
    description: 'Practice speaking at least 3 Kannada phrases with 70%+ accuracy in the Speaking Studio.',
    xpReward: 60,
    totalSteps: 3,
    currentSteps: 1,
    isCompleted: false,
    isUnlocked: true,
    requiredLevel: 1,
    actionTab: 'practice',
    steps: [
      'Pronounce common greeting "ನಮಸ್ಕಾರ"',
      'Pronounce gratitude "ಧನ್ಯವಾದಗಳು"',
      'Pronounce inquiry "ಹೇಗಿದ್ದೀರಿ?"'
    ]
  },
  {
    id: 'quest-daily-vocab',
    title: 'Word Collector of the Day',
    titleKannada: 'ದಿನದ ಶಬ್ದ ಸಂಗ್ರಹ',
    category: 'daily',
    description: 'Review 3 vocabulary flashcards or save 2 new phrases to your personal notebook.',
    xpReward: 40,
    totalSteps: 2,
    currentSteps: 1,
    isCompleted: false,
    isUnlocked: true,
    requiredLevel: 1,
    actionTab: 'vocabulary',
    steps: [
      'Review spaced repetition flashcards',
      'Save new vocabulary from lessons or chat'
    ]
  },

  // Beginner Tier Quests
  {
    id: 'quest-beg-swara',
    title: 'Kannada Alphabet Explorer',
    titleKannada: 'ಅಕ್ಷರಮಾಲೆಯ ಮೊದಲ ಹೆಜ್ಜೆ',
    category: 'beginner',
    description: 'Master the 14 Kannada vowels (ಸ್ವರಗಳು) and 2 Yogavahakas in the Script Master.',
    xpReward: 120,
    totalSteps: 4,
    currentSteps: 2,
    isCompleted: false,
    isUnlocked: true,
    requiredLevel: 1,
    actionTab: 'characters',
    steps: [
      'Learn short vowels (ಅ, ಇ, ಉ)',
      'Learn long vowels (ಆ, ಈ, ಊ)',
      'Distinguish diphthongs (ಐ, ಔ)',
      'Practice Yogavahakas (ಅಂ, ಅಃ)'
    ]
  },
  {
    id: 'quest-beg-darshini',
    title: 'Order at a Bengaluru Darshini',
    titleKannada: 'ದರ್ಶಿನಿಯಲ್ಲಿ ತಿಂಡಿ ಆರ್ಡರ್',
    category: 'beginner',
    description: 'Simulate ordering Idli-Vada and Filter Coffee in Kannada in the Roleplay Simulator.',
    xpReward: 150,
    totalSteps: 3,
    currentSteps: 0,
    isCompleted: false,
    isUnlocked: true,
    requiredLevel: 1,
    actionTab: 'roleplay',
    steps: [
      'Ask the server what breakfast is hot ("ತಿಂಡಿ ಏನಿದೆ?")',
      'Order one plate Idli-Vada ("ಒಂದು ಪ್ಲೇಟ್ ಇಡ್ಲಿ ವಡೆ ಕೊಡಿ")',
      'Request hot filter coffee ("ಒಂದು ಬಿಸಿ ಫಿಲ್ಟರ್ ಕಾಫಿ ಕೊಡಿ")'
    ]
  },

  // Intermediate Tier Quests
  {
    id: 'quest-int-auto',
    title: 'Auto Rickshaw Negotiator',
    titleKannada: 'ಆಟೋ ಚಾಲಕರೊಂದಿಗೆ ಸಂಭಾಷಣೆ',
    category: 'intermediate',
    description: 'Successfully negotiate a ride, verify meter fare, and give road directions politely.',
    xpReward: 200,
    totalSteps: 4,
    currentSteps: 0,
    isCompleted: false,
    isUnlocked: true,
    requiredLevel: 2,
    actionTab: 'roleplay',
    steps: [
      'Ask if the auto driver will go to destination ("ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಬರ್ತೀರಾ?")',
      'Politely request meter ("ಮೀಟರ್ ಹಾಕಿ ಬನ್ನಿ")',
      'Give turning directions ("ಮುಂದೆ ಬಲಗಡೆ ತಿರುಗಿಸಿ")',
      'Pay fare and thank him ("ಧನ್ಯವಾದಗಳು, ಇಷ್ಟೇ ಇಟ್ಕೊಳ್ಳಿ")'
    ]
  },
  {
    id: 'quest-int-sentence',
    title: 'Sentence Architect',
    titleKannada: 'ವಾಕ್ಯ ರಚನಾ ಚತುರ',
    category: 'intermediate',
    description: 'Solve 3 Sentence Builder puzzles demonstrating Kannada Subject-Object-Verb (SOV) order.',
    xpReward: 180,
    totalSteps: 3,
    currentSteps: 1,
    isCompleted: false,
    isUnlocked: true,
    requiredLevel: 2,
    actionTab: 'builder',
    steps: [
      'Assemble present tense sentence',
      'Assemble respectful request with case ending -ಗೆ',
      'Assemble food preference sentence'
    ]
  },

  // Advanced Tier Quests
  {
    id: 'quest-adv-culture',
    title: 'Karnataka Heritage Scholar',
    titleKannada: 'ಕನ್ನಡ ಸಾಂಸ್ಕೃತಿಕ ವಿದ್ವಾಂಸ',
    category: 'advanced',
    description: 'Complete all 5 Culture Engine modules and score 100% on the Heritage Quizzes.',
    xpReward: 350,
    totalSteps: 5,
    currentSteps: 0,
    isCompleted: false,
    isUnlocked: false,
    requiredLevel: 3,
    actionTab: 'culture',
    steps: [
      'Study Regional Dialects (Mysuru vs Hubballi)',
      'Ace the Mysuru Dasara history quiz',
      'Review Manasollasa culinary roots',
      'Examine Classical Kannada literature milestones',
      'Master honorific etiquette in conversation'
    ]
  },
  {
    id: 'quest-adv-multimodal',
    title: 'Visual Signboard Detective',
    titleKannada: 'ಚಿತ್ರ ನೋಡಿ ಕನ್ನಡ ಗುರುತಿಸಿ',
    category: 'advanced',
    description: 'Capture or upload 2 Kannada signboards or objects using Visual Intelligence Mode.',
    xpReward: 250,
    totalSteps: 2,
    currentSteps: 0,
    isCompleted: false,
    isUnlocked: true,
    requiredLevel: 2,
    actionTab: 'vision',
    steps: [
      'Analyze first Kannada signboard or label',
      'Practice pronunciation of detected vocabulary'
    ]
  }
];
