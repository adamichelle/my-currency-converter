const staticCacheName = 'converter-static-v1';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCacheName).then( cache => {
      return cache.addAll([
        './'
      ]);
    })
  );
});