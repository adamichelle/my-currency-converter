const app_prefix = 'CurrencyConverter_'; //name of the app
const version = 'version_01';    //version of cache
const cache_name = `${app_prefix}${version}`; //cache name
const repository = 'my-currency-converter'; //name of the repo
const assets = [                            
  `/${repository}/`,                     
  `/${repository}/index.html`,
  `/${repository}/assets/js/jquery.js`,
  `/${repository}/assets/js/bootstrap.min.js`,
  `/${repository}/assets/js/all.js`,
  `/${repository}/assets/js/idb.js`,
  `/${repository}/assets/js/main.js`,
  `/${repository}/assets/js/bootstrap.bundle.min.js`,
  `/${repository}/assets/css/bootstrap.min.css`,
  `/${repository}/assets/css/all.css`,
  `/${repository}/assets/css/custom.css`,
  `/${repository}/assets/webfonts/fa-regular-400.eot`,
  `/${repository}/assets/webfonts/fa-regular-400.svg`,
  `/${repository}/assets/webfonts/fa-regular-400.ttf`,
  `/${repository}/assets/webfonts/fa-regular-400.woff`,
  `/${repository}/assets/webfonts/fa-regular-400.woff2`,
  `/${repository}/assets/webfonts/fa-regular-400.eot`,
  `/${repository}/assets/webfonts/fa-regular-400.svg`,
  `/${repository}/assets/webfonts/fa-regular-400.ttf`,
  `/${repository}/assets/webfonts/fa-regular-400.woff`,
  `/${repository}/assets/webfonts/fa-regular-400.woff2`,
  `/${repository}/assets/webfonts/roboto-400-ext.woff2`,
  `/${repository}/assets/webfonts/roboto-400.woff2`,
  `/${repository}/assets/webfonts/roboto-900-ext.woff2`,
  `/${repository}/assets/webfonts/roboto-900.woff2`
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