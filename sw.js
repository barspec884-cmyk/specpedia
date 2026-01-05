// ★ キャッシュ名は必ず更新（変更のたびに v を上げる）
const CACHE_NAME = "spec-v2";

// ★ HTMLはキャッシュしない（更新を即反映させる）
const STATIC_ASSETS = [
  "/manifest.json"
];

// インストール：静的アセットのみキャッシュ
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// 有効化：古いキャッシュを全削除
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// フェッチ：network-first（失敗時のみキャッシュ）
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // 静的アセットのみ更新キャッシュ
        const url = new URL(event.request.url);
        if (STATIC_ASSETS.includes(url.pathname)) {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
