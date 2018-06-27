const app_prefix = 'CurrencyConverter_';
const version = 'version_01';    
const cache_name = `${app_prefix}${version}`;
const repository = 'my-currency-converter';
const assets = [                            
  `/${repository}/`,                     
  `/${repository}/index.html`,
  `/${repository}/assets/js/jquery.js`,
  `/${repository}/assets/js/bootstrap.min.js`,
  `/${repository}/assets/js/main.js`,
  `/${repository}/assets/css/bootstrap.min.css`, 
  `/${repository}/assets/css/custom.css`,
  `https://fonts.googleapis.com/css?family=Roboto:400,500,700`  
];

// Respond with cached resources
self.addEventListener('fetch', event => {
    console.log('fetch request : ' + event.request.url)
    event.respondWith(
      caches.match(event.request).then( request => {
        /* //This was to check if it was working
        if (request) { // if cache is available, respond with cache
          console.log('responding with cache : ' + event.request.url)
          return request
        } else {       // if there are no cache, try fetching request
          console.log('file is not cached, fetching : ' + event.request.url)
          return fetch(event.request)
        } */
        return request || fetch(event.request);
      })
    )
  });
  
  // Cache resources
self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(cache_name).then(cache => {
        console.log('installing cache : ' + cache_name)
        return cache.addAll(assets)
      })
    )
});

  // Delete outdated caches
self.addEventListener('activate', event => {
    event.waitUntil(
      caches.keys().then( keyList => {
        // `keyList` contains all cache names under your username.github.io
        // filter out ones that has this app prefix to create white list
        const cacheWhitelist = keyList.filter( key => {
          return key.indexOf(app_prefix)
        })
        // add current cache name to white list
        cacheWhitelist.push(cache_name)
  
        return Promise.all(keyList.map( (key, i) => {
          if (cacheWhitelist.indexOf(key) === -1) {
            console.log('deleting cache : ' + keyList[i] )
            return caches.delete(keyList[i])
          }
        }))
      })
    )
  });