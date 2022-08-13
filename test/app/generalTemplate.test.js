const { Template, TemplateField, TemplateFieldOption } = require("../../app/sequelize");
const { parseToJSONObject } = require("../../app/utils/general.utils");

/* How template works?
 * For every form, there is a template that is used to create the form.
 * The template is a JSON object that contains the fields and their options.
 *
 * There is always a root or base template, which you cannot delete or edit.
 * You can always create a new version of the root template with the additional fields.
 * You cannot delete or edit fields from root template, it will carry on to its versions.
 *
 * You can always edit the versions of the root template if not in use.
 * If template is in use then you cannot edit the fields of that template, but you can edit the unused options of the fields.
 */

// Test for creating a template with fields and versions... OK!
const testCreateTemplateWithFieldsAndVersions = async () => {
    const template = await Template.create(
        {
            name: "Template 2",
            description: "Template 2 Description",
            versions: [
                {
                    name: "Template 2 Version 1",
                    description: "Template 2 Version 1 Description",
                    fields: [
                        {
                            signature: "field1_sig",
                            name: "field1",
                            dataType: "string",
                            isRequired: true,
                            position: 0,
                        },
                    ],
                },
            ],
            fields: [
                {
                    signature: "field1_sig",
                    name: "field1",
                    dataType: "string",
                    isRequired: true,
                    position: 0,
                },
                {
                    signature: "field2_sig",
                    name: "field2",
                    dataType: "option",
                    isRequired: true,
                    position: 1,
                    options: [
                        {
                            name: "option1",
                            value: "option1",
                            isDefault: true,
                            position: 0,

                        },
                        {
                            name: "option2",
                            value: "option2",
                            default: false,
                            position: 1,
                        },
                    ],
                },
            ],
        },
        {
            include: [
                {
                    model: TemplateField,
                    as: "fields",
                    include: [
                        {
                            model: TemplateFieldOption,
                            as: "options",
                        },
                    ],
                },
                {
                    model: Template,
                    as: "versions",
                    include: [
                        {
                            model: TemplateField,
                            as: "fields",
                        },
                    ],
                },
            ],
        },
    );

    console.log(parseToJSONObject(template));
};

// Test for getting fields with options of a template... OK!
const testGetTemplateFieldsWithOptions = async () => {
    const templateFields = await TemplateField.findAll(
        {
            where: { templateId: "1d68fa8a-23ef-4bd4-b163-a89ac6df9dfc" },
            include: [{ model: TemplateFieldOption, as: "options" }],
            order: [
                ["position", "ASC"],
                ["options", "position", "ASC"],
            ],
        },
    );
    console.log(parseToJSONObject(templateFields));
};

// Test for getting template versions of a template... OK!
const testGetTemplateVersions = async () => {
    const templateVersions = await Template.findAll({
        where: { versionOf: "1d68fa8a-23ef-4bd4-b163-a89ac6df9dfc" },
        include: [
            {
                model: TemplateField,
                as: "fields",
                include: [{ model: TemplateFieldOption, as: "options" }],
            },
        ],
        order: [
            ["version", "DESC"],
            ["fields", "position", "ASC"],
            ["fields", "options", "position", "ASC"],
        ],
    });
    console.log(parseToJSONObject(templateVersions)[0]);
};

// Test for adding a new field to a template... OK!
const testAddNewFieldToTemplate = async () => {
    const template = await Template.findOne({ where: { id: "1d68fa8a-23ef-4bd4-b163-a89ac6df9dfc" } });
    const templateFields = await template.createField({
        templateId: template.id,
        signature: "field5_sig",
        name: "field5",
        dataType: "string",
        isRequired: true,
    });
    console.log(parseToJSONObject(templateFields));
};

// Test for deleting a field from a template... OK!
const testDeleteFieldFromTemplate = async () => {
    const template = await Template.findOne({ where: { id: "1d68fa8a-23ef-4bd4-b163-a89ac6df9dfc" } });
    const templateFields = await template.deleteField("field5_sig");

    console.log(parseToJSONObject(templateFields));
};

// Test for deleting a field from a template which is in use (it should not delete)... OK!
const testDeleteTemplateWithUsage = async () => {
    const template = await Template.findOne({ where: { id: "1d68fa8a-23ef-4bd4-b163-a89ac6df9dfc" } });
    await template.increaseUsage();

    const canDelete = await template.deleteField("field5_sig");

    if (!canDelete) {
        console.log("Test pass");
    }

    await template.decreaseUsage();
};

// Test for updating a field without options of a template... OK!
const testUpdateFieldOfTemplate = async () => {
    const template = await Template.findOne({ where: { id: "1d68fa8a-23ef-4bd4-b163-a89ac6df9dfc" } });
    const templateFields = await template.updateField("field5_sig", {
        name: "field5",
        dataType: "option",
        isRequired: true,
    });
    console.log(parseToJSONObject(templateFields));
};

// Test for getting options of a field... OK!
const testGetOptionsOfField = async () => {
    const template = await Template.findOne({ where: { id: "1d68fa8a-23ef-4bd4-b163-a89ac6df9dfc" } });
    const templateField = await template.getField("field2_sig");
    const options = await templateField.getOptions();
    console.log(options);
};

// Test for creating new option in field... OK!
const testCreateOptionInField = async () => {
    const template = await Template.findOne({ where: { id: "1d68fa8a-23ef-4bd4-b163-a89ac6df9dfc" } });
    const templateField = await template.getField("field2_sig");
    const options = await templateField.createOption({
        name: "option4",
        value: "option4",
    });
    console.log(parseToJSONObject(options));
};

// Test for deleting option in field... OK!
const testDeleteOptionInField = async () => {
    const template = await Template.findOne({ where: { id: "1d68fa8a-23ef-4bd4-b163-a89ac6df9dfc" } });
    const templateField = await template.getField("field2_sig");
    const options = await templateField.deleteOption("option2");
    console.log(parseToJSONObject(options));
};

exports.test = async () => {
    // await testCreateTemplateWithFieldsAndVersions(); //OK!
    // await testGetTemplateFieldsWithOptions(); //OK!
    // await testGetTemplateVersions(); //OK!

    // await testAddNewFieldToTemplate(); //OK!
    // await testDeleteFieldFromTemplate(); //OK!
    // await testDeleteTemplateWithUsage(); //OK!
    // await testUpdateFieldOfTemplate(); //OK!

    // await testGetOptionsOfField(); //OK!
    // await testCreateOptionInField(); //OK!
    // await testDeleteOptionInField(); //OK!

    process.exit();
};

exports.metadata = {
    name: "generalTemplate",
};