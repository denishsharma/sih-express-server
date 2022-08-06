const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Template extends Model {
        static associate(models) {
            Template.hasMany(models.TemplateFields, { foreignKey: "templateId", as: "fields" });
        }
    }

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

    const validators = {};

    const options = {
        sequelize,
        validate: validators,
        modelName: "Template",
    };

    Template.init(attributes, options);
    return Template;
};