// Service Worker for KotoQuest Progressive Web App (PWA)
const CACHE_NAME = 'kotoquest-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './vocab_db.js',
  './hero.jpg',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
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

// Stale-while-revalidate: serve cache instantly (fast + offline), and refresh the
// cache from the network in the background so the NEXT load has the latest deploy.
// This is what stops returning users getting stuck on an old version forever.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cached) => {
        const fromNetwork = fetch(event.request)
          .then((res) => {
            if (res && res.status === 200) cache.put(event.request, res.clone());
            return res;
          })
          .catch(() => cached); // offline: fall back to cache
        return cached || fromNetwork; // instant if cached, else wait for network
      })
    )
  );
});
