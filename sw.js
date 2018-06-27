const staticAssets = [
    './',
    './css/bootstrap.min.css',
    './css/custom.css',
    './js/jquery.js',
    './js/bootstrap.min.js',
    './js/main.js'
];
const staticCacheName = 'currency-converter-static-v2';

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(staticCacheName)
        .then( function(cache){
            return cache.addAll(
                [
                    './',
                    './css/bootstrap.min.css',
                    './css/custom.css',
                    './js/jquery.js',
                    './js/bootstrap.min.js',
                    './js/main.js'
                ]  
            );
        })
    );
    
}); 