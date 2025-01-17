import dotenv from 'dotenv';

export default {
  init() {
    if ((process.env.NODE_ENV || 'development') === 'development') {
      dotenv.config({ path: './src/secret/.env' });
    }
    
    // Verify required env variables
    const required = ['TOKEN_ADDRESS', 'TOKEN_SYMBOL', 'TOKEN_DECIMALS', 'TOKEN_NAME'];
    const missing = required.filter(key => !process.env[key]);
    if (missing.length) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}. Please check your .env file.`);
    }
  },
  tokens: {
    defaultToken: process.env.TOKEN_ADDRESS,
  },
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
