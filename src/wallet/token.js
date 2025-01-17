import { 
  createAssociatedTokenAccountInstruction, 
  getAssociatedTokenAddress, 
  createTransferInstruction,
} from '@solana/spl-token';
import { PublicKey, Transaction, Connection } from '@solana/web3.js';
import config, { TOKEN_INFO } from '../config';

class TokenManager {
  static async getOrCreateAssociatedTokenAccount(walletPublicKey) {
    const connection = new Connection(process.env.SOLANA_RPC_URL);
    const tokenMint = new PublicKey(config.tokens.defaultToken);
    const owner = new PublicKey(walletPublicKey);

    try {
      const associatedToken = await getAssociatedTokenAddress(
        tokenMint,
        owner
      );

      // Check if account exists
      const account = await connection.getAccountInfo(associatedToken);
      if (account) {
        return associatedToken;
      }

      // Create the account if it doesn't exist
      const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          owner,
          associatedToken,
          owner,
          tokenMint,
        ),
      );

      return { transaction, associatedToken };
    } catch (error) {
      console.error('Error in getOrCreateAssociatedTokenAccount:', error);
      throw error;
    }
  }

  static async getTokenBalance(walletPublicKey) {
    try {
      const connection = new Connection(process.env.SOLANA_RPC_URL);
      const associatedToken = await this.getOrCreateAssociatedTokenAccount(walletPublicKey);

      if (associatedToken.transaction) {
        return 0;
      }

      const balance = await connection.getTokenAccountBalance(associatedToken);
      return balance.value.uiAmount;
    } catch (error) {
      console.error('Error getting token balance:', error);
      throw error;
    }
  }

  static async transferTokens(fromWallet, toWallet, amount) {
    const connection = new Connection(process.env.SOLANA_RPC_URL);
    const tokenMint = new PublicKey(config.tokens.defaultToken);
    const tokenInfo = TOKEN_INFO[config.tokens.defaultToken];

    try {
      // Get or create token accounts
      const fromTokenAccount = await this.getOrCreateAssociatedTokenAccount(fromWallet);
      const toTokenAccount = await this.getOrCreateAssociatedTokenAccount(toWallet);

      // If either account needs to be created, we need to handle that first
      const transaction = new Transaction();
      
      if (fromTokenAccount.transaction) {
        transaction.add(fromTokenAccount.transaction);
        fromTokenAccount = fromTokenAccount.associatedToken;
      }
      
      if (toTokenAccount.transaction) {
        transaction.add(toTokenAccount.transaction);
        toTokenAccount = toTokenAccount.associatedToken;
      }

      // Check balance before transfer
      const balance = await this.getTokenBalance(fromWallet);
      if (balance < amount) {
        throw new Error(`Insufficient token balance. Available: ${balance} ${tokenInfo.symbol}`);
      }

      // Add transfer instruction
      const transferInstruction = createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        new PublicKey(fromWallet),
        amount * (10 ** tokenInfo.decimals),
        new PublicKey(fromWallet),
      );

      transaction.add(transferInstruction);
      
      return transaction;
    } catch (error) {
      console.error('Error in transferTokens:', error);
      throw error;
    }
  }
}

export default TokenManager;
