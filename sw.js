// =============================================
//  TOP 10 QUY NHƠN – SERVICE WORKER FOR FAST CACHING
// =============================================

const CACHE_NAME = 'top10quynhon-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './detail.css',
  './script.js',
  './images/beach_hotel.png',
  './images/seafood_restaurant.png',
  './images/thap_doi.png',
  './images/bao_tang_quang_trung.png',
  './images/dan_te_troi.png',
  './images/thap_duong_long.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
