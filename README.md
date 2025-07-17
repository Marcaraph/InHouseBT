# 🤖 LoL Custom Game Bot

Bot Discord pour organiser rapidement des parties custom de League of Legends avec gestion d’inscriptions, rôles assignés automatiquement, et lien vers un outil de draft.

---

## 🚀 Fonctionnalités

- Création de games avec `/create-game`
- Inscriptions via boutons interactifs
- Attribution automatique d'une équipe et d'un rôle (TOP, JUNGLE, MID, ADC, SUPPORT)
- Désinscription possible avec un bouton
- Mise à jour automatique de l'embed affichant les joueurs
- Lien vers un site de draft : [fearlessdraft.net](https://fearlessdraft.net)
- Commande `/help` pour afficher la liste des commandes disponibles

---

## ⚙️ Pré-requis

- Node.js v18+
- Un bot Discord enregistré avec le bon token et accès aux intents
- Une base de données configurée avec [Prisma](https://www.prisma.io/) et le schéma adapté
