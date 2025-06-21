'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useOrganization } from '@/hooks/useOrganization';
import { AuthStatus } from '../components/AuthStatus';

const HomePage = () => {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuthStore();
  const { isOrganizationSelected } = useOrganization();

  // Redirection automatique si l'utilisateur est connecté
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      if (isOrganizationSelected) {
        router.push('/dashboard');
      } else {
        router.push('/organization-select');
      }
    }
  }, [isAuthenticated, isOrganizationSelected, authLoading, router]);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (isOrganizationSelected) {
        router.push('/dashboard');
      } else {
        router.push('/organization-select');
      }
    } else {
      router.push('/register');
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleDemo = () => {
    // Redirection vers une démo ou page de présentation
    router.push('/demo');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Invetrack</h1>
            </div>
            <div className="flex items-center space-x-4">
              <AuthStatus />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">
              Gestion d'inventaire simplifiée
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Gérez votre inventaire, vos produits et vos fournisseurs en toute simplicité.
              Solution SaaS multi-entreprises pour une gestion efficace.
            </p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={handleGetStarted}
                className="px-6 py-3 text-lg font-medium text-blue-600 bg-white rounded-md hover:bg-gray-100 transition-colors duration-200"
              >
                {isAuthenticated ? 'Accéder à l\'application' : 'Commencer gratuitement'}
              </button>
              <button 
                onClick={handleDemo}
                className="px-6 py-3 text-lg font-medium text-white border border-white rounded-md hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                Voir la démo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Fonctionnalités principales
            </h3>
            <p className="text-lg text-gray-600">
              Tout ce dont vous avez besoin pour gérer votre inventaire efficacement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Gestion des produits</h4>
              <p className="text-gray-600">
                Ajoutez, modifiez et suivez vos produits en temps réel avec alertes de stock
              </p>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Gestion des fournisseurs</h4>
              <p className="text-gray-600">
                Centralisez vos contacts fournisseurs et suivez vos commandes
              </p>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Tableaux de bord</h4>
              <p className="text-gray-600">
                Visualisez vos données avec des graphiques et rapports détaillés
              </p>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
              <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Multi-entreprises</h4>
              <p className="text-gray-600">
                Gérez plusieurs organisations avec des rôles et permissions avancés
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h3>
            <p className="text-lg text-gray-600">
              En 3 étapes simples, commencez à gérer votre inventaire
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Créez votre compte</h4>
              <p className="text-gray-600">
                Inscrivez-vous gratuitement et créez votre organisation
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Ajoutez vos produits</h4>
              <p className="text-gray-600">
                Importez ou ajoutez manuellement vos produits et fournisseurs
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Gérez efficacement</h4>
              <p className="text-gray-600">
                Suivez votre stock, générez des rapports et optimisez vos achats
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600">Produits gérés</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">Fournisseurs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
              <div className="text-gray-600">Disponibilité</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Prêt à commencer ?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Rejoignez des centaines d'entreprises qui font confiance à Invetrack
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={handleGetStarted}
              className="px-8 py-3 text-lg font-medium text-blue-600 bg-white rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              {isAuthenticated ? 'Accéder à l\'application' : 'Commencer gratuitement'}
            </button>
            {!isAuthenticated && (
              <button 
                onClick={handleLogin}
                className="px-8 py-3 text-lg font-medium text-white border border-white rounded-md hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                Se connecter
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="h-6 w-6 bg-blue-400 rounded-lg flex items-center justify-center mr-2">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="text-xl font-bold">Invetrack</span>
            </div>
            <p className="text-gray-400 mb-4">
              Solution SaaS de gestion d'inventaire multi-entreprises
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors duration-200">Mentions légales</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Politique de confidentialité</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Support</a>
            </div>
            <p className="text-gray-400 mt-4">
              © 2024 Invetrack. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
