const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const modelName = "Server";
    let models = {};

    const attributes = {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        apiKey: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    };

    const options = {};

    const Server = sequelize.define(modelName, attributes, options);

    const associations = {};

    const instanceMethods = {};

    const classMethods = {};

    Server.registerMethods = () => {
        for (const method in instanceMethods) {
            Server.prototype[method] = instanceMethods[method];
        }

        for (const method in classMethods) {
            Server[method] = classMethods[method];
        }
    };

    Server.associate = (_models) => {
        models = _models;

        for (const association in associations) {
            associations[association]();
        }
    };

    return Server;
};