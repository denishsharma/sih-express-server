const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const modelName = "Template";

    const attributes = {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true,
        },
        "name": {
            type: DataTypes.STRING,
            allowNull: false,
        },
        "description": DataTypes.STRING,
        "version": {
            type: DataTypes.STRING,
            allowNull: false,
        },
    };

    const options = {};

    const Template = sequelize.define(modelName, attributes, options);

    Template.associate = (models) => {
        Template.hasMany(models.TemplateField, { foreignKey: "templateId", as: "fields" });
    };

    return Template;
};