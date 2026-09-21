# 🏯 KotoQuest (言クエスト)
### Gamified multilingual Japanese academy, JLPT N5 to N1 (offline-first)

> Learn Japanese through your own language's grammar instead of fighting it.
> A free, open-source JLPT N5 → N1 study app: a full grammar curriculum taught in your own language, reading/listening/mock-exam practice, an offline 8,129-word dictionary, an RPG battle loop, SRS flashcards, a native SOV grammar bridge, a Japanese Knowledge Hub, role-play dialogues, pitch accent ear-training, and Kanji mnemonics.

[![JLPT Coverage](https://img.shields.io/badge/JLPT-N5%20%E2%86%92%20N1%20%288%2C129%20Words%29-ff6b8b?style=for-the-badge&logo=japanese&logoColor=white)](js/vocab_db.js)
[![Offline First](https://img.shields.io/badge/Offline--First-100%25%20Browser%20Native-2ed573?style=for-the-badge&logo=html5&logoColor=white)](index.html)
[![Languages](https://img.shields.io/badge/Languages-8%20Native%20Tongues-3867d6?style=for-the-badge&logo=googletranslate&logoColor=white)](js/lang/ui.js)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-ffa502?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-a55eea?style=for-the-badge&logo=github)](CONTRIBUTING.md)

---

## The idea: use the SOV head start

Most Japanese apps teach every student as if they think in English. KotoQuest doesn't.

A large share of the world speaks a Subject-Object-Verb (SOV) language: Telugu, Hindi, Korean, Tamil, Kannada, Malayalam, and many more. Those languages already share Japanese's basic grammatical machinery:

- **The same natural word order**: Subject → Object → Verb
- **Postpositional particles** that line up almost one-to-one (Telugu *vibhaktulu*, Hindi postpositions, Korean *조사*, Tamil case markers, Kannada *vibhakti*, Malayalam *prathyayam*, Japanese *助詞*)
- **Descriptive clauses** that sit *before* the noun, not after

If you already think in one of those languages, a lot of Japanese grammar is intuitive. KotoQuest leans into that linguistic synergy instead of routing everything through English.

---

## Supported native languages (8-Language Parity)

| Language | Native Script | Word Order | Particle Bridge | Example Formula |
| :--- | :--- | :---: | :--- | :--- |
| **Telugu** | తెలుగు | **SOV** | Vibhaktulu (ను/ని, కి/కు, లో, తో) | నేను **సుశిని** తింటాను |
| **Hindi** | हिन्दी | **SOV** | Postpositions (को, में, से, का) | मैं **सुशी को** खाता हूँ |
| **Tamil** | தமிழ் | **SOV** | Case Suffixes (ஐ, க்கு, இல், ஆல்) | நான் **சுஷி** சாப்பிடுகிறேன் |
| **Kannada** | ಕನ್ನಡ | **SOV** | Vibhakti (ಅನ್ನು, ಗೆ, ಅಲ್ಲಿ, ಇಂದ) | ನಾನು **ಸುಶಿಯನ್ನು** ತಿನ್ನುತ್ತೇನೆ |
| **Malayalam** | മലയാളം | **SOV** | Prathyayam (എ, ക്ക്, ൽ, ഓട്) | ഞാൻ **സുഷി** കഴിക്കുന്നു |
| **Korean** | 한국어 | **SOV** | Josa (을/를, 에, 에서, 의) | 나는 **스시를** 먹습니다 |
| **Spanish** | Español | SVO | Prepositions (a, en, con, de) | Yo como **sushi** |
| **English** | English | SVO | Structural reference | I eat **sushi** |

---

## Features & Learning Modules

### 💡 Dedicated Japanese Knowledge Hub (日本語の知恵)
A central reference desk for everyday Japanese life, fluency, and travel:
- **🗣️ Survival Japanese**: High-frequency phrases for daily greetings, dining/izakaya, shopping/konbini, train travel, and emergencies. Each phrase includes Kanji/Kana, Romaji, 8-language translations, cultural usage notes, and one-tap Web Speech pronunciation.
- **🔢 Essential Counters & Interactive Calculator**: Demystifies tricky counters (`つ`, `本`, `枚`, `匹`, `杯`, `冊`, `台`, `人`). Pick any quantity (1–10) to hear authentic audio and observe phonetic shifts (*ippon*, *sanbon*, *roppon*) in real time.
- **🍜 Life in Japan Simulator (4 Branching Roleplay Scenarios)**:
  - *Ramen Shop & Izakaya*: Ordering noodle firmness (*katame*), requesting toppings, calling staff for the bill (*o-kaikei*).
  - *7-Eleven & Konbini*: Bento heating requests, bag selection (*reji-bukuro*), and payment methods.
  - *Train Station & Yamanote Line*: Finding platforms, verifying train stops, and resolving IC card gate errors (*norikoshi seisanki*).
  - *Traditional Ryokan Check-in*: Reservation check-in using humble speech (*Sumisu to moushimasu*), footwear etiquette at the *genkan*, and onsen hours.
  - Includes NPC audio speech, 3 response tiers (Recommended, Casual, Mistake), and cultural nuance feedback cards.
- **⚡ Anime vs. Real-Life Japanese & Slang Guide**:
  - Dramatic anime tropes (`Omae`/`Kisama`, `Kore wa nan da?!`, `Iku ze!`, `Dattebayo`) contrasted with natural, polite Japanese with audio.
  - Conversational contractions (`〜ちゃう`, `〜とく`, `〜なきゃ`, `〜てる`).
  - Youth & internet slang (*Yabai*, *Maji de*, *Gachi*, *Egui*, *Kusa/w*, *Ryo*, *Wanchan*, *Otsu*).
  - Sentence-ending particles (*ze*, *zo*, *wa*, *sa*, *ne*, *yo*, *kashira*, *kana*).
- **🎵 Pitch Accent & Ear-Training**:
  - Visual guides for Tokyo's 4 pitch patterns (*Heiban*, *Atamadaka*, *Nakadaka*, *Odaka*).
  - Interactive minimal-pair audio cards (`雨` vs `飴`, `箸` vs `橋` vs `端`, `牡蠣` vs `柿`, short vs long vowels, double consonants).
- **📐 Grammar Formulas & Cultural Etiquette**:
  - Core particles breakdown and verb conjugation matrix (Godan, Ichidan, Irregular).
  - Practical etiquette guides for bowing angles, chopstick taboos, Onsen bathing rituals, and train manners.
- **👔 Keigo Demystified**:
  - Explains *Teineigo*, *Sonkeigo*, and *Kenjougo* with high-frequency verb conversion tables.

---

### 📖 Educational Reading, Listening & Mock Exams
- **Passage Read-Aloud Audio (朗読)**: Listen to full reading passages read aloud with adjustable speeds (`0.6x`, `0.9x`, `1.1x`).
- **Pre-Reading Key Vocabulary Drawer**: Kanji, readings, Romaji, and native translations before tackling comprehension questions.
- **Instant Answer Explanation Cards (解説)**: Every question in Reading and Listening immediately provides an explanation citing text evidence and grammatical rationale.
- **Authentic Japanese Storybook Library**: Folklore and literature from Aozora Bunko (*Momotaro*, *The Grateful Crane*, *The Rolling Rice Ball*, *Urashima Taro*, *Princess Kaguya*, *Gon the Fox*, *The Spider's Thread*, *Run, Melos!*).
- **JLPT Mock Exams**: Timed, three-section tests (Language Knowledge, Reading, Listening) scored with official JLPT gating (**100/180 overall and ≥19/60 in every section**).

---

### 🥋 Kanji Dojo, Radicals & Memory Mnemonics
- Complete Kanji database with stroke orders, Onyomi & Kunyomi readings, native translations, and Jukugo compounds.
- **Radical Building Blocks**: Integrated dictionary of over 100 common radicals.
- **Vivid Memory Stories**: Every kanji card includes a dedicated **Radical & Memory Mnemonic (部首と記憶のヒント)** drawer with a vivid visual story connecting its radicals to its meaning.
- Direct link to the **Canvas Writer** for interactive handwriting tracing.

---

### 🎯 Today's Samurai Training (Daily Missions & Sensei Companion)
- Prominently featured on the main dashboard right below the HUD.
- **Sensei's Daily Wisdom**: Rotating inspirational quote from the Samurai Sensei.
- **3 Daily Missions**:
  1. 📖 **Read & Listen**: Read 1 storybook chapter or JLPT passage.
  2. 🎴 **Dojo Review**: Win 1 Arena battle or review 5 flashcards.
  3. 💡 **Knowledge Discovery**: Explore 1 topic or scenario in the Knowledge Hub.
- **Claim Daily Reward**: Awards **+50 XP and +20 Gold** with celebration audio when all 3 missions are completed.

---

### ⚔️ RPG Quest Arena and Merchant Shop
- Turn-based battles across 5 JLPT tiers:
  - **N5**: Hiragana Slime (beginner)
  - **N4**: Conjugation Warrior (apprentice)
  - **N3**: Kanji Shogun (intermediate)
  - **N2**: Advanced Ninja
  - **N1**: Master Dragon (native)
- Procedural quizzes generating questions from the 8,129-word dictionary.
- Samurai Merchant Shop: spend gold on Healing Potions (restore 40 HP), Grammar Shields (block 1 incorrect answer), and Hint Scrolls (eliminate a wrong choice).

---

### 🎴 SRS Flashcards & Particle Sentence Builder
- **Spaced Repetition System (SRS)**: Anki-style scheduling — Again (1m), Hard (12h), Good (3d), or Easy (7d) with a "Due Only" filter.
- **Sentence Builder**: Drag and drop word chips into the correct Japanese syntactic order with prompts in all 8 supported languages.
- **Writing Canvas**: HTML5 canvas for practicing Hiragana, Katakana, and Kanji strokes with guide lines and native voice pronunciation.

---

### 📱 PWA & 100% Offline Support
- Installable as a Progressive Web App (`manifest.json` + Service Worker `kotoquest-v8`).
- All assets, dictionaries, audio synthesizers, and knowledge bases are precached for 100% offline functionality.
- Preserves your study streak and progress safely in `localStorage` without accounts or tracking.

---

## Built with

- **Vanilla JavaScript (ES6+), HTML5, CSS3**: Zero frameworks, zero dependencies, zero build steps.
- **Web Speech API (`ja-JP`)**: Native browser speech synthesis for passages, phrases, and audio drills.
- **Dark Glassmorphism UI**: Custom CSS variables, smooth transitions, and responsive mobile-first design.
- **Curated Data**: Over 8,129 JLPT entries, authentic Aozora Bunko folklore corpus, and cultural knowledge base.
- **Hosting**: Pure static files — deployable to Cloudflare Pages, GitHub Pages, Netlify, or directly from disk.

---

## Run it locally

Clone the repository and open `index.html` in any modern browser:

```bash
git clone https://github.com/ash01ish/KotoQuest.git
cd KotoQuest
open index.html   # macOS
# or start a simple static server:
python3 -m http.server 8000
```

---

## Contributing

Pull requests are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)](LICENSE).

- **Attribution:** credit [Ashish Thirunagari](https://github.com/ash01ish) and link back to this repository.
- **Non-commercial:** not for commercial use without permission.
- **ShareAlike:** derivative works must use the same license.
