# KotoQuest: Gamified Multilingual Japanese N1 Academy

An interactive, gamified learning application designed to take complete novices to JLPT N1 proficiency by leveraging native language syntactic logic (Telugu, Hindi, Korean, Tamil, Spanish, and English).

Live Demo: [Launch index.html locally](index.html)

---

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
