# Guide de Déploiement - RAUN-RACHID

## 🚀 Options de Déploiement

### 1. GitHub Pages (Recommandé)

**Avantages :**
- Gratuit et illimité
- HTTPS automatique
- Déploiement automatique
- URL personnalisable

**Étapes :**

1. **Créer un repository GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - RAUN-RACHID platform"
   git branch -M main
   git remote add origin https://github.com/username/raun-rachid.git
   git push -u origin main
   ```

2. **Activer GitHub Pages**
   - Aller dans Settings → Pages
   - Source : Deploy from a branch
   - Branch : main / (root)
   - Sauvegarder

3. **Accès**
   - URL : `https://username.github.io/raun-rachid`
   - Administration : `https://username.github.io/raun-rachid/admin.html`

### 2. Netlify

**Avantages :**
- Déploiement par drag & drop
- HTTPS automatique
- Domaine personnalisé facile

**Étapes :**
1. Zipper le dossier `static-version`
2. Aller sur [netlify.com](https://netlify.com)
3. Drag & drop le fichier ZIP
4. Site déployé instantanément

### 3. Vercel

**Avantages :**
- Performance optimale
- Déploiement Git automatique

**Étapes :**
1. Créer un compte [vercel.com](https://vercel.com)
2. Connecter le repository GitHub
3. Déploiement automatique

### 4. Serveur Local

**Pour développement/test :**

```bash
# Python
cd static-version
python -m http.server 8000

# Node.js
npx serve static-version

# PHP
cd static-version
php -S localhost:8000
```

## 🔐 Configuration Admin

### Identifiants par défaut
- **Nom d'utilisateur** : `rachid`
- **Mot de passe** : `eveil2024`

### Sécurité renforcée
- Page d'administration complètement protégée
- Interface créée uniquement après authentification réussie
- Auto-déconnexion après 30 minutes d'inactivité
- Blocage après 3 tentatives de connexion échouées (5 minutes)
- Nettoyage complet des données sensibles à la déconnexion

### Changer les identifiants

Éditer `data.js`, ligne ~88 :
```javascript
const adminCreds = {
    username: 'nouveau_nom',
    password: 'nouveau_mot_de_passe'
};
```

## 📊 Personnalisation

### Photo de profil
Remplacer : `attached_assets/photo_1753291596562.jpg`

### Contenu par défaut
Modifier dans `data.js` :
- `defaultCapsules` (lignes 15-45)
- `defaultIntentions` (lignes 50-60)

### Couleurs et design
Modifier dans `style.css` et `admin.css` :
- Variables CSS principales
- Couleurs Matrix (#00ff00)
- Animations

## 🌐 Domaine Personnalisé

### GitHub Pages
1. Acheter un domaine
2. Créer fichier `CNAME` avec votre domaine
3. Configurer DNS chez votre registrar

### Netlify/Vercel
Interface graphique pour configurer domaines personnalisés

## 📱 Version Mobile

La plateforme est responsive et fonctionne sur :
- Smartphones (iOS/Android)
- Tablettes
- Desktop

## 🔄 Mises à jour

### Ajouter du contenu
1. Accéder à `/admin.html`
2. Se connecter avec identifiants admin
3. "Nouvelle Capsule" pour ajouter du contenu

### Backup des données
Les données sont dans localStorage. Pour sauvegarder :
```javascript
// Dans la console du navigateur
const backup = {
    capsules: localStorage.getItem('capsules'),
    intentions: localStorage.getItem('intentions'),
    comments: localStorage.getItem('comments')
};
console.log(JSON.stringify(backup));
```

## 🛠️ Dépannage

### Page blanche
- Vérifier la console (F12) pour erreurs JavaScript
- Vérifier que tous les fichiers sont présents

### Admin ne fonctionne pas
- Vérifier les identifiants dans `data.js`
- Effacer localStorage : `localStorage.clear()`

### Données perdues
- localStorage est lié au domaine/navigateur
- Exporter régulièrement les données importantes

## 📈 Analytics (Optionnel)

Ajouter Google Analytics dans `index.html` :
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔒 Sécurité

- L'admin est côté client uniquement
- Pour plus de sécurité, utiliser la version serveur avec base de données
- HTTPS automatique sur les plateformes modernes

## 📞 Support

Pour questions techniques ou personnalisations avancées, contacter l'équipe de développement.