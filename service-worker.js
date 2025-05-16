<!-- service-worker.js -->
self.addEventListener('install', e => {
  e.waitUntil(caches.open('discern-cache').then(c => c.addAll([
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json'
  ])));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

/* Periodic reminder check (simplified) */
self.addEventListener('periodicsync', async e => {
  if (e.tag === 'check‑reminders') {
    const dbData = await self.registration.storage.get('issues');
    // iterate issues and show notifications if due (implementation left minimal)
  }
});
