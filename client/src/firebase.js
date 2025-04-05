// src/firebase/firebase.js

import { initializeApp } from "firebase/app";

// Firebase configuration from .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);

// Optional Analytics (Only in Production)
export let analytics;
if (import.meta.env.PROD && firebaseConfig.measurementId) {
  analytics = getAnalytics(firebaseApp);
}
