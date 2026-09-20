// scripts/update_ui_i18n.js
const fs = require('fs');
const path = require('path');

const uiFile = path.join(__dirname, '..', 'js', 'lang', 'ui.js');
let content = fs.readFileSync(uiFile, 'utf8');

global.window = {};
eval(content.replace('window.UI_I18N =', 'global.window.UI_I18N ='));
const UI_I18N = global.window.UI_I18N;

const LIB_STRINGS = {
  te: {
    'p.tabBooks': 'కథల లైబ్రరీ',
    'p.tabPassages': 'JLPT పేరాలు',
    'p.booksIntro': 'ఆవోజోరా బుంకో మరియు సాంప్రదాయ జానపద కథల నుండి అసలైన జపనీస్ సాహిత్య గ్రంథాలను చదవండి, వినండి మరియు నేర్చుకోండి.',
    'p.readBook': 'పుస్తకం చదవండి',
    'p.allLevels': 'అన్ని స్థాయిలు',
    'p.chapter': 'అధ్యాయం {n}',
    'p.sentenceMode': 'వాక్యం వారీగా',
    'p.passageMode': 'పూర్తి కథ',
    'p.showRomaji': 'రోమాజీ',
    'p.vocabTitle': 'అధ్యాయం పదజాలం',
    'p.quizTitle': 'అవగాహన క్విజ్',
    'p.backBooks': 'లైబ్రరీకి తిరిగి వెళ్ళు',
    'p.listenChapter': 'అధ్యాయాన్ని వినండి',
    'p.readingMinutes': '{m} నిమిషాల పఠనం'
  },
  hi: {
    'p.tabBooks': 'कथा पुस्तकालय',
    'p.tabPassages': 'JLPT गद्यांश',
    'p.booksIntro': 'आओज़ोरा बुन्को और पारंपरिक जापानी लोककथाओं से प्रामाणिक जापानी साहित्यिक कृतियों को द्विभाषी ऑडियो के साथ पढ़ें।',
    'p.readBook': 'किताब पढ़ें',
    'p.allLevels': 'सभी स्तर',
    'p.chapter': 'अध्याय {n}',
    'p.sentenceMode': 'वाक्य-दर-वाक्य',
    'p.passageMode': 'पूरी कहानी',
    'p.showRomaji': 'रोमाजी',
    'p.vocabTitle': 'अध्याय शब्दावली',
    'p.quizTitle': 'समझ परीक्षण क्विज़',
    'p.backBooks': 'पुस्तकालय पर वापस जाएँ',
    'p.listenChapter': 'अध्याय सुनें',
    'p.readingMinutes': '{m} मिनट का पाठ'
  },
  ta: {
    'p.tabBooks': 'கதை நூலகம்',
    'p.tabPassages': 'JLPT பத்திகள்',
    'p.booksIntro': 'ஆவோசோரா புங்கோ மற்றும் பாரம்பரிய நாட்டுப்புறக் கதைகளிலிருந்து உண்மையான ஜப்பானிய இலக்கிய நூல்களை இருமொழி ஆடியோவுடன் படியுங்கள்.',
    'p.readBook': 'புத்தகம் படி',
    'p.allLevels': 'அனைத்து நிலைகளும்',
    'p.chapter': 'அத்தியாயம் {n}',
    'p.sentenceMode': 'வாக்கிய வாரியாக',
    'p.passageMode': 'முழு கதை',
    'p.showRomaji': 'ரோமாஜி',
    'p.vocabTitle': 'அத்தியாயச் சொல்வளம்',
    'p.quizTitle': 'புரிதல் வினாடிவினா',
    'p.backBooks': 'நூலகத்திற்குத் திரும்பு',
    'p.listenChapter': 'அத்தியாயத்தைக் கேளுங்கள்',
    'p.readingMinutes': '{m} நிமி வாசிப்பு'
  },
  ko: {
    'p.tabBooks': '이야기 도서관',
    'p.tabPassages': 'JLPT 지문',
    'p.booksIntro': '아오조라 분코 및 일본 전래동화의 정통 문학 작품들을 2개 국어 오디오 낭독, 문장별 분석 및 어휘집과 함께 읽어보세요.',
    'p.readBook': '책 읽기',
    'p.allLevels': '모든 레벨',
    'p.chapter': '제{n}장',
    'p.sentenceMode': '문장별 보기',
    'p.passageMode': '전체 이야기',
    'p.showRomaji': '로마자',
    'p.vocabTitle': '단원 주요 어휘',
    'p.quizTitle': '이해도 퀴즈',
    'p.backBooks': '도서관으로 돌아가기',
    'p.listenChapter': '단원 전체 듣기',
    'p.readingMinutes': '{m}분 읽기'
  },
  es: {
    'p.tabBooks': 'Biblioteca de Cuentos',
    'p.tabPassages': 'Pasajes JLPT',
    'p.booksIntro': 'Lee auténticas obras maestras de la literatura japonesa y cuentos populares de Aozora Bunko con narración bilingüe y glosarios.',
    'p.readBook': 'Leer Libro',
    'p.allLevels': 'Todos los niveles',
    'p.chapter': 'Capítulo {n}',
    'p.sentenceMode': 'Frase por frase',
    'p.passageMode': 'Historia completa',
    'p.showRomaji': 'Romaji',
    'p.vocabTitle': 'Vocabulario del capítulo',
    'p.quizTitle': 'Cuestionario de comprensión',
    'p.backBooks': 'Volver a la biblioteca',
    'p.listenChapter': 'Escuchar capítulo',
    'p.readingMinutes': '{m} min de lectura'
  },
  kn: {
    'p.tabBooks': 'ಕಥಾ ಗ್ರಂಥಾಲಯ',
    'p.tabPassages': 'JLPT ಪ್ಯಾರಾಗಳು',
    'p.booksIntro': 'ಆವೋಜೋರಾ ಬುಂಕೋ ಮತ್ತು ಸಾಂಪ್ರದಾಯಿಕ ಜಾನಪದ ಕಥೆಗಳಿಂದ ಜಪಾನೀಸ್ ಸಾಹಿತ್ಯ ಕೃತಿಗಳನ್ನು ಓದಿ, ಕೇಳಿ ಮತ್ತು ಕಲಿಯಿರಿ.',
    'p.readBook': 'ಪುಸ್ತಕ ಓದಿ',
    'p.allLevels': 'ಎಲ್ಲಾ ಹಂತಗಳು',
    'p.chapter': 'ಅಧ್ಯಾಯ {n}',
    'p.sentenceMode': 'ವಾಕ್ಯದ ಪ್ರಕಾರ',
    'p.passageMode': 'ಸಂಪೂರ್ಣ ಕಥೆ',
    'p.showRomaji': 'ರೋಮಾಜಿ',
    'p.vocabTitle': 'ಅಧ್ಯಾಯದ ಶಬ್ದಕೋಶ',
    'p.quizTitle': 'ಗ್ರಹಿಕೆಯ ರಸಪ್ರಶ್ನೆ',
    'p.backBooks': 'ಗ್ರಂಥಾಲಯಕ್ಕೆ ಹಿಂತಿರುಗಿ',
    'p.listenChapter': 'ಅಧ್ಯಾಯವನ್ನು ಕೇಳಿ',
    'p.readingMinutes': '{m} ನಿಮಿಷ ಓದುವಿಕೆ'
  },
  ml: {
    'p.tabBooks': 'കഥാ ലൈബ്രറി',
    'p.tabPassages': 'JLPT ഖണ്ഡികകൾ',
    'p.booksIntro': 'ഓസോറ ബുങ്കോയിൽ നിന്നുള്ള യഥാർത്ഥ ജാപ്പനീസ് ക്ലാസിക് കഥകളും നാടോടിക്കഥകളും ഓഡിയോ സഹിതം വായിച്ചുപഠിക്കുക.',
    'p.readBook': 'പുസ്തകം വായിക്കുക',
    'p.allLevels': 'എല്ലാ ലെവലുകളും',
    'p.chapter': 'അധ്യായം {n}',
    'p.sentenceMode': 'വാചകം തോറും',
    'p.passageMode': 'മുഴുവൻ കഥ',
    'p.showRomaji': 'റോമാജി',
    'p.vocabTitle': 'അധ്യായ പദാവലി',
    'p.quizTitle': 'ഗ്രഹണ ക്വിസ്',
    'p.backBooks': 'ലൈബ്രറിയിലേക്ക് മടങ്ങുക',
    'p.listenChapter': 'അധ്യായം കേൾക്കുക',
    'p.readingMinutes': '{m} മിനിറ്റ് വായന'
  }
};

for (const lang of Object.keys(LIB_STRINGS)) {
  if (!UI_I18N[lang]) UI_I18N[lang] = {};
  Object.assign(UI_I18N[lang], LIB_STRINGS[lang]);
}

const newContent = `// Auto-generated UI chrome translations. English lives in index.html as the fallback.
window.UI_I18N = ${JSON.stringify(UI_I18N)};
`;

fs.writeFileSync(uiFile, newContent, 'utf8');
console.log('Successfully updated', uiFile);
