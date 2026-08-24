// AffiliateWorkbench/html/sw.js
const CACHE_NAME = "deal-workbench-v4";

const OFFLINE_URLS = [
    "./index.html",
    "./deals.html",
    "./image-studio.html",
    "./content.html",
    "./post-builder.html",
    "./settings.html",
    "../css/style.css",
    "../css/deals.css",
    "../css/image-studio.css",
    "../css/content.css",
    "../css/post-builder.css",
    "../css/settings.css",
    "../js/app.js",
    "../js/deals.js",
    "../js/image-studio.js",
    "../js/content.js",
    "../js/post-builder.js",
    "../js/settings.js",
    "../manifest.json"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.allSettled(
                OFFLINE_URLS.map((url) =>
                    fetch(url).then((res) => {
                        if (res.ok) return cache.put(url, res);
                    })
                )
            );
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            )
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return fetch(event.request).catch(() => caches.match("./index.html"));
        })
    );
});
