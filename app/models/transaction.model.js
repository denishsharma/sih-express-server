const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const modelName = "Transaction";
    let models = {};

    const attributes = {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true,
        },
    };

    const options = {};

    const Transaction = sequelize.define(modelName, attributes, options);

    const associations = {};

    const instanceMethods = {};

    const classMethods = {};

    Transaction.registerMethods = () => {
        for (const method in instanceMethods) {
            Transaction.prototype[method] = instanceMethods[method];
        }

        for (const method in classMethods) {
            Transaction[method] = classMethods[method];
        }
    };

    Transaction.associate = (_models) => {
        models = _models;

        for (const association in associations) {
            associations[association]();
        }
    };

    return Transaction;
};