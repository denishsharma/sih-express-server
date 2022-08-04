const { web3 } = require("./web3.utils");
const Web3Config = require("../configs/web3.config");
const { lockUserAddress } = require("./secure.utils");

exports.createTransaction = async (transactionObject, secretKey) => {
    return await web3.eth.accounts.signTransaction(transactionObject, secretKey);
};

exports.sendSignedTransaction = async (signedTransaction) => {
    // noinspection ES6RedundantAwait
    return await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
};


exports.createMetaTransaction = async (contract, delegatePublicAddress, delegatePrivateKey, options, methodName, ...params) => {
    const target = contract.options.address;
    const nonce = await contract.methods["nonces"](delegatePublicAddress).call();
    const data = contract.methods[methodName](...params).encodeABI();
    const hash = web3.utils.sha3(target + data.substring(2) + web3.utils.toBN(nonce).toString(16, 64));
    const sig = web3.eth.accounts.sign(hash, delegatePrivateKey);

    const encodedABI = contract.methods["sign"](delegatePublicAddress, target, data, nonce, sig.messageHash, sig.signature).encodeABI();
    return Object.assign({
        to: target,
        data: encodedABI,
        gas: options.gas || Web3Config.transaction.gas.high,
    }, options);
};

exports.sendMetaTransaction = async (metaTransaction) => {
    const signedTransaction = await this.createTransaction(Object.assign({ from: Web3Config.metaAccounts.env.publicAddress }, metaTransaction), Web3Config.metaAccounts.env.privateKey);
    return await this.sendSignedTransaction(signedTransaction);
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