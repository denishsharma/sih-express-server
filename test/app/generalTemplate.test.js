const { Template, TemplateField } = require("../../app/sequelize");
const bcrypt = require("bcrypt");

const templateStructure = {
    id: "",
    name: "",
    description: "",
    version: "",
    fields: {
        fieldSignature: {
            id: "",
            name: "",
            dataType: "",
            position: 0,
            isRequired: false,
            isFixed: false,
        },
    },
};

const seedTemplates = async () => {
    const templateAttributes = {
        name: "Template 1",
        description: "Template 1 Description",
        version: "1.0.0",
    };

    const template = await Template.create(templateAttributes);

    const templateFieldAttributes = [
        {
            templateId: template.id,
            signature: bcrypt.hashSync("field1", 10),
            name: "field1",
            dataType: "string",
            position: 1,
            isRequired: true,
            isFixed: true,
        },
        {
            templateId: template.id,
            signature: bcrypt.hashSync("field2", 10),
            name: "field2",
            dataType: "string",
            position: 2,
            isRequired: true,
            isFixed: true,
        },
        {
            templateId: template.id,
            signature: bcrypt.hashSync("field3", 10),
            name: "field3",
            dataType: "string",
            position: 3,
            isRequired: true,
            isFixed: true,
        },
    ];

    for (const templateFieldAttribute of templateFieldAttributes) {
        await TemplateField.create(templateFieldAttribute);
    }
};

const someTest = async () => {
    // Uncomment this when running test for first time
    // await seedTemplates();

    const templates = await Template.findAll({
        include: [{ model: TemplateField }],
    });

    console.log(templates);
};

exports.test = async () => {
    await someTest();

    process.exit();
};

exports.metadata = {
    name: "generalTemplate",
};