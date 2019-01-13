import '@babel/polyfill';

const PRECACHE = 'static-v1';

const PRECACHE_URLS = [
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  '/',
  '/assets/icon_192x192.714a1246445a6a0da1e3aadf1451234a.png',
  '/assets/manifest.json',
  '/assets/index.js',
];

async function precache(urls) {
  const cache = await caches.open(PRECACHE);
  return cache.addAll(urls);
}

self.addEventListener('install', (event) => {
  event.waitUntil(precache(PRECACHE_URLS));
});

