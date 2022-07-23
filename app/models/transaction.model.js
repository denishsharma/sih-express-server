const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Transaction extends Model {
        static associate(models) {
            // define association here
        }
    }

    const attributes = {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true,
        },
    };

    const validators = {};

    const options = {
        sequelize,
        validate: validators,
        modelName: "Transaction",
    };

    Transaction.init(attributes, options);
    return Transaction;
};