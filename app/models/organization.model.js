const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const modelName = "Organization";
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
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        signature: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

    };

    const options = {};

    const Organization = sequelize.define(modelName, attributes, options);

    const associations = {
        hasManyUsers: () => {
            Organization.hasMany(models["User"], {
                foreignKey: "organizationId",
                as: "users",
            });
        }
    };

    const instanceMethods = {
        // async getUsers() {
        //     return await models["User"].findAll({
        //         where: {
        //             organizationId: this.id,
        //         },
        //     });
        // },
    };

    const classMethods = {};

    Organization.registerMethods = () => {
        for (const method in instanceMethods) {
            Organization.prototype[method] = instanceMethods[method];
        }

        for (const method in classMethods) {
            Organization[method] = classMethods[method];
        }
    };

    Organization.associate = (_models) => {
        models = _models;

        for (const association in associations) {
            associations[association]();
        }
    };

    return Organization;
};