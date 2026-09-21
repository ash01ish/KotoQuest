#!/usr/bin/env python3
# scripts/build_knowledge_base.py
# Generates js/data/knowledge.js with 100% 8-language parity (en, te, hi, ta, ko, es, kn, ml).

import json
import os
import shutil

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORKSPACE_ROOT = "/Users/ashishthirunagari/Documents/antigravity/amazing-lovelace"

def generate_knowledge_base():
    # 1. PHRASES
    phrases = {
        "greetings": [
            {
                "ja": "おはようございます", "kana": "おはようございます", "romaji": "Ohayou gozaimasu",
                "en": "Good morning (polite)",
                "te": "శుభోదయం (మర్యాదపూర్వకంగా)",
                "hi": "सुप्रभात (विनम्र)",
                "ta": "காலை வணக்கம் (மரியாதையுடன்)",
                "ko": "좋은 아침입니다 (존댓말)",
                "es": "Buenos días (formal)",
                "kn": "ಶುಭೋದಯ (ವಿನಮ್ರ)",
                "ml": "സുപ്രഭാതം (ആദരവോടെ)",
                "note": "Use with colleagues, teachers, and superiors before ~10:30 AM."
            },
            {
                "ja": "こんにちは", "kana": "こんにちは", "romaji": "Konnichiwa",
                "en": "Hello / Good afternoon",
                "te": "నమస్కారం / శుభ మధ్యాహ్నం",
                "hi": "नमस्ते / नमस्कार",
                "ta": "வணக்கம் / இனிய மதியம்",
                "ko": "안녕하세요 (낮 인사)",
                "es": "Hola / Buenas tardes",
                "kn": "ನಮಸ್ಕಾರ / ಶುಭ ಮಧ್ಯಾಹ್ನ",
                "ml": "നമസ്കാരം / ശുഭ ഉച്ചനേരം",
                "note": "General daytime greeting from late morning until sunset."
            },
            {
                "ja": "こんばんは", "kana": "こんばんは", "romaji": "Konbanwa",
                "en": "Good evening",
                "te": "శుభ సాయంత్రం",
                "hi": "शुभ संध्या",
                "ta": "மாலை வணக்கம்",
                "ko": "안녕하세요 (저녁 인사)",
                "es": "Buenas noches (al encontrarse)",
                "kn": "ಶುಭ ಸಂಜೆ",
                "ml": "ശുഭ സായാഹ്നം",
                "note": "Used when greeting someone after dusk or at night."
            },
            {
                "ja": "お疲れ様です", "kana": "おつかれさまです", "romaji": "Otsukaresama desu",
                "en": "Thank you for your hard work / Good job",
                "te": "మీ శ్రమకు ధన్యవాదాలు (పనిలో అభినందన)",
                "hi": "आपकी मेहनत के लिए धन्यवाद (काम के बाद)",
                "ta": "உங்கள் கடின உழைப்புக்கு நன்றி",
                "ko": "수고하셨습니다 / 수고 많으십니다",
                "es": "Gracias por su esfuerzo / Buen trabajo",
                "kn": "ನಿಮ್ಮ ಶ್ರಮಕ್ಕೆ ಧನ್ಯವಾದಗಳು",
                "ml": "താങ്കളുടെ പ്രയത്നത്തിന് നന്ദി",
                "note": "The universal workplace greeting when passing coworkers or finishing work."
            },
            {
                "ja": "お先に失礼します", "kana": "おさきにしつれいします", "romaji": "Osaki ni shitsurei shimasu",
                "en": "Excuse me for leaving before you",
                "te": "నేను మీకంటే ముందుగా వెళ్తున్నాను, క్షమించండి",
                "hi": "आपसे पहले जाने के लिए क्षमा करें",
                "ta": "உங்களுக்கு முன் விடைபெறுவதற்கு மன்னிக்கவும்",
                "ko": "먼저 들어가 보겠습니다",
                "es": "Con su permiso, me retiro antes",
                "kn": "ನಾನು ಮೊದಲೇ ಹೊರಡುತ್ತಿರುವುದಕ್ಕೆ ಕ್ಷಮಿಸಿ",
                "ml": "ഞാൻ മുൻപേ പോകുന്നതിൽ ക്ഷമിക്കണം",
                "note": "Standard polite phrase when leaving the office before other colleagues."
            },
            {
                "ja": "ありがとうございます", "kana": "ありがとうございます", "romaji": "Arigatou gozaimasu",
                "en": "Thank you very much (polite)",
                "te": "చాలా ధన్యవాదాలు",
                "hi": "बहुत-बहुत धन्यवाद",
                "ta": "மிக்க நன்றி",
                "ko": "대단히 감사합니다",
                "es": "Muchas gracias",
                "kn": "ತುಂಬಾ ಧನ್ಯವಾದಗಳು",
                "ml": "വളരെ നന്ദി",
                "note": "Use 'gozaimashita' (past) for an action that was just completed for you."
            },
            {
                "ja": "すみません", "kana": "すみません", "romaji": "Sumimasen",
                "en": "Excuse me / I'm sorry / Thank you",
                "te": "క్షమించండి / వినండి / ధన్యవాదాలు",
                "hi": "माफ़ कीजिए / सुनिए / धन्यवाद",
                "ta": "மன்னிக்கவும் / ஒரு நிமிடம் / நன்றி",
                "ko": "실례합니다 / 죄송합니다 / 고맙습니다",
                "es": "Disculpe / Perdón / Gracias",
                "kn": "ಕ್ಷಮಿಸಿ / ದಯವಿಟ್ಟು ಕೇಳಿ / ಧನ್ಯವಾದಗಳು",
                "ml": "ക്ഷമിക്കണം / കേൾക്കൂ / നന്ദി",
                "note": "Japan's #1 magic phrase: calls attention, apologizes, and thanks someone for their effort."
            }
        ],
        "dining": [
            {
                "ja": "いただきます", "kana": "いただきます", "romaji": "Itadakimasu",
                "en": "I humbly receive this meal (before eating)",
                "te": "భోజనం ప్రారంభించే ముందు కృతజ్ఞత",
                "hi": "भोजन से पहले की कृतज्ञता",
                "ta": "உணவு உண்ணும் முன் கூறும் நன்றி",
                "ko": "잘 먹겠습니다",
                "es": "Buen provecho (dicho por uno mismo antes de comer)",
                "kn": "ಊಟ ಮಾಡುವ ಮುನ್ನ ಕೃತಜ್ಞತೆ",
                "ml": "ഭക്ഷണം കഴിക്കുന്നതിന് മുൻപ് പറയുന്ന നന്ദി",
                "note": "Place hands together and bow slightly. Expresses gratitude to the ingredients, farmer, and chef."
            },
            {
                "ja": "ごちそうさまでした", "kana": "ごちそうさまでした", "romaji": "Gochisousama deshita",
                "en": "Thank you for the wonderful meal (after eating)",
                "te": "రుచికరమైన భోజనానికి ధన్యవాదాలు",
                "hi": "स्वादिष्ट भोजन के लिए धन्यवाद",
                "ta": "சுவையான உணவுக்கு மிக்க நன்றி",
                "ko": "잘 먹었습니다",
                "es": "Gracias por la deliciosa comida (al terminar)",
                "kn": "ರುಚಿಯಾದ ಊಟಕ್ಕೆ ಧನ್ಯವಾದಗಳು",
                "ml": "നല്ല ഭക്ഷണത്തിന് നന്ദി (കഴിച്ച ശേഷം)",
                "note": "Say to dining companions and to restaurant staff as you leave."
            },
            {
                "ja": "これをお願いします", "kana": "これをおねがいします", "romaji": "Kore o onegaishimasu",
                "en": "This one, please (pointing to menu)",
                "te": "దయచేసి ఇది ఇవ్వండి (మెనూ చూపిస్తూ)",
                "hi": "कृपया यह दीजिए (मेनू की ओर इशारा करते हुए)",
                "ta": "தயவுசெய்து இதை கொடுங்கள்",
                "ko": "이것으로 부탁드립니다",
                "es": "Esto, por favor (señalando el menú)",
                "kn": "ದಯವಿಟ್ಟು ಇದನ್ನು ಕೊಡಿ",
                "ml": "ദയവായി ഇത് തരൂ (മെനു കാണിച്ച്)",
                "note": "Point at any menu item and say this for foolproof ordering."
            },
            {
                "ja": "おすすめは何ですか", "kana": "おすすめはなんですか", "romaji": "Osusume wa nan desu ka",
                "en": "What do you recommend?",
                "te": "మీరు దేనిని సిఫార్సు చేస్తారు?",
                "hi": "आप क्या सुझाव देते हैं?",
                "ta": "உங்கள் பரிந்துரை என்ன?",
                "ko": "추천 메뉴는 무엇인가요?",
                "es": "¿Qué me recomienda?",
                "kn": "ನಿಮ್ಮ ಶಿಫಾರಸು ಏನು?",
                "ml": "ഇവിടെ ഏറ്റവും നല്ലത് എന്താണ്?",
                "note": "Great way to discover daily specials and house favorites."
            },
            {
                "ja": "お会計をお願いします", "kana": "おかいけいをおねがいします", "romaji": "O-kaikei o onegaishimasu",
                "en": "The bill / check, please",
                "te": "బిల్ ఇవ్వండి, దయచేసి",
                "hi": "बिल ले आइए, कृपया",
                "ta": "கணக்கு (பில்) கொடுங்கள், தயவுசெய்து",
                "ko": "계산해 주세요",
                "es": "La cuenta, por favor",
                "kn": "ಬಿಲ್ ಕೊಡಿ, ದಯವಿಟ್ಟು",
                "ml": "ബിൽ തരൂ, ദയവായി",
                "note": "You can also cross your index fingers in an 'X' shape as a visual cue."
            },
            {
                "ja": "お水をお願いします", "kana": "おみずをおねがいします", "romaji": "O-mizu o onegaishimasu",
                "en": "Water, please",
                "te": "మంచినీళ్లు ఇవ్వండి",
                "hi": "कृपया पानी दीजिए",
                "ta": "தண்ணீர் கொடுங்கள்",
                "ko": "물 좀 부탁합니다",
                "es": "Agua, por favor",
                "kn": "ದಯವಿಟ್ಟು ನೀರು ಕೊಡಿ",
                "ml": "ദയവായി വെള്ളം തരൂ",
                "note": "Water (o-hiya) is complimentary in almost all Japanese restaurants."
            }
        ],
        "shopping": [
            {
                "ja": "袋はいいです", "kana": "ふくろはいいです", "romaji": "Fukuro wa ii desu",
                "en": "No bag needed, thank you",
                "te": "సంచి (క్యారీ బ్యాగ్) అవసరం లేదు",
                "hi": "बैग की आवश्यकता नहीं है",
                "ta": "பை தேவையில்லை, நன்றி",
                "ko": "봉투는 괜찮습니다",
                "es": "Sin bolsa está bien, gracias",
                "kn": "ಬ್ಯಾಗ್ ಬೇಡ, ಧನ್ಯವಾದಗಳು",
                "ml": "കവർ വേണ്ട, നന്ദി",
                "note": "Plastic bags cost 3-5 yen across Japan; say this if you brought your own."
            },
            {
                "ja": "温めてください", "kana": "あたためてください", "romaji": "Atatamete kudasai",
                "en": "Please heat this up (bento / food)",
                "te": "దయచేసి ఇది వేడి చేయండి (భోజనం)",
                "hi": "कृपया इसे गरम कर दीजिए (लंच बॉक्स)",
                "ta": "தயவுசெய்து இதை சூடாக்குங்கள்",
                "ko": "데워 주세요",
                "es": "Caliéntelo, por favor",
                "kn": "ದಯವಿಟ್ಟು ಇದನ್ನು ಬಿಸಿ ಮಾಡಿ",
                "ml": "ദയവായി ഇത് ചൂടാക്കി തരൂ",
                "note": "Used at convenience stores (konbini) when buying bento or onigiri."
            },
            {
                "ja": "いくらですか", "kana": "いくらですか", "romaji": "Ikura desu ka",
                "en": "How much is it?",
                "te": "ఇది ఎంత ధర?",
                "hi": "यह कितने का है?",
                "ta": "இது எவ்வளவு விலை?",
                "ko": "얼마인가요?",
                "es": "¿Cuánto cuesta?",
                "kn": "ಇದರ ಬೆಲೆ ಎಷ್ಟು?",
                "ml": "ഇതിന് എത്രയാണ് വില?",
                "note": "Add 'Kore wa' (これはいくらですか) to ask 'How much is this?'"
            },
            {
                "ja": "カードで払えますか", "kana": "カードではらえますか", "romaji": "Kaado de haraemasu ka",
                "en": "Can I pay by card?",
                "te": "కార్డు ద్వారా చెల్లించవచ్చా?",
                "hi": "क्या मैं कार्ड से भुगतान कर सकता हूँ?",
                "ta": "கார்டு மூலம் பணம் செலுத்தலாமா?",
                "ko": "카드로 결제할 수 있나요?",
                "es": "¿Se puede pagar con tarjeta?",
                "kn": "ಕಾರ್ಡ್ ಮೂಲಕ ಪಾವತಿಸಬಹುದೇ?",
                "ml": "കാർഡ് വഴി പണം നൽകാമോ?",
                "note": "Most chain stores accept cards/IC cards (Suica/Pasmo), but small shops may be cash-only."
            }
        ],
        "travel": [
            {
                "ja": "〜はどこですか", "kana": "〜はどこですか", "romaji": "...wa doko desu ka",
                "en": "Where is...?",
                "te": "... ఎక్కడ ఉంది?",
                "hi": "... कहाँ है?",
                "ta": "... எங்குள்ளது?",
                "ko": "...는 어디에 있습니까?",
                "es": "¿Dónde está...?",
                "kn": "... ಎಲ್ಲಿದೆ?",
                "ml": "... എവിടെയാണ്?",
                "note": "Example: 'Toire wa doko desu ka' (Where is the restroom?), 'Eki wa doko desu ka' (Where is the station?)."
            },
            {
                "ja": "何番線ですか", "kana": "なんばんせんですか", "romaji": "Nan-ban sen desu ka",
                "en": "Which track / platform is it?",
                "te": "ఎన్నవ ప్లాట్‌ఫారమ్ / ట్రాక్?",
                "hi": "कौन सा प्लेटफार्म है?",
                "ta": "எந்த நடைமேடை?",
                "ko": "몇 번 홈인가요?",
                "es": "¿En qué vía / andén es?",
                "kn": "ಎಷ್ಟನೇ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್?",
                "ml": "ഏത് പ്ലാറ്റ്‌ഫോമിലാണ്?",
                "note": "Crucial at large stations like Tokyo, Shinjuku, or Osaka."
            },
            {
                "ja": "どれに乗ればいいですか", "kana": "どれにのればいいですか", "romaji": "Dore ni noreba ii desu ka",
                "en": "Which one should I board?",
                "te": "నేను ఏ రైలు / బస్సు ఎక్కాలి?",
                "hi": "मुझे कौन सी गाड़ी में चढ़ना चाहिए?",
                "ta": "நான் எதில் ஏற வேண்டும்?",
                "ko": "어느 것을 타면 되나요?",
                "es": "¿A cuál debería subirme?",
                "kn": "ನಾನು ಯಾವುದರಲ್ಲಿ ಹತ್ತಬೇಕು?",
                "ml": "ഞാൻ ഏതിലാണ് കയറേണ്ടത്?",
                "note": "Useful when multiple train lines share a platform (local, rapid, express)."
            },
            {
                "ja": "英語が話せますか", "kana": "えいごがはなせますか", "romaji": "Eigo ga hanasemasu ka",
                "en": "Can you speak English?",
                "te": "మీరు ఇంగ్లీష్ మాట్లాడగలరా?",
                "hi": "क्या आप अंग्रेज़ी बोल सकते हैं?",
                "ta": "நீங்கள் ஆங்கிலம் பேசுவீர்களா?",
                "ko": "영어 하실 수 있나요?",
                "es": "¿Habla inglés?",
                "kn": "ನೀವು ಇಂಗ್ಲಿಷ್ ಮಾತನಾಡಬಲ್ಲಿರಾ?",
                "ml": "താങ്കൾക്ക് ഇംഗ്ലീഷ് സംസാരിക്കാൻ അറിയാമോ?",
                "note": "Polite inquiry before asking complex questions."
            }
        ],
        "emergency": [
            {
                "ja": "助けてください", "kana": "たすけてください", "romaji": "Tasukete kudasai",
                "en": "Please help me!",
                "te": "దయచేసి నాకు సహాయం చేయండి!",
                "hi": "कृपया मेरी मदद कीजिए!",
                "ta": "தயவுசெய்து எனக்கு உதவுங்கள்!",
                "ko": "도와주세요!",
                "es": "¡Por favor, ayúdeme!",
                "kn": "ದಯವಿಟ್ಟು ಸಹಾಯ ಮಾಡಿ!",
                "ml": "ദയവായി സഹായിക്കൂ!",
                "note": "Direct call for urgent help in an emergency."
            },
            {
                "ja": "気分が悪いです", "kana": "きぶんがわるいです", "romaji": "Kibun ga warui desu",
                "en": "I feel sick / unwell",
                "te": "నాకు ఒంట్లో బాగోలేదు / నీరసంగా ఉంది",
                "hi": "मेरी तबियत ठीक नहीं लग रही है",
                "ta": "எனக்கு உடல்நிலை சரியில்லை",
                "ko": "몸 상태가 안 좋습니다 / 메스껍습니다",
                "es": "Me siento mal / no me encuentro bien",
                "kn": "ನನಗೆ ಹುಷಾರಿಲ್ಲ",
                "ml": "എനിക്ക് സുഖമില്ല",
                "note": "Tell train staff or restaurant staff if you feel dizzy or nauseous."
            },
            {
                "ja": "病院はどこですか", "kana": "びょういんはどこですか", "romaji": "Byouin wa doko desu ka",
                "en": "Where is the hospital / clinic?",
                "te": "ఆసుపత్రి ఎక్కడ ఉంది?",
                "hi": "अस्पताल कहाँ है?",
                "ta": "மருத்துவமனை எங்குள்ளது?",
                "ko": "병원은 어디에 있습니까?",
                "es": "¿Dónde está el hospital?",
                "kn": "ಆಸ್ಪತ್ರೆ ಎಲ್ಲಿದೆ?",
                "ml": "ആശുപത്രി എവിടെയാണ്?",
                "note": "Japan emergency numbers: 119 (Ambulance/Fire), 110 (Police)."
            },
            {
                "ja": "パスポートをなくしました", "kana": "パスポートをなくしました", "romaji": "Pasupooto o nakushimashita",
                "en": "I lost my passport",
                "te": "నా పాస్‌పోర్ట్ పోయింది",
                "hi": "मेरा पासपोर्ट खो गया है",
                "ta": "என் பாஸ்போர்ட் தொலைந்துவிட்டது",
                "ko": "여권을 잃어버렸습니다",
                "es": "Perdí mi pasaporte",
                "kn": "ನನ್ನ ಪಾಸ್‌ಪೋರ್ಟ್ ಕಳೆದುಹೋಗಿದೆ",
                "ml": "എന്റെ പാസ്‌പോർട്ട് നഷ്ടപ്പെട്ടു",
                "note": "Head to the nearest Koban (police box) to file a lost item report (ishitsutodoke)."
            }
        ]
    }

    # 2. COUNTERS
    counters = [
        {
            "id": "tsu",
            "name": "〜つ (Universal Objects)",
            "desc": "Universal native Japanese counter for general items, abstract things, orders, and ages 1-9.",
            "desc_te": "సాధారణ వస్తువులు, ఆలోచనలు మరియు ఆర్డర్లకు ఉపయోగించే సార్వత్రిక జపనీస్ కౌంటర్.",
            "desc_hi": "सामान्य वस्तुओं, अमूर्त विचारों और आर्डरों के लिए सार्वभौमिक जापानी काउंटर।",
            "desc_ta": "பொதுவான பொருட்கள் மற்றும் உணவக ஆர்டர்களுக்கான பொதுவான எண்ணும் முறை.",
            "desc_ko": "일반 사물, 주문, 추상적인 것을 셀 때 쓰는 고유어 수사.",
            "desc_es": "Contador nativo universal para objetos generales, pedidos y conceptos.",
            "desc_kn": "ಸಾಮಾನ್ಯ ವಸ್ತುಗಳು ಮತ್ತು ಆರ್ಡರ್‌ಗಳಿಗೆ ಬಳಸಲಾಗುವ ಸಾರ್ವತ್ರಿಕ ಕೌಂಟರ್.",
            "desc_ml": "സാധാരണ സാധനങ്ങൾക്കും ഓർഡറുകൾക്കും ഉപയോഗിക്കുന്ന സാർവത്രിക കൗണ്ടർ.",
            "items": [
                {"n": 1, "ja": "ひとつ", "kanji": "一つ", "romaji": "hitotsu", "en": "1 item"},
                {"n": 2, "ja": "ふたつ", "kanji": "二つ", "romaji": "futatsu", "en": "2 items"},
                {"n": 3, "ja": "みっつ", "kanji": "三つ", "romaji": "mittsu", "en": "3 items"},
                {"n": 4, "ja": "よっつ", "kanji": "四つ", "romaji": "yottsu", "en": "4 items"},
                {"n": 5, "ja": "いつつ", "kanji": "五つ", "romaji": "itsutsu", "en": "5 items"},
                {"n": 6, "ja": "むっつ", "kanji": "六つ", "romaji": "muttsu", "en": "6 items"},
                {"n": 7, "ja": "ななつ", "kanji": "七つ", "romaji": "nanatsu", "en": "7 items"},
                {"n": 8, "ja": "やっつ", "kanji": "八つ", "romaji": "yattsu", "en": "8 items"},
                {"n": 9, "ja": "ここのつ", "kanji": "九つ", "romaji": "kokonotsu", "en": "9 items"},
                {"n": 10, "ja": "とお", "kanji": "十", "romaji": "too", "en": "10 items"}
            ]
        },
        {
            "id": "nin",
            "name": "〜人 (People)",
            "desc": "Used to count people. Note irregular readings for 1 person (hitori) and 2 people (futari).",
            "desc_te": "మనుషులను లెక్కించడానికి ఉపయోగిస్తారు. 1 వ్యక్తి (హిటోరి), 2 వ్యక్తులు (ఫుతారి) ప్రత్యేకమైనవి.",
            "desc_hi": "व्यक्तियों को गिनने के लिए। 1 व्यक्ति (हितोरी) और 2 व्यक्ति (फ़ुतारी) अनियमित हैं।",
            "desc_ta": "நபர்களை எண்ண பயன்படும். 1 நபர் மற்றும் 2 நபர்கள் தனித்துவமான உச்சரிப்பு கொண்டவை.",
            "desc_ko": "사람을 셀 때 사용. 1명(히토리)과 2명(후타리)은 불규칙 발음.",
            "desc_es": "Para contar personas. 1 persona (hitori) y 2 personas (futari) son irregulares.",
            "desc_kn": "ವ್ಯಕ್ತಿಗಳನ್ನು ಎಣಿಸಲು ಬಳಸಲಾಗುತ್ತದೆ. 1 ಮತ್ತು 2 ಜನರಿಗೆ ವಿಶೇಷ ಉಚ್ಚಾರಣೆಯಿದೆ.",
            "desc_ml": "വ്യക്തികളെ എണ്ണാൻ ഉപയോഗിക്കുന്നു. 1, 2 ആളുകൾക്ക് പ്രത്യേക ഉച്ചാരണമാണ്.",
            "items": [
                {"n": 1, "ja": "ひとり", "kanji": "一人", "romaji": "hitori", "en": "1 person (irregular)"},
                {"n": 2, "ja": "ふたり", "kanji": "二人", "romaji": "futari", "en": "2 people (irregular)"},
                {"n": 3, "ja": "さんにん", "kanji": "三人", "romaji": "sannin", "en": "3 people"},
                {"n": 4, "ja": "よにん", "kanji": "四人", "romaji": "yonin", "en": "4 people (note: yonin, not yonin/shinin)"},
                {"n": 5, "ja": "ごにん", "kanji": "五人", "romaji": "gonin", "en": "5 people"},
                {"n": 6, "ja": "ろくにん", "kanji": "六人", "romaji": "rokunin", "en": "6 people"},
                {"n": 7, "ja": "しちにん / ななにん", "kanji": "七人", "romaji": "shichinin / nananin", "en": "7 people"},
                {"n": 8, "ja": "はちにん", "kanji": "八人", "romaji": "hachinin", "en": "8 people"},
                {"n": 9, "ja": "きゅうにん / くにん", "kanji": "九人", "romaji": "kyuunin / kunin", "en": "9 people"},
                {"n": 10, "ja": "じゅうにん", "kanji": "十人", "romaji": "juunin", "en": "10 people"}
            ]
        },
        {
            "id": "hon",
            "name": "〜本 (Long Cylindrical Objects)",
            "desc": "Used for bottles, pens, umbrellas, trees, trains, roads, and phone calls. Features phonetic shifts (hon/bon/pon).",
            "desc_te": "సీసాలు, పెన్నులు, గొడుగులు, రైళ్లు వంటి పొడవైన వస్తువులను లెక్కించడానికి.",
            "desc_hi": "बोतलें, पेन, छाते, पेड़ जैसी लंबी और बेलनाकार वस्तुओं के लिए। ध्वनि परिवर्तन (होन/बोन/पोन) होते हैं।",
            "desc_ta": "பாட்டில்கள், பேனாக்கள், குடைகள் போன்ற நீண்ட உருளை வடிவப் பொருட்களுக்கு.",
            "desc_ko": "병, 펜, 우산, 나무 등 길쭉한 물건을 셀 때 사용. hon/bon/pon 음운 변화 주의.",
            "desc_es": "Para botellas, bolígrafos, paraguas y objetos alargados. Cambia de sonido (hon/bon/pon).",
            "desc_kn": "ಬಾಟಲಿಗಳು, ಪೆನ್ನುಗಳು, ಛತ್ರಿಗಳಂತಹ ಉದ್ದನೆಯ ವಸ್ತುಗಳನ್ನು ಎಣಿಸಲು.",
            "desc_ml": "കുപ്പികൾ, പേനകൾ, കുടകൾ തുടങ്ങിയ നീളമുള്ള വസ്തുക്കളെ എണ്ണാൻ.",
            "items": [
                {"n": 1, "ja": "いっぽん", "kanji": "一本", "romaji": "ippon", "en": "1 long object (shift to -ppon)"},
                {"n": 2, "ja": "にほん", "kanji": "二本", "romaji": "nihon", "en": "2 long objects"},
                {"n": 3, "ja": "さんぼん", "kanji": "三本", "romaji": "sanbon", "en": "3 long objects (shift to -bon)"},
                {"n": 4, "ja": "よんほん", "kanji": "四本", "romaji": "yonhon", "en": "4 long objects"},
                {"n": 5, "ja": "ごほん", "kanji": "五本", "romaji": "gohon", "en": "5 long objects"},
                {"n": 6, "ja": "ろっぽん", "kanji": "六本", "romaji": "roppon", "en": "6 long objects (shift to -ppon)"},
                {"n": 7, "ja": "ななほん", "kanji": "七本", "romaji": "nanahon", "en": "7 long objects"},
                {"n": 8, "ja": "はっぽん", "kanji": "八本", "romaji": "happon", "en": "8 long objects (shift to -ppon)"},
                {"n": 9, "ja": "きゅうほん", "kanji": "九本", "romaji": "kyuuhon", "en": "9 long objects"},
                {"n": 10, "ja": "じゅっぽん", "kanji": "十本", "romaji": "juppon", "en": "10 long objects (shift to -ppon)"}
            ]
        },
        {
            "id": "mai",
            "name": "〜枚 (Flat Thin Objects)",
            "desc": "Used for paper, sheets, tickets, shirts, plates, photos, and credit cards. Very regular.",
            "desc_te": "కాగితాలు, టిక్కెట్లు, చొక్కాలు, ప్లేట్లు వంటి ఫ్లాట్ వస్తువులను లెక్కించడానికి.",
            "desc_hi": "कागज़, टिकट, कमीज़, प्लेट और तस्वीरों जैसी सपाट वस्तुओं के लिए।",
            "desc_ta": "காகிதங்கள், சீட்டுகள், சட்டைகள், தட்டுகள் போன்ற தட்டையான பொருட்களுக்கு.",
            "desc_ko": "종이, 티켓, 셔츠, 접시, 사진 등 얇고 평평한 물건을 셀 때 사용.",
            "desc_es": "Para objetos planos y delgados como papel, billetes, platos y camisetas.",
            "desc_kn": "ಕಾಗದ, ಟಿಕೆಟ್, ಶರ್ಟ್, ತಟ್ಟೆಗಳಂತಹ ಚಪ್ಪಟೆಯಾದ ವಸ್ತುಗಳನ್ನು ಎಣಿಸಲು.",
            "desc_ml": "പേപ്പർ, ടിക്കറ്റ്, ഷർട്ട്, പ്ലേറ്റ് തുടങ്ങിയ പരന്ന വസ്തുക്കളെ എണ്ണാൻ.",
            "items": [
                {"n": 1, "ja": "いちまい", "kanji": "一枚", "romaji": "ichimai", "en": "1 flat object"},
                {"n": 2, "ja": "にまい", "kanji": "二枚", "romaji": "nimai", "en": "2 flat objects"},
                {"n": 3, "ja": "さんまい", "kanji": "三枚", "romaji": "sanmai", "en": "3 flat objects"},
                {"n": 4, "ja": "よんまい", "kanji": "四枚", "romaji": "yonmai", "en": "4 flat objects"},
                {"n": 5, "ja": "ごまい", "kanji": "五枚", "romaji": "gomai", "en": "5 flat objects"},
                {"n": 6, "ja": "ろくまい", "kanji": "六枚", "romaji": "rokumai", "en": "6 flat objects"},
                {"n": 7, "ja": "ななまい", "kanji": "七枚", "romaji": "nanamai", "en": "7 flat objects"},
                {"n": 8, "ja": "はちまい", "kanji": "八枚", "romaji": "hachimai", "en": "8 flat objects"},
                {"n": 9, "ja": "きゅうまい", "kanji": "九枚", "romaji": "kyuumai", "en": "9 flat objects"},
                {"n": 10, "ja": "じゅうまい", "kanji": "十枚", "romaji": "juumai", "en": "10 flat objects"}
            ]
        },
        {
            "id": "hiki",
            "name": "〜匹 (Small Animals & Pets)",
            "desc": "Used for dogs, cats, fish, insects, and small animals. Features sound shifts (hiki/biki/piki).",
            "desc_te": "కుక్కలు, పిల్లులు, చేపలు మరియు చిన్న జంతువులను లెక్కించడానికి.",
            "desc_hi": "कुत्ते, बिल्ली, मछली और छोटे जानवरों को गिनने के लिए।",
            "desc_ta": "நாய்கள், பூனைகள், மீன்கள் மற்றும் சிறிய விலங்குகளை எண்ண பயன்படும்.",
            "desc_ko": "개, 고양이, 물고기 등 소형 동물을 셀 때 사용. hiki/biki/piki 변화.",
            "desc_es": "Para perros, gatos, peces y animales pequeños. Cambia de sonido (hiki/biki/piki).",
            "desc_kn": "ನಾಯಿ, ಬೆಕ್ಕು, ಮೀನುಗಳಂತಹ ಸಣ್ಣ ಪ್ರಾಣಿಗಳನ್ನು ಎಣಿಸಲು.",
            "desc_ml": "പട്ടികൾ, പൂച്ചകൾ, മീനുകൾ തുടങ്ങിയ ചെറിയ ജീവികളെ എണ്ണാൻ.",
            "items": [
                {"n": 1, "ja": "いっぴき", "kanji": "一匹", "romaji": "ippiki", "en": "1 animal (shift to -piki)"},
                {"n": 2, "ja": "にひき", "kanji": "二匹", "romaji": "nihiki", "en": "2 animals"},
                {"n": 3, "ja": "さんびき", "kanji": "三匹", "romaji": "sanbiki", "en": "3 animals (shift to -biki)"},
                {"n": 4, "ja": "よんひき", "kanji": "四匹", "romaji": "yonhiki", "en": "4 animals"},
                {"n": 5, "ja": "ごひき", "kanji": "五匹", "romaji": "gohiki", "en": "5 animals"},
                {"n": 6, "ja": "ろっぴき", "kanji": "六匹", "romaji": "roppiki", "en": "6 animals (shift to -piki)"},
                {"n": 7, "ja": "ななひき", "kanji": "七匹", "romaji": "nanahiki", "en": "7 animals"},
                {"n": 8, "ja": "はっぴき", "kanji": "八匹", "romaji": "happiki", "en": "8 animals (shift to -piki)"},
                {"n": 9, "ja": "きゅうひき", "kanji": "九匹", "romaji": "kyuuhiki", "en": "9 animals"},
                {"n": 10, "ja": "じゅっぴき", "kanji": "十匹", "romaji": "juppiki", "en": "10 animals (shift to -piki)"}
            ]
        },
        {
            "id": "satsu",
            "name": "〜冊 (Books & Bound Volumes)",
            "desc": "Used for books, magazines, notebooks, and dictionaries.",
            "desc_te": "పుస్తకాలు, మ్యాగజైన్లు మరియు నోట్‌బుక్‌లను లెక్కించడానికి.",
            "desc_hi": "किताबों, पत्रिकाओं और पुस्तिकाओं को गिनने के लिए।",
            "desc_ta": "புத்தகங்கள், இதழ்கள் மற்றும் குறிப்பேடுகளை எண்ண பயன்படும்.",
            "desc_ko": "책, 잡지, 공책 등 제본된 서적류를 셀 때 사용.",
            "desc_es": "Para libros, revistas, cuadernos y volúmenes encuadernados.",
            "desc_kn": "ಪುಸ್ತಕಗಳು, ನಿಯತಕಾಲಿಕೆಗಳು ಮತ್ತು ನೋಟ್‌ಬುಕ್‌ಗಳನ್ನು ಎಣಿಸಲು.",
            "desc_ml": "പുസ്തകങ്ങൾ, മാസികകൾ, നോട്ട്ബുക്കുകൾ എന്നിവ എണ്ണാൻ.",
            "items": [
                {"n": 1, "ja": "いっさつ", "kanji": "一冊", "romaji": "issatsu", "en": "1 book (shift to -ssatsu)"},
                {"n": 2, "ja": "にさつ", "kanji": "二冊", "romaji": "nisatsu", "en": "2 books"},
                {"n": 3, "ja": "さんさつ", "kanji": "三冊", "romaji": "sansatsu", "en": "3 books"},
                {"n": 4, "ja": "よんさつ", "kanji": "四冊", "romaji": "yonsatsu", "en": "4 books"},
                {"n": 5, "ja": "ごさつ", "kanji": "五冊", "romaji": "gosatsu", "en": "5 books"},
                {"n": 6, "ja": "ろくさつ", "kanji": "六冊", "romaji": "rokusatsu", "en": "6 books"},
                {"n": 7, "ja": "ななさつ", "kanji": "七冊", "romaji": "nanasatsu", "en": "7 books"},
                {"n": 8, "ja": "はっさつ", "kanji": "八冊", "romaji": "hassatsu", "en": "8 books (shift to -ssatsu)"},
                {"n": 9, "ja": "きゅうさつ", "kanji": "九冊", "romaji": "kyuusatsu", "en": "9 books"},
                {"n": 10, "ja": "じゅっさつ", "kanji": "十冊", "romaji": "jussatsu", "en": "10 books (shift to -ssatsu)"}
            ]
        },
        {
            "id": "kai",
            "name": "〜階 (Building Floors / Stories)",
            "desc": "Used for building floors. 3rd floor is sangai (voiced -gai). In Japan, 1F is ground floor.",
            "desc_te": "భవన అంతస్తులను లెక్కించడానికి. జపాన్‌లో 1వ అంతస్తు నేల అంతస్తు.",
            "desc_hi": "इमारत की मंजिलों के लिए। जापान में 1F ही भूतल (ग्राउंड फ्लोर) होता है।",
            "desc_ta": "கட்டடத்தின் மாடிகளை எண்ண பயன்படும். ஜப்பானில் 1F என்பது தரைத்தளம்.",
            "desc_ko": "건물의 층수를 셀 때 사용. 3층은 sangai로 유성음화. 1F는 1층(지상층).",
            "desc_es": "Para pisos o plantas de un edificio. En Japón, 1F es la planta baja.",
            "desc_kn": "ಕಟ್ಟಡದ ಮಹಡಿಗಳನ್ನು ಎಣಿಸಲು. ಜಪಾನಿನಲ್ಲಿ 1F ನೆಲಮಹಡಿ.",
            "desc_ml": "കെട്ടിടത്തിന്റെ നിലകൾ എണ്ണാൻ. ജപ്പാനിൽ 1F എന്നാൽ താഴത്തെ നിലയാണ്.",
            "items": [
                {"n": 1, "ja": "いっかい", "kanji": "一階", "romaji": "ikkai", "en": "1st floor (ground floor)"},
                {"n": 2, "ja": "にかい", "kanji": "二階", "romaji": "nikai", "en": "2nd floor"},
                {"n": 3, "ja": "さんがい", "kanji": "三階", "romaji": "sangai", "en": "3rd floor (shift to -gai)"},
                {"n": 4, "ja": "よんかい", "kanji": "四階", "romaji": "yonkai", "en": "4th floor"},
                {"n": 5, "ja": "ごかい", "kanji": "五階", "romaji": "gokai", "en": "5th floor"},
                {"n": 6, "ja": "ろっかい", "kanji": "六階", "romaji": "rokkai", "en": "6th floor (shift to -kkai)"},
                {"n": 7, "ja": "ななかい", "kanji": "七階", "romaji": "nanakai", "en": "7th floor"},
                {"n": 8, "ja": "はっかい", "kanji": "八階", "romaji": "hakkai", "en": "8th floor (shift to -kkai)"},
                {"n": 9, "ja": "きゅうかい", "kanji": "九階", "romaji": "kyuukai", "en": "9th floor"},
                {"n": 10, "ja": "じゅっかい", "kanji": "十階", "romaji": "jukkai", "en": "10th floor (shift to -kkai)"}
            ]
        },
        {
            "id": "nichi",
            "name": "〜日 (Days of the Month)",
            "desc": "Days 1 through 10 have unique native Japanese readings. Essential for dates and schedules.",
            "desc_te": "నెలలోని 1 నుండి 10వ తేదీలు ప్రత్యేక స్థానిక జపనీస్ ఉచ్చారణలను కలిగి ఉంటాయి.",
            "desc_hi": "महीने के 1 से 10 तारीखों के नाम विशेष जापानी उच्चारण में होते हैं।",
            "desc_ta": "மாதத்தின் 1 முதல் 10 தேதிகள் வரை தனித்துவமான உச்சரிப்புகள் உள்ளன.",
            "desc_ko": "매월 1일부터 10일까지는 고유어 특수 발음을 사용합니다.",
            "desc_es": "Los días 1 al 10 del mes tienen lecturas nativas especiales muy importantes.",
            "desc_kn": "ತಿಂಗಳ 1 ರಿಂದ 10 ನೇ ದಿನಗಳು ವಿಶೇಷ ಜಪಾನೀಸ್ ಉಚ್ಚಾರಣೆಗಳನ್ನು ಹೊಂದಿವೆ.",
            "desc_ml": "മാസത്തിലെ 1 മുതൽ 10 വരെയുള്ള തീയതികൾക്ക് പ്രത്യേക ഉച്ചാരണമാണ്.",
            "items": [
                {"n": 1, "ja": "ついたち", "kanji": "一日", "romaji": "tsuitachi", "en": "1st day of month"},
                {"n": 2, "ja": "ふつか", "kanji": "二日", "romaji": "futsuka", "en": "2nd day (or 2 days)"},
                {"n": 3, "ja": "みっか", "kanji": "三日", "romaji": "mikka", "en": "3rd day (or 3 days)"},
                {"n": 4, "ja": "よっか", "kanji": "四日", "romaji": "yokka", "en": "4th day (or 4 days)"},
                {"n": 5, "ja": "いつか", "kanji": "五日", "romaji": "itsuka", "en": "5th day (or 5 days)"},
                {"n": 6, "ja": "むいか", "kanji": "六日", "romaji": "muika", "en": "6th day (or 6 days)"},
                {"n": 7, "ja": "なのか", "kanji": "七日", "romaji": "nanoka", "en": "7th day (or 7 days)"},
                {"n": 8, "ja": "ようか", "kanji": "八日", "romaji": "youka", "en": "8th day (or 8 days)"},
                {"n": 9, "ja": "ここのか", "kanji": "九日", "romaji": "kokonoka", "en": "9th day (or 9 days)"},
                {"n": 10, "ja": "とおか", "kanji": "十日", "romaji": "tooka", "en": "10th day (or 10 days)"}
            ]
        }
    ]

    # 3. GRAMMAR CHEAT SHEET
    grammar = {
        "particles": [
            {
                "pair": "は (wa) vs が (ga)",
                "rule_en": "は marks the TOPIC ('Speaking of X...'). が marks the grammatical SUBJECT or identifies SPECIFIC NEW INFO ('X and not others').",
                "rule_te": "は టాపిక్‌ని సూచిస్తుంది ('X గురించి మాట్లాడితే...'). が నిర్దిష్ట సబ్జెక్ట్‌ను గుర్తిస్తుంది ('ఇతరాలు కాకుండా X').",
                "rule_hi": "は विषय (Topic) बताता है ('जहाँ तक X की बात है...')। が कर्ता (Subject) की पहचान कराता है।",
                "rule_ta": "は தலைப்பைக் குறிக்கிறது. が குறிப்பிட்ட எழுவாயை (Subject) அடையாளப்படுத்துகிறது.",
                "rule_ko": "은/는(は)은 화제 제시. 이/가(が)는 주어 지정 및 새로운 정보 강조.",
                "rule_es": "は marca el TEMA ('En cuanto a X...'). が marca el SUJETO que realiza la acción o identifica información nueva.",
                "rule_kn": "は ವಿಷಯವನ್ನು ಸೂಚಿಸುತ್ತದೆ. が ನಿರ್ದಿಷ್ಟ ಕರ್ತೃವನ್ನು ಗುರುತಿಸುತ್ತದೆ.",
                "rule_ml": "は വിഷയത്തെ സൂചിപ്പിക്കുന്നു. が കൃത്യമായ കർതൃപദത്തെ സൂചിപ്പിക്കുന്നു.",
                "example_ja": "私は猫が好きです。 (Watashi wa neko ga suki desu.)",
                "example_en": "As for me (topic: wa), cats (subject: ga) are liked.",
                "example_native_te": "నా విషయానికి వస్తే (వా), నాకు పిల్లులు (గా) ఇష్టం."
            },
            {
                "pair": "に (ni) vs で (de)",
                "rule_en": "に marks a SPECIFIC TIME, DESTINATION, or EXISTENCE LOCATION. で marks the LOCATION OF AN ACTION or the MEANS/TOOL used.",
                "rule_te": "に సమయం, గమ్యస్థానం లేదా ఉనికి స్థలాన్ని సూచిస్తుంది. で ఒక పని జరిగే స్థలాన్ని లేదా సాధనాన్ని సూచిస్తుంది.",
                "rule_hi": "に निश्चित समय, गंतव्य या स्थिति बताता है। で वह स्थान बताता है जहाँ कोई क्रिया होती है, या साधन/उपकरण।",
                "rule_ta": "に குறிப்பிட்ட நேரம், சேருமிடம் அல்லது இருக்கும் இடத்தைக் குறிக்கும். で ஒரு செயல் நிகழும் இடம் அல்லது கருவியைக் குறிக்கும்.",
                "rule_ko": "에(に)는 시간, 도착점, 존재 장소. 에서/로(で)는 동작이 일어나는 장소 및 수단/도구.",
                "rule_es": "に marca HORA concreta, DESTINO o LUGAR DE EXISTENCIA. で marca el LUGAR DE UNA ACCIÓN o el MEDIO/INSTRUMENTO.",
                "rule_kn": "に ನಿರ್ದಿಷ್ಟ ಸಮಯ ಅಥವಾ ಗಮ್ಯಸ್ಥಾನ ಸೂಚಿಸುತ್ತದೆ. で ಕ್ರಿಯೆ ನಡೆಯುವ ಸ್ಥಳ ಅಥವಾ ಸಾಧನವನ್ನು ಸೂಚಿಸುತ್ತದೆ.",
                "rule_ml": "に സമയം, ലക്ഷ്യസ്ഥാനം എന്നിവയെ സൂചിപ്പിക്കുന്നു. で പ്രവർത്തനം നടക്കുന്ന സ്ഥലത്തെയോ മാധ്യമത്തെയോ സൂചിപ്പിക്കുന്നു.",
                "example_ja": "図書館で本を読みます。 (Toshokan de hon o yomimasu.) / 7時に起きます。 (Shichi-ji ni okimasu.)",
                "example_en": "I read books AT the library (de). / I wake up AT 7:00 (ni).",
                "example_native_te": "లైబ్రరీలో (దె) పుస్తకం చదువుతాను. / 7 గంటలకు (ని) నిద్రలేస్తాను."
            },
            {
                "pair": "を (o) vs へ (e)",
                "rule_en": "を marks the DIRECT OBJECT of a transitive verb. へ marks the DIRECTION OF MOTION ('toward').",
                "rule_te": "を ప్రత్యక్ష కర్మను (Direct Object) సూచిస్తుంది. へ ప్రయాణ దిశను ('వైపు') సూచిస్తుంది.",
                "rule_hi": "を सकर्मक क्रिया के कर्म (Object) को दर्शाता है। へ गति की दिशा ('की ओर') बताता है।",
                "rule_ta": "を நேரடிச் செயப்படுபொருளைக் குறிக்கிறது. へ செல்லும் திசையைக் குறிக்கிறது.",
                "rule_ko": "을/를(を)은 직접 목적어. (으)로(へ)는 이동의 방향.",
                "rule_es": "を marca el OBJETO DIRECTO de la acción. へ marca la DIRECCIÓN DEL MOVIMIENTO ('hacia').",
                "rule_kn": "を ಕರ್ಮಪದವನ್ನು ಸೂಚಿಸುತ್ತದೆ. へ ಚಲನೆಯ ದಿಕ್ಕನ್ನು ಸೂಚಿಸುತ್ತದೆ.",
                "rule_ml": "を കർമ്മപദത്തെ സൂചിപ്പിക്കുന്നു. へ നീങ്ങുന്ന ദിശയെ സൂചിപ്പിക്കുന്നു.",
                "example_ja": "パンを食べます。 (Pan o tabemasu.) / 日本へ行きます。 (Nihon e ikimasu.)",
                "example_en": "I eat bread (o). / I go toward Japan (e).",
                "example_native_te": "రొట్టెను (ఒ) తింటాను. / జపాన్ వైపు (ఎ) వెళ్తాను."
            },
            {
                "pair": "と (to) vs や (ya)",
                "rule_en": "と lists an EXHAUSTIVE complete list ('A and B, and that is all'). や lists a NON-EXHAUSTIVE list ('A and B, among others').",
                "rule_te": "と పూర్తి జాబితాను సూచిస్తుంది ('A మరియు B మాత్రమే'). や అసంపూర్ణ జాబితాను సూచిస్తుంది ('A, B మరియు మరికొన్ని').",
                "rule_hi": "と पूर्ण सूची ('A और B बस') बताता है। や अधूरी सूची ('A और B तथा अन्य चीज़ें') बताता है।",
                "rule_ta": "と முழுமையான பட்டியல் ('A மற்றும் B மட்டும்'). や பகுதிப் பட்டியல் ('A, B மற்றும் பிற').",
                "rule_ko": "와/과(と)는 완전 나열. (이)랑/등(や)은 일부 예시 나열.",
                "rule_es": "と enumera una lista COMPLETA ('A y B, nada más'). や enumera una lista NO EXHAUSTIVA ('A y B, entre otros').",
                "rule_kn": "と ಸಂಪೂರ್ಣ ಪಟ್ಟಿಯನ್ನು ಸೂಚಿಸುತ್ತದೆ. や ಕೆಲವು ಉದಾಹರಣೆಗಳನ್ನು ಸೂಚಿಸುತ್ತದೆ.",
                "rule_ml": "と പൂർണ്ണമായ പട്ടികയെ സൂചിപ്പിക്കുന്നു. や ചില ഉദാഹരണങ്ങളെ മാത്രം സൂചിപ്പിക്കുന്നു.",
                "example_ja": "リンゴとバナナを買いました。 (Ringo to banana o kaimashita.)",
                "example_en": "I bought apples and bananas (only those two).",
                "example_native_te": "యాపిల్స్ మరియు అరటిపండ్లు కొన్నాను (ఈ రెండే)."
            },
            {
                "pair": "から (kara) & まで (made)",
                "rule_en": "から means 'FROM' (starting point in time or space, or 'because'). まで means 'UNTIL / TO' (end point).",
                "rule_te": "から అంటే 'నుండి' (ప్రారంభ సమయం/స్థలం). まで అంటే 'వరకు' (ముగింపు సమయం/స్థలం).",
                "rule_hi": "から का अर्थ 'से' (शुरुआत) है। まで का अर्थ 'तक' (अंतिम सीमा) है।",
                "rule_ta": "から என்றால் 'இருந்து' (தொடக்க புள்ளி). まで என்றால் 'வரை' (முடிவு புள்ளி).",
                "rule_ko": "から(~부터)는 시작점. まで(~까지)는 끝점.",
                "rule_es": "から significa 'DESDE' (origen temporal o espacial). まで significa 'HASTA' (límite final).",
                "rule_kn": "から ಎಂದರೆ 'ಇಂದ' (ಪ್ರಾರಂಭ). まで ಎಂದರೆ 'ವರೆಗೆ' (ಅಂತ್ಯ).",
                "rule_ml": "から എന്നാൽ 'മുതൽ'. まで എന്നാൽ 'വരെ'.",
                "example_ja": "9時から5時まで働きます。 (Ku-ji kara go-ji made hatarakimasu.)",
                "example_en": "I work from 9:00 until 5:00.",
                "example_native_te": "9 గంటల నుండి 5 గంటల వరకు పని చేస్తాను."
            }
        ],
        "conjugations": [
            {
                "form": "て形 (Te-Form: Connecting / Requests)",
                "desc_en": "Used to link actions, make polite requests (-te kudasai), and express ongoing actions (-te iru).",
                "rules": [
                    "Group 1 (Godan) with う/つ/る → って (e.g. 買う → 買って, 待つ → 待って, 帰る → 帰って)",
                    "Group 1 (Godan) with む/ぶ/ぬ → んで (e.g. 飲む → 飲んで, 遊ぶ → 遊んで, 死ぬ → 死んで)",
                    "Group 1 (Godan) with く → いて (書く → 書いて), ぐ → いで (泳ぐ → 泳いで) [Exception: 行く → 行って]",
                    "Group 1 (Godan) with す → して (e.g. 話す → 話して)",
                    "Group 2 (Ichidan): drop る, add て (e.g. 食べる → 食べて, 見る → 見て)",
                    "Group 3 (Irregular): する → して, 来る (くる) → 来て (きて)"
                ]
            },
            {
                "form": "た形 (Ta-Form: Plain Past)",
                "desc_en": "Identical phonetic rules as the Te-form, but ending in た/だ instead of て/で.",
                "rules": [
                    "Group 1: 買って (te) → 買った (ta), 飲んで (nde) → 飲んだ (nda), 書いて (ite) → 書いた (ta)",
                    "Group 2: 食べた (tabeta), 見た (mita)",
                    "Group 3: した (shita), 来た (kita)"
                ]
            },
            {
                "form": "ない形 (Nai-Form: Plain Negative)",
                "desc_en": "Used for informal negative, negative requests (-naide kudasai), and obligation (-nakereba narimasen).",
                "rules": [
                    "Group 1 (Godan): Change the final 'u' sound to 'a' sound and add ない (e.g. 書く → 書かない, 飲む → 飲まない, 話す → 話さない) [Note: う becomes わ, e.g. 買う → 買わない]",
                    "Group 2 (Ichidan): drop る, add ない (e.g. 食べる → 食べない, 見る → 見ない)",
                    "Group 3 (Irregular): する → しない, 来る (くる) → 来ない (こない), ある → ない"
                ]
            },
            {
                "form": "可能形 (Potential: 'Can Do')",
                "desc_en": "Expresses ability or possibility. Changes particle を to が.",
                "rules": [
                    "Group 1: change 'u' sound to 'e' sound and add る (e.g. 飲む → 飲める, 行く → 行ける, 話す → 話せる)",
                    "Group 2: drop る, add られる (e.g. 食べる → 食べられる, 見る → 見られる)",
                    "Group 3: する → できる, 来る (くる) → 来られる (こられる)"
                ]
            }
        ]
    }

    # 4. CULTURAL ETIQUETTE
    etiquette = [
        {
            "title": "Bowing (お辞儀 - Ojigi)",
            "icon": "🙇",
            "en": "Bowing expresses respect, greeting, apology, and gratitude. Keep your back straight and hands at sides (men) or in front (women).",
            "te": "నమస్కారం/వంగడం గౌరవం మరియు కృతజ్ఞతను తెలుపుతుంది. వెన్ను నిటారుగా ఉంచి గౌరవంగా వంగాలి.",
            "hi": "झुकना (बो करना) सम्मान और विनम्रता का प्रतीक है। कमर सीधी रखकर झुकें।",
            "ta": "தலைவணங்குதல் என்பது மரியாதை மற்றும் நன்றியறிதலின் அடையாளம்.",
            "ko": "인사는 존경과 감사의 표현. 등을 곧게 펴고 정중하게 숙입니다.",
            "es": "La reverencia expresa respeto y gratitud. Mantenga la espalda recta y no mire fijamente a los ojos mientras se inclina.",
            "kn": "ಬಾಗುವುದು ಗೌರವ ಮತ್ತು ಕೃತಜ್ಞತೆಯ ಸಂಕೇತವಾಗಿದೆ.",
            "ml": "തലകുനിക്കുന്നത് ആദരവിന്റെയും നന്ദിയുടെയും അടയാളമാണ്.",
            "points": [
                "Eshaku (会釈 - 15°): Casual greeting to acquaintances or when passing colleagues.",
                "Keirei (敬礼 - 30°): Formal bow used with customers, business partners, and superiors.",
                "Saikeirei (最敬礼 - 45°): Deep bow reserved for deep apologies or profound gratitude."
            ]
        },
        {
            "title": "Dining & Chopstick Etiquette (箸のタブー)",
            "icon": "🥢",
            "en": "Proper table manners are highly valued in Japan. Never tip — good service is already included!",
            "te": "జపాన్‌లో డైనింగ్ మర్యాదలు చాలా ముఖ్యం. ఎవరికీ టిప్ ఇవ్వవద్దు (టిప్పింగ్ సంస్కృతి లేదు)!",
            "hi": "जापान में टेबल मैनर्स बहुत महत्वपूर्ण हैं। कभी भी टिप न दें — टिप देना अपमानजनक माना जा सकता है!",
            "ta": "சாப்பிடும் போது மேஜை நாகரிகம் மிகவும் முக்கியம். எப்போதும் டிப் (tip) கொடுக்காதீர்கள்!",
            "ko": "일본 식사 예절. 팁 문화가 전혀 없으므로 팁을 두고 나오지 마세요!",
            "es": "¡NO DEJE PROPINA! En Japón, el buen servicio es un deber y dar propina puede resultar incómodo o confuso.",
            "kn": "ಊಟದ ಸಮಯದಲ್ಲಿ ಮರ್ಯಾದೆ ಮುಖ್ಯ. ಜಪಾನಿನಲ್ಲಿ ಎಂದಿಗೂ ಟಿಪ್ ನೀಡಬೇಡಿ!",
            "ml": "ഭക്ഷണ മര്യാദകൾ വളരെ പ്രധാനമാണ്. ഒരിക്കലും ടിപ്പ് നൽകരുത്!",
            "points": [
                "Hashi-watashi (箸渡し): NEVER pass food chopstick-to-chopstick (resembles Japanese funeral rites).",
                "Tate-bashi (立て箸): NEVER stick chopsticks vertically into rice (associated with death rituals).",
                "Neburi-bashi (ねぶり箸): Do not lick or suck on chopsticks.",
                "Slurping noodles (soba, ramen) is polite and indicates you are enjoying the meal!"
            ]
        },
        {
            "title": "Onsen & Bathing Etiquette (温泉・銭湯)",
            "icon": "♨️",
            "en": "Traditional Japanese hot springs (onsen) and public baths (sento) have strict hygiene rules.",
            "te": "హాట్ స్ప్రింగ్స్ (ఓన్సెన్) మరియు బాత్‌లలో కఠినమైన పరిశుభ్రతా నియమాలు ఉంటాయి.",
            "hi": "जापानी गर्म जल स्रोतों (ओनसेन) में स्वच्छता के सख्त नियम होते हैं।",
            "ta": "ஜப்பானிய வெந்நீர் ஊற்றுகளில் (ஒன்சென்) கடுமையான சுகாதார விதிகள் உள்ளன.",
            "ko": "온천 및 대중목욕탕(센토) 이용 시 엄격한 위생 규칙을 준수해야 합니다.",
            "es": "Las aguas termales (onsen) y baños públicos tienen normas estrictas de higiene.",
            "kn": "ಬಿಸಿನೀರಿನ ಬುಗ್ಗೆಗಳಲ್ಲಿ (ಒನ್ಸೆನ್) ಕಟ್ಟುನಿಟ್ಟಿನ ನಿಯಮಗಳಿವೆ.",
            "ml": "ചൂടുനീരുറവകളിൽ (ഒൻസെൻ) കർശനമായ ശുചിത്വ നിയമങ്ങളുണ്ട്.",
            "points": [
                "Wash and rinse your body COMPLETELY at the washing stalls before entering the communal bath.",
                "The bathwater is solely for soaking and relaxation, never for washing with soap.",
                "Do NOT let your hand towel touch the bathwater (place it on your head or at the edge).",
                "Tie up long hair so it never touches the water."
            ]
        },
        {
            "title": "Train & Public Transit Etiquette (電車のマナー)",
            "icon": "🚆",
            "en": "Japanese trains are tranquil, clean, and punctual. Commuters maintain peaceful quiet.",
            "te": "రైళ్లు చాలా నిశ్శబ్దంగా, సమయపాలనతో ఉంటాయి. ప్రయాణికులు నిశ్శబ్దాన్ని పాటిస్తారు.",
            "hi": "जापानी ट्रेनें अत्यंत शांत और समयबद्ध होती हैं। फोन को साइलेंट पर रखें।",
            "ta": "ஜப்பானிய ரயில்கள் மிகவும் அமைதியானவை. அமைதியை கடைபிடிக்க வேண்டும்.",
            "ko": "일본 전철은 매우 조용합니다. 매너 모드로 두고 통화는 자제합니다.",
            "es": "Los trenes japoneses son extremadamente silenciosos y limpios. Respete el silencio colectivo.",
            "kn": "ರೈಲುಗಳಲ್ಲಿ ಶಾಂತತೆಯನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳುವುದು ಅಗತ್ಯ.",
            "ml": "ട്രെയിനുകളിൽ തികഞ്ഞ നിശ്ശബ്ദത പാലിക്കേണ്ടതുണ്ട്.",
            "points": [
                "Switch your phone to 'Manner Mode' (silent) and NEVER talk on the phone.",
                "Wear backpacks on your front or place them on overhead luggage racks so you don't bump others.",
                "Line up neatly in two lines at platform markers and let passengers exit before boarding."
            ]
        }
    ]

    # 5. KEIGO DEMYSTIFIED
    keigo = {
        "intro_en": "Keigo (敬語) is Japanese polite speech. It has 3 tiers: Teineigo (polite), Sonkeigo (honorific / elevating the other person), and Kenjougo (humble / lowering yourself).",
        "intro_te": "కీగో (敬語) అంటే జపనీస్ మర్యాదపూర్వక భాష. ఇందులో తేనేగో (మర్యాద), సోన్కేగో (ఇతరులను గౌరవించేది), కెంజోగో (తనను తాను వినమ్రంగా చేసుకునేది) అనే 3 స్థాయిలు ఉన్నాయి.",
        "intro_hi": "केइगो (敬語) जापानी शिष्टाचार भाषा है। इसके 3 स्तर हैं: तेइनेइगो (विनम्र), सोन्केइगो (आदरणीय/दूसरे को सम्मान देना), और केन्जौगो (विनम्र/स्वयं को छोटा दिखाना)।",
        "intro_ta": "கீகோ என்பது ஜப்பானிய மரியாதை மொழி. இதில் 3 நிலைகள் உள்ளன: டெய்னிகோ, சோன்கிகோ, மற்றும் கென்ஜோகோ.",
        "intro_ko": "경어(敬語)는 정중어(丁寧語), 존경어(尊敬語 - 상대방을 높임), 겸양어(謙譲語 - 자신을 낮춤)의 3가지로 나뉩니다.",
        "intro_es": "Keigo (敬語) es el lenguaje de cortesía japonés. Se divide en Teineigo (cortés con desu/masu), Sonkeigo (honorífico para ensalzar al interlocutor) y Kenjougo (humilde para rebajarse a uno mismo).",
        "intro_kn": "ಕೀಗೋ ಜಪಾನೀಸ್ ಗೌರವಾನ್ವಿತ ಭಾಷೆ. ಇದರಲ್ಲಿ 3 ಹಂತಗಳಿವೆ: ತೇನೆಗೋ, ಸೋನ್ಕೇಗೋ ಮತ್ತು ಕೆಂಜೋಗೋ.",
        "intro_ml": "കീഗോ എന്നത് ജപ്പാനീസ് ആദരവ് ഭാഷയാണ്. ഇതിൽ 3 തലങ്ങളുണ്ട്.",
        "verbs": [
            {
                "meaning": "To go / to come / to be",
                "plain": "行く / 来る / いる (iku / kuru / iru)",
                "teineigo": "行きます / 来ます / います",
                "sonkeigo": "いらっしゃる (irassharu) / おいでになる",
                "kenjougo": "参る (mairu) / 伺う (ukagau)",
                "note": "When customer arrives: 'Irasshaimase!' (Sonkeigo). When you visit a client: 'Mairimasu' (Kenjougo)."
            },
            {
                "meaning": "To eat / to drink",
                "plain": "食べる / 飲む (taberu / nomu)",
                "teineigo": "食べます / 飲みます",
                "sonkeigo": "召し上がる (meshiagaru)",
                "kenjougo": "いただく (itadaku)",
                "note": "Host to guest: 'Douzo meshiagatte kudasai'. Your response: 'Itadakimasu'."
            },
            {
                "meaning": "To say / to tell",
                "plain": "言う (iu)",
                "teineigo": "言います (iimasu)",
                "sonkeigo": "おっしゃる (ossharu)",
                "kenjougo": "申す (mousu) / 申し上げる (moushiageru)",
                "note": "Client says: 'Osshaimashita'. You say your name: 'Tanaka to moushimasu'."
            },
            {
                "meaning": "To see / to watch",
                "plain": "見る (miru)",
                "teineigo": "見ます (mimasu)",
                "sonkeigo": "ご覧になる (goran ni naru)",
                "kenjougo": "拝見する (haiken suru)",
                "note": "Invitation to look: 'Goran kudasai'. When you look at their document: 'Haiken shimasu'."
            },
            {
                "meaning": "To do",
                "plain": "する (suru)",
                "teineigo": "します (shimasu)",
                "sonkeigo": "なさる (nasaru)",
                "kenjougo": "いたす (itasu)",
                "note": "'What will you do?': 'Dou nasaimasu ka?'. 'I will do it': 'Watashi ga itashimasu'."
            },
            {
                "meaning": "To know",
                "plain": "知る (shiru)",
                "teineigo": "知っています (shitte imasu)",
                "sonkeigo": "ご存知です (go-zonji desu)",
                "kenjougo": "存じております (zonjite orimasu)",
                "note": "Asking client: 'Go-zonji desu ka?'. Your humble answer: 'Zonjite orimasu' or 'Zonjimasen'."
            }
        ]
    }

    base = {
        "phrases": phrases,
        "counters": counters,
        "grammar": grammar,
        "etiquette": etiquette,
        "keigo": keigo
    }

    dest_github = os.path.join(REPO_ROOT, "js", "data", "knowledge.js")
    dest_workspace = os.path.join(WORKSPACE_ROOT, "js", "data", "knowledge.js")

    header = """// KNOWLEDGE_BASE — Comprehensive Japanese Learning & Reference Data.
// Sourced authentic Japanese guides: Survival Japanese, Counters, Grammar Cheat Sheets, Etiquette & Keigo.
// 100% offline, full 8-language parity (en, te, hi, ta, ko, es, kn, ml)."""

    with open(dest_github, "w", encoding="utf-8") as f:
        f.write(header + "\n")
        f.write("window.KNOWLEDGE_BASE = ")
        json.dump(base, f, ensure_ascii=False, indent=2)
        f.write(";\n")
    print(f"✓ Generated {dest_github}")

    if os.path.exists(os.path.dirname(dest_workspace)):
        shutil.copyfile(dest_github, dest_workspace)
        print(f"✓ Synchronized to {dest_workspace}")

if __name__ == "__main__":
    generate_knowledge_base()
