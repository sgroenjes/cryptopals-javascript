//SET 1 CHALLENGE 6
const fs = require('fs');
const convert = require('./hexToB64');
const c3 = require('./singleByteXORcipher.js');

exports.guessKeySize = guessKeySize;
function guessKeySize(data) {
  if(!data) {
    data = fs.readFileSync('./6.txt', 'utf-8').split('\n').join('');
  }
  var hexCodes = convert.base64ToHex(data).replace(/\s/g,'');
  // console.log("guess key size hex: ",hexCodes)
  var hammies = [];
  for(var keysize=2;keysize<=64;keysize++) {
    var runningHams = [];
    for(var j=0;j<hexCodes.length-(j+2)*2*keysize;j++) {
      let one = hexCodes.slice(j*2*keysize,(j+1)*2*keysize);
      let two = hexCodes.slice((j+1)*2*keysize,(j+2)*2*keysize);
      runningHams.push(hammingDistance(one,two)/(keysize*2));
    }
    let score = 0;
    runningHams.forEach(rh => {
      score += rh;
    });
    score = score / (runningHams.length-1)
    hammies.push({
      hammy:score,
      keysize
    });
  }
  hammies.sort(function(a,b) { return a.hammy-b.hammy });
  // console.log(hammies)
  return {
    keysize: hammies[0].keysize,
    score: hammies[0].hammy,
    hexCodes
  };
}

function BreakRepeatingKeyXOR() {
  var {keysize,hexCodes} = guessKeySize()
  keysizeByteArray = hexCodes.match(new RegExp(`.{1,${keysize*2}}`,'g'))
  transposedByteArray = [];
  for(var i=0;i<keysize;i++) {
    transposedByteArray[i] = '';
  }
  keysizeByteArray.forEach(ksb => {
    for(var i=0;i<keysize*2;i+=2) {
      transposedByteArray[i/2] += ksb[i]+ksb[i+1]
    }
  });
  var key = transposedByteArray.map(tba => {
    let c = c3.singleByteXOR(tba);
    return c.character;
  }).join('');
  var byteArray = hexCodes.match(/.{1,2}/g)
  var plaintext = '';
  byteArray.forEach((byte,index) => {
    let keyXOR = key[index%key.length].charCodeAt();
    let charCode = parseInt(byte,16)
    plaintext += String.fromCharCode(keyXOR^charCode)
  })
  // console.log(key);
  // console.log(plaintext);
}

function hammingDistance(string1,string2) {
  if(string1.length != string2.length){
    console.log("String sizes aren't equal: "+string1.length+', '+string2.length);
    return;
  }
  totalDiffBits = 0;
  //assume we have hex strings
  for(var i=0;i<string1.length;i+=2) {
    let char1Code = parseInt(string1[i]+string1[i+1],16)
    let char2Code = parseInt(string2[i]+string2[i+1],16)
    let diffBits = (char1Code^char2Code).toString(2).padStart(8,'0').split('1').length-1;
    totalDiffBits += diffBits;
  }
  return totalDiffBits;
}

// console.log(convert.base64ToHex(convert.btoa("this is a test")).match(/.{1,2}/g).map(n => { return parseInt(n,16) }).join(' '))
// console.log(convert.base64ToHex(convert.btoa("wokka wokka!!!")).match(/.{1,2}/g).map(n => { return parseInt(n,16) }).join(' '))
// console.log(hammingDistance(convert.base64ToHex(convert.btoa("this is a test")),convert.base64ToHex(convert.btoa("wokka wokka!!!"))))
// BreakRepeatingKeyXOR();
