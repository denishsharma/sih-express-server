const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const modelName = "Transaction";

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

    Transaction.associate = (models) => {};

    return Transaction;
};