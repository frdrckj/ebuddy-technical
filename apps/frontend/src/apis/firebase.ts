import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);

// Set up emulator connections if in development
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(firestore, 'localhost', 8080);
  console.log('Firebase emulators connected');
}

export { app, auth, firestore };
