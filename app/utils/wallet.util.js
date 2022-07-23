const { web3 } = require("./web3.utils");
const { lockUserAddress } = require("./secure.util");

exports.createTransaction = async (transactionObject, secretKey) => {
    return await web3.eth.accounts.signTransaction(transactionObject, secretKey);
};

exports.sendSignedTransaction = async (signedTransaction) => {
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