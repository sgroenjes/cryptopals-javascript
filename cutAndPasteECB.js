//SET 2 CHALLENGE 13
const ecb = require('./decryptAESinECBmode.js')
var KEY = randomAESkey()
const convert = require('./hexToB64')
const padding = require('./pkcs7Padding.js')
const aesjs = require('aes-js')

function parseObjectString(text) {
  var keys = []
  var values = []
  while(text.length>0) {
    var equal = '=';
    var and = '&'
    keys.push(text.substr(0,text.indexOf(equal)));
    values.push(text.substr(text.indexOf(equal)+1,(text.indexOf(and) == -1 ? text.length : text.indexOf(and)) - text.indexOf(equal) -1))
    text = text.substr(text.indexOf(and)+1, (text.indexOf(and) == -1 ? 0 : text.length-text.indexOf(and)))
  }
  let obj = {};
  keys.forEach((key,index) => {
    obj[key] = values[index]
  })
  return obj;
}

function profile_for(emailAddr) {
  emailAddr = emailAddr.replace(/[&=]/g,'');
  let newUser = {}
  newUser.email = emailAddr;
  newUser.uid = 10;
  newUser.role = 'user'
  let encodedUser = '';
  for(let property in newUser)
    encodedUser = encodedUser.concat(property+'='+newUser[property]+'&')
  return encodedUser.slice(0,encodedUser.length-1);
}

// generate random AES key
function randomAESkey() {
  var keyArr = []
  for(let i=0;i<16;i++) {
    keyArr.push(Math.floor(Math.random()*256));
  }
  return keyArr;
}

// encrypt the encoded user profile under the random key
function encryptProfile(profile) {
  return ecb.AES_ECB_Encrypt(profile,KEY)
}

// decrypt the encoded user profile, parse it
function decryptProfile(encryptedProfile) {
  var profile = ecb.AES_ECB_Decrypt(encryptedProfile,KEY)
  // console.log(profile)
  return parseObjectString(profile)
}

//TODO: using only input to profile_for and the ciphertext from encryptProfile, create an admin role user
function changeRole() {
  // make special input to craft blocks to put together after
  // the 16 byte blocks look like: 
  // "email=sam@dw.com"
  // "admin           "
  // "   &uid=10&role="
  // "user"+padding
  var email = "sam@dw.com"
  // add the padding scheme to end of the admin block
  var a = aesjs.utils.utf8.fromBytes(aesjs.utils.hex.toBytes(padding.PKCS7(aesjs.utils.hex.fromBytes(aesjs.utils.utf8.toBytes("admin")),16)))
  var sp = "   "
  var profile = profile_for(email+a+sp);
  // console.log(profile)
  var ciphertext = convert.base64ToHex(encryptProfile(profile))
  var adminCipher = ciphertext.slice(0,32).concat(ciphertext.slice(64,96),ciphertext.slice(32,64)) //overwrite our role
  return adminCipher;
}

console.log(decryptProfile(encryptProfile(profile_for('sam@dw.com'))));
console.log(decryptProfile(convert.hexToBase64(changeRole())))