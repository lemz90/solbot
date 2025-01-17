import Discord from 'discord.js';
import config from './config/index.js';
import commands from './discord/commands/index.js';
import { COMMAND_PREFIX } from './config/index.js';
import { DM_ONLY_COMMANDS } from './discord/commands/index.js';

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

// Add debug logging
client.on('messageCreate', async message => {
    console.log(`Received message: ${message.content} from ${message.author.tag} in ${message.channel.type}`);
    
    // Ignore messages from bots
    if (message.author.bot) return;

    // Check if message starts with command prefix
    if (!message.content.startsWith(COMMAND_PREFIX)) return;

    const args = message.content.slice(COMMAND_PREFIX.length).trim().split(/ +/);
    const commandName = args[0].toLowerCase();

    console.log(`Processing command: ${commandName} with args:`, args);

    const command = client.commands.get(commandName);
    if (!command) {
        console.log(`Command not found: ${commandName}`);
        return;
    }

    // Check if command should only work in DMs
    if (DM_ONLY_COMMANDS.includes(commandName) && message.channel.type !== Discord.ChannelType.DM) {
        return message.reply('This command only works in DMs for security reasons.');
    }

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error('Error executing command:', error);
        message.reply('There was an error executing that command!');
    }
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
