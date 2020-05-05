//SET 2 CHALLENGE 9
const convert = require('./hexToB64')
exports.PKCS7 = PKCS7;
function PKCS7(block, blockSizeInBytes) {
  //assuming block is hex encoded
  var i = block.length%(blockSizeInBytes*2)/2;//divide by 2 to concat a 2-digit hex number for each byte
  //PKCS#7 Padding
  for(let j = i;j<blockSizeInBytes;j++)
    block = block.concat((blockSizeInBytes-i).toString().padStart(2,'0'))
  return block;
}
//'YELLOW SUBMARINE' with block size 20 should add \x04\x04\x04\x04
// console.log(convert.base64ToHex(convert.btoa("YELLOW SUBMARINE")))
// console.log(PKCS7(convert.base64ToHex(convert.btoa("YELLOW SUBMARINE")),20))
// console.log("59454c4c4f57205355424d4152494e4504040404")