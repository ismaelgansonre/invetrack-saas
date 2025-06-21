# Architecture Multi-Tenant - Invetrack SaaS

## Vue d'ensemble

Invetrack est conçu comme une application SaaS multi-tenant où chaque organisation a ses propres données isolées. Cette architecture permet à plusieurs entreprises d'utiliser la même application tout en gardant leurs données séparées.

## Structure de l'architecture

### 1. Modèle de données

#### Tables principales avec isolation par organisation :

- **organizations** : Table racine pour chaque organisation
- **organization_members** : Relation many-to-many entre utilisateurs et organisations
- **profiles** : Profils utilisateurs avec référence à l'organisation actuelle
- **products** : Produits isolés par `organization_id`
- **suppliers** : Fournisseurs isolés par `organization_id`
- **transactions** : Transactions isolées par `organization_id`
- **audit_logs** : Logs d'audit isolés par `organization_id`

### 2. Gestion des rôles

#### Rôles dans une organisation :
- **admin** : Accès complet à l'organisation
- **member** : Accès limité aux données de l'organisation
- **viewer** : Accès en lecture seule

### 3. Flux d'authentification et sélection d'organisation

```
1. Utilisateur se connecte → /login
2. Vérification de l'authentification
3. Si pas d'organisation sélectionnée → /organization-select
4. Sélection/création d'organisation
5. Redirection vers → /dashboard
```

## Stores Zustand

### AuthStore
- Gestion de l'authentification utilisateur
- Stockage du profil utilisateur
- Vérification de l'organisation actuelle

### OrganizationStore
- Gestion des organisations de l'utilisateur
- Sélection et changement d'organisation
- Gestion des rôles utilisateur

### ProductStore
- CRUD des produits (isolés par organisation)
- Filtrage et recherche
- Gestion du stock

### SupplierStore
- CRUD des fournisseurs (isolés par organisation)
- Gestion des contacts

### TransactionStore
- Gestion des transactions (achats/ventes)
- Calculs financiers
- Historique des mouvements

## Sécurité et isolation

### Row Level Security (RLS)
Toutes les requêtes sont protégées par des politiques RLS :

```sql
-- Exemple pour les produits
CREATE POLICY "Users can view products from their organization" ON products
FOR SELECT USING (
  organization_id IN (
    SELECT organization_id FROM organization_members 
    WHERE user_id = auth.uid()
  )
);
```

### Vérifications côté client
- Hook `useOrganization` pour vérifier l'accès
- Redirection automatique si pas d'organisation
- Validation des permissions avant les actions

## Composants principaux

### OrganizationSelector
- Sélecteur d'organisation dans le header
- Affichage du nom de l'organisation actuelle
- Menu déroulant pour changer d'organisation

### OrganizationSelectPage
- Page de sélection d'organisation
- Liste des organisations de l'utilisateur
- Options pour créer/rejoindre une organisation

### CreateOrganizationPage
- Formulaire de création d'organisation
- Génération automatique du slug
- Attribution du rôle admin au créateur

## Hooks personnalisés

### useOrganization
```typescript
const {
  currentOrganization,
  userOrganizations,
  requireOrganization,
  switchToOrganization,
  hasMultipleOrganizations
} = useOrganization();
```

### useAuth
```typescript
const {
  user,
  profile,
  isAuthenticated,
  login,
  logout,
  register
} = useAuth();
```

## Pages protégées

Toutes les pages principales vérifient :
1. L'authentification de l'utilisateur
2. La sélection d'une organisation
3. Les permissions d'accès

### Exemple de protection :
```typescript
useEffect(() => {
  if (!authLoading) {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!profile?.organization_id) {
      router.push('/organization-select');
      return;
    }
  }
}, [isAuthenticated, profile, authLoading, router]);
```

## Gestion des erreurs

### Erreurs courantes :
- Utilisateur non authentifié → Redirection vers /login
- Pas d'organisation sélectionnée → Redirection vers /organization-select
- Pas de permissions → Affichage d'erreur 403
- Erreur de base de données → Affichage dans le snackbar

### Gestion des états de chargement :
- Spinners pendant le chargement des données
- Overlays pour les actions longues
- États de chargement dans les stores

## Bonnes pratiques

### 1. Isolation des données
- Toujours filtrer par `organization_id`
- Utiliser les politiques RLS
- Vérifier les permissions avant les actions

### 2. Performance
- Chargement lazy des données
- Mise en cache des organisations
- Optimisation des requêtes

### 3. UX
- Feedback immédiat pour les actions
- États de chargement clairs
- Messages d'erreur explicites

### 4. Sécurité
- Validation côté client et serveur
- Vérification des permissions
- Audit des actions importantes

## Migration et déploiement

### Variables d'environnement requises :
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Scripts de base de données :
- Création des tables avec RLS
- Insertion des données de test
- Configuration des politiques de sécurité

## Tests

### Tests unitaires :
- Stores Zustand
- Hooks personnalisés
- Composants UI

### Tests d'intégration :
- Flux d'authentification
- Gestion des organisations
- CRUD des données

### Tests E2E :
- Parcours utilisateur complet
- Gestion des erreurs
- Performance

## Monitoring et analytics

### Métriques à surveiller :
- Nombre d'organisations actives
- Utilisation des fonctionnalités
- Performance des requêtes
- Erreurs et exceptions

### Logs d'audit :
- Actions importantes des utilisateurs
- Changements d'organisation
- Modifications de données sensibles 