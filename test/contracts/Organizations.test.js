require("dotenv").config();
const { Organizations } = require("../../app/contracts");
const { Organization, User, Sequelize } = require("../../app/sequelize");
const { web3 } = require("../../app/utils/web3.utils");
const { createTransaction, sendSignedTransaction } = require("../../app/utils/wallet.utils");
const { parseToJSONObject } = require("../../app/utils/general.utils");
const { address } = require("@truffle/contract/lib/contract/properties");
const Op = Sequelize.Op;

const publicKey = process.env.META_ACCOUNT_ADDRESS;
const privateKey = process.env.META_ACCOUNT_PRIVATE;


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

const sendTx = async (tx) => {
    const signedTransaction = await createTransaction(tx, privateKey);
    const txReceipt = await sendSignedTransaction(signedTransaction);

    return await processEventLogs(txReceipt.logs);
};

const testAddOrganization = async () => {
    const organization = await Organization.findOne({ where: { name: "IDRN" } });

    const tx = {
        from: publicKey,
        to: Organizations.options.address,
        gas: 2000000,
        data: Organizations.methods["addOrganization"](organization.signature).encodeABI(),
    };

    const logs = await sendTx(tx);

    const _signature = logs.filter((log) => log.name === "OrganizationCreated").map((log) => log.data["_organization"]);
    console.log(_signature);
};

const testAddOrganizationUsers = async () => {
    const organization = await Organization.findOne({ where: { name: "NDMA" } });
    const addresses = parseToJSONObject(await User.findAll({
        where: { userKey: { [Op.in]: ["bob"] } },
        attributes: ["address"],
    })).map((user) => user.address);

    const tx = {
        from: publicKey,
        to: Organizations.options.address,
        gas: 2000000,
        data: Organizations.methods["addUsersToOrganization"](organization.signature, addresses).encodeABI(),
    };

    const logs = await sendTx(tx);

    logs.filter((log) => log.name === "OrganizationUserAdded").map((log) => {
        console.log(log.data["_organization"], log.data["_user"]);
    });
};

const testRemoveOrganizationUsers = async () => {
    const organization = await Organization.findOne({ where: { name: "IDRN" } });
    const addresses = parseToJSONObject(await User.findAll({
        where: { userKey: { [Op.in]: ["denish", "john"] } },
        attributes: ["address"],
    })).map((user) => user.address);

    const tx = {
        from: publicKey,
        to: Organizations.options.address,
        gas: 2000000,
        data: Organizations.methods["removeUsersFromOrganization"](organization.signature, addresses).encodeABI(),
    };

    const logs = await sendTx(tx);

    logs.filter((log) => log.name === "OrganizationUserRemoved").map((log) => {
        console.log(log.data["_organization"], log.data["_user"]);
    });
};

const testGetOrganization = async () => {

    const tx = {
        from: publicKey,
        to: Organizations.options.address,
        gas: 2000000,
        data: Organizations.methods["getOrganizations"]().encodeABI(),
    };

    const logs = await sendTx(tx);

    logs.filter((log) => log.name === "Op_OrganizationList").map((log) => {
        // console.log("Users:", log.data["_users"].filter((address) => web3.utils.toBN(address).toNumber() !== 0));
        console.log("Organizations:", log.data["_organizations"]);
    });
};

const testGetAllUsersOfOrganization = async () => {
    const organization = await Organization.findOne({ where: { name: "IDRN" } });

    const tx = {
        from: publicKey,
        to: Organizations.options.address,
        gas: 2000000,
        data: Organizations.methods["getOrganizationUsers"](organization.signature).encodeABI(),
    };

    const logs = await sendTx(tx);

    logs.filter((log) => log.name === "Op_OrganizationUsers").map((log) => {
        // console.log("Users:", log.data["_users"].filter((address) => web3.utils.toBN(address).toNumber() !== 0));
        console.log("Users:", log.data["_users"].filter((address) => address !== "0x0000000000000000000000000000000000000000"));
    });
};

const testDeleteOrganization = async () => {
    const organization = await Organization.findOne({ where: { name: "IDRN" } });

    const tx = {
        from: publicKey,
        to: Organizations.options.address,
        gas: 2000000,
        data: Organizations.methods["deleteOrganization"](organization.signature).encodeABI(),
    };

    const logs = await sendTx(tx);

    logs.filter((log) => log.name === "OrganizationDeleted").map((log) => {
        console.log(log.data["_organization"], log.data["_success"]);
    });
};

const getAllOrganizationsWithUsers = async () => {
    const tx = {
        from: publicKey,
        to: Organizations.options.address,
        gas: 2000000,
        data: Organizations.methods["getOrganizationsWithUsers"]().encodeABI(),
    };

    const logs = await sendTx(tx);

    logs.filter((log) => log.name === "Op_OrganizationWithUsers").map((log) => {
        console.log(log.data["_organization"].signature, log.data["_organization"]["users"].filter((address) => address !== "0x0000000000000000000000000000000000000000"));
    });
};


exports.test = async () => {
    await testDeleteOrganization();
    await testAddOrganization();
    // await testAddOrganizationUsers();
    // await testGetAllUsersOfOrganization();
    // await testRemoveOrganizationUsers();
    await testGetOrganization();
    // await getAllOrganizationsWithUsers();
};

exports.metadata = {
    name: "organizations",
};