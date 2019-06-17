const fs = require('fs');

function AES_ECB_Detect() {
  //each line is 320 characters long
  let flagged = [];
  var lines = fs.readFileSync('./8.txt','utf-8').match(/.{320}/g);
  
  //try easy check
  //the same 16 byte plaintext will always produce the same 16 byte ciphertext
  //if there are copies of 16 byte blocks in the string
  // console.log(lines.length)
  lines.forEach((line,lineIndex) => {
    let blocks = line.match(/.{16}/g);
    blocks.sort(function(a,b) {
      return parseInt(a,'16') - parseInt(b,'16');
    });
    blocks.forEach((block,index) => {
      if(index < blocks.length-1 && block == blocks[index+1])
        flagged.push(lineIndex);
    })
  });
  // console.log(flagged);
  console.log(lines[132].match(/.{16}/g).sort(function(a,b) {
    return parseInt(a,'16') - parseInt(b,'16');
  }))
}
AES_ECB_Detect()