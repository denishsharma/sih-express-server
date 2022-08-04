const { decodeToken } = require("../utils/jwt.utils");
const { unlockUserAddress } = require("../utils/secure.utils");
const { web3 } = require("../utils/web3.utils");
const { createTransaction, sendSignedTransaction } = require("../utils/wallet.utils");
const { SimpleStorage } = require("../contracts");
const Tx = require("ethereumjs-tx");

const { subscribedEvents } = require("../events");

exports.store = async (req, res) => {
    const { number, userToken } = req.body;

    const decoded = decodeToken(userToken);
    const unlockedUser = unlockUserAddress(decoded);

    try {
        const storeNumber = await SimpleStorage.methods.store(number);
        const encodedABI = storeNumber.encodeABI();

        const tx = {
            from: unlockedUser.address,
            to: SimpleStorage.options.address,
            gas: 2000000,
            data: encodedABI,
        };

        const signedTransaction = await createTransaction(tx, unlockedUser.secret);
        const txReceipt = await sendSignedTransaction(signedTransaction);

        res.json({
            txReceipt,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:
                error.message || "Some error occurred while creating Server.",
        });
    }
};

exports.getMyFavoriteNumber = async (req, res) => {
    const { userToken } = req.body;

    const decoded = decodeToken(userToken);
    const unlockedUser = unlockUserAddress(decoded);

    try {
        const getNumber = await SimpleStorage.methods.myFavoriteNumber().call({ from: unlockedUser.address });
        // const encodedABI = getNumber.encodeABI();
        //
        // const tx = {
        //     from: unlockedUser.address,
        //     to: SimpleStorage.options.address,
        //     data: encodedABI
        // };
        //
        // const signedTransaction = await createTransaction(tx, unlockedUser.secret);
        // const txReceipt = await sendSignedTransaction(signedTransaction);

        res.json({
            getNumber,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:
                error.message || "Some error occurred while creating Server.",
        });
    }
};
