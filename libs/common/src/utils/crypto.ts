/*
 * AES crypto util
 * @Author: hsycc
 * @Date: 2023-04-21 13:24:34
 * @LastEditTime: 2023-05-15 20:53:00
 * @Description:
 *
 */
import CryptoJS from 'crypto-js';

export const MD5 = CryptoJS.MD5;

/**
 * AES 加密/解密方法封装
 */
export class AesInfo {
  key = '';
  iv = CryptoJS.enc.Utf8.parse('abcdef1234567890');

  constructor(aesKey: string) {
    this.key = CryptoJS.enc.Utf8.parse(aesKey);
  }

  /**
   * 加密信息
   * @param info
   * @returns {string}
   */
  encrypt(info: string): string {
    if (!info) return '';

    const srcs = CryptoJS.enc.Utf8.parse(info);

    const encrypted = CryptoJS.AES.encrypt(srcs, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.ciphertext.toString().toLowerCase();
  }

  /**
   * 解密信息
   * @param info
   * @returns {string}
   */
  decrypt(info: string): string {
    if (!info) return '';

    const encryptedHexStr = CryptoJS.enc.Hex.parse(info.toLowerCase());

    const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);

    const decrypt = CryptoJS.AES.decrypt(srcs, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypt.toString(CryptoJS.enc.Utf8).toString();
  }
}

/** AES实例, 根据type返回不同的密钥 */
const instanceMap = new Map();

export const getAesInstance = (type = 1): AesInfo => {
  switch (type) {
    // 下发关键信息加密
    case 1:
      return getInstance('8&MFhb$v&$4Wnh6b');
    // 公私钥加密
    case 2:
      return getInstance('id5&CxDFFd9WEzRQ');
    // 认证信息加密
    case 3:
      return getInstance('3j@rP7A4reRbt9Dt');
    // 存储的token加密
    case 4:
      return getInstance('%A$!Vex4AFEeXwPU');
    case 5:
      return getInstance('j#q28&HyrDfiV#zY');
    case 6:
      return getInstance('5kf!pwZvHMYcKV5F');
    default:
      return getInstance('8&MFhb$v&$4Wnh6b');
  }
};

const getInstance = (psd) => {
  if (instanceMap.has(psd)) {
    return instanceMap.get(psd);
  }

  const new_instance = new AesInfo(psd);

  instanceMap.set(psd, new_instance);

  return new_instance;
};
