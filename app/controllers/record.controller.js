const { Record, Template } = require("../sequelize");
const { Records } = require("../contracts");
const { parseToJSONObject } = require("../utils/general.utils");
const { createMetaTransaction, sendMetaTransaction, processEventLogs } = require("../utils/wallet.utils");
const { isRequestEmpty } = require("../utils/requests.utils");
const { decodeToken } = require("../utils/jwt.utils");
const { unlockUserAddress } = require("../utils/secure.utils");
const hash = require("object-hash");

const getFieldsExtracted = (fields) => {
    const sortedFields = fields.sort((a, b) => a.position - b.position);
    const fieldSignatures = sortedFields.map(field => field.signature);
    const fieldValues = sortedFields.map(field => field.value);

    return {
        sortedFields,
        fieldSignatures,
        fieldValues,
    };
};

exports.create = async (req, res) => {
    if (isRequestEmpty(req)) {
        res.status(400).json({
            message: "Request body is empty.",
        });
        return;
    }

    const { templateId, fields, userToken } = req.body;

    const template = await Template.findOne({ where: { id: templateId } });

    if (!template) {
        res.status(400).json({
            message: "Template not found.",
        });
        return;
    }

    const decoded = decodeToken(userToken);
    const unlockedUser = unlockUserAddress(decoded);

    const { sortedFields, fieldSignatures, fieldValues } = getFieldsExtracted(fields);

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
    const { recordId } = req.params;
    const { userToken } = req.body;

    const decoded = decodeToken(userToken);
    const unlockedUser = unlockUserAddress(decoded);

    const record = await Record.findOne({ where: { signature: recordId } });

    if (!record) {
        res.status(400).json({
            message: "Record not found.",
        });
        return;
    }

    const signedTransaction = await createMetaTransaction(Records, unlockedUser.address, unlockedUser.secret, {}, "readRecord", record.signature);
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

    const { recordId } = req.params;
    const { fields, userToken } = req.body;

    const decoded = decodeToken(userToken);
    const unlockedUser = unlockUserAddress(decoded);

    const record = await Record.findOne({ where: { signature: recordId } });

    if (!record) {
        res.status(400).json({
            message: "Record not found.",
        });
        return;
    }

    const fieldsToUpdate = record.raw.fields.map(field => {
        const fieldToUpdateFrom = fields.find(fieldToUpdateFrom => fieldToUpdateFrom.signature === field.signature);
        if (fieldToUpdateFrom) {
            return {
                ...field,
                signature: field.signature,
                value: fieldToUpdateFrom.value,
            };
        }
        return field;
    });

    record.raw = {
        ...record.raw,
        fields: fieldsToUpdate,
    };
    await record.save();

    const {
        fieldSignatures,
        fieldValues,
    } = getFieldsExtracted(fieldsToUpdate.filter(field => fields.find(fieldToUpdateFrom => fieldToUpdateFrom.signature === field.signature)));

    const signedTransaction = await createMetaTransaction(Records, unlockedUser.address, unlockedUser.secret, {}, "updateRecord", record.signature, fieldValues, fieldSignatures);
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
    const { recordId } = req.params;
    const { userToken } = req.body;

    const decoded = decodeToken(userToken);
    const unlockedUser = unlockUserAddress(decoded);

    const record = await Record.findOne({ where: { signature: recordId } });

    if (!record) {
        res.status(400).json({
            message: "Record not found.",
        });
        return;
    }

    await record.destroy();

    const signedTransaction = await createMetaTransaction(Records, unlockedUser.address, unlockedUser.secret, {}, "deleteRecord", record.signature);
    const txReceipt = await sendMetaTransaction(signedTransaction);
    const logs = await processEventLogs(Records, txReceipt.logs);

    const recordFlags = logs.filter(log => log.name === "LogRecord").map(log => log.data["_itemFlags"]);

    res.json({
        data: {
            record,
            flags: recordFlags[0],
        },
        message: "Record deleted successfully.",
    });
};