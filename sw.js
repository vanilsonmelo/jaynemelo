/* ══ SERVICE WORKER — Jayne Melo · Bordando Sonhos ══════════
   Cache offline: o app funciona mesmo sem internet
══════════════════════════════════════════════════════════ */
const CACHE = 'jayne-melo-v1';
const FILES = [
  '/JAYNE_MELO_FINAL.html',
  '/financeiro.html',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

// Instalar e cachear recursos principais
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => {
      return Promise.allSettled(FILES.map(f => c.add(f).catch(() => {})));
    }).then(() => self.skipWaiting())
  );
});

// Ativar e limpar caches antigos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Servir do cache, fallback para rede
self.addEventListener('fetch', e => {
  // Não interceptar chamadas do Supabase (precisam de rede)
  if (e.request.url.includes('supabase.co')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return response;
      }).catch(() => {
        // Offline e não está em cache — retornar página principal
        if (e.request.destination === 'document') {
          return caches.match('/JAYNE_MELO_FINAL.html');
        }
      });
    })
  );
});
