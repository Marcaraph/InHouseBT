const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Report the result of a game')
        .addIntegerOption(option =>
            option.setName('game_id')
                .setDescription('The game ID')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('winner')
                .setDescription('The team that won')
                .setRequired(true)
                .addChoices(
                    { name: 'TEAM 1', value: 'TEAM1' },
                    { name: 'TEAM 2', value: 'TEAM2' }
                )
        ),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const gameId = interaction.options.getInteger('game_id');
        const winner = interaction.options.getString('winner');

        const game = await prisma.game.findUnique({
            where: { id: gameId }
        });

        if (!game) {
            return await interaction.editReply("❌ This game doesn't exist.");
        }

        if (game.winner) {
            return await interaction.editReply("⚠️ This game has already been reported.");
        }

        await prisma.game.update({
            where: { id: gameId },
            data: { winner }
        });

        try {
            const gameChannel = await interaction.guild.channels.fetch(game.channelId);
            const gameMessage = await gameChannel.messages.fetch(game.messageId);

            const oldEmbed = EmbedBuilder.from(gameMessage.embeds[0]);

            const updatedFields = oldEmbed.data.fields.map(field => {
                const isWinner =
                    (field.name.includes('TEAM 1') && winner === 'TEAM1') ||
                    (field.name.includes('TEAM 2') && winner === 'TEAM2');

                return {
                    name: isWinner ? `${field.name.replace('✅', '').trim()} ✅` : field.name.replace('✅', '').trim(),
                    value: field.value,
                    inline: field.inline,
                };
            });

            const newEmbed = oldEmbed.setFields(updatedFields);

            const updatedComponents = gameMessage.components.map(row =>
                new ActionRowBuilder().AddComponents(
                    row.components.map(button => {
                        if (button.style === ButtonStyle.Link) return button;
                        return ButtonBuilder.from(button).setDisabled(true);
                    })
                )
            );

            await gameMessage.edit({ embeds: [newEmbed], components: updatedComponents });

            await interaction.editReply(`✅ Game ${gameId} has been reported as won by ${winner}.`);
        } catch (error) {
            console.error('Error updating embed:', error);
            await interaction.editReply("✅ Winner recorded, but failed to update the embed.");
        }
    },
};
