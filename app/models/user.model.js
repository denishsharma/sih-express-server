const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const modelName = "User";

    const attributes = {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true,
        },
        userKey: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        secret: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    };

    const options = {};

    const User = sequelize.define(modelName, attributes, options);

    User.associate = (models) => {};

    return User;
};