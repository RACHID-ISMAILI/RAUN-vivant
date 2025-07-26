#!/bin/bash

echo "🔥 RAUN-RACHID - Déploiement GitHub Pages"

# Vérifier si on est dans un repository git
if [ ! -d ".git" ]; then
    echo "❌ Ce dossier n'est pas un repository Git"
    echo "💡 Initialisez avec: git init"
    exit 1
fi

# Ajouter tous les fichiers
echo "📁 Ajout des fichiers..."
git add .

# Commit avec timestamp
timestamp=$(date '+%Y-%m-%d %H:%M:%S')
git commit -m "🔥 RAUN-RACHID - Mise à jour $timestamp"

# Push vers GitHub
echo "🚀 Déploiement vers GitHub..."
git push origin main

echo "✅ Déploiement terminé!"
echo "🌐 Votre site sera disponible dans quelques minutes"
echo "📱 URL: https://VOTRE-USERNAME.github.io/raun-rachid-spiritual-platform/"
