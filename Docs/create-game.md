## /create-game

### Description :
Crée une nouvelle game LoL et envoie un embed interactif dans le channel prédéfini.

### Fonctionnement :

- Enregistre une nouvelle game dans la base de données (champ createdBy).

- Crée un embed avec deux colonnes : TEAM 1 et TEAM 2.

- Affiche le nombre de joueurs inscrits.

- Ajoute deux boutons :

  -  ✅ Bouton "Rejoindre" (join-game-<gameId>)

  - 🔗 Bouton vers le site de draft (https://fearlessdraft.net)

 - Enregistre les IDs du message et du channel dans la DB.


### Permissions requises : aucune.