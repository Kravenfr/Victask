import { useAuthContext } from "@asgardeo/auth-react";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import type { User } from '../types';
import { useState, useEffect } from 'react';

export function useAuth() {
  const { state, signIn, signOut, getBasicUserInfo } = useAuthContext();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [firebaseReady, setFirebaseReady] = useState(false);

  useEffect(() => {
    if (state.isAuthenticated && !userInfo) {
       getBasicUserInfo().then(info => {
        setUserInfo(info);
      }).catch(err => {
        console.error("Error fetching userInfo", err);
      });
    }
  }, [state.isAuthenticated, userInfo]);

  useEffect(() => {
    if (state.isAuthenticated && !firebaseReady) {
      signInAnonymously(auth)
        .then(() => setFirebaseReady(true))
        .catch(err => {
          console.error("Firebase Bridge Error", err);
          setFirebaseReady(true);
        });
    }
  }, [state.isAuthenticated, firebaseReady]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fUser) => {
      if (fUser) setFirebaseReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Identity Mapping
  const currentEmail = userInfo?.email || state.email || state.username || '';
  const firstName = userInfo?.given_name || userInfo?.givenName || '';
  const lastName = userInfo?.family_name || userInfo?.familyName || '';
  const fullName = userInfo?.displayName || userInfo?.name || `${firstName} ${lastName}`.trim();

  const user: User | null = (state.isAuthenticated && firebaseReady) ? {
    uid: state.sub || '',
    email: currentEmail,
    displayName: fullName || state.displayName || state.username || 'User Profile',
    photoURL: userInfo?.picture || userInfo?.photoURL || null,
  } : null;

  return {
    user,
    loading: state.isLoading || (state.isAuthenticated && (!firebaseReady || !userInfo)),
    login: (options?: any) => signIn(options), 
    logout: signOut,
    isAuthenticated: state.isAuthenticated
  };
}
