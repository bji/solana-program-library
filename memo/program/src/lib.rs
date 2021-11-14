#![deny(missing_docs)]

//! A program that accepts a string of encoded characters and verifies that it parses,
//! while verifying and logging signers. Currently handles UTF-8 characters.

mod entrypoint;
pub mod processor;

// Export current sdk types for downstream users building with a different sdk version
pub use solana_program;
use solana_program::{
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
};

/// Legacy symbols from Memo v1
pub mod v1 {
    solana_program::declare_id!("Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo");
}

solana_program::declare_id!("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

/// Build a memo instruction, possibly signed
///
/// Accounts expected by this instruction:
///
///   0. ..0+N. `[signer]` Expected signers; if zero provided, instruction will be processed as a
///     normal, unsigned spl-memo
///
pub fn build_memo(memo: &[u8], signer_pubkeys: &[&Pubkey]) -> Instruction {
    Instruction {
        program_id: id(),
        accounts: accounts_from_signer_pubkeys(signer_pubkeys),
        data: memo.to_vec(),
    }
}


/// trait to handle optionally taking an action on a memo, if a memo is
/// actually provided, or do nothing if no memo is provided.
///
/// Accounts expected by this instruction:
///
///   0. ..0+N. `[signer]` Expected signers; if zero provided, instruction will be processed as a
///     normal, unsigned spl-memo
///
pub trait WithMemo {
    /// Only required function is to append the memo instruction
    fn with_memo<T: AsRef<str>>(self, memo: Option<T>, signer_pubkeys: Option<&[&Pubkey]>) -> Self;
}


/// If a memo is provided, append an Instuction to call the memo program
/// with the signer pubkeys and the memo, else do nothing
impl WithMemo for Vec<Instruction> {
    fn with_memo<T: AsRef<str>>(mut self, memo: Option<T>, signer_pubkeys: Option<&[&Pubkey]>) -> Self {
        if let Some(memo) = &memo {
            let memo = memo.as_ref();
            let memo_ix = Instruction {
                program_id: id(),
                accounts: if let Some(signer_pubkeys) = &signer_pubkeys {
                    accounts_from_signer_pubkeys(signer_pubkeys)
                } else {
                    vec![]
                },
                data: memo.as_bytes().to_vec(),
            };
            self.push(memo_ix);
        }
        self
    }
}


fn accounts_from_signer_pubkeys(signer_pubkeys: &[&Pubkey]) -> Vec<AccountMeta>
{
    signer_pubkeys
        .iter()
        .map(|&pubkey| AccountMeta::new_readonly(*pubkey, true))
        .collect()
}
