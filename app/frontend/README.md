# Frontend Next.js - Invetrack SaaS

Application frontend Next.js pour la gestion d'inventaire multi-entreprises.

## Configuration

### Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
NEXT_PUBLIC_SUPABASE_URL=https://quqkoacpcuegovmfsddg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1cWtvYWNwY3VlZ292bWZzZGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MjUwNTcsImV4cCI6MjA2NjEwMTA1N30.R2uIsVEx2EAMhxD0Bg5-u0hGgiNJRxU7SZmK4tfwc3k
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