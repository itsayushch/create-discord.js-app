import { Client as DiscordClient, ClientOptions, Collection, Message } from 'discord.js';
import path from 'path';
import { readdirSync } from 'fs';
import { config } from './config';

export interface Commands {
    name: string;
    description: string;
    exec: (client: Client, message: Message, args: Array<any>) => Promise<any>;
}

export class Client extends DiscordClient {
    public commands: Collection<string, Commands>;
    constructor(opt: ClientOptions = {}) {
        super(opt);
        this.commands = new Collection()
    }

    start(token: string): Promise<string> {
        return super.login(token);
    }
}

const client = new Client();

client.on('ready', () => {
    loadCommands();
    console.log('READY');
});

client.on('message', (message) => {
    if (!message.content.startsWith(config.PREFIX) || message.author.bot) return;

    const args = message.content.slice(config.PREFIX.length).trim().split(/ +/);
    const command = args.shift()?.toLowerCase();

    if (!client.commands.has(command!)) return;

    client.commands.get(command!)?.exec(client, message, args);
});

const loadCommands = () => {
    const commandFiles = readdirSync(path.join(__dirname, 'commands'));

    for (const file of commandFiles) {
        const { command } = require(`./commands/${file}`);
        client.commands.set(command.name, command);
    }
}

client.start(config.TOKEN);