const appTests = {};
const unitTests = {};
const contractTests = {};

// Import App Tests
const generalTemplate = require("./app/generalTemplate.test");

// Import Unit Tests
const web3MetaTransactionCall = require("./unit/web3MetaTransactionCall.test");

const args = process.argv.slice(2);
const state = {
    testAppSingle: args[0] === "test-app-single" || false,
    testUnitSingle: args[0] === "test-unit-single" || false,
};

const addToTest = (test, list) => {
    const metadata = test.metadata;
    list[metadata.name] = test.test;
};

// Add to Tests
addToTest(generalTemplate, appTests);
addToTest(web3MetaTransactionCall, unitTests);

const testUnitSingle = async (testName) => {
    await unitTests[testName]();
};

const testAppSingle = async (testName) => {
    await appTests[testName]();
};

(async (state) => {
    if (state.testUnitSingle) {
        await testUnitSingle(args[1]);
    } else if (state.testAppSingle) {
        await testAppSingle(args[1]);
    }
})(state);