

# 💳 EgaBankFrontend

<div align="center">

![Angular](https://img.shields.io/badge/Angular-21-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-purple?logo=bootstrap)
![Chart.js](https://img.shields.io/badge/Chart.js-4.5-orange?logo=javascript)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

  
  ### 🏦 Plateforme Bancaire Moderne
  
  **Une solution frontend complète pour gérer vos comptes, clients et transactions**
  
  Construite avec Angular 21, Material Design et Bootstrap 5
  
</div>

---

> 📱 **Application responsive** développée avec **Angular 21**.  
> Gérez vos clients, comptes, transactions et suivez vos performances financières en temps réel via un tableau de bord intuitif et interactif.

---

## ✨ Fonctionnalités principales

- 🔐 **Authentification** complète (login / inscription) avec token JWT
- 📊 **Tableau de bord interactif** : statistiques en temps réel, graphiques de performance, transactions récentes
- 👥 **Gestion des clients** : liste complète, création, modification et suppression
- 💰 **Gestion des comptes** : consultation, création de nouveaux comptes avec solde
- 💸 **Gestion des transactions** : historique complet et enregistrement de nouvelles transactions
- 🛡️ **Sécurité avancée** : guards d'authentification + intercepteur HTTP automatique
- 📱 **Responsive Design** : interface adaptée à tous les appareils
- 🎨 **Material Design** : interface moderne et professionnelle

---

## 🚀 Démarrage rapide

### Installation

```bash
# Cloner ou télécharger le projet
git clone https://github.com/ton-repo/EgaBankFrontend.git
cd EgaBankFrontend

# Installer les dépendances
npm install
```

### Lancer l'application

```bash
npm start
```

L'application sera accessible à : **[http://localhost:4200/](http://localhost:4200/)**

---

## 📸 Aperçu de l’interface

### 🔐 Authentification

<div align="center">
  <table>
    <tr>
      <td><strong>Connexion</strong></td>
      <td><strong>Inscription</strong></td>
    </tr>
    <tr>
      <td><img src="./screen_shot/logint2.png" alt="Connexion" width="350"/></td>
      <td><img src="./screen_shot/register.png" alt="Inscription" width="350"/></td>
    </tr>
  </table>
</div>

### 📊 Gestion des données

<div align="center">
  <table>
    <tr>
      <td><strong>Comptes</strong></td>
      <td><strong>Transactions</strong></td>
    </tr>
    <tr>
      <td><img src="./screen_shot/page_accounts.png" alt="Comptes" width="350"/></td>
      <td><img src="./screen_shot/page_transaction.png" alt="Transactions" width="350"/></td>
    </tr>
  </table>
</div>

### 📈 Tableau de bord

<div align="center">
  <img src="./screen_shot/landing1.png" alt="Tableau de bord principal" width="700"/>
</div>

> 📁 Les captures complètes sont disponibles dans le dossier [`screen_shot/`](./screen_shot)

---

## 📜 Scripts disponibles

| 🔧 Commande | 📝 Description |
|----------|-------------|
| `npm start` | Lance le serveur de développement |
| `npm run build` | Génère la version production optimisée |
| `npm test` | Exécute les tests unitaires avec Vitest |

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

| 📦 Technologie | 💡 Utilisation |
|---|---|
| **Angular 21** | Framework frontend principal |
| **Angular Material** | Composants UI modernes et accessibles |
| **Bootstrap 5** | Grille responsive et utilitaires CSS |
| **Chart.js 4.5** | Graphiques et visualisations interactives |
| **FontAwesome 7.1** | Bibliothèque d'icônes riche |
| **RxJS 7.8** | Programmation réactive et gestion d'observables |
| **TypeScript 5.9** | Typage statique pour une meilleure qualité |
| **Vitest 4.0** | Framework de tests unitaires performant |

---

## 🔐 Sécurité et authentification

- ✅ **AuthInterceptor** : Ajoute automatiquement le token JWT à toutes les requêtes HTTP
- ✅ **AuthGuard** : Protège les routes et empêche l'accès non autorisé
- ✅ **Routes protégées** : Dashboard, Clients, Comptes, Transactions
- ✅ **Token management** : Gestion sécurisée du stockage des tokens
- ✅ **Requête sécurisée** : Toutes les requêtes backend sont authentifiées

---

## 📱 Configuration & Personnalisation

Pour configurer l'API backend, modifiez les URLs dans les services :

```typescript
// src/app/services/auth.service.ts
private apiUrl = 'http://votre-api.com/api';
```

---

## 📌 Points importants

- 🎯 L'application requiert une **API backend configurée** pour fonctionner complètement
- 📡 Les services HTTP communiquent avec une API REST
- 🔑 L'authentification utilise des **tokens JWT**
- 💾 Les données sont persistées côté serveur

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour proposer des améliorations :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📞 Support et Questions

Pour toute question ou problème :
- 📧 Ouvrir une issue sur le dépôt GitHub
- 🐛 Signaler les bugs de manière détaillée
- 💬 Proposer des améliorations

---

## 📝 Licence

Ce projet est sous licence **MIT** — libre d'utilisation, modification et distribution.

**Développé avec ❤️ pour moderniser le secteur bancaire**
