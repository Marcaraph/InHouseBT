## /report

### Description :

Permet de déclarer l'équipe gagnante d'une game terminée.

### Inputs requis :

Exemple : https://i.imgur.com/pVEplnq.png

- game_id (entier, requis) : Identifiant de la game.

- winner (texte, requis) : L'équipe gagnante, à choisir entre TEAM1 et TEAM2.

### Fonctionnement :

- Vérifie que la game existe dans la base de données.

- Vérifie que la game n'a pas déjà de gagnant déclaré.

- Met à jour le champ winner dans la base de données.

- Envoie un message de confirmation précisant quelle équipe a gagné.

### Permissions requises :

- Aucun rôle particulier requis. Seul le créateur de la game ou un utilisateur autorisé peut l’exécuter (à sécuriser si nécessaire).