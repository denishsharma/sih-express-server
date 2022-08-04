const { config } = require("../configs/contracts.config");
const { web3 } = require("./web3.utils");
const { Contract } = require("../sequelize");
const fs = require("fs");
const path = require("path");

let migrationMeta = {};
if (fs.existsSync(path.join(config.migrationsPath, "contracts.migration.meta.json"))) {
    migrationMeta = require("../contracts/migrations/contracts.migration.meta.json");
} else {
    migrationMeta = JSON.parse(fs.readFileSync(path.join(config.migrationsPath, "contracts.migration.meta.template.json"), "utf8"));
}


exports.deployContract = async (contractName, args, from, gas) => {
    let metadata = JSON.parse(fs.readFileSync(path.resolve(config.artifactsPath, `${contractName}.json`), "utf8"));
    const accounts = await web3.eth.getAccounts();

    const contract = new web3.eth.Contract(metadata.abi);
    const contractCreation = contract.deploy({
        data: metadata.bytecode,
        arguments: args,
    });

    const contractInstance = await contractCreation.send({
        from: from || accounts[0],
        gas: gas || 6721975,
    });

    const networkId = await web3.eth.net.getId();

    !("deployedContractAddress" in metadata) && (metadata.deployedContractAddress = {});
    metadata.deployedContractAddress[networkId] = contractInstance.options.address;

    await Contract.upsert({
        name: metadata.contractName,
        contractKey: metadata.contractName.toLowerCase(),
        address: contractInstance.options.address,
        networkId,
        deployer: from || accounts[0],
    });

    const deployedContract = `const metadata = ${JSON.stringify(metadata, null, 0)}; module.exports = (web3, networkId) => { const contract = new web3.eth.Contract(metadata.abi, metadata.deployedContractAddress[networkId], { data: metadata.bytecode }); contract._contractName = metadata.contractName; return contract; };`;
    fs.writeFileSync(path.join(config.deployedPath, `${contractName}.deployed.js`), deployedContract);

    migrationMeta.contracts[metadata.contractName] = {
        name: metadata.contractName,
        include: migrationMeta.contracts[metadata.contractName] ? migrationMeta.contracts[metadata.contractName].include : true,
        compiled: true,
        deployed: true,
        artifact: `./build/${metadata.contractName}.json`,
        deployedContract: `./deployed/${metadata.contractName}.deployed.js`,
        address: contractInstance.options.address,
        networkId,
    };

    fs.writeFileSync(path.join(config.migrationsPath, "contracts.migration.meta.json"), JSON.stringify(migrationMeta, null, 4));

    return contractInstance;
};

exports.loadContract = async (abi, address) => {
    return new web3.eth.Contract(abi, address);
};

exports.getEvents = (contract, subscriptionList) => {
    const eventsInterface = contract._jsonInterface.filter((item) => item.type === "event");
    const eventObjects = {};

    !("contracts" in subscriptionList) && (subscriptionList.contracts = {});
    !(contract._contractName in subscriptionList.contracts) && (subscriptionList.contracts[contract._contractName] = {});

    for (let eventInterface in eventsInterface) {
        eventInterface = eventsInterface[eventInterface];
        const eventObject = {
            name: eventInterface.name,
            signature: eventInterface.signature,
            inputs: eventInterface.inputs,
        };

        eventObject.subscribe = async (options, handler) => {
            try {
                options = Object.assign({}, options, {
                    address: contract.options.address,
                    topics: [eventObject.signature],
                });

                eventObject.subscription = web3.eth.subscribe("logs", options, (error, result) => {
                    if (!error) {
                        const eventResult = web3.eth.abi.decodeLog(eventObject.inputs, result.data, result.topics.slice(1));
                        typeof handler === "function" && handler(error, eventResult, result);
                    } else {
                        typeof handler === "function" && handler(error, null, null);
                    }
                });

                subscriptionList.contracts[contract._contractName][eventObject.name] = eventObject;

                console.log(`Subscribed to event '${eventObject.name}' of contract '${contract._contractName}'`);
            } catch (error) {
                console.log(error);
            }
        };

        eventObject.getPastEvents = (options, handler) => {
            !("dataFilter" in options) && (options.dataFilter = {});

            contract.getPastEvents(eventObject.name, options, (error, result) => {
                try {
                    if (!error) {
                        let eventResult = result;
                        if (options.dataFilter && Object.keys(options.dataFilter).length > 0) {
                            eventResult = result.filter((item) => {
                                const returnData = item.returnValues;
                                const dataFilterFlag = {};
                                for (let dataFilterKey in options.dataFilter) {
                                    dataFilterFlag[dataFilterKey] = options.dataFilter[dataFilterKey] === returnData[dataFilterKey];
                                }

                                return Object.values(dataFilterFlag).every(f => f === true);
                            });
                        }
                        typeof handler === "function" && handler(error, eventResult);
                    } else {
                        typeof handler === "function" && handler(error, null);
                    }
                } catch (error) {
                    console.log(error);
                }
            });
        };

        eventObject.unsubscribe = async () => {
            await subscriptionList.contracts[contract._contractName][eventObject.name].subscription.unsubscribe(() => {
                subscriptionList.contracts[contract._contractName][eventObject.name].subscription = null;
                console.log(`Unsubscribed from event '${eventObject.name}' of contract '${contract._contractName}'`);
            });
        };

        eventObjects[eventObject.name] = eventObject;
    }

    return eventObjects;
};