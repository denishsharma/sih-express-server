const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const modelName = "UserTask";
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
        },
        teamId: DataTypes.UUID,
    };

    const options = {};

    const UserTask = sequelize.define(modelName, attributes, options);

    const associations = {
        belongsToUser: () => {
            UserTask.belongsTo(models["User"], {
                foreignKey: "userId",
                as: "user",
            });
        },
        belongsToTask: () => {
            UserTask.belongsTo(models["Task"], {
                foreignKey: "taskId",
                as: "task",
            });
        },
        belongsToTeam: () => {
            UserTask.belongsTo(models["Team"], {
                foreignKey: "teamId",
                as: "team",
            });
        },
    };

    const instanceMethods = {};

    const classMethods = {};

    UserTask.registerMethods = () => {
        for (const method in instanceMethods) {
            UserTask.prototype[method] = instanceMethods[method];
        }

        for (const method in classMethods) {
            UserTask.prototype[method] = classMethods[method];
        }
    };

    UserTask.associate = (_models) => {
        models = _models;

        for (const association in associations) {
            associations[association]();
        }
    };

    return UserTask;
};