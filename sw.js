// Bump this on every deploy so installed PWAs pick up fresh HTML/JS.
const VERSION = 'v18-2026-04-11-coach';
const CACHE = 'meal-tracker-' + VERSION;

const ASSETS = [
  '/family-meal-tracker/',
  '/family-meal-tracker/index.html',
  '/family-meal-tracker/manifest.json',
  '/family-meal-tracker/icon-192.png',
  '/family-meal-tracker/icon-512.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(ASSETS); }));
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});

// Strategy:
//   HTML / navigation       → network-first (users get fresh code immediately)
//   config.js               → network-only (may contain secrets, never cache)
//   Google / Gemini APIs    → pass-through (don't intercept)
//   Other static assets     → cache-first (icons, manifest, etc.)
self.addEventListener('fetch', function(e) {
  const req = e.request;
  const url = req.url;

  // Pass-through: third-party APIs / on-demand libraries we never want to
  // intercept (Google OAuth, Gemini, Google Fonts, jsdelivr CDN for pdf libs).
  if (url.indexOf('googleapis.com') !== -1
      || url.indexOf('accounts.google.com') !== -1
      || url.indexOf('gstatic.com') !== -1
      || url.indexOf('cdn.jsdelivr.net') !== -1
      || url.indexOf('fonts.googleapis.com') !== -1
      || url.indexOf('fonts.gstatic.com') !== -1) {
    return;
  }

  // Never cache config.js (may contain a Gemini API key in dev)
  if (url.indexOf('/config.js') !== -1) {
    e.respondWith(fetch(req));
    return;
  }

  // Network-first for navigations and HTML so users always get fresh UI
  const isNavigation = req.mode === 'navigate';
  const isHTML = isNavigation || url.endsWith('/') || url.endsWith('.html');
  if (isHTML) {
    e.respondWith(
      fetch(req).then(function(res) {
        // Update cache in background with the fresh response
        const copy = res.clone();
        caches.open(CACHE).then(function(c) { c.put(req, copy).catch(function() {}); });
        return res;
      }).catch(function() {
        return caches.match(req).then(function(cached) {
          return cached || caches.match('/family-meal-tracker/index.html');
        });
      })
    );
    return;
  }

  // Cache-first for static assets (icons, manifest, etc.)
  e.respondWith(
    caches.match(req).then(function(cached) { return cached || fetch(req); })
  );
});
