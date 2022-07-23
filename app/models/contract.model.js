const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Contract extends Model {
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

    const validators = {};

    const options = {
        sequelize,
        validate: validators,
        modelName: "Contract",
    };

    Contract.init(attributes, options);
    return Contract;
};