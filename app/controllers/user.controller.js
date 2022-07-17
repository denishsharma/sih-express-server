const { User, Sequelize } = require("../sequelize");
const { isRequestEmpty } = require("../utils/requests.util");
const { web3 } = require("../utils/web3.utils");
const { createUserToken, decodeToken } = require("../utils/jwt.utils");
const { lockUserAddress, unlockUserAddress } = require("../utils/secure.util");
const {
    createTransaction,
    sendSignedTransaction,
} = require("../utils/wallet.util");
const Op = Sequelize.Op;

exports.token = async (req, res) => {
    const { userKey } = req.params;

    const user = await User.findOne({ where: { userKey } });

    if (!user) {
        res.status(404).json({ message: "User not found." });
        return;
    }

    const userToken = createUserToken(user);
    res.json({
        data: {
            userKey,
            address: user.address,
            userToken,
        },
        message: "User token created successfully.",
    });
};

exports.create = async (req, res) => {
    if (isRequestEmpty(req)) {
        res.status(400).json({ message: "Empty request body" });
        return;
    }

    const { userKey } = req.body;

    if (await User.findOne({ where: { userKey } })) {
        res.status(400).json({
            message: `User with user key ${userKey} is already exists.`,
        });
        return;
    }

    try {
        const accountInfo = await web3.eth.accounts.create();
        let userAttributes = {
            userKey,
            address: accountInfo.address,
            secret: accountInfo.privateKey,
        };
        console.log(userAttributes);
        const lockedAddress = lockUserAddress(userAttributes);
        userAttributes.secret = lockedAddress.secret;

        const user = await User.create(userAttributes);
        const userToken = createUserToken(user);
        res.json({
            data: {
                userKey,
                address: user.address,
                userToken,
            },
            message: "User created successfully.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:
                error.message || "Some error occurred while creating Server.",
        });
    }
};

exports.getBalance = async (req, res) => {
    if (isRequestEmpty(req)) {
        res.status(400).json({ message: "Empty request body" });
        return;
    }

    const { userToken } = req.body;

    const decoded = decodeToken(userToken);

    try {
        const balance = await web3.eth.getBalance(decoded.address);

        res.json({
            data: {
                balance,
                units: {
                    ether: web3.utils.fromWei(balance, "ether"),
                    gwei: web3.utils.fromWei(balance, "gwei"),
                    wei: balance,
                },
            },
            message: "Balance fetched successfully.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:
                error.message || "Some error occurred while creating Server.",
        });
    }
};

exports.transfer = async (req, res) => {
    if (isRequestEmpty(req)) {
        res.status(400).json({ message: "Empty request body" });
        return;
    }

    const { to, value, userToken } = req.body;
    let toAddress;

    if (to.type === "user") {
        const toUser = await User.findOne({ where: { userKey: to.value } });
        if (!toUser) {
            res.status(404).json({
                message: `Receiver not found with user key ${to.value}`,
            });
            return;
        }
        toAddress = toUser.address;
    } else if (to.type === "address") {
        toAddress = to.value;
    }

    const decoded = decodeToken(userToken);
    const unlockedUserAddress = unlockUserAddress(decoded);

    try {
        const signedTransaction = await createTransaction(
            {
                to: toAddress,
                from: unlockedUserAddress.address,
                value,
                gas: "21000",
            },
            unlockedUserAddress.secret
        );

        const transactionReceipt = await sendSignedTransaction(
            signedTransaction
        );

        if (transactionReceipt) {
            res.json({
                message: `Transaction successful with hash: ${transactionReceipt.transactionHash}`,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:
                error.message || "Some error occurred while creating Server.",
        });
    }
};
