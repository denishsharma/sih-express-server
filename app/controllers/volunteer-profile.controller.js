const { VolunteerProfile } = require("../contracts");
const { decodeToken } = require("../utils/jwt.utils");
const { unlockUserAddress } = require("../utils/secure.utils");
const { createTransaction, sendSignedTransaction } = require("../utils/wallet.utils");
const { web3 } = require("../utils/web3.utils");

exports.giveEditorAccess = async (req, res) => {
    const { address } = req.body;
    const accounts = await web3.eth.getAccounts();

    try {
        const txReceipt = await VolunteerProfile.methods["addEditorAccess"](address).send({ from: accounts[0] });

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

exports.revokeEditorAccess = async (req, res) => {
    const { address } = req.body;
    const accounts = await web3.eth.getAccounts();

    try {
        const txReceipt = await VolunteerProfile.methods["removeEditorAccess"](address).send({ from: accounts[0] });

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

exports.addProfile = async (req, res) => {
    const { userToken, name, email, phone, birthDate, address } = req.body;

    const decoded = decodeToken(userToken);
    const unlockedUser = unlockUserAddress(decoded);

    try {
        const addProfileMethod = await VolunteerProfile.methods.addProfile([name, email, phone, birthDate, address]);
        const encodedABI = addProfileMethod.encodeABI();

        const tx = {
            from: unlockedUser.address,
            to: VolunteerProfile.options.address,
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

exports.updateProfile = async (req, res) => {};