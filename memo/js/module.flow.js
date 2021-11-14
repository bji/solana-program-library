/**
 * Flow Library definition for spl-token-swap
 *
 * This file is manually maintained
 *
 */

declare module '@solana/spl-memo' {
  // === client/memo.js ===
    static createMemoInstruction(
      memo: String,
      signerAddresses: Array<Signer>
    ): TransactionInstruction;
}
