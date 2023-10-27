import { AES, enc } from 'crypto-js';

export const AesEncrypt = (text: string, key: string) => AES.encrypt(text, key).toString();

export const AesDecrypt = (text: string, key: string) => AES.decrypt(text, key).toString(enc.Utf8);
