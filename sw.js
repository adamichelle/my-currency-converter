const staticCacheName = 'converter-static-v1';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCacheName).then( cache => {
      return cache.addAll([
        './',
        './assets/js/jquery.js',
        './assets/js/bootstrap.min.js',
        './assets/js/main.js',
        './assets/css/custom.css',
        './assets/css/bootstrap.min.css',
        'https://fonts.googleapis.com/css?family=Roboto:400,500,700'
      ]);
    })
  );
});