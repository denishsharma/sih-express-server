const { DataTypes, Op } = require("sequelize");
const { parseToJSONObject } = require("../utils/general.utils");

module.exports = (sequelize) => {
    const modelName = "Template";
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
        description: DataTypes.STRING,
        version: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        versionOf: DataTypes.UUID,
        usage: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    };

    const options = {};

    const Template = sequelize.define(modelName, attributes, options);

    const associations = {
        hasManyFields: () => {
            Template.hasMany(models["TemplateField"], {
                foreignKey: "templateId",
                as: "fields",
            });
        },
        hasOneVersionOfTemplate: () => {
            Template.belongsTo(models["Template"], {
                foreignKey: "versionOf",
                as: "versionOfTemplate",
            });
        },
        hasManyVersions: () => {
            Template.hasMany(models["Template"], {
                foreignKey: "versionOf",
                as: "versions",
            });
        },
    };

    const instanceMethods = {
        async getFields() {
            return await models["TemplateField"].findAll({
                where: {
                    templateId: this.id,
                },
                order: [["position", "ASC"]],
            });
        },
        async getField(fieldSignature) {
            return await models["TemplateField"].findOne({
                where: {
                    templateId: this.id,
                    signature: fieldSignature,
                },
            });
        },
        async createField(fieldAttributes) {
            await models["TemplateField"].create(Object.assign({
                templateId: this.id,
                position: (await models["TemplateField"].count({ where: { templateId: this.id } })) + 1,
            }, fieldAttributes));

            return await this.getFields();
        },
        async updateField(fieldSignature, fieldAttributes) {
            const field = await models["TemplateField"].findOne({
                where: {
                    templateId: this.id,
                    signature: fieldSignature,
                },
            });

            if (field) {
                field.set(fieldAttributes);
                await field.save();
            }

            return await this.getFields();
        },
        async deleteField(fieldSignature) {
            if (this.usage > 0) {
                return false;
            }

            const field = await models["TemplateField"].findOne({
                where: {
                    templateId: this.id,
                    signature: fieldSignature,
                },
            });

            if (field) {
                const position = field.position;
                await field.destroy();

                const fields = await models["TemplateField"].findAll({
                    where: {
                        templateId: this.id,
                        position: { [Op.gt]: position },
                    },
                });

                for (const field of fields) {
                    field.position -= 1;
                    await field.save();
                }
            }

            return await this.getFields();
        },
        async getVersions() {
            return await models["Template"].findAll({
                where: {
                    versionOf: this.id,
                },
                order: [["version", "DESC"]],
            });
        },
        async getRootTemplate() {
            return await models["Template"].findOne({
                where: {
                    versionOf: this.id,
                },
            });
        },
        async createVersion(versionAttributes) {
            const { version } = parseToJSONObject(await models["Template"].findAll({
                where: { versionOf: this.id },
                order: [["version", "DESC"]],
                attributes: ["version"],
            }))[0];

            return await models["Template"].create(Object.assign({
                versionOf: this.id,
                version: version + 1,
            }, versionAttributes));
        },
    };

    const classMethods = {
        async getRootTemplates() {
            return await Template.findAll({
                where: {
                    versionOf: null,
                },
            });
        },
        async getVersionOf(templateId) {
            const { versionOfTemplate } = await Template.findOne({
                where: {
                    id: templateId,
                },
                include: [{ model: Template, as: "versionOfTemplate" }],
            });

            return versionOfTemplate;
        },
    };

    Template.registerMethods = () => {
        for (const method in instanceMethods) {
            Template.prototype[method] = instanceMethods[method];
        }

        for (const method in classMethods) {
            Template[method] = classMethods[method];
        }
    };

    Template.associate = (_models) => {
        models = _models;

        for (const association in associations) {
            associations[association]();
        }
    };

    return Template;
};