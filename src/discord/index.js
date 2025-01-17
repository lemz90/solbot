import CommandUtil from './commands';
import { COMMAND_PREFIX } from '../config';
import Wallet from '../wallet';

const initHandler = async (client) => {
  await CommandUtil.initCommands(client);

  client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(COMMAND_PREFIX) || message.author.bot) return;

    const args = message.content.slice(COMMAND_PREFIX.length).trim().split(/ +/);
    const command = args[0];

    if (!client.commands.has(command)) {
      return;
    }

    if (!(await Wallet.isLoggedIn(message.author.id))
        && !CommandUtil.OK_WITHOUT_LOGIN_COMMANDS.includes(command)
    ) {
      message.channel.send(
        `🚧 You must create a wallet or login before making transfers. (commands: ${CommandUtil.creationCommands.map((c) => COMMAND_PREFIX + c).join(', ')}) 🚧`
          + '\n🚧 This must be done in a private dm channel 🚧',
      );
      return;
    }

    if (message.channel.type === 'DM') {
      await client.commands.get(command).execute(message, args);
    } else if (CommandUtil.COMMANDS.SEND === command) {
      await client.commands.get(command).execute(message, args);
    }
  });
};

export default {
  initHandler,
};
