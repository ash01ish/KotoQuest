// --- RPG GAME STATE ---
let player = {
    level: 1,
    hp: 100,
    maxHp: 100,
    xp: 0,
    maxXp: 100,
    gold: 50,
    inventory: {
        potion: 1,
        shield: 1,
        hint: 1
    },
    streak: 1,
    stats: {
        totalAnswered: 0,
        totalCorrect: 0,
        byLevel: {
            N5: { answered: 0, correct: 0 },
            N4: { answered: 0, correct: 0 },
            N3: { answered: 0, correct: 0 },
            N2: { answered: 0, correct: 0 },
            N1: { answered: 0, correct: 0 }
        },
        byType: {}
    }
};

let activeEnemy = {
    name: 'HIRAGANA SLIME',
    hp: 40,
    maxHp: 40,
    sprite: 'あ',
    sub: 'N5 Slime',
    goldReward: 15,
    xpReward: 20,
    damage: 15
};

let currentTier = 'N5';
let activeQuestionIdx = 0;
let currentQuestQuestions = [];

// --- TRILINGUAL PARTICLE CALCULATOR DATA --// --- TRILINGUAL PARTICLE CALCULATOR DATA ---
const PARTICLE_CALC_DATA = {
    wa: {
        title: 'は (wa)',
        role: 'Topic Marker',
        english: 'As for... / (subject focus)',
        telugu: 'అయితే (aithe) / (unmarked)',
        hindi: 'तो (toh) / (unmarked)',
        korean: '은 / 는 (eun / neun)',
        tamil: 'அதாவது (adhavadhu) / (unmarked)',
        spanish: '(sujeto / nominativo)',
        examples: [
            { ja: '私は学生です。', ro: 'Watashi wa gakusei desu.', en: 'I am a student.', te: 'నేను అయితే విద్యార్థిని (Nenu aithe vidyarthini).', hi: 'मैं तो छात्र हूँ (Main toh chhaatr hoon).', ko: '나는 학생입니다 (Naneun haksaeng-imnida).', ta: 'நான் மாணவன் (Naan maanavan).', es: 'Yo soy estudiante.' }
        ]
    },
    o: {
        title: 'を (o)',
        role: 'Direct Object Marker',
        english: '(Marks receiving noun of the action)',
        telugu: 'ను / ని (nu / ni)',
        hindi: 'को (ko) / (unmarked)',
        korean: '을 / 를 (eul / reul)',
        tamil: 'ஐ (ai)',
        spanish: '(objeto directo)',
        examples: [
            { ja: '本を読みます。', ro: 'Hon o yomimasu.', en: 'Read a book.', te: 'పుస్తకాన్ని చదువుతాను (Pustakaanni chaduvutaanu).', hi: 'किताब को पढ़ता हूँ (Kitaab ko padhta hoon).', ko: '책을 읽습니다 (Chaegeul ilgseumnida).', ta: 'புத்தகத்தை படிக்கிறேன் (Puthagathai padikkiren).', es: 'Leo un libro.' }
        ]
    },
    ni: {
        title: 'に (ni)',
        role: 'Destination & Time Marker',
        english: 'To / At / On',
        telugu: 'కి / కు (ki / ku)',
        hindi: 'को / में (ko / mein)',
        korean: '에 / 에게 (e / ege)',
        tamil: 'க்கு (ku)',
        spanish: 'a / en',
        examples: [
            { ja: '東京に行きます。', ro: 'Toukyou ni ikimasu.', en: 'Go to Tokyo.', te: 'టోక్యోకు వెళ్తాను (Tokyoku velthaanu).', hi: 'टोक्यो को जाता हूँ (Tokyo ko jaata hoon).', ko: '도쿄에 갑니다 (Dokyo-e gabnida).', ta: 'டோக்கியோவுக்கு போகிறேன் (Tokyovukku pogiren).', es: 'Voy a Tokio.' }
        ]
    },
    de: {
        title: 'で (de)',
        role: 'Instrument / Location of Action',
        english: 'With / At / By / In',
        telugu: 'తో (tho) / లో (lo)',
        hindi: 'से (se) / में (mein)',
        korean: '로 (ro) / 에서 (eseo)',
        tamil: 'ஆல் (aal) / இல் (il)',
        spanish: 'con / en',
        examples: [
            { ja: 'ペンで書きます。', ro: 'Pen de kakimasu.', en: 'Write with a pen.', te: 'పెన్నుతో రాస్తాను (Pennuto raastaanu).', hi: 'पेन से लिखता हूँ (Pen se likhta hoon).', ko: '펜으로 씁니다 (Peneuro sseubnida).', ta: 'பேனாவால் எழுதுகிறேன் (Penavaal ezhudhugiren).', es: 'Escribo con un bolígrafo.' },
            { ja: 'レストランで食べます。', ro: 'Resutoran de tabemasu.', en: 'Eat at a restaurant.', te: 'రెస్టారెంట్ లో తింటాను (Restaurant lo thintaanu).', hi: 'रेस्टोरेंट में खाता हूँ (Restaurant mein khaata hoon).', ko: '식당에서 먹습니다 (Sigdang-eseo meogseumnida).', ta: 'உணவகத்தில் சாப்பிடுகிறேன் (Unavagathil saapidugiren).', es: 'Como en el restaurante.' }
        ]
    },
    no: {
        title: 'の (no)',
        role: 'Possessive Marker',
        english: 'Of / \'s',
        telugu: 'యొక్క (yokka)',
        hindi: 'का / की / के (ka / ki / ke)',
        korean: '의 (ui)',
        tamil: 'உடைய (udaiya)',
        spanish: 'de',
        examples: [
            { ja: '私の本。', ro: 'Watashi no hon.', en: 'My book.', te: 'నా యొక్క పుస్తకం (Naa yokka pustakam).', hi: 'मेरी किताब (Meri kitaab).', ko: '나의 책 (Naui chaeg).', ta: 'என்னுடைய புத்தகம் (Ennudaiya puthagam).', es: 'Mi libro (El libro de mí).' }
        ]
    },
    to: {
        title: 'と (to)',
        role: 'Accompaniment / And',
        english: 'With / And',
        telugu: 'తో (tho) / మరియు (mariyu)',
        hindi: 'के साथ (ke sath) / और (aur)',
        korean: '와 / 과 (wa / gwa) / 하고 (hago)',
        tamil: 'உடன் (udan) / மற்றும் (matrum)',
        spanish: 'con / y',
        examples: [
            { ja: '友達と行きます。', ro: 'Tomodachi to ikimasu.', en: 'Go with a friend.', te: 'స్నేహితుడితో వెళ్తాను (Snehitudito velthaanu).', hi: 'दोस्त के साथ जाता हूँ (Dost ke sath jaata hoon).', ko: '친구와 갑니다 (Chingu-wa gabnida).', ta: 'நண்பனுடன் போகிறேன் (Nanbanudan pogiren).', es: 'Voy con un amigo.' }
        ]
    },
    kara: {
        title: 'から (kara)',
        role: 'Source Marker (From)',
        english: 'From / Since',
        telugu: 'నుండి / నుంచి (nundi / nunchi)',
        hindi: 'से (se)',
        korean: '에서 (eseo) / 부터 (buteo)',
        tamil: 'இருந்து (irundhu)',
        spanish: 'desde / de',
        examples: [
            { ja: '家から来ました。', ro: 'Ie kara kimashita.', en: 'Came from home.', te: 'ఇంటి నుండి వచ్చాను (Inti nundi vacchaanu).', hi: 'घर से आया हूँ (Ghar se aaya hoon).', ko: '집에서 왔습니다 (Jib-eseo wasseumnida).', ta: 'வீட்டிலிருந்து வந்தேன் (Veettil-irundhu vandhen).', es: 'Vine de casa.' }
        ]
    },
    made: {
        title: 'まで (made)',
        role: 'Limit Marker (Until)',
        english: 'Until / Up to / As far as',
        telugu: 'వరకు (varaku)',
        hindi: 'तक (tak)',
        korean: '까지 (kkaji)',
        tamil: 'வரை (varai)',
        spanish: 'hasta',
        examples: [
            { ja: '明日まで待ちます。', ro: 'Ashita made machimasu.', en: 'Wait until tomorrow.', te: 'రేపటి వరకు వేచి ఉంటాను (Repati varaku vechi untaanu).', hi: 'कल तक इंतज़ार करूँगा (Kal tak intezar karunga).', ko: '내일까지 기다립니다 (Naeil-kkaji gidaribnida).', ta: 'நாளை வரை காத்திருப்பேன் (Naalai varai kaathiruppen).', es: 'Esperaré hasta mañana.' }
        ]
    }
};

// --- EXTENDED LEVEL DATABASES (N5 TO N1) ---
const QUEST_DATABASE = {
    N5: [
        { q: 'What is the vowel character representing the "ah" sound?', answer: 'あ', options: ['あ', 'い', 'う', 'え'], style: 'mc', type: 'Hiragana' },
        { q: 'What is the vowel character representing the "ee" sound?', answer: 'い', options: ['あ', 'い', 'う', 'お'], style: 'mc', type: 'Hiragana' },
        { q: 'Which particle marks the main Topic of the sentence (Telugu Equivalent: aithe / Hindi: toh)?', answer: 'は', options: ['は', 'を', 'に', 'で'], style: 'mc', type: 'Particle' },
        { q: 'Which particle marks the Direct Object receiving action (Telugu: nu/ni - Hindi: ko)?', answer: 'を', options: ['は', 'を', 'に', 'の'], style: 'mc', type: 'Particle' },
        { q: 'Translate the number "One" (一) to Romaji spelling:', answer: 'ichi', style: 'text', type: 'Spelling' },
        { q: 'Translate the number "Ten" (十) to Romaji spelling:', answer: 'juu', style: 'text', type: 'Spelling' },
        { q: 'What is the meaning of the noun "みず" (mizu)?', answer: 'Water', options: ['Water', 'Bathroom', 'Sushi', 'Cat'], style: 'mc', type: 'Vocabulary' },
        { q: 'Translate the greeting "Hello / Good Afternoon":', answer: 'Konnichiwa', options: ['Konnichiwa', 'Arigatou', 'Sumimasen', 'Sayonara'], style: 'mc', type: 'Phrase' }
    ],
    N4: [
        { q: 'Which particle marks the Destination or Direction (Telugu: ki/ku - Hindi: ko)?', answer: 'に', options: ['に', 'を', 'で', 'の'], style: 'mc', type: 'Particle' },
        { q: 'Translate the polite present verb "たべます" (tabemasu):', answer: 'Eat', options: ['Eat', 'Drink', 'Go', 'Do'], style: 'mc', type: 'Verb' },
        { q: 'What is the past positive form of "たべます" (ate politely)?', answer: 'たべました', options: ['たべました', 'たべません', 'たべます', 'たべませんでした'], style: 'mc', type: 'Verb Conjugation' },
        { q: 'What is the negative present form of "のむ" (do not drink politely)?', answer: 'のみません', options: ['のみません', 'のみます', 'のみました', 'のみませんでした'], style: 'mc', type: 'Verb Conjugation' },
        { q: 'What is the class group of the verb "たべる" (taberu: to eat)?', answer: 'Ru-verb (Group 1)', options: ['Ru-verb (Group 1)', 'U-verb (Group 2)', 'Irregular verb', 'Adjective'], style: 'mc', type: 'Grammar' },
        { q: 'Translate "Excuse me / Sorry":', answer: 'Sumimasen', options: ['Sumimasen', 'Arigatou', 'Kore', 'Doko'], style: 'mc', type: 'Vocabulary' },
        { q: 'What kind of adjective is "おいしい" (oishii: delicious)?', answer: 'I-adjective', options: ['I-adjective', 'Na-adjective', 'Irregular', 'Verb'], style: 'mc', type: 'Grammar' }
    ],
    N3: [
        { q: 'What is the meaning of the Kanji symbol: "日"?', answer: 'Sun / Day', options: ['Sun / Day', 'Moon / Month', 'Water', 'Fire'], style: 'mc', type: 'Kanji' },
        { q: 'What is the meaning of the Kanji symbol: "月"?', answer: 'Moon / Month', options: ['Sun / Day', 'Moon / Month', 'Water', 'Tree'], style: 'mc', type: 'Kanji' },
        { q: 'Translate: "Where is the bathroom?"', answer: 'トイレはどこですか。', options: ['トイレはどこですか。', 'お水をください。', 'これはいくらですか。', 'ありがとうございます。'], style: 'mc', type: 'Phrase' },
        { q: 'Which particle indicates Location of an Action (Telugu: lo - Hindi: mein)?', answer: 'で', options: ['で', 'に', 'を', 'の'], style: 'mc', type: 'Particle' },
        { q: 'Translate the past negative polite verb "did not drink":', answer: 'のみませんでした', options: ['のみませんでした', 'のみません', 'のみました', 'のみます'], style: 'mc', type: 'Verb Conjugation' },
        { q: 'What is the meaning of the Kanji pictogram: "人"?', answer: 'Person', options: ['Person', 'Mountain', 'River', 'Gold'], style: 'mc', type: 'Kanji' }
    ],
    N2: [
        { q: 'Translate the vocabulary word: "昨日" (Kinoo):', answer: 'Yesterday', options: ['Yesterday', 'Today', 'Tomorrow', 'Last week'], style: 'mc', type: 'Vocab' },
        { q: 'What is the reading of "先生" (Teacher)?', answer: 'sensei', style: 'text', type: 'Spelling' },
        { q: 'Translate "これはいくらですか" to English:', answer: 'How much is this?', options: ['How much is this?', 'Where is the station?', 'Please give me water.', 'Excuse me.'], style: 'mc', type: 'Phrase' },
        { q: 'Which particle is used to show accompaniment (Telugu: tho - Hindi: ke sath)?', answer: 'と', options: ['と', 'で', 'に', 'を'], style: 'mc', type: 'Particle' },
        { q: 'Identify the Na-adjective representation for "Quiet":', answer: 'しずかな', options: ['しずかな', 'おいしい', 'おおきい', 'かわいい'], style: 'mc', type: 'Grammar' }
    ],
    N1: [
        { q: 'Identify the meaning of the formal compound word: "社会" (Shakai):', answer: 'Society', options: ['Society', 'Education', 'Economy', 'Government'], style: 'mc', type: 'Vocab' },
        { q: 'Identify the meaning of the academic N1 word: "教育" (Kyoiku):', answer: 'Education', options: ['Education', 'Society', 'Economy', 'Science'], style: 'mc', type: 'Vocab' },
        { q: 'Translate the structural term "経済" (Keizai):', answer: 'Economy', options: ['Economy', 'Politics', 'Law', 'Industry'], style: 'mc', type: 'Vocab' },
        { q: 'Identify the reading of "日本" (Japan):', answer: 'nihon', style: 'text', type: 'Spelling' },
        { q: 'Which particle acts as a possession marker (Telugu: yokka - Hindi: ka/ki/ke)?', answer: 'の', options: ['の', 'は', 'を', 'に'], style: 'mc', type: 'Particle' }
    ]
};

// --- DATA DEFINITIONS FOR STATIC TABS ---
const HIRAGANA_DATA = [
    { ja: 'あ', ro: 'a' }, { ja: 'い', ro: 'i' }, { ja: 'う', ro: 'u' }, { ja: 'え', ro: 'e' }, { ja: 'お', ro: 'o' },
    { ja: 'か', ro: 'ka' }, { ja: 'き', ro: 'ki' }, { ja: 'く', ro: 'ku' }, { ja: 'け', ro: 'ke' }, { ja: 'こ', ro: 'ko' },
    { ja: 'さ', ro: 'sa' }, { ja: 'し', ro: 'shi' }, { ja: 'す', ro: 'su' }, { ja: 'せ', ro: 'se' }, { ja: 'そ', ro: 'so' },
    { ja: 'た', ro: 'ta' }, { ja: 'ち', ro: 'chi' }, { ja: 'つ', ro: 'tsu' }, { ja: 'て', ro: 'te' }, { ja: 'と', ro: 'to' },
    { ja: 'な', ro: 'na' }, { ja: 'に', ro: 'ni' }, { ja: 'ぬ', ro: 'nu' }, { ja: 'ね', ro: 'ne' }, { ja: 'の', ro: 'no' },
    { ja: 'は', ro: 'ha' }, { ja: 'ひ', ro: 'hi' }, { ja: 'ふ', ro: 'fu' }, { ja: 'へ', ro: 'he' }, { ja: 'ほ', ro: 'ho' },
    { ja: 'ま', ro: 'ma' }, { ja: 'み', ro: 'mi' }, { ja: 'む', ro: 'mu' }, { ja: 'め', ro: 'me' }, { ja: 'も', ro: 'mo' },
    { ja: 'や', ro: 'ya' }, { empty: true }, { ja: 'ゆ', ro: 'yu' }, { empty: true }, { ja: 'よ', ro: 'yo' },
    { ja: 'ら', ro: 'ra' }, { ja: 'り', ro: 'ri' }, { ja: 'る', ro: 'ru' }, { ja: 'れ', ro: 're' }, { ja: 'ろ', ro: 'ro' },
    { ja: 'わ', ro: 'wa' }, { empty: true }, { empty: true }, { empty: true }, { ja: 'を', ro: 'o' },
    { ja: 'ん', ro: 'n' }, { empty: true }, { empty: true }, { empty: true }, { empty: true }
];

const KATAKANA_DATA = [
    { ja: 'ア', ro: 'a' }, { ja: 'イ', ro: 'i' }, { ja: 'ウ', ro: 'u' }, { ja: 'エ', ro: 'e' }, { ja: 'オ', ro: 'o' },
    { ja: 'カ', ro: 'ka' }, { ja: 'キ', ro: 'ki' }, { ja: 'ク', ro: 'ku' }, { ja: 'ケ', ro: 'ke' }, { ja: 'コ', ro: 'ko' },
    { ja: 'サ', ro: 'sa' }, { ja: 'シ', ro: 'shi' }, { ja: 'ス', ro: 'su' }, { ja: 'セ', ro: 'se' }, { ja: 'ソ', ro: 'so' },
    { ja: 'タ', ro: 'ta' }, { ja: 'チ', ro: 'chi' }, { ja: 'ツ', ro: 'tsu' }, { ja: 'テ', ro: 'te' }, { ja: 'ト', ro: 'to' },
    { ja: 'ナ', ro: 'na' }, { ja: 'ニ', ro: 'ni' }, { ja: 'ヌ', ro: 'nu' }, { ja: 'ネ', ro: 'ne' }, { ja: 'ノ', ro: 'no' },
    { ja: 'ハ', ro: 'ha' }, { ja: 'ヒ', ro: 'hi' }, { ja: 'フ', ro: 'fu' }, { ja: 'ヘ', ro: 'he' }, { ja: 'ホ', ro: 'ho' },
    { ja: 'マ', ro: 'ma' }, { ja: 'ミ', ro: 'mi' }, { ja: 'ム', ro: 'mu' }, { ja: 'メ', ro: 'me' }, { ja: 'モ', ro: 'mo' },
    { ja: 'ヤ', ro: 'ya' }, { empty: true }, { ja: 'ユ', ro: 'yu' }, { empty: true }, { ja: 'よ', ro: 'yo' },
    { ja: 'ラ', ro: 'ra' }, { ja: 'リ', ro: 'ri' }, { ja: 'ル', ro: 'ru' }, { ja: 'レ', ro: 're' }, { ja: 'ロ', ro: 'ro' },
    { ja: 'ワ', ro: 'wa' }, { empty: true }, { empty: true }, { empty: true }, { ja: 'ヲ', ro: 'o' },
    { ja: 'ン', ro: 'n' }, { empty: true }, { empty: true }, { empty: true }, { empty: true }
];

const VOCAB_DATA = {
    kana: [
        { ja: 'あ', ro: 'a', meaning: 'Letter: A', type: 'Hiragana', pronounce: '"ah"' },
        { ja: 'い', ro: 'i', meaning: 'Letter: I', type: 'Hiragana', pronounce: '"ee"' },
        { ja: 'う', ro: 'u', meaning: 'Letter: U', type: 'Hiragana', pronounce: '"oo"' }
    ],
    numbers: [
        { ja: '一', ro: 'ichi', meaning: 'One (1)', type: 'Number', pronounce: 'ee-chee' },
        { ja: '二', ro: 'ni', meaning: 'Two (2)', type: 'Number', pronounce: 'nee' }
    ],
    phrases: [
        { ja: 'こんにちは', ro: 'konnichiwa', meaning: 'Hello / Good Afternoon', type: 'Greeting', pronounce: 'kohn-nee-chee-wah' }
    ]
};

const SENTENCE_LEVELS = [
    {
        prompt: 'Target: "I eat sushi."',
        tePrompt: 'నేను సుశి తింటాను (Nenu sushi thintaanu)',
        hiPrompt: 'मैं सुशी खाता हूँ (Main sushi khaata hoon)',
        correctOrder: ['わたし', 'は', 'すし', 'を', 'たべます'],
        words: [
            { ja: 'わたし', en: 'I', part: false },
            { ja: 'は', en: '[Topic]', part: true },
            { ja: 'すし', en: 'Sushi', part: false },
            { ja: 'を', en: '[Object]', part: true },
            { ja: 'たべます', en: 'Eat', part: false }
        ]
    },
    {
        prompt: 'Target: "She drinks water."',
        tePrompt: 'ఆమె నీరు తాగుతుంది (Ame neeru thaguthundi)',
        hiPrompt: 'वह पानी पीती है (Wah paani peeti hai)',
        correctOrder: ['かのじょ', 'は', 'みず', 'を', 'のみます'],
        words: [
            { ja: 'かのじょ', en: 'She', part: false },
            { ja: 'は', en: '[Topic]', part: true },
            { ja: 'みず', en: 'Water', part: false },
            { ja: 'を', en: '[Object]', part: true },
            { ja: 'のみます', en: 'Drink', part: false }
        ]
    },
    {
        prompt: 'Target: "I go to Japan."',
        tePrompt: 'నేను జపాన్ కు వెళ్తాను (Nenu Japan ku velthaanu)',
        hiPrompt: 'मैं जापान जाता हूँ (Main Japan jaata hoon)',
        correctOrder: ['わたし', 'は', 'にほん', 'に', 'いきます'],
        words: [
            { ja: 'わたし', en: 'I', part: false },
            { ja: 'は', en: '[Topic]', part: true },
            { ja: 'にほん', en: 'Japan', part: false },
            { ja: 'に', en: '[To]', part: true },
            { ja: 'いきます', en: 'Go', part: false }
        ]
    },
    {
        prompt: 'Target: "My cat is cute."',
        tePrompt: 'నా పిల్లి ముద్దుగా ఉంది (Naa pilli mudduga undi)',
        hiPrompt: 'मेरी बिल्ली प्यारी है (Meri billi pyaari hai)',
        correctOrder: ['わたし', 'の', 'ねこ', 'は', 'かわいい', 'です'],
        words: [
            { ja: 'わたし', en: 'I', part: false },
            { ja: 'の', en: '[\'s / Possession]', part: true },
            { ja: 'ねこ', en: 'Cat', part: false },
            { ja: 'は', en: '[Topic]', part: true },
            { ja: 'かわいい', en: 'Cute', part: false },
            { ja: 'です', en: 'Is', part: false }
        ]
    }
];

const CANVAS_GUIDES = [
    { ja: 'あ', ro: 'a', type: 'Hiragana' },
    { ja: 'い', ro: 'i', type: 'Hiragana' }
];

// --- APP INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    loadGameData();
    setupTabs();
    setupDaySelector();
    setupKanaGrid();
    setupCanvas();
    setupFlashcards();
    setupSentenceBuilder();
    setupAudioSpeakButtons();
    
    // RPG specific binds
    setupRPGQuestArena();
    setupRPGShop();
    
    // Trilingual Calculator binds
    setupTrilingualCalculator();

    // Native Language selector binds
    setupNativeLanguageSelector();
    
    // Draw initial HUD & start first battle
    updateHUDDisplays();
    startNewBattle();
});

// Load player stats from LocalStorage
function loadGameData() {
    const savedPlayer = localStorage.getItem('samurai_player');
    if (savedPlayer) {
        player = JSON.parse(savedPlayer);
    }
}

function saveGameData() {
    localStorage.setItem('samurai_player', JSON.stringify(player));
}

// Global visual HUD synchronization
function updateHUDDisplays() {
    document.getElementById('player-level-display').textContent = `Lv. ${player.level}`;
    document.getElementById('player-xp-text').textContent = `${player.xp} / ${player.maxXp}`;
    const xpPercent = Math.min((player.xp / player.maxXp) * 100, 100);
    document.getElementById('player-xp-bar').style.width = `${xpPercent}%`;
    
    document.getElementById('player-hp-text').textContent = `${player.hp} / ${player.maxHp}`;
    const hpPercent = Math.min((player.hp / player.maxHp) * 100, 100);
    document.getElementById('player-hp-bar').style.width = `${hpPercent}%`;
    
    document.getElementById('player-gold-display').innerHTML = `<i class="fa-solid fa-coins"></i> ${player.gold} Gold`;
    document.getElementById('streak-count').textContent = `${player.streak} Day`;
    
    let rank = 'Novice';
    if (player.level >= 5) rank = 'Bushido';
    if (player.level >= 12) rank = 'Shogun';
    if (player.level >= 20) rank = 'Kensei (Sword Saint)';
    document.getElementById('rank-name').textContent = rank;

    updateInventoryBadges();
}

function updateInventoryBadges() {
    const items = ['potion', 'shield', 'hint'];
    items.forEach(item => {
        const qty = player.inventory[item] || 0;
        const badge = document.getElementById(`badge-${item}`);
        const slot = document.getElementById(`slot-${item}`);
        
        if (qty > 0) {
            badge.textContent = qty;
            badge.style.display = 'flex';
            slot.classList.remove('empty');
        } else {
            badge.style.display = 'none';
            slot.classList.add('empty');
        }
    });
}

// --- SPEECH SYNTHESIS ENGINE ---
function speakJapanese(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';
        
        const voices = window.speechSynthesis.getVoices();
        const jaVoice = voices.find(v => v.lang === 'ja-JP' || v.lang.startsWith('ja'));
        if (jaVoice) utterance.voice = jaVoice;
        
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
    }
}

function setupAudioSpeakButtons() {
    document.querySelectorAll('.speak-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            speakJapanese(btn.getAttribute('data-speak'));
        });
    });
}

// --- TABS SWITCHER ---
function setupTabs() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabPanels = document.querySelectorAll('.tab-content');
    
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            navTabs.forEach(t => t.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            tab.classList.add('active');
            const targetEl = document.getElementById(targetTab);
            if (targetEl) targetEl.classList.add('active');
            
            if (targetTab === 'canvas') {
                resizeCanvas();
                drawCanvasGuide();
            }
        });
    });
}

// --- DAY SELECTOR ---
function setupDaySelector() {
    const dayBtns = document.querySelectorAll('.day-btn');
    const dayPanes = document.querySelectorAll('.day-pane');
    
    dayBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            dayBtns.forEach(b => b.classList.remove('active'));
            dayPanes.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`day-pane-${btn.getAttribute('data-day')}`).classList.add('active');
        });
    });
}

// --- KANA GRID GENERATION ---
function setupKanaGrid() {
    const gridContainer = document.getElementById('kana-grid-container');
    const toggles = document.querySelectorAll('#kana-type-toggle .toggle-btn');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            toggles.forEach(t => t.classList.remove('active'));
            toggle.classList.add('active');
            renderKana(toggle.getAttribute('data-type'));
        });
    });
    
    renderKana('hiragana');
    
    function renderKana(type) {
        gridContainer.innerHTML = '';
        const dataset = type === 'hiragana' ? HIRAGANA_DATA : KATAKANA_DATA;
        
        dataset.forEach(item => {
            const cell = document.createElement('div');
            if (item.empty) {
                cell.className = 'kana-cell empty';
            } else {
                cell.className = 'kana-cell';
                cell.innerHTML = `
                    <div class="play-icon"><i class="fa-solid fa-volume-high"></i></div>
                    <div class="kana-char">${item.ja}</div>
                    <div class="kana-romaji">${item.ro}</div>
                `;
                cell.addEventListener('click', () => speakJapanese(item.ja));
            }
            gridContainer.appendChild(cell);
        });
    }
}

// --- DRAWING CANVAS WRITER ---
let canvas, ctx;
let isDrawing = false;
let lastX = 0, lastY = 0;
let guideIdx = 0, showGuides = true;

function setupCanvas() {
    canvas = document.getElementById('practice-canvas');
    ctx = canvas.getContext('2d');
    
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', drawing);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('mouseleave', stopDraw);
    
    // Mobile Touch binds
    canvas.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        isDrawing = true;
        lastX = touch.clientX - rect.left;
        lastY = touch.clientY - rect.top;
    });
    canvas.addEventListener('touchmove', (e) => {
        if (!isDrawing) return;
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const curX = touch.clientX - rect.left;
        const curY = touch.clientY - rect.top;
        drawStroke(lastX, lastY, curX, curY);
        lastX = curX;
        lastY = curY;
    });
    canvas.addEventListener('touchend', stopDraw);
    
    document.getElementById('btn-clear-canvas').addEventListener('click', () => {
        ctx.clearRect(0,0,canvas.width,canvas.height);
        drawCanvasGuide();
    });
    
    document.getElementById('btn-check-stroke').addEventListener('click', () => {
        showGuides = !showGuides;
        const btn = document.getElementById('btn-check-stroke');
        btn.innerHTML = showGuides ? '<i class="fa-solid fa-lightbulb"></i> Hide Guide Lines' : '<i class="fa-solid fa-lightbulb"></i> Show Guide Lines';
        btn.className = showGuides ? 'btn btn-teal' : 'btn';
        ctx.clearRect(0,0,canvas.width,canvas.height);
        drawCanvasGuide();
    });
    
    document.getElementById('btn-prev-guide').addEventListener('click', () => {
        guideIdx = (guideIdx - 1 + CANVAS_GUIDES.length) % CANVAS_GUIDES.length;
        updateGuide();
    });
    
    document.getElementById('btn-next-guide').addEventListener('click', () => {
        guideIdx = (guideIdx + 1) % CANVAS_GUIDES.length;
        updateGuide();
    });
    
    updateGuide();
}

function startDraw(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
}

function drawing(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;
    drawStroke(lastX, lastY, curX, curY);
    lastX = curX;
    lastY = curY;
}

function drawStroke(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = '#ff6b8b';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
}

function stopDraw() { isDrawing = false; }

function resizeCanvas() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 350;
    canvas.height = rect.height || 350;
}

function drawCanvasGuide() {
    if (!showGuides || !canvas) return;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.setLineDash([]); // reset
    
    const item = CANVAS_GUIDES[guideIdx];
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.font = '240px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.ja, canvas.width / 2, canvas.height / 2 + 10);
}

function updateGuide() {
    const item = CANVAS_GUIDES[guideIdx];
    document.getElementById('guide-character').textContent = item.ja;
    document.getElementById('guide-romaji').textContent = item.ro;
    document.getElementById('guide-type').textContent = item.type;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawCanvasGuide();
}

// --- FLASHCARDS CONTROLLER ---
let cardCat = 'kana', cardIdx = 0;
function setupFlashcards() {
    const box = document.getElementById('flashcard-card-box');
    box.addEventListener('click', () => box.classList.toggle('flipped'));
    
    const toggles = document.querySelectorAll('#flashcard-category-toggle .toggle-btn');
    toggles.forEach(t => {
        t.addEventListener('click', () => {
            toggles.forEach(btn => btn.classList.remove('active'));
            t.classList.add('active');
            cardCat = t.getAttribute('data-cat');
            cardIdx = 0;
            updateCard();
        });
    });
    
    document.getElementById('btn-card-prev').addEventListener('click', () => {
        const list = VOCAB_DATA[cardCat];
        cardIdx = (cardIdx - 1 + list.length) % list.length;
        updateCard();
    });
    
    document.getElementById('btn-card-next').addEventListener('click', () => {
        const list = VOCAB_DATA[cardCat];
        cardIdx = (cardIdx + 1) % list.length;
        updateCard();
    });
    
    document.getElementById('btn-card-audio').addEventListener('click', (e) => {
        e.stopPropagation();
        const list = VOCAB_DATA[cardCat];
        speakJapanese(list[cardIdx].ja);
    });
    
    updateCard();
}

function updateCard() {
    const box = document.getElementById('flashcard-card-box');
    box.classList.remove('flipped');
    
    const list = VOCAB_DATA[cardCat];
    const card = list[cardIdx];
    
    document.getElementById('card-progress').textContent = `${cardIdx + 1} / ${list.length}`;
    document.getElementById('card-front-type').textContent = card.type.toUpperCase();
    document.getElementById('card-front-txt').textContent = card.ja;
    document.getElementById('card-back-type').textContent = 'EXPLANATION';
    document.getElementById('card-back-pronounce').textContent = `Pronunciation: ${card.pronounce}`;
    document.getElementById('card-back-meaning').textContent = card.meaning;
    document.getElementById('card-back-romaji').textContent = `Romaji: ${card.ro}`;
}

// --- SENTENCE BUILDER ---
let buildIdx = 0, buildSelected = [];
function setupSentenceBuilder() {
    document.getElementById('btn-clear-sentence').addEventListener('click', loadBuildLevel);
    document.getElementById('btn-check-sentence').addEventListener('click', checkBuildSentence);
    document.getElementById('btn-next-sentence').addEventListener('click', () => {
        buildIdx = (buildIdx + 1) % SENTENCE_LEVELS.length;
        loadBuildLevel();
    });
    
    loadBuildLevel();
}

// Keep track of the shuffled bank order so it doesn't shuffle on every click
let currentBankShuffled = [];

function loadBuildLevel() {
    const lvl = SENTENCE_LEVELS[buildIdx];
    const lang = player.nativeLanguage || 'telugu';
    let promptText = lvl.prompt;
    if (lang === 'telugu' && lvl.tePrompt) {
        promptText += ` <br><span style="font-size: 0.9rem; color: var(--accent-pink);">Native: ${lvl.tePrompt}</span>`;
    } else if (lang === 'hindi' && lvl.hiPrompt) {
        promptText += ` <br><span style="font-size: 0.9rem; color: var(--accent-gold);">Native: ${lvl.hiPrompt}</span>`;
    }
    document.getElementById('sentence-prompt').innerHTML = promptText;
    document.getElementById('sentence-feedback').className = 'sentence-feedback';
    document.getElementById('sentence-feedback').textContent = '';
    
    buildSelected = [];
    currentBankShuffled = [...lvl.words].sort(() => Math.random() - 0.5);
    
    renderSentenceBuilder();
}

function renderSentenceBuilder() {
    renderWorkspace();
    renderWordBank();
}

function renderWorkspace() {
    const ws = document.getElementById('sentence-workspace');
    ws.className = 'sentence-workspace';
    ws.innerHTML = '';
    
    buildSelected.forEach((w, i) => {
        const chip = document.createElement('div');
        chip.className = `word-chip ${w.part ? 'particle' : ''}`;
        chip.innerHTML = `<span class="chip-ja">${w.ja}</span><span class="chip-en">${w.en}</span>`;
        chip.addEventListener('click', () => {
            buildSelected.splice(i, 1);
            renderSentenceBuilder();
        });
        ws.appendChild(chip);
    });
}

function renderWordBank() {
    const bank = document.getElementById('sentence-word-bank');
    bank.innerHTML = '';
    
    currentBankShuffled.forEach(w => {
        if (!buildSelected.includes(w)) {
            const chip = document.createElement('div');
            chip.className = `word-chip ${w.part ? 'particle' : ''}`;
            chip.innerHTML = `<span class="chip-ja">${w.ja}</span><span class="chip-en">${w.en}</span>`;
            chip.addEventListener('click', () => {
                buildSelected.push(w);
                renderSentenceBuilder();
                speakJapanese(w.ja);
            });
            bank.appendChild(chip);
        }
    });
}

function checkBuildSentence() {
    const lvl = SENTENCE_LEVELS[buildIdx];
    const sequence = buildSelected.map(w => w.ja);
    const matches = sequence.length === lvl.correctOrder.length && sequence.every((v, idx) => v === lvl.correctOrder[idx]);
    const ws = document.getElementById('sentence-workspace');
    const feedback = document.getElementById('sentence-feedback');
    
    if (matches) {
        ws.classList.add('correct');
        feedback.className = 'sentence-feedback success';
        feedback.innerHTML = '<i class="fa-solid fa-circle-check"></i> Correct order!';
        speakJapanese(sequence.join(''));
    } else {
        feedback.className = 'sentence-feedback error';
        feedback.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Wrong structure. Keep practicing SOV order!';
    }
}

// --- ==================================================== ---
// --- RPG COMBAT ARENA LOOP ENGINE                         ---
// --- ==================================================== ---

function setupRPGQuestArena() {
    const btns = document.querySelectorAll('#quest-tier-selector .quest-tier-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTier = btn.getAttribute('data-tier');
            addLog(`Quest changed to ${currentTier} Difficulty. Spawning boss...`, 'system');
            startNewBattle();
        });
    });

    document.getElementById('btn-speak-question').addEventListener('click', () => {
        const q = currentQuestQuestions[activeQuestionIdx];
        if (q) speakJapanese(q.q || q.question);
    });

    document.getElementById('btn-escape-quest').addEventListener('click', () => {
        addLog("You retreated safely from battle!", "system");
        startNewBattle();
    });

    document.getElementById('slot-potion').addEventListener('click', () => useInventoryItem('potion'));
    document.getElementById('slot-hint').addEventListener('click', () => useInventoryItem('hint'));
    
    document.getElementById('btn-combat-submit-answer').addEventListener('click', submitTextAttack);
    document.getElementById('combat-text-answer').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitTextAttack();
    });
}

function addLog(text, style = '') {
    const box = document.getElementById('battle-log');
    const entry = document.createElement('div');
    entry.className = `log-entry ${style}`;
    entry.textContent = `> ${text}`;
    box.appendChild(entry);
    box.scrollTop = box.scrollHeight;
}

function startNewBattle() {
    let hpMax = 40;
    let monsterName = 'HIRAGANA SLIME';
    let rewardG = 15;
    let rewardXP = 20;
    let attackDmg = 15;
    
    if (currentTier === 'N5') {
        monsterName = 'HIRAGANA SLIME';
        hpMax = 40;
        rewardG = 15;
        rewardXP = 20;
        attackDmg = 15;
    } else if (currentTier === 'N4') {
        monsterName = 'CONJUGATION WARRIOR';
        hpMax = 60;
        rewardG = 25;
        rewardXP = 35;
        attackDmg = 20;
    } else if (currentTier === 'N3') {
        monsterName = 'KANJI SHOGUN';
        hpMax = 80;
        rewardG = 40;
        rewardXP = 50;
        attackDmg = 25;
    } else if (currentTier === 'N2') {
        monsterName = 'ADVANCED NINJA';
        hpMax = 100;
        rewardG = 65;
        rewardXP = 80;
        attackDmg = 30;
    } else if (currentTier === 'N1') {
        monsterName = 'MASTER DRAGON';
        hpMax = 120;
        rewardG = 100;
        rewardXP = 120;
        attackDmg = 35;
    }
    
    activeEnemy = {
        name: monsterName,
        hp: hpMax,
        maxHp: hpMax,
        sprite: getRandomSprite(currentTier),
        sub: `Tier ${currentTier} Monster`,
        goldReward: rewardG,
        xpReward: rewardXP,
        damage: attackDmg
    };
    
    document.getElementById('enemy-name').textContent = activeEnemy.name;
    document.getElementById('enemy-sprite').textContent = activeEnemy.sprite;
    document.getElementById('enemy-sub-label').textContent = activeEnemy.sub;
    updateEnemyHPBar();
    
    const rawQuestions = QUEST_DATABASE[currentTier];
    currentQuestQuestions = [...rawQuestions].sort(() => Math.random() - 0.5);
    activeQuestionIdx = 0;
    
    addLog(`A wild ${activeEnemy.name} appeared! (HP: ${activeEnemy.hp})`, 'system');
    loadBattleQuestion();
}

function getRandomSprite(tier) {
    if (tier === 'N5') return 'あ';
    if (tier === 'N4') return '行';
    if (tier === 'N3') return '山';
    if (tier === 'N2') return '昨日';
    return '社会';
}

function updateEnemyHPBar() {
    document.getElementById('enemy-hp-text').textContent = `${activeEnemy.hp} / ${activeEnemy.maxHp}`;
    const pct = Math.max((activeEnemy.hp / activeEnemy.maxHp) * 100, 0);
    document.getElementById('enemy-hp-bar').style.width = `${pct}%`;
}

function loadBattleQuestion() {
    const q = currentQuestQuestions[activeQuestionIdx];
    if (!q) {
        const raw = QUEST_DATABASE[currentTier];
        currentQuestQuestions = [...raw].sort(() => Math.random() - 0.5);
        activeQuestionIdx = 0;
        loadBattleQuestion();
        return;
    }
    
    document.getElementById('combat-question-lbl').textContent = `Combat Challenge (${q.type}):`;
    document.getElementById('combat-question-main').textContent = q.q || q.question;
    
    const optionsContainer = document.getElementById('combat-options');
    const inputBox = document.getElementById('combat-input-box');
    
    if (q.style === 'mc') {
        optionsContainer.style.display = 'grid';
        inputBox.style.display = 'none';
        optionsContainer.innerHTML = '';
        
        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt;
            btn.addEventListener('click', () => handleQuestAttack(btn, opt, q.answer));
            optionsContainer.appendChild(btn);
        });
    } else {
        optionsContainer.style.display = 'none';
        inputBox.style.display = 'flex';
        document.getElementById('combat-text-answer').value = '';
        document.getElementById('combat-text-answer').focus();
    }
}

function handleQuestAttack(btn, selection, correct) {
    const buttons = document.querySelectorAll('#combat-options button');
    buttons.forEach(b => b.style.pointerEvents = 'none');
    
    const dmgDealt = Math.round(20 + Math.random() * 10);
    
    if (selection === correct) {
        btn.classList.add('correct');
        activeEnemy.hp -= dmgDealt;
        if (activeEnemy.hp < 0) activeEnemy.hp = 0;
        updateEnemyHPBar();
        addLog(`CORRECT! You strike ${activeEnemy.name} for ${dmgDealt} DMG!`, 'heal');
        
        speakJapanese(activeEnemy.sprite);
        
        setTimeout(() => {
            checkBattleResolution();
        }, 1200);
    } else {
        btn.classList.add('wrong');
        buttons.forEach(b => {
            if (b.textContent === correct) b.classList.add('correct');
        });
        
        addLog(`WRONG! Your attack missed.`, 'damage');
        
        setTimeout(() => {
            triggerEnemyCounterAttack();
        }, 1200);
    }
}

function submitTextAttack() {
    const input = document.getElementById('combat-text-answer');
    const ans = input.value.trim().toLowerCase();
    const correct = currentQuestQuestions[activeQuestionIdx].answer.toLowerCase();
    
    if (!ans) return;
    
    const dmgDealt = Math.round(30 + Math.random() * 10);
    
    if (ans === correct) {
        activeEnemy.hp -= dmgDealt;
        if (activeEnemy.hp < 0) activeEnemy.hp = 0;
        updateEnemyHPBar();
        addLog(`CRITICAL HIT! You strike ${activeEnemy.name} for ${dmgDealt} DMG!`, 'critical');
        
        speakJapanese(activeEnemy.sprite);
        
        setTimeout(() => {
            checkBattleResolution();
        }, 1200);
    } else {
        addLog(`INCORRECT spelling! The monster dodged.`, 'damage');
        setTimeout(() => {
            triggerEnemyCounterAttack();
        }, 1200);
    }
}

function triggerEnemyCounterAttack() {
    if (player.inventory.shield > 0) {
        player.inventory.shield--;
        addLog(`${activeEnemy.name} counter-attacks, but your Grammar Shield absorbed the blow!`, 'system');
        updateHUDDisplays();
        saveGameData();
        
        advanceQuestDeck();
    } else {
        const dmg = activeEnemy.damage;
        player.hp -= dmg;
        if (player.hp < 0) player.hp = 0;
        updateHUDDisplays();
        saveGameData();
        
        addLog(`${activeEnemy.name} counter-attacks! You take ${dmg} damage.`, 'damage');
        
        setTimeout(() => {
            if (player.hp <= 0) {
                addLog(`You collapsed in battle! Returning to home sanctuary. Lost 20 gold.`, 'damage');
                player.gold = Math.max(player.gold - 20, 0);
                player.hp = Math.round(player.maxHp * 0.5);
                updateHUDDisplays();
                saveGameData();
                startNewBattle();
            } else {
                advanceQuestDeck();
            }
        }, 1200);
    }
}

function checkBattleResolution() {
    if (activeEnemy.hp <= 0) {
        addLog(`VICTORY! You defeated ${activeEnemy.name}!`, 'heal');
        addLog(`Gained: +${activeEnemy.xpReward} XP, +${activeEnemy.goldReward} Gold!`, 'system');
        
        player.gold += activeEnemy.goldReward;
        player.xp += activeEnemy.xpReward;
        
        if (player.xp >= player.maxXp) {
            player.level++;
            player.xp -= player.maxXp;
            player.maxHp += 20;
            player.hp = player.maxHp;
            player.maxXp = Math.round(player.maxXp * 1.5);
            addLog(`LEVEL UP! You reached Level ${player.level}! Max HP increased to ${player.maxHp}!`, 'critical');
        }
        
        updateHUDDisplays();
        saveGameData();
        
        setTimeout(() => {
            startNewBattle();
        }, 1500);
    } else {
        advanceQuestDeck();
    }
}

function advanceQuestDeck() {
    activeQuestionIdx++;
    loadBattleQuestion();
}

function useInventoryItem(item) {
    if (!player.inventory[item] || player.inventory[item] <= 0) return;
    
    if (item === 'potion') {
        if (player.hp >= player.maxHp) {
            alert("Your HP is already full!");
            return;
        }
        player.inventory.potion--;
        player.hp = Math.min(player.hp + 40, player.maxHp);
        addLog(`You drank a Healing Potion! Recovered 40 HP.`, 'heal');
        updateHUDDisplays();
        saveGameData();
    } else if (item === 'hint') {
        const q = currentQuestQuestions[activeQuestionIdx];
        if (!q || q.style !== 'mc') {
            alert("Hint scrolls can only be used on multiple-choice questions!");
            return;
        }
        
        const buttons = document.querySelectorAll('#combat-options button');
        let hidden = false;
        buttons.forEach(btn => {
            if (!hidden && btn.textContent !== q.answer && btn.style.display !== 'none') {
                btn.style.display = 'none';
                hidden = true;
            }
        });
        
        if (hidden) {
            player.inventory.hint--;
            addLog(`You read a Hint Scroll! One wrong answer was eliminated.`, 'system');
            updateHUDDisplays();
            saveGameData();
        }
    }
}

// --- SHOP CONTROLLER ---
function setupRPGShop() {
    const buyBtns = document.querySelectorAll('.shop-card .btn-buy');
    buyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.getAttribute('data-item');
            let cost = 50;
            if (item === 'shield') cost = 80;
            if (item === 'hint') cost = 120;
            
            if (player.gold >= cost) {
                player.gold -= cost;
                player.inventory[item] = (player.inventory[item] || 0) + 1;
                
                addLog(`Bought 1 ${item === 'potion' ? 'Healing Potion' : item === 'shield' ? 'Grammar Shield' : 'Hint Scroll'} from merchant shop!`, 'system');
                updateHUDDisplays();
                saveGameData();
            } else {
                alert(`Not enough Gold! You need ${cost} Gold.`);
            }
        });
    });
}

// --- ==================================================== ---
// --- TRILINGUAL PARTICLE CALCULATOR ENGINE                 ---
// --- ==================================================== ---
function setupTrilingualCalculator() {
    const btns = document.querySelectorAll('#particle-calc-buttons .p-calc-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const key = btn.getAttribute('data-p');
            renderParticleCalculator(key);
        });
    });

    // Load default
    renderParticleCalculator('wa');
}

function renderParticleCalculator(key) {
    const data = PARTICLE_CALC_DATA[key];
    if (!data) return;

    document.getElementById('calc-particle-title').textContent = data.title;
    document.getElementById('calc-particle-role').textContent = data.role;
    document.getElementById('calc-english-eq').textContent = data.english;

    const lang = player.nativeLanguage || 'telugu';
    document.getElementById('calc-native-eq').textContent = data[lang] || '-';

    const langLabels = {
        telugu: 'Telugu Equivalent',
        hindi: 'Hindi Equivalent',
        korean: 'Korean Equivalent',
        tamil: 'Tamil Equivalent',
        spanish: 'Spanish Equivalent'
    };
    document.getElementById('calc-native-label').textContent = langLabels[lang] || 'Native Equivalent';

    const listContainer = document.getElementById('calc-examples-list');
    listContainer.innerHTML = '';

    data.examples.forEach(ex => {
        const item = document.createElement('div');
        item.style.padding = '8px';
        item.style.background = 'rgba(255,255,255,0.02)';
        item.style.borderRadius = '6px';
        item.style.border = '1px solid rgba(255,255,255,0.03)';
        
        const nativeText = ex[lang] || '';

        item.innerHTML = `
            <div style="font-family: var(--font-japanese); font-size: 1.15rem; color: #fff; margin-bottom: 2px;">
                ${ex.ja} <span style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--font-sans);">(${ex.ro})</span>
            </div>
            <div style="font-size: 0.85rem; margin-bottom: 2px;">
                <strong style="color: var(--accent-teal);">English:</strong> ${ex.en}
            </div>
            ${lang !== 'english' && nativeText ? `
            <div style="font-size: 0.85rem;">
                <strong style="color: var(--accent-pink);">${langLabels[lang] || 'Native'}:</strong> ${nativeText}
            </div>
            ` : ''}
        `;
        listContainer.appendChild(item);
    });
}

// --- ==================================================== ---
// --- NATIVE LANGUAGE CONFIGURATION ENGINE                  ---
// --- ==================================================== ---
function setupNativeLanguageSelector() {
    const select = document.getElementById('native-lang-select');
    if (!select) return;
    
    if (player.nativeLanguage) {
        select.value = player.nativeLanguage;
    } else {
        player.nativeLanguage = 'telugu';
    }
    
    select.addEventListener('change', () => {
        player.nativeLanguage = select.value;
        saveGameData();
        applyNativeLanguageNuances();
    });
    
    applyNativeLanguageNuances();
}

function applyNativeLanguageNuances() {
    const lang = player.nativeLanguage || 'telugu';
    
    // 1. Subtitle text
    const subtitle = document.getElementById('hero-subtitle');
    if (subtitle) {
        const langSubtitles = {
            telugu: 'Japanese Mastery for Telugu Speakers (JLPT N5 &rarr; N1)',
            hindi: 'Japanese Mastery for Hindi Speakers (JLPT N5 &rarr; N1)',
            korean: 'Japanese Mastery for Korean Speakers (JLPT N5 &rarr; N1)',
            tamil: 'Japanese Mastery for Tamil Speakers (JLPT N5 &rarr; N1)',
            spanish: 'Japanese Mastery for Spanish Speakers (JLPT N5 &rarr; N1)',
            english: 'Japanese Mastery Portal (JLPT N5 &rarr; N1)'
        };
        subtitle.innerHTML = langSubtitles[lang] || 'Japanese Mastery Portal (JLPT N5 &rarr; N1)';
    }
    
    // 2. Comparative table columns
    const teCols = document.querySelectorAll('.lang-col-te');
    const hiCols = document.querySelectorAll('.lang-col-hi');
    
    teCols.forEach(el => el.style.display = 'none');
    hiCols.forEach(el => el.style.display = 'none');
    
    if (lang === 'telugu') {
        teCols.forEach(el => el.style.display = '');
    } else if (lang === 'hindi') {
        hiCols.forEach(el => el.style.display = '');
    }
    
    // Hide/show Native Column in Calculator Display
    const nativeCol = document.getElementById('calc-native-col');
    const gridLayout = document.getElementById('calc-grid-layout');
    
    if (nativeCol && gridLayout) {
        if (lang === 'english') {
            nativeCol.style.display = 'none';
            gridLayout.style.gridTemplateColumns = '1fr';
        } else {
            nativeCol.style.display = '';
            gridLayout.style.gridTemplateColumns = '1fr 1fr';
        }
    }
    
    // 3. Re-render particle calculator
    const activeBtn = document.querySelector('#particle-calc-buttons .p-calc-btn.active');
    if (activeBtn) {
        renderParticleCalculator(activeBtn.getAttribute('data-p'));
    }
    
    // 4. Update sentence builder prompt if builder is active
    const builderSec = document.getElementById('builder');
    if (builderSec && builderSec.classList.contains('active')) {
        const lvl = SENTENCE_LEVELS[buildIdx];
        let promptText = lvl.prompt;
        
        const nativePrompts = {
            telugu: lvl.tePrompt,
            hindi: lvl.hiPrompt,
            korean: lvl.koPrompt,
            tamil: lvl.taPrompt,
            spanish: lvl.esPrompt
        };
        const activePrompt = nativePrompts[lang];
        if (activePrompt) {
            promptText += ` <br><span style="font-size: 0.9rem; color: var(--accent-pink);">Native: ${activePrompt}</span>`;
        }
        document.getElementById('sentence-prompt').innerHTML = promptText;
    }
}
