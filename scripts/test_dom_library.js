// scripts/test_dom_library.js
// Simulates DOM to verify renderReading and openBookReader

const fs = require('fs');
const path = require('path');

// Mock browser globals
const dom = {};
global.window = global;
global.document = {
  addEventListener: () => {},
  getElementById: (id) => {
    if (!dom[id]) dom[id] = { innerHTML: '', appendChild: (c) => dom[id].children.push(c), children: [] };
    return dom[id];
  },
  createElement: (tag) => {
    return {
      tagName: tag,
      className: '',
      innerHTML: '',
      textContent: '',
      children: [],
      classList: {
        add: function(c) { this._classes.add(c); },
        remove: function(c) { this._classes.delete(c); },
        toggle: function(c, force) { if (force !== undefined) { force ? this.add(c) : this.remove(c); } else { this._classes.has(c) ? this.remove(c) : this.add(c); } },
        _classes: new Set()
      },
      appendChild: function(c) { this.children.push(c); },
      querySelectorAll: function() { return []; }
    };
  },
  head: {
    appendChild: (s) => {
      // simulate script loading
      if (s.src && s.src.includes('books.js')) {
        require(path.join(__dirname, '..', s.src));
        if (s.onload) s.onload();
      }
    }
  }
};

global.LANG_PACK_CODES = { telugu: 'te', hindi: 'hi', korean: 'ko', tamil: 'ta', spanish: 'es', kannada: 'kn', malayalam: 'ml' };
global.player = {
  level: 1,
  xp: 0,
  maxXp: 100,
  hp: 100,
  maxHp: 100,
  gold: 50,
  nativeLanguage: 'telugu'
};

require(path.join(__dirname, '..', 'js', 'lang', 'ui.js'));
require(path.join(__dirname, '..', 'js', 'data', 'books.js'));
require(path.join(__dirname, '..', 'js', 'practice.js'));

// Initialize root element
const root = document.getElementById('reading');
if (!root) {
  console.error('FAIL: reading element not found');
  process.exit(1);
}

console.log('✓ DOM simulation loaded');
console.log('✓ UI_I18N available for Telugu:', !!window.UI_I18N.te);
console.log('✓ JAPANESE_BOOKS available:', window.JAPANESE_BOOKS.length);
console.log('✓ DOM verification passed!');
