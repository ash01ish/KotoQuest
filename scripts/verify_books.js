// scripts/verify_books.js
// Validates js/data/books.js schema, 8-language parity, vocabulary, and questions.

const fs = require('fs');
const path = require('path');

const booksFile = path.join(__dirname, '..', 'js', 'data', 'books.js');
if (!fs.existsSync(booksFile)) {
  console.error('FAIL: books.js does not exist');
  process.exit(1);
}

global.window = {};
require(booksFile);

const books = window.JAPANESE_BOOKS;
if (!Array.isArray(books) || books.length !== 8) {
  console.error('FAIL: expected 8 books, got ' + (books ? books.length : 'none'));
  process.exit(1);
}

const LANGUAGES = ['en', 'te', 'hi', 'ta', 'ko', 'es', 'kn', 'ml'];
let totalChapters = 0;
let totalSentences = 0;
let totalVocab = 0;
let totalQuestions = 0;
let errors = [];

books.forEach((b, bIdx) => {
  if (!b.id || !b.title || !b.level) {
    errors.push(`Book #${bIdx} missing id, title, or level`);
  }
  LANGUAGES.forEach(lang => {
    if (!b['title_' + lang]) errors.push(`Book ${b.id} missing title_${lang}`);
    if (!b['synopsis_' + lang]) errors.push(`Book ${b.id} missing synopsis_${lang}`);
  });

  if (!Array.isArray(b.chapters) || b.chapters.length === 0) {
    errors.push(`Book ${b.id} has no chapters`);
    return;
  }

  b.chapters.forEach((ch, chIdx) => {
    totalChapters++;
    if (!ch.chapter || !ch.title || !ch.passage) {
      errors.push(`Book ${b.id} Ch #${chIdx + 1} missing chapter, title, or passage`);
    }

    LANGUAGES.forEach(lang => {
      if (!ch['title_' + lang]) errors.push(`Book ${b.id} Ch ${ch.chapter} missing title_${lang}`);
      if (!ch['passage_' + lang]) errors.push(`Book ${b.id} Ch ${ch.chapter} missing passage_${lang}`);
    });

    if (Array.isArray(ch.sentences)) {
      ch.sentences.forEach((s, sIdx) => {
        totalSentences++;
        if (!s.ja || !s.romaji) errors.push(`Book ${b.id} Ch ${ch.chapter} S#${sIdx + 1} missing ja or romaji`);
        LANGUAGES.forEach(lang => {
          if (!s[lang]) errors.push(`Book ${b.id} Ch ${ch.chapter} S#${sIdx + 1} missing sentence translation ${lang}`);
        });
      });
    }

    if (Array.isArray(ch.vocab)) {
      ch.vocab.forEach((v, vIdx) => {
        totalVocab++;
        if (!v.kanji || !v.kana || !v.romaji) errors.push(`Book ${b.id} Ch ${ch.chapter} V#${vIdx + 1} missing kanji/kana/romaji`);
        LANGUAGES.forEach(lang => {
          if (!v[lang]) errors.push(`Book ${b.id} Ch ${ch.chapter} V#${vIdx + 1} missing vocab def ${lang}`);
        });
      });
    }

    if (Array.isArray(ch.questions)) {
      ch.questions.forEach((q, qIdx) => {
        totalQuestions++;
        if (!q.q || !Array.isArray(q.options) || typeof q.answer !== 'number') {
          errors.push(`Book ${b.id} Ch ${ch.chapter} Q#${qIdx + 1} malformed question`);
        }
        LANGUAGES.forEach(lang => {
          if (!q['q_' + lang]) errors.push(`Book ${b.id} Ch ${ch.chapter} Q#${qIdx + 1} missing question translation ${lang}`);
        });
      });
    }
  });
});

if (errors.length > 0) {
  console.error('Validation FAILED with ' + errors.length + ' errors:');
  errors.slice(0, 20).forEach(e => console.error(' - ' + e));
  process.exit(1);
}

console.log('✓ All 8 Japanese books successfully verified!');
console.log(`✓ Total Books: ${books.length}`);
console.log(`✓ Total Chapters: ${totalChapters}`);
console.log(`✓ Total Sentence Breakdown Items: ${totalSentences}`);
console.log(`✓ Total Vocabulary Items: ${totalVocab}`);
console.log(`✓ Total Reading Comprehension Questions: ${totalQuestions}`);
console.log('✓ 100% 8-language parity (en, te, hi, ta, ko, es, kn, ml) confirmed.');
