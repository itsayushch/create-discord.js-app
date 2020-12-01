import { exec } from 'child_process';
import { Message } from 'discord.js';
import { Client, Commands } from '..';
export const command: Commands = {
    name: 'ping',
    description: 'Pings to the server to check latency!',
    /**
     * @description - Pings to the server to check latency.
     * @param {Client} client - The discord.js client
     * @param {Message} message - The message object
     * @param {Array<any>} args - The args array.
     */
    async exec(client: Client, message: Message, args: Array<any>) {
        const msg = await message.channel.send('Pinging...');

        const sentTime = msg.editedTimestamp || msg.createdTimestamp;
        const startTime = message.editedTimestamp || message.createdTimestamp;

        return msg.edit([
            `Gateway Latency: \`${sentTime - startTime}ms\``,
            `API Latency: \`${client.ws.ping}ms\``
        ]);
    }
}
