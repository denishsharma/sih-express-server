const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const modelName = "Contract";
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

    const associations = {};

    const instanceMethods = {};

    const classMethods = {};

    Contract.registerMethods = () => {
        for (const method in instanceMethods) {
            Contract.prototype[method] = instanceMethods[method];
        }

        for (const method in classMethods) {
            Contract[method] = classMethods[method];
        }
    };
    
    Contract.associate = (_models) => {
        models = _models;

        for (const association in associations) {
            associations[association]();
        }
    };

    return Contract;
};