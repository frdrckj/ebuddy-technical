import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

if (!admin.apps.length) {
  // For local development with emulators
  if (process.env.NODE_ENV === 'development' && process.env.USE_FIREBASE_EMULATOR === 'true') {
    process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
    process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'demo-project',
    });

    console.log('Firebase initialized with emulator settings');
  } else {
    // For production or when not using emulators
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : undefined;

    admin.initializeApp({
      credential: serviceAccount
        ? admin.credential.cert(serviceAccount)
        : admin.credential.applicationDefault(),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });

    console.log('Firebase initialized with production settings');
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
export default admin;
