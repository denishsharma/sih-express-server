require("dotenv").config();

const Web3 = require("web3");
const protocol = process.env.DEV_NETWORK_PROTOCOL || "ws";
const networkProvider = `${protocol}://${process.env.DEV_NETWORK_HOST || "localhost"}:${process.env.DEV_NETWORK_PORT || "7545"}`;

const web3 = new Web3();
let provider;

if (protocol === "http") {
    provider = new Web3.providers.HttpProvider(networkProvider);
} else if (protocol === "ws") {
    provider = new Web3.providers.WebsocketProvider(networkProvider);
}

web3.setProvider(provider);
console.log("Web3 initialized from network provider");

module.exports = {
    web3,
};
