// =====================================================
// FLEXIMARKET APP — Service Worker v1.0
// Cache-first pour assets statiques, network-first pour Firebase
// =====================================================

const CACHE_NAME = 'fleximarket-v1';
const STATIC_ASSETS = [
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap'
];

// ── Installation : mise en cache des assets statiques ──
self.addEventListener('install', event => {
  console.log('[SW] Installation en cours...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Mise en cache des assets statiques');
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[SW] Certains assets non mis en cache:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// ── Activation : nettoyage des anciens caches ──
self.addEventListener('activate', event => {
  console.log('[SW] Activation...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('[SW] Suppression ancien cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// ── Interception des requêtes ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Laisser passer Firebase (Firestore, Auth) → toujours en ligne
  if (
    url.hostname.includes('firebaseio.com') ||
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('firebase.com') ||
    url.hostname.includes('identitytoolkit.googleapis.com')
  ) {
    return; // pas d'interception, réseau direct
  }

  // Pour l'app principale et assets CDN : Cache-First avec fallback réseau
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        // Rafraîchissement en arrière-plan pour index.html
        if (event.request.url.includes('index.html') || event.request.url.endsWith('/')) {
          fetch(event.request).then(response => {
            if (response && response.status === 200) {
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, response));
            }
          }).catch(() => {});
        }
        return cached;
      }

      // Pas en cache → réseau
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        // Mettre en cache la réponse
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(() => {
        // Hors ligne et pas en cache
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// ── Message de mise à jour ──
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
