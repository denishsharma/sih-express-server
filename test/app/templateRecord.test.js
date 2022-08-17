const { Template, Record } = require("../../app/sequelize");
const hash = require("object-hash");
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

const testCreateRecordSolidity = async (signature, metadata, values, fields) => {
    const logs = await sendTx("createRecord", signature, metadata, values, fields);

    logs.filter((log) => log.name === "LogRecord").map((log) => {
        console.log(log.data);
    });
};

const testCreateRecord = async () => {
    const createRequest = {
        templateId: "a59b45e3-9826-4eae-a7d2-f937708b3d13",
        fields: [
            {
                signature: "8390620c0f28fadb9e4714fb242a57fa",
                value: "e3c46cbc8c314f9e26210d387cf69795",
                position: 2,
            },
            {
                signature: "743548bb8ecb533bc5fbb3696f59f53c",
                value: "some value 1",
                position: 3, template_fields,
            },
            {
                signature: "c34cfda4e0a4bf1fc6298299a392476f",
                value: "some value 2",
                position: 4,
            },
            {
                signature: "302face35618dc2a18d197fc9a452068",
                value: "some value 3",
                position: 0,
            },
            {
                signature: "ea5970ae205890b461ce6373b814f018",
                value: "e6629047493c6f7727abb6b0b6d15975",
                position: 1,
            },
        ],
    };

    const sortedFields = createRequest.fields.sort((a, b) => a.position - b.position);

    const fieldSignatures = sortedFields.map(({ signature }) => signature);
    const fieldValues = sortedFields.map(({ value }) => value);

    const recordRaw = {
        templateId: createRequest.templateId,
        fields: sortedFields,
        // fieldSignatures,
        // fieldValues,
    };

    // const record = await Record.create({
    //     templateId: createRequest.templateId,
    //     signature: hash([fieldSignatures, fieldValues, new Date().getTime()]),
    //     raw: recordRaw,
    // });

    // const template = await Template.findOne({ where: { id: createRequest.templateId } });

    const signature = hash([fieldSignatures, fieldValues, new Date().getTime()]);

    const metadata = [
        "template.id",
        "template.version",
        false,
    ];

    await testCreateRecordSolidity(signature, metadata, fieldValues, fieldSignatures);

    // console.log(metadata, fieldValues, fieldSignatures);
};

const testDeleteRecord = async () => {
    const count = await Record.destroy({ where: { templateId: "7d85a1dd-7199-425c-8499-3458f810933e" } });
    console.log(`deleted row(s): ${count}`);
};

const testUpdateRecord = async () => {

};
const someTest = async () => {
    console.log("someTest");
};

exports.test = async () => {
    await testCreateRecord();
    // await testDeleteRecord();
    process.exit();
};

exports.metadata = {
    name: "templateRecord",
};