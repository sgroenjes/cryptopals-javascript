//SET 1 CHALLENGE 8
const fs = require('fs');

exports.AES_ECB_Detect = function AES_ECB_Detect(ciphertext) {
  //each line is 320 characters long
  let flagged = [];
  if(!ciphertext) {
    ciphertext = fs.readFileSync('./8.txt','utf-8').match(/.{320}/g);
  }
  
  ciphertext.forEach((line,lineIndex) => {
    let blocks = line.match(/.{16}/g);
    blocks.sort(function(a,b) {
      return parseInt(a,'16') - parseInt(b,'16');
    });
    blocks.forEach((block,index) => {
      if(index < blocks.length-1 && block == blocks[index+1])
        flagged.push(lineIndex);
    })
  });
  if(flagged.length>1) {
    // console.log("Following line has blocks that match:")
    // console.log(ciphertext[flagged[0]].match(/.{16}/g).sort((a,b)=>{ return parseInt(a,'16')-parseInt(b,'16')}))
    return true;
  }
  return false;
}

// this.AES_ECB_Detect()