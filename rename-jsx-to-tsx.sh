#!/bin/bash

# Script pour renommer tous les fichiers .jsx en .tsx
# Usage: ./rename-jsx-to-tsx.sh

echo "🔄 Début du renommage des fichiers .jsx vers .tsx..."

# Compteur pour les fichiers traités
count=0

# Trouver tous les fichiers .jsx et les renommer
find . -name "*.jsx" -type f | while read -r file; do
    # Créer le nouveau nom de fichier avec .tsx
    new_file="${file%.jsx}.tsx"
    
    # Vérifier si le fichier .tsx existe déjà
    if [ -f "$new_file" ]; then
        echo "⚠️  Le fichier $new_file existe déjà, on ignore $file"
        continue
    fi
    
    # Renommer le fichier
    mv "$file" "$new_file"
    echo "✅ Renommé: $file → $new_file"
    ((count++))
done

echo ""
echo "🎉 Renommage terminé!"
echo "📊 Nombre de fichiers renommés: $count"

# Afficher les fichiers .jsx restants (s'il y en a)
remaining=$(find . -name "*.jsx" -type f | wc -l)
if [ "$remaining" -gt 0 ]; then
    echo ""
    echo "⚠️  Fichiers .jsx restants (non renommés):"
    find . -name "*.jsx" -type f
fi

echo ""
echo "💡 N'oubliez pas de:"
echo "   1. Mettre à jour les imports dans vos fichiers"
echo "   2. Vérifier que TypeScript compile correctement"
echo "   3. Tester votre application" 