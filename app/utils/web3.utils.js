require("dotenv").config();

const Web3 = require("web3");
const contract = require("@truffle/contract");
let networkProvider = `${process.env.DEV_NETWORK_PROTOCOL}://${process.env.DEV_NETWORK_HOST}:${process.env.DEV_NETWORK_PORT}`;

let web3;
if (typeof web3 !== "undefined") {
    web3 = new Web3(web3.currentProvider);
    console.log("Web3 initialized from current provider");
} else {
    let web3Provider = new Web3.providers.HttpProvider(networkProvider);
    web3 = new Web3(web3Provider);
    console.log("Web3 initialized from network provider");
}

module.exports = {
    web3,
    contract
}
