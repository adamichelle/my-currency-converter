const app_prefix = 'CurrencyConverter_';
const version = 'version_02';    
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
        if (request) { // if cache is available, respond with cache
          console.log('responding with cache : ' + event.request.url)
          return request
        } else {       // if there are no cache, try fetching request
          console.log('file is not cached, fetching : ' + event.request.url)
          return fetch(event.request)
        }
  
        // You can omit if/else for console.log & put one line below like this too.
        // return request || fetch(e.request)
      })
    )
  })
  
  // Cache resources
  self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(cache_name).then(cache => {
        console.log('installing cache : ' + cache_name)
        return cache.addAll(assets)
      })
    )
  });