const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const modelName = "Contract";

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
        contractKey: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        networkId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        deployer: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    };

    const options = {};

    const Contract = sequelize.define(modelName, attributes, options);

    Contract.associate = (models) => {};

    return Contract;
};