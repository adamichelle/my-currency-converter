const app_prefix = 'CurrencyConverter_'; //name of the app
const version = 'version_01';    //version of cache
const cache_name = `${app_prefix}${version}`; //cache name
const repository = 'my-currency-converter'; //name of the repo
const assets = [                            
  `./`,
  `./assets/js/jquery.js`,
  `./assets/js/bootstrap.min.js`,
  `./assets/js/all.js`,
  `./assets/js/idb.js`,
  `./assets/js/main.js`,
  `./assets/js/bootstrap.bundle.min.js`,
  `./assets/css/bootstrap.min.css`,
  `./assets/css/all.css`,
  `./assets/css/custom.css`,
  `./assets/webfonts/fa-regular-400.eot`,
  `./assets/webfonts/fa-regular-400.svg`,
  `./assets/webfonts/fa-regular-400.ttf`,
  `./assets/webfonts/fa-regular-400.woff`,
  `./assets/webfonts/fa-regular-400.woff2`,
  `./assets/webfonts/roboto-400-ext.woff2`,
  `./assets/webfonts/roboto-400.woff2`,
  `./assets/webfonts/roboto-900-ext.woff2`,
  `./assets/webfonts/roboto-900.woff2`
]; //assets to be cached

// Respond with cached resources, if there are any. If not, try fetching request
self.addEventListener('fetch', event => {
    
    event.respondWith(
      caches.match(event.request).then( request => {
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
        .catch((e) => console.log(e))
      })
    )
});

  // Delete outdated caches
self.addEventListener('activate', event => {
    event.waitUntil(
      caches.keys().then( keyList => {
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
