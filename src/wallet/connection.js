import { Connection } from '@solana/web3.js';
import { CLUSTERS } from '../config';

export const getConnection = () => {
  const cluster = process.env.SOLANA_CLUSTER || CLUSTERS.MAINNET;
  return new Connection(
    process.env.SOLANA_RPC_URL || `https://api.${cluster}.solana.com`,
  );
};
