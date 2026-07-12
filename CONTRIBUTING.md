# 🏯 Contributing to KotoQuest

Thank you for your interest in contributing to **KotoQuest**! Whether you're a language enthusiast, a developer, or both — your help makes this project better for everyone.

KotoQuest is a **gamified, multilingual Japanese learning academy** (JLPT N5→N1) built for speakers of Telugu, Hindi, Korean, Tamil, Spanish, and English.

---

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [How to Test Locally](#how-to-test-locally)
- [Adding New JLPT Questions](#adding-new-jlpt-questions)
- [Adding a New Native Language](#adding-a-new-native-language)
- [Adding Sentence Builder Challenges](#adding-sentence-builder-challenges)
- [Code Style Guidelines](#code-style-guidelines)
- [Submitting a Pull Request](#submitting-a-pull-request)

---

## 🚀 Getting Started

1. **Fork** this repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/<your-username>/KotoQuest.git
   cd KotoQuest
   ```
3. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feat/your-feature-name
   ```

---

## 🧪 How to Test Locally

KotoQuest is a **static site** — no build tools, no bundlers, no server required.

Simply open `index.html` in your browser:

```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

Or use a simple local server for best results:
```bash
# Python 3
python -m http.server 8000

# Then open http://localhost:8000 in your browser
```

> **Tip:** Use your browser's DevTools (F12) → Console tab to check for errors, and the Device Toolbar to test mobile responsiveness.

---

## 📝 Adding New JLPT Questions

All JLPT quiz questions live in the `QUEST_DATABASE` object inside **`app.js`**.

### Data Structure

```javascript
const QUEST_DATABASE = {
    N5: [
        {
            q: "What is 'water' in Japanese?",    // The question text
            o: ["みず", "ひ", "かぜ", "つち"],      // Array of 4 options
            a: 0,                                   // Index of correct answer (0-based)
            hint: "Think about what flows in rivers" // Optional hint shown to player
        },
        // ... more questions
    ],
    N4: [ /* ... */ ],
    N3: [ /* ... */ ],
    N2: [ /* ... */ ],
    N1: [ /* ... */ ]
};
```

### How to Add Questions

1. Open `app.js` and locate the `QUEST_DATABASE` object.
2. Find the appropriate JLPT level (N5 = easiest, N1 = hardest).
3. Add a new question object following the format above.

### Guidelines for Good Questions

- ✅ Include a variety of question types (vocabulary, grammar, reading, particles).
- ✅ Make incorrect options plausible but clearly wrong.
- ✅ Add a helpful `hint` that nudges without giving away the answer.
- ✅ Keep question text concise and clear.
- ❌ Don't duplicate existing questions.
- ❌ Don't add questions that are too ambiguous.

---

## 🌐 Adding a New Native Language

KotoQuest supports multilingual grammar bridges through the `PARTICLE_CALC_DATA` structure in **`app.js`**.

### Current Languages

| Language | Key   | Abbreviation |
|----------|-------|-------------|
| Telugu   | `telugu` | `te`     |
| Hindi    | `hindi`  | `hi`     |
| Korean   | `korean` | `ko`     |
| Tamil    | `tamil`  | `ta`     |
| Spanish  | `spanish`| `es`     |

### Data Structure

```javascript
const PARTICLE_CALC_DATA = {
    telugu: {
        label: "తెలుగు (Telugu)",
        particles: {
            "は (wa)": {
                native: "... అనేది / విషయంలో",       // Native script equivalent
                romaji: "... anēdi / vishayamlō",      // Romanized pronunciation
                example_ja: "私は学生です。",              // Japanese example sentence
                example_native: "నేను విద్యార్థిని.",      // Native language translation
                explanation: "Marks the topic of a sentence, like the Telugu topic marker"
            },
            // ... more particles
        }
    },
    hindi: { /* same structure */ },
    korean: { /* same structure */ },
    tamil: { /* same structure */ },
    spanish: { /* same structure */ }
};
```

### How to Add a New Language

1. Choose a **key** (lowercase language name) and **abbreviation** (2-letter ISO code).
2. Add a new entry to `PARTICLE_CALC_DATA` in `app.js`:
   ```javascript
   french: {
       label: "Français (French)",
       particles: {
           "は (wa)": {
               native: "...",
               romaji: "...",
               example_ja: "私は学生です。",
               example_native: "Je suis étudiant(e).",
               explanation: "Marks the topic of a sentence"
           },
           // Add entries for all Japanese particles
       }
   }
   ```
3. Add the language option to the language selector in `index.html`.
4. Update the hero subtitle logic in `app.js` to include the new language.

> **Important:** Please provide translations reviewed by a native speaker or a qualified linguist.

---

## 🧩 Adding Sentence Builder Challenges

Sentence builder challenges are defined in the `SENTENCE_LEVELS` array in **`app.js`**.

### Data Structure

```javascript
const SENTENCE_LEVELS = [
    {
        id: 1,
        label: "N5 Basics",                           // Display name for the level
        words: ["私", "は", "学生", "です", "。"],       // Correct word order (the answer)
        hint: "I am a student.",                       // English hint / translation
        grammar: "Subject + は + Noun + です"          // Grammar pattern explanation
    },
    {
        id: 2,
        label: "N5 Location",
        words: ["猫", "が", "いえ", "に", "います", "。"],
        hint: "The cat is in the house.",
        grammar: "Subject + が + Place + に + います"
    },
    // ... more levels
];
```

### How to Add New Challenges

1. Open `app.js` and find the `SENTENCE_LEVELS` array.
2. Add a new object with a unique `id` (increment from the last one).
3. The `words` array must be in **correct Japanese word order** — the game shuffles them for the player.
4. Include a clear `hint` in English and a `grammar` pattern.

### Tips

- Start simple (N5) and increase complexity for higher levels.
- Each sentence should teach or reinforce a specific grammar point.
- Keep sentences between 4–8 words for the best gameplay experience.
- Include the sentence-ending punctuation `。` as a separate word chip.

---

## 🎨 Code Style Guidelines

KotoQuest is proudly built with **vanilla web technologies** — no frameworks, no transpilers, no bundlers.

### Tech Stack

| Layer   | Technology |
|---------|-----------|
| Structure | HTML5 (`index.html`) |
| Styling   | CSS3 (`style.css`) |
| Logic     | Vanilla JavaScript ES6+ (`app.js`) |

### Rules

1. **No frameworks or libraries** — no React, Vue, Angular, jQuery, Tailwind, etc. Font Awesome and Google Fonts are the only external dependencies.
2. **Single-file architecture** — keep HTML in `index.html`, styles in `style.css`, and JS in `app.js`.
3. **Use `const` and `let`** — never use `var`.
4. **Use template literals** for string interpolation.
5. **Use meaningful variable names** — `questionIndex` not `qi`.
6. **Comment your code** — especially for complex game logic or language-specific data.
7. **Use CSS custom properties** (variables) defined in `:root` for colors and theming.
8. **Keep accessibility in mind** — use semantic HTML, ARIA labels where appropriate.

### Formatting

- **Indentation:** 4 spaces (no tabs).
- **Quotes:** Single quotes for JS strings, double quotes for HTML attributes.
- **Semicolons:** Always use semicolons in JavaScript.
- **Trailing commas:** Use trailing commas in multi-line arrays/objects.

---

## 📮 Submitting a Pull Request

1. **Commit** your changes with a clear, descriptive message:
   ```bash
   git add .
   git commit -m "Add N3 grammar questions for particle で"
   ```

2. **Push** to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```

3. **Open a Pull Request** on the main repository:
   - Provide a clear title (e.g., `feat: Add 20 N3 particle questions`).
   - Describe **what** you changed and **why**.
   - Reference any related issues.
   - Include screenshots if you changed the UI.

### PR Checklist

- [ ] I tested my changes locally by opening `index.html`.
- [ ] My code follows the project's style guidelines.
- [ ] I did not introduce any new dependencies or frameworks.
- [ ] I verified my translations with a native speaker (if applicable).
- [ ] My changes don't break existing functionality.

---

## 💬 Questions?

If you have questions, feel free to:
- Open a [GitHub Issue](../../issues)
- Start a [Discussion](../../discussions)

We're a welcoming community and happy to help! 🌸

---

**ありがとうございます！(Arigatou gozaimasu!)** — Thank you for contributing! 🎌
