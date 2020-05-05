//SET 1 CHALLENGE 5
const k = "ICE";
const pt = "Burning 'em, if you ain't quick and nimble\nI go crazy when I hear a cymbal"


exports.RepeatingKeyXOR = function RepeatingKeyXOR(key,plaintext) {
  cipherText = '';
  for(var i=0;i<plaintext.length;i++) {
    let keyXOR = key[i%key.length].charCodeAt();
    let charCode = plaintext[i].charCodeAt();
    cipherText += (keyXOR^charCode).toString(16).padStart(2,'0');
  }
  return cipherText;
}

// console.log(this.RepeatingKeyXOR(k,pt))
// console.log("0b3637272a2b2e63622c2e69692a23693a2a3c6324202d623d63343c2a26226324272765272a282b2f20430a652e2c652a3124333a653e2b2027630c692b20283165286326302e27282f")