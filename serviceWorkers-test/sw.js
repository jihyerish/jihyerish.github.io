this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/serviceWorkers/',
        '/serviceWorkers/index.html',
        '/serviceWorkers/style.css',
        '/serviceWorkers/app.js',
        '/serviceWorkers/image-list.js',
        '/serviceWorkers/star-wars-logo.jpg',
        '/serviceWorkers/gallery/bountyHunters.jpg',
        '/serviceWorkers/gallery/myLittleVader.jpg',
        '/serviceWorkers/gallery/snowTroopers.jpg'
      ]);
    })
  );
});

this.addEventListener('fetch', function(event) {
  var response;
  event.respondWith(caches.match(event.request).catch(function() {
    return fetch(event.request);
  }).then(function(r) {
    response = r;
    caches.open('v1').then(function(cache) {
      cache.put(event.request, response);
    });
    return response.clone();
  }).catch(function() {
    return caches.match('/serviceWorkers/gallery/myLittleVader.jpg');
  }));
});
