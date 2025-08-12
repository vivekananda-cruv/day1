// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAEGTuDSekDKpgkLWse63BhtQipGmJjFQ4",
  authDomain: "pushnotification-1d560.firebaseapp.com",
  projectId: "pushnotification-1d560",
  storageBucket: "pushnotification-1d560.firebasestorage.app",
  messagingSenderId: "278220911773",
  appId: "1:278220911773:web:0da0923994beda705d5074",
  measurementId: "G-M196Y6183D"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Replace with the VAPID key you generate in Firebase console -> Cloud Messaging -> Web configuration
const vapidKey = "BBDd6O2dlCUg55lSAzBOUw3L1JI9iT5dFuBmi7fwM3uB8gA1bNqYPGSRDHsdRKfftCbpLtVLlQW8ybmflvM8gfQ";

export async function requestPermissionAndGetToken() {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission not granted');
  }
  const token = await getToken(messaging, { vapidKey });
  return token;
}

export { messaging, onMessage };
