import CryptoJS from "crypto-js"; //引用AES源码js
//解密方法
var key = CryptoJS.enc.Utf8.parse("boshland@admin66"); //十六位十六进制数作为秘钥
var iv = CryptoJS.enc.Utf8.parse("boshland@admin66");//十六位十六进制数作为秘钥偏移量
//解密方法
export function Decrypt(decryptStr) {
  const decryptBase64Str = CryptoJS.enc.Base64.parse(decryptStr);
  const createCode = CryptoJS.lib.CipherParams.create({
    ciphertext: decryptBase64Str,
  });
  const decryptedData = CryptoJS.AES.decrypt(createCode, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const decryptedStr = CryptoJS.enc.Utf8.stringify(decryptedData).toString();
  return decryptedStr;
}
//加密方法
export function Encrypt(word) {
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}
