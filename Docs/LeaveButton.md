## leave-game-<gameId> (bouton)

### Description :

Permet au joueur de se retirer d'une game à laquelle il était inscrit.

### Fonctionnement :

- Protégé par withGameLock().

- Vérifie que la game existe et que le joueur est bien inscrit.

- Supprime l'entrée correspondante dans gamePlayer.

- Met à jour l'embed (retire le joueur, réactive le bouton si nécessaire).

- Répond avec un message de confirmation éphémère.

### Permissions requises : aucune.
