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

const updateTemplateUsage = async (templateId, usage) => {
    const template = await Template.findOne({ where: { id: templateId } });
    template.usage = usage;
    await template.save();
};
const increaseTemplateUsage = async (templateId) => {
    const template = await Template.findOne({ where: { id: templateId } });
    template.usage++;
    await template.save();
};

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

exports.test = async () => {
    // await testCreateTemplateWithFieldsAndVersions(); //OK!
    
    process.exit();
};

exports.metadata = {
    name: "generalTemplate",
};