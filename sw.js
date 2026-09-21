const CACHE = 'nas-kat-v1';
const SHELL = ['./', './index.html', './manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

// Network-first for everything (so the app + API calls always try live first),
// falling back to the cached shell only when offline.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return; // never cache/intercept API calls
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request).then((r) => r || caches.match('./index.html')))
  );
});
