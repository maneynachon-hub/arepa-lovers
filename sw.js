var CACHE = 'arepa-lovers-v2';
var URLS = ['index.html', 'admin.html', 'manifest.json'];
self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(URLS).catch(function(){}); }));
  self.skipWaiting();
});
self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(ks) { return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);})); }));
  self.clients.claim();
});
self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(function(cached) {
    var net = fetch(e.request).then(function(res) {
      if (res && res.status === 200) { var cl = res.clone(); caches.open(CACHE).then(function(c){c.put(e.request,cl);}); }
      return res;
    }).catch(function() { return cached; });
    return cached || net;
  }));
});