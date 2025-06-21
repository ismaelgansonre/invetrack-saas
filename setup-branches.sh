#!/bin/bash

# Script pour organiser les branches et nettoyer les fichiers de développement
# Usage: ./setup-branches.sh

echo "🚀 Configuration des branches pour Invetrack SaaS..."

# Vérifier que nous sommes sur la branche main
current_branch=$(git branch --show-current)
if [ "$current_branch" != "main" ]; then
    echo "❌ Erreur: Vous devez être sur la branche main pour exécuter ce script"
    exit 1
fi

# Sauvegarder les modifications en cours
echo "💾 Sauvegarde des modifications en cours..."
git add .
git commit -m "feat: sauvegarde avant réorganisation des branches" || {
    echo "⚠️  Aucune modification à sauvegarder"
}

# Créer la branche prod à partir de main
echo "📦 Création de la branche prod..."
git checkout -b prod

# Nettoyer les fichiers de développement de la branche prod
echo "🧹 Nettoyage des fichiers de développement de la branche prod..."

# Supprimer les fichiers SQL
find . -name "*.sql" -type f -delete
echo "   ✅ Fichiers SQL supprimés"

# Supprimer les fichiers Markdown de documentation
find . -name "*.md" -type f -not -name "README.md" -delete
echo "   ✅ Fichiers Markdown supprimés (sauf README.md)"

# Supprimer les scripts shell de développement
find . -name "*.sh" -type f -not -name "setup-branches.sh" -delete
echo "   ✅ Scripts shell supprimés (sauf setup-branches.sh)"

# Supprimer les fichiers de données de test
rm -f data.json data.py
echo "   ✅ Fichiers de données de test supprimés"

# Supprimer les fichiers de configuration de développement
rm -f .env.local .env.development
echo "   ✅ Fichiers d'environnement de développement supprimés"

# Supprimer les logs et fichiers temporaires
find . -name "*.log" -type f -delete
find . -name "*.tmp" -type f -delete
find . -name ".DS_Store" -type f -delete
echo "   ✅ Fichiers temporaires et logs supprimés"

# Supprimer les dossiers de cache
rm -rf .next .cache node_modules/.cache
echo "   ✅ Dossiers de cache supprimés"

# Commiter les changements sur prod
git add .
git commit -m "chore: nettoyage pour la production - suppression des fichiers de développement"

# Retourner sur main et la renommer en dev
echo "🔄 Retour sur main et renommage en dev..."
git checkout main
git branch -m dev

# Pousser les nouvelles branches
echo "📤 Poussée des nouvelles branches..."
git push origin dev
git push origin prod

# Définir prod comme branche par défaut (optionnel)
echo "🎯 Configuration de prod comme branche par défaut..."
git checkout prod

echo ""
echo "✅ Configuration terminée !"
echo ""
echo "📋 Résumé des branches :"
echo "   - dev (anciennement main) : branche de développement avec tous les fichiers"
echo "   - prod : branche de production nettoyée"
echo ""
echo "🔧 Prochaines étapes :"
echo "   1. Aller sur GitHub/GitLab et définir 'prod' comme branche par défaut"
echo "   2. Configurer les déploiements automatiques sur la branche prod"
echo "   3. Continuer le développement sur la branche dev"
echo ""
echo "💡 Pour basculer entre les branches :"
echo "   git checkout dev    # pour le développement"
echo "   git checkout prod   # pour la production" 