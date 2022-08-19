const { isRequestEmpty } = require("../utils/requests.utils");
const { parseToJSONObject } = require("../utils/general.utils");
const Web3Config = require("../configs/web3.config");
const { Organization, User, Sequelize } = require("../sequelize");
const hash = require("object-hash");
const { Organizations } = require("../contracts");
const { processEventLogs, sendSignedMetaTransaction } = require("../utils/wallet.utils");
const { decodeToken } = require("../utils/jwt.utils");
const { unlockUserAddress } = require("../utils/secure.utils");
const Op = Sequelize.Op;

exports.create = async (req, res) => {
    if (isRequestEmpty(req)) {
        res.status(400).json({ message: "Empty request body" });
        return;
    }

    const { name, description, userToken } = req.body;

    const decoded = decodeToken(userToken);
    const unlockedUser = unlockUserAddress(decoded);

    const signature = hash.MD5([{ name, description }, new Date().getTime()]);

    const txReceipt = await sendSignedMetaTransaction(Organizations, unlockedUser.address, unlockedUser.secret, {
        gas: Web3Config.transaction.gas.high,
    }, "addOrganization", signature);

    const logs = await processEventLogs(Organizations, txReceipt.logs);

    const _signature = logs.filter((log) => log.name === "OrganizationCreated").map((log) => log.data["_organization"])[0];

    if (_signature !== signature) {
        res.status(400).json({ message: "Organization creation failed." });
        return;
    }

    try {
        const organization = await Organization.create({
            name,
            description,
            signature,
        });

        res.json({
            data: {
                name: organization.name,
                description: organization.description,
                signature: organization.signature,
                users: [],
            },
            message: "Organization created successfully.",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:
                error.message || "Some error occurred while creating Server.",
        });
    }


};

exports.readAll = async (req, res) => {
    const organizations = await Organization.findAll({
        include: [{ model: User, as: "users" }],
    });

    res.json({
        data: {
            organizations: parseToJSONObject(organizations),
        },
        message: "Organizations read successfully.",
    });
};

exports.read = async (req, res) => {
    const { signature } = req.params;

    const organization = await Organization.findOne({
        where: { signature },
        include: [{ model: User, as: "users" }],
    });

    if (!organization) {
        res.status(404).json({ message: `Organization with ${signature} not found.` });
        return;
    }

    res.json({
        data: {
            organization: parseToJSONObject(organization),
        },
        message: "Organization found successfully.",
    });
};

exports.update = async (req, res) => {
    if (isRequestEmpty(req)) {
        res.status(400).json({ message: "Empty request body" });
        return;
    }

    const { signature } = req.params;

    const organization = await Organization.findOne({
        where: { signature },
    });

    if (!organization) {
        res.status(404).json({ message: `Organization with ${signature} not found.` });
        return;
    }

    organization.set(req.body);
    await organization.save();

    res.json({
        data: {
            organization: parseToJSONObject(organization),
        },
        message: "Organization updated successfully.",
    });

};

exports.delete = async (req, res) => {
    const { signature } = req.params;
    const { userToken } = req.body;

    const decoded = decodeToken(userToken);
    const unlockedUser = unlockUserAddress(decoded);

    const organization = await Organization.findOne({
        where: { signature },
    });

    if (!organization) {
        res.status(404).json({ message: `Organization with ${signature} not found.` });
        return;
    }

    const txReceipt = await sendSignedMetaTransaction(Organizations, unlockedUser.address, unlockedUser.secret, {
        gas: Web3Config.transaction.gas.high,
    }, "deleteOrganization", signature);
    const logs = await processEventLogs(Organizations, txReceipt.logs);

    const _success = logs.filter((log) => log.name === "OrganizationDeleted").map((log) => log.data["_success"])[0];

    if (!_success) {
        res.status(400).json({ message: "Organization deletion failed." });
        return;
    }

    const usersCount = await User.count({
        where: {
            organizationId: organization.id,
        },
    });

    if (usersCount > 0) {
        res.status(400).json({ message: "Organization has users. Delete them first." });
        return;
    }

    await organization.destroy();

    res.json({
        message: "Organization deleted successfully.",
    });
};

exports.addUsers = async (req, res) => {
    const { signature } = req.params;
    const { users, userToken } = req.body;

    const decoded = decodeToken(userToken);
    const unlockedUser = unlockUserAddress(decoded);

    const _users = await User.findAll({
        where: {
            userKey: { [Op.in]: users },
        },
    });

    const addresses = _users.map((user) => user.address);

    const organization = await Organization.findOne({
        where: { signature },
    });

    for (const user of _users) {
        await user.setOrganization(organization.id);
    }

    await sendSignedMetaTransaction(Organizations, unlockedUser.address, unlockedUser.secret, {
        gas: Web3Config.transaction.gas.high,
    }, "addUsersToOrganization", organization.signature, addresses);

    res.json({
        message: "Users added successfully.",
    });
};

exports.removeUsers = async (req, res) => {
    const { signature } = req.params;
    const { users, userToken } = req.body;

    const decoded = decodeToken(userToken);
    const unlockedUser = unlockUserAddress(decoded);

    const organization = await Organization.findOne({
        where: { signature },
    });

    const _users = await User.findAll({
        where: {
            [Op.and]: [
                { userKey: { [Op.in]: users } },
                { organizationId: organization.id },
            ],
        },
    });

    const addresses = _users.map((user) => user.address);

    for (const user of _users) {
        await user.setOrganization(null);
    }

    await sendSignedMetaTransaction(Organizations, unlockedUser.address, unlockedUser.secret, {
        gas: Web3Config.transaction.gas.high,
    }, "removeUsersFromOrganization", organization.signature, addresses);

    res.json({
        message: "Users removed successfully.",
    });
};