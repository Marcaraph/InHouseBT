const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const commands = [];

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

client.once('ready', async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands },
    );
    console.log('✅ Commandes enregistrées.');
  } catch (error) {
    console.error(error);
  }

  console.log(`🤖 Connecté en tant que ${client.user.tag}`);
});

// Gestion des boutons
client.buttons = new Map();
const buttonsPath = path.join(__dirname, 'buttons');
fs.readdirSync(buttonsPath).forEach(file => {
  const btn = require(path.join(buttonsPath, file));
  client.buttons.set(btn.customIdStartsWith, btn);
});

client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (command) await command.execute(interaction);
  }

  if (interaction.isButton()) {
    for (const [prefix, handler] of client.buttons.entries()) {
      if (interaction.customId.startsWith(prefix)) {
        return handler.execute(interaction);
      }
    }
  }
});



client.login(process.env.DISCORD_TOKEN);
