const { web3 } = require('./web3.utils');

exports.createTransaction = async (transactionObject, secretKey) => {
    return await web3.eth.accounts.signTransaction(transactionObject, secretKey);
}

exports.sendSignedTransaction = async (signedTransaction) => {
    return await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
}