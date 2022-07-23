const { sequelize } = require("./sequelize");

const args = process.argv.slice(2);
const force = (args[0].toLowerCase() === "force") || false;

function sequelizeSync(force) {
    console.log("Syncing database...");
    sequelize.sync({ alter: true, force }).then(() => {
        console.log("Sync database OK!");
    }).catch((e) => {
        console.log("Failed to sync database: " + e.message);
    });
}

sequelizeSync(force);