// Firebase Web SDK config. These values identify the Firebase project and are safe to
// expose to the client (they are not secrets — access is controlled by Firestore/Storage
// security rules, not by hiding this config). In production on Firebase App Hosting,
// initializeFirebase() in ./index.ts calls initializeApp() with no arguments first, which
// is auto-populated by the hosting environment; this object is only the local-dev fallback.
export const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'studio-7320841525-43d78',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:299844441025:web:e18d38e3532d7adf295540',
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDQvNp4cgPLjj7T7CR0WQZwFnJuVvf0EX8',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'studio-7320841525-43d78.firebaseapp.com',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '299844441025',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'studio-7320841525-43d78.firebasestorage.app',
};
