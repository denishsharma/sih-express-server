const { web3 } = require("../../app/utils/web3.utils");
const Web3Config = require("../../app/configs/web3.config");
const { createTransaction, sendSignedTransaction } = require("../../app/utils/wallet.utils");

const { SimpleStorage, MetaTransaction } = require("../../app/contracts");

const userPublicKey = "0xa5E01731c34090151a7e49414E66571798f7cfbA";
const userPrivateKey = "0x27ffa8e3f4e436ff9dea947736551ce3b3afd714eb5c9835a48ebd24483fd23b";

const mtxPublicAddress = "0x011E36d342aEbBDcd8Da1B8928ea537fD8C544Fe";
const mtxPrivateKey = "10906c78f5998969dd5a2457d686a7984e9443b5dbcbad69f24fc93979621f49";

exports.metadata = {
    name: "metaTransaction",
};

const testContractCall = async () => {
    const target = SimpleStorage.options.address;
    const nonce = await SimpleStorage.methods["nonces"](userPublicKey).call();
    const data = SimpleStorage.methods["store"](3).encodeABI();
    const hash = web3.utils.sha3(target + data.substring(2) + web3.utils.toBN(nonce).toString(16, 64));
    const sig = web3.eth.accounts.sign(hash, userPrivateKey);

    const encodedABI = SimpleStorage.methods["sign"](userPublicKey, target, data, nonce, sig.messageHash, sig.signature).encodeABI();
    const tx = {
        from: mtxPublicAddress,
        to: target,
        data: encodedABI,
        gas: Web3Config.transaction.gas.high,
    };

    const signedTransaction = await createTransaction(tx, mtxPrivateKey);
    const txReceipt = await sendSignedTransaction(signedTransaction);

    console.log("Transaction receipt:", txReceipt);
};


exports.test = async () => {

    console.log("Testing contract call with meta transaction");
    await testContractCall();
    console.log("Testing contract call with meta transaction done!");

    process.exit();
};
