# FlexiMarket

Application web de gestion commerciale (PWA) — clients, stock, livraisons, commerciaux, recouvrement, rapports.

## 📁 Contenu du dossier

```
fleximarket-app/
├── index.html        → l'application complète (HTML + CSS + JS, un seul fichier)
├── manifest.json      → manifeste PWA (nom, icônes, couleurs)
├── sw.js               → service worker (mise en cache hors-ligne basique)
└── icons/              → icônes de l'application (72px → 512px)
```

## 🔥 1. Configurer Firebase (obligatoire avant utilisation)

L'application a besoin d'un projet Firebase (Firestore + Authentication anonyme).

1. Allez sur [console.firebase.google.com](https://console.firebase.google.com) et créez un projet (ex. `fleximarket`).
2. Ajoutez une application **Web** (icône `</>`) et copiez la configuration fournie.
3. Dans **Firestore Database** → créez une base (mode production).
4. Dans **Authentication** → activez la connexion **Anonyme**.
5. Publiez les règles de sécurité Firestore fournies en commentaire en haut du fichier `index.html` (section "RÈGLES FIRESTORE SÉCURISÉES").
6. Renseignez vos identifiants de deux façons possibles :
   - **Au premier lancement** : un écran de configuration s'affiche dans l'app pour coller vos identifiants (ils sont chiffrés et stockés dans le navigateur) — *aucune modification de fichier nécessaire* ;
   - **Ou directement dans le code** : remplacez les valeurs `REMPLACEZ_PAR_VOTRE_...` dans le bloc `FIREBASE_CONFIG` de `index.html` (vers la ligne 190).

## 🚀 2. Déployer sur GitHub Pages

```bash
# Depuis ce dossier
git init
git add .
git commit -m "Initial commit - FlexiMarket"
git branch -M main
git remote add origin https://github.com/<votre-utilisateur>/<votre-repo>.git
git push -u origin main
```

Puis dans GitHub : **Settings → Pages → Source : branch `main` / dossier `/ (root)`**.
Votre application sera disponible à `https://<votre-utilisateur>.github.io/<votre-repo>/`.

> ⚠️ L'app est une PWA installable : sur mobile/desktop, le navigateur proposera "Ajouter à l'écran d'accueil / Installer l'application".

## 🛠️ Notes techniques

- Application 100% statique (aucun build, aucune dépendance npm) — un simple hébergement de fichiers statiques suffit (GitHub Pages, Netlify, Vercel, Firebase Hosting…).
- `sw.js` met en cache les fichiers locaux pour un fonctionnement hors-ligne partiel ; les appels Firebase passent toujours par le réseau.
- Pensez à incrémenter `CACHE_NAME` dans `sw.js` à chaque mise à jour du contenu pour forcer le rafraîchissement du cache des utilisateurs.
