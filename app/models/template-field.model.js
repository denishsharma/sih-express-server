const { DataTypes } = require("sequelize");
const { fieldOptionCheckDefaults, parseToJSONObject } = require("../utils/general.utils");

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
            return this.options;
        },
        async getOption(optionValue) {
            const options = await this.getOptions();
            return options.find(option => option.value === optionValue);
        },
        async setOptions(options) {
            for (const option of options) {
                fieldOptionCheckDefaults(option);
            }
            this.options = options;
            await this.save();
            return await this.getOptions();
        },
        async addOption(option) {
            fieldOptionCheckDefaults(option);
            const options = await this.getOptions();
            option.position = (options).length + 1;
            options.push(option);
            return await this.setOptions(options);
        },
        async updateOption(optionValue, option) {
            const options = await this.getOptions();
            const _option = options.find((_option) => _option.value === optionValue);
            if (_option) {
                Object.assign(_option, option, { updatedAt: new Date() });
                return await this.setOptions(options);
            }
            return false;
        },
        async removeOption(optionValue) {
            if (!(await this.allowOptionChanges(optionValue))) {
                return false;
            }

            const options = await this.getOptions();
            const _option = options.find((_option) => _option.value === optionValue);
            if (_option) {
                const position = _option.position;
                options.splice(options.indexOf(_option), 1);
                options.filter((_option) => _option.position > position).forEach((_option) => _option.position--);
                return await this.setOptions(options);
            }
            return false;
        },
        async incrementOptionUsage(optionValue) {
            const options = await this.getOptions();
            const _option = options.find((_option) => _option.value === optionValue);
            if (_option) {
                _option.usage++;
                return await this.setOptions(options);
            }
            return false;
        },
        async decrementOptionUsage(optionValue) {
            const options = await this.getOptions();
            const _option = options.find((_option) => _option.value === optionValue);
            if (_option) {
                _option.usage--;
                return await this.setOptions(options);
            }
            return false;
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