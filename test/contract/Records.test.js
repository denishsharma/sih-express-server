const { Records } = require("../../app/contracts");
const { web3 } = require("../../app/utils/web3.utils");
const { createMetaTransaction, sendMetaTransaction } = require("../../app/utils/wallet.utils");

const publicKey = "0xaE296118b0E9fd123a024AB8a44c623b9f891781";
const privateKey = "193af6a5644a0e55d9024dc65c7a1e3e59a06b3d3ecfae9e232c51f395c508db";

const processEventLogs = async (logs) => {
    const jsonInterfaces = Records._jsonInterface.filter((item) => item.type === "event");

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


const sendTx = async (methodName, ...params) => {
    const signedTransaction = await createMetaTransaction(Records, publicKey, privateKey, {}, methodName, ...params);
    const txReceipt = await sendMetaTransaction(signedTransaction);

    return await processEventLogs(txReceipt.logs);
};

const testCreateRecord = async () => {
    const input = {
        signature: "IDRNRecord2",
        metadata: ["templateId", "templateVersion", "something"],
        values: ["value1", "value2", "value3"],
        fields: ["field1", "field2", "field3"],
    };

    const logs = await sendTx("createRecord", input.signature, input.metadata, input.values, input.fields);

    logs.filter((log) => log.name === "LogRecord").map((log) => {
        console.log(log.data);
    });
};


const testUpdateRecord = async () => {
    const input = {
        signature: "IDRNRecord1",
        values: ["New value1", "New value3"],
        fields: ["field1", "field3"],
    };

    const logs = await sendTx("updateRecord", input.signature, input.values, input.fields);

    logs.filter((log) => log.name === "LogRecord").map((log) => {
        console.log(log.data);
    });
};

const testReadRecord = async () => {
    const input = {
        signature: "IDRNRecord1",
    };

    const logs = await sendTx("readRecord", input.signature);

    logs.filter((log) => log.name === "LogRecord").map((log) => {
        console.log(log.data);
    });
};

const testdeleteRecord = async () => {
    const input = {
        signature: "IDRNRecord1",
    };

    const logs = await sendTx("deleteRecord", input.signature);

    logs.filter((log) => log.name === "LogRecord").map((log) => {
        console.log(log.data);
    });
};


exports.test = async () => {
    // await testCreateRecord();
    // await testReadRecord();
    // await testUpdateRecord();
    // await testdeleteRecord();
    // await testReadRecord();
};

exports.metadata = {
    name: "records",
};