const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { PrismaClient } = require('@prisma/client');
const { execute } = require('./create-game');
const prisma = new PrismaClient();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Start the draft')
        .addIntegerOption(option =>
            option.setName('game_id')
                .setDescription('The game ID')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('team1_draft_url')
                .setDescription('The Team 1 Draft')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('team2_draft_url')
                .setDescription('The Team 2 Draft')
                .setRequired(true)
        ),

    async execute(interaction) {
        const gameId = interaction.options.getInteger('game_id');
        const team1Draft = interaction.options.getString('team1_draft_url');
        const team2Draft = interaction.options.getString('team2_draft_url');

        const game = await prisma.game.findUnique({
            where: { id: gameId }
        });

        if (!game) {
            return await interaction.reply({
                content: "Cette game n'existe pas.",
                ephemeral: true,
            });
        }

        if (game.createdBy !== interaction.user.id) {
            return await interaction.reply({
                content: "Vous n'avez pas la permission de commencer le draft.",
                ephemeral: true,
            });
        }

        try {
            const channel = await interaction.guild.channels.fetch(game.channelId);
            const message = await channel.messages.fetch(game.messageId);

            const embed = EmbedBuilder.from(message.embeds[0]);

            const draftButtons = [
                new ButtonBuilder()
                    .setLabel('Draft Team 1')
                    .setStyle(ButtonStyle.Link)
                    .setURL(team1Draft),
                new ButtonBuilder()
                    .setLabel('Draft Team 2')
                    .setStyle(ButtonStyle.Link)
                    .setURL(team2Draft)
            ];

            const newRow = new ActionRowBuilder().addComponents(draftButtons);

            await message.edit({ embeds: [embed], components: [newRow] });

            await interaction.reply({ content: 'Draft started!', ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: 'An error occurred while starting the draft.',
                ephemeral: true,
            });
        }
    }    
};