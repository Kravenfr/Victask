import { useAuthContext } from "@asgardeo/auth-react";
import type { User } from '../types';

export function useAuth() {
  const { state, signIn, signOut } = useAuthContext();

  const user: User | null = state.isAuthenticated ? {
    uid: state.sub || '',
    email: state.username || '',
    displayName: state.displayName || state.username || '',
    photoURL: null,
  } : null;

  return {
    user,
    loading: state.isLoading,
    loginWithGoogle: signIn, 
    logout: signOut,
    isAuthenticated: state.isAuthenticated
  };
}
