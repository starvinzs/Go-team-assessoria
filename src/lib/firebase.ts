import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  type Firestore
} from 'firebase/firestore';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';
import firebaseConfigData from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId
};

// Initialize App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with local persistent caching for offline resilience
export let db: Firestore;
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  }, firebaseConfigData.firestoreDatabaseId || undefined);
} catch (e) {
  console.warn('Firestore fallback init:', e);
  // fallback if already initialized or browser restricted
  db = initializeFirestore(app, {}, firebaseConfigData.firestoreDatabaseId || undefined);
}

// Initialize Auth
export const auth = getAuth(app);

// Authentication helper
export const ensureAuthenticated = async (): Promise<FirebaseUser | null> => {
  if (auth.currentUser) return auth.currentUser;
  try {
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (error) {
    console.warn('Anonymous auth note (fallback mode enabled):', error);
    return null;
  }
};

export {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
  onAuthStateChanged
};
