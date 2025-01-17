import { CLUSTERS } from '../config';
import SessionStorageService from './SessionStorageService';
import Solana from '../solana';
import { Connection, Keypair, Transaction, PublicKey, createSolanaRpc, signTransaction } from '@solana/web3.js';

const assertValidClusterName = (clusterName) => {
  if (!Object.values(CLUSTERS).includes(clusterName.toLowerCase())) {
    throw new Error(`⚠️ Invalid cluster name: ${clusterName} ⚠️`);
  }
};

const setCluster = (id, clusterName) => {
  assertValidClusterName(clusterName);
  return SessionStorageService.setCluster(id, clusterName);
};

const login = async (id, privateKey, publicKey) => {
  await Promise.all([
    SessionStorageService.setKeyPair(id, privateKey, publicKey),
    SessionStorageService.setCluster(id, CLUSTERS.MAINNET),
  ]);
  return { keypair: { privateKey, publicKey }, cluster: CLUSTERS.MAINNET };
};

const isLoggedIn = async (id) => (!!(await SessionStorageService.getPrivateKey(id)));

const signAndSendTransaction = async (cluster, privateKey, transaction) => {
  const rpc = createSolanaRpc(process.env.SOLANA_RPC_URL);
  const signer = Keypair.fromSecretKey(new Uint8Array(privateKey));
  
  try {
    const { blockhash } = await rpc.getLatestBlockhash().send();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = signer.publicKey;
    
    const signedTx = await signTransaction([signer], transaction);
    const signature = await rpc.sendTransaction(signedTx).send();
    
    await rpc.confirmTransaction({
      signature,
      blockhash,
    }).send();

    return signature;
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
};

export default {
  assertValidClusterName,
  getKeyPair: SessionStorageService.getKeyPair,
  getCluster: SessionStorageService.getCluster,
  setCluster,
  login,
  logout: SessionStorageService.deleteAll,
  isLoggedIn,
  createAccount: Solana.createAccount,
  createAccountFromMnemonic: Solana.createAccountFromMnemonic,
  getBalance: Solana.getBalance,
  isValidPublicKey: Solana.isValidPublicKey,
  transfer: Solana.transfer,
  signAndSendTransaction,
};
