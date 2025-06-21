import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const {
    user,
    profile,
    loading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    updateProfile,
    initialize,
  } = useAuthStore();

  useEffect(() => {
    // Initialize auth state when the hook is first used
    initialize();
  }, [initialize]);

  return {
    user,
    profile,
    loading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };
}; 