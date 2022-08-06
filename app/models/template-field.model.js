const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const modelName = "TemplateField";

    const attributes = {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true,
        },
        "templateId": {
            type: DataTypes.UUID,
            allowNull: false,
        },
        "signature": {
            type: DataTypes.STRING,
            allowNull: false,
        },
        "name": {
            type: DataTypes.STRING,
            allowNull: false,
        },
        "dataType": {
            type: DataTypes.STRING,
            allowNull: false,
        },
        "position": {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        "isRequired": {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        "isFixed": {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
    };

    const options = {};

    const TemplateField = sequelize.define(modelName, attributes, options);

    TemplateField.associate = (models) => {
        TemplateField.belongsTo(models.Template, { foreignKey: "templateId", as: "template" });
    };

    return TemplateField;
};