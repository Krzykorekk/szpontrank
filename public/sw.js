const CACHE_NAME = 'szpontrank-v2';
const CORE_ASSETS = ['/manifest.json', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Nigdy nie przechwytujemy zapytań do innych domen (Supabase itp.)
  // ani niczego poza GET — appka ma zawsze normalnie łączyć się z siecią.
  if (url.origin !== self.location.origin || request.method !== 'GET') {
    return;
  }

  // BUG, KTÓRY POWODOWAŁ BIAŁĄ STRONĘ: dokument HTML (adres "/" i inne
  // podstrony) był serwowany z cache "na zawsze", więc po każdym nowym
  // wdrożeniu appka pokazywała starą stronę, która żądała plików JS/CSS
  // z poprzedniego builda (innych nazw = 404 = biała strona).
  // Teraz dokument HTML idzie ZAWSZE najpierw do sieci — cache to tylko
  // zapasowa kopia na wypadek braku internetu.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const kopia = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, kopia));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/')))
    );
    return;
  }

  // Pliki statyczne (JS/CSS/obrazy) mają w nazwie hash z builda — cache-first
  // jest tu bezpieczny, bo stara wersja pliku po prostu nie istnieje już
  // pod tym samym adresem po nowym wdrożeniu.
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
