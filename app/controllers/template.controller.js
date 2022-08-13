const { Template, TemplateField, TemplateFieldOption, Sequelize } = require("../sequelize");
const { isRequestEmpty } = require("../utils/requests.utils");
const { parseToJSONObject } = require("../utils/general.utils");
const hash = require("object-hash");
const Op = Sequelize.Op;

const updateField = async (fields, template) => {
    const fieldsToDelete = fields["delete"];
    const fieldsToUpdate = fields["update"];
    const fieldsToCreate = fields["create"];

    if (fieldsToDelete) {
        for (const fieldSig of fieldsToDelete) {
            await template.deleteField(fieldSig);
        }
    }

    if (fieldsToUpdate) {
        for (const [sig, field] of Object.entries(fieldsToUpdate)) {
            if (field.options) {
                const fieldOptions = field.options;
                delete field.options;

                const optionsToDelete = fieldOptions["delete"];
                const optionsToUpdate = fieldOptions["update"];
                const optionsToCreate = fieldOptions["create"];

                const currentField = await template.getField(sig);

                if (optionsToDelete) {
                    for (const optionValue of optionsToDelete) {
                        await currentField.deleteOption(optionValue);
                    }
                }

                if (optionsToUpdate) {
                    for (const [optionValue, option] of Object.entries(optionsToUpdate)) {
                        await currentField.updateOption(optionValue, option);
                    }
                }

                if (optionsToCreate) {
                    for (const option of optionsToCreate) {
                        await currentField.createOption(option);
                    }
                }
            }

            await template.updateField(sig, field);
        }
    }

    if (fieldsToCreate) {
        for (const field of fieldsToCreate) {
            await template.createField(field);
        }
    }
};

exports.getTemplate = async (req, res) => {
    const { templateId } = req.params;

    const template = await Template.findOne({
        where: { id: templateId },
        include: [
            {
                model: TemplateField,
                as: "fields",
                include: [{ model: TemplateFieldOption, as: "options" }],
            },
        ],
        order: [
            ["fields", "position", "ASC"],
            ["fields", "options", "position", "ASC"],
        ],
    });

    const templateVersions = await Template.findAll({
        where: { versionOf: templateId },
        attributes: ["id", "version", "name", "description"],
        order: [["version", "DESC"]],
    });

    if (!template) {
        res.status(404).json({ message: "Template not found." });
        return;
    }

    res.json({
        data: {
            template: parseToJSONObject(template),
            versions: parseToJSONObject(templateVersions),
        },
        message: "Template found successfully.",
    });

};

exports.getVersion = async (req, res) => {
    const { templateId, versionNumber } = req.params;

    if (!versionNumber) {
        const templateVersions = await Template.findAll({
            where: { versionOf: templateId },
            attributes: ["id", "version", "name", "description", "usage"],
            order: [["version", "DESC"]],
        });

        res.json({
            data: {
                versions: parseToJSONObject(templateVersions),
            },
            message: "Template versions found successfully.",
        });
        return;
    }

    const template = await Template.findOne({
        where: { versionOf: templateId, version: versionNumber },
        include: [
            {
                model: TemplateField,
                as: "fields",
                include: [{ model: TemplateFieldOption, as: "options" }],
            },
        ],
        order: [
            ["fields", "position", "ASC"],
            ["fields", "options", "position", "ASC"],
        ],
    });

    res.json({
        data: {
            template: parseToJSONObject(template),
        },
        message: "Template found successfully.",
    });
};

exports.createTemplate = async (req, res) => {
    if (isRequestEmpty(req)) {
        res.status(400).json({ message: "Request body is empty." });
        return;
    }

    const { name, description, fields, versionOf } = req.body;
    let version = 0;

    if (versionOf) {
        const templateLatestVersion = await Template.max("version", { where: { versionOf } });
        version = templateLatestVersion + 1;
    }

    let fieldPosition = 0;
    for (const field of fields) {
        if (!field.position) {
            field.position = fieldPosition;
            fieldPosition++;
        }

        if (field.dataType === "option") {
            let optionPosition = 0;

            if (!field.options) {
                field.options = [];
            }

            field.options = field.options.map(option => {
                return {
                    ...option,
                    position: optionPosition++,
                    value: hash.MD5([option.value, new Date().getTime()]),
                    usage: 0,
                };
            });
        }

        if (!field.signature) {
            field.signature = hash.MD5([field, new Date().getTime()]);
        }
    }

    const template = await Template.create(
        {
            name,
            description,
            version,
            versionOf,
            fields,
        },
        {
            include: [
                {
                    model: TemplateField,
                    as: "fields",
                    include: [{ model: TemplateFieldOption, as: "options" }],
                },
            ],
        },
    );

    res.json({
        data: {
            template,
        },
        message: "Template created successfully.",
    });
};

exports.updateTemplate = async (req, res) => {
    if (isRequestEmpty(req)) {
        res.status(400).json({ message: "Request body is empty." });
        return;
    }

    const { templates } = req.body;

    if (templates) {
        for (const [templateId, values] of Object.entries(templates)) {
            const template = await Template.findOne({ where: { id: templateId } });

            if (!template) {
                res.status(404).json({ message: "Template not found." });
                return;
            }

            if (values.fields) {
                await updateField(values.fields, template);
                delete values.fields;
            }

            template.set(values);
            await template.save();
        }
    }

    const _templates = await Template.findAll({
        where: { id: { [Op.in]: Object.keys(templates) } },
        include: [
            {
                model: TemplateField,
                as: "fields",
                include: [{ model: TemplateFieldOption, as: "options" }],
            },
        ],
        order: [
            ["fields", "position", "ASC"],
            ["fields", "options", "position", "ASC"],
        ],
    });

    res.json({
        data: {
            templates: _templates,
        },
        message: "Templates updated successfully.",
    });
};

exports.deleteTemplate = async (req, res) => {
    if (isRequestEmpty(req)) {
        res.status(400).json({ message: "Request body is empty." });
        return;
    }

    const { templateId } = req.body;

    const template = await Template.findOne({ where: { id: templateId } });

    if (await template.hasVersions()) {
        await template.deleteVersions();
    }

    await Template.destroy({ where: { id: templateId } });

    res.json({
        message: "Template deleted successfully.",
    });
};

exports.createField = async (req, res) => {
    if (isRequestEmpty(req)) {
        res.status(400).json({ message: "Request body is empty." });
        return;
    }

    const { templateId } = req.params;
    const { fields } = req.body;
    const template = await Template.findOne({ where: { id: templateId } });

    if (!template) {
        res.status(404).json({ message: "Template not found." });
        return;
    }

    for (const field of fields) {
        await template.createField(field);
    }

    const templateFields = await template.getFields();
    res.json({
        data: {
            fields: parseToJSONObject(templateFields),
        },
        message: "Fields created successfully.",
    });
};

exports.updateField = async (req, res) => {
    if (isRequestEmpty(req)) {
        res.status(400).json({ message: "Request body is empty." });
        return;
    }

    const { templateId } = req.params;
    const { fields } = req.body;
    const template = await Template.findOne({ where: { id: templateId } });

    if (!template) {
        res.status(404).json({ message: "Template not found." });
        return;
    }

    await updateField(fields, template);

    const templateFields = await template.getFields();
    res.json({
        data: {
            fields: parseToJSONObject(templateFields),
        },
        message: "Fields updated successfully.",
    });
};