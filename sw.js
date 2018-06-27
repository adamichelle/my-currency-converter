const staticCacheName = 'converter-static-v1';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCacheName).then( cache => {
      return cache.addAll([
        './',
        './js/jquery.js',
        './js/bootstrap.min.js',
        './js/main.js',
        './css/custom.css',
        './css/bootstrap.min.css',
        'https://fonts.googleapis.com/css?family=Roboto:400,500,700'
      ]);
    })
  );
});