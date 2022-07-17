const { development, paths } = require("./configs/sequelize.config.js");
const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");

const sequelize = new Sequelize(
    development.database,
    development.username,
    development.password,
    {
        host: development.host,
        dialect: development.dialect,
        operatorAliases: false,
        logging: console.log,
        logQueryParameters: true,
        benchmark: true,
    }
);

const seq = {};

fs.readdirSync(paths.models).forEach((file) => {
    const model = require(path.join(paths.models, file))(sequelize);
    seq[model.name] = model;
});

Object.keys(seq).forEach((modelName) => {
    if (seq[modelName].associate) {
        seq[modelName].associate(seq);
    }
});

seq.sequelize = sequelize;
seq.Sequelize = Sequelize;

module.exports = seq;
