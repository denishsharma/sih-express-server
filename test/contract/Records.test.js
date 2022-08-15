const { Records } = require("../../app/contracts");
const { createTransaction, sendSignedTransaction } = require("../../app/utils/wallet.utils");

const publicKey = "0xaeCf6cC6BEC8Cd897856BDa334F5E1A9b52702c6";
const privateKey = "921a9fb27fcc5f1f5e00b99de092f149a5097b65d642608b172a14e2fea2578f";

const testRecordTestFunction = async () => {
    const testFunctionABI = Records.methods["_test"]("hello").encodeABI();
    const tx = {
        from: publicKey,
        to: Records.options.address,
        gas: 2000000,
        data: testFunctionABI,
    };

    const signedTransaction = await createTransaction(tx, privateKey);
    const txReceipt = await sendSignedTransaction(signedTransaction);

};

exports.test = async () => {
    await testRecordTestFunction();

};

exports.metadata = {
    name: "records",
};