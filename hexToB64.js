//SET 1 CHALLENGE 1
var tableStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var table = tableStr.split("");

/*****
 * Decode a base-64 encoded string
 */
atob = function (base64) {
  if (/(=[^=]+|={3,})$/.test(base64)) throw new Error("String contains an invalid character");
  let equalsCount = (base64.match(/=/g) || []).length;
  base64 = base64.replace(/=/g, "");
  var n = base64.length & 3;
  if (n === 1) throw new Error("String contains an invalid character");
  for (var i = 0, j = 0, len = base64.length / 4, bin = []; i < len; ++i) {
    var a = tableStr.indexOf(base64[j++] || "A"), b = tableStr.indexOf(base64[j++] || "A");
    var c = tableStr.indexOf(base64[j++] || "A"), d = tableStr.indexOf(base64[j++] || "A");
    if ((a | b | c | d) < 0) throw new Error("String contains an invalid character");
    bin[bin.length] = ((a << 2) | (b >> 4)) & 255;
    bin[bin.length] = ((b << 4) | (c >> 2)) & 255;
    bin[bin.length] = ((c << 6) | d) & 255;
  };
  if(equalsCount==1) {
    bin = bin.splice(0,bin.length-1)
  }
  else if( equalsCount==2) {
    bin = bin.splice(0,bin.length-2)
  }

  let xz = String.fromCharCode.apply(null, bin);
  return xz;
};

/*****
 * Encode a string in base-64
 */
btoa = function (bin) {
  for (var i = 0, j = 0, len = bin.length / 3, base64 = []; i < len; ++i) {
    var a = bin.charCodeAt(j++), b = bin.charCodeAt(j++), c = bin.charCodeAt(j++);
    if ((a | b | c) > 255) throw new Error("String contains an invalid character");
    base64[base64.length] = table[a >> 2] + table[((a << 4) & 63) | (b >> 4)] +
                            (isNaN(b) ? "=" : table[((b << 2) & 63) | (c >> 6)]) +
                            (isNaN(b + c) ? "=" : table[c & 63]);
  }
  return base64.join("");
};
exports.atob = atob
exports.btoa = btoa

exports.hexToBase64 = function hexToBase64(str) {
  return btoa(String.fromCharCode.apply(null,
    str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
  );
}

exports.base64ToHex = function base64ToHex(str) {
  for (var i = 0, bin = atob(str), hex = []; i < bin.length; ++i) {
    var tmp = bin.charCodeAt(i).toString(16);
    if (tmp.length === 1) tmp = "0" + tmp;
    hex[hex.length] = tmp;
  }
  return hex.join("");
}

// console.log(this.hexToBase64("49276d206b696c6c696e6720796f757220627261696e206c696b65206120706f69736f6e6f7573206d757368726f6f6d"))
// console.log("SSdtIGtpbGxpbmcgeW91ciBicmFpbiBsaWtlIGEgcG9pc29ub3VzIG11c2hyb29t")