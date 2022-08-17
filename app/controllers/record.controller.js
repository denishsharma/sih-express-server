const { Record, Template } = require("../sequelize");
const { Records } = require("../contracts");
const { parseToJSONObject } = require("../utils/general.utils");
const { createMetaTransaction, sendMetaTransaction, processEventLogs } = require("../utils/wallet.utils");
const { isRequestEmpty } = require("../utils/requests.utils");
const { decodeToken } = require("../utils/jwt.utils");
const { unlockUserAddress } = require("../utils/secure.utils");
const hash = require("object-hash");

exports.create = async (req, res) => {
    if (isRequestEmpty(req)) {
        res.status(400).json({
            message: "Request body is empty.",
        });
        return;
    }

    const { templateId, fields, userToken } = req.body;

    console.log(templateId, fields, userToken);

    const template = await Template.findOne({ where: { id: templateId } });

    if (!template) {
        res.status(400).json({
            message: "Template not found.",
        });
        return;
    }

    console.log(template);

    const decoded = decodeToken(userToken);
    const unlockedUser = unlockUserAddress(decoded);

    const sortedFields = fields.sort((a, b) => a.position - b.position);
    const fieldSignatures = sortedFields.map(field => field.signature);
    const fieldValues = sortedFields.map(field => field.value);

    const recordRaw = {
        templateId,
        fields: sortedFields,
    };

    const signature = hash([fieldSignatures, fieldValues, new Date().getTime()]);

    const record = parseToJSONObject(await Record.create({
        templateId,
        signature,
        raw: recordRaw,
    }));

    if (!record) {
        res.status(400).json({
            message: "Record not created.",
        });
        return;
    }

    const metadata = [
        template.id,
        template.version,
        signature,
    ];

    const signedTransaction = await createMetaTransaction(Records, unlockedUser.address, unlockedUser.secret, {}, "createRecord", signature, metadata, fieldValues, fieldSignatures);
    const txReceipt = await sendMetaTransaction(signedTransaction);
    const logs = await processEventLogs(Records, txReceipt.logs);

    const recordFlags = logs.filter(log => log.name === "LogRecord").map(log => log.data["_itemFlags"]);

    res.json({
        data: {
            record,
            flags: recordFlags[0],
        },
        message: "Record created successfully.",
    });
};


exports.read = async (req, res) => {
    if (isRequestEmpty(req)) {
        res.status(400).json({
            message: "Request body is empty.",
        });
        return;
    }

    const { templateId } = req.body;

    console.log(templateId);

    const template = await Template.findOne({ where: { id: templateId } });

    if (!template) {
        res.status(400).json({
            message: "Template not found.",
        });
        return;
    }

    console.log(template);

    const decoded = decodeToken(userToken);
    const unlockedUser = unlockUserAddress(decoded);

    const sortedFields = fields.sort((a, b) => a.position - b.position);
    const fieldSignatures = sortedFields.map(field => field.signature);
    const fieldValues = sortedFields.map(field => field.value);


    const signature = hash([fieldSignatures, fieldValues, new Date().getTime()]);

    const record = parseToJSONObject(await Record.read({
        templateId,
        signature,
        raw: recordRaw,
    }));

    if (!record) {
        res.status(400).json({
            message: "Record not found.",
        });
        return;
    }


    const signedTransaction = await createMetaTransaction(Records, unlockedUser.address, unlockedUser.secret, {}, "createRecord", signature, metadata, fieldValues, fieldSignatures);
    const txReceipt = await sendMetaTransaction(signedTransaction);
    const logs = await processEventLogs(Records, txReceipt.logs);

    const recordFlags = logs.filter(log => log.name === "LogRecord").map(log => log.data["_itemFlags"]);

    res.json({
        data: {
            record,
            flags: recordFlags[0],
        },
        message: "Record read successfully.",
    });

};


exports.update = async (req, res) => {
    if (isRequestEmpty(req)) {
        res.status(400).json({
            message: "Request body is empty.",
        });
        return;
    }

    const { templateId, fields, userToken } = req.body;

    console.log(templateId, fields, userToken);

    const template = await Template.findOne({ where: { id: templateId } });

    if (!template) {
        res.status(400).json({
            message: "Template not found.",
        });
        return;
    }

    console.log(template);

    const decoded = decodeToken(userToken);
    const unlockedUser = unlockUserAddress(decoded);

    const sortedFields = fields.sort((a, b) => a.position - b.position);
    const fieldSignatures = sortedFields.map(field => field.signature);
    const fieldValues = sortedFields.map(field => field.value);

    const recordRaw = {
        templateId,
        fields: sortedFields,
    };

    const signature = hash([fieldSignatures, fieldValues, new Date().getTime()]);

    const record = parseToJSONObject(await Record.update({
        signature,
        raw: recordRaw,
    }));

    // if (record) {
    //     res.status(400).json({
    //         message: "Record not updated.",
    //     });
    //     return;
    // }

    const metadata = [
        template.id,
        template.version,
        signature,
    ];

    const signedTransaction = await createMetaTransaction(Records, unlockedUser.address, unlockedUser.secret, {}, "createRecord", signature, metadata, fieldValues, fieldSignatures);
    const txReceipt = await sendMetaTransaction(signedTransaction);
    const logs = await processEventLogs(Records, txReceipt.logs);

    const recordFlags = logs.filter(log => log.name === "LogRecord").map(log => log.data["_itemFlags"]);

    res.json({
        data: {
            record,
            flags: recordFlags[0],
        },
        message: "Record updated successfully.",
    });


};

exports.delete = async (req, res) => {
    if (isRequestEmpty(req)) {
        res.status(400).json({
            message: "Request body is empty.",
        });
        return;
    }

    const { templateId } = req.body;

    console.log(templateId);

    const template = await Template.findOne({ where: { id: templateId } });

    if (!template) {
        res.status(400).json({
            message: "Template not found.",
        });
        return;
    }

    console.log(template);

    const decoded = decodeToken(userToken);
    const unlockedUser = unlockUserAddress(decoded);

    const sortedFields = fields.sort((a, b) => a.position - b.position);
    const fieldSignatures = sortedFields.map(field => field.signature);
    const fieldValues = sortedFields.map(field => field.value);

    const recordRaw = {
        templateId,
        fields: sortedFields,
    };

    const signature = hash([fieldSignatures, fieldValues, new Date().getTime()]);

    const record = parseToJSONObject(await Record.delete({
        templateId,
        signature,
        raw: recordRaw,
    }));

    if (record) {
        res.status(400).json({
            message: "Record deleted.",
        });
        return;
    }

    const signedTransaction = await createMetaTransaction(Records, unlockedUser.address, unlockedUser.secret, {}, "createRecord", signature, metadata, fieldValues, fieldSignatures);
    const txReceipt = await sendMetaTransaction(signedTransaction);
    const logs = await processEventLogs(Records, txReceipt.logs);

    const recordFlags = logs.filter(log => log.name === "LogRecord").map(log => log.data["_itemFlags"]);

    res.json({
        data: {
            record,
            flags: recordFlags[1],
        },
        message: "Record deleted successfully.",
    });

};