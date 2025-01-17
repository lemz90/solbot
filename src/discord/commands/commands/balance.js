import Wallet from '../../../wallet';
import TokenManager from '../../../wallet/token';
import { COMMAND_PREFIX, TOKEN_INFO } from '../../../config';

export default {
  name: 'balance',
  description: 'Shows your SOL and token balances',
  usage: [
    `${COMMAND_PREFIX}balance`,
    `${COMMAND_PREFIX}balance <tokenSymbol>`,
  ],
  async execute(message, args) {
    const userId = message.author.id;
    const cluster = await Wallet.getCluster(userId);
    const keypair = await Wallet.getKeyPair(userId);
    
    try {
      if (args.length === 1) {
        // Show all balances
        const solBalance = await Wallet.getBalance(cluster, keypair.publicKey.toString());
        const tokenBalance = await TokenManager.getTokenBalance(keypair.publicKey.toString());
        
        message.channel.send(`💰 Your balances on ${cluster}:\n`
          + `SOL: ${solBalance}\n`
          + `${TOKEN_INFO[process.env.TOKEN_ADDRESS].symbol.toUpperCase()}: ${tokenBalance}`);
      } else {
        const tokenSymbol = args[1].toLowerCase();
        if (tokenSymbol === 'sol') {
          const balance = await Wallet.getBalance(cluster, keypair.publicKey.toString());
          message.channel.send(`💰 Your SOL balance on ${cluster}: ${balance}`);
        } else if (Object.values(TOKEN_INFO).some(t => t.symbol.toLowerCase() === tokenSymbol)) {
          const balance = await TokenManager.getTokenBalance(keypair.publicKey.toString());
          message.channel.send(`💰 Your ${tokenSymbol.toUpperCase()} balance on ${cluster}: ${balance}`);
        } else {
          message.channel.send('⚠️ Invalid token symbol ⚠️');
        }
      }
    } catch (e) {
      message.channel.send(`Error getting balance: ${e.message}`);
    }
  },
}; 