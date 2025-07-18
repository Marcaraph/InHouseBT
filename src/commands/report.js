const { SlashCommandBuilder } = require('@discordjs/builders');
const { PrismaClient, Team } = require('@prisma/client');
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
        const gameId = interaction.options.getInteger('game_id');
        const winner = interaction.options.getString('winner');

        const game = await prisma.game.findUnique({
            where: { id: gameId }
        });

        if (!game) {
            return await interaction.reply({
                content: "This game doesn't exist.",
                ephemeral: true,
            });
        }

        if (game.winner) {
            return await interaction.reply({
                content: "This game has already been reported.",
                ephemeral: true,
            });
        }

        await prisma.game.update({
            where: { id: gameId },
            data: { winner }
        });

        await interaction.reply(`✅ Game ${gameId} has been reported as won by ${winner}.`);
    },
};