const oracle = require('./set2challenge11')
const convert = require('./hexToB64')
const aesjs = require('aes-js')
//don't do it
let challenge12Hex = convert.base64ToHex("Um9sbGluJyBpbiBteSA1LjAKV2l0aCBteSByYWctdG9wIGRvd24gc28gbXkgaGFpciBjYW4gYmxvdwpUaGUgZ2lybGllcyBvbiBzdGFuZGJ5IHdhdmluZyBqdXN0IHRvIHNheSBoaQpEaWQgeW91IHN0b3A/IE5vLCBJIGp1c3QgZHJvdmUgYnkK");
var keyArr = []
for(let i=0;i<16;i++) {
  keyArr.push(Math.floor(Math.random()*256));
}

exports.oracle = newOracle;
function newOracle(yourstring,plainHex) {
  var hexCodes = yourstring.concat(plainHex);
  var utf8Codes = aesjs.utils.utf8.fromBytes(aesjs.utils.hex.toBytes(hexCodes))
  var data = oracle.encryptUnknownKey(utf8Codes,"ECB",keyArr,false);
  return data;
}
exports.ECB_Decryption = ECB_Decryption;
function ECB_Decryption(plainHex) {
  var unknownHex = "";
  if(!plainHex) {
    plainHex = challenge12Hex;
  }
  while(plainHex.length > 0) {

    // var trialDictionary = new Map();
    // var trialHex = "";
    // for(let i =2;i<40;i++) {
    //   trialHex = trialHex.concat("aa");
    //   let trialFullhex = convert.base64ToHex(newOracle(trialHex).B64encrypted)
    //   trialDictionary.set(i,trialFullhex.slice(0,2*i))
    // }

    //discover the block size, we know this, its 16 ( but do it anyway )
    // var b64data = newOracle("").B64encrypted;
    var keySize = 16//findKeySize.guessKeySize(b64data).keysize;
    // console.log('Keysize: '+keySize+"  (should be 16)")

    
    //detect the function is using ECB ( again, do it anyway )
    // let hexData = convert.base64ToHex(b64data);
    // if(ecbDetect.AES_ECB_Detect([hexData]) && mode == 1) {
    //   console.log("Detected ECB mode..")
    // }
    // else{
    //   // console.log("Not detected..")
    // }

    //craft input block that is one byte short of the key
    var inputBlock = ""
    while(inputBlock.length < (keySize-1)*2) {
      inputBlock = inputBlock.concat('aa');
    }
    var hexKey = convert.base64ToHex(newOracle(inputBlock,plainHex).B64encrypted).slice(0,2*keySize);
    var dictionary = new Map();
    //make dictionary of every possible last byte
    for(let i = 0; i<128;i++) {
      let hex = i.toString(16).padStart(2,'0')
      let fullhex = convert.base64ToHex(newOracle(inputBlock.concat(hex)).B64encrypted).slice(0,2*keySize)
      // console.log(fullhex.slice(0,2*keySize))
      dictionary.set(fullhex,hex);
    }
    
    //match output of the one-byte-short input to one of the entries in the dictionary
    let hexCode = dictionary.get(hexKey)
    // console.log(hexCode)
    unknownHex = unknownHex.concat(hexCode)
    //repeat for all bytes
    plainHex = plainHex.slice(2,plainHex.length);
    // console.log("Remaining string length: "+plainHex.length)
  }
  return aesjs.utils.utf8.fromBytes(aesjs.utils.hex.toBytes(unknownHex));
}

// console.log(ECB_Decryption(aesjs.utils.hex.fromBytes(aesjs.utils.utf8.toBytes('some random text I just made up LOL'))))