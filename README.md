# 🏯 KotoQuest (言クエスト)
### Gamified Multilingual Japanese N1 Academy (Offline-First)

> **Learn Japanese through your own native language's grammar — not against it.**  
> *Free, open-source JLPT N5 → N1 portal with an offline 8,129-word dictionary, RPG combat loop, SRS flashcards, and native SOV grammar bridge.*

[![JLPT Coverage](https://img.shields.io/badge/JLPT-N5%20%E2%86%92%20N1%20%288%2C129%20Words%29-ff6b8b?style=for-the-badge&logo=japanese&logoColor=white)](vocab_db.js)
[![Offline First](https://img.shields.io/badge/Offline--First-100%25%20Browser%20Native-2ed573?style=for-the-badge&logo=html5&logoColor=white)](index.html)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-ffa502?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-a55eea?style=for-the-badge&logo=github)](CONTRIBUTING.md)

---

## 🧠 The Core Philosophy: The SOV Advantage

Most Japanese learning platforms treat every student like an English speaker. **KotoQuest doesn't.**

Over **45% of the world's population** speaks a Subject-Object-Verb (SOV) language — including **Telugu, Hindi, Korean, Tamil**, and many others. These languages share the **exact same syntactic architecture** as Japanese:
- Identical word order: `Subject → Object → Verb`
- 1-to-1 postpositional particle systems (Telugu *Vibhaktulu*, Hindi *Postpositions*, Korean *조사*, Japanese *助詞*)
- Pre-nominal relative clause placement (descriptive clauses sit *before* nouns)

> 💡 **If you speak an SOV language, you aren't starting from zero. You're starting from 40% mastery.** KotoQuest directly exploits these linguistic bridges so you translate thoughts naturally without mental rearrangement!

---

## 🌍 Supported Native Languages

| Language | Native Script | Word Order | Particle Bridge | Example Formula |
| :--- | :--- | :---: | :--- | :--- |
| **Telugu** | తెలుగు | **SOV** | Vibhaktulu (ను/ని, కి/కు, లో, తో) | నేను **సుశిని** తింటాను |
| **Hindi** | हिन्दी | **SOV** | Postpositions (को, में, से, का) | मैं **सुशी को** खाता हूँ |
| **Korean** | 한국어 | **SOV** | Josa (을/를, 에, 에서, 의) | 나는 **스시를** 먹습니다 |
| **Tamil** | தமிழ் | **SOV** | Case Suffixes (ஐ, க்கு, இல், ஆல்) | நான் **சுஷி** சாப்பிடுகிறேன் |
| **Spanish** | Español | SVO | Prepositions (a, en, con, de) | Yo como **sushi** |
| **English** | English | SVO | Structural reference | I eat **sushi** |

---

## 🎮 Features & Systems

### ⚔️ 1. RPG Quest Arena & Merchant Shop
* **Turn-Based Combat:** Battle monsters across 5 JLPT tiers:
  * 🟢 **N5:** Hiragana Slime (Beginner)
  * 🔵 **N4:** Conjugation Warrior (Apprentice)
  * 🟣 **N3:** Kanji Shogun (Intermediate)
  * 🔴 **N2:** Advanced Ninja (Advanced)
  * 🟡 **N1:** Master Dragon (Native)
* **Procedural Dictionary Quizzes:** Pulls dynamically from the embedded 8,129-word dictionary to generate infinite multiple-choice and spelling quizzes with distractors.
* **Samurai Merchant Shop:** Spend Gold earned from victories on **Healing Potions**, **Grammar Shields** (absorbs wrong-answer damage), and **Hint Scrolls** (eliminates wrong choices).
* **Category Analytics:** Live statistical breakdown tracking accuracy by question type (Particles, Kanji, Verbs, Phrases, Readings).

### 🌉 2. Trilingual Grammar Bridge & N1 Planner
* **Interactive Particle Calculator:** Select any Japanese particle (`は`, `を`, `に`, `で`, `の`, `と`, `から`, `made`) to view instant structural equivalents in Telugu, Hindi, Korean, Tamil, Spanish, and English.
* **24-Month N1 Study Planner:** A structured 4-phase roadmap tailored for native SOV speakers to reach JLPT N1 within 2 years.

### 🃏 3. SRS Flashcards & 8,129-Word Dictionary
* **Anki-Style Spaced Repetition:** Rate cards as `Again` (1m), `Hard` (12h), `Good` (3d), or `Easy` (7d).
* **"Due Only" Filtering:** Focus strictly on cards scheduled for review based on timestamp calculations.
* **Full Dictionary Browser:** Access N5, N4, N3, N2, and N1 vocabulary alongside foundational Kana, Numbers, Survival Phrases, Verbs, and Adjectives.
* **Native Audio Engine:** Powered by Web Speech API (`ja-JP`) for instant pronunciation playback.

### 🧩 4. SOV Sentence Builder
* Assemble Japanese sentences using drag/click word chips in correct grammatical order (`Subject` → `Topic` → `Object` → `Object Particle` → `Verb`).
* Real-time native language prompt translations for all 6 supported languages.

### 🎨 5. Kana Canvas Writer
* Interactive HTML5 stroke canvas for practicing Hiragana and Katakana character writing.
* Includes dashed guide lines, toggleable overlays, character switching, and phonetic audio playback.

### 🔥 6. Daily Streak & Desktop Keyboard Navigation
* **Streak Tracker:** Automatically tracks consecutive study days using local calendar logic (`YYYY-MM-DD`).
* **Desktop Keyboard Shortcuts:** Lightning-fast navigation (`1`, `2`, `3`, `4` keys for Quest Arena battle answers; `Spacebar` to flip flashcards; `←` / `→` arrow keys to switch cards).
* **100% Offline LocalStorage:** Player Level, HP/XP, Gold, Merchant Inventory, SRS intervals, and Accuracy statistics persist automatically in `localStorage.samurai_player`.

---

## 🛠️ Technology Stack

* **Core Engine:** Pure Vanilla JavaScript (ES6+), HTML5, CSS3. Zero framework overhead.
* **Audio:** HTML5 SpeechSynthesis API (`ja-JP`).
* **Graphics & UI:** CSS Custom Properties, Obsidian-dark neon glassmorphism design system, HTML5 Canvas.
* **Database:** Native JavaScript module (`vocab_db.js`) holding 8,129 curated JLPT entries from Tanos/Anki datasets.
* **Deployment:** Zero-build static architecture — compatible with GitHub Pages, Vercel, Netlify, or local file open.

---

## 🚀 Running Locally & Deployment

### Run Locally (Instant)
Simply open `index.html` in any modern web browser! No `npm install`, Node.js server, or build step required.

```bash
git clone https://github.com/ashishthirunagari/KotoQuest.git
cd KotoQuest
open index.html # On macOS
```

### GitHub Pages Auto-Deploy
This repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`):
1. Push your repository to GitHub.
2. Go to **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Your site will automatically deploy to `https://<your-username>.github.io/KotoQuest/`.

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:
- Adding new JLPT quest challenges to `QUEST_DATABASE`.
- Adding new native language particle mappings to `PARTICLE_CALC_DATA`.
- Adding sentence builder challenges to `SENTENCE_LEVELS`.

---

## 📄 License

This project is open-source and licensed under the **[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)](LICENSE)**.

* **Attribution:** Credit **Ashish Thirunagari** and link to this repository.
* **Non-Commercial:** May not be used for commercial purposes without permission.
* **ShareAlike:** Derivative works must be distributed under the same license.
