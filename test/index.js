const appTests = {};
const unitTests = {};
const contractTests = {};

// Import App Tests
const generalTemplate = require("./app/generalTemplate.test");
const templateRecord = require("./app/templateRecord.test");

// Import Contract Tests
const recordsContract = require("./contract/records.test");
const organizationsContract = require("./contract/Organizations.test");
const tasksContract = require("./contract/tasks.test");
const teamsContract = require("./contract/teams.test");

// Import Unit Tests
const web3MetaTransactionCall = require("./unit/web3MetaTransactionCall.test");

const args = process.argv.slice(2);
const state = {
    testAppSingle: args[0] === "test-app-single" || false,
    testContractSingle: args[0] === "test-contract-single" || false,
    testUnitSingle: args[0] === "test-unit-single" || false,
};

const addToTest = (test, list) => {
    const metadata = test.metadata;
    list[metadata.name] = test.test;
};

// Add to Tests
addToTest(generalTemplate, appTests);
addToTest(templateRecord, appTests);
addToTest(recordsContract, contractTests);
addToTest(organizationsContract, contractTests);
addToTest(tasksContract, contractTests);
addToTest(teamsContract, contractTests);
addToTest(web3MetaTransactionCall, unitTests);

const testUnitSingle = async (testName) => {
    await unitTests[testName]();
};

const testContractSingle = async (testName) => {
    await contractTests[testName]();
};

const testAppSingle = async (testName) => {
    await appTests[testName]();
};

(async (state) => {
    if (state.testUnitSingle) {
        await testUnitSingle(args[1]);
    } else if (state.testContractSingle) {
        await testContractSingle(args[1]);
    } else if (state.testAppSingle) {
        await testAppSingle(args[1]);
    }
})(state);