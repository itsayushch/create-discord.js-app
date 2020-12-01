const { PREFIX, TOKEN } = require('./config.js')
const { Client, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const path = require('path');

const client = new Client();

client.commands = new Collection();


client.on('ready', () => {
    loadCommands();
    console.log('READY');
});

client.on('message', (message) => {
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    client.commands.get(command).execute(client, message, args);
});

const loadCommands = () => {
    const commandFiles = readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
    }
}

client.login(TOKEN);
