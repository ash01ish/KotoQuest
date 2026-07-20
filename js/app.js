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
    streak: 0,
    lastActiveDate: '',
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
        { q: 'What is the vowel character representing the "oo" sound?', answer: 'う', options: ['あ', 'え', 'う', 'お'], style: 'mc', type: 'Hiragana' },
        { q: 'Which hiragana represents "ka"?', answer: 'か', options: ['か', 'き', 'く', 'け'], style: 'mc', type: 'Hiragana' },
        { q: 'Which hiragana represents "shi"?', answer: 'し', options: ['さ', 'し', 'す', 'せ'], style: 'mc', type: 'Hiragana' },
        { q: 'Type the romaji for: ん', answer: 'n', style: 'text', type: 'Hiragana' },
        { q: 'Which katakana represents "a"?', answer: 'ア', options: ['ア', 'イ', 'ウ', 'エ'], style: 'mc', type: 'Katakana' },
        { q: 'Which katakana represents "ko"?', answer: 'コ', options: ['カ', 'キ', 'ク', 'コ'], style: 'mc', type: 'Katakana' },
        { q: 'Which particle marks the Topic of the sentence?', answer: 'は', options: ['は', 'を', 'に', 'で'], style: 'mc', type: 'Particle' },
        { q: 'Which particle marks the Direct Object?', answer: 'を', options: ['は', 'を', 'に', 'の'], style: 'mc', type: 'Particle' },
        { q: 'Which particle marks a Destination?', answer: 'に', options: ['は', 'で', 'に', 'を'], style: 'mc', type: 'Particle' },
        { q: 'Which particle shows Possession (Telugu: yokka)?', answer: 'の', options: ['の', 'は', 'を', 'に'], style: 'mc', type: 'Particle' },
        { q: 'Translate "One" (一) to romaji:', answer: 'ichi', style: 'text', type: 'Spelling' },
        { q: 'Translate "Ten" (十) to romaji:', answer: 'juu', style: 'text', type: 'Spelling' },
        { q: 'Translate "Three" (三) to romaji:', answer: 'san', style: 'text', type: 'Spelling' },
        { q: 'What number is 七 (shichi/nana)?', answer: 'Seven', options: ['Five', 'Six', 'Seven', 'Eight'], style: 'mc', type: 'Numbers' },
        { q: 'What number is 百 (hyaku)?', answer: 'Hundred', options: ['Ten', 'Hundred', 'Thousand', 'Million'], style: 'mc', type: 'Numbers' },
        { q: 'Translate "Hello / Good Afternoon":', answer: 'Konnichiwa', options: ['Konnichiwa', 'Arigatou', 'Sumimasen', 'Sayonara'], style: 'mc', type: 'Phrase' },
        { q: 'Translate "Good Morning" (polite):', answer: 'Ohayou gozaimasu', options: ['Ohayou gozaimasu', 'Konbanwa', 'Oyasumi', 'Itadakimasu'], style: 'mc', type: 'Phrase' },
        { q: 'Translate "Good Evening":', answer: 'Konbanwa', options: ['Konnichiwa', 'Konbanwa', 'Sayonara', 'Arigatou'], style: 'mc', type: 'Phrase' },
        { q: 'What do you say before eating?', answer: 'Itadakimasu', options: ['Itadakimasu', 'Gochisousama', 'Sumimasen', 'Onegaishimasu'], style: 'mc', type: 'Phrase' },
        { q: 'What do you say after eating?', answer: 'Gochisousama deshita', options: ['Itadakimasu', 'Gochisousama deshita', 'Arigatou', 'Oyasumi'], style: 'mc', type: 'Phrase' },
        { q: 'What is the meaning of "水" (mizu)?', answer: 'Water', options: ['Water', 'Fire', 'Earth', 'Wind'], style: 'mc', type: 'Vocabulary' },
        { q: 'What is the meaning of "猫" (neko)?', answer: 'Cat', options: ['Dog', 'Cat', 'Bird', 'Fish'], style: 'mc', type: 'Vocabulary' },
        { q: 'What is the meaning of "犬" (inu)?', answer: 'Dog', options: ['Cat', 'Dog', 'Horse', 'Cow'], style: 'mc', type: 'Vocabulary' },
        { q: 'What is the meaning of "本" (hon)?', answer: 'Book', options: ['Pen', 'Book', 'Paper', 'Desk'], style: 'mc', type: 'Vocabulary' },
        { q: 'What does "なに" (nani) mean?', answer: 'What', options: ['What', 'Who', 'Where', 'When'], style: 'mc', type: 'Vocabulary' },
        { q: 'What does "だれ" (dare) mean?', answer: 'Who', options: ['What', 'Who', 'Where', 'How'], style: 'mc', type: 'Vocabulary' },
        { q: 'What does "どこ" (doko) mean?', answer: 'Where', options: ['What', 'When', 'Where', 'Why'], style: 'mc', type: 'Vocabulary' },
        { q: 'What does "いくら" (ikura) mean?', answer: 'How much', options: ['How many', 'How much', 'How old', 'How long'], style: 'mc', type: 'Vocabulary' },
        { q: 'What is "Monday" in Japanese?', answer: 'げつようび', options: ['げつようび', 'かようび', 'すいようび', 'にちようび'], style: 'mc', type: 'Vocabulary' },
        { q: 'What is "Sunday" in Japanese?', answer: 'にちようび', options: ['どようび', 'にちようび', 'きんようび', 'もくようび'], style: 'mc', type: 'Vocabulary' },
        { q: 'What does "食べる" (taberu) mean?', answer: 'To eat', options: ['To eat', 'To drink', 'To sleep', 'To go'], style: 'mc', type: 'Verb' },
        { q: 'What does "飲む" (nomu) mean?', answer: 'To drink', options: ['To eat', 'To drink', 'To read', 'To write'], style: 'mc', type: 'Verb' },
        { q: 'What does "行く" (iku) mean?', answer: 'To go', options: ['To come', 'To go', 'To return', 'To run'], style: 'mc', type: 'Verb' }
    ],
    N4: [
        { q: 'What is the polite past form of "食べる" (ate)?', answer: 'たべました', options: ['たべました', 'たべません', 'たべます', 'たべませんでした'], style: 'mc', type: 'Verb Conjugation' },
        { q: 'What is the negative polite form of "飲む" (do not drink)?', answer: 'のみません', options: ['のみません', 'のみます', 'のみました', 'のみませんでした'], style: 'mc', type: 'Verb Conjugation' },
        { q: 'What is the Te-form of "食べる"?', answer: 'たべて', options: ['たべて', 'たべた', 'たべない', 'たべよう'], style: 'mc', type: 'Verb Conjugation' },
        { q: 'What is the Te-form of "飲む"?', answer: 'のんで', options: ['のんで', 'のみて', 'のんだ', 'のまない'], style: 'mc', type: 'Verb Conjugation' },
        { q: 'What is the Te-form of "行く"?', answer: 'いって', options: ['いいて', 'いって', 'いきて', 'いった'], style: 'mc', type: 'Verb Conjugation' },
        { q: 'What is the Te-form of "書く" (to write)?', answer: 'かいて', options: ['かいて', 'かって', 'かきて', 'かいた'], style: 'mc', type: 'Verb Conjugation' },
        { q: 'How do you say "I want to eat" (tai-form)?', answer: 'たべたい', options: ['たべたい', 'たべたく', 'たべよう', 'たべられる'], style: 'mc', type: 'Grammar' },
        { q: 'How do you say "I want to go to Japan"?', answer: 'にほんにいきたいです', options: ['にほんにいきたいです', 'にほんにいきます', 'にほんにいった', 'にほんにいける'], style: 'mc', type: 'Grammar' },
        { q: 'What is the plain negative of "食べる"?', answer: 'たべない', options: ['たべない', 'たべません', 'たべなかった', 'たべず'], style: 'mc', type: 'Verb Conjugation' },
        { q: 'What is the plain negative of "する" (to do)?', answer: 'しない', options: ['しない', 'しません', 'さない', 'すない'], style: 'mc', type: 'Verb Conjugation' },
        { q: 'What is the potential form of "食べる" (can eat)?', answer: 'たべられる', options: ['たべられる', 'たべれる', 'たべさせる', 'たべたい'], style: 'mc', type: 'Grammar' },
        { q: 'What is the potential form of "読む" (can read)?', answer: 'よめる', options: ['よめる', 'よまれる', 'よませる', 'よみたい'], style: 'mc', type: 'Grammar' },
        { q: '"てもいいですか" expresses:', answer: 'Asking permission', options: ['Asking permission', 'Giving an order', 'Making a request', 'Expressing regret'], style: 'mc', type: 'Grammar' },
        { q: '"てはいけません" expresses:', answer: 'Prohibition', options: ['Permission', 'Prohibition', 'Obligation', 'Suggestion'], style: 'mc', type: 'Grammar' },
        { q: 'Which verb means "to give (to someone)"?', answer: 'あげる', options: ['あげる', 'もらう', 'くれる', 'やる'], style: 'mc', type: 'Verb' },
        { q: 'Which verb means "to receive"?', answer: 'もらう', options: ['あげる', 'もらう', 'くれる', 'おくる'], style: 'mc', type: 'Verb' },
        { q: '"AはBより大きい" means:', answer: 'A is bigger than B', options: ['A is bigger than B', 'B is bigger than A', 'A and B are equal', 'A is the biggest'], style: 'mc', type: 'Grammar' },
        { q: 'Which counter is used for flat objects (paper, tickets)?', answer: '枚 (まい)', options: ['枚 (まい)', '本 (ほん)', '個 (こ)', '人 (にん)'], style: 'mc', type: 'Vocabulary' },
        { q: 'Which counter is used for people?', answer: '人 (にん)', options: ['個 (こ)', '枚 (まい)', '本 (ほん)', '人 (にん)'], style: 'mc', type: 'Vocabulary' },
        { q: '"にほんにいったことがある" means:', answer: 'I have been to Japan', options: ['I have been to Japan', 'I will go to Japan', 'I want to go to Japan', 'I am going to Japan'], style: 'mc', type: 'Grammar' },
        { q: 'What is the class of "美味しい" (delicious)?', answer: 'I-adjective', options: ['I-adjective', 'Na-adjective', 'Irregular', 'Verb'], style: 'mc', type: 'Grammar' },
        { q: 'What is the class of "静か" (quiet)?', answer: 'Na-adjective', options: ['I-adjective', 'Na-adjective', 'Irregular', 'Verb'], style: 'mc', type: 'Grammar' },
        { q: 'What is the negative form of "高い" (expensive)?', answer: 'たかくない', options: ['たかくない', 'たかいない', 'たかじゃない', 'たかではない'], style: 'mc', type: 'Grammar' },
        { q: 'What is the past form of "静かな" (was quiet)?', answer: 'しずかだった', options: ['しずかだった', 'しずかかった', 'しずくなかった', 'しずかでした'], style: 'mc', type: 'Grammar' },
        { q: 'Translate "Excuse me / Sorry":', answer: 'Sumimasen', options: ['Sumimasen', 'Arigatou', 'Gomen', 'Doko'], style: 'mc', type: 'Vocabulary' },
        { q: 'What does "びょういん" (byouin) mean?', answer: 'Hospital', options: ['Hospital', 'School', 'Library', 'Station'], style: 'mc', type: 'Vocabulary' },
        { q: 'What does "でんしゃ" (densha) mean?', answer: 'Train', options: ['Bus', 'Taxi', 'Train', 'Car'], style: 'mc', type: 'Vocabulary' },
        { q: '"あめだから、いきません" means:', answer: 'Because it is raining, I will not go', options: ['Because it is raining, I will not go', 'If it rains, I will not go', 'It rained, so I did not go', 'Even though it rained, I went'], style: 'mc', type: 'Grammar' },
        { q: 'Which particle marks the Destination (Telugu: ki/ku)?', answer: 'に', options: ['に', 'を', 'で', 'の'], style: 'mc', type: 'Particle' },
        { q: 'Which particle marks the Location of action (Telugu: lo)?', answer: 'で', options: ['に', 'で', 'を', 'は'], style: 'mc', type: 'Particle' }
    ],
    N3: [
        { q: 'Meaning of the Kanji: 日?', answer: 'Sun / Day', options: ['Sun / Day', 'Moon / Month', 'Water', 'Fire'], style: 'mc', type: 'Kanji' },
        { q: 'Meaning of the Kanji: 月?', answer: 'Moon / Month', options: ['Sun / Day', 'Moon / Month', 'Water', 'Tree'], style: 'mc', type: 'Kanji' },
        { q: 'Meaning of the Kanji: 人?', answer: 'Person', options: ['Person', 'Mountain', 'River', 'Gold'], style: 'mc', type: 'Kanji' },
        { q: 'Meaning of the Kanji: 山?', answer: 'Mountain', options: ['River', 'Mountain', 'Forest', 'Field'], style: 'mc', type: 'Kanji' },
        { q: 'Meaning of the Kanji: 学校?', answer: 'School', options: ['School', 'Company', 'Hospital', 'Library'], style: 'mc', type: 'Kanji' },
        { q: 'Meaning of the Kanji: 会社?', answer: 'Company', options: ['School', 'Company', 'Hospital', 'Station'], style: 'mc', type: 'Kanji' },
        { q: 'Meaning of the Kanji: 電車?', answer: 'Train', options: ['Bus', 'Bicycle', 'Train', 'Airplane'], style: 'mc', type: 'Kanji' },
        { q: 'Meaning of the Kanji: 図書館?', answer: 'Library', options: ['Museum', 'Hospital', 'Library', 'Station'], style: 'mc', type: 'Kanji' },
        { q: 'Meaning of the Kanji: 天気?', answer: 'Weather', options: ['Weather', 'Temperature', 'Season', 'Wind'], style: 'mc', type: 'Kanji' },
        { q: 'Meaning of the Kanji: 料理?', answer: 'Cooking', options: ['Cleaning', 'Cooking', 'Shopping', 'Studying'], style: 'mc', type: 'Kanji' },
        { q: 'What is the passive form of "食べる"?', answer: 'たべられる', options: ['たべられる', 'たべさせる', 'たべさせられる', 'たべれる'], style: 'mc', type: 'Grammar' },
        { q: 'What is the passive form of "読む" (to read)?', answer: 'よまれる', options: ['よまれる', 'よませる', 'よめる', 'よまされる'], style: 'mc', type: 'Grammar' },
        { q: 'What is the causative form of "食べる" (make eat)?', answer: 'たべさせる', options: ['たべさせる', 'たべられる', 'たべさせられる', 'たべれる'], style: 'mc', type: 'Grammar' },
        { q: 'What is the causative form of "行く" (make go)?', answer: 'いかせる', options: ['いかせる', 'いかれる', 'いかされる', 'いけせる'], style: 'mc', type: 'Grammar' },
        { q: '"ようになる" expresses:', answer: 'Becoming able to / Change of state', options: ['Becoming able to / Change of state', 'Trying to do', 'Deciding to do', 'Planning to do'], style: 'mc', type: 'Grammar' },
        { q: '"ようにする" expresses:', answer: 'Making an effort to do', options: ['Becoming able to', 'Making an effort to do', 'Deciding to do', 'Wanting to do'], style: 'mc', type: 'Grammar' },
        { q: '"あめがふりそうだ" means:', answer: 'It looks like it will rain', options: ['It is raining', 'It looks like it will rain', 'It stopped raining', 'I heard it rained'], style: 'mc', type: 'Grammar' },
        { q: '"あの人は先生らしい" means:', answer: 'That person seems to be a teacher', options: ['That person is a teacher', 'That person seems to be a teacher', 'That person was a teacher', 'That person wants to be a teacher'], style: 'mc', type: 'Grammar' },
        { q: '"あの人は先生みたいだ" means:', answer: 'That person is like a teacher', options: ['That person is a teacher', 'That person is like a teacher', 'That person became a teacher', 'That person was a teacher'], style: 'mc', type: 'Grammar' },
        { q: 'What is the honorific form of "いる" (to be)?', answer: 'いらっしゃる', options: ['いらっしゃる', 'おる', 'ある', 'いられる'], style: 'mc', type: 'Keigo' },
        { q: 'What is the humble form of "行く" (to go)?', answer: 'まいる', options: ['いらっしゃる', 'まいる', 'おいでになる', 'いかれる'], style: 'mc', type: 'Keigo' },
        { q: 'Translate: "Where is the bathroom?"', answer: 'トイレはどこですか', options: ['トイレはどこですか', 'お水をください', 'これはいくらですか', 'ありがとうございます'], style: 'mc', type: 'Phrase' },
        { q: 'Translate the past negative: "did not drink"', answer: 'のみませんでした', options: ['のみませんでした', 'のみません', 'のみました', 'のみます'], style: 'mc', type: 'Verb Conjugation' },
        { q: '"ドアがあく" vs "ドアをあける" — which is transitive?', answer: 'あける', options: ['あく', 'あける', 'Both', 'Neither'], style: 'mc', type: 'Grammar' },
        { q: '"でんきがつく" vs "でんきをつける" — which is intransitive?', answer: 'つく', options: ['つく', 'つける', 'Both', 'Neither'], style: 'mc', type: 'Grammar' },
        { q: 'Type the reading of 旅行:', answer: 'ryokou', style: 'text', type: 'Kanji' }
    ],
    N2: [
        { q: '"Aについて" means:', answer: 'About A / Regarding A', options: ['About A / Regarding A', 'Because of A', 'Instead of A', 'Despite A'], style: 'mc', type: 'Grammar' },
        { q: '"Aにとって" means:', answer: "For A / From A's perspective", options: ["For A / From A's perspective", 'About A', 'Because of A', 'Against A'], style: 'mc', type: 'Grammar' },
        { q: '"Aによって" means:', answer: 'Depending on A / By means of A', options: ['Depending on A / By means of A', 'About A', 'For A', 'Despite A'], style: 'mc', type: 'Grammar' },
        { q: '"Aにもかかわらず" means:', answer: 'Despite A', options: ['Despite A', 'Because of A', 'According to A', 'Instead of A'], style: 'mc', type: 'Grammar' },
        { q: '"Aだけでなく、Bも" means:', answer: 'Not only A, but also B', options: ['Not only A, but also B', 'Either A or B', 'Neither A nor B', 'A instead of B'], style: 'mc', type: 'Grammar' },
        { q: '"ばいいのに" expresses:', answer: 'Regret / Wish it were different', options: ['Regret / Wish it were different', 'Certainty', 'Permission', 'Obligation'], style: 'mc', type: 'Grammar' },
        { q: '"としても" means:', answer: 'Even if / Even assuming', options: ['Even if / Even assuming', 'Because', 'Therefore', 'However'], style: 'mc', type: 'Grammar' },
        { q: '"わけにはいかない" means:', answer: 'Cannot afford to / Must not', options: ['Cannot afford to / Must not', 'Can easily do', 'Should do', 'Want to do'], style: 'mc', type: 'Grammar' },
        { q: 'What is the honorific form of "食べる"?', answer: 'めしあがる', options: ['めしあがる', 'いただく', 'たべられる', 'おたべになる'], style: 'mc', type: 'Keigo' },
        { q: 'What is the humble form of "食べる"?', answer: 'いただく', options: ['めしあがる', 'いただく', 'たべさせる', 'おたべする'], style: 'mc', type: 'Keigo' },
        { q: 'What is the honorific form of "言う" (to say)?', answer: 'おっしゃる', options: ['おっしゃる', 'もうす', 'いわれる', 'おいいになる'], style: 'mc', type: 'Keigo' },
        { q: 'What is the humble form of "言う" (to say)?', answer: 'もうす', options: ['おっしゃる', 'もうす', 'いわれる', 'もうしあげる'], style: 'mc', type: 'Keigo' },
        { q: 'Translate: 昨日 (Kinoo)', answer: 'Yesterday', options: ['Yesterday', 'Today', 'Tomorrow', 'Last week'], style: 'mc', type: 'Vocab' },
        { q: 'Translate: 政治', answer: 'Politics', options: ['Politics', 'Economy', 'Science', 'Culture'], style: 'mc', type: 'Vocab' },
        { q: 'Translate: 環境', answer: 'Environment', options: ['Environment', 'Economy', 'Society', 'Technology'], style: 'mc', type: 'Vocab' },
        { q: 'Translate: 文化', answer: 'Culture', options: ['Culture', 'Education', 'Politics', 'History'], style: 'mc', type: 'Vocab' },
        { q: 'Translate: 技術', answer: 'Technology / Skill', options: ['Technology / Skill', 'Science', 'Research', 'Industry'], style: 'mc', type: 'Vocab' },
        { q: 'Translate: 研究', answer: 'Research', options: ['Research', 'Study', 'Experiment', 'Survey'], style: 'mc', type: 'Vocab' },
        { q: 'Translate: 影響', answer: 'Influence / Effect', options: ['Influence / Effect', 'Reason', 'Result', 'Cause'], style: 'mc', type: 'Vocab' },
        { q: 'Translate: 関係', answer: 'Relationship / Connection', options: ['Relationship / Connection', 'Situation', 'Condition', 'Circumstance'], style: 'mc', type: 'Vocab' },
        { q: 'Type the reading of 先生 (Teacher):', answer: 'sensei', style: 'text', type: 'Spelling' },
        { q: 'Type the reading of 大学:', answer: 'daigaku', style: 'text', type: 'Spelling' },
        { q: 'Identify the Na-adjective for "Quiet":', answer: 'しずかな', options: ['しずかな', 'おいしい', 'おおきい', 'かわいい'], style: 'mc', type: 'Grammar' },
        { q: 'Translate "これはいくらですか":', answer: 'How much is this?', options: ['How much is this?', 'Where is the station?', 'Please give me water.', 'Excuse me.'], style: 'mc', type: 'Phrase' },
        { q: 'Which particle shows accompaniment (Telugu: tho)?', answer: 'と', options: ['と', 'で', 'に', 'を'], style: 'mc', type: 'Particle' }
    ],
    N1: [
        { q: 'Translate: 社会 (Shakai)', answer: 'Society', options: ['Society', 'Education', 'Economy', 'Government'], style: 'mc', type: 'Vocab' },
        { q: 'Translate: 教育 (Kyoiku)', answer: 'Education', options: ['Education', 'Society', 'Economy', 'Science'], style: 'mc', type: 'Vocab' },
        { q: 'Translate: 経済 (Keizai)', answer: 'Economy', options: ['Economy', 'Politics', 'Law', 'Industry'], style: 'mc', type: 'Vocab' },
        { q: 'Translate: 政府 (Seifu)', answer: 'Government', options: ['Government', 'Politics', 'Law', 'Parliament'], style: 'mc', type: 'Vocab' },
        { q: 'Translate: 科学 (Kagaku)', answer: 'Science', options: ['Science', 'Chemistry', 'Physics', 'Mathematics'], style: 'mc', type: 'Vocab' },
        { q: 'Translate: 哲学 (Tetsugaku)', answer: 'Philosophy', options: ['Philosophy', 'Psychology', 'Sociology', 'Literature'], style: 'mc', type: 'Vocab' },
        { q: 'Translate: 環境問題', answer: 'Environmental problem', options: ['Environmental problem', 'Social issue', 'Economic crisis', 'Political scandal'], style: 'mc', type: 'Vocab' },
        { q: 'Translate: 国際 (Kokusai)', answer: 'International', options: ['International', 'National', 'Regional', 'Global'], style: 'mc', type: 'Vocab' },
        { q: '"にすぎない" means:', answer: 'Nothing more than / Merely', options: ['Nothing more than / Merely', 'Not only', 'At least', 'Especially'], style: 'mc', type: 'Grammar' },
        { q: '"というものだ" means:', answer: 'That is what it means to / Such is', options: ['That is what it means to / Such is', 'It is said that', 'I heard that', 'It seems like'], style: 'mc', type: 'Grammar' },
        { q: '"ざるをえない" means:', answer: 'Cannot help but / Have no choice but to', options: ['Cannot help but / Have no choice but to', 'Must not', 'Should not', 'Need not'], style: 'mc', type: 'Grammar' },
        { q: '"にほかならない" means:', answer: 'Nothing but / None other than', options: ['Nothing but / None other than', 'Not only', 'Not at all', 'Not necessarily'], style: 'mc', type: 'Grammar' },
        { q: '"とはかぎらない" means:', answer: 'Not necessarily / Not always true', options: ['Not necessarily / Not always true', 'Always', 'Definitely', 'Never'], style: 'mc', type: 'Grammar' },
        { q: '"なくはない" means:', answer: 'It is not impossible (double negative)', options: ['It is not impossible (double negative)', 'Absolutely not', 'Definitely yes', 'I am not sure'], style: 'mc', type: 'Grammar' },
        { q: '"べき" expresses:', answer: 'Should / Ought to (moral obligation)', options: ['Should / Ought to (moral obligation)', 'Want to', 'Can do', 'Must not'], style: 'mc', type: 'Grammar' },
        { q: '"まじ" (archaic) expresses:', answer: 'Should not / Must not', options: ['Should not / Must not', 'Should do', 'Want to', 'Can do'], style: 'mc', type: 'Grammar' },
        { q: '"ごとし" (literary) expresses:', answer: 'Like / As if (poetic comparison)', options: ['Like / As if (poetic comparison)', 'Because of', 'Despite', 'Therefore'], style: 'mc', type: 'Grammar' },
        { q: '"おそれがある" means:', answer: 'There is a risk that', options: ['There is a risk that', 'There is hope that', 'It is certain that', 'It is impossible that'], style: 'mc', type: 'Grammar' },
        { q: '"かねない" means:', answer: 'Might / Could possibly (negative connotation)', options: ['Might / Could possibly (negative connotation)', 'Cannot do', 'Should not', 'Will definitely'], style: 'mc', type: 'Grammar' },
        { q: '"をもって" means:', answer: 'By means of / With (formal)', options: ['By means of / With (formal)', 'Despite', 'Because of', 'Instead of'], style: 'mc', type: 'Grammar' },
        { q: 'Type the reading of 日本:', answer: 'nihon', style: 'text', type: 'Spelling' },
        { q: 'Type the reading of 経済:', answer: 'keizai', style: 'text', type: 'Spelling' },
        { q: 'Type the reading of 哲学:', answer: 'tetsugaku', style: 'text', type: 'Spelling' },
        { q: 'Which particle acts as a possession marker?', answer: 'の', options: ['の', 'は', 'を', 'に'], style: 'mc', type: 'Particle' }
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
    { ja: 'ヤ', ro: 'ya' }, { empty: true }, { ja: 'ユ', ro: 'yu' }, { empty: true }, { ja: 'ヨ', ro: 'yo' },
    { ja: 'ラ', ro: 'ra' }, { ja: 'リ', ro: 'ri' }, { ja: 'ル', ro: 'ru' }, { ja: 'レ', ro: 're' }, { ja: 'ロ', ro: 'ro' },
    { ja: 'ワ', ro: 'wa' }, { empty: true }, { empty: true }, { empty: true }, { ja: 'ヲ', ro: 'o' },
    { ja: 'ン', ro: 'n' }, { empty: true }, { empty: true }, { empty: true }, { empty: true }
];

const VOCAB_DATA = {
    kana: [
        { ja: 'あ', ro: 'a', meaning: 'Letter: A', type: 'Hiragana', pronounce: '"ah"' },
        { ja: 'い', ro: 'i', meaning: 'Letter: I', type: 'Hiragana', pronounce: '"ee"' },
        { ja: 'う', ro: 'u', meaning: 'Letter: U', type: 'Hiragana', pronounce: '"oo"' },
        { ja: 'え', ro: 'e', meaning: 'Letter: E', type: 'Hiragana', pronounce: '"eh"' },
        { ja: 'お', ro: 'o', meaning: 'Letter: O', type: 'Hiragana', pronounce: '"oh"' },
        { ja: 'か', ro: 'ka', meaning: 'Letter: Ka', type: 'Hiragana', pronounce: '"kah"' },
        { ja: 'き', ro: 'ki', meaning: 'Letter: Ki', type: 'Hiragana', pronounce: '"kee"' },
        { ja: 'く', ro: 'ku', meaning: 'Letter: Ku', type: 'Hiragana', pronounce: '"koo"' },
        { ja: 'け', ro: 'ke', meaning: 'Letter: Ke', type: 'Hiragana', pronounce: '"keh"' },
        { ja: 'こ', ro: 'ko', meaning: 'Letter: Ko', type: 'Hiragana', pronounce: '"koh"' },
        { ja: 'さ', ro: 'sa', meaning: 'Letter: Sa', type: 'Hiragana', pronounce: '"sah"' },
        { ja: 'し', ro: 'shi', meaning: 'Letter: Shi', type: 'Hiragana', pronounce: '"shee"' },
        { ja: 'す', ro: 'su', meaning: 'Letter: Su', type: 'Hiragana', pronounce: '"soo"' },
        { ja: 'せ', ro: 'se', meaning: 'Letter: Se', type: 'Hiragana', pronounce: '"seh"' },
        { ja: 'そ', ro: 'so', meaning: 'Letter: So', type: 'Hiragana', pronounce: '"soh"' }
    ],
    numbers: [
        { ja: '一', ro: 'ichi', meaning: 'One (1)', type: 'Number', pronounce: 'ee-chee' },
        { ja: '二', ro: 'ni', meaning: 'Two (2)', type: 'Number', pronounce: 'nee' },
        { ja: '三', ro: 'san', meaning: 'Three (3)', type: 'Number', pronounce: 'sahn' },
        { ja: '四', ro: 'yon/shi', meaning: 'Four (4)', type: 'Number', pronounce: 'yohn' },
        { ja: '五', ro: 'go', meaning: 'Five (5)', type: 'Number', pronounce: 'goh' },
        { ja: '六', ro: 'roku', meaning: 'Six (6)', type: 'Number', pronounce: 'roh-koo' },
        { ja: '七', ro: 'nana/shichi', meaning: 'Seven (7)', type: 'Number', pronounce: 'nah-nah' },
        { ja: '八', ro: 'hachi', meaning: 'Eight (8)', type: 'Number', pronounce: 'hah-chee' },
        { ja: '九', ro: 'kyuu', meaning: 'Nine (9)', type: 'Number', pronounce: 'kyoo' },
        { ja: '十', ro: 'juu', meaning: 'Ten (10)', type: 'Number', pronounce: 'joo' },
        { ja: '百', ro: 'hyaku', meaning: 'Hundred (100)', type: 'Number', pronounce: 'hyah-koo' },
        { ja: '千', ro: 'sen', meaning: 'Thousand (1,000)', type: 'Number', pronounce: 'sen' },
        { ja: '万', ro: 'man', meaning: 'Ten Thousand (10,000)', type: 'Number', pronounce: 'mahn' }
    ],
    phrases: [
        { ja: 'こんにちは', ro: 'konnichiwa', meaning: 'Hello / Good Afternoon', type: 'Greeting', pronounce: 'kohn-nee-chee-wah' },
        { ja: 'すみません', ro: 'sumimasen', meaning: 'Excuse me / Sorry', type: 'Survival Phrase', pronounce: 'soo-mee-mah-sen' },
        { ja: 'ありがとう', ro: 'arigatou', meaning: 'Thank you', type: 'Survival Phrase', pronounce: 'ah-ree-gah-toh' },
        { ja: 'はじめまして', ro: 'hajimemashite', meaning: 'Nice to meet you', type: 'Greeting', pronounce: 'hah-jee-meh-mah-shee-teh' },
        { ja: 'さようなら', ro: 'sayounara', meaning: 'Goodbye', type: 'Greeting', pronounce: 'sah-yoh-nah-rah' },
        { ja: 'どこですか', ro: 'doko desu ka', meaning: 'Where is it?', type: 'Survival Phrase', pronounce: 'doh-koh deh-soo kah' },
        { ja: 'いくらですか', ro: 'ikura desu ka', meaning: 'How much is this?', type: 'Survival Phrase', pronounce: 'ee-koo-rah deh-soo kah' },
        { ja: 'お水をください', ro: 'omizu o kudasai', meaning: 'Water, please', type: 'Survival Phrase', pronounce: 'oh-mee-zoo oh koo-dah-sigh' },
        { ja: 'わかりません', ro: 'wakarimasen', meaning: 'I don\'t understand', type: 'Survival Phrase', pronounce: 'wah-kah-ree-mah-sen' },
        { ja: '助けてください', ro: 'tasukete kudasai', meaning: 'Help, please', type: 'Survival Phrase', pronounce: 'たすけてください (tah-soo-keh-teh koo-dah-sigh)' }
    ],
    verbs: [
        { ja: '食べる', ro: 'taberu', meaning: 'To eat', type: 'Verb', pronounce: 'たべる (tah-beh-roo)' },
        { ja: '飲む', ro: 'nomu', meaning: 'To drink', type: 'Verb', pronounce: 'のむ (noh-moo)' },
        { ja: '行く', ro: 'iku', meaning: 'To go', type: 'Verb', pronounce: 'いく (ee-koo)' },
        { ja: '来る', ro: 'kuru', meaning: 'To come', type: 'Verb', pronounce: 'くる (koo-roo)' },
        { ja: '見る', ro: 'miru', meaning: 'To see / watch', type: 'Verb', pronounce: 'みる (mee-roo)' },
        { ja: '聞く', ro: 'kiku', meaning: 'To hear / listen', type: 'Verb', pronounce: 'きく (kee-koo)' },
        { ja: '読む', ro: 'yomu', meaning: 'To read', type: 'Verb', pronounce: 'よむ (yoh-moo)' },
        { ja: '書く', ro: 'kaku', meaning: 'To write', type: 'Verb', pronounce: 'かく (kah-koo)' },
        { ja: '話す', ro: 'hanasu', meaning: 'To speak', type: 'Verb', pronounce: 'はなす (hah-nah-soo)' },
        { ja: 'する', ro: 'suru', meaning: 'To do', type: 'Verb', pronounce: 'する (soo-roo)' }
    ],
    adjectives: [
        { ja: '美味しい', ro: 'oishii', meaning: 'Delicious', type: 'Adjective', pronounce: 'おいしい (oh-ee-shee)' },
        { ja: '大きい', ro: 'ookii', meaning: 'Big', type: 'Adjective', pronounce: 'おおきい (oh-oh-kee)' },
        { ja: '小さい', ro: 'chiisai', meaning: 'Small', type: 'Adjective', pronounce: 'ちいさい (chee-sigh)' },
        { ja: '暑い', ro: 'atsui', meaning: 'Hot', type: 'Adjective', pronounce: 'あつい (ah-tsoo-ee)' },
        { ja: '寒い', ro: 'samui', meaning: 'Cold', type: 'Adjective', pronounce: 'さむい (sah-moo-ee)' },
        { ja: '可愛い', ro: 'kawaii', meaning: 'Cute', type: 'Adjective', pronounce: 'かわいい (kah-wah-ee)' },
        { ja: '高い', ro: 'takai', meaning: 'Expensive / High', type: 'Adjective', pronounce: 'たかい (tah-kah-ee)' },
        { ja: '安い', ro: 'yasui', meaning: 'Cheap', type: 'Adjective', pronounce: 'やすい (yah-sigh)' }
    ]
};

const SENTENCE_LEVELS = [
    {
        prompt: 'Target: "I eat sushi."',
        tePrompt: 'నేను సుశి తింటాను (Nenu sushi thintaanu)',
        hiPrompt: 'मैं सुशी खाता हूँ (Main sushi khaata hoon)',
        koPrompt: '나는 스시를 먹습니다 (Naneun seusileul meogseumnida)',
        taPrompt: 'நான் சுஷி சாப்பிடுகிறேன் (Naan sushi saapidugiren)',
        esPrompt: 'Yo como sushi.',
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
        koPrompt: '그녀는 물을 마십니다 (Geunyeoneun muleul masibnida)',
        taPrompt: 'அவள் தண்ணீர் குடிக்கிறாள் (Aval thanneer kudikkiraal)',
        esPrompt: 'Ella bebe agua.',
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
        koPrompt: '나는 일본에 갑니다 (Naneun ilbone gabnida)',
        taPrompt: 'நான் ஜப்பான் செல்கிறேன் (Naan Jappan selgiren)',
        esPrompt: 'Voy a Japón.',
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
        koPrompt: '내 고양이는 귀엽습니다 (Nae goyang-ineun gwiyeobseumnida)',
        taPrompt: 'என் பூனை அழகாக இருக்கிறது (En poonai azhagaga irukkiradhu)',
        esPrompt: 'Mi gato es lindo.',
        correctOrder: ['わたし', 'の', 'ねこ', 'は', 'かわいい', 'です'],
        words: [
            { ja: 'わたし', en: 'I', part: false },
            { ja: 'の', en: '[\'s / Possession]', part: true },
            { ja: 'ねこ', en: 'Cat', part: false },
            { ja: 'は', en: '[Topic]', part: true },
            { ja: 'かわいい', en: 'Cute', part: false },
            { ja: 'です', en: 'Is', part: false }
        ]
    },
    {
        prompt: 'Target: "He reads a book at the library."',
        tePrompt: 'అతను లైబ్రరీలో పుస్తకం చదువుతాడు (Athanu library lo pusthakam chaduvuthaadu)',
        hiPrompt: 'वह पुस्तकालय में किताब पढ़ता है (Wah pustakalay mein kitab padhta hai)',
        koPrompt: '그는 도서관에서 책을 읽습니다 (Geuneun doseogwan-eseo chaeg-eul ilgseumnida)',
        taPrompt: 'அவன் நூலகத்தில் புத்தகம் படிக்கிறான் (Avan noolagathil puthagam padikkiraan)',
        esPrompt: 'Él lee un libro en la biblioteca.',
        correctOrder: ['かれ', 'は', 'としょかん', 'で', 'ほん', 'を', 'よみます'],
        words: [
            { ja: 'かれ', en: 'He', part: false },
            { ja: 'は', en: '[Topic]', part: true },
            { ja: 'としょかん', en: 'Library', part: false },
            { ja: 'で', en: '[At/In]', part: true },
            { ja: 'ほん', en: 'Book', part: false },
            { ja: 'を', en: '[Object]', part: true },
            { ja: 'よみます', en: 'Read', part: false }
        ]
    },
    {
        prompt: 'Target: "I came from home."',
        tePrompt: 'నేను ఇంటి నుండి వచ్చాను (Nenu inti nundi vacchaanu)',
        hiPrompt: 'मैं घर से आया हूँ (Main ghar se aaya hoon)',
        koPrompt: '나는 집에서 왔습니다 (Naneun jib-eseo wasseumnida)',
        taPrompt: 'நான் வீட்டிலிருந்து வந்தேன் (Naan veettil-irundhu vandhen)',
        esPrompt: 'Vine de casa.',
        correctOrder: ['わたし', 'は', 'うち', 'から', 'きました'],
        words: [
            { ja: 'わたし', en: 'I', part: false },
            { ja: 'は', en: '[Topic]', part: true },
            { ja: 'うち', en: 'Home', part: false },
            { ja: 'から', en: '[From]', part: true },
            { ja: 'きました', en: 'Came', part: false }
        ]
    },
    {
        prompt: 'Target: "She studies until night."',
        tePrompt: 'ఆమె రాత్రి వరకు చదువుకుంటుంది (Ame raathri varaku chaduvukuntundi)',
        hiPrompt: 'वह रात तक पढ़ाई करती है (Wah raat tak padhai karti hai)',
        koPrompt: '그녀는 밤까지 공부합니다 (Geunyeoneun bam-kkaji gongbuhabnida)',
        taPrompt: 'அவள் இரவு வரை படிக்கிறாள் (Aval iravu varai padikkiraal)',
        esPrompt: 'Ella estudia hasta la noche.',
        correctOrder: ['かのじょ', 'は', 'よる', 'まで', 'べんきょうします'],
        words: [
            { ja: 'かのじょ', en: 'She', part: false },
            { ja: 'は', en: '[Topic]', part: true },
            { ja: 'よる', en: 'Night', part: false },
            { ja: 'まで', en: '[Until]', part: true },
            { ja: 'べんきょうします', en: 'Study', part: false }
        ]
    },
    {
        prompt: 'Target: "I go to school with a friend."',
        tePrompt: 'నేను స్నేహితుడితో పాఠశాలకు వెళ్తాను (Nenu snehithuditho paatashaalaku velthaanu)',
        hiPrompt: 'मैं दोस्त के साथ स्कूल जाता हूँ (Main dost ke sath school jaata hoon)',
        koPrompt: '나는 친구와 함께 학교에 갑니다 (Naneun chingu-wa hamkke haggyo-e gabnida)',
        taPrompt: 'நான் நண்பனுடன் பள்ளிக்குச் செல்கிறேன் (Naan nanbanudan pallikkuch selgiren)',
        esPrompt: 'Voy a la escuela con un amigo.',
        correctOrder: ['わたし', 'は', 'ともだち', 'と', 'がっこう', 'に', 'いきます'],
        words: [
            { ja: 'わたし', en: 'I', part: false },
            { ja: 'は', en: '[Topic]', part: true },
            { ja: 'ともだち', en: 'Friend', part: false },
            { ja: 'と', en: '[With]', part: true },
            { ja: 'がっこう', en: 'School', part: false },
            { ja: 'に', en: '[To]', part: true },
            { ja: 'いきます', en: 'Go', part: false }
        ]
    },
    {
        prompt: 'Target: "Mother\'s cooking is delicious."',
        tePrompt: 'అమ్మ వంట రుచిగా ఉంటుంది (Amma vanta ruchiga untundi)',
        hiPrompt: 'माँ का खाना स्वादिष्ट है (Maa ka khana swadisht hai)',
        koPrompt: '어머니의 요리는 맛있습니다 (Eomeoni-ui yolineun mas-issseumnida)',
        taPrompt: 'அம்மாவின் சமையல் சுவையாக இருக்கிறது (Ammavin samayal suvaiyaga irukkiradhu)',
        esPrompt: 'La comida de mi madre es deliciosa.',
        correctOrder: ['はは', 'の', 'りょうり', 'は', 'おいしい', 'です'],
        words: [
            { ja: 'はは', en: 'Mother', part: false },
            { ja: 'の', en: '[\'s / Possession]', part: true },
            { ja: 'りょうり', en: 'Cooking', part: false },
            { ja: 'は', en: '[Topic]', part: true },
            { ja: 'おいしい', en: 'Delicious', part: false },
            { ja: 'です', en: 'Is', part: false }
        ]
    },
    {
        prompt: 'Target: "I drink tea every morning."',
        tePrompt: 'నేను ప్రతి ఉదయం టీ తాగుతాను (Nenu prathi udayam tea thaaguthaanu)',
        hiPrompt: 'मैं हर सुबह चाय पीता हूँ (Main har subah chai peeta hoon)',
        koPrompt: '나는 매일 아침 차를 마십니다 (Naneun maeil achim cha-leul masibnida)',
        taPrompt: 'நான் தினமும் காலையில் தேநீர் குடிக்கிறேன் (Naan dhinamum kaalaiyil theneer kudikkiren)',
        esPrompt: 'Bebo té todas las mañanas.',
        correctOrder: ['わたし', 'は', 'まいあさ', 'おちゃ', 'を', 'のみます'],
        words: [
            { ja: 'わたし', en: 'I', part: false },
            { ja: 'は', en: '[Topic]', part: true },
            { ja: 'まいあさ', en: 'Every Morning', part: false },
            { ja: 'おちゃ', en: 'Tea', part: false },
            { ja: 'を', en: '[Object]', part: true },
            { ja: 'のみます', en: 'Drink', part: false }
        ]
    },
    {
        prompt: 'Target: "The teacher teaches Japanese at school."',
        tePrompt: 'ఉపాధ్యాయుడు పాఠశాలలో జపనీస్ బోధిస్తాడు (Upadhyaayudu paatashaalalo Japanese bodhisthaadu)',
        hiPrompt: 'शिक्षक स्कूल में जापानी पढ़ाते हैं (Shikshak school mein japani padhate hain)',
        koPrompt: '선생님은 학교에서 일본어를 가르칩니다 (Seonsaengnim-eun haggyo-eseo ilboneo-leul galeuchibnida)',
        taPrompt: 'ஆசிரியர் பள்ளியில் ஜப்பானிய மொழி கற்பிக்கிறார் (Aasiriyar palliyil Jappaniya mozhi karpikkiraar)',
        esPrompt: 'El profesor enseña japonés en la escuela.',
        correctOrder: ['せんせい', 'は', 'がっこう', 'で', 'にほんご', 'を', 'おしえます'],
        words: [
            { ja: 'せんせい', en: 'Teacher', part: false },
            { ja: 'は', en: '[Topic]', part: true },
            { ja: 'がっこう', en: 'School', part: false },
            { ja: 'で', en: '[At]', part: true },
            { ja: 'にほんご', en: 'Japanese', part: false },
            { ja: 'を', en: '[Object]', part: true },
            { ja: 'おしえます', en: 'Teach', part: false }
        ]
    },
    {
        prompt: 'Target: "I want to go to Japan next year."',
        tePrompt: 'నేను వచ్చే ఏడాది జపాన్ వెళ్లాలనుకుంటున్నాను (Nenu vacche edadi Japan vellalanukuntunnanu)',
        hiPrompt: 'मैं अगले साल जापान जाना चाहता हूँ (Main agle saal Japan jaana chahta hoon)',
        koPrompt: '나는 내년에 일본에 가고 싶습니다 (Naneun naenyeon-e ilbone gago sipseumnida)',
        taPrompt: 'நான் அடுத்த வருடம் ஜப்பான் செல்ல விரும்புகிறேன் (Naan adutha varudam Jappan sella virumbugiren)',
        esPrompt: 'Quiero ir a Japón el año que viene.',
        correctOrder: ['わたし', 'は', 'らいねん', 'にほん', 'に', 'いきたい', 'です'],
        words: [
            { ja: 'わたし', en: 'I', part: false },
            { ja: 'は', en: '[Topic]', part: true },
            { ja: 'らいねん', en: 'Next Year', part: false },
            { ja: 'にほん', en: 'Japan', part: false },
            { ja: 'に', en: '[To]', part: true },
            { ja: 'いきたい', en: 'Want to go', part: false },
            { ja: 'です', en: 'Is/Polite', part: false }
        ]
    },
    {
        prompt: 'Target: "I read a book every day."',
        tePrompt: 'నేను ప్రతిరోజు పుస్తకం చదువుతాను (Nenu prathi roju pusthakam chaduvuthaanu)',
        hiPrompt: 'मैं हर दिन एक किताब पढ़ता हूँ (Main har din ek kitab padhta hoon)',
        koPrompt: '나는 매일 책을 읽습니다 (Naneun maeil chaeg-eul ilgseumnida)',
        taPrompt: 'நான் தினமும் ஒரு புத்தகம் படிக்கிறேன் (Naan dhinamum oru puthagam padikkiren)',
        esPrompt: 'Leo un libro todos los días.',
        correctOrder: ['わたし', 'は', 'まいにち', 'ほん', 'を', 'よみます'],
        words: [
            { ja: 'わたし', en: 'I', part: false },
            { ja: 'は', en: '[Topic]', part: true },
            { ja: 'まいにち', en: 'Every day', part: false },
            { ja: 'ほん', en: 'Book', part: false },
            { ja: 'を', en: '[Object]', part: true },
            { ja: 'よみます', en: 'Read', part: false }
        ]
    },
    {
        prompt: 'Target: "Please wait a little."',
        tePrompt: 'దయచేసి కొంచెం సేపు వేచి ఉండండి (Dayachesi konchem sepu vechi undandi)',
        hiPrompt: 'कृपया थोड़ा इंतज़ार करें (Kripya thoda intezaar karein)',
        koPrompt: '잠깐만 기다려 주세요 (Jamkkanman gidalyeo juseyo)',
        taPrompt: 'தயவுசெய்து கொஞ்சம் காத்திருங்கள் (Thayavu seydhu konjam kaathirungal)',
        esPrompt: 'Por favor, espera un poco.',
        correctOrder: ['ちょっと', 'まって', 'ください'],
        words: [
            { ja: 'ちょっと', en: 'A little', part: false },
            { ja: 'まって', en: 'Wait (te-form)', part: false },
            { ja: 'ください', en: 'Please', part: false }
        ]
    },
    {
        prompt: 'Target: "Can you speak Japanese?"',
        tePrompt: 'మీరు జపనీస్ మాట్లాడగలరా? (Meeru Japanese maatladagalara?)',
        hiPrompt: 'क्या आप जापानी बोल सकते हैं? (Kya aap japani bol sakte hain?)',
        koPrompt: '일본어를 말할 수 있습니까? (Ilboneo-leul malhal su issseumnikka?)',
        taPrompt: 'நீங்கள் ஜப்பானிய மொழி பேச முடியுமா? (Neengal Jappaniya mozhi pesa mudiyuma?)',
        esPrompt: '¿Puedes hablar japonés?',
        correctOrder: ['にほんご', 'が', 'はなせますか'],
        words: [
            { ja: 'にほんご', en: 'Japanese', part: false },
            { ja: 'が', en: '[Subject]', part: true },
            { ja: 'はなせますか', en: 'Can speak?', part: false }
        ]
    },
    {
        prompt: 'Target: "I want to drink coffee."',
        tePrompt: 'నేను కాఫీ తాగాలనుకుంటున్నాను (Nenu coffee thaagaalanukuntunnanu)',
        hiPrompt: 'मैं कॉफ़ी पीना चाहता हूँ (Main coffee peena chahta hoon)',
        koPrompt: '나는 커피를 마시고 싶습니다 (Naneun keopileul masigo sipseumnida)',
        taPrompt: 'நான் காபி குடிக்க விரும்புகிறேன் (Naan kaapi kudikka virumbugiren)',
        esPrompt: 'Quiero beber café.',
        correctOrder: ['わたし', 'は', 'コーヒー', 'が', 'のみたい', 'です'],
        words: [
            { ja: 'わたし', en: 'I', part: false },
            { ja: 'は', en: '[Topic]', part: true },
            { ja: 'コーヒー', en: 'Coffee', part: false },
            { ja: 'が', en: '[Object of desire]', part: true },
            { ja: 'のみたい', en: 'Want to drink', part: false },
            { ja: 'です', en: 'Polite', part: false }
        ]
    },
    {
        prompt: 'Target: "My friend gave me a present."',
        tePrompt: 'నా స్నేహితుడు నాకు బహుమతి ఇచ్చాడు (Naa snehithudu naaku bahumathi icchaadu)',
        hiPrompt: 'मेरे दोस्त ने मुझे एक तोहफा दिया (Mere dost ne mujhe ek tohfa diya)',
        koPrompt: '제 친구가 저에게 선물을 주었습니다 (Je chinguga jeoege seonmul-eul jueossseumnida)',
        taPrompt: 'என் நண்பன் எனக்கு ஒரு பரிசு கொடுத்தான் (En nanban enakku oru parisu koduthaan)',
        esPrompt: 'Mi amigo me dio un regalo.',
        correctOrder: ['ともだち', 'が', 'プレゼント', 'を', 'くれました'],
        words: [
            { ja: 'ともだち', en: 'Friend', part: false },
            { ja: 'が', en: '[Subject]', part: true },
            { ja: 'プレゼント', en: 'Present', part: false },
            { ja: 'を', en: '[Object]', part: true },
            { ja: 'くれました', en: 'Gave (to me)', part: false }
        ]
    },
    {
        prompt: 'Target: "Let\'s eat lunch together."',
        tePrompt: 'మనం కలిసి మధ్యాహ్న భోజనం చేద్దాం (Manam kalisi madhyaahna bhojanam cheddaam)',
        hiPrompt: 'चलो साथ में दोपहर का खाना खाते हैं (Chalo saath mein dopahar ka khana khaate hain)',
        koPrompt: '같이 점심을 먹읍시다 (Gachi jeomsim-eul meog-eupsida)',
        taPrompt: 'நாம் ஒன்றாக மதிய உணவு சாப்பிடுவோம் (Naam ondraaga madhiya unavu saappiduvom)',
        esPrompt: 'Comamos el almuerzo juntos.',
        correctOrder: ['いっしょに', 'ひるごはん', 'を', 'たべましょう'],
        words: [
            { ja: 'いっしょに', en: 'Together', part: false },
            { ja: 'ひるごはん', en: 'Lunch', part: false },
            { ja: 'を', en: '[Object]', part: true },
            { ja: 'たべましょう', en: "Let's eat", part: false }
        ]
    },
    {
        prompt: 'Target: "I went to Tokyo yesterday."',
        tePrompt: 'నేను నిన్న టోక్యోకు వెళ్ళాను (Nenu ninna Tokyo ku vellaanu)',
        hiPrompt: 'मैं कल टोक्यो गया था (Main kal Tokyo gaya tha)',
        koPrompt: '나는 어제 도쿄에 갔습니다 (Naneun eoje Dokyo-e gassseumnida)',
        taPrompt: 'நான் நேற்று டோக்கியோவிற்கு சென்றேன் (Naan netru Tokyovirku sendren)',
        esPrompt: 'Ayer fui a Tokio.',
        correctOrder: ['わたし', 'は', 'きのう', 'とうきょう', 'に', 'いきました'],
        words: [
            { ja: 'わたし', en: 'I', part: false },
            { ja: 'は', en: '[Topic]', part: true },
            { ja: 'きのう', en: 'Yesterday', part: false },
            { ja: 'とうきょう', en: 'Tokyo', part: false },
            { ja: 'に', en: '[To]', part: true },
            { ja: 'いきました', en: 'Went', part: false }
        ]
    },
    {
        prompt: 'Target: "Please open the window."',
        tePrompt: 'దయచేసి కిటికీ తెరవండి (Dayachesi kitiki theravandi)',
        hiPrompt: 'कृपया खिड़की खोलिए (Kripya khidki kholiye)',
        koPrompt: '창문을 열어 주세요 (Changmun-eul yeol-eo juseyo)',
        taPrompt: 'தயவுசெய்து ஜன்னலைத் திறக்கவும் (Thayavu seydhu jannalai thirakkavum)',
        esPrompt: 'Por favor, abre la ventana.',
        correctOrder: ['まど', 'を', 'あけて', 'ください'],
        words: [
            { ja: 'まど', en: 'Window', part: false },
            { ja: 'を', en: '[Object]', part: true },
            { ja: 'あけて', en: 'Open (te-form)', part: false },
            { ja: 'ください', en: 'Please', part: false }
        ]
    },
    {
        prompt: 'Target: "This ramen is delicious."',
        tePrompt: 'ఈ రామెన్ చాలా రుచిగా ఉంది (Ee ramen chaala ruchiga undi)',
        hiPrompt: 'यह रामेन बहुत स्वादिष्ट है (Yah ramen bahut swadisht hai)',
        koPrompt: '이 라멘은 맛있습니다 (I ramen-eun mas-issseumnida)',
        taPrompt: 'இந்த ராமென் மிகவும் சுவையாக இருக்கிறது (Indha ramen migavum suvaiyaga irukkiradhu)',
        esPrompt: 'Este ramen está delicioso.',
        correctOrder: ['この', 'ラーメン', 'は', 'おいしい', 'です'],
        words: [
            { ja: 'この', en: 'This', part: false },
            { ja: 'ラーメン', en: 'Ramen', part: false },
            { ja: 'は', en: '[Topic]', part: true },
            { ja: 'おいしい', en: 'Delicious', part: false },
            { ja: 'です', en: 'Is', part: false }
        ]
    },
    {
        prompt: 'Target: "I study Japanese at the library."',
        tePrompt: 'నేను లైబ్రరీలో జపనీస్ చదువుతాను (Nenu library lo Japanese chaduvuthaanu)',
        hiPrompt: 'मैं पुस्तकालय में जापानी पढ़ता हूँ (Main pustakalay mein japani padhta hoon)',
        koPrompt: '나는 도서관에서 일본어를 공부합니다 (Naneun doseogwan-eseo ilboneo-leul gongbuhabnida)',
        taPrompt: 'நான் நூலகத்தில் ஜப்பானிய மொழி படிக்கிறேன் (Naan noolagathil Jappaniya mozhi padikkiren)',
        esPrompt: 'Estudio japonés en la biblioteca.',
        correctOrder: ['わたし', 'は', 'としょかん', 'で', 'にほんご', 'を', 'べんきょうします'],
        words: [
            { ja: 'わたし', en: 'I', part: false },
            { ja: 'は', en: '[Topic]', part: true },
            { ja: 'としょかん', en: 'Library', part: false },
            { ja: 'で', en: '[At/In]', part: true },
            { ja: 'にほんご', en: 'Japanese', part: false },
            { ja: 'を', en: '[Object]', part: true },
            { ja: 'べんきょうします', en: 'Study', part: false }
        ]
    }
];

const CANVAS_GUIDES = [
    { ja: 'あ', ro: 'a', type: 'Hiragana' },
    { ja: 'い', ro: 'i', type: 'Hiragana' },
    { ja: 'う', ro: 'u', type: 'Hiragana' },
    { ja: 'え', ro: 'e', type: 'Hiragana' },
    { ja: 'お', ro: 'o', type: 'Hiragana' },
    { ja: 'か', ro: 'ka', type: 'Hiragana' },
    { ja: 'き', ro: 'ki', type: 'Hiragana' },
    { ja: 'く', ro: 'ku', type: 'Hiragana' },
    { ja: 'け', ro: 'ke', type: 'Hiragana' },
    { ja: 'こ', ro: 'ko', type: 'Hiragana' },
    { ja: 'さ', ro: 'sa', type: 'Hiragana' },
    { ja: 'し', ro: 'shi', type: 'Hiragana' },
    { ja: 'す', ro: 'su', type: 'Hiragana' },
    { ja: 'せ', ro: 'se', type: 'Hiragana' },
    { ja: 'そ', ro: 'so', type: 'Hiragana' }
];

// --- APP INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    loadGameData();
    setupTabs();
    setupTabLinks();
    setupCurriculum();
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

    // First-visit welcome / onboarding
    setupOnboarding();

    // Per-tab guided help + replay tour
    setupHelp();

    // Reset Game bind
    setupResetGameButton();

    // Register PWA Service Worker for offline installation
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(err => console.log('PWA ServiceWorker registration failed:', err));
    }

    // Keyboard Shortcuts (1-4 for battle, Space/Arrows for flashcards)
    setupKeyboardShortcuts();

    // 3D / juice: card tilt, hero parallax, optional WebGL battle mode
    setupCardTilt();
    setupHeroParallax();
    setupArena3dToggle();
    
    // Draw initial HUD & start first battle
    updateHUDDisplays();
    startNewBattle();
});

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ignore game shortcuts while any modal overlay is open
        if (document.querySelector('.onboarding-overlay.show, .help-overlay.show')) return;
        const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
            return;
        }

        const arenaTab = document.getElementById('arena');
        const flashcardsTab = document.getElementById('flashcards');

        // Quest Arena 1, 2, 3, 4 shortcuts for options
        if (arenaTab && arenaTab.classList.contains('active')) {
            if (['1', '2', '3', '4'].includes(e.key)) {
                const idx = parseInt(e.key) - 1;
                const buttons = document.querySelectorAll('#combat-options button');
                if (buttons && buttons[idx] && buttons[idx].style.display !== 'none' && buttons[idx].style.pointerEvents !== 'none') {
                    e.preventDefault();
                    buttons[idx].click();
                }
            }
        }

        // Flashcards Spacebar flip & Arrow key navigation shortcuts
        if (flashcardsTab && flashcardsTab.classList.contains('active')) {
            if (e.code === 'Space') {
                e.preventDefault();
                const cardBox = document.getElementById('flashcard-card-box');
                if (cardBox) cardBox.click();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevBtn = document.getElementById('btn-card-prev');
                if (prevBtn) prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                const nextBtn = document.getElementById('btn-card-next');
                if (nextBtn) nextBtn.click();
            }
        }
    });
}

// Load player stats from LocalStorage
function loadGameData() {
    const savedPlayer = localStorage.getItem('samurai_player');
    let loaded = null;
    if (savedPlayer) {
        try {
            loaded = JSON.parse(savedPlayer);
        } catch (e) {
            console.error("Failed to parse saved game data, resetting:", e);
        }
    }
    
    if (loaded && typeof loaded === 'object') {
        player.level = typeof loaded.level === 'number' ? loaded.level : 1;
        player.maxHp = typeof loaded.maxHp === 'number' ? loaded.maxHp : 100;
        player.hp = typeof loaded.hp === 'number' ? Math.min(loaded.hp, player.maxHp) : player.maxHp;
        player.xp = typeof loaded.xp === 'number' ? loaded.xp : 0;
        player.maxXp = typeof loaded.maxXp === 'number' ? loaded.maxXp : 100;
        player.gold = typeof loaded.gold === 'number' ? loaded.gold : 50;
        player.streak = typeof loaded.streak === 'number' ? loaded.streak : 0;
        player.lastActiveDate = typeof loaded.lastActiveDate === 'string' ? loaded.lastActiveDate : '';
        player.nativeLanguage = typeof loaded.nativeLanguage === 'string' ? loaded.nativeLanguage : 'english';
        player.lastTab = typeof loaded.lastTab === 'string' ? loaded.lastTab : '';
        player.currentLesson = typeof loaded.currentLesson === 'string' ? loaded.currentLesson : '';
        
        // Verify streak isn't broken on load
        if (player.lastActiveDate) {
            const today = getLocalDateString();
            const prevDate = new Date(player.lastActiveDate);
            const currDate = new Date(today);
            const diffMs = currDate - prevDate;
            const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
            if (diffDays > 1) {
                player.streak = 0; // Streak reset due to inactivity
            }
        }
        
        if (loaded.inventory && typeof loaded.inventory === 'object') {
            player.inventory = {
                potion: typeof loaded.inventory.potion === 'number' ? loaded.inventory.potion : 1,
                shield: typeof loaded.inventory.shield === 'number' ? loaded.inventory.shield : 1,
                hint: typeof loaded.inventory.hint === 'number' ? loaded.inventory.hint : 1
            };
        } else {
            player.inventory = { potion: 1, shield: 1, hint: 1 };
        }
        
        if (loaded.stats && typeof loaded.stats === 'object') {
            player.stats = {
                totalAnswered: typeof loaded.stats.totalAnswered === 'number' ? loaded.stats.totalAnswered : 0,
                totalCorrect: typeof loaded.stats.totalCorrect === 'number' ? loaded.stats.totalCorrect : 0,
                byLevel: {
                    N5: { answered: 0, correct: 0 },
                    N4: { answered: 0, correct: 0 },
                    N3: { answered: 0, correct: 0 },
                    N2: { answered: 0, correct: 0 },
                    N1: { answered: 0, correct: 0 }
                },
                byType: {}
            };
            if (loaded.stats.byLevel && typeof loaded.stats.byLevel === 'object') {
                const tiers = ['N5', 'N4', 'N3', 'N2', 'N1'];
                tiers.forEach(t => {
                    if (loaded.stats.byLevel[t] && typeof loaded.stats.byLevel[t] === 'object') {
                        player.stats.byLevel[t].answered = typeof loaded.stats.byLevel[t].answered === 'number' ? loaded.stats.byLevel[t].answered : 0;
                        player.stats.byLevel[t].correct = typeof loaded.stats.byLevel[t].correct === 'number' ? loaded.stats.byLevel[t].correct : 0;
                    }
                });
            }
            if (loaded.stats.byType && typeof loaded.stats.byType === 'object') {
                player.stats.byType = { ...loaded.stats.byType };
            }
        } else {
            player.stats = {
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
            };
        }
        
        if (loaded.srsData && typeof loaded.srsData === 'object') {
            player.srsData = { ...loaded.srsData };
        } else {
            player.srsData = {};
        }
    } else {
        player.srsData = {};
    }
}

function saveGameData() {
    localStorage.setItem('samurai_player', JSON.stringify(player));
}

function getLocalDateString() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function updateStreak() {
    const today = getLocalDateString();
    if (!player.lastActiveDate) {
        player.streak = 1;
        player.lastActiveDate = today;
        saveGameData();
        updateHUDDisplays();
        return;
    }
    
    if (player.lastActiveDate === today) {
        return; // already active today
    }
    
    const prevDate = new Date(player.lastActiveDate);
    const currDate = new Date(today);
    const diffMs = currDate - prevDate;
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        player.streak++;
        player.lastActiveDate = today;
        addLog(`Streak extended! You've studied ${player.streak} days in a row! 🔥`, 'system');
    } else if (diffDays > 1) {
        player.streak = 1;
        player.lastActiveDate = today;
        addLog("Streak reset to 1 day. Keep up the daily practice! 💪", "system");
    }
    
    saveGameData();
    updateHUDDisplays();
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
    document.getElementById('streak-count').textContent = `${player.streak} Day${player.streak === 1 ? '' : 's'}`;
    
    let rank = 'Novice';
    if (player.level >= 5) rank = 'Bushido';
    if (player.level >= 12) rank = 'Shogun';
    if (player.level >= 20) rank = 'Kensei (Sword Saint)';
    document.getElementById('rank-name').textContent = rank;

    // Update accuracy display
    const accEl = document.getElementById('accuracy-display');
    if (accEl && player.stats) {
        const pct = player.stats.totalAnswered > 0 ? Math.round((player.stats.totalCorrect / player.stats.totalAnswered) * 100) : 0;
        // Keep the gold icon and the translated label (the old template dropped both):
        // resolve the label from the active UI language, and carry data-i18n-original
        // so switching back to English still restores correctly.
        const code = LANG_PACK_CODES[player.nativeLanguage];
        const label = (code && window.UI_I18N && window.UI_I18N[code] && window.UI_I18N[code]['badge.accuracy']) || 'Accuracy:';
        accEl.innerHTML = `<i class="fa-solid fa-bullseye" style="color: var(--accent-gold);"></i> <span data-i18n="badge.accuracy" data-i18n-original="Accuracy:">${label}</span> <strong>${pct}%</strong> (${player.stats.totalCorrect}/${player.stats.totalAnswered})`;
    }

    // Update category practice stats breakdown
    const breakdownEl = document.getElementById('stats-type-breakdown');
    if (breakdownEl && player.stats && player.stats.byType) {
        const entries = Object.entries(player.stats.byType);
        if (entries.length > 0) {
            breakdownEl.innerHTML = entries.map(([type, count]) => {
                return `<span class="badge" style="background: rgba(255,255,255,0.05); font-size: 0.85rem; padding: 6px 12px; border-radius: 8px; color: #fff; border: 1px solid rgba(255,255,255,0.1);"><i class="fa-solid fa-tags" style="color: var(--accent-teal); margin-right: 4px;"></i> ${type}: <strong>${count}</strong></span>`;
            }).join('');
        } else {
            breakdownEl.innerHTML = `<span style="font-size: 0.85rem; color: var(--text-muted);">No stats collected yet. Play in the <a href="#" data-goto-tab="arena">Quest Arena</a> to see analysis.</span>`;
        }
    }

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
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('.speak-btn');
        if (btn) {
            e.stopPropagation();
            const text = btn.getAttribute('data-speak');
            if (text) speakJapanese(text);
        }
    });
}

// --- TABS SWITCHER ---
function setupTabs() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabPanels = document.querySelectorAll('.tab-content');

    const activateTab = (targetTab) => {
        navTabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-tab') === targetTab));
        tabPanels.forEach(p => p.classList.remove('active'));
        const targetEl = document.getElementById(targetTab);
        if (targetEl) targetEl.classList.add('active');
        if (targetTab === 'canvas') {
            resizeCanvas();
            drawCanvasGuide();
        }
    };

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            activateTab(targetTab);
            player.lastTab = targetTab;
            saveGameData();
        });
    });

    // Resume the tab the user was last on.
    if (player.lastTab && document.getElementById(player.lastTab)) {
        activateTab(player.lastTab);
    }
}

// Delegated handler for in-app links that jump to another tab, e.g.
// <a href="#" data-goto-tab="arena">Quest Arena</a>. Reuses the nav-tab
// click path (activate + lastTab save) instead of duplicating it.
function setupTabLinks() {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[data-goto-tab]');
        if (!link) return;
        e.preventDefault();
        const btn = document.querySelector(`.nav-tab[data-tab="${link.getAttribute('data-goto-tab')}"]`);
        if (btn) { btn.click(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    });
}

// --- CURRICULUM: level-grouped, data-driven lesson navigation ---
// Lesson content lives as .day-pane blocks in index.html; this metadata drives
// the grouped lesson list. Add a lesson = add a pane + one entry here.
const CURRICULUM = [
    { level: 'N5', title: 'Foundations', lessons: [
        { title: 'Hiragana Foundation', pane: 'day-pane-1' },
        { title: 'Katakana & Sound Modifiers', pane: 'day-pane-2' },
        { title: 'Numbers & Kanji Intro', pane: 'day-pane-3' },
        { title: 'Particles & Sentence Structure', pane: 'day-pane-4' },
        { title: 'Verbs & Conjugation', pane: 'day-pane-5' },
        { title: 'Adjectives & Survival Phrases', pane: 'day-pane-6' },
        { title: 'Conversational Masterclass', pane: 'day-pane-7' }
    ]},
    { level: 'N4', title: 'Everyday Grammar', lessons: [
        { title: 'The Te-form', pane: 'day-pane-8' },
        { title: 'Plain (Casual) Form', pane: 'day-pane-9' },
        { title: 'Plain Past & Negative', pane: 'day-pane-10' },
        { title: 'Counters', pane: 'day-pane-11' },
        { title: 'Giving & Receiving', pane: 'day-pane-12' },
        { title: 'Potential Form', pane: 'day-pane-13' }
    ]},
    { level: 'N3', title: 'Intermediate', lessons: [
        { title: 'Conditionals I: たら & と', pane: 'day-pane-14' },
        { title: 'Conditionals II: ば & なら', pane: 'day-pane-15' },
        { title: 'Passive', pane: 'day-pane-16' },
        { title: 'Causative & Causative-Passive', pane: 'day-pane-17' },
        { title: 'Change & Decisions', pane: 'day-pane-18' },
        { title: 'Hearsay & Appearance', pane: 'day-pane-19' },
        { title: 'Te-form Extensions', pane: 'day-pane-20' },
        { title: 'Keigo I: Honorific & Humble', pane: 'day-pane-21' }
    ]},
    { level: 'N2', title: 'Advanced', lessons: [
        { title: 'ものだ Family', pane: 'day-pane-22' },
        { title: 'わけだ Family', pane: 'day-pane-23' },
        { title: 'Obligation & Compulsion', pane: 'day-pane-24' },
        { title: 'Concessives', pane: 'day-pane-25' },
        { title: 'Tendencies: がち・気味・っぽい', pane: 'day-pane-26' },
        { title: 'Correlated Change', pane: 'day-pane-27' },
        { title: 'Written Japanese (である)', pane: 'day-pane-28' },
        { title: 'Keigo II: Business', pane: 'day-pane-29' }
    ]},
    { level: 'N1', title: 'Mastery', lessons: [
        { title: 'Literary Negatives', pane: 'day-pane-30' },
        { title: 'Concessive Nuance', pane: 'day-pane-31' },
        { title: 'Immediacy: なり・や否や', pane: 'day-pane-32' },
        { title: 'Formal Circumstance', pane: 'day-pane-33' },
        { title: 'Character & Set Phrases', pane: 'day-pane-34' },
        { title: 'Reading the Editorial', pane: 'day-pane-35' }
    ]}
];

function setupCurriculum() {
    const nav = document.getElementById('lesson-nav');
    const panes = document.querySelectorAll('.day-pane');
    if (!nav) return;

    const activateLesson = (paneId) => {
        nav.querySelectorAll('.lesson-btn').forEach(b => b.classList.toggle('active', b.getAttribute('data-pane') === paneId));
        panes.forEach(p => p.classList.remove('active'));
        const pane = document.getElementById(paneId);
        if (pane) pane.classList.add('active');
        ensureLessonI18n(renderLessonSummary);
    };

    let firstPane = null;
    CURRICULUM.forEach(group => {
        const header = document.createElement('div');
        header.className = 'lesson-level-header';
        header.textContent = `${group.level} · ${group.title}`;
        nav.appendChild(header);

        if (!group.lessons.length) {
            const soon = document.createElement('div');
            soon.className = 'lesson-soon';
            soon.textContent = 'More lessons coming soon';
            nav.appendChild(soon);
            return;
        }
        group.lessons.forEach((lesson, i) => {
            const btn = document.createElement('button');
            btn.className = 'lesson-btn';
            btn.setAttribute('data-pane', lesson.pane);
            btn.innerHTML = `<span class="lesson-btn-num">${group.level}·${i + 1}</span><span class="lesson-btn-title">${lesson.title}</span>`;
            btn.addEventListener('click', () => {
                activateLesson(lesson.pane);
                player.currentLesson = lesson.pane;
                saveGameData();
            });
            nav.appendChild(btn);
            if (!firstPane) firstPane = lesson.pane;
        });
    });

    // Resume the lesson the user was last on, else open the first one.
    const resume = (player.currentLesson && document.getElementById(player.currentLesson)) ? player.currentLesson : firstPane;
    if (resume) activateLesson(resume);
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
    
    const audioBtn = document.getElementById('btn-play-guide-audio');
    if (audioBtn) {
        audioBtn.setAttribute('data-speak', item.ja);
    }
    
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawCanvasGuide();
}

// --- FLASHCARDS CONTROLLER ---
let cardCat = 'kana', cardIdx = 0;
let dueOnly = false;

function getActiveCardList() {
    let fullList = [];
    const catUpper = cardCat.toUpperCase();
    if (typeof FULL_VOCAB_DB !== 'undefined' && FULL_VOCAB_DB[catUpper]) {
        fullList = FULL_VOCAB_DB[catUpper].map(item => ({
            ja: item.j,
            ro: '',
            meaning: item.m,
            type: `${catUpper} Vocab`,
            pronounce: item.r,
            key: `${item.j}|${item.r}` // lookup key into the native-language gloss DB
        }));
    } else {
        fullList = VOCAB_DATA[cardCat] || [];
    }
    
    if (!dueOnly) return fullList;
    
    return fullList.filter(card => {
        if (!player.srsData) player.srsData = {};
        const srs = player.srsData[card.ja];
        if (!srs) return true; // New card is due
        return srs.nextReviewTime <= Date.now();
    });
}

function updateFlashcardControlsDisplay() {
    const box = document.getElementById('flashcard-card-box');
    const stdNav = document.getElementById('card-nav-standard');
    const srsNav = document.getElementById('card-nav-srs');
    
    const list = getActiveCardList();
    if (list.length === 0) {
        stdNav.style.display = 'none';
        srsNav.style.display = 'none';
        return;
    }
    
    if (box.classList.contains('flipped')) {
        stdNav.style.display = 'none';
        srsNav.style.display = 'flex';
    } else {
        stdNav.style.display = 'flex';
        srsNav.style.display = 'none';
    }
}

function setupFlashcards() {
    const box = document.getElementById('flashcard-card-box');
    box.addEventListener('click', () => {
        const list = getActiveCardList();
        if (list.length === 0) return; // ignore flip if no cards
        box.classList.toggle('flipped');
        updateFlashcardControlsDisplay();
    });
    
    const toggles = document.querySelectorAll('#flashcard-category-toggle .toggle-btn');
    toggles.forEach(t => {
        t.addEventListener('click', () => {
            toggles.forEach(btn => btn.classList.remove('active'));
            t.classList.add('active');
            cardCat = t.getAttribute('data-cat');
            cardIdx = 0;
            updateCard();
            updateFlashcardControlsDisplay();
        });
    });
    
    document.getElementById('chk-srs-due').addEventListener('change', function() {
        dueOnly = this.checked;
        cardIdx = 0;
        updateCard();
        updateFlashcardControlsDisplay();
    });
    
    document.getElementById('btn-card-prev').addEventListener('click', (e) => {
        e.stopPropagation();
        const list = getActiveCardList();
        if (list.length === 0) return;
        cardIdx = (cardIdx - 1 + list.length) % list.length;
        updateCard();
        updateFlashcardControlsDisplay();
    });
    
    document.getElementById('btn-card-next').addEventListener('click', (e) => {
        e.stopPropagation();
        const list = getActiveCardList();
        if (list.length === 0) return;
        cardIdx = (cardIdx + 1) % list.length;
        updateCard();
        updateFlashcardControlsDisplay();
    });
    
    document.getElementById('btn-card-audio').addEventListener('click', (e) => {
        e.stopPropagation();
        const list = getActiveCardList();
        if (list.length === 0) return;
        speakJapanese(list[cardIdx].ja);
    });
    
    // Bind SRS rating buttons
    document.getElementById('btn-srs-again').addEventListener('click', (e) => { e.stopPropagation(); rateCard('again'); });
    document.getElementById('btn-srs-hard').addEventListener('click', (e) => { e.stopPropagation(); rateCard('hard'); });
    document.getElementById('btn-srs-good').addEventListener('click', (e) => { e.stopPropagation(); rateCard('good'); });
    document.getElementById('btn-srs-easy').addEventListener('click', (e) => { e.stopPropagation(); rateCard('easy'); });
    
    updateCard();
    updateFlashcardControlsDisplay();
}

function rateCard(rating) {
    const list = getActiveCardList();
    if (list.length === 0) return;
    const card = list[cardIdx];
    
    if (!player.srsData) player.srsData = {};
    if (!player.srsData[card.ja]) {
        player.srsData[card.ja] = {
            intervalDays: 0,
            easeFactor: 2.5,
            nextReviewTime: 0
        };
    }
    
    const srs = player.srsData[card.ja];
    let nextMs = 0;
    
    if (rating === 'again') {
        srs.intervalDays = 0;
        nextMs = 60 * 1000; // 1 minute
    } else if (rating === 'hard') {
        srs.intervalDays = 0.5;
        nextMs = 12 * 3600 * 1000; // 12 hours
    } else if (rating === 'good') {
        srs.intervalDays = srs.intervalDays === 0 ? 3 : srs.intervalDays * 2.4;
        nextMs = srs.intervalDays * 24 * 3600 * 1000;
    } else if (rating === 'easy') {
        srs.intervalDays = srs.intervalDays === 0 ? 7 : srs.intervalDays * 4.0;
        nextMs = srs.intervalDays * 24 * 3600 * 1000;
    }
    
    srs.nextReviewTime = Date.now() + nextMs;
    updateStreak();
    
    // Slide card effect
    const box = document.getElementById('flashcard-card-box');
    box.classList.add('slide-out');
    
    setTimeout(() => {
        box.classList.remove('slide-out');
        box.classList.remove('flipped');
        
        const newList = getActiveCardList();
        if (dueOnly) {
            if (cardIdx >= newList.length) {
                cardIdx = 0;
            }
        } else {
            if (newList.length > 0) {
                cardIdx = (cardIdx + 1) % newList.length;
            } else {
                cardIdx = 0;
            }
        }
        updateCard();
        updateFlashcardControlsDisplay();
    }, 400);
}

function updateCard() {
    const box = document.getElementById('flashcard-card-box');
    box.classList.remove('flipped');
    
    const list = getActiveCardList();
    
    if (list.length === 0) {
        document.getElementById('card-progress').textContent = `0 / 0`;
        document.getElementById('card-front-type').textContent = 'SRS SUCCESS';
        document.getElementById('card-front-txt').textContent = 'All caught up! 🎉';
        document.getElementById('card-back-type').textContent = 'SRS SUCCESS';
        document.getElementById('card-back-pronounce').textContent = 'No cards currently due for review.';
        document.getElementById('card-back-meaning').textContent = 'Try checking in later or uncheck "Due Only" to browse cards.';
        document.getElementById('card-back-romaji').textContent = '';
        return;
    }
    
    const card = list[cardIdx];
    document.getElementById('card-progress').textContent = `${cardIdx + 1} / ${list.length}`;
    document.getElementById('card-front-type').textContent = card.type.toUpperCase();
    document.getElementById('card-front-txt').textContent = card.ja;
    document.getElementById('card-back-type').textContent = 'EXPLANATION';
    document.getElementById('card-back-pronounce').textContent = `Pronunciation: ${card.pronounce}`;
    // Native-language gloss first when a language pack is loaded; English kept as the safety net.
    const nativeGloss = getNativeGloss(card);
    document.getElementById('card-back-meaning').textContent = nativeGloss ? `${nativeGloss}  ·  ${card.meaning}` : card.meaning;
    document.getElementById('card-back-romaji').textContent = `Romaji: ${card.ro}`;
}

// --- NATIVE-LANGUAGE GLOSS PACKS (lazy-loaded js/lang/<code>.js) ---
const LANG_PACK_CODES = { telugu: 'te', hindi: 'hi', korean: 'ko', tamil: 'ta', spanish: 'es' };

function ensureLangDb(onReady) {
    const code = LANG_PACK_CODES[player.nativeLanguage];
    if (!code) { if (onReady) onReady(); return; } // english: nothing to load
    window.LANG_DB = window.LANG_DB || {};
    if (window.LANG_DB[code]) { if (onReady) onReady(); return; }
    const s = document.createElement('script');
    s.src = `js/lang/${code}.js`;
    s.onload = () => { if (onReady) onReady(); };
    s.onerror = () => console.log('Language pack failed to load:', code);
    document.head.appendChild(s);
}

// --- 3D / BATTLE JUICE ---
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function fxShake(el, cls) {
    if (REDUCED_MOTION || !el) return;
    el.classList.remove(cls);
    void el.offsetWidth; // restart the animation
    el.classList.add(cls);
}

function fxDamageNumber(anchorEl, text, kind) {
    if (REDUCED_MOTION || !anchorEl) return;
    const n = document.createElement('div');
    n.className = `dmg-float ${kind}`;
    n.textContent = text;
    const r = anchorEl.getBoundingClientRect();
    n.style.left = `${r.left + r.width / 2 - 20 + (Math.random() * 40 - 20)}px`;
    n.style.top = `${r.top + r.height * 0.3}px`;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 1100);
}

function fxEnemyHit(dmg) {
    const s = document.getElementById('enemy-sprite');
    fxShake(s, 'fx-hit');
    fxDamageNumber(s, `-${dmg}`, 'dmg-enemy');
    if (window.arena3d && window.arena3d.active) window.arena3d.hit();
}

function fxPlayerHit(dmg) {
    fxShake(document.querySelector('.rpg-arena'), 'fx-screenshake');
    fxDamageNumber(document.querySelector('.game-hud'), `-${dmg} HP`, 'dmg-player');
}

function fxShieldBlock() {
    const s = document.getElementById('slot-shield');
    fxShake(s, 'fx-hit');
    fxDamageNumber(s, 'BLOCKED', 'dmg-block');
}

function fxVictory() {
    fxShake(document.querySelector('.enemy-panel'), 'fx-victory');
}

// Pointer tilt on battle/shop cards (hover-capable devices only)
function setupCardTilt() {
    if (REDUCED_MOTION || !window.matchMedia('(hover: hover)').matches) return;
    const MAX = 5; // degrees
    document.querySelectorAll('.shop-card, .enemy-panel').forEach(el => {
        el.classList.add('tilt-3d');
        el.addEventListener('pointermove', (e) => {
            const r = el.getBoundingClientRect();
            el.style.setProperty('--tilt-y', `${((e.clientX - r.left) / r.width - 0.5) * 2 * MAX}deg`);
            el.style.setProperty('--tilt-x', `${((e.clientY - r.top) / r.height - 0.5) * -2 * MAX}deg`);
        });
        el.addEventListener('pointerleave', () => {
            el.style.setProperty('--tilt-x', '0deg');
            el.style.setProperty('--tilt-y', '0deg');
        });
    });
}

// Subtle hero-banner parallax on scroll
function setupHeroParallax() {
    if (REDUCED_MOTION) return;
    const hero = document.querySelector('.hero-banner');
    if (!hero) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            hero.style.backgroundPosition = `center calc(50% + ${Math.min(window.scrollY * 0.25, 80)}px)`;
            ticking = false;
        });
    }, { passive: true });
}

// Optional WebGL 3D battle mode (experimental, lazy-loaded, off by default)
function setupArena3dToggle() {
    const chk = document.getElementById('chk-arena-3d');
    if (!chk) return;
    const enable = () => {
        import('./arena3d.js').then(m => {
            const ok = m.init(document.getElementById('enemy-sprite'), activeEnemy.sprite);
            if (!ok) { // WebGL unavailable: silently fall back
                chk.checked = false;
                localStorage.removeItem('kotoquest_3d');
            }
        }).catch(err => {
            console.log('3D mode failed to load:', err);
            chk.checked = false;
            localStorage.removeItem('kotoquest_3d');
        });
    };
    const disable = () => {
        if (window.arena3d) window.arena3d.destroy();
        document.getElementById('enemy-sprite').textContent = activeEnemy.sprite;
    };
    chk.addEventListener('change', () => {
        if (chk.checked) { localStorage.setItem('kotoquest_3d', '1'); enable(); }
        else { localStorage.removeItem('kotoquest_3d'); disable(); }
    });
    if (localStorage.getItem('kotoquest_3d')) { chk.checked = true; enable(); }
}

// --- NATIVE LESSON SUMMARIES (lazy js/lang/lessons.js) ---
function ensureLessonI18n(onReady) {
    const code = LANG_PACK_CODES[player.nativeLanguage];
    if (!code) { if (onReady) onReady(); return; } // english: nothing to load
    if (window.LESSON_I18N) { if (onReady) onReady(); return; }
    const s = document.createElement('script');
    s.src = 'js/lang/lessons.js';
    s.onload = () => { if (onReady) onReady(); };
    s.onerror = () => console.log('Lesson summaries failed to load');
    document.head.appendChild(s);
}

// Shows a short native-language summary at the top of the active lesson pane
// (full lesson prose stays English; the summary carries the core rule).
function renderLessonSummary() {
    const pane = document.querySelector('.day-pane.active');
    if (!pane) return;
    const code = LANG_PACK_CODES[player.nativeLanguage];
    let box = pane.querySelector('.lesson-native-summary');
    const text = code && window.LESSON_I18N && window.LESSON_I18N[code] && window.LESSON_I18N[code][pane.id];
    if (!text) { if (box) box.remove(); return; }
    if (!box) {
        box = document.createElement('div');
        box.className = 'lesson-native-summary';
        const card = pane.querySelector('.glass-card');
        const title = card ? card.querySelector('.card-title') : null;
        if (title && title.parentNode === card) title.insertAdjacentElement('afterend', box);
        else if (card) card.prepend(box);
        else pane.prepend(box);
    }
    box.textContent = text;
}

// --- UI CHROME I18N (data-i18n attributes + js/lang/ui.js strings) ---
function ensureUiI18n(onReady) {
    if (window.UI_I18N) { if (onReady) onReady(); return; }
    const s = document.createElement('script');
    s.src = 'js/lang/ui.js';
    s.onload = () => { if (onReady) onReady(); };
    s.onerror = () => console.log('UI i18n strings failed to load');
    document.head.appendChild(s);
}

function applyUiLanguage() {
    const code = LANG_PACK_CODES[player.nativeLanguage]; // undefined for english
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        // innerHTML (not textContent): a few strings carry inline markup (links, <strong>).
        // Translations come from our own committed ui.js, never user input.
        if (el.dataset.i18nOriginal === undefined) el.dataset.i18nOriginal = el.innerHTML;
        const t = window.UI_I18N && code && window.UI_I18N[code] && window.UI_I18N[code][key];
        el.innerHTML = t || el.dataset.i18nOriginal;
    });
}

function getNativeGlossByKey(key) {
    const code = LANG_PACK_CODES[player.nativeLanguage];
    if (!code || !window.LANG_DB || !window.LANG_DB[code]) return '';
    return window.LANG_DB[code][key] || '';
}

function getNativeGloss(card) {
    const code = LANG_PACK_CODES[player.nativeLanguage];
    if (!code || !window.LANG_DB || !window.LANG_DB[code]) return '';
    if (card.key) return window.LANG_DB[code][card.key] || '';
    // Curated decks (Letters/Numbers/Phrases/Verbs/Adjectives) have no dict key:
    // fall back to a lazily built kanji-only index over the loaded pack.
    let byJ = window.LANG_DB[code + '_byJ'];
    if (!byJ) {
        byJ = {};
        for (const [k, v] of Object.entries(window.LANG_DB[code])) {
            const j = k.split('|')[0];
            if (!(j in byJ)) byJ[j] = v;
        }
        window.LANG_DB[code + '_byJ'] = byJ;
    }
    return byJ[card.ja] || '';
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
    const lang = player.nativeLanguage || 'english';
    let promptText = lvl.prompt;
    if (lang === 'telugu' && lvl.tePrompt) {
        promptText += ` <br><span style="font-size: 0.9rem; color: var(--accent-pink);">Native: ${lvl.tePrompt}</span>`;
    } else if (lang === 'hindi' && lvl.hiPrompt) {
        promptText += ` <br><span style="font-size: 0.9rem; color: var(--accent-gold);">Native: ${lvl.hiPrompt}</span>`;
    } else if (lang === 'korean' && lvl.koPrompt) {
        promptText += ` <br><span style="font-size: 0.9rem; color: #4facfe;">Native: ${lvl.koPrompt}</span>`;
    } else if (lang === 'tamil' && lvl.taPrompt) {
        promptText += ` <br><span style="font-size: 0.9rem; color: #00f2fe;">Native: ${lvl.taPrompt}</span>`;
    } else if (lang === 'spanish' && lvl.esPrompt) {
        promptText += ` <br><span style="font-size: 0.9rem; color: #f9d423;">Native: ${lvl.esPrompt}</span>`;
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
        updateStreak();
    } else {
        feedback.className = 'sentence-feedback error';
        feedback.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Wrong structure. Keep practicing SOV order!';
    }
}

// --- ==================================================== ---
// --- RPG COMBAT ARENA LOOP ENGINE                         ---
// --- ==================================================== ---

function generateProceduralQuestions(tier, count = 20) {
    if (typeof FULL_VOCAB_DB === 'undefined' || !FULL_VOCAB_DB[tier]) return [];
    const dict = FULL_VOCAB_DB[tier];
    if (dict.length === 0) return [];
    
    const questions = [];
    const dictLength = dict.length;
    
    for (let i = 0; i < count; i++) {
        const targetIdx = Math.floor(Math.random() * dictLength);
        const item = dict[targetIdx];
        const isReadingQuestion = Math.random() < 0.5;
        
        if (isReadingQuestion) {
            const wrongOptions = [];
            let attempts = 0;
            while (wrongOptions.length < 3 && attempts < 50) {
                attempts++;
                const w = dict[Math.floor(Math.random() * dictLength)];
                if (w.r !== item.r && !wrongOptions.includes(w.r)) {
                    wrongOptions.push(w.r);
                }
            }
            while (wrongOptions.length < 3) {
                wrongOptions.push('-');
            }
            const options = [item.r, ...wrongOptions].sort(() => Math.random() - 0.5);
            questions.push({
                q: `What is the reading of "${item.j}"?`,
                answer: item.r,
                options: options,
                style: 'mc',
                type: 'Vocab Reading'
            });
        } else {
            // When a language pack is loaded, options read "English · native gloss".
            // Answer checking compares the same composed strings, so it stays consistent.
            const withGloss = (e) => {
                const g = getNativeGlossByKey(`${e.j}|${e.r}`);
                return g ? `${e.m} · ${g}` : e.m;
            };
            const wrongOptions = [];
            const wrongRaw = [];
            let attempts = 0;
            while (wrongOptions.length < 3 && attempts < 50) {
                attempts++;
                const w = dict[Math.floor(Math.random() * dictLength)];
                if (w.m !== item.m && !wrongRaw.includes(w.m)) {
                    wrongRaw.push(w.m);
                    wrongOptions.push(withGloss(w));
                }
            }
            while (wrongOptions.length < 3) {
                wrongOptions.push('-');
            }
            const answerText = withGloss(item);
            const options = [answerText, ...wrongOptions].sort(() => Math.random() - 0.5);
            questions.push({
                q: `What does "${item.j}" mean?`,
                answer: answerText,
                options: options,
                style: 'mc',
                type: 'Vocab Meaning'
            });
        }
    }
    return questions;
}

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
    if (window.arena3d && window.arena3d.active) {
        window.arena3d.setSprite(activeEnemy.sprite);
    } else {
        document.getElementById('enemy-sprite').textContent = activeEnemy.sprite;
    }
    document.getElementById('enemy-sub-label').textContent = activeEnemy.sub;
    updateEnemyHPBar();
    
    const rawQuestions = QUEST_DATABASE[currentTier];
    let list = [...rawQuestions];
    const chk = document.getElementById('chk-procedural-vocab');
    const useProcedural = chk ? chk.checked : true;
    if (useProcedural) {
        const procQuests = generateProceduralQuestions(currentTier, 20);
        list = [...list, ...procQuests];
    }
    currentQuestQuestions = list.sort(() => Math.random() - 0.5);
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
        let list = [...raw];
        const chk = document.getElementById('chk-procedural-vocab');
        const useProcedural = chk ? chk.checked : true;
        if (useProcedural) {
            const procQuests = generateProceduralQuestions(currentTier, 20);
            list = [...list, ...procQuests];
        }
        currentQuestQuestions = list.sort(() => Math.random() - 0.5);
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
    
    // Stats tracking
    const q = currentQuestQuestions[activeQuestionIdx];
    if (!player.stats) {
        player.stats = {
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
        };
    }
    player.stats.totalAnswered++;
    if (!player.stats.byLevel[currentTier]) {
        player.stats.byLevel[currentTier] = { answered: 0, correct: 0 };
    }
    player.stats.byLevel[currentTier].answered++;
    if (q && q.type) {
        player.stats.byType[q.type] = (player.stats.byType[q.type] || 0) + 1;
    }
    
    const dmgDealt = Math.round(20 + Math.random() * 10);
    
    if (selection === correct) {
        player.stats.totalCorrect++;
        player.stats.byLevel[currentTier].correct++;
        updateStreak();
        
        btn.classList.add('correct');
        activeEnemy.hp -= dmgDealt;
        if (activeEnemy.hp < 0) activeEnemy.hp = 0;
        updateEnemyHPBar();
        fxEnemyHit(dmgDealt);
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
    const q = currentQuestQuestions[activeQuestionIdx];
    const correct = q.answer.toLowerCase();
    
    if (!ans) return;
    
    // Stats tracking
    if (!player.stats) {
        player.stats = {
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
        };
    }
    player.stats.totalAnswered++;
    if (!player.stats.byLevel[currentTier]) {
        player.stats.byLevel[currentTier] = { answered: 0, correct: 0 };
    }
    player.stats.byLevel[currentTier].answered++;
    if (q && q.type) {
        player.stats.byType[q.type] = (player.stats.byType[q.type] || 0) + 1;
    }

    const dmgDealt = Math.round(30 + Math.random() * 10);
    
    if (ans === correct) {
        player.stats.totalCorrect++;
        player.stats.byLevel[currentTier].correct++;
        updateStreak();
        
        activeEnemy.hp -= dmgDealt;
        if (activeEnemy.hp < 0) activeEnemy.hp = 0;
        updateEnemyHPBar();
        fxEnemyHit(dmgDealt);
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
        fxShieldBlock();
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
        fxPlayerHit(dmg);
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
        fxVictory();
        addLog(`VICTORY! You defeated ${activeEnemy.name}!`, 'heal');
        addLog(`Gained: +${activeEnemy.xpReward} XP, +${activeEnemy.goldReward} Gold!`, 'system');
        
        player.gold += activeEnemy.goldReward;
        player.xp += activeEnemy.xpReward;

        while (player.xp >= player.maxXp) {
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

    const lang = player.nativeLanguage || 'english';
    document.getElementById('calc-native-eq').textContent = data[lang] || '-';

    const langLabels = {
        telugu: 'Telugu Equivalent',
        hindi: 'Hindi Equivalent',
        korean: 'Korean Equivalent',
        tamil: 'Tamil Equivalent',
        spanish: 'Spanish Equivalent'
    };
    document.getElementById('calc-native-label').textContent = langLabels[lang] || 'Native Equivalent';

    const titleBtn = document.getElementById('btn-speak-calc-particle');
    if (titleBtn) {
        // extract active particle char: e.g. "は" from "は (wa)"
        const activeChar = (data.title || '').split(' ')[0] || '';
        titleBtn.setAttribute('data-speak', activeChar);
    }

    const listContainer = document.getElementById('calc-examples-list');
    listContainer.innerHTML = '';

    data.examples.forEach(ex => {
        const item = document.createElement('div');
        item.style.padding = '8px';
        item.style.background = 'rgba(255,255,255,0.02)';
        item.style.borderRadius = '6px';
        item.style.border = '1px solid rgba(255,255,255,0.03)';
        
        const shortLang = { telugu: 'te', hindi: 'hi', korean: 'ko', tamil: 'ta', spanish: 'es' }[lang];
        const nativeText = (shortLang && ex[shortLang]) || '';

        item.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                <div style="font-family: var(--font-japanese); font-size: 1.15rem; color: #fff;">
                    ${ex.ja} <span style="font-size: 0.85rem; color: var(--text-muted); font-family: var(--font-sans);">(${ex.ro})</span>
                </div>
                <button class="btn btn-icon speak-btn" data-speak="${ex.ja}" style="padding: 2px 6px; font-size: 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff;"><i class="fa-solid fa-volume-high"></i></button>
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
    
    if (!player.nativeLanguage) player.nativeLanguage = 'english';
    select.value = player.nativeLanguage;

    select.addEventListener('change', () => {
        player.nativeLanguage = select.value;
        saveGameData();
        applyNativeLanguageNuances();
    });
    
    applyNativeLanguageNuances();
}

function applyNativeLanguageNuances() {
    const lang = player.nativeLanguage || 'english';

    // 0. Lazy-load the native gloss pack, then refresh the visible flashcard
    ensureLangDb(() => { if (typeof updateCard === 'function') updateCard(); });

    // 0b. Translate the UI chrome (data-i18n elements); restores English when selected
    ensureUiI18n(applyUiLanguage);

    // 0c. Native summary on the open lesson (removed when English)
    ensureLessonI18n(renderLessonSummary);

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
    // Always refresh the builder prompt (even when the tab is hidden) so arriving
    // at the Sentence Builder after a language switch shows the native line.
    const builderSec = document.getElementById('builder');
    if (builderSec) {
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

function setupOnboarding() {
    const overlay = document.getElementById('onboarding-overlay');
    if (!overlay) return;

    let chosen = player.nativeLanguage || 'english';
    const langButtons = overlay.querySelectorAll('.onboard-lang-btn');
    const markChosen = () => langButtons.forEach(b =>
        b.classList.toggle('active', b.getAttribute('data-lang') === chosen));
    markChosen();
    langButtons.forEach(b => b.addEventListener('click', () => {
        chosen = b.getAttribute('data-lang');
        markChosen();
    }));

    const finish = () => {
        player.nativeLanguage = chosen;
        const select = document.getElementById('native-lang-select');
        if (select) select.value = chosen;
        applyNativeLanguageNuances();
        saveGameData();
        localStorage.setItem('kotoquest_onboarded', '1');
        overlay.classList.remove('show');
    };
    const startBtn = document.getElementById('onboard-start');
    if (startBtn) startBtn.addEventListener('click', finish);
    const skipBtn = document.getElementById('onboard-skip');
    if (skipBtn) skipBtn.addEventListener('click', (e) => { e.preventDefault(); finish(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('show')) finish();
    });

    // Only auto-show for first-time visitors; returning visitors already chose.
    // Replay (via help) shows it later by calling overlay.classList.add('show') directly.
    if (!localStorage.getItem('kotoquest_onboarded')) overlay.classList.add('show');
}

// Short "how to use this" guide for each tab, shown by the floating ? button.
const TAB_HELP = {
    arena: { title: 'Quest Arena', body: 'Pick a difficulty tier (N5–N1), then answer each combat question to attack the monster. Correct answers deal damage and earn XP + gold; wrong answers cost you HP. Spend gold in the Samurai Merchant Shop on potions (heal), shields (block one wrong answer), and hints (remove a wrong option).' },
    bridge: { title: 'Trilingual Bridge', body: 'See how Japanese grammar lines up with your own language. Click any particle (は, を, に…) to view its equivalent and example sentences in your native language. The 24-month planner below maps out a path to JLPT N1.' },
    curriculum: { title: 'Daily Lessons', body: 'A guided, day-by-day course from kana to conversation. Pick a day on the left — it remembers where you left off, so you can pick up next time right where you stopped.' },
    kana: { title: 'Kana Charts', body: 'Tap any hiragana or katakana card to hear it pronounced. Use the toggle up top to switch between the two scripts.' },
    canvas: { title: 'Canvas Writer', body: 'Trace the guide character with your mouse, trackpad, or finger to build muscle memory. Toggle the guide lines on/off and step through characters with Previous / Next.' },
    flashcards: { title: 'Flashcards', body: 'Flip a card, then rate how well you knew it: Again (see it again in ~1 min), Hard (~12 h), Good (~3 days), Easy (~7 days). This is spaced repetition — cards you find hard come back sooner. "Due Only" shows just the cards scheduled for review right now.' },
    builder: { title: 'Sentence Builder', body: 'Tap the word chips into the correct Japanese order (Subject → Topic particle → Object → Object particle → Verb), then Check Sentence. Reset to try again, or move on to the Next Challenge.' }
};

function setupHelp() {
    const fab = document.getElementById('help-fab');
    const overlay = document.getElementById('help-overlay');
    if (!fab || !overlay) return;
    const titleEl = document.getElementById('help-title');
    const bodyEl = document.getElementById('help-body');

    const activeTabId = () => {
        const active = document.querySelector('.nav-tab.active');
        return active ? active.getAttribute('data-tab') : 'arena';
    };
    const openHelp = () => {
        const tab = activeTabId();
        const info = TAB_HELP[tab] || TAB_HELP.arena;
        // Translated help when a UI language pack is active; English fallback.
        const code = LANG_PACK_CODES[player.nativeLanguage];
        const tr = (code && window.UI_I18N && window.UI_I18N[code]) || {};
        titleEl.textContent = tr[`help.${tab}.title`] || info.title;
        bodyEl.textContent = tr[`help.${tab}.body`] || info.body;
        overlay.classList.add('show');
    };
    const closeHelp = () => overlay.classList.remove('show');

    fab.addEventListener('click', openHelp);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeHelp(); });
    ['help-close', 'help-ok'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', closeHelp);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('show')) closeHelp();
    });

    // Replay the first-visit intro tour.
    const replay = document.getElementById('help-replay');
    if (replay) replay.addEventListener('click', () => {
        closeHelp();
        const onboarding = document.getElementById('onboarding-overlay');
        if (onboarding) onboarding.classList.add('show');
    });
}

function setupResetGameButton() {
    const btn = document.getElementById('btn-reset-game');
    if (!btn) return;
    btn.addEventListener('click', () => {
        if (confirm("Are you sure you want to reset all game progress, statistics, gold, and SRS history? This cannot be undone.")) {
            localStorage.removeItem('samurai_player');
            player = {
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
                streak: 0,
                lastActiveDate: '',
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
                },
                srsData: {},
                nativeLanguage: 'english',
                lastTab: '',
                currentLesson: ''
            };
            saveGameData();
            updateHUDDisplays();
            
            // Reload native select dropdown
            const select = document.getElementById('native-lang-select');
            if (select) select.value = 'english';
            
            // Reload nuances
            applyNativeLanguageNuances();
            
            // Reload card cat to kana & refresh flashcards
            cardCat = 'kana';
            cardIdx = 0;
            const toggles = document.querySelectorAll('#flashcard-category-toggle .toggle-btn');
            toggles.forEach(btn => {
                if (btn.getAttribute('data-cat') === 'kana') btn.classList.add('active');
                else btn.classList.remove('active');
            });
            const chkSrs = document.getElementById('chk-srs-due');
            if (chkSrs) chkSrs.checked = false;
            dueOnly = false;
            updateCard();
            updateFlashcardControlsDisplay();
            
            // Restart quest battle
            currentTier = 'N5';
            const tierBtns = document.querySelectorAll('#quest-tier-selector .quest-tier-btn');
            tierBtns.forEach(btn => {
                if (btn.getAttribute('data-tier') === 'N5') btn.classList.add('active');
                else btn.classList.remove('active');
            });
            startNewBattle();
            
            alert("Game progress reset successfully!");
        }
    });
}
