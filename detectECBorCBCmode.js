//SET 2 CHALLENGE 11
const ecb = require('./decryptAESinECBmode.js')
const cbc = require('./decryptAESinCBCmode.js')
const aesjs = require('aes-js')
const ecbDetect = require('./detectAESinECBmode.js')
const convert = require('./hexToB64')

function randomAESkey() {
  var keyArr = []
  for(let i=0;i<16;i++) {
    keyArr.push(Math.floor(Math.random()*256));
  }
  return keyArr;
}

function randomHexBytes(num) {
  var randomArray = []
  //generate num random common ascii bytes and put them in hex
  for(let i=0;i<num;i++) {
    randomArray.push((Math.floor(Math.random()*78)+48).toString(16).padStart(2,'0'));
  }
  return randomArray.join('');
}

exports.encryptUnknownKey = encryptUnknownKey;
function encryptUnknownKey(data,withRandomPadding,mode,key,hex) {
  if(!mode) {
    mode = Math.floor(Math.random()*2);
  }
  else if( mode == "ECB")
    mode = 1;
  else //CBC
    mode = 0

  if(!key) {
    key = randomAESkey();
  }
  if(hex==undefined) {
    hex=false
  }
  let padStart = randomHexBytes(Math.floor(Math.random()*6)+5)
  let padEnd = randomHexBytes(Math.floor(Math.random()*6)+5)
  let hexData = hex ? data : aesjs.utils.hex.fromBytes(aesjs.utils.utf8.toBytes(data));
  let hexDataWithRand = padStart + hexData + padEnd
  hexData = withRandomPadding ? hexDataWithRand : hexData
  let iv = randomHexBytes(16);//key.length??
  let B64encrypted = mode == 1 ? 
    ecb.AES_ECB_Encrypt(hexData,key,true) :
    cbc.AES_CBC_Encrypt(hexData,key,iv);
  return {
    B64encrypted,
    mode
  };
}

//Determines whether a function is using ECB or CBC
//if no function specified, use the randomized one above
function guessEncryption(encryptionFunction) {
  if(!encryptionFunction) { //should return encrypted data and mode used ( for sanity checks )
    encryptionFunction = encryptUnknownKey;
  }
  //64 bytes of As
  let plaintext = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
  var ECB = 0;
  var CBC = 0;
  var ECBguess = 0;
  var CBCguess = 0;
  var tries = 1000
  for(let i = 0; i < tries;i++) {
    //encrypt with either ECB or CBC
    let data = encryptionFunction(plaintext,true);
    let mode = data.mode;
    let encryptedData = data.B64encrypted;
    //convert the b64 to hex
    let hexData = convert.base64ToHex(encryptedData);

    //if repeated blocks, its ecb otherwise should be cbc
    if(ecbDetect.AES_ECB_Detect([hexData]))
      ECBguess++;
    else
      CBCguess++;

    if(typeof mode != "number") {
      //mode was not recorded
    }
    else if (mode == 1)
      ECB++;
    else
      CBC++;
    
  }
  // console.log({ ECB, ECBguess, CBC, CBCguess })
  return ECBguess > CBCguess ? "ECB" : "CBC";
}

// console.log(guessEncryption());