require("dotenv").config();

const CryptoJS = require("crypto-js");

exports.encrypt = (message, password = process.env.APP_SECRET) => {
    const secret = CryptoJS.AES.encrypt(message, password);
    return secret.toString();
};

exports.decrypt = (encryptedMessage, password = process.env.APP_SECRET) => {
    const secret = CryptoJS.AES.decrypt(encryptedMessage, password);
    if (secret) {
        return secret.toString(CryptoJS.enc.Utf8);
    }
};

exports.lockUserAddress = (user) => {
    const address = user.address + ":" + process.env.APP_SECRET;
    const hashPassword = CryptoJS.SHA256(address).toString(CryptoJS.enc.Hex);
    const secret = this.encrypt(user.secret, hashPassword);
    return {
        userKey: user.userKey,
        address: user.address,
        secret,
    };
};

exports.unlockUserAddress = (user) => {
    const address = user.address + ":" + process.env.APP_SECRET;
    const hashPassword = CryptoJS.SHA256(address).toString(CryptoJS.enc.Hex);
    const secret = this.decrypt(user.secret, hashPassword);
    return {
        userKey: user.userKey,
        address: user.address,
        secret,
    };
};
