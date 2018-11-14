this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/serviceWorkers-test/',
        '/serviceWorkers-test/index.html',
        '/serviceWorkers-test/style.css',
        '/serviceWorkers-test/app.js',
        '/serviceWorkers-test/image-list.js',
        '/serviceWorkers-test/star-wars-logo.jpg',
        '/serviceWorkers-test/gallery/bountyHunters.jpg',
        '/serviceWorkers-test/gallery/myLittleVader.jpg',
        '/serviceWorkers-test/gallery/snowTroopers.jpg'
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
    return caches.match('/serviceWorkers-test/gallery/myLittleVader.jpg');
  }));
});
