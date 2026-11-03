import { CultureArticle } from '../../src/types/index.js';

export const KANNADA_CULTURE_ARTICLES: CultureArticle[] = [
  {
    id: 'cult-dialects-overview',
    titleKannada: 'ಕನ್ನಡದ ಪ್ರಮುಖ ಪ್ರಾದೇಶಿಕ ಉಪಭಾಷೆಗಳು',
    titleEnglish: 'Major Regional Dialects of Kannada',
    category: 'dialects',
    region: 'Karnataka Statewide',
    description: 'Kannada possesses a rich spectrum of regional dialects shaped by geography, history, and linguistic interactions. Learn the key distinctions between Mysuru-Bengaluru, Hubballi-Dharwad (Uttara Karnataka), Karavali (Coastal), and Kalaburagi (Kalyana Karnataka) idioms.',
    verifiedHistoricalNotes: 'Linguistically, Kannada belongs to the Dravidian language family with over 2,000 years of documented literary heritage. Epigraphical evidence like the Halmidi inscription (~450 CE) and Kavirajamarga (9th century) already noted regional variations across the land extending "between the Cauvery and the Godavari".',
    sourceCitation: 'Epigraphia Carnatica; Kavirajamarga (c. 850 CE); Linguistic Survey of India (Dravidian Family).',
    keyPhrases: [
      {
        kannada: 'ಹೇಗಿದ್ದೀರಿ? (ಹೇಗಿದ್ದೀರಾ?)',
        transliteration: 'Hēgiddīri? / Hēgiddīrā?',
        english: 'How are you? (Standard / Mysuru-Bengaluru)',
        context: 'Polite standard spoken across southern Karnataka and state media.'
      },
      {
        kannada: 'ಚಲೋ ಅದೀರಾ? / ಆರಾಮ್ ಅದೀರೇನು?',
        transliteration: 'Chalō adīrā? / Ārām adīrēnu?',
        english: 'Are you fine? (Hubballi-Dharwad / North Karnataka)',
        context: 'Warm, characteristic Northern Kannada using "ಚಲೋ" (good) and "ಅದೀರಾ" (are you).'
      },
      {
        kannada: 'ಖುಷಿಯಲ್ಲಿದ್ದೀರಾ? / ಎಂತ ಸಮಾಚಾರ?',
        transliteration: 'Khuṣiyalliddīrā? / Enta samāchāra?',
        english: 'Are you well? / What news? (Karavali / Coastal)',
        context: 'Coastal Karnataka cadence, melodic tone with distinctive retroflex lilt.'
      },
      {
        kannada: 'ಯಾಕ್ರೀ / ಏನನ್ರಿ',
        transliteration: 'Yākrī / Ēnanrī',
        english: 'Why, sir/ma\'am? / What is it? (Uttara Karnataka honorific suffix -ರೀ)',
        context: 'Affectionate respect marker "-ರೀ" universally used in North Karnataka conversation.'
      }
    ],
    quiz: {
      question: 'Which suffix is famously added to address someone respectfully in Hubballi-Dharwad and North Karnataka conversation?',
      options: ['-ಕಣ್ರಿ (-kanri)', '-ರೀ (-rī)', '-ಅಣ್ಣ (-anna)', '-ಸಾಹೇಬ್ರೇ (-sahebre)'],
      correctIndex: 1,
      explanation: 'The honorific suffix "-ರೀ" (as in "ಬರ್ರಿ", "ಹೋಗ್ರಿ", "ಯಾಕ್ರೀ") is the iconic hallmark of respect and warmth in North Karnataka Kannada.'
    }
  },
  {
    id: 'cult-mysuru-dasara',
    titleKannada: 'ಮೈಸೂರು ದಸರಾ ಮತ್ತು ನಾಡಹಬ್ಬದ ಪರಂಪರೆ',
    titleEnglish: 'Mysuru Dasara & The Naadahabba Tradition',
    category: 'festivals',
    region: 'Mysuru & Statewide',
    description: 'Celebrated as Karnataka’s state festival (ನಾಡಹಬ್ಬ / Naadahabba), Mysuru Dasara is a 10-day extravaganza commemorating Goddess Chamundeshwari’s victory over the demon Mahishasura.',
    verifiedHistoricalNotes: 'The royal festivities originated with the Vijayanagara Empire in the 14th century (Mahanavami Dibba in Hampi). Following the fall of Vijayanagara, Raja Wadiyar I continued the tradition in Srirangapatna in 1610 CE, which later shifted to Mysuru. The grand Jamboo Savari features the golden howdah (ಚಿನ್ನದ ಅಂಬಾರಿ) weighing 750 kg carried by the lead elephant.',
    sourceCitation: 'Mysore Gazetteer by B.L. Rice (1897); Archaeological Survey of India (Hampi Monument Series).',
    keyPhrases: [
      {
        kannada: 'ದಸರಾ ಹಬ್ಬದ ಶುಭಾಶಯಗಳು',
        transliteration: 'Dasarā habbada śubhāśayagaḷu',
        english: 'Happy Dasara festival greetings',
        context: 'Standard festive greeting shared among friends, family, and colleagues.'
      },
      {
        kannada: 'ಜಂಬೂ ಸವಾರಿ ನೋಡಲು ಹೋಗೋಣ',
        transliteration: 'Jambū savāri nōḍalu hōgōṇa',
        english: 'Let us go to watch the Jamboo Savari procession',
        context: 'Spoken on Vijayadashami day when the caparisoned elephant procession marches from Mysore Palace to Bannimantap.'
      },
      {
        kannada: 'ಅರಮನೆ ದೀಪಾಲಂಕಾರ ಅದ್ಭುತವಾಗಿದೆ',
        transliteration: 'Aramane dīpālaṅkāra adbhutavāgide',
        english: 'The palace illumination is magnificent',
        context: 'Over 100,000 bulbs illuminate the Mysore Palace facade during the festival nights.'
      }
    ],
    quiz: {
      question: 'Which dynasty originally started the grand Dasara public festival that the Wadiyars of Mysuru preserved?',
      options: ['Hoysala Empire', 'Vijayanagara Empire', 'Chalukya Dynasty', 'Rashtrakuta Dynasty'],
      correctIndex: 1,
      explanation: 'The Dasara celebration was celebrated on a massive scale by the Vijayanagara rulers at the Mahanavami Dibba in Hampi before Raja Wadiyar revived it in 1610 CE.'
    }
  },
  {
    id: 'cult-karnataka-cuisine',
    titleKannada: 'ಕರ್ನಾಟಕದ ಸಾಂಪ್ರದಾಯಿಕ ಊಟ ಮತ್ತು ಉಪಹಾರ',
    titleEnglish: 'Traditional Karnataka Cuisine & Hospitality',
    category: 'food',
    region: 'South & North Karnataka',
    description: 'From steaming Thatte Idlis and aromatic Bisi Bele Bath in the south to nutritious Jowar (Jolada) Roti with Yennegai (stuffed brinjal) in the north, Karnataka’s culinary landscape balances wholesome grains, balanced spices, and deep hospitality.',
    verifiedHistoricalNotes: 'The 12th-century Sanskrit encyclopedia Manasollasa, authored by Western Chalukya King Someshvara III in Kalyana (Bidar, Karnataka), documents medieval recipes including early preparations of dosas ("dosaka"), idlis ("iddarika"), and spice blends originating in Karnataka.',
    sourceCitation: 'Manasollasa of King Someshvara III (c. 1130 CE); "A Historical Dictionary of Indian Food" by K.T. Achaya.',
    keyPhrases: [
      {
        kannada: 'ಊಟ ಆಯ್ತಾ? / ತಿಂಡಿ ಆಯ್ತಾ?',
        transliteration: 'Ūṭa āytā? / Tinḍi āytā?',
        english: 'Did you have lunch/dinner? / Did you have breakfast/snacks?',
        context: 'The fundamental expression of care and warmth in Kannada culture, equivalent to "How are you?".'
      },
      {
        kannada: 'ಒಂದು ಬಿಸಿ ಬಿಸಿ ಫಿಲ್ಟರ್ ಕಾಫಿ ಕೊಡಿ',
        transliteration: 'Ondu bisi bisi philṭar kāphi koḍi',
        english: 'Please give me one piping hot filter coffee',
        context: 'Everyday phrase heard across Bengaluru Darshinis and Mysuru cafes.'
      },
      {
        kannada: 'ತುಪ್ಪ ಮತ್ತು ಸಾಂಬಾರ್ ಸ್ವಲ್ಪ ಹಾಕಿ',
        transliteration: 'Thuppa mattu sāmbār svalpa hāki',
        english: 'Please pour a little ghee and sambar',
        context: 'Common request during banana-leaf (ಬಾಳೆ ಎಲೆ) traditional feasts.'
      }
    ],
    quiz: {
      question: 'Which 12th-century royal text written in Karnataka by Chalukya King Someshvara III described ancient South Indian dishes?',
      options: ['Arthashastra', 'Manasollasa', 'Charaka Samhita', 'Kavirajamarga'],
      correctIndex: 1,
      explanation: 'King Someshvara III of the Western Chalukyas authored Manasollasa in 1130 CE, dedicating sections to royal culinary arts, seasonings, and dining etiquette.'
    }
  },
  {
    id: 'cult-kannada-literature',
    titleKannada: 'ಕನ್ನಡ ಸಾಹಿತ್ಯ ಪರಂಪರೆ ಮತ್ತು ಜ್ಞಾನಪೀಠ ಪ್ರಶಸ್ತಿಗಳು',
    titleEnglish: 'Classical Kannada Literature & Jnanpith Laureates',
    category: 'literature',
    region: 'Statewide',
    description: 'Kannada holds classical language status granted by the Government of India, boasting an unbroken literary lineage of over 1,500 years and the second highest number of Jnanpith Awards (8) in Indian literature.',
    verifiedHistoricalNotes: 'Classical Kannada spans Halagannada (Old Kannada), Nadugannada (Middle Kannada), and Hosagannada (Modern Kannada). Landmark figures include Adikavi Pampa (Vikramarjuna Vijaya), Basaveshwara and the 12th-century Vachana movement democratizing knowledge, Kumara Vyasa (Karnata Bharata Kathamanjari), and modern giants like Rashtrakavi Kuvempu and Da. Ra. Bendre.',
    sourceCitation: 'Sahitya Akademi archives; Government of India Classical Language Gazette Notification (2008).',
    keyPhrases: [
      {
        kannada: 'ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾೞ್ಗೆ',
        transliteration: 'Sirigannaḍaṁ gelge, sirigannaḍaṁ bāḻge',
        english: 'May glorious Kannada triumph, may glorious Kannada flourish',
        context: 'Historic motto inscribed in classical texts and recited on Kannada Rajyotsava.'
      },
      {
        kannada: 'ಕಾವೇರಿಯಿಂದಮಾ ಗೋದಾವರಿವರಮಿರ್ಪ ನಾಡದು ಕನ್ನಡದೊಳ್',
        transliteration: 'Kāvēriyindamā Gōdāvarivaramirpa nāḍadu Kannaḍadoḷ',
        english: 'The land spanning from the Cauvery to the Godavari is Kannada land',
        context: 'Famous opening verses of Kavirajamarga (9th century) demarcating historical Karnataka.'
      },
      {
        kannada: 'ಮನುಜಮತ, ವಿಶ್ವಪಥ (ಕುವೆಂಪು ಸಂದೇಶ)',
        transliteration: 'Manujamata, viśvapatha',
        english: 'Universal human brotherhood, the world path (Kuvempu’s vision)',
        context: 'Inspirational message advocating humanism beyond caste and dogma.'
      }
    ],
    quiz: {
      question: 'How many Jnanpith Awards (India’s highest literary honor) have been conferred upon Kannada litterateurs?',
      options: ['4 Awards', '6 Awards', '8 Awards', '10 Awards'],
      correctIndex: 2,
      explanation: 'Kannada litterateurs have been honored with 8 Jnanpith awards (including Kuvempu, Bendre, Shivaram Karanth, Masti, V.K. Gokak, U.R. Ananthamurthy, Girish Karnad, and Chandrashekhara Kambara).'
    }
  },
  {
    id: 'cult-conversational-etiquette',
    titleKannada: 'ದೈನಂದಿನ ಗೌರವ ಭಾಷೆ ಮತ್ತು ಸಂಭಾಷಣಾ ಶಿಷ್ಟಾಚಾರ',
    titleEnglish: 'Respectful Language & Conversational Etiquette',
    category: 'etiquette',
    region: 'Everyday Interaction',
    description: 'Using appropriate honorifics and polite verb forms is vital for natural, pleasant communication with shopkeepers, elders, co-passengers, and colleagues in Karnataka.',
    verifiedHistoricalNotes: 'Kannada grammar strictly distinguishes second-person singular informal (ನೀನು / nīnu) from plural/honorific (ನೀವು / nīvu), and third-person honorifics (ಅವರು / avaru). Addressing strangers or service providers with "ನೀವು" fosters mutual respect and immediate goodwill.',
    sourceCitation: 'A Grammar of the Kannada Language by F. Kittel; Modern Spoken Kannada (CIIL Mysore).',
    keyPhrases: [
      {
        kannada: 'ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಹಾಯ ಮಾಡುತ್ತೀರಾ?',
        transliteration: 'Dayaviṭṭu svalpa sahāya māḍuttīrā?',
        english: 'Could you please help me a little?',
        context: 'Polite request framing using "ದಯವಿಟ್ಟು" (please) and formal verb ending.'
      },
      {
        kannada: 'ಕ್ಷಮಿಸಿ, ನನಗೆ ತಡವಾಯಿತು',
        transliteration: 'Kṣamisi, nanage taḍavāyitu',
        english: 'Excuse me / Sorry, I am running late',
        context: 'Courteous acknowledgment when arriving late or bumping into someone.'
      },
      {
        kannada: 'ಮತ್ತೆ ಸಿಗೋಣ, ನಮಸ್ಕಾರ',
        transliteration: 'Matte sigōṇa, namaskāra',
        english: 'Let us meet again, goodbye',
        context: 'Warm parting phrase concluding conversations.'
      }
    ],
    quiz: {
      question: 'When addressing an auto driver, shopkeeper, or elder in Kannada, which pronoun reflects proper cultural etiquette?',
      options: ['ನೀನು (nīnu)', 'ನೀವು (nīvu)', 'ತಾನು (tānu)', 'ಅವನು (avanu)'],
      correctIndex: 1,
      explanation: '"ನೀವು (nīvu)" is the respectful formal pronoun used with adults, service providers, and acquaintances to show dignity and courteousness.'
    }
  }
];
