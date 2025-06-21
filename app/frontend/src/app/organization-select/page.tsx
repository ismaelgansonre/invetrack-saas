'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useOrganizationStore } from '@/stores/organizationStore';

const OrganizationSelectPage = () => {
  const router = useRouter();
  const { user, profile } = useAuthStore();
  const { userOrganizations, loading, getUserOrganizations, switchOrganization } = useOrganizationStore();
  
  const [selectedOrgId, setSelectedOrgId] = useState<string>('');

  useEffect(() => {
    if (user) {
      getUserOrganizations(user.id);
    }
  }, [user, getUserOrganizations]);

  useEffect(() => {
    // If user has only one organization, auto-select it
    if (userOrganizations.length === 1) {
      setSelectedOrgId(userOrganizations[0].id);
    }
  }, [userOrganizations]);

  const handleOrganizationSelect = async () => {
    if (!selectedOrgId) return;

    try {
      await switchOrganization(selectedOrgId);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error switching organization:', error);
    }
  };

  const handleCreateOrganization = () => {
    router.push('/organization/create');
  };

  const handleJoinOrganization = () => {
    router.push('/organization/join');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des organisations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sélectionner une organisation
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Choisissez l'organisation avec laquelle vous souhaitez travailler
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {userOrganizations.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Vous n'êtes membre d'aucune organisation.
              </p>
              <div className="space-y-4">
                <button
                  onClick={handleCreateOrganization}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Créer une organisation
                </button>
                <button
                  onClick={handleJoinOrganization}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Rejoindre une organisation
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Vos organisations
                </label>
                <div className="space-y-3">
                  {userOrganizations.map((org) => (
                    <div
                      key={org.id}
                      className={`relative border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedOrgId === org.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedOrgId(org.id)}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="organization"
                          value={org.id}
                          checked={selectedOrgId === org.id}
                          onChange={() => setSelectedOrgId(org.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-900">
                            {org.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Rôle: {org.userRole === 'admin' ? 'Administrateur' : 'Membre'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleCreateOrganization}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Créer une nouvelle
                </button>
                <button
                  onClick={handleJoinOrganization}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Rejoindre une autre
                </button>
              </div>

              <button
                onClick={handleOrganizationSelect}
                disabled={!selectedOrgId}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationSelectPage; 