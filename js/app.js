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
        hint: 1,
        streakFreeze: 0
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
    "wa": {
        "title": "は (wa)",
        "role": "Topic Marker",
        "english": "As for... / (subject focus)",
        "telugu": "అయితే (aithe) / (unmarked)",
        "hindi": "तो (toh) / (unmarked)",
        "korean": "은 / 는 (eun / neun)",
        "tamil": "தனிக்குறி இல்லை (unmarked)",
        "spanish": "(sujeto / nominativo)",
        "kannada": "ಆದರೆ (aadare) / (unmarked)",
        "malayalam": "ആകട്ടെ (aakatte) / (unmarked)",
        "examples": [
            {
                "ja": "私は学生です。",
                "ro": "Watashi wa gakusei desu.",
                "en": "I am a student.",
                "te": "నేను అయితే విద్యార్థిని (Nenu aithe vidyarthini).",
                "hi": "मैं तो छात्र हूँ (Main toh chhaatr hoon).",
                "ko": "나는 학생입니다 (Naneun haksaeng-imnida).",
                "ta": "நான் மாணவன் (Naan maanavan).",
                "es": "Yo soy estudiante.",
                "kn": "ನಾನು ವಿದ್ಯಾರ್ಥಿ (Naanu vidyarthi).",
                "ml": "ഞാൻ വിദ്യാർത്ഥിയാണ് (Njaan vidyarthiyaanu)."
            }
        ]
    },
    "ga": {
        "title": "が (ga)",
        "role": "Subject / Identifier",
        "english": "Subject marker (who/what does action, specific identifier)",
        "telugu": "కర్త (ముఖ్యంగా ఎవరని గుర్తించేటప్పుడు)",
        "hindi": "ने / कर्ता सूचक (विशेष पहचान)",
        "korean": "이 / 가 (i / ga)",
        "tamil": "எழுவாய் குறிப்பான்",
        "spanish": "(sujeto específico / identificador)",
        "kannada": "ಕರ್ತೃ ಸೂಚಕ (ಯಾರು/ಯಾವುದು)",
        "malayalam": "കർത്താവ് സൂചകം (ആര്/എന്ത്)",
        "examples": [
            {
                "ja": "誰が来ましたか。猫がいます。",
                "ro": "Dare ga kimashita ka. Neko ga imasu.",
                "en": "Who came? There is a cat.",
                "te": "ఎవరు వచ్చారు? పిల్లి ఉంది.",
                "hi": "कौन आया? बिल्ली है।",
                "ko": "누가 왔습니까? 고양이가 있습니다.",
                "ta": "யார் வந்தார்? பூனை இருக்கிறது.",
                "es": "¿Quién vino? Hay un gato.",
                "kn": "ಯಾರು ಬಂದರು? ಬೆಕ್ಕು ಇದೆ.",
                "ml": "ആരാണ് വന്നത്? പൂച്ചയുണ്ട്."
            }
        ]
    },
    "o": {
        "title": "を (o)",
        "role": "Direct Object Marker",
        "english": "(Marks receiving noun of the action)",
        "telugu": "ను / ని (nu / ni)",
        "hindi": "को (ko) / (unmarked)",
        "korean": "을 / 를 (eul / reul)",
        "tamil": "ஐ (ai)",
        "spanish": "(objeto directo)",
        "kannada": "ಅನ್ನು (annu)",
        "malayalam": "എ (e)",
        "examples": [
            {
                "ja": "本を読みます。",
                "ro": "Hon o yomimasu.",
                "en": "Read a book.",
                "te": "పుస్తకాన్ని చదువుతాను (Pustakaanni chaduvutaanu).",
                "hi": "किताब को पढ़ता हूँ (Kitaab ko padhta hoon).",
                "ko": "책을 읽습니다 (Chaegeul ilgseumnida).",
                "ta": "புத்தகத்தை படிக்கிறேன் (Puthagathai padikkiren).",
                "es": "Leo un libro.",
                "kn": "ಪುಸ್ತಕವನ್ನು ಓದುತ್ತೇನೆ (Pustakavannu oduttene).",
                "ml": "പുസ്തകം വായിക്കുന്നു (Pusthakam vaayikkunnu)."
            }
        ]
    },
    "ni": {
        "title": "に (ni)",
        "role": "Destination & Time Marker",
        "english": "To / At / On / Indirect Object",
        "telugu": "కి / కు (ki / ku)",
        "hindi": "को / में (ko / mein)",
        "korean": "에 / 에게 (e / ege)",
        "tamil": "க்கு (ku)",
        "spanish": "a / en",
        "kannada": "ಇಗೆ / ಕ್ಕೆ (ige / kke)",
        "malayalam": "ക്ക് / ലേക്ക് (kku / lekku)",
        "examples": [
            {
                "ja": "東京に行きます。七時に起きます。",
                "ro": "Toukyou ni ikimasu. Shichiji ni okimasu.",
                "en": "Go to Tokyo. Wake up at 7:00.",
                "te": "టోక్యోకు వెళ్తాను. ఏడు గంటలకు లేస్తాను.",
                "hi": "टोक्यो को जाता हूँ। सात बजे उठता हूँ।",
                "ko": "도쿄에 갑니다. 7시에 일어납니다.",
                "ta": "டோக்கியோவுக்கு போகிறேன். 7 மணிக்கு எழுகிறேன்.",
                "es": "Voy a Tokio. Me despierto a las 7:00.",
                "kn": "ಟೋಕಿಯೋಗೆ ಹೋಗುತ್ತೇನೆ. ಏಳು ಗಂಟೆಗೆ ಏಳುತ್ತೇನೆ.",
                "ml": "ടോക്കിയോയിലേക്ക് പോകുന്നു. ഏഴ് മണിക്ക് ഉണരുന്നു."
            }
        ]
    },
    "de": {
        "title": "で (de)",
        "role": "Instrument / Location of Action",
        "english": "With / At / By / In",
        "telugu": "తో (tho) / లో (lo)",
        "hindi": "से (se) / में (mein)",
        "korean": "로 (ro) / 에서 (eseo)",
        "tamil": "ஆல் (aal) / இல் (il)",
        "spanish": "con / en",
        "kannada": "ಇಂದ / ಅಲ್ಲಿ (inda / alli)",
        "malayalam": "ആൽ / ഇൽ (aal / il)",
        "examples": [
            {
                "ja": "ペンで書きます。レストランで食べます。",
                "ro": "Pen de kakimasu. Resutoran de tabemasu.",
                "en": "Write with a pen. Eat at a restaurant.",
                "te": "పెన్నుతో రాస్తాను. రెస్టారెంట్‌లో తింటాను.",
                "hi": "पेन से लिखता हूँ। रेस्टोरेंट में खाता हूँ।",
                "ko": "펜으로 씁니다. 식당에서 먹습니다.",
                "ta": "பேனாவால் எழுதுகிறேன். உணவகத்தில் சாப்பிடுகிறேன்.",
                "es": "Escribo con bolígrafo. Como en el restaurante.",
                "kn": "ಪೆನ್ನಿನಿಂದ ಬರೆಯುತ್ತೇನೆ. ರೆಸ್ಟೋರೆಂಟ್‌ನಲ್ಲಿ ತಿನ್ನುತ್ತೇನೆ.",
                "ml": "പേന കൊണ്ട് എഴുതുന്നു. റെസ്റ്റോറന്റിൽ കഴിക്കുന്നു."
            }
        ]
    },
    "no": {
        "title": "の (no)",
        "role": "Possessive & Modifier",
        "english": "Of / 's / Modifier connector",
        "telugu": "యొక్క (yokka) / సంబంధిత",
        "hindi": "का / की / के (ka / ki / ke)",
        "korean": "의 (ui)",
        "tamil": "உடைய (udaiya)",
        "spanish": "de",
        "kannada": "ಅ (a) / ದ (da)",
        "malayalam": "ന്റെ (nte)",
        "examples": [
            {
                "ja": "私の本。日本語の先生。",
                "ro": "Watashi no hon. Nihongo no sensei.",
                "en": "My book. Japanese teacher.",
                "te": "నా యొక్క పుస్తకం. జపనీస్ ఉపాధ్యాయుడు.",
                "hi": "मेरी किताब। जापानी के शिक्षक।",
                "ko": "나의 책. 일본어 선생님.",
                "ta": "என்னுடைய புத்தகம். ஜப்பானிய ஆசிரியர்.",
                "es": "Mi libro. Profesor de japonés.",
                "kn": "ನನ್ನ ಪುಸ್ತಕ. ಜಪಾನಿ ಭಾಷೆಯ ಶಿಕ್ಷಕ.",
                "ml": "എന്റെ പുസ്തകം. ജാപ്പനീസ് അധ്യാപകൻ."
            }
        ]
    },
    "to": {
        "title": "と (to)",
        "role": "Accompaniment / And",
        "english": "With / And (exhaustive list)",
        "telugu": "తో (tho) / మరియు (mariyu)",
        "hindi": "के साथ (ke sath) / और (aur)",
        "korean": "와 / 과 (wa / gwa) / 하고 (hago)",
        "tamil": "உடன் (udan) / மற்றும் (matrum)",
        "spanish": "con / y",
        "kannada": "ಜೊತೆಗೆ (jotege) / ಮತ್ತು (mattu)",
        "malayalam": "കൂടെ (koode) / ഉം (um)",
        "examples": [
            {
                "ja": "友達と行きます。パンと卵。",
                "ro": "Tomodachi to ikimasu. Pan to tamago.",
                "en": "Go with a friend. Bread and eggs.",
                "te": "స్నేహితుడితో వెళ్తాను. రొట్టె మరియు గుడ్లు.",
                "hi": "दोस्त के साथ जाता हूँ। रोटी और अंडे।",
                "ko": "친구와 갑니다. 빵과 계란.",
                "ta": "நண்பனுடன் போகிறேன். ரொட்டியும் முட்டையும்.",
                "es": "Voy con un amigo. Pan y huevos.",
                "kn": "ಸ್ನೇಹಿತನ ಜೊತೆ ಹೋಗುತ್ತೇನೆ. ಬ್ರೆಡ್ ಮತ್ತು ಮೊಟ್ಟೆ.",
                "ml": "സുഹൃത്തിന്റെ കൂടെ പോകുന്നു. ബ്രെഡും മുട്ടയും."
            }
        ]
    },
    "kara": {
        "title": "から (kara)",
        "role": "Source Marker (From / Because)",
        "english": "From / Since / Because",
        "telugu": "నుండి / నుంచి (nundi / nunchi) / కాబట్టి",
        "hindi": "से (se) / क्योंकि",
        "korean": "에서 (eseo) / 부터 (buteo) / 때문에",
        "tamil": "இருந்து (irundhu) / அதனால்",
        "spanish": "desde / de / porque",
        "kannada": "ಇಂದ (inda) / ಆದ್ದರಿಂದ",
        "malayalam": "നിന്ന് (ninnu) / ആയതുകൊണ്ട്",
        "examples": [
            {
                "ja": "家から来ました。暑いから窓を開けます。",
                "ro": "Ie kara kimashita. Atsui kara mado o akemasu.",
                "en": "Came from home. Open the window because it is hot.",
                "te": "ఇంటి నుండి వచ్చాను. వేడిగా ఉంది కాబట్టి కిటికీ తెరుస్తాను.",
                "hi": "घर से आया हूँ। गर्मी है इसलिए खिड़की खोलता हूँ।",
                "ko": "집에서 왔습니다. 더우니까 창문을 엽니다.",
                "ta": "வீட்டிலிருந்து வந்தேன். சூடாக இருப்பதால் ஜன்னலைத் திறக்கிறேன்.",
                "es": "Vine de casa. Abro la ventana porque hace calor.",
                "kn": "ಮನೆಯಿಂದ ಬಂದೆ. ಬಿಸಿಯಾಗಿರುವುದರಿಂದ ಕಿಟಕಿ ತೆರೆಯುತ್ತೇನೆ.",
                "ml": "വീട്ടിൽ നിന്ന് വന്നു. ചൂടായതുകൊണ്ട് ജനൽ തുറക്കുന്നു."
            }
        ]
    },
    "made": {
        "title": "まで (made)",
        "role": "Limit Marker (Until)",
        "english": "Until / Up to / As far as",
        "telugu": "వరకు (varaku)",
        "hindi": "तक (tak)",
        "korean": "까지 (kkaji)",
        "tamil": "வரை (varai)",
        "spanish": "hasta",
        "kannada": "ವರೆಗೆ (varege)",
        "malayalam": "വരെ (vare)",
        "examples": [
            {
                "ja": "明日まで待ちます。駅まで歩きます。",
                "ro": "Ashita made machimasu. Eki made arukimasu.",
                "en": "Wait until tomorrow. Walk as far as the station.",
                "te": "రేపటి వరకు వేచి ఉంటాను. స్టేషన్ వరకు నడుస్తాను.",
                "hi": "कल तक इंतज़ार करूँगा। स्टेशन तक पैदल जाता हूँ।",
                "ko": "내일까지 기다립니다. 역까지 걷습니다.",
                "ta": "நாளை வரை காத்திருப்பேன். நிலையம் வரை நடக்கிறேன்.",
                "es": "Esperaré hasta mañana. Camino hasta la estación.",
                "kn": "ನಾಳೆಯವರೆಗೆ ಕಾಯುತ್ತೇನೆ. ನಿಲ್ದಾಣದವರೆಗೆ ನಡೆಯುತ್ತೇನೆ.",
                "ml": "നാളെ വരെ കാത്തിരിക്കും. സ്റ്റേഷൻ വരെ നടക്കുന്നു."
            }
        ]
    },
    "mo": {
        "title": "も (mo)",
        "role": "Inclusion (Also / Too)",
        "english": "Also / Too / Even",
        "telugu": "కూడా (kooda)",
        "hindi": "भी (bhee)",
        "korean": "도 (do)",
        "tamil": "உம் (um - கூட)",
        "spanish": "también / tampoco",
        "kannada": "ಕೂಡ (kooda)",
        "malayalam": "ഉം (um - കൂടെ)",
        "examples": [
            {
                "ja": "私も行きます。これも美味しいです。",
                "ro": "Watashi mo ikimasu. Kore mo oishii desu.",
                "en": "I will also go. This is delicious too.",
                "te": "నేను కూడా వెళ్తాను. ఇది కూడా రుచిగా ఉంది.",
                "hi": "मैं भी जाऊँगा। यह भी स्वादिष्ट है।",
                "ko": "나도 갑니다. 이것도 맛있습니다.",
                "ta": "நானும் போகிறேன். இதுவும் சுவையாக உள்ளது.",
                "es": "Yo también voy. Esto también es delicioso.",
                "kn": "ನಾನೂ ಹೋಗುತ್ತೇನೆ. ಇದೂ ರುಚಿಯಾಗಿದೆ.",
                "ml": "ഞാനും പോകും. ഇതും രുചികരമാണ്."
            }
        ]
    },
    "he": {
        "title": "へ (e/he)",
        "role": "Directional Marker (Towards)",
        "english": "Towards / Heading to",
        "telugu": "వైపు (vaipu) / దిశగా",
        "hindi": "की ओर (kee or)",
        "korean": "로 / 으로 (ro / euro)",
        "tamil": "நோக்கி (nokki)",
        "spanish": "hacia / rumbo a",
        "kannada": "ಕಡೆಗೆ (kadege)",
        "malayalam": "ലേക്ക് (lekku / nere)",
        "examples": [
            {
                "ja": "日本へ行きます。",
                "ro": "Nihon e ikimasu.",
                "en": "Heading towards Japan.",
                "te": "జపాన్ వైపు వెళ్తున్నాను.",
                "hi": "जापान की ओर जा रहा हूँ।",
                "ko": "일본으로 갑니다.",
                "ta": "ஜப்பான் நோக்கிப் போகிறேன்.",
                "es": "Voy hacia Japón.",
                "kn": "ಜಪಾನ್ ಕಡೆಗೆ ಹೋಗುತ್ತಿದ್ದೇನೆ.",
                "ml": "ജപ്പാനിലേക്ക് പോകുന്നു."
            }
        ]
    },
    "yori": {
        "title": "より (yori)",
        "role": "Comparison Marker (Than)",
        "english": "Than / Rather than",
        "telugu": "కంటే (kante)",
        "hindi": "से (se - तुलना में)",
        "korean": "보다 (boda)",
        "tamil": "விட (vida)",
        "spanish": "más que / que",
        "kannada": "ಕಿಂತ (kinta)",
        "malayalam": "ക്കാൾ (kkaal)",
        "examples": [
            {
                "ja": "猫は犬より小さいです。",
                "ro": "Neko wa inu yori chiisai desu.",
                "en": "Cats are smaller than dogs.",
                "te": "పిల్లి కుక్క కంటే చిన్నది.",
                "hi": "बिल्ली कुत्ते से छोटी है।",
                "ko": "고양이는 개보다 작습니다.",
                "ta": "பூனை நாயை விட சிறியது.",
                "es": "El gato es más pequeño que el perro.",
                "kn": "ಬೆಕ್ಕು ನಾಯಿಗಿಂತ ಚಿಕ್ಕದಾಗಿದೆ.",
                "ml": "പൂച്ച നായയെക്കാൾ ചെറുതാണ്."
            }
        ]
    },
    "ka": {
        "title": "か (ka)",
        "role": "Question / Choice Marker",
        "english": "Question marker (?) / Or",
        "telugu": "ప్రశ్నార్థకం (?) / లేదా (leda)",
        "hindi": "क्या (?) / या (yaa)",
        "korean": "까 (?) / 거나 (geona)",
        "tamil": "ஆ (?) / அல்லது (alladhu)",
        "spanish": "¿? / o (disyunción)",
        "kannada": "ಪ್ರಶ್ನಾರ್ಥಕ (?) / ಅಥವಾ (athava)",
        "malayalam": "ചോദ്യം (?) / അല്ലെങ്കിൽ (allenkil)",
        "examples": [
            {
                "ja": "これですか。お茶かコーヒー。",
                "ro": "Kore desu ka. Ocha ka koohii.",
                "en": "Is it this? Tea or coffee.",
                "te": "ఇదా? టీ లేదా కాఫీ.",
                "hi": "क्या यह है? चाय या कॉफ़ी।",
                "ko": "이것입니까? 차나 커피.",
                "ta": "இதுவா? தேநீர் அல்லது காபி.",
                "es": "¿Es esto? Té o café.",
                "kn": "ಇದಾ? ಚಹಾ ಅಥವಾ ಕಾಫಿ.",
                "ml": "ഇതാണോ? ചായ അല്ലെങ്കിൽ കാപ്പി."
            }
        ]
    },
    "ya": {
        "title": "や (ya)",
        "role": "Non-exhaustive Listing",
        "english": "And (such as... among other things)",
        "telugu": "వంటివి (vantivi) / మొదలైనవి",
        "hindi": "और (आदि / जैसे कि)",
        "korean": "랑 / 이랑 (rang / irang) / 등",
        "tamil": "போன்றவை (pondravai)",
        "spanish": "y (entre otras cosas)",
        "kannada": "ಮುಂತಾದವು (muntaadavu)",
        "malayalam": "തുടങ്ങിയവ (thudangiyava)",
        "examples": [
            {
                "ja": "本やペンを買いました。",
                "ro": "Hon ya pen o kaimashita.",
                "en": "Bought books, pens, and such.",
                "te": "పుస్తకాలు, పెన్నులు వంటివి కొన్నాను.",
                "hi": "किताबें और पेन जैसी चीज़ें खरीदीं।",
                "ko": "책이랑 펜 등을 샀습니다.",
                "ta": "புத்தகங்கள், பேனாக்கள் போன்றவற்றை வாங்கினேன்.",
                "es": "Compré libros, bolígrafos, etc.",
                "kn": "ಪುಸ್ತಕಗಳು, ಪೆನ್ನುಗಳಂತಹವುಗಳನ್ನು ಖರೀದಿಸಿದೆ.",
                "ml": "പുസ്തകങ്ങളും പേനകളും തുടങ്ങിയവ വാങ്ങി."
            }
        ]
    },
    "ne": {
        "title": "ね (ne)",
        "role": "Confirmation / Agreement Tag",
        "english": "Isn't it? / Right?",
        "telugu": "కదా? (kadaa?)",
        "hindi": "है ना? (hai na?)",
        "korean": "네요 (neyo) / 지요 (jiyo)",
        "tamil": "அல்லவா? (allavaa?) / தானே?",
        "spanish": "¿verdad? / ¿no?",
        "kannada": "ಅಲ್ವಾ? (alvaa?)",
        "malayalam": "അല്ലേ? (alle?)",
        "examples": [
            {
                "ja": "今日は暑いですね。",
                "ro": "Kyou wa atsui desu ne.",
                "en": "It is hot today, isn't it?",
                "te": "ఈ రోజు వేడిగా ఉంది కదా?",
                "hi": "आज गर्मी है, है ना?",
                "ko": "오늘 덥네요, 그렇죠?",
                "ta": "இன்று சூடாக இருக்கிறது, அல்லவா?",
                "es": "Hoy hace calor, ¿verdad?",
                "kn": "ಇವತ್ತು ಬಿಸಿಯಾಗಿದೆ, ಅಲ್ವಾ?",
                "ml": "ഇന്ന് ചൂടാണ്, അല്ലേ?"
            }
        ]
    },
    "yo": {
        "title": "よ (yo)",
        "role": "Assertion / Informing Marker",
        "english": "You know! / I assure you (new info)",
        "telugu": "తెలుసా! / సుమా!",
        "hindi": "बता दूँ! / सुनिए!",
        "korean": "거든요 (geodeunyo) / 요 (yo)",
        "tamil": "தெரியுமா! / பாருங்கள்!",
        "spanish": "¡te aseguro! / ¡sabes!",
        "kannada": "ಗೊತ್ತಾ! / ತಿಳಿಯಿರಿ!",
        "malayalam": "അറിയാമോ! / കേട്ടോ!",
        "examples": [
            {
                "ja": "この映画は面白いですよ。",
                "ro": "Kono eiga wa omoshiroi desu yo.",
                "en": "This movie is really interesting, you know!",
                "te": "ఈ సినిమా చాలా బాగుంది తెలుసా!",
                "hi": "यह फिल्म बहुत दिलचस्प है, बता दूँ!",
                "ko": "이 영화 정말 재미있어요!",
                "ta": "இந்த படம் மிகவும் சுவாரஸ்யமாக இருக்கிறது, தெரியுமா!",
                "es": "¡Esta película es muy interesante, sabes!",
                "kn": "ಈ ಚಲನಚಿತ್ರ ತುಂಬಾ ಆಸಕ್ತಿದಾಯಕವಾಗಿದೆ, ಗೊತ್ತಾ!",
                "ml": "ഈ സിനിമ വളരെ രസകരമാണ്, കേട്ടോ!"
            }
        ]
    },
    "shi": {
        "title": "し (shi)",
        "role": "Listing Reasons / Features",
        "english": "And what's more / Not only that, but...",
        "telugu": "అంతేకాక / మరియు పైగా",
        "hindi": "और तो और / इसके अलावा",
        "korean": "고 (go) / 데다가 (dedaga)",
        "tamil": "மட்டுமல்லாமல் / மேலும்",
        "spanish": "y además / encima",
        "kannada": "ಅಲ್ಲದೆ / ಮತ್ತು ಮೇಲಾಗಿ",
        "malayalam": "കൂടാതെ / മാത്രമല്ല",
        "examples": [
            {
                "ja": "美味しかったし、安かったです。",
                "ro": "Oishikatta shi, yasukatta desu.",
                "en": "It was delicious, and what's more, it was cheap.",
                "te": "రుచిగా ఉంది, అంతేకాక చవకగా కూడా ఉంది.",
                "hi": "स्वादिष्ट भी था, और सस्ता भी था।",
                "ko": "맛있었고, 게다가 쌌습니다.",
                "ta": "சுவையாகவும் இருந்தது, மேலும் மலிவாகவும் இருந்தது.",
                "es": "Estaba delicioso y, además, era barato.",
                "kn": "ರುಚಿಯಾಗಿತ್ತು, ಮತ್ತು ಅಗ್ಗವೂ ಆಗಿತ್ತು.",
                "ml": "രുചികരമായിരുന്നു, മാത്രമല്ല വിലക്കുറവുള്ളതുമായിരുന്നു."
            }
        ]
    },
    "noni": {
        "title": "のに (noni)",
        "role": "Contrast / Defied Expectation",
        "english": "Even though / Despite / Although",
        "telugu": "అయినప్పటికీ (ainappatiki)",
        "hindi": "होने के बावजूद (hone ke baavajood)",
        "korean": "는데도 (neundedo)",
        "tamil": "இருந்தபோதிலும் (irundhapodhylum)",
        "spanish": "a pesar de que / aunque",
        "kannada": "ಆದಾಗ್ಯೂ (aadaagyu)",
        "malayalam": "എന്നിട്ടും (ennittum)",
        "examples": [
            {
                "ja": "勉強したのに、不合格でした。",
                "ro": "Benkyou shita noni, fugoukaku deshita.",
                "en": "Even though I studied, I failed.",
                "te": "చదివినప్పటికీ, ఫెయిల్ అయ్యాను.",
                "hi": "पढ़ाई करने के बावजूद, अनुत्तीर्ण हो गया।",
                "ko": "공부했는데도 불합격했습니다.",
                "ta": "படித்தபோதிலும், தேர்ச்சி பெறவில்லை.",
                "es": "A pesar de haber estudiado, reprobé.",
                "kn": "ಓದಿದ್ದರೂ ಕೂಡ, ಅನುತ್ತೀರ್ಣನಾದೆ.",
                "ml": "പഠിച്ചിട്ടും പരാജയപ്പെട്ടു."
            }
        ]
    },
    "node": {
        "title": "ので (node)",
        "role": "Objective Reason (Since/Because)",
        "english": "Because / Since / As (polite & objective)",
        "telugu": "కారణంగా / కాబట్టి (మర్యాదపూర్వకంగా)",
        "hindi": "क्योंकि / के कारण (विनम्र)",
        "korean": "기 때문에 (gi ttaemune) / 으므로 (eumeuro)",
        "tamil": "காரணத்தினால் / படியால்",
        "spanish": "puesto que / dado que",
        "kannada": "ಕಾರಣದಿಂದ / ಆದ್ದರಿಂದ (ವಿನಮ್ರ)",
        "malayalam": "കാരണം / ആയതിനാൽ",
        "examples": [
            {
                "ja": "雨が降っているので、傘を持って行きます。",
                "ro": "Ame ga futte iru node, kasa o motte ikimasu.",
                "en": "Since it is raining, I will take an umbrella.",
                "te": "వర్షం పడుతున్న కారణంగా, గొడుగు తీసుకెళ్తాను.",
                "hi": "बारिश हो रही है इसलिए छाता ले जा रहा हूँ।",
                "ko": "비가 오고 있기 때문에 우산을 가지고 갑니다.",
                "ta": "மழை பெய்வதால், குடையை எடுத்துச் செல்கிறேன்.",
                "es": "Dado que está lloviendo, llevaré un paraguas.",
                "kn": "ಮಳೆ ಬರುತ್ತಿರುವುದರಿಂದ, ಛತ್ರಿ ತೆಗೆದುಕೊಂಡು ಹೋಗುತ್ತೇನೆ.",
                "ml": "മഴ പെയ്യുന്നതിനാൽ, കുട എടുക്കുന്നു."
            }
        ]
    },
    "tara_ba": {
        "title": "たら / ば (tara / ba)",
        "role": "Conditionals (If / When)",
        "english": "If / When / In case",
        "telugu": "ఒకవేళ... అయితే (okavela... aithe)",
        "hindi": "अगर... तो (agar... toh)",
        "korean": "면 / 으면 (myeon / eumyeon)",
        "tamil": "ஆல் / என்றால் (aal / endraal)",
        "spanish": "si / cuando (condicional)",
        "kannada": "ಆದರೆ / ಸಂದರ್ಭದಲ್ಲಿ (aadare)",
        "malayalam": "എങ്കിൽ (enkil)",
        "examples": [
            {
                "ja": "安かったら、買います。",
                "ro": "Yasukattara, kaimasu.",
                "en": "If it is cheap, I will buy it.",
                "te": "చవకగా ఉంటే, కొంటాను.",
                "hi": "अगर सस्ता होगा, तो खरीदूँगा।",
                "ko": "싸면 사겠습니다.",
                "ta": "மலிவாக இருந்தால், வாங்குவேன்.",
                "es": "Si es barato, lo compro.",
                "kn": "ಅಗ್ಗವಾಗಿದ್ದರೆ, ಖರೀದಿಸುತ್ತೇನೆ.",
                "ml": "വിലക്കുറവാണെങ്കിൽ, വാങ്ങും."
            }
        ]
    }
};

// --- EXTENDED LEVEL DATABASES (N5 TO N1) ---
const QUEST_DATABASE = {
    N5: [
        {"q":"Which particle marks the Direction of movement (towards)?","answer":"へ","options":["へ","を","で","から"],"style":"mc","type":"Particle"},
        {"q":"Which particle marks Inclusion (meaning \"also\" or \"too\")?","answer":"も","options":["も","は","が","と"],"style":"mc","type":"Particle"},
        {"q":"Which particle marks the specific Subject / Identifier?","answer":"が","options":["が","は","を","に"],"style":"mc","type":"Particle"},
        {"q":"Which particle marks a Question at the end of a sentence?","answer":"か","options":["か","ね","よ","の"],"style":"mc","type":"Particle"},
        {"q":"Which sentence ending seeks agreement (\"isn't it?\")?","answer":"ね","options":["ね","よ","か","さ"],"style":"mc","type":"Particle"},
        {"q":"Which sentence ending provides new information (\"you know!\")?","answer":"よ","options":["よ","ね","わ","ぞ"],"style":"mc","type":"Particle"},
        {"q":"How do you say \"Please give me this\" in Japanese?","answer":"これをください","options":["これをください","これはいかが","これはいくら","これをみます"],"style":"mc","type":"Phrase"},
        {"q":"How do you say \"Good night\" politely?","answer":"おやすみなさい","options":["おやすみなさい","おはよう","さようなら","こんにちは"],"style":"mc","type":"Phrase"},
        {"q":"How do you say \"Thank you very much\"?","answer":"ありがとうございます","options":["ありがとうございます","すみません","ごめんなさい","いただきます"],"style":"mc","type":"Phrase"},
        {"q":"What does \"やすみ\" (yasumi) mean?","answer":"Rest / Holiday","options":["Rest / Holiday","Work","School","Study"],"style":"mc","type":"Vocabulary"},
        {"q":"What does \"ともだち\" (tomodachi) mean?","answer":"Friend","options":["Friend","Teacher","Doctor","Family"],"style":"mc","type":"Vocabulary"},
        {"q":"What does \"くるま\" (kuruma) mean?","answer":"Car","options":["Car","Train","Bicycle","Airplane"],"style":"mc","type":"Vocabulary"},
        {"q":"What does \"えき\" (eki) mean?","answer":"Station","options":["Station","Airport","Store","Park"],"style":"mc","type":"Vocabulary"},
        {"q":"What is \"Tuesday\" in Japanese?","answer":"かようび","options":["かようび","すいようび","もくようび","きんようび"],"style":"mc","type":"Vocabulary"},
        {"q":"What is \"Wednesday\" in Japanese?","answer":"すいようび","options":["すいようび","かようび","もくようび","どようび"],"style":"mc","type":"Vocabulary"},
        {"q":"What is \"Thursday\" in Japanese?","answer":"もくようび","options":["もくようび","きんようび","どようび","げつようび"],"style":"mc","type":"Vocabulary"},
        {"q":"What is \"Friday\" in Japanese?","answer":"きんようび","options":["きんようび","もくようび","かようび","にちようび"],"style":"mc","type":"Vocabulary"},
        {"q":"What is \"Saturday\" in Japanese?","answer":"どようび","options":["どようび","にちようび","きんようび","げつようび"],"style":"mc","type":"Vocabulary"},
        {"q":"What does \"おおきい\" (ookii) mean?","answer":"Big","options":["Big","Small","Expensive","Cheap"],"style":"mc","type":"Vocabulary"},
        {"q":"What does \"ちいさい\" (chiisai) mean?","answer":"Small","options":["Small","Big","Fast","Slow"],"style":"mc","type":"Vocabulary"},
        {"q":"What does \"たかい\" (takai) mean?","answer":"High / Expensive","options":["High / Expensive","Low / Cheap","Delicious","Quiet"],"style":"mc","type":"Vocabulary"},
        {"q":"What does \"やすい\" (yasui) mean?","answer":"Cheap / Inexpensive","options":["Cheap / Inexpensive","Expensive","Difficult","Easy"],"style":"mc","type":"Vocabulary"},
        {"q":"What does \"あたらしい\" (atarashii) mean?","answer":"New","options":["New","Old","Good","Bad"],"style":"mc","type":"Vocabulary"},
        {"q":"What does \"ふるい\" (furui) mean?","answer":"Old (for things)","options":["Old (for things)","New","Young","Clean"],"style":"mc","type":"Vocabulary"},
        {"q":"What does \"みる\" (miru) mean?","answer":"To see / To watch","options":["To see / To watch","To hear","To speak","To read"],"style":"mc","type":"Verb"},
        {"q":"What does \"きく\" (kiku) mean?","answer":"To listen / To ask","options":["To listen / To ask","To speak","To write","To read"],"style":"mc","type":"Verb"},
        {"q":"What does \"はなす\" (hanasu) mean?","answer":"To speak","options":["To speak","To listen","To walk","To run"],"style":"mc","type":"Verb"},
        {"q":"What does \"かく\" (kaku) mean?","answer":"To write","options":["To write","To read","To buy","To sell"],"style":"mc","type":"Verb"},
        {"q":"What does \"かう\" (kau) mean?","answer":"To buy","options":["To buy","To sell","To give","To receive"],"style":"mc","type":"Verb"},
        {"q":"What does \"くる\" (kuru) mean?","answer":"To come","options":["To come","To go","To return","To leave"],"style":"mc","type":"Verb"},
        {"q":"Meaning of the Kanji: 木?","answer":"Tree / Wood","options":["Tree / Wood","Water","Fire","Earth"],"style":"mc","type":"Kanji"},
        {"q":"Meaning of the Kanji: 金?","answer":"Gold / Money","options":["Gold / Money","Silver","Iron","Stone"],"style":"mc","type":"Kanji"},
        {"q":"Meaning of the Kanji: 土?","answer":"Soil / Earth","options":["Soil / Earth","Fire","Water","Sky"],"style":"mc","type":"Kanji"},
        {"q":"Meaning of the Kanji: 川?","answer":"River","options":["River","Mountain","Sea","Rain"],"style":"mc","type":"Kanji"},
        {"q":"How do you say \"Please speak slowly\"?","answer":"ゆっくり話してください","options":["ゆっくり話してください","早く話してください","もう一度言って","書いてください"],"style":"mc","type":"Phrase"},
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
        {"q":"What does \"~てしまう\" express?","answer":"Completed action / Regret","options":["Completed action / Regret","Doing in advance","Trying something out","Giving advice"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~ておく\" express?","answer":"Doing in preparation / Advance","options":["Doing in preparation / Advance","Regret","Prohibition","Simultaneous actions"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~てみる\" express?","answer":"Try doing something to see","options":["Try doing something to see","Must do","Cannot do","Already done"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~すぎる\" (sugiru) mean when attached to a verb stem?","answer":"To do too much / Excessively","options":["To do too much / Excessively","To start doing","To finish doing","To dislike doing"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~やすい\" (yasui) mean after a verb stem?","answer":"Easy to do","options":["Easy to do","Hard to do","Want to do","Cheap to do"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~にくい\" (nikui) mean after a verb stem?","answer":"Difficult / Hard to do","options":["Difficult / Hard to do","Easy to do","Fun to do","Boring to do"],"style":"mc","type":"Grammar"},
        {"q":"Which particle indicates a non-exhaustive list of items (\"such as X and Y\")?","answer":"や","options":["や","と","も","に"],"style":"mc","type":"Particle"},
        {"q":"Which particle marks the agent in a passive sentence (\"by someone\")?","answer":"に","options":["に","で","を","は"],"style":"mc","type":"Particle"},
        {"q":"What is the plain form of \"ありません\"?","answer":"ない","options":["ない","ある","なかった","ず"],"style":"mc","type":"Verb Conjugation"},
        {"q":"What is the plain past of \"行く\" (iku)?","answer":"いった","options":["いった","いいた","いきた","いくだ"],"style":"mc","type":"Verb Conjugation"},
        {"q":"What is the volitional form (\"Let's do\") of \"食べる\"?","answer":"たべよう","options":["たべよう","たべたい","たべた","たべる"],"style":"mc","type":"Verb Conjugation"},
        {"q":"What is the volitional form (\"Let's go\") of \"行く\"?","answer":"いこう","options":["いこう","いきたい","いこうか","いきましょう"],"style":"mc","type":"Verb Conjugation"},
        {"q":"What does \"~ながら\" (nagara) express?","answer":"Doing two actions at the same time","options":["Doing two actions at the same time","Doing one after another","Before doing","Without doing"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~ないでください\" mean?","answer":"Please do not do","options":["Please do not do","Please do","You must do","May do"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~なければなりません\" mean?","answer":"Must do / Have to do","options":["Must do / Have to do","Do not have to do","Should not do","May do"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~なくてもいいです\" mean?","answer":"Do not have to do (optional)","options":["Do not have to do (optional)","Must do","Should do","Cannot do"],"style":"mc","type":"Grammar"},
        {"q":"What is the meaning of \"案内する\" (annai suru)?","answer":"To guide / To show around","options":["To guide / To show around","To explain","To invite","To clean"],"style":"mc","type":"Vocabulary"},
        {"q":"What is the meaning of \"約束\" (yakusoku)?","answer":"Promise / Appointment","options":["Promise / Appointment","Rule","Contract","Meeting"],"style":"mc","type":"Vocabulary"},
        {"q":"What is the meaning of \"準備\" (junbi)?","answer":"Preparation","options":["Preparation","Repair","Cleaning","Study"],"style":"mc","type":"Vocabulary"},
        {"q":"What is the meaning of \"故障\" (koshou)?","answer":"Breakdown / Out of order","options":["Breakdown / Out of order","Accident","Injury","Repair"],"style":"mc","type":"Vocabulary"},
        {"q":"What is the meaning of \"遠慮\" (enryo)?","answer":"Restraint / Holding back","options":["Restraint / Holding back","Refusal","Politeness","Worry"],"style":"mc","type":"Vocabulary"},
        {"q":"Which is the intransitive partner of \"消す\" (kesu - to turn off)?","answer":"消える (kieru)","options":["消える (kieru)","消される","消しる","消す"],"style":"mc","type":"Grammar"},
        {"q":"Which is the intransitive partner of \"閉める\" (shimeru - to close)?","answer":"閉まる (shimaru)","options":["閉まる (shimaru)","閉められる","閉じる","閉き"],"style":"mc","type":"Grammar"},
        {"q":"Which is the transitive partner of \"壊れる\" (kowareru - to break)?","answer":"壊す (kowasu)","options":["壊す (kowasu)","壊れる","壊される","壊させる"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~方\" (kata) after a verb stem mean?","answer":"Way / Method of doing","options":["Way / Method of doing","Person who does","Time of doing","Reason for doing"],"style":"mc","type":"Grammar"},
        {"q":"What does \"食べ方\" (tabekata) mean?","answer":"Way of eating / Manner of eating","options":["Way of eating / Manner of eating","Easy to eat","Before eating","Want to eat"],"style":"mc","type":"Grammar"},
        {"q":"Meaning of the Kanji: 会議?","answer":"Meeting / Conference","options":["Meeting / Conference","Company","Conversation","Class"],"style":"mc","type":"Kanji"},
        {"q":"Meaning of the Kanji: 宿題?","answer":"Homework","options":["Homework","Exam","Lesson","Question"],"style":"mc","type":"Kanji"},
        {"q":"Meaning of the Kanji: 試験?","answer":"Exam / Test","options":["Exam / Test","Experiment","Experience","Interview"],"style":"mc","type":"Kanji"},
        {"q":"Meaning of the Kanji: 経験?","answer":"Experience","options":["Experience","Experiment","Examination","Exploration"],"style":"mc","type":"Kanji"},
        {"q":"Meaning of the Kanji: 危険?","answer":"Danger / Hazardous","options":["Danger / Hazardous","Safety","Difficulty","Emergency"],"style":"mc","type":"Kanji"},
        {"q":"Meaning of the Kanji: 安全?","answer":"Safety / Secure","options":["Safety / Secure","Danger","Quiet","Healthy"],"style":"mc","type":"Kanji"},
        {"q":"What does \"~予定\" (yotei) mean?","answer":"Plan / Schedule","options":["Plan / Schedule","Promise","Memory","Goal"],"style":"mc","type":"Vocabulary"},
        {"q":"What does \"~つもり\" (tsumori) express?","answer":"Intention to do","options":["Intention to do","Regret","Ability","Obligation"],"style":"mc","type":"Grammar"},
        {"q":"What does \"間に合う\" (maniau) mean?","answer":"To be in time for","options":["To be in time for","To meet someone","To be late","To run fast"],"style":"mc","type":"Verb"},
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
        {"q":"What does \"~わけだ\" (wake da) express?","answer":"Naturally / That is why (logical conclusion)","options":["Naturally / That is why (logical conclusion)","It is impossible","I wonder why","I have no reason"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~わけではない\" express?","answer":"It does not mean that... / Not necessarily","options":["It does not mean that... / Not necessarily","It is totally impossible","Certainly is","Must not do"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~わけにはいかない\" express?","answer":"Cannot do due to social / moral reasons","options":["Cannot do due to social / moral reasons","Lack the physical ability","Do not want to","No permission"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~ものだ\" (mono da) express when used with past tense?","answer":"Nostalgic past habit (used to do)","options":["Nostalgic past habit (used to do)","General truth","Social duty","Recent occurrence"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~ものの\" (mono no) express?","answer":"Although / Even though (concession)","options":["Although / Even though (concession)","Because","In order to","As soon as"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~ものだから\" (mono dakara) express?","answer":"Because / Reason for an excuse in speech","options":["Because / Reason for an excuse in speech","Even though","In order to","Despite that"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~ことにする\" express?","answer":"Deciding to do (speaker's personal choice)","options":["Deciding to do (speaker's personal choice)","Decided by rules / others","Becoming able to do","Making an effort to do"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~ことになる\" express?","answer":"Has been decided by circumstances / others","options":["Has been decided by circumstances / others","Personal decision","Habitual effort","Desire to do"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~に違いない\" (ni chigainai) express?","answer":"Must be / No doubt that...","options":["Must be / No doubt that...","Might be","Cannot be","Is strange"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~はずだ\" (hazu da) express?","answer":"Should be / Expected to be","options":["Should be / Expected to be","Definitely not","Impossible","Wanted to be"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~うちに\" (uchi ni) express?","answer":"While in a certain state / Before state changes","options":["While in a certain state / Before state changes","After finishing","Because of","In order to"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~たびに\" (tabi ni) express?","answer":"Every time / Whenever","options":["Every time / Whenever","Occasionally","Only once","Almost never"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~を中心に\" (o chuushin ni) mean?","answer":"Centered around / Focused on","options":["Centered around / Focused on","Separated from","In contrast to","In place of"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~をはじめ\" (o hajime) mean?","answer":"Starting with / Above all","options":["Starting with / Above all","Ending with","Except for","Instead of"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~に対して\" (ni taishite) mean?","answer":"Towards / In contrast to","options":["Towards / In contrast to","Because of","In accordance with","Along with"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~にとって\" (ni totte) mean?","answer":"For / From the viewpoint of","options":["For / From the viewpoint of","Compared to","Because of","Instead of"],"style":"mc","type":"Grammar"},
        {"q":"What is the honorific (尊敬語) form of \"食べる\"?","answer":"召し上がる (meshiaagaru)","options":["召し上がる (meshiaagaru)","いただく","申す","参る"],"style":"mc","type":"Keigo"},
        {"q":"What is the humble (謙譲語) form of \"食べる\"?","answer":"いただく (itadaku)","options":["いただく (itadaku)","召し上がる","おっしゃる","ごらんになる"],"style":"mc","type":"Keigo"},
        {"q":"What is the honorific form of \"言う\" (to say)?","answer":"おっしゃる (ossharu)","options":["おっしゃる (ossharu)","申す (mousu)","まいる","いたす"],"style":"mc","type":"Keigo"},
        {"q":"What is the humble form of \"言う\" (to say)?","answer":"申す (mousu)","options":["申す (mousu)","おっしゃる","くださる","なさる"],"style":"mc","type":"Keigo"},
        {"q":"What is the honorific form of \"見る\" (to look)?","answer":"ご覧になる (goran ni naru)","options":["ご覧になる (goran ni naru)","拝見する","申す","参る"],"style":"mc","type":"Keigo"},
        {"q":"What is the humble form of \"見る\" (to look)?","answer":"拝見する (haiken suru)","options":["拝見する (haiken suru)","ご覧になる","伺う","お目にかかる"],"style":"mc","type":"Keigo"},
        {"q":"Meaning of the Kanji: 遠慮?","answer":"Restraint / Reserve / Holding back","options":["Restraint / Reserve / Holding back","Anger","Happiness","Sympathy"],"style":"mc","type":"Kanji"},
        {"q":"Meaning of the Kanji: 複雑?","answer":"Complex / Complicated","options":["Complex / Complicated","Simple","Easy","Quick"],"style":"mc","type":"Kanji"},
        {"q":"Meaning of the Kanji: 簡単?","answer":"Simple / Easy","options":["Simple / Easy","Complex","Rare","Ordinary"],"style":"mc","type":"Kanji"},
        {"q":"Meaning of the Kanji: 賛成?","answer":"Agreement / Approval","options":["Agreement / Approval","Opposition","Discussion","Voting"],"style":"mc","type":"Kanji"},
        {"q":"Meaning of the Kanji: 反対?","answer":"Opposition / Objection","options":["Opposition / Objection","Agreement","Approval","Sympathy"],"style":"mc","type":"Kanji"},
        {"q":"Meaning of the Kanji: 成功?","answer":"Success","options":["Success","Failure","Attempt","Goal"],"style":"mc","type":"Kanji"},
        {"q":"Meaning of the Kanji: 失敗?","answer":"Failure / Mistake","options":["Failure / Mistake","Success","Accident","Chance"],"style":"mc","type":"Kanji"},
        {"q":"Meaning of the Kanji: 相談?","answer":"Consultation / Discussion","options":["Consultation / Discussion","Argument","Speech","Decision"],"style":"mc","type":"Kanji"},
        {"q":"What does \"お世話になります\" mean?","answer":"Thank you for your kind support / Care","options":["Thank you for your kind support / Care","Excuse me for leaving","Good morning","Please do not mention it"],"style":"mc","type":"Phrase"},
        {"q":"What does \"お疲れ様でした\" mean?","answer":"Thank you for your hard work","options":["Thank you for your hard work","Welcome","Please eat","Good night"],"style":"mc","type":"Phrase"},
        {"q":"What does \"~てたまらない\" express?","answer":"Unbearably / Can't help feeling","options":["Unbearably / Can't help feeling","Must not do","Don't care about","Can endure"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~てしょうがない\" express?","answer":"Extremely / Can't help but feel","options":["Extremely / Can't help but feel","It cannot be helped","Unimportant","Tolerable"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~おかげで\" express?","answer":"Thanks to (positive reason)","options":["Thanks to (positive reason)","Fault of","In spite of","Instead of"],"style":"mc","type":"Grammar"},
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
        {"q":"What does \"~に際して\" (ni saishite) mean?","answer":"On the occasion of / When starting","options":["On the occasion of / When starting","Because of","In place of","Without"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~を通じて\" (o tsuujite) mean?","answer":"Through / Via / Throughout","options":["Through / Via / Throughout","In contrast to","According to","In place of"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~に基づいて\" (ni motozuite) mean?","answer":"Based on / Grounded upon","options":["Based on / Grounded upon","Apart from","In contrast to","In exchange for"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~げ\" (ge) attached to an adjective stem express?","answer":"Looking like / Seeming (state or expression)","options":["Looking like / Seeming (state or expression)","Extremely","Very easy to","Disliking"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~気味\" (gimi) express?","answer":"Slight tendency / Touch of (e.g. cold, tiredness)","options":["Slight tendency / Touch of (e.g. cold, tiredness)","Full-blown","Recovery from","Prevention of"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~がち\" (gachi) express?","answer":"Tendency to often / Apt to (undesirable)","options":["Tendency to often / Apt to (undesirable)","Rarely happens","Only once","Desirable habit"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~っぽい\" (ppoi) express?","answer":"Having the quality / -ish / -like","options":["Having the quality / -ish / -like","Exactly identical","Opposite of","Completely devoid of"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~ざるを得ない\" (zaru o enai) mean?","answer":"Cannot help but do / Have no choice but to do","options":["Cannot help but do / Have no choice but to do","Should not do","Refuse to do","Can easily do"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~ずにはいられない\" mean?","answer":"Cannot help feeling / Cannot stop oneself from doing","options":["Cannot help feeling / Cannot stop oneself from doing","Must refrain from doing","Have no choice but to accept","Can endure"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~ないわけにはいかない\" mean?","answer":"Cannot avoid doing / Must do out of social duty","options":["Cannot avoid doing / Must do out of social duty","Should not do","Don't need to do","Must avoid doing"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~にもかかわらず\" mean?","answer":"In spite of / Despite","options":["In spite of / Despite","Because of","In accordance with","Along with"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~にしては\" mean?","answer":"For / Considering that (surprising for category)","options":["For / Considering that (surprising for category)","Naturally as expected","Because of","Instead of"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~わりに(は)\" mean?","answer":"Considering / Relatively (unexpected result)","options":["Considering / Relatively (unexpected result)","Strictly according to","In proportion to","Without exception"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~につれて\" mean?","answer":"As X changes, Y changes gradually","options":["As X changes, Y changes gradually","Immediately after","Instead of","Without changing"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~に従って\" (ni shitagatte) mean?","answer":"In accordance with / As X progresses","options":["In accordance with / As X progresses","Despite the rule","In opposition to","In place of"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~に伴って\" (ni tomonatte) mean?","answer":"Along with / As a consequence of","options":["Along with / As a consequence of","Regardless of","In contrast to","Before"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~をめぐって\" (o megutte) mean?","answer":"Concerning / Centered around (dispute/issue)","options":["Concerning / Centered around (dispute/issue)","Without considering","In place of","In order to"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~において\" (ni oite) mean?","answer":"In / At (formal written locative)","options":["In / At (formal written locative)","Because of","Together with","After"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~により / による\" mean?","answer":"Due to / By means of / Depending on","options":["Due to / By means of / Depending on","In contrast to","In addition to","Without"],"style":"mc","type":"Grammar"},
        {"q":"Meaning of the Kanji: 影響 (eikyou)?","answer":"Influence / Effect","options":["Influence / Effect","Shadow","Sound","Cause"],"style":"mc","type":"Kanji"},
        {"q":"Meaning of the Kanji: 傾向 (keikou)?","answer":"Tendency / Trend","options":["Tendency / Trend","Direction","Problem","Solution"],"style":"mc","type":"Kanji"},
        {"q":"Meaning of the Kanji: 責任 (sekinin)?","answer":"Responsibility","options":["Responsibility","Duty","Right","Blame"],"style":"mc","type":"Kanji"},
        {"q":"Meaning of the Kanji: 開発 (kaihatsu)?","answer":"Development","options":["Development","Discovery","Design","Destruction"],"style":"mc","type":"Kanji"},
        {"q":"Meaning of the Kanji: 現象 (genshou)?","answer":"Phenomenon","options":["Phenomenon","Reality","Image","Situation"],"style":"mc","type":"Kanji"},
        {"q":"Meaning of the Kanji: 批判 (hihan)?","answer":"Criticism / Judgment","options":["Criticism / Judgment","Praise","Explanation","Decision"],"style":"mc","type":"Kanji"},
        {"q":"Meaning of the Kanji: 克服 (kokufuku)?","answer":"Conquest / Overcoming","options":["Conquest / Overcoming","Submission","Fight","Surrender"],"style":"mc","type":"Kanji"},
        {"q":"Meaning of the Kanji: 貢献 (kouken)?","answer":"Contribution / Service","options":["Contribution / Service","Donation","Sacrifice","Loyalty"],"style":"mc","type":"Kanji"},
        {"q":"What does \"~にすぎない\" mean?","answer":"Merely / Nothing more than","options":["Merely / Nothing more than","Exceeding","Unimportant","Very important"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~にほかならない\" mean?","answer":"None other than / Nothing but","options":["None other than / Nothing but","Different from","Unknown whether","Cannot be"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~ざるをえない\" with verb \"する\" become?","answer":"せざるを得ない","options":["せざるを得ない","すざるを得ない","しざるを得ない","されざるを得ない"],"style":"mc","type":"Verb Conjugation"},
        {"q":"What does \"~っこない\" express in spoken Japanese?","answer":"No way that... / Definitely impossible","options":["No way that... / Definitely impossible","Very likely to","Might happen","Will certainly happen"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~げ\" in \"寂しげ\" mean?","answer":"Looking lonely / Seeming lonely","options":["Looking lonely / Seeming lonely","Not lonely","Extremely lonely","Used to be lonely"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~からには\" express?","answer":"Now that / Since (strong resolution follows)","options":["Now that / Since (strong resolution follows)","Even though","Before","In order to"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~以上(は)\" (ijou wa) express?","answer":"Since / As long as (duty/determination follows)","options":["Since / As long as (duty/determination follows)","More than numbers","Underneath","Unless"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~反面\" (hanmen) express?","answer":"On the other hand / Conversely","options":["On the other hand / Conversely","Because of","In the middle of","After"],"style":"mc","type":"Grammar"},
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
        {"q":"What does \"~んがため(に)\" mean?","answer":"In order to / For the purpose of","options":["In order to / For the purpose of","Because of","Without doing","In spite of"],"style":"mc","type":"Grammar"},
        {"q":"How does verb \"する\" conjugate before \"~んがため\"?","answer":"せんがため","options":["せんがため","すんがため","しんがため","されんがため"],"style":"mc","type":"Verb Conjugation"},
        {"q":"What does \"~ずして\" mean in formal Japanese?","answer":"Without doing (formal ないで)","options":["Without doing (formal ないで)","After doing","In order to do","While doing"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~べからず\" mean on notices/signs?","answer":"Must not do (strong prohibition)","options":["Must not do (strong prohibition)","Please do","Can do","Should do if possible"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~ものを\" express at sentence end?","answer":"Regret / Lament (\"If only... but alas\")","options":["Regret / Lament (\"If only... but alas\")","Absolute joy","Definite refusal","Strong command"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~ながら(も)\" express in N1 context?","answer":"Although / Even while admitting (concession)","options":["Although / Even while admitting (concession)","Simultaneous actions","In order to","As soon as"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~といえども\" mean?","answer":"Even / Even though (even an expert, etc.)","options":["Even / Even though (even an expert, etc.)","Because of","Just like","Instead of"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~や否や\" (ya ina ya) express?","answer":"No sooner than / As soon as (surprise)","options":["No sooner than / As soon as (surprise)","Long after","Without doing","Occasionally"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~そばから\" express?","answer":"As soon as X, Y happens repeatedly (annoying cycle)","options":["As soon as X, Y happens repeatedly (annoying cycle)","Happened only once","Never happens","Happened by chance"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~なり\" express after a verb in N1?","answer":"As soon as (immediate action by same subject)","options":["As soon as (immediate action by same subject)","Whether or not","In place of","Without"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~ともなると\" express?","answer":"When it reaches the stage / level of","options":["When it reaches the stage / level of","Before becoming","Regardless of level","Despite being"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~とあって\" express?","answer":"Due to the special circumstance of","options":["Due to the special circumstance of","In contrast to","Regardless of","In place of"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~に至って\" (ni itatte) express?","answer":"Having reached the extreme point of / Only after","options":["Having reached the extreme point of / Only after","At the very beginning","Without reaching","Before reaching"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~きらいがある\" express?","answer":"Has a tendency / Proneness to (undesirable trait)","options":["Has a tendency / Proneness to (undesirable trait)","Has a strong dislike for","Has no tendency to","Enjoys doing"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~ずにはおかない\" express?","answer":"Will certainly / Inevitably cause/compel","options":["Will certainly / Inevitably cause/compel","Will never do","Can avoid doing","Cannot happen"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~を余儀なくされる\" mean?","answer":"To be forced to / Compelled by circumstances","options":["To be forced to / Compelled by circumstances","To volunteer freely","To easily avoid","To decline politely"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~極まる / 極まりない\" (kiwamaru) express?","answer":"Extremely / In the highest degree (unmatched)","options":["Extremely / In the highest degree (unmatched)","Slightly","Not at all","Moderate amount"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~を皮切りに\" (o kawakiri ni) mean?","answer":"Starting with / Beginning with as a trigger","options":["Starting with / Beginning with as a trigger","Ending with","Except for","In exchange for"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~たるもの\" express?","answer":"As someone who is / In the position of (high duty)","options":["As someone who is / In the position of (high duty)","Despite being","Without becoming","Instead of being"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~ならでは\" express?","answer":"Unique to / Distinctive of only...","options":["Unique to / Distinctive of only...","Common to all","Lacking in","Similar to"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~に耐えない\" (ni taenai) express with emotion nouns?","answer":"Cannot contain / Overflowing with (gratitude/joy)","options":["Cannot contain / Overflowing with (gratitude/joy)","Cannot endure pain","Lacking emotion","Slightly feeling"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~を禁じ得ない\" (o kinji enai) mean?","answer":"Cannot help feeling / Cannot suppress (tears/anger)","options":["Cannot help feeling / Cannot suppress (tears/anger)","Can strictly control","Prohibited by law","Forbidden to enter"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~まみれ\" express?","answer":"Covered all over with (mud, dust, blood, debt)","options":["Covered all over with (mud, dust, blood, debt)","Completely clean of","Partially touched by","Free from"],"style":"mc","type":"Grammar"},
        {"q":"What does \"~ずくめ\" express?","answer":"Entirely full of / Nothing but (good news, black clothes)","options":["Entirely full of / Nothing but (good news, black clothes)","Lacking in","Occasionally with","Free of"],"style":"mc","type":"Grammar"},
        {"q":"Meaning of the Kanji: 乖離 (kairi)?","answer":"Divergence / Estrangement / Gap","options":["Divergence / Estrangement / Gap","Harmony","Union","Cooperation"],"style":"mc","type":"Kanji"},
        {"q":"Meaning of the Kanji: 齟齬 (sogo)?","answer":"Discord / Inconsistency / Friction","options":["Discord / Inconsistency / Friction","Agreement","Smooth progress","Understanding"],"style":"mc","type":"Kanji"},
        {"q":"Meaning of the Kanji: 脆弱 (zeijaku)?","answer":"Fragile / Vulnerable / Weak","options":["Fragile / Vulnerable / Weak","Sturdy","Robust","Powerful"],"style":"mc","type":"Kanji"},
        {"q":"Meaning of the Kanji: 蓋然性 (gaizansei)?","answer":"Probability / Likelihood","options":["Probability / Likelihood","Impossibility","Certainty","Coincidence"],"style":"mc","type":"Kanji"},
        {"q":"Meaning of the Kanji: 杞憂 (kiyuu)?","answer":"Groundless fear / Needless anxiety","options":["Groundless fear / Needless anxiety","Real danger","Deep sorrow","Great anger"],"style":"mc","type":"Kanji"},
        {"q":"Meaning of the Kanji: 諮問 (shimon)?","answer":"Consultation / Inquiring an advisory body","options":["Consultation / Inquiring an advisory body","Answer","Rejection","Punishment"],"style":"mc","type":"Kanji"},
        {"q":"Meaning of the Kanji: 躊躇 (chuucho)?","answer":"Hesitation / Vacillation","options":["Hesitation / Vacillation","Decisiveness","Boldness","Courage"],"style":"mc","type":"Kanji"},
        {"q":"Meaning of the Kanji: 폄 (N/A) / 熾烈 (shiretsu)?","answer":"Fierce / Keen / Vehement","options":["Fierce / Keen / Vehement","Gentle","Calm","Peaceful"],"style":"mc","type":"Kanji"},
        {"q":"What is wrong with \"おっしゃられる\"?","answer":"It is a redundant double honorific (二重敬語)","options":["It is a redundant double honorific (二重敬語)","It is humble language","It is casual speech","It is incorrect grammar only in spoken Japanese"],"style":"mc","type":"Keigo"},
        {"q":"What is the correct humble form when visiting a client?","answer":"伺う (ukagau)","options":["伺う (ukagau)","参る (mairu)","おいでになる","いらっしゃる"],"style":"mc","type":"Keigo"},
        {"q":"What does \"~をおいてほかにない\" express?","answer":"There is none other than / Only X can do it","options":["There is none other than / Only X can do it","Anyone can do it","It is impossible for all","There are many alternatives"],"style":"mc","type":"Grammar"},
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
        esPrompt: 'Almorcemos juntos.',
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

// --- ==================================================== ---
// --- FLOATING TOAST & VIRAL SOCIAL SHARING ENGINE         ---
// --- ==================================================== ---
window.showToast = function(message) {
    let toast = document.getElementById('toast-notice');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notice';
        toast.className = 'toast-notice';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--accent-teal);"></i> ${message}`;
    toast.classList.add('show');
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
};

window.shareQuestProgress = function({ title, text, url }) {
    const shareUrl = url || window.location.href;
    const fullText = text ? `${text}\n${shareUrl}` : shareUrl;
    if (navigator.share) {
        navigator.share({
            title: title || 'KotoQuest - Japanese Academy',
            text: text,
            url: shareUrl
        }).catch(() => {});
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullText);
        window.showToast('Copied to clipboard!');
    } else {
        prompt('Copy this link:', shareUrl);
    }
};

function addBragLogEntry(label, onShare) {
    const box = document.getElementById('battle-log');
    if (!box) return;
    const entry = document.createElement('div');
    entry.className = 'log-entry system';
    entry.style.display = 'flex';
    entry.style.alignItems = 'center';
    entry.style.gap = '8px';
    entry.style.margin = '4px 0';
    
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'share-btn share-btn-primary';
    btn.style.padding = '3px 10px';
    btn.style.fontSize = '0.75rem';
    btn.style.cursor = 'pointer';
    btn.innerHTML = `<i class="fa-solid fa-share-nodes"></i> ${label}`;
    btn.onclick = (e) => {
        e.stopPropagation();
        onShare();
    };
    entry.appendChild(btn);
    box.appendChild(entry);
    box.scrollTop = box.scrollHeight;
}

function setupSocialSharing() {
    const shareAppBtn = document.getElementById('btn-share-app');
    if (shareAppBtn) {
        shareAppBtn.addEventListener('click', () => {
            const currentTab = (window.location.hash || '#arena').replace('#', '').split('?')[0];
            const url = `https://kotoquest.pages.dev/#${currentTab}`;
            const text = `🏯 KotoQuest — Free, offline-first JLPT N5–N1 Japanese academy with 8,129-word dictionary and SOV grammar bridge (Telugu, Hindi, Tamil, Korean, Spanish, English)!`;
            window.shareQuestProgress({
                title: 'KotoQuest - Gamified Japanese Academy',
                text: text,
                url: url
            });
        });
    }

    const streakBtn = document.getElementById('streak-badge-btn');
    if (streakBtn) {
        streakBtn.addEventListener('click', () => {
            const days = player.streak || 1;
            const text = `🔥 I have a ${days}-day Japanese study streak on KotoQuest! Free offline JLPT academy:`;
            window.shareQuestProgress({
                title: `${days}-Day Study Streak on KotoQuest`,
                text: text,
                url: 'https://kotoquest.pages.dev/#curriculum'
            });
        });
    }
}

// --- ==================================================== ---
// --- VIRAL GROWTH ENGINE: DAILY, CERTIFICATE & 1v1 DUELS   ---
// --- ==================================================== ---

// 1. Deterministic PRNG (Mulberry32 & String Hasher)
function hashDateString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
    }
    return hash;
}

function mulberry32(a) {
    return function() {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function getLocalDateString() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 2. Deterministic Question Generators
function getVocabQuestion(tier, rng) {
    const list = (typeof FULL_VOCAB_DB !== 'undefined' && FULL_VOCAB_DB[tier]) ? FULL_VOCAB_DB[tier] : null;
    if (!list || list.length === 0) return null;
    const targetIdx = Math.floor(rng() * list.length);
    const target = list[targetIdx];
    
    // Choose between meaning question or reading question (if kanji)
    const isKanji = target.j !== target.r;
    const askReading = isKanji && rng() > 0.5;

    const distractors = [];
    let attempts = 0;
    while (distractors.length < 3 && attempts < 60) {
        attempts++;
        const dIdx = Math.floor(rng() * list.length);
        const d = list[dIdx];
        const val = askReading ? d.r : d.m;
        const targetVal = askReading ? target.r : target.m;
        if (val !== targetVal && !distractors.includes(val)) {
            distractors.push(val);
        }
    }
    while (distractors.length < 3) {
        distractors.push(`Option ${distractors.length + 1}`);
    }

    const answer = askReading ? target.r : target.m;
    const options = [answer, ...distractors];
    // Deterministic shuffle
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }

    return {
        q: askReading ? `What is the reading for 「${target.j}」?` : `What is the meaning of 「${target.j}」 (${target.r})?`,
        answer: answer,
        options: options,
        type: `${tier} Vocabulary`,
        speak: target.j
    };
}

function getGrammarQuestion(tier, rng) {
    const list = (typeof QUEST_DATABASE !== 'undefined' && QUEST_DATABASE[tier])
        ? QUEST_DATABASE[tier].filter(q => q.style === 'mc' && Array.isArray(q.options) && q.options.length >= 2)
        : [];
    if (list.length === 0) return null;
    const qItem = list[Math.floor(rng() * list.length)];
    const options = [...qItem.options];
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
    return {
        q: qItem.q,
        answer: qItem.answer,
        options: options,
        type: `${tier} ${qItem.type || 'Grammar'}`,
        speak: qItem.answer && qItem.answer.match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/) ? qItem.answer : ''
    };
}

function getDailyQuestions(dateStr) {
    const seed = hashDateString(dateStr);
    const rng = mulberry32(seed);
    const questions = [];
    
    // Q1: N5 vocab
    const q1 = getVocabQuestion('N5', rng);
    if (q1) questions.push(q1);
    // Q2: N4 vocab
    const q2 = getVocabQuestion('N4', rng) || getVocabQuestion('N5', rng);
    if (q2) questions.push(q2);
    // Q3: N3 vocab (or N5 fallback)
    const q3 = getVocabQuestion('N3', rng) || getVocabQuestion('N5', rng);
    if (q3) questions.push(q3);
    // Q4: N5 grammar
    const q4 = getGrammarQuestion('N5', rng);
    if (q4) questions.push(q4);
    // Q5: N4 grammar
    const q5 = getGrammarQuestion('N4', rng) || getGrammarQuestion('N5', rng);
    if (q5) questions.push(q5);

    return questions;
}

function getDuelQuestions(seedNum, tier) {
    const rng = mulberry32(seedNum);
    const questions = [];
    const validTier = (['N5', 'N4', 'N3', 'N2', 'N1'].includes(tier)) ? tier : 'N5';
    
    for (let i = 0; i < 3; i++) {
        const q = getVocabQuestion(validTier, rng);
        if (q) questions.push(q);
    }
    for (let i = 0; i < 2; i++) {
        const q = getGrammarQuestion(validTier, rng) || getVocabQuestion(validTier, rng);
        if (q) questions.push(q);
    }
    while (questions.length < 5) {
        questions.push(getVocabQuestion('N5', rng) || {
            q: 'What is the meaning of 「水」 (mizu)?',
            answer: 'Water',
            options: ['Water', 'Fire', 'Earth', 'Wind'],
            type: 'N5 Vocabulary',
            speak: '水'
        });
    }
    return questions;
}

// 3. Daily Japanese Challenge State & Logic
let dailyState = {
    questions: [],
    currentIndex: 0,
    answers: [],
    countdownTimer: null
};

function getStoredDailyData() {
    try {
        const raw = localStorage.getItem('koto_daily_state');
        return raw ? JSON.parse(raw) : null;
    } catch (e) {
        return null;
    }
}

function saveStoredDailyData(data) {
    try {
        localStorage.setItem('koto_daily_state', JSON.stringify(data));
    } catch (e) {}
}

function openDailyChallenge() {
    const overlay = document.getElementById('daily-overlay');
    if (!overlay) return;
    overlay.classList.add('show');

    const todayStr = getLocalDateString();
    const stored = getStoredDailyData();

    if (stored && stored.date === todayStr && stored.completed) {
        showDailyCompleteView(stored);
    } else {
        startDailyChallenge(todayStr);
    }
}
window.openDailyChallenge = openDailyChallenge;

function closeDailyChallenge() {
    const overlay = document.getElementById('daily-overlay');
    if (overlay) overlay.classList.remove('show');
    if (dailyState.countdownTimer) {
        clearInterval(dailyState.countdownTimer);
        dailyState.countdownTimer = null;
    }
    if (window.location.hash.startsWith('#daily')) {
        history.replaceState(null, '', '#arena');
    }
}
window.closeDailyChallenge = closeDailyChallenge;

function startDailyChallenge(dateStr) {
    dailyState.questions = getDailyQuestions(dateStr);
    dailyState.currentIndex = 0;
    dailyState.answers = [];

    const activeView = document.getElementById('daily-active-view');
    const completeView = document.getElementById('daily-complete-view');
    if (activeView) activeView.style.display = 'block';
    if (completeView) completeView.style.display = 'none';

    const titleEl = document.getElementById('daily-modal-title');
    if (titleEl) {
        const formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        titleEl.textContent = `Daily Quest · ${formattedDate}`;
    }

    renderDailyQuestion(0);
}

function renderDailyQuestion(idx) {
    const q = dailyState.questions[idx];
    if (!q) return;

    const dots = document.querySelectorAll('#daily-dots .daily-dot');
    dots.forEach((dot, i) => {
        dot.className = 'daily-dot';
        if (i < idx) {
            dot.classList.add(dailyState.answers[i] ? 'correct' : 'wrong');
        } else if (i === idx) {
            dot.classList.add('active');
        }
    });

    const qText = document.getElementById('daily-question-text');
    const qType = document.getElementById('daily-question-type');
    const speakBtn = document.getElementById('btn-speak-daily');

    if (qText) qText.textContent = q.q;
    if (qType) qType.textContent = q.type || 'Vocabulary';
    if (speakBtn) {
        if (q.speak) {
            speakBtn.style.display = 'inline-flex';
            speakBtn.setAttribute('data-speak', q.speak);
        } else {
            speakBtn.style.display = 'none';
        }
    }

    const optContainer = document.getElementById('daily-options');
    if (!optContainer) return;
    optContainer.innerHTML = '';

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'daily-opt-btn';
        btn.textContent = opt;
        btn.onclick = () => handleDailyAnswer(btn, opt, q.answer);
        optContainer.appendChild(btn);
    });
}

function handleDailyAnswer(btn, chosen, correct) {
    const allBtns = document.querySelectorAll('#daily-options .daily-opt-btn');
    allBtns.forEach(b => b.disabled = true);

    const isCorrect = chosen === correct;
    dailyState.answers.push(isCorrect);

    if (isCorrect) {
        btn.classList.add('correct');
    } else {
        btn.classList.add('wrong');
        allBtns.forEach(b => {
            if (b.textContent === correct) b.classList.add('correct');
        });
    }

    setTimeout(() => {
        if (dailyState.currentIndex + 1 < dailyState.questions.length) {
            dailyState.currentIndex++;
            renderDailyQuestion(dailyState.currentIndex);
        } else {
            finishDailyChallenge();
        }
    }, 700);
}

function finishDailyChallenge() {
    const todayStr = getLocalDateString();
    const correctCount = dailyState.answers.filter(Boolean).length;
    const grid = dailyState.answers.map(a => a ? '🟩' : '🟥').join('');

    const prevData = getStoredDailyData();
    let streak = 1;
    if (prevData && prevData.lastCompletedDate) {
        const lastDate = new Date(prevData.lastCompletedDate);
        const today = new Date(todayStr);
        const diffDays = Math.round((today - lastDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
            streak = (prevData.streak || 1) + 1;
        } else if (diffDays === 0) {
            streak = prevData.streak || 1;
        }
    }

    const savedRecord = {
        date: todayStr,
        lastCompletedDate: todayStr,
        answers: dailyState.answers,
        score: correctCount,
        grid: grid,
        streak: streak,
        completed: true
    };
    saveStoredDailyData(savedRecord);

    player.xp = (player.xp || 0) + (correctCount * 15);
    player.gold = (player.gold || 0) + (correctCount * 10);
    saveGameData();
    updateHUDDisplays();

    showDailyCompleteView(savedRecord);
}

function showDailyCompleteView(data) {
    const activeView = document.getElementById('daily-active-view');
    const completeView = document.getElementById('daily-complete-view');
    if (activeView) activeView.style.display = 'none';
    if (completeView) completeView.style.display = 'block';

    const titleEl = document.getElementById('daily-verdict-title');
    const subEl = document.getElementById('daily-verdict-sub');
    const gridEl = document.getElementById('daily-grid-display');

    if (titleEl) {
        titleEl.textContent = data.score === 5 ? '🎉 Perfect Mastery!' : (data.score >= 3 ? '⚔️ Quest Victorious!' : '📚 Keep Training!');
    }
    if (subEl) {
        subEl.textContent = `You scored ${data.score}/5 today! Daily Streak: ${data.streak || 1} Day${(data.streak || 1) === 1 ? '' : 's'} 🔥`;
    }
    if (gridEl) {
        gridEl.textContent = data.grid || '🟩🟩🟩🟩🟩';
    }

    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const shareText = `🏯 KotoQuest Daily #${dayOfYear}\n${data.grid}\nScore: ${data.score}/5 · Streak: ${data.streak || 1}d 🔥\nPlay today's challenge: https://kotoquest.pages.dev/#daily`;

    const shareBtn = document.getElementById('btn-share-daily');
    if (shareBtn) {
        shareBtn.onclick = () => {
            window.shareQuestProgress({
                title: `KotoQuest Daily #${dayOfYear}`,
                text: shareText,
                url: 'https://kotoquest.pages.dev/#daily'
            });
        };
    }

    const waBtn = document.getElementById('btn-wa-daily');
    if (waBtn) {
        waBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    }

    const xBtn = document.getElementById('btn-x-daily');
    if (xBtn) {
        xBtn.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    }

    const copyBtn = document.getElementById('btn-copy-daily');
    if (copyBtn) {
        copyBtn.onclick = () => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(shareText).then(() => {
                    window.showToast('Daily score copied to clipboard!');
                });
            } else {
                prompt('Copy score:', shareText);
            }
        };
    }

    startDailyCountdown();
}

function startDailyCountdown() {
    if (dailyState.countdownTimer) clearInterval(dailyState.countdownTimer);
    
    function update() {
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const diffMs = tomorrow - now;
        if (diffMs <= 0) {
            const countdownEl = document.getElementById('daily-countdown');
            if (countdownEl) countdownEl.textContent = '00:00:00 (New Quest Ready!)';
            return;
        }
        const hours = String(Math.floor(diffMs / (1000 * 60 * 60))).padStart(2, '0');
        const mins = String(Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        const secs = String(Math.floor((diffMs % (1000 * 60)) / 1000)).padStart(2, '0');
        const countdownEl = document.getElementById('daily-countdown');
        if (countdownEl) countdownEl.textContent = `${hours}:${mins}:${secs}`;
    }

    update();
    dailyState.countdownTimer = setInterval(update, 1000);
}

// 4. HTML5 Canvas Certificate Generator
function openCertificateModal() {
    const overlay = document.getElementById('certificate-overlay');
    if (!overlay) return;
    overlay.classList.add('show');

    const nameInput = document.getElementById('cert-name-input');
    const storedName = localStorage.getItem('koto_player_name') || 'Samurai Scholar';
    if (nameInput) {
        nameInput.value = storedName;
    }
    drawCertificate(storedName);
}
window.openCertificateModal = openCertificateModal;

function closeCertificateModal() {
    const overlay = document.getElementById('certificate-overlay');
    if (overlay) overlay.classList.remove('show');
    if (window.location.hash.startsWith('#certificate')) {
        history.replaceState(null, '', '#arena');
    }
}
window.closeCertificateModal = closeCertificateModal;

function drawCertificate(playerName) {
    const canvas = document.getElementById('cert-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 1080;
    const H = 1350;

    // 1. Background Gradient (Dark samurai indigo)
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#0a0d18');
    bgGrad.addColorStop(0.5, '#12172b');
    bgGrad.addColorStop(1, '#080a14');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Subtle decorative geometry / Japanese pattern
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.05)';
    ctx.lineWidth = 1;
    const step = 60;
    for (let x = 0; x < W; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
    }
    for (let y = 0; y < H; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
    }

    // 3. Ornate Double Gold Border
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, W - 80, H - 80);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(52, 52, W - 104, H - 104);

    // Japanese Corner Brackets
    const bracketSize = 36;
    const corners = [
        [40, 40, 1, 1],
        [W - 40, 40, -1, 1],
        [40, H - 40, 1, -1],
        [W - 40, H - 40, -1, -1]
    ];
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 6;
    corners.forEach(([cx, cy, dx, dy]) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy + dy * bracketSize);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx + dx * bracketSize, cy);
        ctx.stroke();
    });

    // 4. Kanji Watermark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.font = 'bold 220px serif';
    ctx.textAlign = 'center';
    ctx.fillText('侍道', W / 2, 530);

    // 5. Title & Headers
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('言クエスト · KOTOQUEST ACADEMY', W / 2, 160);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 50px serif';
    ctx.fillText('日本語修業認定証', W / 2, 235);

    ctx.fillStyle = '#a0aec0';
    ctx.font = '600 20px sans-serif';
    ctx.fillText('CERTIFICATE OF JAPANESE MASTERY', W / 2, 280);

    // Gold Divider Line with diamond in center
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 240, 315);
    ctx.lineTo(W / 2 + 240, 315);
    ctx.stroke();

    ctx.fillStyle = '#f1c40f';
    ctx.beginPath();
    ctx.arc(W / 2, 315, 6, 0, Math.PI * 2);
    ctx.fill();

    // 6. Subtext
    ctx.fillStyle = '#a0aec0';
    ctx.font = 'italic 24px serif';
    ctx.fillText('This is proudly awarded to', W / 2, 385);

    // 7. Student Name
    const name = (playerName || 'Samurai Scholar').trim();
    ctx.fillStyle = '#ffffff';
    ctx.font = name.length > 18 ? 'bold 44px sans-serif' : 'bold 56px sans-serif';
    ctx.fillText(name, W / 2, 455);

    // Underline for name
    const nameWidth = Math.min(ctx.measureText(name).width + 60, 640);
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W / 2 - nameWidth / 2, 480);
    ctx.lineTo(W / 2 + nameWidth / 2, 480);
    ctx.stroke();

    // 8. Certification Paragraph
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '22px sans-serif';
    ctx.fillText('for demonstrated excellence and dedication in mastering the Japanese language,', W / 2, 540);
    ctx.fillText('achieving the following samurai combat and linguistic credentials:', W / 2, 575);

    // 9. Stats Grid (4 Cards: Rank, Level, Streak, Accuracy)
    const rank = document.getElementById('rank-name') ? document.getElementById('rank-name').textContent : 'Novice';
    const level = `Lv. ${player.level || 1}`;
    const streak = `${player.streak || 1} Days`;
    const pct = (player.stats && player.stats.totalAnswered > 0)
        ? `${Math.round((player.stats.totalCorrect / player.stats.totalAnswered) * 100)}%`
        : '100%';

    const statCards = [
        { label: 'SAMURAI RANK', val: rank },
        { label: 'ACADEMY LEVEL', val: level },
        { label: 'STUDY STREAK', val: streak },
        { label: 'COMBAT ACCURACY', val: pct }
    ];

    const startX = 140;
    const startY = 640;
    const cardW = 380;
    const cardH = 140;
    const gapX = 40;
    const gapY = 30;

    statCards.forEach((c, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const cx = startX + col * (cardW + gapX);
        const cy = startY + row * (cardH + gapY);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(cx, cy, cardW, cardH, 12);
        ctx.fill();
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.fillStyle = '#a0aec0';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(c.label, cx + cardW / 2, cy + 45);

        ctx.fillStyle = '#f1c40f';
        ctx.font = '900 32px sans-serif';
        ctx.fillText(c.val, cx + cardW / 2, cy + 95);
    });

    // 10. Traditional Red Hanko Seal (Japanese Official Seal: 合格)
    const hankoX = W / 2;
    const hankoY = 1040;
    const hankoSize = 120;

    ctx.save();
    ctx.translate(hankoX, hankoY);
    ctx.rotate(-0.04);

    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 6;
    ctx.strokeRect(-hankoSize / 2, -hankoSize / 2, hankoSize, hankoSize);

    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 2;
    ctx.strokeRect(-hankoSize / 2 + 6, -hankoSize / 2 + 6, hankoSize - 12, hankoSize - 12);

    ctx.fillStyle = '#e74c3c';
    ctx.font = '900 48px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('合格', 0, 0);

    ctx.restore();

    // 11. Issue Date & Verification Footer
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    ctx.textAlign = 'center';
    ctx.fillStyle = '#a0aec0';
    ctx.font = '600 18px sans-serif';
    ctx.fillText(`ISSUED: ${today.toUpperCase()} · VERIFIED CREDENTIAL`, W / 2, 1180);

    ctx.fillStyle = '#00cec9';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('KOTOQUEST.PAGES.DEV', W / 2, 1225);
}
window.drawCertificate = drawCertificate;

function downloadCertificate() {
    const canvas = document.getElementById('cert-canvas');
    if (!canvas) return;
    const nameInput = document.getElementById('cert-name-input');
    const name = (nameInput && nameInput.value.trim()) || 'Samurai-Scholar';
    const filename = `kotoquest-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-certificate.png`;

    canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        window.showToast('Certificate downloaded successfully!');
    }, 'image/png');
}

async function shareCertificate() {
    const canvas = document.getElementById('cert-canvas');
    if (!canvas) return;
    const nameInput = document.getElementById('cert-name-input');
    const name = (nameInput && nameInput.value.trim()) || 'Samurai Scholar';

    canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'kotoquest-samurai-certificate.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    title: `${name}'s Japanese Credential · KotoQuest`,
                    text: `I just earned my Samurai Japanese Credential on KotoQuest! 🏯🇯🇵\nCheck it out: https://kotoquest.pages.dev/#certificate`,
                    files: [file]
                });
            } catch (e) {}
        } else {
            downloadCertificate();
            window.shareQuestProgress({
                title: `${name}'s Japanese Credential`,
                text: `I just earned my Samurai Japanese Credential on KotoQuest! 🏯🇯🇵`,
                url: 'https://kotoquest.pages.dev/#certificate'
            });
        }
    }, 'image/png');
}

// 5. 1v1 Asynchronous Duel Mode Logic
let duelState = {
    seed: 0,
    tier: 'N5',
    questions: [],
    currentIndex: 0,
    answers: [],
    startTime: 0,
    timerInterval: null,
    challenger: null
};

function openDuelModal(params = {}) {
    const overlay = document.getElementById('duel-overlay');
    if (!overlay) return;
    overlay.classList.add('show');

    const inviteView = document.getElementById('duel-invite-view');
    const combatView = document.getElementById('duel-combat-view');
    const resultView = document.getElementById('duel-result-view');
    const createView = document.getElementById('duel-create-view');

    if (inviteView) inviteView.style.display = 'none';
    if (combatView) combatView.style.display = 'none';
    if (resultView) resultView.style.display = 'none';
    if (createView) createView.style.display = 'none';

    if (params.s && params.score && params.name) {
        duelState.seed = parseInt(params.s, 10) || 123456;
        duelState.tier = params.tier || 'N5';
        duelState.challenger = {
            name: decodeURIComponent(params.name),
            score: parseInt(params.score, 10) || 0,
            time: parseFloat(params.time) || 30.0,
            tier: duelState.tier
        };

        if (inviteView) {
            inviteView.style.display = 'block';
            const heading = document.getElementById('duel-invite-heading');
            const target = document.getElementById('duel-invite-target');
            const challengerEl = document.getElementById('duel-invite-challenger');
            if (heading) heading.textContent = `${duelState.challenger.name} Challenged You!`;
            if (target) target.textContent = `${duelState.challenger.score}/5 in ${duelState.challenger.time.toFixed(1)}s`;
            if (challengerEl) challengerEl.textContent = `Tier: ${duelState.challenger.tier} · Challenger: ${duelState.challenger.name}`;
        }
    } else {
        duelState.seed = Math.floor(100000 + Math.random() * 900000);
        duelState.tier = params.tier || (typeof currentTier !== 'undefined' ? currentTier : 'N5');
        duelState.challenger = null;
        startActiveDuel();
    }
}
window.openDuelModal = openDuelModal;

function closeDuelModal() {
    const overlay = document.getElementById('duel-overlay');
    if (overlay) overlay.classList.remove('show');
    if (duelState.timerInterval) {
        clearInterval(duelState.timerInterval);
        duelState.timerInterval = null;
    }
    if (window.location.hash.startsWith('#duel')) {
        history.replaceState(null, '', '#arena');
    }
}
window.closeDuelModal = closeDuelModal;

function startActiveDuel() {
    const inviteView = document.getElementById('duel-invite-view');
    const combatView = document.getElementById('duel-combat-view');
    const resultView = document.getElementById('duel-result-view');
    const createView = document.getElementById('duel-create-view');

    if (inviteView) inviteView.style.display = 'none';
    if (combatView) combatView.style.display = 'block';
    if (resultView) resultView.style.display = 'none';
    if (createView) createView.style.display = 'none';

    duelState.questions = getDuelQuestions(duelState.seed, duelState.tier);
    duelState.currentIndex = 0;
    duelState.answers = [];
    duelState.startTime = Date.now();

    if (duelState.timerInterval) clearInterval(duelState.timerInterval);
    const timerEl = document.getElementById('duel-timer');
    duelState.timerInterval = setInterval(() => {
        if (timerEl) {
            const elapsed = ((Date.now() - duelState.startTime) / 1000).toFixed(1);
            timerEl.innerHTML = `<i class="fa-solid fa-stopwatch"></i> ${elapsed}s`;
        }
    }, 100);

    renderDuelQuestion(0);
}

function renderDuelQuestion(idx) {
    const q = duelState.questions[idx];
    if (!q) return;

    const progress = document.getElementById('duel-progress');
    const qText = document.getElementById('duel-question-text');
    const qType = document.getElementById('duel-question-type');
    const speakBtn = document.getElementById('btn-speak-duel');

    if (progress) progress.textContent = `Question ${idx + 1}/5`;
    if (qText) qText.textContent = q.q;
    if (qType) qType.textContent = q.type || 'JLPT Duel';
    if (speakBtn) {
        if (q.speak) {
            speakBtn.style.display = 'inline-flex';
            speakBtn.setAttribute('data-speak', q.speak);
        } else {
            speakBtn.style.display = 'none';
        }
    }

    const optContainer = document.getElementById('duel-options');
    if (!optContainer) return;
    optContainer.innerHTML = '';

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'daily-opt-btn';
        btn.textContent = opt;
        btn.onclick = () => handleDuelAnswer(btn, opt, q.answer);
        optContainer.appendChild(btn);
    });
}

function handleDuelAnswer(btn, chosen, correct) {
    const allBtns = document.querySelectorAll('#duel-options .daily-opt-btn');
    allBtns.forEach(b => b.disabled = true);

    const isCorrect = chosen === correct;
    duelState.answers.push(isCorrect);

    if (isCorrect) {
        btn.classList.add('correct');
    } else {
        btn.classList.add('wrong');
        allBtns.forEach(b => {
            if (b.textContent === correct) b.classList.add('correct');
        });
    }

    setTimeout(() => {
        if (duelState.currentIndex + 1 < duelState.questions.length) {
            duelState.currentIndex++;
            renderDuelQuestion(duelState.currentIndex);
        } else {
            finishDuelRun();
        }
    }, 600);
}

function finishDuelRun() {
    if (duelState.timerInterval) {
        clearInterval(duelState.timerInterval);
        duelState.timerInterval = null;
    }

    const finalTime = parseFloat(((Date.now() - duelState.startTime) / 1000).toFixed(1));
    const finalScore = duelState.answers.filter(Boolean).length;
    const combatView = document.getElementById('duel-combat-view');
    if (combatView) combatView.style.display = 'none';

    if (duelState.challenger) {
        showDuelResultView(duelState.challenger, { score: finalScore, time: finalTime });
    } else {
        showDuelCreateView({ score: finalScore, time: finalTime, seed: duelState.seed, tier: duelState.tier });
    }
}

function showDuelResultView(challenger, playerRun) {
    const resultView = document.getElementById('duel-result-view');
    if (resultView) resultView.style.display = 'block';

    const verdictBanner = document.getElementById('duel-verdict-banner');
    const chName = document.getElementById('duel-vs-challenger-name');
    const chScore = document.getElementById('duel-vs-challenger-score');
    const chTime = document.getElementById('duel-vs-challenger-time');
    const plName = document.getElementById('duel-vs-player-name');
    const plScore = document.getElementById('duel-vs-player-score');
    const plTime = document.getElementById('duel-vs-player-time');

    const chCard = document.getElementById('duel-vs-challenger');
    const plCard = document.getElementById('duel-vs-player');

    if (chName) chName.textContent = challenger.name;
    if (chScore) chScore.textContent = `${challenger.score}/5`;
    if (chTime) chTime.textContent = `${challenger.time.toFixed(1)}s`;

    const myName = localStorage.getItem('koto_player_name') || 'You';
    if (plName) plName.textContent = myName;
    if (plScore) plScore.textContent = `${playerRun.score}/5`;
    if (plTime) plTime.textContent = `${playerRun.time.toFixed(1)}s`;

    if (chCard) chCard.classList.remove('winner');
    if (plCard) plCard.classList.remove('winner');

    let verdictText = '';
    let verdictClass = '';
    if (playerRun.score > challenger.score) {
        verdictText = '🎉 VICTORY! You outscored the challenger!';
        verdictClass = 'victory';
        if (plCard) plCard.classList.add('winner');
    } else if (playerRun.score === challenger.score) {
        if (playerRun.time < challenger.time) {
            const diff = (challenger.time - playerRun.time).toFixed(1);
            verdictText = `⚡ VICTORY! You were faster by ${diff}s!`;
            verdictClass = 'victory';
            if (plCard) plCard.classList.add('winner');
        } else if (playerRun.time === challenger.time) {
            verdictText = '🤝 TIE! An honorable samurai standoff!';
            verdictClass = 'tie';
        } else {
            const diff = (playerRun.time - challenger.time).toFixed(1);
            verdictText = `💀 DEFEAT! Challenger was faster by ${diff}s!`;
            verdictClass = 'defeat';
            if (chCard) chCard.classList.add('winner');
        }
    } else {
        verdictText = '💀 DEFEAT! Challenger prevailed!';
        verdictClass = 'defeat';
        if (chCard) chCard.classList.add('winner');
    }

    if (verdictBanner) {
        verdictBanner.textContent = verdictText;
        verdictBanner.className = `duel-verdict ${verdictClass}`;
    }

    const shareText = `⚔️ KotoQuest 1v1 Duel Verdict:\n${verdictText}\nMe (${myName}): ${playerRun.score}/5 (${playerRun.time}s)\n${challenger.name}: ${challenger.score}/5 (${challenger.time}s)\nPlay KotoQuest: https://kotoquest.pages.dev/#duel`;

    const trophyBtn = document.getElementById('btn-duel-story-trophy');
    if (trophyBtn) {
        trophyBtn.onclick = () => {
            generateDuelStoryTrophy(challenger, playerRun, verdictText);
        };
    }

    const shareBtn = document.getElementById('btn-share-duel-result');
    if (shareBtn) {
        shareBtn.onclick = () => {
            window.shareQuestProgress({
                title: 'KotoQuest 1v1 Duel Result',
                text: shareText,
                url: 'https://kotoquest.pages.dev/#duel'
            });
        };
    }

    const copyBtn = document.getElementById('btn-copy-duel-result');
    if (copyBtn) {
        copyBtn.onclick = () => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(shareText).then(() => {
                    window.showToast('Duel result copied to clipboard!');
                });
            } else {
                prompt('Copy result:', shareText);
            }
        };
    }

    const rematchBtn = document.getElementById('btn-rematch-duel');
    if (rematchBtn) {
        rematchBtn.onclick = () => {
            duelState.seed = Math.floor(100000 + Math.random() * 900000);
            duelState.challenger = null;
            startActiveDuel();
        };
    }
}

function showDuelCreateView(playerRun) {
    const createView = document.getElementById('duel-create-view');
    if (createView) createView.style.display = 'block';

    const statsEl = document.getElementById('duel-created-stats');
    if (statsEl) {
        statsEl.textContent = `${playerRun.score}/5 in ${playerRun.time.toFixed(1)}s`;
    }

    const myName = localStorage.getItem('koto_player_name') || 'Samurai';
    const duelUrl = `https://kotoquest.pages.dev/#duel?s=${playerRun.seed}&name=${encodeURIComponent(myName)}&score=${playerRun.score}&time=${playerRun.time}&tier=${playerRun.tier}`;
    const shareText = `⚔️ I challenge you to a 1v1 Japanese Duel on KotoQuest!\nMy target: ${playerRun.score}/5 in ${playerRun.time}s (${playerRun.tier} tier).\nCan you beat me? Accept here:\n${duelUrl}`;

    const shareBtn = document.getElementById('btn-share-new-duel');
    if (shareBtn) {
        shareBtn.onclick = () => {
            window.shareQuestProgress({
                title: 'Japanese 1v1 Duel Challenge',
                text: shareText,
                url: duelUrl
            });
        };
    }

    const waBtn = document.getElementById('btn-wa-new-duel');
    if (waBtn) {
        waBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    }

    const xBtn = document.getElementById('btn-x-new-duel');
    if (xBtn) {
        xBtn.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    }

    const copyBtn = document.getElementById('btn-copy-new-duel');
    if (copyBtn) {
        copyBtn.onclick = () => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(duelUrl).then(() => {
                    window.showToast('Duel challenge link copied!');
                });
            } else {
                prompt('Copy duel link:', duelUrl);
            }
        };
    }
}

// 6. Duel Story Trophy Image Generator (1080x1350 for Social Stories)
function generateDuelStoryTrophy(challenger, playerRun, verdictText) {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');
    const W = 1080;
    const H = 1350;

    // 1. Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#0a0d18');
    bgGrad.addColorStop(0.5, '#151a2e');
    bgGrad.addColorStop(1, '#080a14');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Gold Borders & Corner Brackets
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, W - 80, H - 80);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(52, 52, W - 104, H - 104);

    const bSize = 36;
    const corners = [
        [40, 40, 1, 1],
        [W - 40, 40, -1, 1],
        [40, H - 40, 1, -1],
        [W - 40, H - 40, -1, -1]
    ];
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 6;
    corners.forEach(([cx, cy, dx, dy]) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy + dy * bSize);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx + dx * bSize, cy);
        ctx.stroke();
    });

    // 3. Header
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('⚔️ KOTOQUEST · JLPT 1v1 DUEL', W / 2, 150);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 50px serif';
    ctx.fillText('SAMURAI VERSUS BATTLE', W / 2, 220);

    // 4. Big Verdict Banner
    const isVictory = playerRun.score > challenger.score || (playerRun.score === challenger.score && playerRun.time < challenger.time);
    const isTie = playerRun.score === challenger.score && playerRun.time === challenger.time;

    ctx.fillStyle = isVictory ? '#2ecc71' : isTie ? '#f1c40f' : '#e74c3c';
    ctx.font = '900 60px sans-serif';
    ctx.fillText(isVictory ? '🎉 VICTORY! 🎉' : isTie ? '🤝 DRAW / TIE 🤝' : '💀 DEFEAT 💀', W / 2, 330);

    // 5. Versus Cards
    const myName = localStorage.getItem('koto_player_name') || 'You';
    const cardW = 420;
    const cardH = 340;
    const yCard = 440;

    // Challenger Card
    const chX = 90;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(chX, yCard, cardW, cardH, 16);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#a0aec0';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('CHALLENGER', chX + cardW / 2, yCard + 55);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 36px sans-serif';
    ctx.fillText(challenger.name, chX + cardW / 2, yCard + 115);

    ctx.fillStyle = '#ff7675';
    ctx.font = '900 64px sans-serif';
    ctx.fillText(`${challenger.score}/5`, chX + cardW / 2, yCard + 210);

    ctx.fillStyle = '#a0aec0';
    ctx.font = '600 24px sans-serif';
    ctx.fillText(`${challenger.time.toFixed(1)}s`, chX + cardW / 2, yCard + 280);

    // VS in center
    ctx.fillStyle = '#ff7675';
    ctx.font = '900 48px sans-serif';
    ctx.fillText('VS', W / 2, yCard + cardH / 2 + 16);

    // Player Card
    const plX = W - 90 - cardW;
    ctx.fillStyle = isVictory ? 'rgba(46, 204, 113, 0.08)' : 'rgba(255, 255, 255, 0.04)';
    ctx.strokeStyle = isVictory ? '#2ecc71' : 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(plX, yCard, cardW, cardH, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#a0aec0';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('DEFENDER', plX + cardW / 2, yCard + 55);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 36px sans-serif';
    ctx.fillText(myName, plX + cardW / 2, yCard + 115);

    ctx.fillStyle = '#2ecc71';
    ctx.font = '900 64px sans-serif';
    ctx.fillText(`${playerRun.score}/5`, plX + cardW / 2, yCard + 210);

    ctx.fillStyle = '#a0aec0';
    ctx.font = '600 24px sans-serif';
    ctx.fillText(`${playerRun.time.toFixed(1)}s`, plX + cardW / 2, yCard + 280);

    // 6. Tier & Date & Watermark
    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(`JLPT ${challenger.tier || 'N5'} SPEED CHALLENGE`, W / 2, 880);

    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    ctx.fillStyle = '#a0aec0';
    ctx.font = '600 22px sans-serif';
    ctx.fillText(`BATTLE DATE: ${today.toUpperCase()}`, W / 2, 940);

    ctx.fillStyle = '#00cec9';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('KOTOQUEST.PAGES.DEV', W / 2, 1180);

    canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'kotoquest-duel-trophy.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    title: 'KotoQuest 1v1 Duel Trophy',
                    text: `1v1 Japanese Duel: ${myName} vs ${challenger.name}!\nChallenge me: https://kotoquest.pages.dev/#duel`,
                    files: [file]
                });
            } catch (e) {}
        } else {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'kotoquest-duel-trophy.png';
            a.click();
            URL.revokeObjectURL(url);
            window.showToast('Duel Story Trophy downloaded!');
        }
    }, 'image/png');
}
window.generateDuelStoryTrophy = generateDuelStoryTrophy;

// 7. Particle Cheat Sheet Generator (1200x1600 Canvas)
function openCheatSheetModal() {
    const overlay = document.getElementById('cheat-sheet-overlay');
    if (!overlay) return;
    overlay.classList.add('show');

    const langSelect = document.getElementById('cheat-sheet-lang-select');
    const setSelect = document.getElementById('cheat-sheet-set-select');
    const currentLang = player.nativeLanguage || 'telugu';
    const currentSet = (setSelect && setSelect.value) || 'core';
    if (langSelect) langSelect.value = currentLang;
    drawParticleCheatSheet(currentLang, currentSet);
}
window.openCheatSheetModal = openCheatSheetModal;

function closeCheatSheetModal() {
    const overlay = document.getElementById('cheat-sheet-overlay');
    if (overlay) overlay.classList.remove('show');
    if (window.location.hash.startsWith('#cheatsheet')) {
        history.replaceState(null, '', '#bridge');
    }
}
window.closeCheatSheetModal = closeCheatSheetModal;

function drawParticleCheatSheet(targetLang = 'telugu', targetSet = 'core') {
    const canvas = document.getElementById('cheat-sheet-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 1200;
    const H = 1600;

    // 1. Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#0a0d18');
    bgGrad.addColorStop(0.5, '#12172b');
    bgGrad.addColorStop(1, '#080a14');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Decorative Gold Borders
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, W - 60, H - 60);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(42, 42, W - 84, H - 84);

    const bSize = 30;
    const corners = [
        [30, 30, 1, 1],
        [W - 30, 30, -1, 1],
        [30, H - 30, 1, -1],
        [W - 30, H - 30, -1, -1]
    ];
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 5;
    corners.forEach(([cx, cy, dx, dy]) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy + dy * bSize);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx + dx * bSize, cy);
        ctx.stroke();
    });

    // 3. Header Titles
    ctx.textAlign = 'center';
    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('言クエスト · KOTOQUEST LINGUISTIC ACADEMY', W / 2, 90);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 44px serif';
    ctx.fillText('JAPANESE PARTICLES CHEAT SHEET', W / 2, 145);

    const langNames = {
        telugu: 'Telugu (తెలుగు)',
        hindi: 'Hindi (हिन्दी)',
        tamil: 'Tamil (தமிழ்)',
        korean: 'Korean (한국어)',
        spanish: 'Spanish (Español)',
        kannada: 'Kannada (ಕನ್ನಡ)',
        malayalam: 'Malayalam (മലയാളം)',
        english: 'English'
    };
    const setLabels = {
        core: 'Core Particles (は, が, を, に, で, の, と, から, まで, も)',
        advanced: 'Advanced Particles (へ, より, か, や, ね, よ, し, のに, ので, たら/ば)'
    };
    ctx.fillStyle = '#00cec9';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`Comparative Postpositional Grammar: Japanese ↔ ${langNames[targetLang] || 'English'} [${setLabels[targetSet] || setLabels.core}]`, W / 2, 185);

    // 4. Table Header Row
    const startY = 220;
    const rowH = 125;
    const colX = { p: 70, role: 210, en: 440, nat: 680, ex: 880 };

    ctx.fillStyle = 'rgba(212, 175, 55, 0.15)';
    ctx.fillRect(50, startY, W - 100, 45);

    ctx.fillStyle = '#f1c40f';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('PARTICLE', colX.p, startY + 28);
    ctx.fillText('ROLE', colX.role, startY + 28);
    ctx.fillText('ENGLISH MEANING', colX.en, startY + 28);
    ctx.fillText(targetLang.toUpperCase() + ' EQUIVALENT', colX.nat, startY + 28);
    ctx.fillText('EXAMPLE SENTENCE', colX.ex, startY + 28);

    // 5. Table Rows (from PARTICLE_CALC_DATA)
    const allKeys = Object.keys(PARTICLE_CALC_DATA);
    const keys = targetSet === 'advanced' ? allKeys.slice(10, 20) : allKeys.slice(0, 10);
    keys.forEach((k, idx) => {
        const item = PARTICLE_CALC_DATA[k];
        const y = startY + 50 + idx * rowH;

        if (idx % 2 === 1) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
            ctx.fillRect(50, y, W - 100, rowH);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(50, y + rowH);
        ctx.lineTo(W - 50, y + rowH);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 28px serif';
        ctx.fillText(item.title, colX.p, y + 45);

        ctx.fillStyle = '#ff7675';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(item.role, colX.role, y + 42);

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '15px sans-serif';
        ctx.fillText(item.english, colX.en, y + 42);

        ctx.fillStyle = '#00cec9';
        ctx.font = 'bold 16px sans-serif';
        const nativeVal = item[targetLang] || item.english || '-';
        ctx.fillText(nativeVal, colX.nat, y + 42);

        if (item.examples && item.examples[0]) {
            const ex = item.examples[0];
            ctx.fillStyle = '#ffffff';
            ctx.font = '15px serif';
            ctx.fillText(ex.ja, colX.ex, y + 35);

            ctx.fillStyle = '#a0aec0';
            ctx.font = '13px sans-serif';
            ctx.fillText(ex.ro, colX.ex, y + 55);

            ctx.fillStyle = '#f1c40f';
            ctx.font = '13px sans-serif';
            const shortLang = { telugu: 'te', hindi: 'hi', tamil: 'ta', korean: 'ko', spanish: 'es', kannada: 'kn', malayalam: 'ml' }[targetLang] || 'en';
            const exTrans = ex[shortLang] || ex.en;
            ctx.fillText(exTrans, colX.ex, y + 75);
        }
    });

    // 6. Footer Watermark
    ctx.textAlign = 'center';
    ctx.fillStyle = '#a0aec0';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('FREE OFFLINE JLPT ACADEMY · KOTOQUEST.PAGES.DEV', W / 2, 1540);
}
window.drawParticleCheatSheet = drawParticleCheatSheet;

function downloadParticleCheatSheet() {
    const canvas = document.getElementById('cheat-sheet-canvas');
    if (!canvas) return;
    const langSelect = document.getElementById('cheat-sheet-lang-select');
    const lang = (langSelect && langSelect.value) || 'telugu';

    canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kotoquest-japanese-particles-${lang}-cheatsheet.png`;
        a.click();
        URL.revokeObjectURL(url);
        window.showToast('Cheat Sheet downloaded in HD!');
    }, 'image/png');
}

async function shareParticleCheatSheet() {
    const canvas = document.getElementById('cheat-sheet-canvas');
    if (!canvas) return;
    const langSelect = document.getElementById('cheat-sheet-lang-select');
    const lang = (langSelect && langSelect.value) || 'telugu';

    canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `kotoquest-particles-${lang}-cheatsheet.png`, { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    title: 'Japanese Particles Cheat Sheet · KotoQuest',
                    text: `Japanese particles comparative grammar cheat sheet for ${lang.toUpperCase()} speakers! 🏯🇯🇵\nFree at: https://kotoquest.pages.dev/#bridge`,
                    files: [file]
                });
            } catch (e) {}
        } else {
            downloadParticleCheatSheet();
            window.shareQuestProgress({
                title: 'Japanese Particles Cheat Sheet',
                text: 'Comparative Japanese particles grammar cheat sheet! 🏯🇯🇵',
                url: 'https://kotoquest.pages.dev/#bridge'
            });
        }
    }, 'image/png');
}

// 8. Custom PWA Install Prompt Logic
let deferredPwaPrompt = null;
function setupPwaInstallPrompt() {
    const banner = document.getElementById('pwa-install-banner');
    const installBtn = document.getElementById('btn-pwa-install');
    const dismissBtn = document.getElementById('btn-pwa-dismiss');

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPwaPrompt = e;

        const dismissed = localStorage.getItem('koto_pwa_dismissed');
        if (dismissed && Date.now() - parseInt(dismissed, 10) < 3 * 24 * 60 * 60 * 1000) {
            return;
        }
        if (banner) banner.style.display = 'flex';
    });

    window.addEventListener('appinstalled', () => {
        if (banner) banner.style.display = 'none';
        deferredPwaPrompt = null;
        if (typeof window.showToast === 'function') window.showToast('KotoQuest successfully installed!');
    });

    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (deferredPwaPrompt) {
                deferredPwaPrompt.prompt();
                const choice = await deferredPwaPrompt.userChoice;
                if (choice.outcome === 'accepted') {
                    if (banner) banner.style.display = 'none';
                }
                deferredPwaPrompt = null;
            }
        });
    }

    if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
            if (banner) banner.style.display = 'none';
            localStorage.setItem('koto_pwa_dismissed', Date.now().toString());
        });
    }
}

// 9. Viral Growth Engine Event Binds
function setupViralGrowthEngine() {
    const openDailyBtn = document.getElementById('btn-open-daily');
    if (openDailyBtn) {
        openDailyBtn.addEventListener('click', () => openDailyChallenge());
    }
    const closeDailyBtn = document.getElementById('daily-close-btn');
    if (closeDailyBtn) {
        closeDailyBtn.addEventListener('click', () => closeDailyChallenge());
    }

    const openCertBtn = document.getElementById('btn-open-cert');
    if (openCertBtn) {
        openCertBtn.addEventListener('click', () => openCertificateModal());
    }
    const rankBadgeBtn = document.getElementById('rank-badge-btn');
    if (rankBadgeBtn) {
        rankBadgeBtn.addEventListener('click', () => openCertificateModal());
    }
    const closeCertBtn = document.getElementById('cert-close-btn');
    if (closeCertBtn) {
        closeCertBtn.addEventListener('click', () => closeCertificateModal());
    }
    const certNameInput = document.getElementById('cert-name-input');
    if (certNameInput) {
        certNameInput.addEventListener('input', (e) => {
            const val = e.target.value.trim() || 'Samurai Scholar';
            localStorage.setItem('koto_player_name', val);
            drawCertificate(val);
        });
    }
    const downloadCertBtn = document.getElementById('btn-download-cert');
    if (downloadCertBtn) {
        downloadCertBtn.addEventListener('click', () => downloadCertificate());
    }
    const shareCertBtn = document.getElementById('btn-share-cert');
    if (shareCertBtn) {
        shareCertBtn.addEventListener('click', () => shareCertificate());
    }
    const copyCertBtn = document.getElementById('btn-copy-cert-link');
    if (copyCertBtn) {
        copyCertBtn.addEventListener('click', () => {
            const url = 'https://kotoquest.pages.dev/#certificate';
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).then(() => {
                    window.showToast('Certificate link copied to clipboard!');
                });
            } else {
                prompt('Copy link:', url);
            }
        });
    }

    const openDuelBtn = document.getElementById('btn-open-duel');
    if (openDuelBtn) {
        openDuelBtn.addEventListener('click', () => openDuelModal());
    }
    const closeDuelBtn = document.getElementById('duel-close-btn');
    if (closeDuelBtn) {
        closeDuelBtn.addEventListener('click', () => closeDuelModal());
    }
    const startDuelBtn = document.getElementById('btn-start-duel');
    if (startDuelBtn) {
        startDuelBtn.addEventListener('click', () => startActiveDuel());
    }

    const openCheatSheetBtn = document.getElementById('btn-open-cheat-sheet');
    if (openCheatSheetBtn) {
        openCheatSheetBtn.addEventListener('click', () => openCheatSheetModal());
    }
    const closeCheatSheetBtn = document.getElementById('cheat-sheet-close-btn');
    if (closeCheatSheetBtn) {
        closeCheatSheetBtn.addEventListener('click', () => closeCheatSheetModal());
    }
    const cheatSheetLangSelect = document.getElementById('cheat-sheet-lang-select');
    const cheatSheetSetSelect = document.getElementById('cheat-sheet-set-select');
    const redrawCheatSheet = () => {
        const lang = (cheatSheetLangSelect && cheatSheetLangSelect.value) || 'telugu';
        const set = (cheatSheetSetSelect && cheatSheetSetSelect.value) || 'core';
        drawParticleCheatSheet(lang, set);
    };
    if (cheatSheetLangSelect) cheatSheetLangSelect.addEventListener('change', redrawCheatSheet);
    if (cheatSheetSetSelect) cheatSheetSetSelect.addEventListener('change', redrawCheatSheet);
    const downloadCheatSheetBtn = document.getElementById('btn-download-cheat-sheet');
    if (downloadCheatSheetBtn) {
        downloadCheatSheetBtn.addEventListener('click', () => downloadParticleCheatSheet());
    }
    const shareCheatSheetBtn = document.getElementById('btn-share-cheat-sheet');
    if (shareCheatSheetBtn) {
        shareCheatSheetBtn.addEventListener('click', () => shareParticleCheatSheet());
    }

    [
        { overlayId: 'daily-overlay', closeFn: closeDailyChallenge },
        { overlayId: 'certificate-overlay', closeFn: closeCertificateModal },
        { overlayId: 'duel-overlay', closeFn: closeDuelModal },
        { overlayId: 'cheat-sheet-overlay', closeFn: closeCheatSheetModal }
    ].forEach(({ overlayId, closeFn }) => {
        const overlay = document.getElementById(overlayId);
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeFn();
            });
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeDailyChallenge();
            closeCertificateModal();
            closeDuelModal();
            closeCheatSheetModal();
        }
    });
}

// --- ==================================================== ---
// --- URL HASH ROUTING & DEEP LINKING ENGINE               ---
// --- ==================================================== ---
function parseHash() {
    const raw = (window.location.hash || '').replace(/^#/, '').trim();
    if (!raw) return null;
    const [tab, queryString] = raw.split('?');
    const params = {};
    if (queryString) {
        new URLSearchParams(queryString).forEach((val, key) => {
            params[key] = val;
        });
    }
    return { tab: tab.toLowerCase(), params };
}

function updateURLHash(tab, params = {}) {
    let hash = '#' + tab;
    const query = [];
    for (const [k, v] of Object.entries(params)) {
        if (v) query.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
    }
    if (query.length > 0) hash += '?' + query.join('&');
    if (window.location.hash !== hash) {
        history.replaceState(null, '', hash);
    }
}
window.updateURLHash = updateURLHash;

function handleHashRouting() {
    const parsed = parseHash();
    if (!parsed || !parsed.tab) return false;
    
    const { tab, params } = parsed;

    // Modal routes
    if (tab === 'daily') {
        openDailyChallenge();
        return true;
    } else if (tab === 'certificate') {
        openCertificateModal();
        return true;
    } else if (tab === 'duel') {
        openDuelModal(params);
        return true;
    } else if (tab === 'cheatsheet') {
        openCheatSheetModal();
        return true;
    }

    const targetEl = document.getElementById(tab);
    if (!targetEl) return false;
    
    // Activate main tab without re-updating hash to prevent loops
    if (typeof window.activateTab === 'function') {
        window.activateTab(tab, true);
    }
    
    // Handle sub-states
    if (tab === 'curriculum') {
        if (params.lesson && typeof window.activateLesson === 'function') {
            window.activateLesson(params.lesson, true);
            player.currentLesson = params.lesson;
            saveGameData();
        }
    } else if (tab === 'arena') {
        if (params.tier) {
            const tierUpper = params.tier.toUpperCase();
            const btn = document.querySelector(`#quest-tier-selector .quest-tier-btn[data-tier="${tierUpper}"]`);
            if (btn && !btn.classList.contains('active')) {
                btn.click();
            }
        }
    } else if (tab === 'bridge') {
        if (params.p) {
            const pLower = params.p.toLowerCase();
            const btn = document.querySelector(`#particle-calc-buttons .p-calc-btn[data-p="${pLower}"]`);
            if (btn) btn.click();
        }
    } else if (tab === 'kana') {
        if (params.type) {
            const btn = document.querySelector(`#kana-type-toggle .toggle-btn[data-type="${params.type.toLowerCase()}"]`);
            if (btn) btn.click();
        }
    } else if (tab === 'exam' || tab === 'reading' || tab === 'listening') {
        if (typeof window.renderPracticeTab === 'function') {
            window.renderPracticeTab(tab, params.level);
        }
    }
    return true;
}

function setupHashRouting() {
    window.addEventListener('hashchange', () => {
        handleHashRouting();
    });
    
    const routed = handleHashRouting();
    if (!routed) {
        const initialTab = (player.lastTab && document.getElementById(player.lastTab)) ? player.lastTab : 'arena';
        if (typeof window.activateTab === 'function') {
            window.activateTab(initialTab);
        }
    }
}

// --- APP INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    loadGameData();
    captureLessonOriginals();
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

    // "Report a translation issue" -> prefilled GitHub issue
    setupReportButton();

    // Reset Game bind
    setupResetGameButton();

    // Register PWA Service Worker for offline installation
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(err => console.log('PWA ServiceWorker registration failed:', err));
    }
    setupPwaInstallPrompt();

    // Keyboard Shortcuts (1-4 for battle, Space/Arrows for flashcards)
    setupKeyboardShortcuts();

    // 3D / juice: card tilt, hero parallax, optional WebGL battle mode
    setupCardTilt();
    setupHeroParallax();
    setupArena3dToggle();

    // Social Sharing & Bragging Loops
    setupSocialSharing();
    setupViralGrowthEngine();

    // Academy Platform Expansions: Audio, Kanji, Global Search, Grammar Handbook, Profile
    setupAudioControls();
    setupKanjiDojo();
    setupGlobalSearch();
    setupGrammarHandbook();
    setupSamuraiProfile();

    // Deep Linking & Hash Routing
    setupHashRouting();
    
    // Draw initial HUD & start first battle
    updateHUDDisplays();
    startNewBattle();
});

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ignore game shortcuts while any modal overlay is open
        if (document.querySelector('.onboarding-overlay.show, .help-overlay.show, .daily-overlay.show, .cert-overlay.show, .duel-overlay.show, .cheat-sheet-overlay.show')) return;
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
                if (loaded.inventory && loaded.inventory.streakFreeze > 0) {
                    loaded.inventory.streakFreeze--;
                    if (typeof showToast === 'function') {
                        showToast(`❄️ Streak Freeze activated! Your ${player.streak}-day streak was saved!`);
                    }
                } else {
                    player.streak = 0; // Streak reset due to inactivity
                }
            }
        }
        
        if (loaded.inventory && typeof loaded.inventory === 'object') {
            player.inventory = {
                potion: typeof loaded.inventory.potion === 'number' ? loaded.inventory.potion : 1,
                shield: typeof loaded.inventory.shield === 'number' ? loaded.inventory.shield : 1,
                hint: typeof loaded.inventory.hint === 'number' ? loaded.inventory.hint : 1,
                streakFreeze: typeof loaded.inventory.streakFreeze === 'number' ? loaded.inventory.streakFreeze : 0
            };
        } else {
            player.inventory = { potion: 1, shield: 1, hint: 1, streakFreeze: 0 };
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
        if (typeof showToast === 'function') {
            showToast(`🔥 Streak extended! ${player.streak} days in a row!`);
        }
    } else if (diffDays > 1) {
        if (player.inventory && player.inventory.streakFreeze > 0) {
            player.inventory.streakFreeze--;
            player.streak++;
            player.lastActiveDate = today;
            addLog(`❄️ Streak Freeze activated! Your ${player.streak}-day streak was saved!`, 'heal');
            if (typeof showToast === 'function') {
                showToast(`❄️ Streak Freeze activated! ${player.streak} days preserved!`);
            }
        } else {
            player.streak = 1;
            player.lastActiveDate = today;
            addLog("Streak reset to 1 day. Keep up the daily practice! 💪", "system");
        }
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
    const items = ['potion', 'shield', 'hint', 'streakFreeze'];
    items.forEach(item => {
        const qty = player.inventory[item] || 0;
        const badge = document.getElementById(`badge-${item}`);
        const slot = document.getElementById(`slot-${item}`);
        
        if (qty > 0) {
            if (badge) {
                badge.textContent = qty;
                badge.style.display = 'flex';
            }
            if (slot) slot.classList.remove('empty');
        } else {
            if (badge) badge.style.display = 'none';
            if (slot) slot.classList.add('empty');
        }
    });
}

// --- SPEECH SYNTHESIS ENGINE ---
let cachedJaVoice = null;
function loadJapaneseVoice() {
    if (!('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
        cachedJaVoice = voices.find(v => v.lang === 'ja-JP' || v.lang === 'ja_JP' || (v.lang && v.lang.startsWith('ja'))) || null;
    }
}
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    loadJapaneseVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadJapaneseVoice;
    }
}

function speakJapanese(text, rate) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ja-JP';

        if (!cachedJaVoice) loadJapaneseVoice();
        if (cachedJaVoice) utterance.voice = cachedJaVoice;

        utterance.rate = typeof rate === 'number' ? rate : 0.8;
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

    const activateTab = (targetTab, skipHash = false) => {
        if (window.KotoAudio && window.KotoAudio.sfx) {
            window.KotoAudio.sfx.click();
        }
        navTabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-tab') === targetTab));
        tabPanels.forEach(p => p.classList.remove('active'));
        const targetEl = document.getElementById(targetTab);
        if (targetEl) targetEl.classList.add('active');
        if (targetTab === 'canvas') {
            resizeCanvas();
            drawCanvasGuide();
        } else if (targetTab === 'kanji') {
            renderKanjiGrid();
        } else if (targetTab === 'bridge') {
            renderGrammarHandbook();
        }
        if (!skipHash && typeof updateURLHash === 'function') {
            updateURLHash(targetTab);
        }
    };
    window.activateTab = activateTab;

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            activateTab(targetTab);
            player.lastTab = targetTab;
            saveGameData();
        });
    });

    // Resume the tab the user was last on (only if no hash is present in the URL).
    if (!window.location.hash && player.lastTab && document.getElementById(player.lastTab)) {
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

    const activateLesson = (paneId, skipHash = false) => {
        nav.querySelectorAll('.lesson-btn').forEach(b => b.classList.toggle('active', b.getAttribute('data-pane') === paneId));
        panes.forEach(p => p.classList.remove('active'));
        const pane = document.getElementById(paneId);
        if (pane) pane.classList.add('active');
        ensureLessonI18n(renderLessonSummary);
        renderLessonEnControls();
        if (!skipHash && typeof updateURLHash === 'function') {
            updateURLHash('curriculum', { lesson: paneId });
        }
    };
    window.activateLesson = activateLesson;

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
    if (resume) activateLesson(resume, true);
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
    
    function getCanvasCoords(clientX, clientY) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = rect.width ? canvas.width / rect.width : 1;
        const scaleY = rect.height ? canvas.height / rect.height : 1;
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    // Mobile Touch binds
    canvas.addEventListener('touchstart', (e) => {
        if (!e.touches || e.touches.length === 0) return;
        e.preventDefault();
        const touch = e.touches[0];
        isDrawing = true;
        const coords = getCanvasCoords(touch.clientX, touch.clientY);
        lastX = coords.x;
        lastY = coords.y;
    }, { passive: false });
    canvas.addEventListener('touchmove', (e) => {
        if (!isDrawing || !e.touches || e.touches.length === 0) return;
        e.preventDefault();
        const touch = e.touches[0];
        const coords = getCanvasCoords(touch.clientX, touch.clientY);
        drawStroke(lastX, lastY, coords.x, coords.y);
        lastX = coords.x;
        lastY = coords.y;
    }, { passive: false });
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
    const scaleX = rect.width ? canvas.width / rect.width : 1;
    const scaleY = rect.height ? canvas.height / rect.height : 1;
    lastX = (e.clientX - rect.left) * scaleX;
    lastY = (e.clientY - rect.top) * scaleY;
}

function drawing(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width ? canvas.width / rect.width : 1;
    const scaleY = rect.height ? canvas.height / rect.height : 1;
    const curX = (e.clientX - rect.left) * scaleX;
    const curY = (e.clientY - rect.top) * scaleY;
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

window.setCanvasGuideCharacter = function(char) {
    if (!char || !Array.isArray(CANVAS_GUIDES)) return;
    let idx = CANVAS_GUIDES.findIndex(g => g.ja === char);
    if (idx === -1) {
        CANVAS_GUIDES.push({ ja: char, ro: 'Kanji', type: 'Kanji' });
        idx = CANVAS_GUIDES.length - 1;
    }
    guideIdx = idx;
    updateGuide();
};

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
    saveGameData();
    
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
const LANG_PACK_CODES = { telugu: 'te', hindi: 'hi', korean: 'ko', tamil: 'ta', spanish: 'es', kannada: 'kn', malayalam: 'ml' };

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
    if (window.KotoAudio && window.KotoAudio.sfx) window.KotoAudio.sfx.sword();
    const s = document.getElementById('enemy-sprite');
    fxShake(s, 'fx-hit');
    fxDamageNumber(s, `-${dmg}`, 'dmg-enemy');
    if (window.arena3d && window.arena3d.active) window.arena3d.hit();
}

function fxPlayerHit(dmg) {
    if (window.KotoAudio && window.KotoAudio.sfx) window.KotoAudio.sfx.hit();
    fxShake(document.querySelector('.rpg-arena'), 'fx-screenshake');
    fxDamageNumber(document.querySelector('.game-hud'), `-${dmg} HP`, 'dmg-player');
}

function fxShieldBlock() {
    if (window.KotoAudio && window.KotoAudio.sfx) window.KotoAudio.sfx.click();
    const s = document.getElementById('slot-shield');
    fxShake(s, 'fx-hit');
    fxDamageNumber(s, 'BLOCKED', 'dmg-block');
}

function fxVictory() {
    if (window.KotoAudio && window.KotoAudio.sfx) window.KotoAudio.sfx.coin();
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

// --- FULL LESSON PROSE TRANSLATION (lazy js/lang/lessons-html.js) ---
// The lesson panes are English HTML in index.html. We capture each pane's
// original English HTML once at startup, then swap innerHTML to the translated
// version when a language is selected (English restores the original).
// Japanese examples, kana, romaji and data-speak audio are preserved verbatim
// in the translations; speak/tab links keep working (they're delegated).
const ORIG_LESSON_HTML = {};
function captureLessonOriginals() {
    document.querySelectorAll('.day-pane').forEach(p => { ORIG_LESSON_HTML[p.id] = p.innerHTML; });
}

function ensureLessonHtml(onReady) {
    const code = LANG_PACK_CODES[player.nativeLanguage];
    if (!code) { if (onReady) onReady(); return; } // english: originals only
    window.LESSON_HTML = window.LESSON_HTML || {};
    if (window.LESSON_HTML[code]) { if (onReady) onReady(); return; }
    const s = document.createElement('script');
    s.src = `js/lang/lessons-html-${code}.js`;
    s.onload = () => { if (onReady) onReady(); };
    s.onerror = () => { console.log('Lesson translations failed to load'); if (onReady) onReady(); };
    document.head.appendChild(s);
}

function applyLessonLanguage() {
    const code = LANG_PACK_CODES[player.nativeLanguage];
    document.querySelectorAll('.day-pane').forEach(pane => {
        const orig = ORIG_LESSON_HTML[pane.id];
        if (orig === undefined) return;
        const t = code && window.LESSON_HTML && window.LESSON_HTML[code] && window.LESSON_HTML[code][pane.id];
        pane.innerHTML = t || orig;
    });
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

// --- ENGLISH MIRROR TOGGLE ---
// When studying in a native language, offer a one-tap reveal of the English
// version of the open lesson (the original captured in ORIG_LESSON_HTML), so a
// learner can cross-reference without leaving their language. English selected
// -> no toggle (the lesson is already English).
const lessonEnOn = () => localStorage.getItem('kotoquest_lesson_en') === '1';
function renderLessonEnControls() {
    const pane = document.querySelector('.day-pane.active');
    if (!pane) return;
    const code = LANG_PACK_CODES[player.nativeLanguage];
    let toggle = pane.querySelector('.lesson-en-toggle');
    let mirror = pane.querySelector('.lesson-en-mirror');
    if (!code || ORIG_LESSON_HTML[pane.id] === undefined) {
        if (toggle) toggle.remove();
        if (mirror) mirror.remove();
        return;
    }
    if (!toggle) {
        toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'lesson-en-toggle';
        toggle.addEventListener('click', () => {
            localStorage.setItem('kotoquest_lesson_en', lessonEnOn() ? '0' : '1');
            renderLessonEnControls();
        });
        const summary = pane.querySelector('.lesson-native-summary');
        const card = pane.querySelector('.glass-card');
        const title = card ? card.querySelector('.card-title') : null;
        if (summary) summary.insertAdjacentElement('afterend', toggle);
        else if (title) title.insertAdjacentElement('afterend', toggle);
        else pane.prepend(toggle);
    }
    const on = lessonEnOn();
    toggle.setAttribute('aria-expanded', on ? 'true' : 'false');
    toggle.innerHTML = `<i class="fa-solid fa-language"></i> ${on ? 'Hide' : 'Show'} English`;
    if (on) {
        if (!mirror) {
            mirror = document.createElement('div');
            mirror.className = 'lesson-en-mirror';
            pane.appendChild(mirror);
        }
        mirror.innerHTML = '<div class="lesson-en-mirror-label"><i class="fa-solid fa-language"></i> English</div>' + ORIG_LESSON_HTML[pane.id];
    } else if (mirror) {
        mirror.remove();
    }
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

// Opens a prefilled GitHub issue for the current flashcard so users can flag
// translation errors — the durable long-tail fix for the AI-generated glosses.
function setupReportButton() {
    const btn = document.getElementById('btn-report-card');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const list = getActiveCardList();
        const card = list[cardIdx];
        if (!card) return;
        const lang = player.nativeLanguage || 'english';
        const native = getNativeGloss(card) || '(no native gloss)';
        const title = `Translation issue: ${card.ja} [${lang}]`;
        const body = [
            `**Word:** ${card.ja} (${card.pronounce || ''})`,
            `**English:** ${card.meaning}`,
            `**Language:** ${lang}`,
            `**Current gloss:** ${native}`,
            '',
            '**Suggested correction:** ',
            '**Notes:** ',
        ].join('\n');
        const url = `https://github.com/ash01ish/KotoQuest/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}&labels=translation`;
        window.open(url, '_blank', 'noopener');
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
        feedback.innerHTML = '<i class="fa-solid fa-circle-check"></i> Correct order! (+15 XP, +10 Gold)';
        player.xp += 15;
        player.gold += 10;
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
            const activeTab = document.querySelector('.nav-tab.active');
            if (activeTab && activeTab.getAttribute('data-tab') === 'arena' && typeof updateURLHash === 'function') {
                updateURLHash('arena', { tier: currentTier });
            }
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

        let leveledUp = false;
        while (player.xp >= player.maxXp) {
            player.level++;
            player.xp -= player.maxXp;
            player.maxHp += 20;
            player.hp = player.maxHp;
            player.maxXp = Math.round(player.maxXp * 1.5);
            addLog(`LEVEL UP! You reached Level ${player.level}! Max HP increased to ${player.maxHp}!`, 'critical');
            leveledUp = true;
        }
        
        updateHUDDisplays();
        saveGameData();

        if (leveledUp) {
            if (window.KotoAudio && window.KotoAudio.sfx) window.KotoAudio.sfx.levelUp();
            addBragLogEntry(`🎉 Share Level ${player.level}!`, () => {
                const text = `⚔️ I reached Level ${player.level} on KotoQuest! Defeating monsters while mastering Japanese.\nFree offline JLPT academy:`;
                window.shareQuestProgress({
                    title: `Level ${player.level} on KotoQuest`,
                    text: text,
                    url: `https://kotoquest.pages.dev/#arena?tier=${currentTier}`
                });
            });
            if (player.level === 5 || player.level === 12 || player.level === 20) {
                addBragLogEntry(`📜 Claim Samurai Certificate!`, () => {
                    if (typeof window.openCertificateModal === 'function') window.openCertificateModal();
                });
            }
        } else if (currentTier === 'N1' || currentTier === 'N2' || currentTier === 'N3') {
            addBragLogEntry(`⚔️ Brag Victory over ${activeEnemy.name}!`, () => {
                const text = `⚔️ I defeated ${activeEnemy.name} (JLPT ${currentTier}) in KotoQuest Quest Arena!`;
                window.shareQuestProgress({
                    title: `Defeated ${activeEnemy.name} on KotoQuest`,
                    text: text,
                    url: `https://kotoquest.pages.dev/#arena?tier=${currentTier}`
                });
            });
        }
        
        // 1v1 Duel Challenge hook
        addBragLogEntry(`⚔️ 1v1 Duel a Friend!`, () => {
            if (typeof window.openDuelModal === 'function') {
                window.openDuelModal({ tier: currentTier });
            }
        });
        
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
        if (window.KotoAudio && window.KotoAudio.sfx) window.KotoAudio.sfx.heal();
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
            if (window.KotoAudio && window.KotoAudio.sfx) window.KotoAudio.sfx.click();
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
            if (item === 'streakFreeze') cost = 100;
            
            if (player.gold >= cost) {
                player.gold -= cost;
                player.inventory[item] = (player.inventory[item] || 0) + 1;
                if (window.KotoAudio && window.KotoAudio.sfx) window.KotoAudio.sfx.coin();
                
                const itemNames = { potion: 'Healing Potion', shield: 'Grammar Shield', hint: 'Hint Scroll', streakFreeze: 'Streak Freeze' };
                addLog(`Bought 1 ${itemNames[item] || item} from merchant shop!`, 'system');
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
    const container = document.getElementById('particle-calc-buttons');
    if (container) {
        container.innerHTML = '';
        Object.keys(PARTICLE_CALC_DATA).forEach((k, idx) => {
            const btn = document.createElement('button');
            btn.className = 'btn p-calc-btn' + (idx === 0 ? ' btn-teal active' : '');
            btn.setAttribute('data-p', k);
            btn.textContent = PARTICLE_CALC_DATA[k].title;
            btn.addEventListener('click', () => {
                container.querySelectorAll('.p-calc-btn').forEach(b => {
                    b.classList.remove('active', 'btn-teal');
                });
                btn.classList.add('active', 'btn-teal');
                renderParticleCalculator(k);
                const activeTab = document.querySelector('.nav-tab.active');
                if (activeTab && activeTab.getAttribute('data-tab') === 'bridge' && typeof updateURLHash === 'function') {
                    updateURLHash('bridge', { p: k });
                }
            });
            container.appendChild(btn);
        });
    }
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
        spanish: 'Spanish Equivalent',
        kannada: 'Kannada Equivalent',
        malayalam: 'Malayalam Equivalent'
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
        
        const shortLang = { telugu: 'te', hindi: 'hi', korean: 'ko', tamil: 'ta', spanish: 'es', kannada: 'kn', malayalam: 'ml' }[lang];
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

    // 0c. Translate the full lesson prose into the native language (English fallback),
    //     then re-add the native summary on top of the (now translated) open lesson.
    ensureLessonHtml(() => {
        applyLessonLanguage();
        ensureLessonI18n(renderLessonSummary);
        renderLessonEnControls();
    });

    // 0d. Refresh practice modules (reading, listening, exam) in the new native language
    if (typeof window.refreshPracticeModules === 'function') {
        window.refreshPracticeModules();
    }

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
    
    // 2. Comparative table columns (Telugu, Hindi, Tamil, Korean, Spanish)
    const langCols = {
        telugu: document.querySelectorAll('.lang-col-te'),
        hindi: document.querySelectorAll('.lang-col-hi'),
        tamil: document.querySelectorAll('.lang-col-ta'),
        korean: document.querySelectorAll('.lang-col-ko'),
        spanish: document.querySelectorAll('.lang-col-es')
    };
    Object.values(langCols).forEach(nodeList => nodeList.forEach(el => el.style.display = 'none'));
    if (langCols[lang]) {
        langCols[lang].forEach(el => el.style.display = '');
    }

    // Update Bridge header title
    const bridgeTitle = document.getElementById('bridge-header-title');
    if (bridgeTitle) {
        const titles = {
            telugu: 'Linguistic Hacks for Telugu Speakers',
            hindi: 'Linguistic Hacks for Hindi Speakers',
            tamil: 'Linguistic Hacks for Tamil Speakers',
            korean: 'Linguistic Hacks for Korean Speakers',
            spanish: 'Comparative Grammar Hacks for Spanish Speakers',
            english: 'SOV Linguistic Hacks vs SVO English'
        };
        bridgeTitle.textContent = titles[lang] || 'Linguistic Hacks for SOV Speakers';
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

// ==========================================================================
// 1. RETRO AUDIO ENGINE CONTROLS
// ==========================================================================
function setupAudioControls() {
    const btn = document.getElementById('btn-audio-toggle');
    const icon = document.getElementById('audio-toggle-icon');
    const text = document.getElementById('audio-toggle-text');
    if (!btn) return;

    function updateAudioBtn() {
        const muted = window.KotoAudio && window.KotoAudio.isMuted();
        if (icon) {
            icon.className = muted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
            icon.style.color = muted ? '#e74c3c' : 'var(--accent-gold)';
        }
        if (text) {
            text.textContent = muted ? 'MUTED' : 'SFX';
        }
    }

    btn.addEventListener('click', () => {
        if (window.KotoAudio) {
            window.KotoAudio.toggleMute();
            updateAudioBtn();
            if (!window.KotoAudio.isMuted()) {
                window.KotoAudio.sfx.coin();
            }
        }
    });

    updateAudioBtn();
}

// ==========================================================================
// 2. KANJI DOJO & EXPLORER CONTROLLER
// ==========================================================================
let currentKanjiFilter = 'all';
let currentKanjiSearch = '';

function setupKanjiDojo() {
    const filters = document.querySelectorAll('#kanji-level-filters .kanji-filter-btn');
    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentKanjiFilter = btn.getAttribute('data-filter');
            renderKanjiGrid();
        });
    });

    const searchInput = document.getElementById('kanji-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentKanjiSearch = e.target.value.trim().toLowerCase();
            renderKanjiGrid();
        });
    }

    const modalClose = document.getElementById('kanji-modal-close-btn');
    const modalOverlay = document.getElementById('kanji-detail-overlay');
    if (modalClose && modalOverlay) {
        modalClose.addEventListener('click', () => {
            modalOverlay.style.display = 'none';
        });
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) modalOverlay.style.display = 'none';
        });
    }

    renderKanjiGrid();
}

function renderKanjiGrid() {
    const grid = document.getElementById('kanji-grid');
    if (!grid) return;
    if (!window.KANJI_DATABASE || !window.KANJI_DATABASE.length) {
        grid.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding: 40px 0;">Loading Kanji Dojo...</p>';
        return;
    }

    const langCode = (typeof LANG_PACK_CODES !== 'undefined' && LANG_PACK_CODES[player.nativeLanguage]) ? LANG_PACK_CODES[player.nativeLanguage] : 'en';
    const meaningKey = `meaning_${langCode}`;

    const filtered = window.KANJI_DATABASE.filter(item => {
        if (currentKanjiFilter !== 'all' && item.jlpt !== currentKanjiFilter) return false;
        if (currentKanjiSearch) {
            const k = item.k || item.kanji || '';
            const en = (item.en || item.meaning_en || '').toLowerCase();
            const native = (item[meaningKey] || '').toLowerCase();
            const rom = (item.rom || item.romaji || '').toLowerCase();
            const on = (item.on || item.onyomi || '').toLowerCase();
            const kun = (item.kun || item.kunyomi || '').toLowerCase();
            return k.includes(currentKanjiSearch) || en.includes(currentKanjiSearch) || native.includes(currentKanjiSearch) || rom.includes(currentKanjiSearch) || on.includes(currentKanjiSearch) || kun.includes(currentKanjiSearch);
        }
        return true;
    });

    grid.innerHTML = '';
    if (filtered.length === 0) {
        grid.innerHTML = '<p style="color:var(--text-muted); grid-column: 1 / -1; text-align:center; padding: 40px 0;">No Kanji found matching your search.</p>';
        return;
    }

    filtered.forEach(item => {
        const char = item.k || item.kanji;
        const nativeMeaning = item[meaningKey] || item.en || item.meaning_en;
        const tile = document.createElement('div');
        tile.className = 'kanji-tile';
        tile.innerHTML = `
            <span class="kanji-tile-level">${item.jlpt}</span>
            <div class="kanji-tile-char">${char}</div>
            <div class="kanji-tile-meaning" title="${nativeMeaning}">${nativeMeaning}</div>
        `;
        tile.addEventListener('click', () => {
            if (window.KotoAudio && window.KotoAudio.sfx) window.KotoAudio.sfx.click();
            openKanjiModal(item);
        });
        grid.appendChild(tile);
    });
}

function openKanjiModal(item) {
    const overlay = document.getElementById('kanji-detail-overlay');
    const body = document.getElementById('kanji-modal-body');
    const drawBtn = document.getElementById('btn-kanji-draw-canvas');
    if (!overlay || !body) return;

    const char = item.k || item.kanji;
    const langCode = (typeof LANG_PACK_CODES !== 'undefined' && LANG_PACK_CODES[player.nativeLanguage]) ? LANG_PACK_CODES[player.nativeLanguage] : 'en';

    body.innerHTML = `
        <div class="kanji-detail-hero">
            <div class="kanji-detail-big">${char}</div>
            <div class="kanji-detail-meta">
                <div class="kanji-detail-meaning-en">${item.en || item.meaning_en}</div>
                ${item[`meaning_${langCode}`] ? `<div class="kanji-detail-meaning-native">${item[`meaning_${langCode}`]}</div>` : ''}
                <div class="kanji-detail-badges">
                    <span class="kanji-detail-badge"><i class="fa-solid fa-graduation-cap"></i> JLPT ${item.jlpt}</span>
                    <span class="kanji-detail-badge"><i class="fa-solid fa-pen"></i> ${item.strokes} Strokes</span>
                    <span class="kanji-detail-badge"><i class="fa-solid fa-cubes-stacked"></i> Radical: ${item.rad || item.radical}</span>
                </div>
            </div>
        </div>

        <div class="kanji-readings-box">
            <div class="reading-cell">
                <div class="reading-cell-title">Onyomi (Chinese reading)</div>
                <div class="reading-cell-val">${item.on || item.onyomi || '—'}</div>
            </div>
            <div class="reading-cell">
                <div class="reading-cell-title">Kunyomi (Japanese reading)</div>
                <div class="reading-cell-val">${item.kun || item.kunyomi || '—'}</div>
            </div>
        </div>

        ${item.compounds && item.compounds.length ? `
            <div>
                <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">Common Compounds (Jukugo)</div>
                <div class="kanji-compounds-list">
                    ${item.compounds.map(c => `
                        <div class="kanji-compound-item">
                            <div>
                                <span class="kanji-compound-ja">${c.ja}</span>
                                <span class="kanji-compound-kana">${c.kana}</span>
                            </div>
                            <div class="kanji-compound-en">${c.en}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
    `;

    if (drawBtn) {
        drawBtn.onclick = () => {
            overlay.style.display = 'none';
            if (typeof window.activateTab === 'function') {
                window.activateTab('canvas');
            }
            if (typeof window.setCanvasGuideCharacter === 'function') {
                window.setCanvasGuideCharacter(char);
            }
        };
    }

    overlay.style.display = 'flex';
}

// ==========================================================================
// 3. GLOBAL MULTILINGUAL SEARCH CONTROLLER
// ==========================================================================
let currentSearchFilter = 'all';

function setupGlobalSearch() {
    const btn = document.getElementById('btn-global-search');
    const overlay = document.getElementById('global-search-overlay');
    const closeBtn = document.getElementById('search-modal-close-btn');
    const input = document.getElementById('global-search-input');
    const pills = document.querySelectorAll('#search-filter-pills .search-pill');

    if (!overlay || !input) return;

    function openSearch() {
        overlay.style.display = 'flex';
        input.focus();
        input.select();
        if (window.KotoAudio && window.KotoAudio.sfx) window.KotoAudio.sfx.click();
    }

    function closeSearch() {
        overlay.style.display = 'none';
    }

    if (btn) btn.addEventListener('click', openSearch);
    if (closeBtn) closeBtn.addEventListener('click', closeSearch);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeSearch();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && !['input', 'textarea', 'select'].includes((document.activeElement?.tagName || '').toLowerCase())) {
            e.preventDefault();
            openSearch();
        } else if (e.key === 'Escape' && overlay.style.display === 'flex') {
            closeSearch();
        }
    });

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentSearchFilter = pill.getAttribute('data-search-filter');
            executeGlobalSearch(input.value);
        });
    });

    let searchTimer = null;
    input.addEventListener('input', (e) => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            executeGlobalSearch(e.target.value);
        }, 150);
    });
}

function executeGlobalSearch(query) {
    const container = document.getElementById('search-results-container');
    if (!container) return;
    const q = (query || '').trim().toLowerCase();
    if (!q) {
        container.innerHTML = `
            <div style="text-align: center; color: var(--text-muted); padding: 40px 0;">
                <i class="fa-solid fa-search" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.5;"></i>
                <p>Search over 8,000 words, 150+ kanji, and grammar patterns across 8 languages.</p>
            </div>
        `;
        return;
    }

    const langCode = (typeof LANG_PACK_CODES !== 'undefined' && LANG_PACK_CODES[player.nativeLanguage]) ? LANG_PACK_CODES[player.nativeLanguage] : 'en';
    const results = [];

    // 1. Search Kanji
    if (currentSearchFilter === 'all' || currentSearchFilter === 'kanji') {
        if (window.KANJI_DATABASE) {
            window.KANJI_DATABASE.forEach(k => {
                const char = k.k || k.kanji || '';
                const en = (k.en || k.meaning_en || '').toLowerCase();
                const native = (k[`meaning_${langCode}`] || '').toLowerCase();
                const rom = (k.rom || k.romaji || '').toLowerCase();
                if (char.includes(q) || en.includes(q) || native.includes(q) || rom.includes(q)) {
                    results.push({
                        type: 'Kanji',
                        ja: char,
                        reading: `${k.on || ''} / ${k.kun || ''}`,
                        en: k.en || k.meaning_en,
                        native: k[`meaning_${langCode}`] || '',
                        badge: `JLPT ${k.jlpt}`
                    });
                }
            });
        }
    }

    // 2. Search Grammar
    if (currentSearchFilter === 'all' || currentSearchFilter === 'grammar') {
        if (window.GRAMMAR_DATABASE) {
            window.GRAMMAR_DATABASE.forEach(g => {
                const pat = (g.pattern || '').toLowerCase();
                const en = (g.meaning_en || '').toLowerCase();
                const native = (g[`meaning_${langCode}`] || '').toLowerCase();
                const rom = (g.romaji || '').toLowerCase();
                if (pat.includes(q) || en.includes(q) || native.includes(q) || rom.includes(q)) {
                    results.push({
                        type: 'Grammar',
                        ja: g.pattern,
                        reading: g.romaji,
                        en: g.meaning_en,
                        native: g[`meaning_${langCode}`] || '',
                        badge: `JLPT ${g.jlpt}`
                    });
                }
            });
        }
    }

    // 3. Search Vocabulary (from loaded LANG_DB or CURATED_VOCAB)
    if (currentSearchFilter === 'all' || currentSearchFilter === 'vocab') {
        const dict = (window.LANG_DB && window.LANG_DB[langCode]) || {};
        let count = 0;
        for (const [key, gloss] of Object.entries(dict)) {
            if (count >= 20) break;
            const parts = key.split('|');
            const ja = parts[0];
            const kana = parts[1] || '';
            const en = parts[2] || '';
            if (ja.includes(q) || kana.includes(q) || en.toLowerCase().includes(q) || (gloss && gloss.toLowerCase().includes(q))) {
                results.push({
                    type: 'Vocab',
                    ja: ja,
                    reading: kana,
                    en: en,
                    native: gloss || '',
                    badge: 'Vocab'
                });
                count++;
            }
        }
    }

    if (results.length === 0) {
        container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 40px 0;"><p>No results found for "${query}".</p></div>`;
        return;
    }

    container.innerHTML = results.slice(0, 30).map(r => `
        <div class="search-result-card">
            <div>
                <div>
                    <span class="search-res-ja">${r.ja}</span>
                    <span class="search-res-reading">${r.reading}</span>
                    <span style="font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; background: rgba(255,255,255,0.08); color: var(--text-muted); margin-left: 8px;">${r.badge}</span>
                </div>
                <div class="search-res-en">${r.en}</div>
                ${r.native ? `<div class="search-res-native">${r.native}</div>` : ''}
            </div>
            <button class="btn speak-btn" data-speak="${r.ja}" style="padding: 6px 12px; font-size: 0.85rem;" title="Listen"><i class="fa-solid fa-volume-high"></i></button>
        </div>
    `).join('');

    container.querySelectorAll('.speak-btn').forEach(b => {
        b.addEventListener('click', (e) => {
            e.stopPropagation();
            speakJapanese(b.getAttribute('data-speak'));
        });
    });
}

// ==========================================================================
// 4. JLPT GRAMMAR HANDBOOK CONTROLLER
// ==========================================================================
let currentGrammarFilter = 'all';

function setupGrammarHandbook() {
    const filters = document.querySelectorAll('#grammar-level-filters .kanji-filter-btn');
    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentGrammarFilter = btn.getAttribute('data-grammar-filter');
            renderGrammarHandbook();
        });
    });

    renderGrammarHandbook();
}

function renderGrammarHandbook() {
    const grid = document.getElementById('grammar-handbook-grid');
    if (!grid) return;
    if (!window.GRAMMAR_DATABASE || !window.GRAMMAR_DATABASE.length) {
        grid.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding: 40px 0;">Loading Grammar Handbook...</p>';
        return;
    }

    const langCode = (typeof LANG_PACK_CODES !== 'undefined' && LANG_PACK_CODES[player.nativeLanguage]) ? LANG_PACK_CODES[player.nativeLanguage] : 'en';
    const filtered = window.GRAMMAR_DATABASE.filter(item => {
        if (currentGrammarFilter !== 'all' && item.jlpt !== currentGrammarFilter) return false;
        return true;
    });

    grid.innerHTML = filtered.map(item => `
        <div class="grammar-compendium-card">
            <div class="grammar-head-line">
                <div class="grammar-pat-name">${item.pattern}</div>
                <span class="grammar-level-pill">${item.jlpt}</span>
            </div>
            <div class="grammar-formula-box">${item.formation}</div>
            <div class="grammar-meanings">
                <div class="en">${item.meaning_en}</div>
                ${item[`meaning_${langCode}`] ? `<div class="native">${item[`meaning_${langCode}`]}</div>` : ''}
            </div>
            <div class="grammar-examples">
                ${(item.examples || []).map(ex => `
                    <div class="grammar-ex-item">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <span class="grammar-ex-ja">${ex.ja}</span>
                            <button class="btn speak-btn" data-speak="${ex.ja}" style="padding: 2px 6px; font-size: 0.75rem; background: transparent; border: none; color: var(--accent-teal); cursor: pointer;"><i class="fa-solid fa-volume-high"></i></button>
                        </div>
                        <div class="grammar-ex-en">${ex.en}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    grid.querySelectorAll('.speak-btn').forEach(b => {
        b.addEventListener('click', (e) => {
            e.stopPropagation();
            speakJapanese(b.getAttribute('data-speak'));
        });
    });
}

// ==========================================================================
// 5. SAMURAI PROFILE & ACHIEVEMENTS CONTROLLER
// ==========================================================================
function setupSamuraiProfile() {
    const levelDisplay = document.getElementById('player-level-display');
    const overlay = document.getElementById('samurai-profile-overlay');
    const closeBtn = document.getElementById('profile-modal-close-btn');

    if (!overlay) return;

    function openProfile() {
        overlay.style.display = 'flex';
        renderSamuraiProfile();
        if (window.KotoAudio && window.KotoAudio.sfx) window.KotoAudio.sfx.click();
    }

    function closeProfile() {
        overlay.style.display = 'none';
    }

    if (levelDisplay) levelDisplay.addEventListener('click', openProfile);
    if (closeBtn) closeBtn.addEventListener('click', closeProfile);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeProfile();
    });
}

function renderSamuraiProfile() {
    const titleEl = document.getElementById('profile-title-badge');
    const levelEl = document.getElementById('profile-level-val');
    const langEl = document.getElementById('profile-native-lang');
    const streakEl = document.getElementById('prof-streak-val');
    const accEl = document.getElementById('prof-accuracy-val');
    const battlesEl = document.getElementById('prof-battles-val');
    const kanjiEl = document.getElementById('prof-kanji-val');
    const trophyGrid = document.getElementById('trophy-room-grid');

    const rankTitles = ['Novice', 'Apprentice', 'Ronin', 'Samurai', 'Bushi', 'Hatamoto', 'Daimyo', 'Shogun'];
    const rankTitle = rankTitles[Math.min(Math.floor((player.level - 1) / 3), rankTitles.length - 1)];

    if (titleEl) titleEl.textContent = rankTitle;
    if (levelEl) levelEl.textContent = player.level;
    if (langEl) langEl.textContent = (player.nativeLanguage || 'english').toUpperCase();
    if (streakEl) streakEl.textContent = player.streak || 1;

    const totalAns = (player.stats?.totalCorrect || 0) + (player.stats?.totalWrong || 0);
    const acc = totalAns > 0 ? Math.round((player.stats.totalCorrect / totalAns) * 100) : 0;
    if (accEl) accEl.textContent = `${acc}%`;
    if (battlesEl) battlesEl.textContent = player.stats?.totalCorrect || 0;
    if (kanjiEl) kanjiEl.textContent = window.KANJI_DATABASE ? window.KANJI_DATABASE.length : 154;

    // 12 Unlockable Trophies
    const trophies = [
        { id: 'first_blood', name: 'First Victory', desc: 'Defeat your first monster in Quest Arena', icon: '⚔️', unlocked: (player.stats?.totalCorrect || 0) >= 1 },
        { id: 'streak_3', name: '3-Day Fire', desc: 'Maintain a 3-day daily streak', icon: '🔥', unlocked: (player.streak || 1) >= 3 },
        { id: 'streak_7', name: '7-Day Master', desc: 'Maintain a 7-day daily streak', icon: '⚡', unlocked: (player.streak || 1) >= 7 },
        { id: 'battle_10', name: 'Battle Hardened', desc: 'Defeat 10 monsters in Quest Arena', icon: '🛡️', unlocked: (player.stats?.totalCorrect || 0) >= 10 },
        { id: 'gold_100', name: 'Gold Hoarder', desc: 'Amass 100 Gold from quests', icon: '🪙', unlocked: (player.gold || 0) >= 100 },
        { id: 'level_5', name: 'Level 5 Bushi', desc: 'Reach Level 5 in your RPG journey', icon: '🏯', unlocked: player.level >= 5 },
        { id: 'level_10', name: 'Shogun Elite', desc: 'Reach Level 10 in your RPG journey', icon: '👑', unlocked: player.level >= 10 },
        { id: 'polyglot', name: 'Polyglot Mind', desc: 'Study Japanese via a native SOV bridge', icon: '🌐', unlocked: player.nativeLanguage && player.nativeLanguage !== 'english' },
        { id: 'kanji_explorer', name: 'Kanji Scholar', desc: 'Explore the 150+ Joyo Kanji Dojo', icon: '⛩️', unlocked: true },
        { id: 'grammar_sage', name: 'Grammar Sage', desc: 'Consult the JLPT Grammar Handbook', icon: '📜', unlocked: true },
        { id: 'potion_drinker', name: 'Alchemist', desc: 'Use a healing potion in combat', icon: '🧪', unlocked: (player.inventory?.potion || 0) > 0 || (player.hp < player.maxHp) },
        { id: 'streak_shield', name: 'Shielded Soul', desc: 'Acquire a Streak Freeze protection', icon: '❄️', unlocked: (player.inventory?.streakFreeze || 0) > 0 }
    ];

    if (trophyGrid) {
        trophyGrid.innerHTML = trophies.map(t => `
            <div class="trophy-card ${t.unlocked ? 'unlocked' : 'locked'}">
                <div class="trophy-icon">${t.icon}</div>
                <div class="trophy-name">${t.name}</div>
                <div class="trophy-desc">${t.desc}</div>
            </div>
        `).join('');
    }
}
