// Service Worker für den Notbetrieb.
//
// Bewusst minimal: er speichert ausschliesslich notfall.html und beantwortet
// auch nur Anfragen dafuer. Alles andere laeuft unberuehrt durchs Netz, damit
// hier kein veralteter Stand der eigentlichen App ausgeliefert werden kann -
// das ist der haeufigste Schaden, den ein Service Worker anrichtet.

const CACHE = 'roots-notbetrieb-v1';
const OFFLINE_PAGE = 'notfall.html';

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // reload umgeht den HTTP-Cache, damit wirklich der aktuelle Stand landet.
    await cache.add(new Request(OFFLINE_PAGE, { cache: 'reload' }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((n) => n.startsWith('roots-notbetrieb-') && n !== CACHE).map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;
  if (!url.pathname.endsWith('/' + OFFLINE_PAGE)) return; // alles andere nicht anfassen

  event.respondWith((async () => {
    // Netz zuerst, damit Aenderungen ankommen; faellt es aus, kommt die Kopie.
    try {
      const fresh = await fetch(event.request);
      if (fresh && fresh.ok) {
        const cache = await caches.open(CACHE);
        cache.put(event.request, fresh.clone());
        return fresh;
      }
      throw new Error('unbrauchbare Antwort ' + (fresh && fresh.status));
    } catch (error) {
      const cached = await caches.match(event.request, { ignoreSearch: true })
        || await caches.match(OFFLINE_PAGE, { ignoreSearch: true });
      if (cached) return cached;
      throw error;
    }
  })());
});

// Die App kann nachfragen, ob der Notbetrieb offline bereitsteht.
self.addEventListener('message', async (event) => {
  if (event.data !== 'notbetrieb-status') return;
  const cached = await caches.match(OFFLINE_PAGE, { ignoreSearch: true });
  event.source?.postMessage({ type: 'notbetrieb-status', ready: !!cached });
});
