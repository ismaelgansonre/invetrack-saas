'use client';

import React, { useState } from 'react';
import { useOrganization } from '@/hooks/useOrganization';

const OrganizationSelector = () => {
  const { 
    currentOrganization, 
    userOrganizations, 
    hasMultipleOrganizations,
    switchToOrganization 
  } = useOrganization();
  
  const [isOpen, setIsOpen] = useState(false);

  if (!hasMultipleOrganizations) {
    return (
      <div className="text-sm text-gray-600">
        {currentOrganization?.name || 'Organisation'}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-3 py-2"
      >
        <span className="font-medium">{currentOrganization?.name || 'Sélectionner'}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50 border border-gray-200">
          <div className="py-1">
            <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
              Vos organisations
            </div>
            {userOrganizations.map((org) => (
              <button
                key={org.id}
                onClick={() => {
                  switchToOrganization(org.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100 ${
                  currentOrganization?.id === org.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{org.name}</span>
                  {currentOrganization?.id === org.id && (
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Rôle: {org.userRole === 'admin' ? 'Administrateur' : 'Membre'}
                </div>
              </button>
            ))}
            <div className="border-t border-gray-200 mt-2 pt-2">
              <button
                onClick={() => {
                  // Navigate to organization management
                  window.location.href = '/organization-select';
                }}
                className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 focus:outline-none focus:bg-blue-50"
              >
                Gérer les organisations
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationSelector; 