const { SlashCommandBuilder } = require('@discordjs/builders');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Join a game'),
    async execute(interaction) {
        const discordId = interaction.user.id;

        const player = await prisma.plater.upsert({
            where: { discordId },
            update: {},
            create: { discordId }
        });

        await interaction.reply(`${interaction.user.username} has joined the queue!`);
    },
};