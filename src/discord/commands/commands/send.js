import PriceService from '../../../price/PriceService.js';
import Wallet from '../../../wallet/index.js';
import TokenManager from '../../../wallet/token.js';
import UserService from '../../../publicKeyStorage/UserService.js';
import { COMMAND_PREFIX, TOKEN_INFO } from '../../../config/index.js';

const getCurrentSolPriceInUSD = async () => {
  try {
    return await PriceService.getSolPriceInUSD();
  } catch {
    return false;
  }
};

const getUserFromMention = (mention) => {
  const matches = mention.match(/^<@!?(\d+)>$/);
  if (!matches) {
    return null;
  }
  return matches[1];
};

export default {
  name: 'send',
  description: 'Lets you send SOL or tokens to someone. To specify the recipient, '
      + 'you can use a public key or tag someone with @<username>. You can add the cluster name after the recipient to send the tx on a specific cluster.',
  usage: [
    `${COMMAND_PREFIX}send <amount> <publicKeyString>`,
    `${COMMAND_PREFIX}send <amount> @<username>`,
    `${COMMAND_PREFIX}send <amount> @<username> <tokenSymbol>`,
    `${COMMAND_PREFIX}send <amount> @<username> <tokenSymbol> <clusterName>`,
  ],
  async execute(message, args) {
    if (args.length < 3 || args.length > 5) {
      message.channel.send('⚠️ Wrong number of arguments ⚠️');
      return;
    }

    let clusterArg;
    let tokenSymbol = 'SOL';  // Default to SOL

    // Check for token symbol and cluster args
    if (args.length >= 4) {
      const possibleToken = args[3].toLowerCase();
      if (Object.values(TOKEN_INFO).some(t => t.symbol.toLowerCase() === possibleToken)) {
        tokenSymbol = possibleToken;
        if (args.length === 5) {
          try {
            Wallet.assertValidClusterName(args[4]);
            clusterArg = args[4];
          } catch (e) {
            message.channel.send(e.message);
            return;
          }
        }
      } else {
        try {
          Wallet.assertValidClusterName(args[3]);
          clusterArg = args[3];
        } catch (e) {
          message.channel.send(e.message);
          return;
        }
      }
    }

    const amountToSend = parseFloat(args[1]);
    let toPublicKeyString = args[2];

    let recipientId;
    if (!Wallet.isValidPublicKey(toPublicKeyString)) {
      recipientId = getUserFromMention(toPublicKeyString);
      if (!recipientId) {
        message.channel.send('⚠️ Given recipient is neither a public key nor a user ⚠️');
        return;
      }
      const recipient = await UserService.getUser(recipientId);
      if (!recipient) {
        message.channel.send('⚠️ Given recipient has not registered a discord public key ⚠️');
        return;
      }

      toPublicKeyString = recipient.publicKey;
    }

    // eslint-disable-next-line no-restricted-globals
    if (isNaN(amountToSend) || amountToSend <= 0) {
      message.channel.send('⚠️ Invalid amount ⚠️');
      return;
    }

    message.channel.send('Sending...');

    const userId = message.author.id;
    const cluster = clusterArg || await Wallet.getCluster(userId);
    const keypair = await Wallet.getKeyPair(userId);
    const { privateKey } = keypair;

    let signature = '';
    try {
      if (tokenSymbol.toLowerCase() === 'sol') {
        signature = await Wallet
          .transfer(cluster, Object.values(privateKey), toPublicKeyString, amountToSend);
      } else {
        // Handle token transfer
        const transaction = await TokenManager.transferTokens(
          keypair.publicKey.toString(),
          toPublicKeyString,
          amountToSend
        );
        
        // Sign and send the transaction
        signature = await Wallet.signAndSendTransaction(
          cluster,
          Object.values(privateKey),
          transaction
        );
      }
    } catch (e) {
      message.channel.send(e.message);
      return;
    }

    const currentPrice = tokenSymbol.toLowerCase() === 'sol' ? await getCurrentSolPriceInUSD() : false;
    const dollarValue = currentPrice ? await PriceService.getDollarValueForSol(amountToSend, currentPrice) : null;
    const recipient = recipientId ? `<@${recipientId}>` : toPublicKeyString;

    const txLink = `<https://explorer.solana.com/tx/${signature}?cluster=${cluster}>`;
    const data = [];
    data.push(`💸 Successfully sent ${amountToSend} ${tokenSymbol.toUpperCase()} ${dollarValue ? `(~$${dollarValue}) ` : ''}to ${recipient} on cluster: ${cluster} 💸`);
    data.push('Click the link to see when your tx has been finalized (reached MAX confirmations)!');
    data.push(`${txLink}`);
    message.channel.send(data);
  },
};
