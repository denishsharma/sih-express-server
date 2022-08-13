const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const modelName = "TemplateFieldOption";
    let models = {};

    const attributes = {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true,
        },
        templateFieldId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: DataTypes.STRING,
        position: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        usage: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        isDefault: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        isFixed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    };

    const options = {};

    const TemplateFieldOption = sequelize.define(modelName, attributes, options);

    const associations = {
        belongsToTemplateField: () => {
            TemplateFieldOption.belongsTo(models["TemplateField"], {
                foreignKey: "templateFieldId",
                as: "templateField",
            });
        },
    };

    const instanceMethods = {};

    const classMethods = {};

    TemplateFieldOption.registerMethods = () => {
        for (const method in instanceMethods) {
            TemplateFieldOption.prototype[method] = instanceMethods[method];
        }

        for (const method in classMethods) {
            TemplateFieldOption[method] = classMethods[method];
        }
    };

    TemplateFieldOption.assoicate = (_models) => {
        models = _models;

        for (const association in associations) {
            associations[association]();
        }
    };

    return TemplateFieldOption;
};