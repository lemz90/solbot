import * as dotenv from 'dotenv';

export default {
  init() {
    if ((process.env.NODE_ENV || 'development') === 'development') {
      dotenv.config({ path: './src/secret/.env' });
    }
  }
};

export const CLUSTERS = {
  MAINNET: 'mainnet-beta',
  TESTNET: 'testnet',
  DEVNET: 'devnet',
};

export const COMMAND_PREFIX = '!';

export const TOKEN_INFO = {
  [process.env.TOKEN_ADDRESS]: {
    symbol: process.env.TOKEN_SYMBOL,
    decimals: parseInt(process.env.TOKEN_DECIMALS, 10),
    name: process.env.TOKEN_NAME,
  },
};
