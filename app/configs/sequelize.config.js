require("dotenv").config();

const path = require("path");

const paths = {
    models: path.resolve("app", "models"),
};

const development = {
    username: process.env.DATABASE_USER || "root",
    password: process.env.DATABASE_PASSWORD || null,
    database: process.env.DATABASE_NAME || "sih_node",
    host: process.env.DATABASE_HOST || "localhost",
    port: process.env.DATABASE_PORT || 3306,
    dialect: process.env.DATABASE_DIALECT || "mysql",
    dialectOptions: {
        bigNumberString: true,
    },
};

module.exports = {
    development,
    paths,
};
