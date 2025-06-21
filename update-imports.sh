#!/bin/bash

# Script pour mettre à jour les imports .jsx vers .tsx
# Usage: ./update-imports.sh

echo "🔄 Début de la mise à jour des imports .jsx vers .tsx..."

# Compteur pour les fichiers traités
count=0

# Trouver tous les fichiers TypeScript et JavaScript
find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" | while read -r file; do
    # Ignorer les fichiers dans node_modules et .next
    if [[ "$file" == *"node_modules"* ]] || [[ "$file" == *".next"* ]]; then
        continue
    fi
    
    # Vérifier si le fichier contient des imports .jsx
    if grep -q "\.jsx" "$file"; then
        echo "📝 Mise à jour des imports dans: $file"
        
        # Remplacer les imports .jsx par .tsx
        # Utiliser sed pour remplacer les imports
        sed -i 's/from ["'\'']\([^"'\'']*\)\.jsx["'\'']/from "\1.tsx"/g' "$file"
        sed -i 's/import ["'\'']\([^"'\'']*\)\.jsx["'\'']/import "\1.tsx"/g' "$file"
        
        ((count++))
    fi
done

echo ""
echo "🎉 Mise à jour des imports terminée!"
echo "📊 Nombre de fichiers traités: $count"

echo ""
echo "🔍 Vérification des imports .jsx restants..."
remaining_imports=$(find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" | xargs grep -l "\.jsx" 2>/dev/null || true)

if [ -n "$remaining_imports" ]; then
    echo "⚠️  Fichiers avec des imports .jsx restants:"
    echo "$remaining_imports"
else
    echo "✅ Aucun import .jsx restant trouvé!"
fi

echo ""
echo "💡 Prochaines étapes:"
echo "   1. Vérifier que TypeScript compile: pnpm tsc --noEmit"
echo "   2. Tester l'application: pnpm dev"
echo "   3. Vérifier les erreurs de linting: pnpm lint" 