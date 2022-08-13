const { Template, TemplateField, TemplateFieldOption } = require("../sequelize");
const { isRequestEmpty } = require("../utils/requests.utils");
const { parseToJSONObject, fieldOptionCheckDefaults } = require("../utils/general.utils");
const hash = require("object-hash");

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

    console.log(template.toJSON());

    res.json({
        data: {
            template: parseToJSONObject(template),
            // versions: parseToJSONObject(templateVersions),
        },
        message: "Template found successfully.",
    });

};

exports.getVersion = async (req, res) => {
    const { versionNumber } = req.params;

    if (!versionNumber) {
        console.log("No version number provided.");
        return
    }

    console.log(versionNumber);
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