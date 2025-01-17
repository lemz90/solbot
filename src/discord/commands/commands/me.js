import Wallet from '../../../wallet/index.js';
import { COMMAND_PREFIX } from '../../../config/index.js';

export default {
  name: 'me',
  description: 'Shows your public key and current cluster.',
  usage: [`${COMMAND_PREFIX}me`],
  async execute(message) {
    const userId = message.author.id;
    const cluster = await Wallet.getCluster(userId);
    const keypair = await Wallet.getKeyPair(userId);
    message.channel.send(`Your public key: ${keypair.publicKey}\nYou're on cluster: ${cluster}`);
  },
}; 