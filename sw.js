const CACHE_NAME = 'vix-monitor-v1';
const assets = ['./', './index.html', './manifest.json'];

// 安裝 Service Worker 並快取檔案
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

// 攔截請求，支援離線瀏覽
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

// 接收背景推播事件 (配合後端推播使用)
self.addEventListener('push', (e) => {
  const data = e.data ? e.data.json() : { title: 'VIX 警戒通知', body: '波動率異常，請注意風控！' };
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: 'https://cdn-icons-png.flaticon.com/512/2622/2622282.png'
  });
});