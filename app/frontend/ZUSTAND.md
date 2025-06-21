# Zustand - Gestion d'état

Ce projet utilise Zustand pour la gestion d'état globale. Zustand est une bibliothèque légère et performante qui offre une API simple pour gérer l'état de l'application.

## Structure des stores

### 1. AuthStore (`src/stores/authStore.ts`)
Gère l'authentification et les profils utilisateur.

**État :**
- `user`: Utilisateur actuel (User | null)
- `profile`: Profil utilisateur (Profile | null)
- `loading`: État de chargement
- `isAuthenticated`: Statut d'authentification

**Actions principales :**
- `signIn(email, password)`: Connexion
- `signUp(email, password, fullName)`: Inscription
- `signOut()`: Déconnexion
- `updateProfile(updates)`: Mise à jour du profil
- `initialize()`: Initialisation de l'auth

**Utilisation :**
```tsx
import { useAuthStore } from '../stores/authStore';

const { user, profile, loading, signIn, signOut } = useAuthStore();
```

### 2. ProductStore (`src/stores/productStore.ts`)
Gère les produits et l'inventaire.

**État :**
- `products`: Liste des produits
- `currentProduct`: Produit sélectionné
- `loading`: État de chargement
- `error`: Messages d'erreur

**Actions principales :**
- `fetchProducts(organizationId)`: Récupérer les produits
- `createProduct(product)`: Créer un produit
- `updateProduct(id, updates)`: Mettre à jour un produit
- `deleteProduct(id)`: Supprimer un produit
- `searchProducts(query, organizationId)`: Rechercher des produits
- `getLowStockProducts(organizationId, threshold)`: Produits en rupture

### 3. OrganizationStore (`src/stores/organizationStore.ts`)
Gère les organisations et les membres.

**État :**
- `organizations`: Liste des organisations
- `currentOrganization`: Organisation sélectionnée
- `loading`: État de chargement
- `error`: Messages d'erreur

**Actions principales :**
- `fetchOrganizations(userId)`: Récupérer les organisations
- `createOrganization(organization)`: Créer une organisation
- `joinOrganization(organizationId, userId)`: Rejoindre une organisation
- `leaveOrganization(organizationId, userId)`: Quitter une organisation

### 4. TransactionStore (`src/stores/transactionStore.ts`)
Gère les transactions d'inventaire.

**État :**
- `transactions`: Liste des transactions
- `currentTransaction`: Transaction sélectionnée
- `loading`: État de chargement
- `error`: Messages d'erreur

**Actions principales :**
- `fetchTransactions(organizationId)`: Récupérer les transactions
- `createTransaction(transaction)`: Créer une transaction
- `getTransactionsByType(organizationId, type)`: Filtrer par type
- `getTransactionsByDateRange(organizationId, startDate, endDate)`: Filtrer par date

## Middleware utilisés

### subscribeWithSelector
Permet de souscrire aux changements d'état de manière sélective :

```tsx
// Seulement quand user change
const user = useAuthStore((state) => state.user);

// Avec comparaison personnalisée
const user = useAuthStore(
  (state) => state.user,
  (prev, next) => prev?.id === next?.id
);
```

### persist (optionnel)
Pour persister l'état dans le localStorage :

```tsx
import { persist } from 'zustand/middleware';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // ... store implementation
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, profile: state.profile }),
    }
  )
);
```

### devtools (optionnel)
Pour le debugging avec Redux DevTools :

```tsx
import { devtools } from 'zustand/middleware';

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      // ... store implementation
    }),
    { name: 'AuthStore' }
  )
);
```

## Bonnes pratiques

### 1. Sélecteurs optimisés
Utilisez des sélecteurs spécifiques pour éviter les re-renders inutiles :

```tsx
// ❌ Mauvais - re-render à chaque changement d'état
const { user, profile, loading, error } = useAuthStore();

// ✅ Bon - re-render seulement quand user change
const user = useAuthStore((state) => state.user);
const profile = useAuthStore((state) => state.profile);
```

### 2. Actions asynchrones
Gérez correctement les états de chargement et d'erreur :

```tsx
const createProduct = async (product: ProductInsert) => {
  set({ loading: true, error: null });
  try {
    const result = await api.createProduct(product);
    set({ products: [result, ...get().products] });
  } catch (error) {
    set({ error: error.message });
  } finally {
    set({ loading: false });
  }
};
```

### 3. Immuabilité
Toujours créer de nouveaux objets/tableaux :

```tsx
// ❌ Mauvais - mutation directe
const { products } = get();
products.push(newProduct);
set({ products });

// ✅ Bon - nouveau tableau
const { products } = get();
set({ products: [...products, newProduct] });
```

### 4. Types TypeScript
Utilisez les types générés par Supabase :

```tsx
import type { Database } from '../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
```

## Initialisation

Le `StoreProvider` initialise automatiquement les stores au démarrage de l'application :

```tsx
// src/providers/StoreProvider.tsx
export const StoreProvider = ({ children }: StoreProviderProps) => {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
};
```

## Exemples d'utilisation

### Composant avec authentification
```tsx
'use client';

import { useAuthStore } from '../stores/authStore';

export const UserProfile = () => {
  const { user, profile, updateProfile } = useAuthStore();

  if (!user) return <div>Veuillez vous connecter</div>;

  return (
    <div>
      <h2>Profil de {profile?.full_name}</h2>
      <p>Email: {user.email}</p>
      {/* ... */}
    </div>
  );
};
```

### Composant avec produits
```tsx
'use client';

import { useEffect } from 'react';
import { useProductStore } from '../stores/productStore';
import { useAuthStore } from '../stores/authStore';

export const ProductList = () => {
  const { user } = useAuthStore();
  const { products, loading, fetchProducts } = useProductStore();

  useEffect(() => {
    if (user?.profile?.organization_id) {
      fetchProducts(user.profile.organization_id);
    }
  }, [user, fetchProducts]);

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
};
```

## Migration depuis d'autres solutions

### Depuis React Context
- Remplacez `useContext` par `useStore`
- Supprimez les providers imbriqués
- Simplifiez la logique de mise à jour d'état

### Depuis Redux
- Remplacez `useSelector` par `useStore`
- Remplacez `useDispatch` par les actions directes du store
- Supprimez les reducers et actions

## Performance

Zustand est optimisé pour les performances :
- Re-renders minimaux grâce aux sélecteurs
- Pas de wrapper de contexte
- Bundle size minimal (~2KB)
- Support du SSR natif

## Debugging

1. **Redux DevTools** : Ajoutez le middleware `devtools`
2. **Console** : Loggez les changements d'état
3. **React DevTools** : Inspectez les composants qui utilisent les stores

```tsx
// Debug des changements d'état
useAuthStore.subscribe(
  (state) => console.log('Auth state changed:', state)
);
``` 