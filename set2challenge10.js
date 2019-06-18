const fs = require('fs');
const convert = require('./hexToB64');
const aesjs = require('aes-js');
const XOR = require('./XOR.js');
const padding = require('./set2challenge9.js');

//using this key and initialization vector
const keyBuffer = Buffer.from("YELLOW SUBMARINE");
const IV = "".padStart(32,"0")

exports.AES_CBC_Decrypt = function AES_CBC_Decrypt(ciphertext,key,iv) {
  if(!key) {
    key = keyBuffer
  }
  if(!iv) {
    iv = IV
  }
  const aesEcb = new aesjs.ModeOfOperation.ecb(key);
  
  //read from file if no argument
  var lines;
  if(!ciphertext) {
    lines = fs.readFileSync('./10.txt','utf-8').split('\n').join('');
  }
  else {
    lines = ciphertext
  } 
  //convert from base64 to hex
  var hexCodes = convert.base64ToHex(lines);

  //break into blocks
  var hexBlocks = hexCodes.match(/.{1,32}/g);
  //convert to bytes with utils
  var byteBlocks = hexBlocks.map(hb => {
    return aesjs.utils.hex.toBytes(hb);
  })

  //pass block to aesEcb.decrypt
  var decryptedByteBlocks = byteBlocks.map(bblock => {
    return aesEcb.decrypt(bblock);
  })

  //convert to hex with utils
  var decryptedHexBlocks = decryptedByteBlocks.map(dbb => {
    return aesjs.utils.hex.fromBytes(dbb);
  })

  //XOR with last cipher block or IV (if 1st block)
  var plainHex = [];
  decryptedHexBlocks.forEach(dhb => {
    if(plainHex.length==0){
      plainHex.push(XOR.hexXOR(dhb,iv))
    }
    else {
      plainHex.push(XOR.hexXOR(dhb,hexBlocks[plainHex.length-1]))
    }
  })

  //join array and convert to utf8
  var plaintext = plainHex.map(ph => {
    return aesjs.utils.utf8.fromBytes(aesjs.utils.hex.toBytes(ph))
  }).join('');
  return plaintext;
}

exports.AES_CBC_Encrypt = function AES_CBC_Encrypt(plaintext,key,iv) {
  if(!key) {
    key = keyBuffer
  }
  if(!iv) {
    iv = IV
  }
  const aesEcb = new aesjs.ModeOfOperation.ecb(key);
  //convert to hex
  var hexCodes = aesjs.utils.hex.fromBytes(aesjs.utils.utf8.toBytes(plaintext));
  
  //add padding to hex encoded string using 16 byte block
  hexCodes = padding.PKCS7(hexCodes,16);
  
  //break into blocks
  var hexBlocks = hexCodes.match(/.{1,32}/g);
  
  //XOR with last cipher block or IV (if 1st block)
  var cipherHex = [];
  hexBlocks.forEach((hb,index) => {
    let xorBlock;
    if(cipherHex.length==0) {
      xorBlock = XOR.hexXOR(hb,iv)
    }
    else {
      xorBlock = XOR.hexXOR(hb,cipherHex[cipherHex.length-1])
    }
    //convert to bytes with utils
    let byteBlock = aesjs.utils.hex.toBytes(xorBlock)
    
    //pass block to aesEcb.encrypt
    let decryptedByteBlock = aesEcb.encrypt(byteBlock);
    
    //convert to hex with utils & push to cipher hex array
    cipherHex.push(aesjs.utils.hex.fromBytes(decryptedByteBlock));
  })

  //join array and convert to base64
  return convert.hexToBase64(cipherHex.join(''));
}
