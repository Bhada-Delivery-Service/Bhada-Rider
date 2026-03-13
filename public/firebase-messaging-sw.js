// public/firebase-messaging-sw.js
// MUST be in /public/ — Vite copies it as-is, importScripts works here
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey:            'AIzaSyAe-PAuB9GlFX4YlJoFPrfJ9m-NPTW4Ejs',
  authDomain:        'bhada-api.firebaseapp.com',
  projectId:         'bhada-api',
  storageBucket:     'bhada-api.firebasestorage.app',
  messagingSenderId: '478743960698',
  appId:             '1:478743960698:web:f20eee2387d9aa81e0efc3',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || '📦 New Order Available!';
  const body  = payload.notification?.body  || 'A new delivery order is waiting.';
  self.registration.showNotification(title, {
    body,
    icon:     '/icon-192.png',
    data:     payload.data,
    tag:      'order-alert',
    renotify: true,
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const orderId = event.notification.data?.orderId;
  const url     = orderId ? `/#/orders/${orderId}` : '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ('focus' in client) { client.focus(); client.navigate(url); return; }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});