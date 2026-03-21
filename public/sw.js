// Phoenix Command Service Worker
// Provides offline capability, caching, and push notifications

const CACHE_NAME = 'phoenix-command-v2';
const OFFLINE_URL = '/offline.html';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/phoenix-logo.png',
  '/manifest.json'
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching core assets');
      return cache.addAll(PRECACHE_ASSETS);
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
          // Offline - return cached version
          return caches.match(request).then((cached) => {
            return cached || caches.match('/');
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

// ============================================================================
// PUSH NOTIFICATION HANDLING
// ============================================================================

// Push event - received a push notification from the server
self.addEventListener('push', (event) => {
  let data = {
    title: 'Phoenix Command',
    body: 'New notification',
    category: 'chat',
    data: {},
  };

  try {
    if (event.data) {
      const payload = event.data.json();
      data = {
        title: payload.title || data.title,
        body: payload.body || data.body,
        category: payload.category || data.category,
        data: payload.data || {},
      };
    }
  } catch (err) {
    // If JSON parsing fails, try text
    if (event.data) {
      data.body = event.data.text();
    }
  }

  const categoryConfig = {
    dispatch: {
      tag: 'px-dispatch',
      requireInteraction: true,
      vibrate: [200, 100, 200, 100, 200],
    },
    'schedule-change': {
      tag: 'px-schedule',
      requireInteraction: false,
      vibrate: [200, 100, 200],
    },
    urgent: {
      tag: 'px-urgent',
      requireInteraction: true,
      vibrate: [200, 100, 200, 100, 200],
    },
    chat: {
      tag: 'px-chat',
      requireInteraction: false,
      vibrate: [200],
    },
  };

  const config = categoryConfig[data.category] || categoryConfig.chat;

  const options = {
    body: data.body,
    icon: '/phoenix-logo.png',
    badge: '/phoenix-logo.png',
    tag: config.tag,
    data: { category: data.category, ...data.data },
    vibrate: config.vibrate,
    requireInteraction: config.requireInteraction,
    actions: [],
  };

  // Add action buttons based on category
  if (data.category === 'dispatch') {
    options.actions = [
      { action: 'accept', title: 'Accept' },
      { action: 'decline', title: 'Decline' },
    ];
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const data = event.notification.data || {};
  const action = event.action; // 'accept', 'decline', or ''

  // Forward the click to the app
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If app is already open, focus it and send the message
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.postMessage({
            type: 'NOTIFICATION_CLICK',
            payload: { category: data.category, action, data },
          });
          return;
        }
      }
      // Otherwise open the app
      if (self.clients.openWindow) {
        let url = '/';
        if (data.category === 'dispatch') url = '/#dispatch';
        else if (data.category === 'schedule-change') url = '/#schedule';
        return self.clients.openWindow(url);
      }
    })
  );
});

// Forward push messages to the app when it is in the foreground
self.addEventListener('push', (event) => {
  // Also forward to client for in-app handling
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      let data = {};
      try {
        if (event.data) {
          data = event.data.json();
        }
      } catch (err) {
        // Ignore parse errors for forwarding
      }

      for (const client of clientList) {
        client.postMessage({
          type: 'PUSH_NOTIFICATION',
          payload: data,
        });
      }
    })
  );
});

// Handle messages from the app
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
