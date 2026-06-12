// Service Worker for DesertShop.fit - Performance caching
const CACHE_NAME = 'desertshop-v2';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/products.html',
    '/categories.html',
    '/product.html',
    '/checkout.html',
    '/css/theme.css',
    '/js/firebase.js',
    '/js/site.js',
    '/js/cart.js'
];

// Install: Cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        }).catch(() => {
            // Silent fail for optional assets
        })
    );
    self.skipWaiting();
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch: Cache-first strategy for static, network-first for API
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip Firebase and analytics
    if (url.hostname.includes('google') || 
        url.hostname.includes('firebase') ||
        url.hostname.includes('gstatic')) {
        return;
    }

    // Cache static assets (JS, CSS, images)
    if (request.destination === 'script' || 
        request.destination === 'style' ||
        request.destination === 'image') {
        event.respondWith(
            caches.match(request).then((response) => {
                if (response) {
                    return response;
                }
                return fetch(request).then((fetchResponse) => {
                    if (!fetchResponse || fetchResponse.status !== 200) {
                        return fetchResponse;
                    }
                    const responseToCache = fetchResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseToCache);
                    });
                    return fetchResponse;
                });
            })
        );
        return;
    }

    // Network-first for HTML pages
    if (request.destination === 'document') {
        event.respondWith(
            fetch(request).catch(() => {
                return caches.match(request);
            })
        );
        return;
    }

    // Default: Network with cache fallback
    event.respondWith(
        fetch(request).catch(() => {
            return caches.match(request);
        })
    );
});
