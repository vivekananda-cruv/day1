// Service worker - handles background messages
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// TODO: Replace these values with YOUR Firebase web config (same as src/firebase.js)
firebase.initializeApp({
  apiKey: "AIzaSyAEGTuDSekDKpgkLWse63BhtQipGmJjFQ4",
  authDomain: "pushnotification-1d560.firebaseapp.com",
  projectId: "pushnotification-1d560",
  storageBucket: "pushnotification-1d560.firebasestorage.app",
  messagingSenderId: "278220911773",
  appId: "1:278220911773:web:0da0923994beda705d5074",
  measurementId: "G-M196Y6183D"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const title = payload.notification?.title || 'Background Message';
  const options = {
    body: payload.notification?.body || '',
    icon: '/favicon.ico'
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
