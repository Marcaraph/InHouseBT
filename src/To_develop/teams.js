const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('teams')
        .setDescription('Teams'),

    async execute(interaction) {
        const participants = {
            team1: [],
            team2: [],
        };

        const shuffled = participants.sort(() => 0.5 - Math.random());
        const team1 = shuffled.slice(0, 5);
        const team2 = shuffled.slice(5);

        await interaction.reply(`Team 1: ${team1.join(', ')}\nTeam 2: ${team2.join(', ')}`);
    },
};