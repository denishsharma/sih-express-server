const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const modelName = "Record";
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
        owner: {
            type: DataTypes.STRING,
        },
        raw: {
            type: DataTypes.TEXT,
            get: function () {
                return JSON.parse(this.getDataValue('raw'));
            },
            set: function (val) {
                this.setDataValue('raw', JSON.stringify(val));
            }
        },
    };

    const options = {};

    const Record = sequelize.define(modelName, attributes, options);

    const associations = {
        belongsToTemplate: () => {
            Record.belongsTo(models["Template"], {
                foreignKey: "templateId",
                as: "template",
            });
        },
    };

    const instanceMethods = {}

    const classMethods = {}

    Record.registerMethods = () => {
        for (const method in instanceMethods) {
            Record.prototype[method] = instanceMethods[method];
        }

        for (const method in classMethods) {
            Record.prototype[method] = classMethods[method];
        }
    }

    Record.associate = (_models) => {
        models = _models;

        for (const association in associations) {
            associations[association]();
        }
    }

    return Record;
};