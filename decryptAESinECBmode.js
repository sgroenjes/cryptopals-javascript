//SET 1 CHALLENGE 7
const fs = require('fs');
const convert = require('./hexToB64');
const aesjs = require('aes-js');
const padding = require('./pkcs7Padding.js');

var keyBuffer = Buffer.from("YELLOW SUBMARINE");

//take encrypted base64, returns decrypted plaintext
exports.AES_ECB_Decrypt = function AES_ECB_Decrypt(ciphertext,key) {
  var lines;
  if(!key) {
    key = keyBuffer;
  }
  var aesEcb = new aesjs.ModeOfOperation.ecb(key);
  if(!ciphertext) {
    lines = fs.readFileSync('./7.txt','utf-8').split('\n').join('');
  }
  else {
    lines = ciphertext
  }
  
  var hexCodes = convert.base64ToHex(lines);
  
  var textBytes = aesjs.utils.hex.toBytes(hexCodes);
  var decryptedBytes = aesEcb.decrypt(textBytes);
  var decryptedHex = aesjs.utils.hex.fromBytes(decryptedBytes);
  // remove padding
  var lastByte = parseInt(decryptedHex.slice(decryptedHex.length-2,decryptedHex.length),10)
  decryptedHex = decryptedHex.slice(0,decryptedHex.length-lastByte*2)
  decryptedBytes = aesjs.utils.hex.toBytes(decryptedHex);
  var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
  return decryptedText;
}

//takes plaintext, returns encrypted in base64
exports.AES_ECB_Encrypt = function AES_ECB_Encrypt(plaintext,key,inHex) {
  if(!key) {
    key = keyBuffer
  }
  var aesEcb = new aesjs.ModeOfOperation.ecb(key);
  var hexCodes = inHex ? plaintext : aesjs.utils.hex.fromBytes(aesjs.utils.utf8.toBytes(plaintext));
  hexCodes = padding.PKCS7(hexCodes,key.length);
  var hexBytes = aesjs.utils.hex.toBytes(hexCodes);
  var encryptedHexBytes = aesEcb.encrypt(hexBytes);
  var encryptHex = aesjs.utils.hex.fromBytes(encryptedHexBytes);
  var encryptB64 = convert.hexToBase64(encryptHex);
  return encryptB64;
}

// console.log(this.AES_ECB_Decrypt())
// console.log(this.AES_ECB_Decrypt(this.AES_ECB_Encrypt("I'm like Samson -- Samson to Delilah")))