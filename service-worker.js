const CACHE = "3dcalc-v2";

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll([
        "/",
        "/index.html",
        "/styles.css",
        "/main.jsx",
        "/App.jsx",
        "/calc.js",
        "/db.js",
        "/manifest.webmanifest",
        "/icon-192.png",
        "/icon-512.png"
      ])
    )
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(caches.match(e.request).then((resp) => resp || fetch(e.request)));
});
