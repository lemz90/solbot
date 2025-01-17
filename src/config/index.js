import dotenv from 'dotenv';

export default {
  init() {
    if ((process.env.NODE_ENV || 'development') === 'development') {
      dotenv.config({ path: './src/secret/.env' });
    }
  },
  tokens: {
    defaultToken: '7L6M32mpkewGWj8bHspoX8QDe9pb3b3S1U33KpFvpump',
  },
};

export const CLUSTERS = {
  MAINNET: 'mainnet-beta',
  TESTNET: 'testnet',
  DEVNET: 'devnet',
};

export const COMMAND_PREFIX = '!';

export const TOKEN_INFO = {
  '7L6M32mpkewGWj8bHspoX8QDe9pb3b3S1U33KpFvpump': {
    symbol: 'TOKEN',
    decimals: 9,
    name: 'Your Token Name',
  },
};
