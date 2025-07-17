const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Liste des commandes disponibles'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Liste des commandes disponibles')
            .setColor(0x00AE86)
            .setDescription('Voici la liste des commandes disponibles :\n\n')
            .addFields(
                { name: '/create-game', value: '[Create a custom game](https://github.com/Marcaraph/InHouseBT/blob/master/Docs/create-game.md)' },
                { name: '/start', value: '[Start the draft](https://github.com/Marcaraph/InHouseBT/blob/master/Docs/start.md)' },
                { name: '/stats', value: 'Stats - WiP' },
                { name: '/report', value: 'Report the result of a game - WiP' }
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