# Intégration Zustand dans les composants existants

Ce guide explique comment migrer vos composants existants pour utiliser Zustand au lieu des hooks et contextes personnalisés.

## 🎯 **Migration des composants**

### **1. Composants déjà convertis**

#### **Header.tsx** ✅
- **Avant** : Utilisait `useProfile` hook
- **Après** : Utilise `useAuthStore` de Zustand
- **Changements** :
  ```tsx
  // Avant
  const { profile } = useProfile();
  
  // Après
  const { profile } = useAuthStore();
  ```

#### **AccountMenu.tsx** ✅
- **Avant** : Utilisait `useProfile` et `useAuth` context
- **Après** : Utilise `useAuthStore` de Zustand
- **Changements** :
  ```tsx
  // Avant
  const { profile, loading } = useProfile();
  const { toggleLogoutModal } = useAuth();
  
  // Après
  const { profile, loading, signOut } = useAuthStore();
  ```

#### **InventoryOverview.tsx** ✅
- **Avant** : Utilisait `useProduct` et `useSupplier` hooks
- **Après** : Utilise `useProductStore` de Zustand
- **Changements** :
  ```tsx
  // Avant
  const { products } = useProduct();
  const { suppliers } = useSupplier();
  
  // Après
  const { products, loading, fetchProducts } = useProductStore();
  const { profile } = useAuthStore();
  ```

#### **ProductForm.tsx** ✅
- **Nouveau** : Formulaire complet avec Zustand
- **Fonctionnalités** :
  - Création et modification de produits
  - Validation des formulaires
  - Gestion des erreurs
  - Intégration avec `useProductStore`

#### **ProductList.tsx** ✅
- **Nouveau** : Liste de produits avec Zustand
- **Fonctionnalités** :
  - Affichage des produits
  - Recherche et tri
  - Gestion des stocks
  - Actions CRUD

## 🔄 **Composants à migrer**

### **2. Composants Dashboard**

#### **KPIGrid.jsx** → **KPIGrid.tsx**
```tsx
// Avant
const { products } = useProduct();
const { suppliers } = useSupplier();

// Après
const { products } = useProductStore();
const { profile } = useAuthStore();
```

#### **ProductAlerts.jsx** → **ProductAlerts.tsx**
```tsx
// Avant
const { products } = useProduct();

// Après
const { products, getLowStockProducts } = useProductStore();
const { profile } = useAuthStore();

useEffect(() => {
  if (profile?.organization_id) {
    getLowStockProducts(profile.organization_id, 10);
  }
}, [profile?.organization_id]);
```

#### **RecentActivity.jsx** → **RecentActivity.tsx**
```tsx
// Avant
const { transactions } = useTransaction();

// Après
const { transactions, fetchTransactions } = useTransactionStore();
const { profile } = useAuthStore();

useEffect(() => {
  if (profile?.organization_id) {
    fetchTransactions(profile.organization_id);
  }
}, [profile?.organization_id]);
```

### **3. Composants Forms**

#### **SupplierForm/SupplierForm.jsx** → **SupplierForm.tsx**
```tsx
// Créer un nouveau store pour les fournisseurs
const { createSupplier, updateSupplier } = useSupplierStore();
const { profile } = useAuthStore();
```

#### **OrderForm/OrderForm.jsx** → **OrderForm.tsx**
```tsx
// Utiliser le store de transactions
const { createTransaction } = useTransactionStore();
const { products } = useProductStore();
```

### **4. Composants Inventory**

#### **ProductCard/ProductCard.jsx** → **ProductCard.tsx**
```tsx
// Avant
const { updateProduct } = useProduct();

// Après
const { updateProduct } = useProductStore();
```

#### **Filters/ProductFilters.jsx** → **ProductFilters.tsx**
```tsx
// Utiliser les méthodes de filtrage du store
const { searchProducts, getLowStockProducts } = useProductStore();
```

### **5. Composants Suppliers**

#### **SupplierList/SupplierList.jsx** → **SupplierList.tsx**
```tsx
// Créer un store pour les fournisseurs
const { suppliers, fetchSuppliers } = useSupplierStore();
const { profile } = useAuthStore();
```

## 🏗️ **Stores à créer**

### **1. SupplierStore** (à créer)
```tsx
// src/stores/supplierStore.ts
interface SupplierState {
  suppliers: Supplier[];
  currentSupplier: Supplier | null;
  loading: boolean;
  error: string | null;
  
  fetchSuppliers: (organizationId: string) => Promise<void>;
  createSupplier: (supplier: SupplierInsert) => Promise<Supplier>;
  updateSupplier: (id: string, updates: SupplierUpdate) => Promise<Supplier>;
  deleteSupplier: (id: string) => Promise<void>;
}
```

### **2. NotificationStore** (à créer)
```tsx
// src/stores/notificationStore.ts
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}
```

## 📋 **Checklist de migration**

### **Étape 1 : Préparation**
- [ ] Installer Zustand ✅
- [ ] Créer les stores de base ✅
- [ ] Configurer le StoreProvider ✅

### **Étape 2 : Migration des composants principaux**
- [ ] Header ✅
- [ ] AccountMenu ✅
- [ ] InventoryOverview ✅
- [ ] ProductForm ✅
- [ ] ProductList ✅

### **Étape 3 : Migration des composants Dashboard**
- [ ] KPIGrid
- [ ] ProductAlerts
- [ ] RecentActivity
- [ ] QuickActions
- [ ] InfoCard

### **Étape 4 : Migration des composants Forms**
- [ ] SupplierForm
- [ ] OrderForm
- [ ] ProductForm ✅

### **Étape 5 : Migration des composants Inventory**
- [ ] ProductCard
- [ ] ProductFilters
- [ ] ProductDataGrid

### **Étape 6 : Migration des composants Suppliers**
- [ ] SupplierList
- [ ] SupplierCard
- [ ] SupplierForm

### **Étape 7 : Migration des composants UI**
- [ ] Modals
- [ ] Notifications
- [ ] Spinners
- [ ] Buttons

## 🔧 **Patterns de migration**

### **1. Remplacement des hooks personnalisés**
```tsx
// ❌ Avant
import { useProfile } from '@/utils/hooks/useProfile';
import { useProduct } from '@/utils/hooks/useProduct';

// ✅ Après
import { useAuthStore } from '@/stores/authStore';
import { useProductStore } from '@/stores/productStore';
```

### **2. Remplacement des contextes**
```tsx
// ❌ Avant
import { useAuth } from '@/context/AuthContext';

// ✅ Après
import { useAuthStore } from '@/stores/authStore';
```

### **3. Gestion des états de chargement**
```tsx
// ❌ Avant
const [loading, setLoading] = useState(false);

// ✅ Après
const { loading } = useProductStore();
```

### **4. Gestion des erreurs**
```tsx
// ❌ Avant
const [error, setError] = useState(null);

// ✅ Après
const { error } = useProductStore();
```

## 🎨 **Avantages de la migration**

### **Performance**
- ✅ Re-renders optimisés avec les sélecteurs
- ✅ Pas de wrapper de contexte
- ✅ Bundle size réduit

### **Développement**
- ✅ API plus simple
- ✅ Moins de boilerplate
- ✅ Debugging facilité

### **Maintenance**
- ✅ Code plus lisible
- ✅ État centralisé
- ✅ Types TypeScript automatiques

## 🚀 **Prochaines étapes**

1. **Créer les stores manquants** (SupplierStore, NotificationStore)
2. **Migrer les composants restants** selon la checklist
3. **Ajouter des middlewares** (persist, devtools) si nécessaire
4. **Optimiser les performances** avec des sélecteurs spécifiques
5. **Ajouter des tests** pour les stores

## 📚 **Ressources**

- [Documentation Zustand](https://github.com/pmndrs/zustand)
- [Guide de migration](https://github.com/pmndrs/zustand#migrating-from-redux)
- [Exemples d'utilisation](https://github.com/pmndrs/zustand#examples) 