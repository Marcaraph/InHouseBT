## /stats

### Description :

Affiche les statistiques LoL d’un joueur : nombre de games jouées et victoires.

### Inputs requis :

- Aucun input : affiche automatiquement les stats de l'utilisateur exécutant la commande.

### Fonctionnement :

- Récupère le joueur via son discordId.

- Si le joueur n’a jamais joué, un message d’avertissement est retourné.

- Calcule :

    - Total de games jouées.

    - Nombre de victoires (en comparant l’équipe du joueur à la team gagnante).

- Envoie une réponse textuelle du type :

    - ```Pseudo has won X out of Y games.```

### Permissions requises :

- Accessible à tous les membres du serveur.