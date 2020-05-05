//SET 2 CHALLENGE 12
const oracle = require('./detectECBorCBCmode.js')
const convert = require('./hexToB64')
const aesjs = require('aes-js')
const findKeySize = require('./breakRepeatingKeyXOR')
const ecbDetect = require('./detectAESinECBmode')
const fs = require('fs');
//don't do it
let challenge12Hex = convert.base64ToHex("Um9sbGluJyBpbiBteSA1LjAKV2l0aCBteSByYWctdG9wIGRvd24gc28gbXkgaGFpciBjYW4gYmxvdwpUaGUgZ2lybGllcyBvbiBzdGFuZGJ5IHdhdmluZyBqdXN0IHRvIHNheSBoaQpEaWQgeW91IHN0b3A/IE5vLCBJIGp1c3QgZHJvdmUgYnkK");
var keyArr = []
for(let i=0;i<16;i++) {
  keyArr.push(Math.floor(Math.random()*256));
}

exports.oracle = newOracle;
function newOracle(yourstring,plainHex) {
  var hexCodes = yourstring.concat(plainHex);
  var data = oracle.encryptUnknownKey(hexCodes,false,"ECB",keyArr,true);
  return data;
}
exports.ECB_Decryption = ECB_Decryption;
function ECB_Decryption(plainHex) {
  var unknownHex = "";
  if(!plainHex) {
    plainHex = challenge12Hex;
  }

  //discover the block size, we know this, its 16 ( but do it anyway )
  var b64data
  var keySize
  for(let i=2; i<128;i++) {
    b64data = newOracle("".padStart(i*2,"a"),plainHex).B64encrypted
    let data = convert.base64ToHex(b64data);
    let block1 = data.slice(0,i)
    let block2 = data.slice(i,2*i)
    if(block1==block2){ //waiting for the first two blocks that match
      keySize = i/2
      break
    }
  }

  // console.log('Keysize: '+keySize+"  (should be 16)")
  if(keySize != 16) {
    return "Keysize is wrong.."
  }
  //detect the function is using ECB ( again, do it anyway )
  let hexData = convert.base64ToHex(b64data);
  if(ecbDetect.AES_ECB_Detect([hexData])) {
    // console.log("Detected ECB mode..")
  }
  else{
    return Error("Not detected..")
  }

  while(plainHex.length > 0) {
    //craft input block that is one byte short of the key
    var inputBlock = "".padStart((keySize-1)*2,"aa")
    b64data = newOracle(inputBlock,plainHex).B64encrypted
    var hexKey = convert.base64ToHex(b64data).slice(0,2*keySize);
    var dictionary = new Map();
    //make dictionary of every possible last byte, first 128 from ascii table is fine
    for(let i = 0; i<128;i++) {
      let hex = i.toString(16).padStart(2,'0')
      let fullhex = convert.base64ToHex(newOracle(inputBlock,hex).B64encrypted).slice(0,2*keySize)
      // console.log(fullhex.slice(0,2*keySize))
      dictionary.set(fullhex,hex);
    }
    //match output of the one-byte-short input to one of the entries in the dictionary
    let hexCode = dictionary.get(hexKey)
    unknownHex = unknownHex.concat(hexCode)
    //repeat for all bytes
    plainHex = plainHex.slice(2,plainHex.length);
  }
  return aesjs.utils.utf8.fromBytes(aesjs.utils.hex.toBytes(unknownHex));
}

console.log(ECB_Decryption())