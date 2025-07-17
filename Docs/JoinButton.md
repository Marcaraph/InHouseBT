## join-game-<gameId> (bouton)

### Description :

Inscrit le joueur à la game, lui assigne une équipe et un rôle, puis met à jour l'embed.

### Fonctionnement :

- Protégé par withGameLock() pour éviter les accès concurrents.

- Crée le joueur s'il n'existe pas.

- Vérifie qu'il n'est pas déjà inscrit.

- Vérifie que la game n'est pas pleine (max 10 joueurs).

- Attribue équipe (TEAM1/TEAM2) et rôle (TOP, JUNGLE, MID, ADC, SUPPORT).

- Insère l'utilisateur en DB avec gameId, playerId, team, role.

- Met à jour l'embed avec tous les joueurs inscrits.

- Désactive le bouton "Rejoindre" si 10 joueurs atteints.

- Répond éphémèrement avec un bouton "Se désinscrire".

### Permissions requises : aucune.
