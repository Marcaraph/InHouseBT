const { PrismaClient } = require('@prisma/client');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = new PrismaClient();
const { withGameLock } = require('../queue');

module.exports = {
  customIdStartsWith: 'join-game-',

  async execute(interaction) {
    const discordId = interaction.user.id;
    const gameId = parseInt(interaction.customId.split('-').pop());

    await withGameLock(gameId, async () => {
      const game = await prisma.game.findUnique({
        where: { id: gameId },
        include: { players: true },
      });

      if (!game) {
        return await interaction.reply({
          content: "This game doesn't exist.",
          ephemeral: true,
        });
      }

      const playerInDb = await prisma.player.upsert({
        where: { discordId },
        update: {},
        create: { discordId },
      });

      const alreadyInGame = await prisma.gamePlayer.findFirst({
        where: {
          gameId: game.id,
          playerId: playerInDb.id,
        },
      });

      if (alreadyInGame) {
        return await interaction.reply({
          content: "You are already registered in this game.",
          ephemeral: true,
        });
      }

      const currentPlayers = await prisma.gamePlayer.findMany({
        where: { gameId: game.id },
      });

      if (currentPlayers.length >= 10) {
        return await interaction.reply({
          content: "This game is already full.",
          ephemeral: true,
        });
      }

      const team1Count = currentPlayers.filter(p => p.team === 'TEAM1').length;
      const team2Count = currentPlayers.filter(p => p.team === 'TEAM2').length;

      let team;
      if (team1Count >= 5 && team2Count >= 5) {
        return await interaction.reply({
          content: "There are already 5 players in each team.",
          ephemeral: true,
        });
      }

      if (team1Count === team2Count) {
        team = Math.random() < 0.5 ? 'TEAM1' : 'TEAM2';
      } else if (team1Count < team2Count) {
        team = 'TEAM1';
      } else {
        team = 'TEAM2';
      }

      const allRoles = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'];

      const takenRoles = await prisma.gamePlayer.findMany({
        where: { gameId: game.id, team },
        select: { role: true },
      });

      const usedRoles = takenRoles.map(r => r.role);
      const availableRoles = allRoles.filter(r => !usedRoles.includes(r));

      function shuffleArray(array) {
        const copy = [...array];
        for (let i = copy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
      }

      function formatRole(role) {
        switch (role) {
          case 'TOP': return 'Top';
          case 'JUNGLE': return 'Jungle';
          case 'MID': return 'Mid';
          case 'ADC': return 'ADC';
          case 'SUPPORT': return 'Support';
          default: return role;
        }
      }

      const chosenRole = shuffleArray(availableRoles)[0];

      if (!chosenRole) {
        return await interaction.reply({
          content: "No more roles available.",
          ephemeral: true,
        });
      }

      await prisma.gamePlayer.create({
        data: {
          playerId: playerInDb.id,
          gameId: game.id,
          team,
          role: chosenRole,
        },
      });

      const updatedPlayers = await prisma.gamePlayer.findMany({
        where: { gameId: game.id },
        include: { player: true },
      });

      const team1 = updatedPlayers
        .filter(p => p.team === 'TEAM1')
        .map(p => `<@${p.player.discordId}> - ${formatRole(p.role)}`);

      const team2 = updatedPlayers
        .filter(p => p.team === 'TEAM2')
        .map(p => `<@${p.player.discordId}> - ${formatRole(p.role)}`);

      const embed = new EmbedBuilder()
        .setTitle(`🎮 Game LoL : ID ${game.id}`)
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

      try {
        const gameChannel = await interaction.guild.channels.fetch(game.channelId);
        const gameMessage = await gameChannel.messages.fetch(game.messageId);

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`join-game-${game.id}`)
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
        console.error('Error updating game message:', error);
      }

      await interaction.reply({
        content: `You have joined ${team} as ${formatRole(chosenRole)}.`,
        ephemeral: true,
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId(`leave-game-${game.id}`)
              .setLabel('Se Désinscrire')
              .setStyle(ButtonStyle.Danger)
          ),
        ],
      });
    });
  },
};
