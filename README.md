# 🏯 KotoQuest
### Gamified Multilingual Japanese N1 Academy

> **Learn Japanese through your own language's grammar — not against it.**

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Built With](https://img.shields.io/badge/Built%20With-HTML%20%7C%20CSS%20%7C%20JS-blue)]()
[![JLPT](https://img.shields.io/badge/JLPT-N5%20→%20N1-red)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()

---

### 🧠 The Core Insight

Most Japanese learning apps treat every learner the same. **KotoQuest doesn't.**

Over **45% of the world's population** speaks a Subject-Object-Verb (SOV) language — Telugu, Hindi, Korean, Tamil, Turkish, and many more. These languages share the **exact same sentence structure** as Japanese. Their postpositions map 1-to-1 to Japanese particles. Their relative clauses sit in the same position.

**If you already speak an SOV language, you're not starting from zero. You're starting from 40%.**

KotoQuest exploits this by dynamically mapping Japanese grammar to your native language's existing structures, turning years of study into months.

### 🌍 Supported Native Languages
| Language | Script | SOV? | Particle Mapping |
|----------|--------|------|-----------------|
| Telugu | తెలుగు | ✅ | Vibhaktulu → 助詞 |
| Hindi | हिन्दी | ✅ | Postpositions → 助詞 |
| Korean | 한국어 | ✅ | 조사 → 助詞 |
| Tamil | தமிழ் | ✅ | Case suffixes → 助詞 |
| Spanish | Español | ❌ (SVO) | Prepositions → 助詞 |
| English | English | ❌ (SVO) | Standard reference |


## 🚀 Deployment Instructions

This repository is built as a clean, self-contained single-page static web application (HTML5, Vanilla CSS3, Vanilla JS). It requires **no server build steps**, making deployment extremely simple:

### 1. Deploying to GitHub Pages
1. Push this repository to a public GitHub repository named `koto-quest`.
2. Go to your repository settings page: **Settings &rarr; Pages**.
3. Under **Build and deployment**, select **Deploy from a branch** and set the source branch to `main` (or `master`) and directory to `/ (root)`.
4. Click **Save**. Your game will be live at `https://<your-username>.github.io/koto-quest/` in a few minutes!

### 2. Deploying to Vercel / Netlify
1. Connect your GitHub account to [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
2. Import this repository.
3. Keep all build settings at their default values (empty build command, publish directory set to root `.`).
4. Click **Deploy**.

---

## 🎮 Game Features & Structure
- **Quest Arena**: Battle Japanese vocabulary, grammar, and Kanji monsters graded from JLPT N5 (Beginner) to N1 (Master).
- **Multilingual Bridge**: Dynamic particle calculator comparing Japanese particles (`は`, `を`, `に`, `で`, `の`, `と`, `から`, `まで`) to Telugu case suffixes (Vibhaktulu), Hindi postpositions, Korean helper particles, and Tamil postpositions.
- **Kana Canvas**: Drawing pad to trace and memorize character stroke orders.
- **SRS Flashcards & Sentence Builders**: Interactive widgets to build active vocabulary and master Subject-Object-Verb (SOV) phrasing.
- **Stats Persistence**: Level, HP, XP, Gold, and merchant inventory automatically persist in your browser's `localStorage`.

---

## 📄 License
This project is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)**. 

- **Attribution**: You must give credit to the author, **Ashish Thirunagari**, and link back to this repository.
- **Non-Commercial**: You may not sell this project, its code, or its contents.
- **ShareAlike**: Any modifications or derivatives must be open-sourced under the same license.
