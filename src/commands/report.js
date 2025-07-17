const { SlashCommandBuilder } = require('@discordjs/builders');
const { PrismaClient, Team } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('report')
        .setDescription('Report the result of a game')
        .addStringOption(option =>
            option.setName('winner')
                .setDescription('The team that won')
                .setRequired(true)
                .addChoices(
                    { name: 'TEAM1', value: 'TEAM1' },
                    { name: 'TEAM2', value: 'TEAM2' }
                )
        ),

    async execute(interaction) {
        const winner = interaction.options.getString('winner');
        await prisma.game.create({
            data: {
                winner: winner,
                createdAt: new Date(),
            },
        });

        await interaction.reply(`✅ Game has been reported as won by ${winner}.`);
    },
};