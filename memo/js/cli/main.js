/**
 * Exercises the memo program
 *
 * @flow
 */

import {
  setupTest,
  testEmptyStringNoSigners,
  testEmptyStringTwoSigners,
  testEmptyStringThirtyTwoSigners,
  testGoodAsciiStringOneSigner,
  testGoodUnicodeStringThreeSigners,
  testBadUnicodeStringNoSigners,
  testBadUnicodeStringOneSigner,
  testGoodLongStringOneSigner,
  testBadLongStringThirtyTwoSigners,
  testLength32StringTwelveSigners,
} from './memo-test';

async function main() {

  setupTest();
    
  // These test cases are designed to run sequentially and in the following
  // order
  console.log('Run test: testEmptyStringNoSigners');
  testEmptyStringNoSigners();

  console.log('Run test: testEmptyStringTwoSigners');
  testEmptyStringTwoSigners();

  console.log('Run test: testEmptyStringThirtyTwoSigners');
  testEmptyStringThirtyTwoSigners();
    
  console.log('Run test: testGoodAsciiStringOneSigner');
  testGoodAsciiStringOneSigner();
    
  console.log('Run test: testGoodUnicodeStringThreeSigners');
  testGoodUnicodeStringThreeSigners();
    
  console.log('Run test: testBadUnicodeStringNoSigners');
  testBadUnicodeStringNoSigners();

  console.log('Run test: testBadUnicodeStringOneSigner');
  testBadUnicodeStringOneSigner();

  console.log('Run test: testGoodLongStringOneSigner');
  testGoodLongStringOneSigner();

  console.log('Run test: testBadLongStringThirtyTwoSigners');
  testBadLongStringThirtyTwoSigners();

  console.log('Run test: testLength32StringTwelveSigners');
  testLength32StringTwelveSigners();
    
  console.log('Success\n');
}

main()
  .catch(err => {
    console.error(err);
    process.exit(-1);
  })
  .then(() => process.exit());
