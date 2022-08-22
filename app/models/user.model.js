const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const modelName = "User";
    let models = {};

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
        organizationId: DataTypes.UUID,
    };

    const options = {};

    const User = sequelize.define(modelName, attributes, options);

    const associations = {
        belongsToOrganization: () => {
            User.belongsTo(models["Organization"], {
                foreignKey: "organizationId",
                as: "organization",
            });
        },
        hasManyTasks: () => {/* user has many task through team */},
        belongsToManyTeams: () => {/* user belongs to many team */},
    };

    const instanceMethods = {
        async getOrganization() {
            return await models["Organization"].findOne({
                where: {
                    id: this.organizationId,
                },
            });
        },
        async setOrganization(organizationId) {
            this.organizationId = organizationId;
            return await this.save();
        },
    };

    const classMethods = {};

    User.registerMethods = () => {
        for (const method in instanceMethods) {
            User.prototype[method] = instanceMethods[method];
        }

        for (const method in classMethods) {
            User[method] = classMethods[method];
        }
    };

    User.associate = (_models) => {
        models = _models;

        for (const association in associations) {
            associations[association]();
        }
    };

    return User;
};