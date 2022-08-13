const { DataTypes, Op } = require("sequelize");
const { fieldOptionCheckDefaults, parseToJSONObject } = require("../utils/general.utils");
const hash = require("object-hash");

module.exports = (sequelize) => {
    const modelName = "TemplateField";
    let models = {};

    const attributes = {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true,
        },
        templateId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        signature: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: DataTypes.STRING,
        dataType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isRequired: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        isFixed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
    };

    const options = {};


    const TemplateField = sequelize.define(modelName, attributes, options);

    const associations = {
        belongsToTemplate: () => {
            TemplateField.belongsTo(models["Template"], {
                foreignKey: "templateId",
                as: "template",
            });
        },
        hasManyOptions: () => {
            TemplateField.hasMany(models["TemplateFieldOption"], {
                foreignKey: "templateFieldId",
                as: "options",
            });
        },
    };

    const instanceMethods = {
        async getTemplateUsage() {
            const { usage } = parseToJSONObject(await models["Template"].findOne({
                where: {
                    id: this.templateId,
                },
                attributes: ["usage"],
            }));
            return usage;
        },
        async allowChanges() {
            return !(await this.getTemplateUsage() > 0);
        },
        async allowOptionChanges(optionValue) {
            const { usage } = await this.getOption(optionValue);
            return !(usage > 0);
        },
        async getOptions() {
            const fieldOptions = await models["TemplateFieldOption"].findAll(
                {
                    where: { templateFieldId: this.id },
                    order: [["position", "ASC"]],
                },
            );

            return fieldOptions.map(fieldOption => {
                return {
                    ...fieldOption.toJSON(),
                    allowChanges: !(fieldOption.usage > 0),
                };
            });
        },
        async getOption(optionValue) {
            return await models["TemplateFieldOption"].findOne({
                where: {
                    value: optionValue,
                    templateFieldId: this.id,
                },
            });
        },
        async createOption(option) {
            fieldOptionCheckDefaults(option);
            const lastOptionPosition = await models["TemplateFieldOption"].max("position", { where: { templateFieldId: this.id } });
            const optionAttributes = {
                ...option,
                templateFieldId: this.id,
                position: lastOptionPosition + 1,
                value: hash.MD5([option.value, new Date().getTime()]),
            };
            await models["TemplateFieldOption"].create(optionAttributes);
            return await this.getOptions();
        },
        async updateOption(optionValue, optionAttributes) {
            const option = await this.getOption(optionValue);
            if (option) {
                option.set(optionAttributes);
                await option.save();
            }

            return await this.getOptions();
        },
        async deleteOption(optionValue) {
            const changeAllowed = await this.allowOptionChanges(optionValue);
            if (!changeAllowed) {
                return false;
            }

            const option = await this.getOption(optionValue);
            if (option) {
                const position = option.position;
                await option.destroy();

                const options = await models["TemplateFieldOption"].findAll({
                    where: {
                        templateFieldId: this.id,
                        position: { [Op.gt]: position },
                    },
                });

                for (const _option of options) {
                    _option.position -= 1;
                    await _option.save();
                }
            }

            return await this.getOptions();
        },
    };

    const classMethods = {};

    TemplateField.registerMethods = () => {
        for (const method in instanceMethods) {
            TemplateField.prototype[method] = instanceMethods[method];
        }

        for (const method in classMethods) {
            TemplateField[method] = classMethods[method];
        }
    };

    TemplateField.associate = (_models) => {
        models = _models;

        for (const association in associations) {
            associations[association]();
        }
    };

    return TemplateField;
};