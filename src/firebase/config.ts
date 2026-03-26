import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAtYP9xqR9muXAKSF4wsDgFbqdKU9wfXTg",
  authDomain: "victask-8bfed.firebaseapp.com",
  projectId: "victask-8bfed",
  storageBucket: "victask-8bfed.firebasestorage.app",
  messagingSenderId: "1065689209618",
  appId: "1:1065689209618:web:feb6212a929e32fdbd31cb",
  measurementId: "G-4XELV5WSYX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use initializeFirestore with long polling to bypass AdBlockers that block WebSockets
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});

export const googleProvider = new GoogleAuthProvider();
