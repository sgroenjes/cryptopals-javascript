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