const { web3 } = require("../../app/utils/web3.utils");
const { createTransaction, sendSignedTransaction } = require("../../app/utils/wallet.utils");

const { VolunteerProfile } = require("../../app/contracts");

const someTest = async () => {
    const methodsInterface = VolunteerProfile._jsonInterface.filter((item) => item.type === "function");

    console.log(methodsInterface);

    const methods = {};

    for (let methodInterface in methodsInterface) {
        const methodObject = {
            name: methodInterface.name,
            inputs: methodInterface.inputs,
            outputs: methodInterface.outputs,
            constant: methodInterface.constant,
            signature: methodInterface.signature,
            payable: methodInterface.payable,
            stateMutability: methodInterface.stateMutability,
        };

        methodObject.call = async (options, secretKey, ...params) => {
            return await sendMethod(VolunteerProfile, methodObject.name, {}, secretKey, ...params);
        };

    }

    const sendMethod = async (contract, methodName, options, secretKey, ...params) => {
        const method = contract.methods[methodName](...params);
        const encodedABI = method.encodeABI();
        const tx = Object.assign({}, options, {
            gas: options.gas || "3000000",
            data: encodedABI,
        });
        const txHash = await createTransaction(tx, secretKey);
        return await sendSignedTransaction(txHash);
    };
}


exports.test = async () => {

    console.log("Testing some test");
    await someTest();
    console.log("Testing some test done!");

    process.exit();
}

exports.metadata = {
    name: "contractMethods"
}