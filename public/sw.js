// Food Item Tracker - Expiry Alert Service Worker
const SW_VERSION = 'food-item-tracker-sw-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle incoming messages from the app (e.g. daily expiry checks)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_EXPIRY_NOTIFICATION') {
    const { title, options } = event.data;
    event.waitUntil(
      self.registration.showNotification(title || 'Food Expiry Alert', {
        icon: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=192&auto=format&fit=crop&q=80',
        badge: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=96&auto=format&fit=crop&q=80',
        vibrate: [200, 100, 200],
        requireInteraction: true,
        ...options,
      })
    );
  }
});

// Handle push notification events
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { body: event.data ? event.data.text() : 'Food items are expiring soon!' };
  }

  const title = data.title || '⚠️ Urgent Food Expiry Alert';
  const options = {
    body: data.body || 'You have items expiring within 2 days in your inventory.',
    icon: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=192&auto=format&fit=crop&q=80',
    badge: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=96&auto=format&fit=crop&q=80',
    tag: data.tag || 'expiry-alert',
    renotify: true,
    requireInteraction: true,
    data: data.url || '/',
    actions: [
      { action: 'cook_now', title: '🍳 Cook AI Recipe' },
      { action: 'view_inventory', title: '📦 View Inventory' },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle user clicking on the notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const action = event.action;
  const targetUrl = event.notification.data || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it and post a message
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          if (action === 'cook_now') {
            client.postMessage({ type: 'NAVIGATE_TAB', tab: 'recipes' });
          } else {
            client.postMessage({ type: 'NAVIGATE_TAB', tab: 'inventory' });
          }
          return;
        }
      }
      // Otherwise open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
