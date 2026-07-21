// Service Worker for KotoQuest (PWA) — NETWORK-FIRST.
// Always tries the latest from the network so a new deploy reaches people
// immediately; falls back to the cache only when offline. The cache is refreshed
// on every load, so offline always has the most recent working copy.
// This never touches localStorage, so study progress is safe across any cache change.
const CACHE_NAME = 'kotoquest-v7';
const PRECACHE = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/practice.js',
  './js/vocab_db.js',
  './js/lang/ui.js',
  './assets/hero.jpg',
  './manifest.json',
  './vendor/fontawesome/css/all.min.css',
  './vendor/fontawesome/webfonts/fa-solid-900.woff2',
  './vendor/fonts/outfit.css',
  './vendor/fonts/outfit-latin.woff2',
  './vendor/fonts/outfit-latin-ext.woff2',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/favicon-32.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    fetch(req)
      .then((res) => {
        // Keep same-origin successes in the cache for offline use.
        if (res && res.status === 200 && new URL(req.url).origin === self.location.origin) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html')))
  );
});
