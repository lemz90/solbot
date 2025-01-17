import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, getAccount, createTransferInstruction } from '@solana/spl-token';
import { PublicKey, Transaction } from '@solana/web3.js';
import config, { TOKEN_INFO } from '../config';
import { getConnection } from './connection';

class TokenManager {
  static async getOrCreateAssociatedTokenAccount(walletPublicKey) {
    const connection = getConnection();
    const tokenMint = new PublicKey(config.tokens.defaultToken);
    const owner = new PublicKey(walletPublicKey);

    try {
      const associatedToken = await getAssociatedTokenAddress(
        tokenMint,
        owner,
      );

      // Check if account exists
      try {
        await getAccount(connection, associatedToken);
        return associatedToken;
      } catch (error) {
        if (error.name === 'TokenAccountNotFoundError') {
          // Create the account
          const transaction = new Transaction().add(
            createAssociatedTokenAccountInstruction(
              owner, // payer
              associatedToken, // associatedToken
              owner, // owner
              tokenMint,
            ),
          );

          return { transaction, associatedToken };
        }
        throw error;
      }
    } catch (error) {
      console.error('Error in getOrCreateAssociatedTokenAccount:', error);
      throw error;
    }
  }

  static async getTokenBalance(walletPublicKey) {
    try {
      const connection = getConnection();
      const associatedToken = await this.getOrCreateAssociatedTokenAccount(walletPublicKey);

      // If we got back a transaction, the account needs to be created
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
    // const connection = getConnection();
    // const tokenMint = new PublicKey(config.tokens.defaultToken);
    const tokenInfo = TOKEN_INFO[config.tokens.defaultToken];

    try {
      // Get or create token accounts for both wallets
      const fromTokenAccount = await this.getOrCreateAssociatedTokenAccount(fromWallet);
      const toTokenAccount = await this.getOrCreateAssociatedTokenAccount(toWallet);

      // Create transfer instruction
      const transferInstruction = createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        fromWallet,
        amount * (10 ** tokenInfo.decimals),
        fromWallet,
      );

      const transaction = new Transaction().add(transferInstruction);
      return transaction;
    } catch (error) {
      console.error('Error in transferTokens:', error);
      throw error;
    }
  }
}

export default TokenManager;
