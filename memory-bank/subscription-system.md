# Système d'Abonnements et Paiements - Invetrack

## 📋 Vue d'ensemble

Système d'abonnements avec limitations par plan et intégration de paiements multi-providers (Stripe + Mobile Money Burkina Faso).

## 🏗️ Architecture

### Plans d'abonnement
- **Free** : 5 produits, 2 fournisseurs, 1 membre (0€)
- **Starter** : 25 produits, 10 fournisseurs, 3 membres (25€/mois)
- **Professional** : 100 produits, 25 fournisseurs, 10 membres (75€/mois)
- **Enterprise** : Illimité (199€/mois)

### Providers de paiement
- **Stripe** : Cartes bancaires internationales (dev/test + production)
- **Mobile Money** : Orange Money, Moov Money, Mobicash (Burkina Faso/CFA)

## 🗄️ Base de données

### Tables créées
- `subscription_plans` : Plans disponibles
- `organization_subscriptions` : Abonnements actifs
- `subscription_payments` : Historique des paiements

### Fonctions SQL
- `check_subscription_limits()` : Vérifie les limites
- `get_subscription_limits()` : Récupère l'usage actuel

## 💳 Intégration Paiements

### Stripe (International)
```bash
# Installation
npm install stripe

# Variables d'environnement
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Mobile Money (Burkina Faso)
**Options recommandées :**
- **PayDunya** : https://paydunya.com/
- **CinetPay** : https://www.cinetpay.com/
- **Orange Money API** : https://developer.orange.com/

## 🔧 Implémentation

### 1. Appliquer le schéma SQL
```sql
-- Voir memory-bank/subscription-schema.sql
```

### 2. Installer les dépendances
```bash
# Stripe
npm install stripe

# Mobile Money (exemple PayDunya)
npm install axios
```

### 3. Variables d'environnement
```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayDunya (exemple)
PAYDUNYA_MASTER_KEY=...
PAYDUNYA_PRIVATE_KEY=...
PAYDUNYA_PUBLIC_KEY=...
PAYDUNYA_TOKEN=...
```

### 4. API Routes à créer
- `/api/create-stripe-checkout` : Session Stripe
- `/api/create-mobile-payment` : Paiement Mobile Money
- `/api/stripe-webhook` : Webhook Stripe
- `/api/mobile-webhook` : Webhook Mobile Money

### 5. Vérification des limites
```typescript
// Avant d'ajouter un produit/fournisseur/membre
const canAdd = await checkSubscriptionLimit(orgId, 'products', currentCount);
if (!canAdd) {
  // Afficher message d'upgrade
}
```

## 🎨 UI Components à créer

### Pages
- `/pricing` : Affichage des plans
- `/billing` : Gestion de l'abonnement
- `/upgrade` : Page d'upgrade

### Composants
- `SubscriptionCard` : Carte d'un plan
- `UsageMeter` : Barre de progression usage
- `PaymentMethodSelector` : Choix Stripe/Mobile Money
- `BillingHistory` : Historique des paiements

## 📱 Flow utilisateur

### Nouvel utilisateur
1. Création compte → Plan Free automatique
2. Utilisation jusqu'aux limites
3. Proposition d'upgrade

### Upgrade
1. Choix du plan
2. Choix du mode de paiement (Stripe/Mobile Money)
3. Redirection vers le provider
4. Confirmation par webhook
5. Activation du nouveau plan

## 🔒 Sécurité

### RLS Policies
- Lecture des plans : publique
- Abonnements : membres de l'organisation
- Paiements : admins de l'organisation

### Validation
- Vérification des limites côté serveur
- Validation des webhooks (signatures)
- Gestion des échecs de paiement

## 🚀 Déploiement

### Étapes
1. Appliquer le SQL sur Supabase
2. Configurer les variables d'environnement
3. Créer les API routes
4. Tester avec les cartes de test Stripe
5. Configurer les webhooks en production

### Monitoring
- Logs des paiements
- Alertes sur les échecs
- Métriques d'usage par plan

## 📚 Ressources

### Documentation
- [Stripe Docs](https://stripe.com/docs)
- [PayDunya Docs](https://developer.paydunya.com/)
- [CinetPay Docs](https://docs.cinetpay.com/)

### Exemples
- [Stripe + Next.js](https://github.com/vercel/nextjs-subscription-payments)
- [PayDunya + Node.js](https://github.com/paydunya/paydunya-nodejs)

## 🎯 Prochaines étapes

1. **Phase 1** : Implémenter Stripe (dev/test)
2. **Phase 2** : Tester avec cartes de test
3. **Phase 3** : Intégrer Mobile Money
4. **Phase 4** : Tests en production
5. **Phase 5** : Monitoring et optimisations

---

**Auteur :** @ismaelgansonre  
**Créé le :** $(date)  
**Statut :** Planifié 