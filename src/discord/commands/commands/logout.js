import Wallet from '../../../wallet/index.js';
import { COMMAND_PREFIX } from '../../../config/index.js';

export default {
  name: 'logout',
  description: 'Logs you out of the wallet.',
  usage: [`${COMMAND_PREFIX}logout`],
  async execute(message) {
    await Wallet.logout(message.author.id);
    message.channel.send('🥳 Successfully logged out 🥳');
  },
};
