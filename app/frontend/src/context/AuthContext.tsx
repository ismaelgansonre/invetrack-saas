"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import type { Database } from '@/lib/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'] & {
  profile_image_url?: string;
  cell_number?: string;
  email?: string;
};

// Type pour l'utilisateur Supabase
type User = {
  id: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
};

interface AuthContextType {
  // State
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAuthenticated: boolean;
  showLogoutModal: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
  initialize: () => Promise<void>;
  toggleLogoutModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();
  
  // Get auth state and methods from Zustand store
  const {
    user,
    profile,
    loading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    updateProfile,
    fetchProfile,
    initialize,
  } = useAuthStore();

  const toggleLogoutModal = () => {
    setShowLogoutModal(!showLogoutModal);
  };

  const logout = async () => {
    try {
      await signOut();
      setShowLogoutModal(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signIn(email, password);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    // State
    user,
    profile,
    loading,
    isAuthenticated,
    showLogoutModal,
    
    // Actions
    login,
    signUp,
    logout,
    updateProfile,
    fetchProfile,
    initialize,
    toggleLogoutModal,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 