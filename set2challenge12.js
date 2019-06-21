const oracle = require('./set2challenge11')
const convert = require('./hexToB64')
const findKeySize = require('./set1challenge6')
const ecbDetect = require('./set1challenge8')
const aesjs = require('aes-js')
//don't do it
let plainHex = convert.base64ToHex("Um9sbGluJyBpbiBteSA1LjAKV2l0aCBteSByYWctdG9wIGRvd24gc28gbXkgaGFpciBjYW4gYmxvdwpUaGUgZ2lybGllcyBvbiBzdGFuZGJ5IHdhdmluZyBqdXN0IHRvIHNheSBoaQpEaWQgeW91IHN0b3A/IE5vLCBJIGp1c3QgZHJvdmUgYnkK");
let undefinedCounter = 0;
var keyArr = []
for(let i=0;i<16;i++) {
  keyArr.push(Math.floor(Math.random()*256));
}

function newOracle(yourstring) {
  var hexCodes = yourstring.concat(plainHex);
  var data = oracle.encryptUnknownKey(hexCodes,"ECB",keyArr,true);
  return data;
}

function ECB_Decryption() {
  var unknownHex = "";
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
    var hexKey = convert.base64ToHex(newOracle(inputBlock).B64encrypted).slice(0,2*keySize);
    var dictionary = new Map();
    //make dictionary of every possible last byte
    //TODO: need to use values that don't return uri malformed error, but also don't return undefined in the dictionary
    for(let i = 0; i<128;i++) {
      let hex = i.toString(16).padStart(2,'0')
      let fullhex = convert.base64ToHex(newOracle(inputBlock.concat(hex)).B64encrypted).slice(0,2*keySize)
      // console.log(fullhex.slice(0,2*keySize))
      dictionary.set(fullhex,hex);
    }
    
    //match output of the one-byte-short input to one of the entries in the dictionary
    let hexCode = dictionary.get(hexKey)
    // console.log(hexCode)
    if(hexCode!=undefined)
      unknownHex = unknownHex.concat(hexCode)
    else
      undefinedCounter++;
    //repeat for all bytes
    plainHex = plainHex.slice(2,plainHex.length);
    // console.log("Remaining string length: "+plainHex.length)
  }
  console.log(aesjs.utils.utf8.fromBytes(aesjs.utils.hex.toBytes(unknownHex)))
}

ECB_Decryption();