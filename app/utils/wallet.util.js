const { web3 } = require("./web3.utils");
const Web3Config = require("../configs/web3.config");
const { lockUserAddress } = require("./secure.util");

exports.createTransaction = async (transactionObject, secretKey) => {
    return await web3.eth.accounts.signTransaction(transactionObject, secretKey);
};

exports.sendSignedTransaction = async (signedTransaction) => {
    // noinspection ES6RedundantAwait
    return await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
};

exports.createLockedAccount = async (userKey) => {
    const accountInfo = await web3.eth.accounts.create();
    const accountAttributes = {
        userKey,
        address: accountInfo.address,
        secret: accountInfo.privateKey,
    };
    return lockUserAddress(accountAttributes);
};

exports.transferEther = async (fromAddress, toAddress, amountInWei, fromPrivateKey) => {
    const transactionObject = {
        from: fromAddress,
        to: toAddress,
        value: amountInWei,
        gas: Web3Config.transaction.gas.transfer,
    };

    const signedTransaction = await this.createTransaction(transactionObject, fromPrivateKey);
    return await this.sendSignedTransaction(signedTransaction);
};