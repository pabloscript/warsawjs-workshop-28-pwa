import '@babel/polyfill';

const PRECACHE = 'static-v1';

const PRECACHE_URLS = [
  '/',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  '/assets/icon_192x192.714a1246445a6a0da1e3aadf1451234a.png',
  '/assets/manifest.json',
  '/assets/index.js',
];

async function precache(urls) {
  const cache = await caches.open(PRECACHE);

  return cache.addAll(urls);
}

async function cacheThenNetwork(request) {
  const cache = await caches.open(PRECACHE);
  const response = await cache.match(request);

  return response || fetch(request);
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(PRECACHE);
  const cachedResponse = await cache.match(request);

  if (!cachedResponse) {
    const networkResponse = await fetch(request);
    await cache.put(request, networkResponse.clone());

    return networkResponse;
  }

  return cachedResponse;
}

self.addEventListener('install', (event) => {
  event.waitUntil(precache(PRECACHE_URLS));
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  if (requestUrl.pathname === '/') {
    event.respondWith(staleWhileRevalidate(event.request));
  } else if (
    PRECACHE_URLS.includes(requestUrl.href) || PRECACHE_URLS.includes(requestUrl.pathname)
  ) {
    event.respondWith(cacheThenNetwork(event.request));
  } else {
    event.respondWith(fetch(event.request));
  }
});