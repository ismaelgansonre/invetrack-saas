# Frontend Next.js - Invetrack SaaS

Application frontend Next.js pour la gestion d'inventaire multi-entreprises.

## Configuration

### Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env

```

### Installation des dépendances

```bash
pnpm install
```

### Développement

```bash
pnpm dev
```

L'application sera accessible sur `http://localhost:3000`

### Build

```bash
pnpm build
```

### Production

```bash
pnpm start
```

## Structure du projet

```
src/
├── app/                 # Pages Next.js App Router
├── components/          # Composants React
├── hooks/              # Hooks personnalisés
├── lib/                # Configuration et utilitaires
├── config/             # Configuration de l'application
└── types/              # Types TypeScript
```

## Fonctionnalités

- 🔐 Authentification avec Supabase
- 🏢 Gestion multi-entreprises
- 📦 Gestion d'inventaire
- 👥 Gestion des utilisateurs et rôles
- 📊 Tableau de bord
- 🔍 Recherche et filtres

## Technologies

- **Next.js 15** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **Supabase** - Backend-as-a-Service
- **Lucide React** - Icônes 