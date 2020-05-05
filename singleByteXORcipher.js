//SET 1 CHALLENGE 3
var alphabet = {
  a: 0.082,
  b: 0.015,
  c: 0.028,
  d: 0.042,
  e: 0.127,
  f: 0.022,
  g: 0.020,
  h: 0.061,
  i: 0.070,
  j: 0.001,
  k: 0.008,
  l: 0.040,
  m: 0.024,
  n: 0.067,
  o: 0.075,
  p: 0.019,
  q: 0.001,
  r: 0.060,
  s: 0.063,
  t: 0.090,
  u: 0.028,
  v: 0.010,
  w: 0.024,
  x: 0.001,
  y: 0.020,
  z: 0.001,
  ' ': 0.13
};

exports.singleByteXOR = function singleByteXOR(hex) {
  //get byte array from hex encoded string
  var bytearray = hex.match(/.{1,2}/g);
  results = [];
  let maxScore = 0;
  let maxScoreIndex;
  for(let i=0;i<255;i++){
    xorbyte = i;
    score = 0;
    string = '';
    character = String.fromCharCode(i);
    bytearray.forEach(byte => {
      let char = String.fromCharCode(parseInt(byte,16)^xorbyte)
      string += char;
      if(Object.keys(alphabet).includes(char.toLowerCase()))
        score += alphabet[char.toLowerCase()];
    });
    if(score > maxScore) {
      maxScore = score
      maxScoreIndex = i
    }
    results.push({score, string, character});
  }
  return results[maxScoreIndex];
}

// 🎶🎶 play that funky music 🎶🎶
// console.log(this.singleByteXOR("1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736"))