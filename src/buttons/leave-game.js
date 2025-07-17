const { PrismaClient } = require('@prisma/client');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = new PrismaClient();
const { withGameLock } = require('../queue');

module.exports = {
  customIdStartsWith: 'leave-game-',

  async execute(interaction) {
    const discordId = interaction.user.id;
    const gameId = parseInt(interaction.customId.split('-').pop());

    await withGameLock(gameId, async () => {
      const player = await prisma.player.findUnique({
        where: { discordId },
      });

      if (!player) {
        return await interaction.reply({
          content: "Tu n'es pas enregistré comme joueur.",
          ephemeral: true,
        });
      }

      const gamePlayer = await prisma.gamePlayer.findFirst({
        where: {
          gameId,
          playerId: player.id,
        },
      });

      if (!gamePlayer) {
        return await interaction.reply({
          content: "Tu n'es pas inscrit à cette game.",
          ephemeral: true,
        });
      }

      // Supprimer l'entrée gamePlayer
      await prisma.gamePlayer.delete({
        where: { id: gamePlayer.id },
      });

      // Recalcul des joueurs restants
      const updatedPlayers = await prisma.gamePlayer.findMany({
        where: { gameId },
        include: { player: true },
      });

      const formatRole = (role) => {
        switch (role) {
          case 'TOP': return 'Top';
          case 'JUNGLE': return 'Jungle';
          case 'MID': return 'Mid';
          case 'ADC': return 'ADC';
          case 'SUPPORT': return 'Support';
          default: return role;
        }
      };

      const team1 = updatedPlayers
        .filter(p => p.team === 'TEAM1')
        .map(p => `<@${p.player.discordId}> - ${formatRole(p.role)}`);

      const team2 = updatedPlayers
        .filter(p => p.team === 'TEAM2')
        .map(p => `<@${p.player.discordId}> - ${formatRole(p.role)}`);

      const embed = new EmbedBuilder()
        .setTitle(`🎮 Game LoL : ID ${gameId}`)
        .setColor(0x0099FF)
        .addFields(
          {
            name: 'TEAM 1',
            value: team1.length ? team1.join('\n') : 'Aucun joueur',
            inline: true,
          },
          {
            name: 'TEAM 2',
            value: team2.length ? team2.join('\n') : 'Aucun joueur',
            inline: true,
          }
        )
        .setFooter({
          text: `Joueurs inscrits : ${team1.length + team2.length} / 10`,
        });

      // Mise à jour du message de la game
      try {
        const game = await prisma.game.findUnique({
          where: { id: gameId },
        });

        if (!game) {
          return await interaction.reply({
            content: "Game introuvable.",
            ephemeral: true,
          });
        }

        const gameChannel = await interaction.guild.channels.fetch(game.channelId);
        const gameMessage = await gameChannel.messages.fetch(game.messageId);

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`join-game-${gameId}`)
            .setLabel('Rejoindre')
            .setStyle(ButtonStyle.Success)
            .setDisabled(team1.length + team2.length >= 10),
          new ButtonBuilder()
            .setLabel('Lien Draft')
            .setStyle(ButtonStyle.Link)
            .setURL('https://fearlessdraft.net')
        );

        await gameMessage.edit({
          embeds: [embed],
          components: [row],
        });

      } catch (error) {
        console.error('Erreur lors de la mise à jour du message de la game:', error);
      }

      await interaction.reply({
        content: "Tu as été désinscrit de la game.",
        ephemeral: true,
      });
    });
  }
};
