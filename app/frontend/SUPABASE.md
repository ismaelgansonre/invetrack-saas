# Configuration Supabase

## Vue d'ensemble

Ce projet utilise Supabase comme backend-as-a-service avec une configuration TypeScript optimisée.

## Configuration

### 1. Variables d'environnement

Le fichier `.env.local` contient :
```env
NEXT_PUBLIC_SUPABASE_URL=https://quqkoacpcuegovmfsddg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Types TypeScript

Les types sont générés automatiquement depuis votre base de données Supabase :

```bash
# Régénérer les types après modification du schéma
pnpm generate-types
```

### 3. Client Supabase

Le client est configuré dans `src/lib/supabase.ts` avec les types générés :

```typescript
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

export const supabase = createClient<Database>(url, key);
```

## Utilisation

### Authentification

```typescript
import { useAuth } from '@/hooks/useAuth';

const { user, profile, signIn, signUp, signOut } = useAuth();
```

### Requêtes typées

```typescript
// Récupérer des produits
const { data: products } = await supabase
  .from('products')
  .select('*')
  .eq('organization_id', orgId);

// Insérer un produit
const { data: newProduct } = await supabase
  .from('products')
  .insert({
    name: 'Nouveau produit',
    price: 29.99,
    organization_id: orgId
  })
  .select()
  .single();
```

## Structure de la base de données

- **organizations** : Entreprises/organisations
- **profiles** : Profils utilisateurs (liés à Supabase Auth)
- **products** : Produits de l'inventaire
- **suppliers** : Fournisseurs
- **orders** : Commandes
- **order_items** : Lignes de commande
- **invitations** : Invitations d'utilisateurs
- **audit_logs** : Logs d'audit

## Sécurité

- Row Level Security (RLS) activé sur toutes les tables
- Chaque utilisateur ne voit que les données de son organisation
- Politiques de sécurité configurées dans Supabase

## Développement

1. **Modifier le schéma** : Utilisez l'interface Supabase ou les migrations
2. **Régénérer les types** : `pnpm generate-types`
3. **Tester** : `pnpm dev`

## Liens utiles

- [Documentation Supabase](https://supabase.com/docs)
- [Types TypeScript](https://supabase.com/docs/guides/api/typescript-support)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security) 