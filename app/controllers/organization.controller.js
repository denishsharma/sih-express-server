const { isRequestEmpty } = require("../utils/requests.utils");
const { web3 } = require("../utils/web3.utils");
const { parseToJSONObject } = require("../utils/general.utils");
const Web3Config = require("../configs/web3.config");
const { Organization, User, Sequelize } = require("../sequelize");
const hash = require("object-hash");
const { Organizations } = require("../contracts");
const { createTransaction, sendSignedTransaction } = require("../utils/wallet.utils");
const Op = Sequelize.Op;

const processEventLogs = async (logs) => {
    const jsonInterfaces = Organizations._jsonInterface.filter((item) => item.type === "event");

    const events = [];

    for (const log of logs) {
        for (const topic of log.topics) {
            for (const jsonInterface of jsonInterfaces) {
                if (topic === jsonInterface.signature) {
                    events.push({
                        name: jsonInterface.name,
                        data: web3.eth.abi.decodeLog(jsonInterface.inputs, log.data, log.topics),
                    });
                }
            }
        }
    }

    return events;
};

const sendTx = async (tx, privateKey) => {
    const signedTransaction = await createTransaction(tx, privateKey);
    const txReceipt = await sendSignedTransaction(signedTransaction);

    return await processEventLogs(txReceipt.logs);
};


exports.index = (req, res) => {
    res.send("Organization Records");
};

exports.create = async (req, res) => {
    if (isRequestEmpty(req)) {
        res.status(400).json({ message: "Empty request body" });
        return;
    }

    const { name, description } = req.body;

    if (await Organization.findOne({ where: { name } })) {
        res.status(400).json({
            message: `Organization with the name ${name} is already exists.`,
        });
        return;
    }
    const signature = hash.MD5([{ name, description }, new Date().getTime()]);

    const tx = {
        to: Organizations.options.address,
        gas: Web3Config.transaction.gas.high,
        data: Organizations.methods["addOrganization"](signature).encodeABI(),
    };

    const logs = await sendTx(tx);

    const _signature = logs.filter((log) => log.name === "OrganizationCreated").map((log) => log.data["_organization"])[0];

    if (_signature !== signature) {
        res.status(400).json({ message: "Organization creation failed." });
        return;
    }

    const organizationAttributes = {
        name,
        description,
        signature,
    };

    try {
        const organization = await Organization.create(organizationAttributes);

        res.json({
            data: {
                name: organization.name,
                description: organization.description,
                signature: organization.signature,
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
    const organizations = await Organization.findAll();
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

    console.log("Organization: ", organization.toJSON());

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

    const organization = await Organization.findOne({
        where: { signature },
    });

    if (!organization) {
        res.status(404).json({ message: `Organization with ${signature} not found.` });
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
    const { users } = req.body;

    const _users = await User.findAll({
        where: {
            userKey: { [Op.in]: users },
        },
    });

    const organization = await Organization.findOne({
        where: { signature },
    });

    const addresses = _users.map(user => user.address);


    for (const user of _users) {
        await user.setOrganization(organization.id);
    }

    res.json({
        message: "Users added successfully.",
    });
};

exports.removeUsers = async (req, res) => {
    const { signature } = req.params;
    const { users } = req.body;

    const _users = await User.findAll({
        where: {
            userKey: { [Op.in]: users },
        },
    });

    const organization = await Organization.findOne({
        where: { signature },
    });

    for (const user of _users) {
        await user.setOrganization(null);
    }

    res.json({
        message: "Users removed successfully.",
    });
};