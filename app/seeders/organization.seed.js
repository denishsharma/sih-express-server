const { Organization } = require("../sequelize");
const { Organizations } = require("../contracts");
const { processEventLogs } = require("../utils/web3.utils");
const { sendMethodTransaction } = require("../utils/wallet.utils");
const { decodeToken } = require("../utils/jwt.utils");
const { unlockUserAddress } = require("../utils/secure.utils");
const hash = require("object-hash");

exports.seed = async () => {
    const ndrfSignature = hash.MD5(["NDRF"]);
    const ndmaSignature = hash.MD5(["NDMA"]);
    const eocSignature = hash.MD5(["EOC"]);

    await Organization.bulkCreate([
        {
            name: "NDRF",
            description: "NDRF is a national disaster relief force that provides assistance to victims of natural disasters.",
            signature: ndrfSignature,
        },
        {
            name: "NDMA",
            description: "NDMA is a national disaster management authority that provides assistance to victims of natural disasters.",
            signature: ndmaSignature,
        },
        {
            name: "EOC",
            description: "EOC is a national emergency operation center that provides assistance to victims of natural disasters.",
            signature: eocSignature,
        },
    ]);

    await sendMethodTransaction(Organizations, process.env.SEED_ACCOUNT_ADDRESS, process.env.SEED_ACCOUNT_PRIVATE, {}, "addOrganization", ndrfSignature);
    await sendMethodTransaction(Organizations, process.env.SEED_ACCOUNT_ADDRESS, process.env.SEED_ACCOUNT_PRIVATE, {}, "addOrganization", ndmaSignature);
    await sendMethodTransaction(Organizations, process.env.SEED_ACCOUNT_ADDRESS, process.env.SEED_ACCOUNT_PRIVATE, {}, "addOrganization", eocSignature);

};