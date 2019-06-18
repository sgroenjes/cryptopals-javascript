const oracle = require('./set2challenge11')
const convert = require('./hexToB64')
const findKeySize = require('./set1challenge6')

var keyArr = []
for(let i=0;i<16;i++) {
  keyArr.push(Math.floor(Math.random()*256));
}

function ECB_Decryption() {
  var plaintext = 'A';
  plaintext.concat(convert.base64ToHex("Um9sbGluJyBpbiBteSA1LjAKV2l0aCBteSByYWctdG9wIGRvd24gc28gbXkgaGFpciBjYW4gYmxvdwpUaGUgZ2lybGllcyBvbiBzdGFuZGJ5IHdhdmluZyBqdXN0IHRvIHNheSBoaQpEaWQgeW91IHN0b3A/IE5vLCBJIGp1c3QgZHJvdmUgYnkK"));
  var b64data = oracle.encryptUnknownKey(plaintext,"ECB",keyArr);
  
  //discover the block size, we know this, its 16 ( but do it anyway )
  var keySize = findKeySize.guessKeySize(b64data).keysize;
  console.log('Keysize: '+keySize+"  (should be 16)")
  //TODO: detect the function is using ECB ( again, do it anyway )


  //craft input block that is one byte short of the key
  while(plaintext.length < keySize-1) {
    plaintext.concat('A');
  }

  //make dictionary of every possible last byte

  
  //match output of the one-byte-short input to one of the entries in the dictionary
  // AAAA.AAA  + plaintext -> output (match this output)
  // AAAA.AAA? + plaintext -> outputs for all dictionary values (256?)
  // this is the first byte of the unknown string 

  //repeat for all bytes
}