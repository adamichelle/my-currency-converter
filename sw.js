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


self.addEventListener('install', event => {
    console.log(assets);
 /*  event.waitUntil(
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
  ); */
});