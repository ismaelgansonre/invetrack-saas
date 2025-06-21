'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

interface StoreProviderProps {
  children: React.ReactNode;
}

export const StoreProvider = ({ children }: StoreProviderProps) => {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    // Initialize auth store on app startup
    initialize();
  }, [initialize]);

  return <>{children}</>;
}; 