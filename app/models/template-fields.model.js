const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class TemplateFields extends Model {
        static associate(models) {
            TemplateFields.belongsTo(models.Template, { foreignKey: "templateId", as: "template" });
        }
    }

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

    const validators = {};

    const options = {
        sequelize,
        validate: validators,
        modelName: "TemplateField",
    };

    TemplateFields.init(attributes, options);
    return TemplateFields;
};