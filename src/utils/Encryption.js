import CryptoJS, { AES } from 'crypto-js';

export const encryptData = (data, secretKey) => {
    const encryptedData = AES.encrypt(JSON.stringify(data), secretKey).toString();
    return encryptedData;
};

export const decryptData = (encryptedData, secretKey) => {
    if (encryptedData === null || encryptedData === "") {
        return "";
    }
    const decryptedData = AES.decrypt(encryptedData, secretKey).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
};