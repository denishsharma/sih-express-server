const { Template, Record } = require("../../app/sequelize");
const hash = require("object-hash");

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
                position: 3,
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

    const record = await Record.create({
        templateId: createRequest.templateId,
        signature: hash([fieldSignatures, fieldValues, new Date().getTime()]),
        raw: recordRaw,
    });

    const template = await Template.findOne({ where: { id: createRequest.templateId } });

    const metadata = [
        record.signature,
        template.id,
        template.version,
        false,
    ];

    console.log(metadata, fieldValues, fieldSignatures);
};

const testDeleteRecord = async () => {
    const count = await Record.destroy({ where: { templateId: "7d85a1dd-7199-425c-8499-3458f810933e" } });
    console.log(`deleted row(s): ${count}`);
}

const testUpdateRecord = async () => {
    
}
const someTest = async () => {
    console.log("someTest");
};

exports.test = async () => {
    // await testCreateRecord();
    // await testDeleteRecord(); 
    process.exit();
};

exports.metadata = {
    name: "templateRecord",
};