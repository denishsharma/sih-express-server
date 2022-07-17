const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
    class Server extends Model {
        static associate(models) {
            // define association here
        }
    }

    const attributes = {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
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

    const validators = {};

    const options = {
        sequelize,
        validate: validators,
        modelName: "Server",
    };

    Server.init(attributes, options);
    return Server;
};
