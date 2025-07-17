## /start

### Description :

Permet de lancer officiellement le draft d'une game en ajoutant les liens de draft des deux équipes au message existant.

### Inputs requis :

- game_id (entier, requis) : L'identifiant de la game. [exemple de game_id]('https://i.imgur.com/nLxh0a3.png')

- team1_draft_url (texte, requis) : URL vers la draft de la Team 1.

- team2_draft_url (texte, requis) : URL vers la draft de la Team 2.

### Fonctionnement :

- Vérifie que la game existe dans la base de données.

- Vérifie que l'utilisateur est le créateur de la game (via createdBy).

- Récupère le message original de la game (grâce à channelId et messageId).

- Reprend l'embed existant sans le modifier.

- Remplace les boutons existants par deux boutons de type Link redirigeant vers les URLs de draft fournies.

### Permissions requises :

- L'utilisateur doit être le créateur de la game.
