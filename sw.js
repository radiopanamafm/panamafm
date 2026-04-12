/* ═══════════════════════════════════════════════════════
   Rádio Panamá FM 87.9 — Service Worker
   Estratégia: Cache-first para assets, Network-first para HTML,
   Network-only para streams de áudio, offline fallback.
═══════════════════════════════════════════════════════ */

const CACHE_NAME    = 'panama-fm-v1';
const OFFLINE_URL   = '/';

const PRECACHE = [
  '/',
  '/index.html',
  '/Logo-radio-panama.png',
  '/manifest.json'
];

// ── INSTALL: precache dos assets essenciais ──────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

// ── ACTIVATE: remove caches antigos ─────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── FETCH: estratégia por tipo de recurso ────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignora requests não-GET
  if (request.method !== 'GET') return;

  // Network-only: streams de áudio (nunca cachear)
  if (
    request.headers.get('Accept')?.includes('audio') ||
    url.pathname.match(/\.(mp3|aac|ogg|m3u8|ts)$/i) ||
    url.hostname.includes('stream') ||
    url.hostname.includes('radio') && url.pathname.includes('live')
  ) {
    event.respondWith(fetch(request));
    return;
  }

  // Network-only: requests de terceiros (fonts, pravatar, unsplash, formspree)
  if (url.origin !== self.location.origin) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // Network-first: HTML (sempre tenta buscar versão atualizada)
  if (request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Cache-first: assets estáticos (PNG, CSS, JS, fontes)
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => caches.match(OFFLINE_URL));
    })
  );
});

// ── BACKGROUND SYNC: retry de formulário offline ────────
self.addEventListener('sync', event => {
  if (event.tag === 'form-retry') {
    event.waitUntil(
      self.clients.matchAll().then(clients =>
        clients.forEach(c => c.postMessage({ type: 'SYNC_FORM' }))
      )
    );
  }
});

// ── PUSH NOTIFICATIONS (futuro) ─────────────────────────
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'Panamá FM 87.9', {
      body:    data.body || 'De bem com a vida!',
      icon:    '/Logo-radio-panama.png',
      badge:   '/Logo-radio-panama.png',
      vibrate: [200, 100, 200],
      data:    { url: data.url || '/' }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});
