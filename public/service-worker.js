const CACHE_NAME = 'static-cache-v3';
const DATA_CACHE_NAME = 'data-cache-v3';

const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/dist/app.bundle.js',
  '/dist/manifest.json',
  '/assets/css/styles.css',
  '/dist/assets/icons/icon_192x192.png',
  '/dist/assets/icons/icon_512x512.png',
  'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js@2.8.0'
];
console.log('Service Worker');
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
      .then(self.skipWaiting())
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener('fetch', function (evt) {
  const { url } = evt.request;
  if (url.includes('/api/')) {
    evt.respondWith(
      caches
        .open(DATA_CACHE_NAME)
        .then((cache) => {
          if (navigator.onLine) {
            return fetch(evt.request)
              .then((response) => {
                if (response.status === 200) {
                  cache.put(evt.request, response.clone());
                }

                return response;
              })
              .catch((err) => {
                return cache.match(evt.request);
              });
          } else {
            return useIndexedDB(
              'pending',
              'store',
              evt.request.method,
              evt.request
            );
          }
        })
        .catch((err) => console.log(err))
    );
  } else {
    evt.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(evt.request).then((response) => {
          return response || fetch(evt.request);
        });
      })
    );
  }
});
