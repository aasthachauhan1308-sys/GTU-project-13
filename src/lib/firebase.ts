import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC6To-Okc3euGz_xIlUkJLbg7yiF5Z8ibE",
  authDomain: "chromatic-server-lmvz5.firebaseapp.com",
  projectId: "chromatic-server-lmvz5",
  storageBucket: "chromatic-server-lmvz5.firebasestorage.app",
  messagingSenderId: "798720277331",
  appId: "1:798720277331:web:6c59abb4fe48d4d300bfa6"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom Database ID
export const db = initializeFirestore(app, {}, "ai-studio-gtustudymaterial-64e6b5fe-e826-46a0-8787-38cfab8f387e");

// Initialize Firebase Storage
export const storage = getStorage(app);
