# Shared Logic

Ce dossier contient la logique partagée entre le frontend web (Next.js) et l'application mobile (React Native).

## Structure

```
shared/
├── api/          # Services API Supabase
├── stores/       # Stores Zustand
├── types/        # Types TypeScript
├── utils/        # Utilitaires et helpers
└── constants/    # Constantes et configurations
```

## Utilisation

### Frontend Web
```typescript
import { useProductStore } from '@/shared/stores/productStore';
import { addProduct } from '@/shared/api/productService';
```

### Mobile
```typescript
import { useProductStore } from '../../shared/stores/productStore';
import { addProduct } from '../../shared/api/productService';
```

## Migration

Les fichiers existants dans `app/frontend/src/` seront progressivement déplacés ici pour être partagés.

---

**Auteur :** @ismaelgansonre 