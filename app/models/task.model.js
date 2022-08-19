const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const modelName = "Task";
    let models = {};

    const attributes = {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true,
        },
        signature: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    };

    const options = {};

    const Task = sequelize.define(modelName, attributes, options);

    const associations = {
        belongsToManyUsers: () => {
            Task.belongsToMany(models["User"], {
                through: models["UserTask"],
                as: "users",
            });
        },
    };

    const instanceMethods = {};

    const classMethods = {};

    Task.registerMethods = () => {
        for (const method in instanceMethods) {
            Task.prototype[method] = instanceMethods[method];
        }

        for (const method in classMethods) {
            Task.prototype[method] = classMethods[method];
        }
    };

    Task.associate = (_models) => {
        models = _models;

        for (const association in associations) {
            associations[association]();
        }
    };

    return Task;
};