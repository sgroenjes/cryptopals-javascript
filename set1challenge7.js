const fs = require('fs');
const convert = require('./hexToB64');
const aesjs = require('aes-js');
const padding = require('./set2challenge9.js');

var keyBuffer = Buffer.from("YELLOW SUBMARINE");


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

  var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
  return decryptedText;
}

exports.AES_ECB_Encrypt = function AES_ECB_Encrypt(plaintext,key) {
  if(!key) {
    key = keyBuffer
  }
  var aesEcb = new aesjs.ModeOfOperation.ecb(key);
  var hexCodes = aesjs.utils.hex.fromBytes(aesjs.utils.utf8.toBytes(plaintext));
  hexCodes = padding.PKCS7(hexCodes,16);
  var textBytes = aesjs.utils.hex.toBytes(hexCodes);
  var encryptedBytes = aesEcb.encrypt(textBytes);
  var encryptHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  var encryptB64 = convert.hexToBase64(encryptHex);
  return encryptB64;
}