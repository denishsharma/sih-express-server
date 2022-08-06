const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const modelName = "Server";

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

    Server.associate = (models) => {};

    return Server;
};