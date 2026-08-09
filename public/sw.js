// Phoenix Command Service Worker
// Provides offline capability and caching

const CACHE_NAME = 'phoenix-command-v2';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/phoenix-logo.png',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json',
  OFFLINE_URL
];

// Install event - cache core assets.
// Each asset is cached independently: one failed fetch must never abort the
// whole install (cache.addAll rejects wholesale), or the app silently loses
// offline support.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching core assets');
      return Promise.allSettled(
        PRECACHE_ASSETS.map((asset) => cache.add(asset))
      ).then((results) => {
        results.forEach((result, i) => {
          if (result.status === 'rejected') {
            console.warn('[SW] Precache failed for', PRECACHE_ASSETS[i], result.reason);
          }
        });
      });
    })
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  // Take control immediately
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests (APIs, CDNs)
  if (url.origin !== location.origin) return;

  // For navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the latest version
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Offline - return cached version, then the app shell, then the
          // dedicated offline page as a last resort
          return caches.match(request).then((cached) => {
            return cached
              || caches.match('/').then((shell) => shell || caches.match(OFFLINE_URL));
          });
        })
    );
    return;
  }

  // For static assets - cache first, network fallback
  if (request.destination === 'image' ||
      request.destination === 'script' ||
      request.destination === 'style' ||
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith('.svg')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          // Return cached, but update in background
          fetch(request).then((response) => {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, response);
            });
          }).catch(() => {});
          return cached;
        }
        // Not cached - fetch and cache
        return fetch(request).then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        });
      })
    );
    return;
  }

  // Default: network first
  event.respondWith(
    fetch(request)
      .then((response) => {
        return response;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Handle messages from the app
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});

