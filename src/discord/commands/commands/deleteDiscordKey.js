import { COMMAND_PREFIX } from '../../../config/index.js';
import UserService from '../../../publicKeyStorage/UserService.js';

export default {
  name: 'delete-discordkey',
  description: 'Deletes your discord public key.',
  usage: [`${COMMAND_PREFIX}delete-discordkey`],
  async execute(message) {
    await UserService.deleteUser(message.author.id);
    message.channel.send('🥳 Successfully deleted discord public key 🥳');
    message.channel.send('ℹ️ You can no longer be tipped through discord ℹ️');
  },
};
