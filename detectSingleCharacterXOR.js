//SET 1 CHALLENGE 4
var c3 = require('./singleByteXORcipher.js');
const fs = require('fs');

function bestXORLine() {
  var lines = fs.readFileSync('./4.txt', 'utf-8')
    .split('\n');
  lines = lines.map(line => {
    return c3.singleByteXOR(line);
  });
  lines.sort(function(a,b) {
    return b.score - a.score;
  })
  // console.log(lines[0].string);
}

// bestXORLine();