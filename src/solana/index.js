import * as web3 from '@solana/web3.js';
import TransactionUtil from './transaction.js';
import AccountUtil from './account.js';
import PublicKeyUtil from './publicKey.js';

const getBalance = (publicKey, cluster) => {
  const connection = new web3.Connection(web3.clusterApiUrl(cluster), 'max');
  return connection.getBalance(new web3.PublicKey(publicKey));
};

const transfer = (cluster, fromPrivateKey, toPublicKeyString, sol) => {
  if (!PublicKeyUtil.isValidPublicKey(toPublicKeyString)) {
    throw new Error('⚠️ Invalid recipient key ⚠️');
  }
  const connection = new web3.Connection(web3.clusterApiUrl(cluster), 'max');
  const publicKey = new web3.PublicKey(toPublicKeyString);
  return TransactionUtil.transfer(new web3.Account(fromPrivateKey), publicKey, connection, sol);
};

export default {
  getBalance,
  transfer,
  isValidPublicKey: PublicKeyUtil.isValidPublicKey,
  createAccountFromMnemonic: AccountUtil.createAccountFromMnemonic,
  createAccount: AccountUtil.createAccount,
};
