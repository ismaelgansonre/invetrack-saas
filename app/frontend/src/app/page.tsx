import { Package, Users, TrendingUp, Settings } from 'lucide-react';
import { AuthStatus } from '../components/AuthStatus';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600 mr-3" />
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
              <button className="px-6 py-3 text-lg font-medium text-blue-600 bg-white rounded-md hover:bg-gray-100">
                Commencer gratuitement
              </button>
              <button className="px-6 py-3 text-lg font-medium text-white border border-white rounded-md hover:bg-white hover:text-blue-600">
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
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <Package className="h-8 w-8 text-blue-600 mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Gestion des produits</h4>
              <p className="text-gray-600">
                Ajoutez, modifiez et suivez vos produits en temps réel
              </p>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <Users className="h-8 w-8 text-green-600 mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Gestion des fournisseurs</h4>
              <p className="text-gray-600">
                Centralisez vos contacts fournisseurs et commandes
              </p>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <TrendingUp className="h-8 w-8 text-purple-600 mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Tableaux de bord</h4>
              <p className="text-gray-600">
                Visualisez vos données avec des graphiques et rapports
              </p>
            </div>

            <div className="bg-white rounded-lg border shadow-sm p-6">
              <Settings className="h-8 w-8 text-orange-600 mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Multi-entreprises</h4>
              <p className="text-gray-600">
                Gérez plusieurs organisations avec des rôles et permissions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <Package className="h-6 w-6 text-blue-400 mr-2" />
              <span className="text-xl font-bold">Invetrack</span>
            </div>
            <p className="text-gray-400">
              © 2024 Invetrack. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
