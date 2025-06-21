#!/bin/bash

# Script pour nettoyer complètement l'historique des fichiers .md
# Usage: ./clean-history.sh

echo "🧹 Nettoyage complet de l'historique des fichiers .md..."

# Vérifier qu'on est sur la branche prod
current_branch=$(git branch --show-current)
if [ "$current_branch" != "prod" ]; then
    echo "❌ Erreur: Vous devez être sur la branche prod pour exécuter ce script"
    exit 1
fi

# Sauvegarder les modifications en cours
echo "💾 Sauvegarde des modifications en cours..."
git add .
git commit -m "chore: sauvegarde avant nettoyage de l'historique" || {
    echo "⚠️  Aucune modification à sauvegarder"
}

# Supprimer les fichiers .md de l'historique Git
echo "🗑️  Suppression des fichiers .md de l'historique Git..."
git filter-branch --force --index-filter \
    'git rm --cached --ignore-unmatch *.md' \
    --prune-empty --tag-name-filter cat -- --all

# Nettoyer les références et forcer le garbage collection
echo "🧽 Nettoyage des références et garbage collection..."
git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Forcer la mise à jour de la branche distante
echo "📤 Mise à jour forcée de la branche distante..."
git push origin prod --force

echo ""
echo "✅ Nettoyage terminé !"
echo ""
echo "📋 Résultat :"
echo "   - Tous les fichiers .md ont été supprimés de l'historique Git"
echo "   - La branche prod est maintenant propre"
echo "   - L'historique a été réécrit"
echo ""
echo "⚠️  Attention : Cette opération a modifié l'historique Git"
echo "   Les autres développeurs devront faire un 'git pull --rebase'" 