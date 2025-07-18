const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Liste des commandes disponibles'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('LoL Bot Help')
            .setColor(0x00AE86)
            .setDescription('Available commands :\n\n')
            .addFields(
                { name: '/create-game', value: '[Create a custom game](https://github.com/Marcaraph/InHouseBT/blob/master/Docs/create-game.md)' },
                { name: '/start', value: '[Start the draft](https://github.com/Marcaraph/InHouseBT/blob/master/Docs/start.md)' },
                { name: '/stats', value: '[Show stats](https://github.com/Marcaraph/InHouseBT/blob/master/Docs/stats.md]' },
                { name: '/report', value: '[Report the result of a game](https://github.com/Marcaraph/InHouseBT/blob/master/Docs/report.md]' }
            );

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Documentation du bot')
                .setStyle(ButtonStyle.Link)
                .setURL('https://github.com/Marcaraph/InHouseBT/blob/master/README.md')
        )
            await interaction.reply({ 
                embeds: [embed],
                components: [row],
                ephemeral: true
             });
    },    
};