# Guide de Déploiement GitHub Pages - RAUN-RACHID

## 🔥 Version Complète pour GitHub Pages

Cette version inclut toutes les fonctionnalités de votre plateforme spirituelle :

### ✅ Fonctionnalités Incluses
- **Interface Matrix** : Fond animé avec caractères qui tombent
- **Photo personnelle** : Votre vraie photo avec rotation de texte autour
- **Navigation par catégories** : Spiritualité, Sciences, Humanité, Intentions
- **Capsules vivantes** : Système complet de lecture des capsules
- **Système de likes** : Pair/Impair fonctionnel avec localStorage
- **Commentaires** : Interface complète (affichage d'alerte pour la démo)
- **Intentions sacrées** : Page dédiée et modal de partage
- **Panel Admin** : admin.html avec authentification

## 📂 Structure des Fichiers
```
github-pages-deploy/
├── index.html          # Page principale avec interface Matrix
├── admin.html          # Panel d'administration
├── style.css           # Styles avec animations Matrix
├── admin.css           # Styles du panel admin
├── script.js           # Logique principale de l'application
├── admin.js            # Logique du panel admin
├── data.js             # Base de données des capsules
└── attached_assets/
    └── photo_1753291596562.jpg  # Votre photo
```

## 🚀 Instructions de Déploiement

### 1. Créer un repository GitHub
```bash
# Créez un nouveau repository public sur GitHub
# Nom suggéré: raun-rachid-spiritual-platform
```

### 2. Uploader les fichiers
- Glissez-déposez tous les fichiers de ce dossier dans votre repository
- Ou utilisez Git :
```bash
git init
git add .
git commit -m "🔥 RAUN-RACHID - Plateforme spirituelle complète"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/raun-rachid-spiritual-platform.git
git push -u origin main
```

### 3. Activer GitHub Pages
1. Allez dans **Settings** → **Pages**
2. Source : **Deploy from a branch**
3. Branch : **main** / **/ (root)**
4. Cliquez **Save**

### 4. Votre site sera disponible à :
`https://VOTRE-USERNAME.github.io/raun-rachid-spiritual-platform/`

## 🔑 Identifiants Admin
- **Nom d'utilisateur** : `rachid`
- **Mot de passe** : `eveil2024`

## 🌟 Fonctionnalités Techniques

### Stockage Local
- Les likes sont sauvegardés dans le localStorage
- Persistance entre les sessions
- Système pair/impair qui fonctionne

### Interface Spirituelle
- Animations Matrix en arrière-plan
- Texte rotatif autour de la photo
- Design doré mystique
- Transitions fluides

### Capsules Spirituelles
- 9 capsules pré-chargées dans 3 catégories
- Système de vues et likes
- Interface de lecture immersive
- Navigation par catégories

## ⚡ Synchronisation Continue

Pour synchroniser avec Replit :
1. Modifiez votre application Replit
2. Exécutez : `node build-static-version.js`
3. Copiez les fichiers générés vers votre repository GitHub
4. Commit et push : GitHub Pages se met à jour automatiquement

## 🎯 Différences avec la Version Replit

| Fonctionnalité | Replit (Complète) | GitHub Pages |
|---|---|---|
| Interface Matrix | ✅ | ✅ |
| Capsules vivantes | ✅ | ✅ |
| Système de likes | ✅ Base de données | ✅ localStorage |
| Commentaires | ✅ Vrais commentaires | ⚠️ Interface démo |
| Intentions | ✅ Stockage serveur | ⚠️ Interface démo |
| Panel Admin | ✅ CRUD complet | ✅ Interface complète |

---

*"Je suis vivant en conscience, nul ne peut éteindre ce que je suis"* - RAUN-RACHID