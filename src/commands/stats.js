const { SlashCommandBuilder } = require('@discordjs/builders');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Stats'),
    async execute(interaction) {
        const discordId = interaction.user.id;
        const player = await prisma.player.findUnique({
            where: { discordId },
            include: {
                games: {
                    include: {
                        game: true,
                    },
                },
            },
        });

        if (!player) {
            return await interaction.reply('⚠️ You have not played any games yet.');
        }

        const totalGames = player.games.length;
        const wins = player.games.filter(gp => gp.game?.winner === gp.team).length;

        const displayName = interaction.member?. displayName || interaction.user.username;

        await interaction.reply(`${displayName} has won ${wins} out of ${totalGames} games.`);
    },
};