# 🚀 FLEXIMARKET APP — Guide de déploiement PWA

## Structure du package

```
flexi-pwa/
├── index.html          ← Application principale (PWA-ready)
├── manifest.json       ← Manifest PWA (nom, icônes, couleurs)
├── sw.js               ← Service Worker (cache hors-ligne)
├── icons/
│   ├── icon-192x192.png
│   └── icon-512x512.png
├── netlify.toml        ← Config déploiement Netlify
├── firebase.json       ← Config déploiement Firebase Hosting
└── README.md           ← Ce fichier
```

---

## ⚙️ ÉTAPE 1 — Configurer Firebase

Avant tout déploiement, configurez votre base Firebase dans `index.html` :

1. Ouvrez `index.html` dans un éditeur de texte
2. Trouvez la section `FIREBASE_CONFIG` (lignes ~22–30)
3. Remplacez les valeurs placeholder par vos vraies valeurs :

```js
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSy...",
  authDomain:        "mon-projet.firebaseapp.com",
  projectId:         "mon-projet",
  storageBucket:     "mon-projet.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abc123"
};
```

> 💡 **Astuce** : Vous pouvez aussi laisser les valeurs placeholder et configurer Firebase directement depuis l'écran de configuration qui s'affiche au premier lancement.

---

## 🌐 OPTION A — Déploiement sur Netlify (recommandé, gratuit)

### Méthode 1 : Glisser-déposer (le plus simple)

1. Allez sur [https://app.netlify.com](https://app.netlify.com)
2. Créez un compte gratuit si nécessaire
3. Depuis le tableau de bord, glissez-déposez le **dossier `flexi-pwa`** dans la zone de dépôt
4. Votre app est en ligne en moins de 30 secondes ! ✅

### Méthode 2 : Via GitHub (mises à jour automatiques)

```bash
# 1. Initialiser un dépôt Git
cd flexi-pwa
git init
git add .
git commit -m "FlexiMarket PWA v1"

# 2. Pousser sur GitHub
git remote add origin https://github.com/votre-username/fleximarket.git
git push -u origin main

# 3. Connecter sur Netlify
# → Netlify → "New site from Git" → choisir votre dépôt
# → Build command : (laisser vide)
# → Publish directory : .
# → Deploy site
```

---

## 🔥 OPTION B — Déploiement sur Firebase Hosting

```bash
# Pré-requis : Node.js installé
npm install -g firebase-tools

# Connexion
firebase login

# Dans le dossier flexi-pwa
cd flexi-pwa
firebase init hosting
# → Choisir votre projet Firebase existant
# → Public directory : . (point)
# → Single-page app : Yes
# → Overwrite index.html : No

# Déploiement
firebase deploy --only hosting
```

Votre app sera accessible à : `https://votre-projet.web.app`

---

## 📱 Installation comme application (PWA)

### Sur Android (Chrome)
1. Ouvrez l'URL de votre app dans Chrome
2. Un bandeau "Ajouter à l'écran d'accueil" apparaît automatiquement
3. Tapez **Installer** → L'icône FlexiMarket apparaît sur votre écran

### Sur iOS (Safari)
1. Ouvrez l'URL dans Safari
2. Appuyez sur **Partager** (icône carré avec flèche)
3. Choisissez **"Sur l'écran d'accueil"**
4. Tapez **Ajouter**

### Sur Windows/Mac (Chrome ou Edge)
1. Ouvrez l'URL dans le navigateur
2. Cliquez sur l'icône **⊕** dans la barre d'adresse
3. Cliquez **Installer**
4. L'app s'ouvre comme une fenêtre native

---

## ✅ Fonctionnalités PWA activées

| Fonctionnalité | Statut |
|---|---|
| Installable sur écran d'accueil | ✅ |
| Fonctionne hors-ligne (assets) | ✅ |
| Cache intelligent (Cache-First) | ✅ |
| Firebase reste en temps réel | ✅ |
| Icônes natives (192 & 512px) | ✅ |
| Thème couleur or `#c9a84c` | ✅ |
| Status bar personnalisée (iOS) | ✅ |
| Mise à jour automatique | ✅ |

---

## 🔒 Sécurité Firestore recommandée

Dans la console Firebase → Firestore → Règles, remplacez les règles de test par :

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      // Seuls les utilisateurs authentifiés (anonyme) peuvent lire/écrire
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 🆘 Dépannage

**L'app ne s'installe pas ?**
→ Vérifiez que le site est servi en **HTTPS** (Netlify et Firebase le font automatiquement)

**Le Service Worker ne s'enregistre pas ?**
→ Ouvrez les DevTools → Application → Service Workers → Vérifier les erreurs

**Les données ne se chargent pas ?**
→ Vérifiez que la configuration Firebase est correcte et que Firestore est en mode "test" ou avec des règles adaptées

---

*FLEXIMARKET APP — Gestion commerciale tontines & microfinance*
