import DiscordHandler from './discord';
import ConfigUtil from './config';
const { Client, GatewayIntentBits } = require('discord.js');

ConfigUtil.init();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions
    ]
});

client.on('error', error => {
    console.error('Discord client error:', error);
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

const main = async () => {
    try {
        await DiscordHandler.initHandler(client);
        await client.login(process.env.DISCORD_TOKEN);
    } catch (error) {
        console.error('Failed to initialize bot:', error);
        process.exit(1);
    }
};

main();
