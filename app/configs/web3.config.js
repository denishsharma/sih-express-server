require("dotenv").config();
const Web3 = require("web3");

const config = {
    transaction: {
        gas: {
            transfer: Web3.utils.toWei("0.00021", "gwei"),
            contract: Web3.utils.toWei("0.015", "gwei"),
            high: Web3.utils.toWei("0.006", "gwei"),
            max: Web3.utils.toWei("0.03", "gwei"),
        },
    },
    networks: {
        development: {
            protocol: process.env.DEV_NETWORK_PROTOCOL || "ws",
            host: process.env.DEV_NETWORK_HOST || "localhost",
            port: process.env.DEV_NETWORK_PORT || 7545,
            network_id: process.env.DEV_NETWORK_ID || "*",
        },
    },
};

module.exports = config;