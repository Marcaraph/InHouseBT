const { PrismaClient } = require('@prisma/client');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const prisma = new PrismaClient();
const { withGameLock } = require('../queue');

module.exports = {
    customIdStartsWith: 'close-game-',

    async execute(interaction) {
        const gameId = parseInt(interaction.customId.split('-').pop());

        const game = await prisma.game.findUnique({
            where: { id: gameId }
        });

        if (!game) {
            return await interaction.reply({
                content: "This game doesn't exist.",
                ephemeral: true,
            });
        }

        if (game.createdBy !== interaction.user.id) {
            return await interaction.reply({
                content: "You are not the creator of this game.",
                ephemeral: true,
            });
        }

        if (game.closed) {
            return await interaction.reply({
                content: "This game has already been closed.",
                ephemeral: true,
            });
        }

        await prisma.game.update({
            where: { id: gameId },
            data: { closed: true }
        });

        try {
            const gameChannel = await interaction.guild.channels.fetch(game.channelId);
            const gameMessage = await gameChannel.messages.fetch(game.messageId);

            const updatedComponents = gameMessage.components.map(row => 
                new ActionRowBuilder().addComponents(
                    row.components.map(button => {
                        if (button.style === ButtonStyle.Link) return button;
                        return ButtonBuilder.from(button).setDisabled(true);
                    })
                )
            );

            await gameMessage.edit({ components: updatedComponents });

            await interaction.reply({
                content: `Game ${game.id} has been closed.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error(error);
        }
    }
};