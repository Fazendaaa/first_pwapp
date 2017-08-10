var cacheName = 'weatherPWA-step-6-1.2';
var dataCacheName = 'weatherData-v1.2';
var filesToCache = [
    '/',
    '/index.html',
    '/scripts/app.js',
    '/styles/inline.css',
    '/images/clear.png',
    '/images/cloudy-scattered-showers.png',
    '/images/cloudy.png',
    '/images/fog.png',
    '/images/ic_add_white_24px.svg',
    '/images/ic_refresh_white_24px.svg',
    '/images/partly-cloudy.png',
    '/images/rain.png',
    '/images/scattered-showers.png',
    '/images/sleet.png',
    '/images/snow.png',
    '/images/thunderstorm.png',
    '/images/wind.png'
];

self.addEventListener('install', e => {
    console.log('[ServiceWorker] Install');

    e.waitUntil(caches.open(cacheName).then(cache => {
        console.log('[ServiceWorker] Caching app shell');
        
        return cache.addAll(filesToCache);
    }));
});

self.addEventListener('activate', e => {
    console.log('[ServiceWorker] Activate');

    e.waitUntil(caches.keys().then(keyList => {
        return Promise.all(keyList.map(key => {
            if(key !== cacheName && key !== dataCacheName) {
                console.log('[ServiceWorker] Caching app shell');

                return caches.delete(key);
            }
        }));
    }));
    
    return self.clients.claim();
});

self.addEventListener('fetch', e => {
    var dataUrl = 'https://query.yahooapis.com/v1/public/yql';

    console.log('[ServiceWorker] Fetch', e.request.url);

    // App asking for fresh weather data -- "Cache then network"
    if(e.request.url.indexOf(dataUrl) > -1) {
        e.respondWith(caches.open(dataCacheName).then(cache => {
            return fetch(e.request).then(response => {
                cache.put(e.request.url, response.clone());

                return response;
            });
        }));    
    }

    // App asking for app shell files -- "Cache, falling back to the network"
    else {
        e.respondWith(caches.match(e.request).then(response => {
            return response || fetch(e.request);
        }));
    }
});
