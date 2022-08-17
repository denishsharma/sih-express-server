const { Template, TemplateField, TemplateFieldOption } = require("../sequelize");

exports.seed = async () => {
    await Template.create(
        {
            name: "Template 1",
            description: "Template 1 Description",
            versions: [
                {
                    name: "Template 1 Version 1",
                    description: "Template 1 Version 1 Description",
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
                                    position: 1,
                                },
                            ],
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
                            include: [
                                {
                                    model: TemplateFieldOption,
                                    as: "options",
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    );
};