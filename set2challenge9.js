exports.PKCS7 = function PKCS7(block, lengthInBytes) {
  //assuming block is hex encoded
  var i = block.length%(lengthInBytes*2)/2;//divide by 2 to concat a 2-character hex number for each byte
  var j = i;
  //PKCS#7 Padding
  for(;j<lengthInBytes;j++)
    block = block.concat((lengthInBytes-i).toString().padStart(2,'0'))
  return block;
}
//'YELLOW SUBMARINE'
// console.log(PKCS7('59454c4c4f57205355424d4152494e45',20))
//should come out as 59454c4c4f57205355424d4152494e4504040404