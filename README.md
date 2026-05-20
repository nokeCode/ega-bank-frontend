Voici une version stylisée et plus professionnelle de ton README, avec une mise en page claire, des badges, des émojis et une structure améliorée :

```markdown
# 💳 EgaBankFrontend

![Angular](https://img.shields.io/badge/Angular-21-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-purple?logo=bootstrap)
![License](https://img.shields.io/badge/license-MIT-green)

> Application frontend d’une solution bancaire moderne, développée avec **Angular 21**.  
> Gérez vos clients, comptes, transactions et suivez vos performances financières en temps réel.

---

## ✨ Fonctionnalités principales

- 🔐 **Authentification** complète (login / inscription)
- 📊 **Tableau de bord interactif** : statistiques, graphiques de performance, transactions récentes
- 👥 **Gestion des clients** : liste, création, modification
- 💰 **Gestion des comptes** : consultation et ouverture de comptes
- 💸 **Gestion des transactions** : historique et enregistrement
- 🛡️ **Sécurité avancée** : guards d’authentification + intercepteur HTTP

---

## 📸 Aperçu de l’interface

| 🔑 Connexion | 📝 Inscription | 💼 Comptes |
|---|---|---|
| ![Connexion](./screen_shot/logint2.png) | ![Inscription](./screen_shot/register.png) | ![Comptes](./screen_shot/page_accounts.png) |

| 💸 Transactions | 📈 Tableau de bord |
|---|---|
| ![Transactions](./screen_shot/page_transaction.png) | ![Tableau de bord](./screen_shot/landing1.png) |

> ⚠️ Les captures sont situées dans le dossier [`screen_shot/`](./screen_shot).

---

## 🚀 Installation et exécution

### 1. Cloner le projet

```bash
git clone https://github.com/ton-repo/EgaBankFrontend.git
cd EgaBankFrontend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Démarrer l’application

```bash
npm start
```

Puis ouvrir : [http://localhost:4200/](http://localhost:4200/)

> 💡 Pensez à configurer l’URL de l’API backend dans les services si nécessaire.

---

## 📜 Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Lance le serveur de développement |
| `npm run build` | Génère le build de production |
| `npm test` | Exécute les tests unitaires |

---

## 📁 Structure du projet

```
src/app/
├── components/          # Composants UI
│   ├── login
│   ├── register
│   ├── dashboard
│   ├── navbar
│   ├── clients
│   ├── accounts
│   └── transactions
├── services/            # Appels API et logique métier
├── guards/              # Protection des routes
├── interceptors/        # Ajout automatique du token
├── models/              # Interfaces TypeScript
└── app.routes.ts        # Configuration des routes
```

---

## 🧱 Stack technique

| Technologie         | Utilisation                         |
|---------------------|--------------------------------------|
| Angular 21          | Framework principal                  |
| Angular Material    | Composants UI                        |
| Bootstrap 5         | Grille et style rapide               |
| Chart.js            | Graphiques du tableau de bord        |
| FontAwesome         | Icônes                               |
| RxJS                | Programmation réactive               |
| TypeScript          | Typage statique                      |

---

## 🔐 Sécurité et bonnes pratiques

- ✅ `AuthInterceptor` : ajoute automatiquement le token JWT aux requêtes HTTP.
- ✅ Guards : empêchent l’accès aux routes sans authentification.
- ✅ Routes protégées : dashboard, clients, comptes, transactions.

---

## 📌 Notes complémentaires

- Les captures d’écran reflètent l’état actuel du projet.
- L’application est prête à être connectée à une API REST backend.

---

## 👨‍💻 Auteur

Projet développé dans le cadre d’une solution bancaire moderne.  
📫 Pour toute question ou suggestion, n’hésitez pas à ouvrir une *issue* ou à me contacter.

---

## 📄 Licence

MIT — libre d’utilisation et de modification.
```

---

Cette version est plus structurée, visuelle et professionnelle. Elle met en avant la stack technique, la sécurité, et facilite la lecture grâce aux tableaux, badges et emojis. Tu peux la copier-coller directement dans ton fichier `README.md`.
