/* ══ SERVICE WORKER — Jayne Melo · Bordando Sonhos ══════════ */
const CACHE = 'jayne-melo-v2';
const FILES = [
  './JAYNE_MELO_FINAL.html',
  './financeiro.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      Promise.allSettled(FILES.map(f => c.add(f).catch(() => {})))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Não interceptar chamadas de API (Supabase, CDNs)
  const url = e.request.url;
  if (url.includes('supabase.co') || url.includes('cdn.') || 
      url.includes('fonts.') || url.includes('cdnjs.')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return response;
      }).catch(() => {
        if (e.request.destination === 'document') {
          return caches.match('./JAYNE_MELO_FINAL.html');
        }
      });
    })
  );
});
