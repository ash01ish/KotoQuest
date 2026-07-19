# 🏯 KotoQuest (言クエスト)
### Gamified multilingual Japanese academy, JLPT N5 to N1 (offline-first)

> Learn Japanese through your own language's grammar instead of fighting it.
> A free, open-source JLPT N5 → N1 study app with an offline 8,129-word dictionary, an RPG battle loop, SRS flashcards, and a native SOV grammar bridge.

[![JLPT Coverage](https://img.shields.io/badge/JLPT-N5%20%E2%86%92%20N1%20%288%2C129%20Words%29-ff6b8b?style=for-the-badge&logo=japanese&logoColor=white)](js/vocab_db.js)
[![Offline First](https://img.shields.io/badge/Offline--First-100%25%20Browser%20Native-2ed573?style=for-the-badge&logo=html5&logoColor=white)](index.html)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-ffa502?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-a55eea?style=for-the-badge&logo=github)](CONTRIBUTING.md)

---

## The idea: use the SOV head start

Most Japanese apps teach every student as if they think in English. KotoQuest doesn't.

A large share of the world speaks a Subject-Object-Verb (SOV) language: Telugu, Hindi, Bengali, Korean, Tamil, Turkish, and many more. Those languages already share Japanese's basic machinery:

- The same word order: Subject → Object → Verb
- Postpositional particles that line up almost one-to-one (Telugu *vibhaktulu*, Hindi postpositions, Korean *조사*, Japanese *助詞*)
- Descriptive clauses that sit *before* the noun, not after

So if you already think in one of those languages, a lot of Japanese grammar is stuff you do without noticing. KotoQuest leans on that instead of routing everything through English.

---

## Supported native languages

| Language | Native Script | Word Order | Particle Bridge | Example Formula |
| :--- | :--- | :---: | :--- | :--- |
| **Telugu** | తెలుగు | **SOV** | Vibhaktulu (ను/ని, కి/కు, లో, తో) | నేను **సుశిని** తింటాను |
| **Hindi** | हिन्दी | **SOV** | Postpositions (को, में, से, का) | मैं **सुशी को** खाता हूँ |
| **Korean** | 한국어 | **SOV** | Josa (을/를, 에, 에서, 의) | 나는 **스시를** 먹습니다 |
| **Tamil** | தமிழ் | **SOV** | Case Suffixes (ஐ, க்கு, இல், ஆல்) | நான் **சுஷி** சாப்பிடுகிறேன் |
| **Spanish** | Español | SVO | Prepositions (a, en, con, de) | Yo como **sushi** |
| **English** | English | SVO | Structural reference | I eat **sushi** |

---

## Features

### RPG quest arena and shop
- Turn-based battles across five JLPT tiers:
  - N5: Hiragana Slime (beginner)
  - N4: Conjugation Warrior (apprentice)
  - N3: Kanji Shogun (intermediate)
  - N2: Advanced Ninja
  - N1: Master Dragon (native)
- Dictionary-driven quizzes: pulls from the 8,129-word dictionary to generate fresh multiple-choice and spelling questions with plausible wrong answers.
- Shop: spend the gold you win on healing potions, grammar shields (soak one wrong-answer hit), and hint scrolls (remove a wrong choice).
- Category stats: tracks your accuracy by question type — particles, kanji, verbs, phrases, readings.

### Grammar bridge and N1 planner
- Particle calculator: pick any particle (は, を, に, で, の, と, から, まで) and see its equivalent in Telugu, Hindi, Korean, Tamil, Spanish, and English, side by side.
- 24-month N1 study plan: a four-phase roadmap aimed at SOV speakers.

### SRS flashcards and dictionary
- Anki-style spaced repetition: rate a card Again (1m), Hard (12h), Good (3d), or Easy (7d).
- "Due only" filter to review just what's scheduled.
- Browse the full N5–N1 vocabulary plus kana, numbers, survival phrases, verbs, and adjectives.
- Audio through the browser's Web Speech API (`ja-JP`).

### Sentence builder
- Drag or click word chips into the right order (Subject → Topic → Object → Object particle → Verb).
- Prompts show up in all six supported languages.

### Kana canvas
- An HTML5 canvas for practicing Hiragana and Katakana strokes, with guide lines and audio.

### PWA and offline
- Installable to a phone home screen or the desktop (`manifest.json` + `sw.js`).
- Tracks your study streak by calendar day.
- Keyboard shortcuts: `1`–`4` to answer in battle, `Space` to flip a card, `←` / `→` to move between cards.
- Everything (level, HP/XP, gold, inventory, SRS intervals, stats) is saved to `localStorage` — no account, no server.

---

## Built with

- Vanilla JavaScript (ES6+), HTML5, CSS3. No framework, no build step.
- Audio: HTML5 SpeechSynthesis (`ja-JP`).
- UI: CSS custom properties, a dark neon glass look, HTML5 Canvas.
- Data: `js/vocab_db.js`, 8,129 curated JLPT entries drawn from the Tanos/Anki datasets.
- Hosting: static files, so it runs on Cloudflare Pages, GitHub Pages, Netlify, or straight off your disk.

---

## Run it locally

Open `index.html` in any modern browser. No `npm install`, no server, no build.

```bash
git clone https://github.com/ash01ish/KotoQuest.git
cd KotoQuest
open index.html   # macOS
```

---

## Contributing

Pull requests are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). Good places to add things:
- New quiz questions in `QUEST_DATABASE`
- New particle mappings in `PARTICLE_CALC_DATA`
- New sentence challenges in `SENTENCE_LEVELS`

---

## License

[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)](LICENSE).

- **Attribution:** credit [Ashish Thirunagari](https://github.com/ash01ish) and link back to this repository.
- **Non-commercial:** not for commercial use without permission.
- **ShareAlike:** derivative works must use the same license.
