const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const GAMES_CHANNEL_ID = process.env.GAMES_CHANNEL_ID;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create-game')
    .setDescription('Créer une game custom LoL'),

  async execute(interaction) {
    const guild = interaction.guild;
    const channel = guild.channels.cache.get(GAMES_CHANNEL_ID);
    // Crée une game vide (pas encore de gagnant)
    const game = await prisma.game.create({ data: {
      createdBy: interaction.user.id,
    } });

    const embed = new EmbedBuilder()
      .setTitle(`🎮 Game LoL : ID ${game.id}`)
      .setDescription(`Clique sur "Rejoindre" pour participer à la game !`)
      .setColor(0x0099FF)
      .addFields(
        { name: 'TEAM 1', value: '_Aucun Joueur_', inline: true },
        { name: 'TEAM 2', value: '_Aucun Joueur_', inline: true }
      )
      .setFooter({ text: `Game ID: ${game.id} - Joueurs inscrits: 0/10` });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`join-game-${game.id}`)
        .setLabel('Rejoindre')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setLabel('Lien Draft')
        .setStyle(ButtonStyle.Link)
        .setURL('https://fearlessdraft.net')
    );

    const sentMessage = await channel.send({
      embeds: [embed],
      components: [row],
    });

    await prisma.game.update({
      where: { id: game.id },
      data: { messageId: sentMessage.id, channelId: channel.id },
    });

    await interaction.reply({ 
      content: `✅ Game ${game.id} has been created in Games channel.`,
      ephemeral: true
     });
  },
};
