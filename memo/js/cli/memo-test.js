// @flow

// xxx fix up imports!
import {
    Connection,
    Keypair,
    PublicKey,
    Signer,
    Transaction,
} from '@solana/web3.js';

import {createMemoInstruction} from '../client/memo.js';
import {sendAndConfirmTransaction} from '../client/util/send-and-confirm-transaction';
import {url} from '../url';


// Hard-coded fee address, for testing production mode
const MEMO_PROGRAM_OWNER_FEE_ADDRESS =
      process.env.MEMO_PROGRAM_OWNER_FEE_ADDRESS;

// All of the keypairs of the signers, in order.  Need 32 of them for
// this test.
let signers_pubkeys: Array<PublicKey>;

// Test signers to use with memo transactions
let signers: Array<Signer>;

// Test strings to use
// Empty string
let emptyString: String = "";
// Simple ASCII text
let goodAsciiString: String = "Hello, world!";
// More complex
let goodUnicodeString: String = "2H₂ + O₂ ⇌ 2H₂O, R = 4.7 kΩ, ⌀ 200 mm";
// Badly encoded unicode string
let badUnicodeString: String = "\xc3\xb1";
// Longest possible string -- 566 bytes
let goodLongString: String = "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456";
// Longer than the longest possible string - 570 bytes
let badLongString: String = "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234561234";
// 32 byte string, longest string with 12 signers
let length32String: String = "12345678901234567890123456789012";


let connection;
async function getConnection(): Promise<Connection> {
  if (connection) return connection;

  connection = new Connection(url, 'recent');
  const version = await connection.getVersion();

  console.log("Connection to cluster established:", url, version);
  return connection;
}


export function setupTest()
{
    signers_pubkeys = [ ];
    signers = [ ];

    for (let i = 0; i < 32; i++) {
        let keypair = new Keypair();
        signers_pubkeys.push(keypair.publicKey);
        signers.push({ publicKey: keypair.publicKey,
                       secretKey: keypair.secretKey });
    }
}


export async function submitMemo(memo: String, signerPubkeys: Array<PublicKey>,
                                 signers: Array<Signer>): Promise<void> {
    const connection = await getConnection();

    let transaction = new Transaction();
    transaction.add(createMemoInstruction(memo, signerPubkeys));
    transaction.setSigners(signerPubkeys);
    transaction.sign(signers);

    await sendAndConfirmTransaction('memo',
                                    connection,
                                    transaction,
                                    signers,
                                    {
                                        skipPreflight: false,
                                        commitment: 'recent',
                                        preflightCommitment: 'recent',
                                    });
}


export function testSuccess(testName: String, memo: String,
                            signerPubkeys: Array<PublicKey>,
                            signers: Array<Signer>)
{
    submitMemo(memo, signerPubkeys, signers)
        .then(function (result) { },
              function (failure)
              { console.log(testName + " expected success, got:", failure);
                throw failure; });
}


export function testFailure(testName: String, memo: String,
                            signerPubkeys: Array<PublicKey>,
                            signers: Array<Signer>)
{
    submitMemo(memo, signerPubkeys, signers)
        .then(function (result)
              { console.log(testName + " expected failure, got:", result);
                throw result; },
              function (failure) { });
}


export function testEmptyStringNoSigners()
{
    testSuccess("testEmptyStringNoSigners", emptyString, [ ], [ ]);
}


export function testEmptyStringTwoSigners()
{
    testSuccess("testEmptyStringTwoSigners", emptyString,
                signers_pubkeys.slice(0, 2), signers.slice(0, 2));
}


export function testEmptyStringThirtyTwoSigners()
{
    testSuccess("testEmptyStringThirtyTwoSigners", emptyString,
                signers_pubkeys, signers);
}


export function testGoodAsciiStringOneSigner()
{
    testSuccess("testGoodAsciiStringOneSigner", goodAsciiString,
                signers_pubkeys.slice(0, 1), signers.slice(0, 1));
}


export function testGoodUnicodeStringThreeSigners()
{
    testSuccess("testGoodUnicodeStringThreeSigners", goodUnicodeString,
                signers_pubkeys.slice(0, 3), signers.slice(0, 3));
}


export function testBadUnicodeStringNoSigners()
{
    testFailure("testBadUnicodeStringNoSigners", badUnicodeString, [ ], [ ]);
}


export function testBadUnicodeStringOneSigner()
{
    testFailure("testBadUnicodeStringOneSigner", badUnicodeString,
                signers_pubkeys.slice(0, 1), signers.slice(0, 1));
}


export function testGoodLongStringOneSigner()
{
    testSuccess("testGoodLongStringOneSigner", goodLongString,
                signers_pubkeys.slice(0, 1), signers.slice(0, 1));
}


export function testBadLongStringThirtyTwoSigners()
{
    testFailure("testBadLongStringThirtyTwoSigners", badLongString,
                signers_pubkeys, signers);
}


export function testLength32StringTwelveSigners()
{
    testSuccess("testLength32StringTwelveSigners", length32String,
                signers_pubkeys.slice(0, 12), signers.slice(0, 12));
}
