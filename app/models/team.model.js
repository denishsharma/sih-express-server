const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const modelName = "Team";
    let models = {};

    const attributes = {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true,
        },
        signature: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    };

    const options = {};

    const Team = sequelize.define(modelName, attributes, options);

    const associations = {
        belongsToManyUsers: () => {
            Team.belongsToMany(models["User"], {
                through: "UserTeam",
                as: "users",
            });
        },
    };

    const instanceMethods = {};

    const classMethods = {};

    Team.registerMethods = () => {
        for (const method in instanceMethods) {
            Team.prototype[method] = instanceMethods[method];
        }

        for (const method in classMethods) {
            Team.prototype[method] = classMethods[method];
        }
    };

    Team.associate = (_models) => {
        models = _models;

        for (const association in associations) {
            associations[association]();
        }
    };

    return Team;
};