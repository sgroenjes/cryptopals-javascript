//SET 2 CHALLENGE 14
const ecb = require('./decryptAESinECBmode.js')
const aesjs = require('aes-js')
const convert = require('./hexToB64')
const encrypt = require('./detectECBorCBCmode.js')
var challenge14Hex = convert.base64ToHex("Um9sbGluJyBpbiBteSA1LjAKV2l0aCBteSByYWctdG9wIGRvd24gc28gbXkgaGFpciBjYW4gYmxvdwpUaGUgZ2lybGllcyBvbiBzdGFuZGJ5IHdhdmluZyBqdXN0IHRvIHNheSBoaQpEaWQgeW91IHN0b3A/IE5vLCBJIGp1c3QgZHJvdmUgYnkK");
var randomstring = ""
var keyArr = []
for(let i=0;i<16;i++) {
  keyArr.push(Math.floor(Math.random()*256));
}
var randomNum = Math.floor(Math.random()*100)
for(let i=0; i<randomNum;i++) {
    randomstring += (Math.floor(Math.random()*95)+32).toString(16).padStart(2,"0")
}
// takes a hex string, outputs b64 ecb(randomstring+hex string+target string, randomKey)
function newOracle(yourhex) {
    var newstring = randomstring+yourhex+challenge14Hex;
    return convert.base64ToHex(encrypt.encryptUnknownKey(newstring,false,"ECB",keyArr,true).B64encrypted);
}

function ECB_Harder_Decryption() {
    // start with keySize*2*10 A's and increase up
    // assumptions.. not 10 consecutive equal blocks in random prepended string
    //     "      .. not 10 consecutive equal blocks in target plain string
    var keySize = 16
    var unknowHex = ""
    var yourhex = "".padStart(keySize*2*10,"aa")
    var randomNums = null;
    var skipBlocks
    while(randomNums == null) {
        var cipherHex = newOracle(yourhex);
        var hexTokens = cipherHex.match(/.{32}/g); //TODO: keySize variable in regex, how
        for(let i=0;i<hexTokens.length-1;i++) {
            if( hexTokens[i]==hexTokens[i+1] &&
                hexTokens[i]==hexTokens[i+2] &&
                hexTokens[i]==hexTokens[i+3] &&
                hexTokens[i]==hexTokens[i+4] &&
                hexTokens[i]==hexTokens[i+5] &&
                hexTokens[i]==hexTokens[i+6] &&
                hexTokens[i]==hexTokens[i+7] &&
                hexTokens[i]==hexTokens[i+8] &&
                hexTokens[i]==hexTokens[i+9]) 
            {
                randomNums = (i+10)*keySize*2 - yourhex.length
                skipBlocks = i+10
            }
        }
        if(randomNums==null)
            yourhex += "aa"
    }
    while(challenge14Hex.length > 0) {
        var inputBlock = "".padStart((keySize-1)*2,"aa")
        var hexCodes = newOracle(yourhex+inputBlock)
        var hexKey = hexCodes.slice(keySize*2*skipBlocks,keySize*2*(skipBlocks+1));
        var dictionary = new Map()
        var fullHex
        for(let i = 0;i<128;i++) {
            let hex = i.toString(16).padStart(2,'0')
            fullHex = newOracle(yourhex+inputBlock+hex)
            let partialHex = fullHex.slice(keySize*2*skipBlocks,keySize*2*(skipBlocks+1))
            dictionary.set(partialHex,hex);
        }
        let hexCode = dictionary.get(hexKey)
        unknowHex = unknowHex.concat(hexCode)
        challenge14Hex = challenge14Hex.slice(2,challenge14Hex.length);
    }
    return aesjs.utils.utf8.fromBytes(aesjs.utils.hex.toBytes(unknowHex));
}

console.log(ECB_Harder_Decryption())