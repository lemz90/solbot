import Discord from 'discord.js';
import config from './config/index.js';
import commands from './discord/commands/index.js';

config.init();

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.DirectMessageReactions
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
        await commands.initCommands(client);
        await client.login(process.env.DISCORD_TOKEN);
    } catch (error) {
        console.error('Failed to initialize bot:', error);
        process.exit(1);
    }
};

main();
