'use client';

import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** True once the Firebase web config has been filled in (.env.local). */
export const firebaseConfigured = Boolean(config.apiKey && config.projectId);
const useEmulator = process.env.NEXT_PUBLIC_FIREBASE_EMULATOR === '1';

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

export function firebase() {
  if (!firebaseConfigured) return null;
  if (!app) {
    app = getApps()[0] ?? initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
    if (useEmulator) {
      connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
      connectFirestoreEmulator(db, '127.0.0.1', 8080);
    }
  }
  return { app: app!, auth: auth!, db: db! };
}

/**
 * Storage is only needed for admin uploads (quiz audio), so its SDK is loaded on demand instead of
 * being bundled into every page. Uploads go to the default bucket from NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET.
 */
export async function getStorageLazy(): Promise<FirebaseStorage | null> {
  const fb = firebase();
  if (!fb) return null;
  if (!storage) {
    const { getStorage } = await import('firebase/storage');
    storage = getStorage(fb.app);
  }
  return storage;
}
