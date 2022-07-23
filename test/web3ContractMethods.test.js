const Web3 = require("web3");
let networkProvider = "ws://localhost:7545";

const { createTransaction, sendSignedTransaction } = require("../app/utils/wallet.util");

let web3Provider = new Web3.providers.WebsocketProvider(networkProvider);
web3 = new Web3(web3Provider);

const VolunteerProfile = require("../app/contracts/deployed/VolunteerProfile.deployed")(web3, 5777);

const accounts = web3.eth.getAccounts();

// (async () => {
//     console.log(await VolunteerProfile.methods["addressToProfile"]().call({ from: accounts[0] }));
// })();


const methodsInterface = VolunteerProfile._jsonInterface.filter((item) => item.type === "function");

console.log(methodsInterface)

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
    }

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