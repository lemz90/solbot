import Wallet from '../../../wallet/index.js';
import { COMMAND_PREFIX, CLUSTERS } from '../../../config/index.js';

export default {
  name: 'cluster',
  description: 'Lets you switch between clusters',
  usage: [
    `${COMMAND_PREFIX}cluster <clusterName>`,
  ],
  async execute(message, args) {
    if (args.length !== 2) {
      message.channel.send('⚠️ Wrong number of arguments ⚠️');
      return;
    }

    const clusterName = args[1];
    const userId = message.author.id;

    try {
      Wallet.assertValidClusterName(clusterName);
      await Wallet.setCluster(userId, clusterName);
      message.channel.send(`✅ Successfully switched to cluster: ${clusterName} ✅`);
    } catch (e) {
      message.channel.send(e.message);
    }
  },
};
