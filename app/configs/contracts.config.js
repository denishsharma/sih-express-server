const path = require("path");

const config = {
    contractsRoot: path.resolve("app", "contracts"),
    artifactsPath: path.resolve("app", "contracts", "build"),
    contractsPath: path.resolve("contracts"),
    deployedPath: path.resolve("app", "contracts", "deployed"),
    migrationsPath: path.resolve("app", "contracts", "migrations"),
};

module.exports = {
    config,
};