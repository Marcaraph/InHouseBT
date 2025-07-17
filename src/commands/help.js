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
                { name: '/create-game', value: 'Create a custom game' },
                { name: '/start', value: 'Start the draft - Only available to the creator of the game \n Prepare the game ID and the two teams drafts urls' },
                { name: '/stats', value: 'Stats' },
                { name: '/report', value: 'Report the result of a game' }
            );

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Documentation du bot')
                .setStyle(ButtonStyle.Link)
                .setURL('https://media.istockphoto.com/id/140472118/photo/middle-finger.jpg?s=612x612&w=0&k=20&c=PHWkY3qathm5pjKIIJ5G2fggGxln0puxrdYlD6ly3Nc=')
        )
            await interaction.reply({ 
                embeds: [embed],
                components: [row],
                ephemeral: true
             });
    },    
};