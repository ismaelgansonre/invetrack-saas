'use client';

import { useAuthStore } from '../stores/authStore';

export const AuthStatus = () => {
  const { user, profile, loading, isAuthenticated, signOut } = useAuthStore();

  if (loading) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-600">Chargement...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-600">Non connecté</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-green-800 font-medium">
            Connecté en tant que: {profile?.full_name || user?.email}
          </p>
          <p className="text-green-600 text-sm">
            {user?.email}
          </p>
        </div>
        <button
          onClick={() => signOut()}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}; 