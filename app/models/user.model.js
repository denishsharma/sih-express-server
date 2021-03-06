const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class User extends Model {
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

    const validators = {};

    const options = {
        sequelize,
        validate: validators,
        modelName: "User",
    };

    User.init(attributes, options);
    return User;
};