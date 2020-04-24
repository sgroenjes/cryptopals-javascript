const ecb = require('./set1challenge7')
const aesjs = require('aes-js')
const convert = require('./hexToB64')
const encrypt = require('./set2challenge11')
const challenge14Hex = convert.base64ToHex("Um9sbGluJyBpbiBteSA1LjAKV2l0aCBteSByYWctdG9wIGRvd24gc28gbXkgaGFpciBjYW4gYmxvdwpUaGUgZ2lybGllcyBvbiBzdGFuZGJ5IHdhdmluZyBqdXN0IHRvIHNheSBoaQpEaWQgeW91IHN0b3A/IE5vLCBJIGp1c3QgZHJvdmUgYnkK");
var randomstring = ""
var keyArr = []
for(let i=0;i<16;i++) {
  keyArr.push(Math.floor(Math.random()*256));
}
var randomNum = Math.floor(Math.random()*100)
console.log('Random Number is '+randomNum);
for(let i=0; i<randomNum;i++) {
    randomstring += (Math.floor(Math.random()*95)+32).toString(16)
}
console.log('Random string is '+randomstring)

// takes a hex string, outputs b64 ecb(randomstring+hex string+target string, randomKey)
function newOracle(yourhex) {
    var newstring = aesjs.utils.utf8.fromBytes(aesjs.utils.hex.toBytes(randomstring+yourhex+challenge14Hex));
    return encrypt.encryptUnknownKey(newstring,"ECB");
}

function ECB_Harder_Decryption() {
    // start with 64 A's and increase up to 94
    // assumptions.. no equal blocks in random prepended string
    //     "      .. no equal blocks in target plain string
    var keySize = 16
    var unknowHex = ""
    var yourhex = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    var numRandomChars = null;
    while(numRandomChars == null) {
        //TODO: something wrong here
        var ciphertext = newOracle(yourhex);
        var cipherHex = convert.base64ToHex(ciphertext);
        //END TODO
        console.log(cipherHex)
        console.log("")
        if(yourhex.length<96) {
            // console.log(cipherHex.match(/.{32}/g))
            // console.log("")
        }
        var hexTokens = cipherHex.match(/.{32}/g);
        // console.log(hexTokens)
        for(let i=0;i<hexTokens.length-1;i++) {
            if(hexTokens[i]==hexTokens[i+1]) {
                numRandomChars = (i+1)*32 - yourhex.length
            }
        }
        yourhex += "AA"
        if(yourhex.length>96) {
            // console.log(yourhex.length)
        }
    }
    while(challenge14Hex.length > 0) {
        var inputBlock = ""
        while(inputBlock.length < (keySize-1)*2) {
            inputBlock += 'aa'
        }
        var hexKey = convert.base64ToHex(newOracle(inputBlock).B64encrypted).slice(0,2*keySize);
        var dictionary = new Map()
        for(let i=0;i<128;i++) {
            let hex = i.toString(16).padStart(2,'0')
            let fullhex = convert.base64ToHex(newOracle(inputBlock.concat(hex)).B64encrypted).slice(0,2*keySize)
            dictionary.set(fullhex,hex);
        }
        let hexCode = dictionary.get(hexKey)
        unknowHex = unknowHex.concat(hexCode)
        challenge14Hex = challenge14Hex.slice(2,challenge14Hex.length);
    }
    return aesjs.utils.fromBytes(aesjs.utils.hex.toBytes(unknowHex));
}

console.log("Each line is 16 bytes")
console.log(convert.base64ToHex(encrypt.encryptUnknownKey('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaadeadbeef',"ECB").B64encrypted).match(/.{32}/g))
// console.log(convert.base64ToHex(newOracle('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa','deadbeef').B64encrypted).match(/.{32}/g))