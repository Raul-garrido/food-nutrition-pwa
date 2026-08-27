const CACHE_NAME = "food-pwa-shell-v2";
const SHELL_FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

// Solo intercepta el propio app-shell (mismo origen). Las llamadas a las
// APIs externas (USDA, Open Food Facts, TheMealDB, Gemini, Claude) se dejan
// pasar sin caché aquí: su cacheo lo gestiona el CacheManager de la app
// sobre IndexedDB, no el Service Worker.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Red primero: así cada actualización desplegada llega de inmediato a
  // quien tenga conexión, en vez de quedarse pegado en la primera copia que
  // se cacheó. Solo se usa la caché como respaldo si falla la red (offline).
  event.respondWith(
    fetch(req).then((res) => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
      }
      return res;
    }).catch(() => caches.match(req))
  );
});
