const appTests = {};
const unitTests = {};
const contractTests = {};

// Import Unit Tests
const web3MetaTransactionCall = require("./unit/web3MetaTransactionCall.test");

const args = process.argv.slice(2);
const state = {
    testUnitSingle: args[0] === "test-unit-single" || false,
};

const addToTest = (test, list) => {
    const metadata = test.metadata;
    list[metadata.name] = test.test;
};

// Add to Tests
addToTest(web3MetaTransactionCall, unitTests);

const testUnitSingle = async (testName) => {
    await unitTests[testName]();
};

(async (state) => {
    if (state.testUnitSingle) {
        await testUnitSingle(args[1]);
    }
})(state);