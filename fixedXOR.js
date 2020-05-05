//SET 1 CHALLENGE 2
function hex2bin(hex) {
  return (parseInt(hex,16).toString(2)).padStart(8,'0');
}

exports.hexXOR = function XOR(hexString1, hexString2) {
  res1 = '';
  res2 = '';
  hexString1 = hexString1.match(/.{1,2}/g).join(' ');
  hexString2 = hexString2.match(/.{1,2}/g).join(' ');
  hexString1.split(' ').forEach(str => { res1 += hex2bin(str)});
  hexString2.split(' ').forEach(str => { res2 += hex2bin(str)});
  res1 = res1.match(/.{1,32}/g)
  res2 = res2.match(/.{1,32}/g)
  xor = '';
  res1.forEach((r1,index) => {
    let basexor = parseInt(r1,2)^parseInt(res2[index],2)
    let x = (basexor >>> 0).toString(2)
    xor += parseInt(x.padStart(32,'0'),2).toString(16).padStart(8,'0');
  })
  return xor;
}

// console.log(this.hexXOR("1c0111001f010100061a024b53535009181c","686974207468652062756c6c277320657965"))
// console.log("746865206b696420646f6e277420706c6179")