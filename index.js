require("dotenv").config();

const app = require("./app");
const { sequelize } = require("./app/sequelize");
const port = process.env.EXPRESS_PORT || 3000;

const events = require("./app/events");

async function assertDatabaseConnectionOk() {
    console.log("Checking database connection...");
    try {
        await sequelize.authenticate();
        console.log("Database connection OK!");
    } catch (e) {
        console.log("Unable to connect to the database:");
        console.log(e.message);
        process.exit(1);
    }
}


async function start() {
    await assertDatabaseConnectionOk();

    console.log(`Staring SIH Node Sever on port ${port}...`);
    app.listen(port, () => {
        console.log(`Server started and listening to requests on port ${port}.`);
    });
}

(async function () {
    await start();
    events.listen();
})();
