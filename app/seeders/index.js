const { paths } = require("../configs/sequelize.config");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const seedAll = (args[0].toLowerCase() === "seed-all") || false;

const seeders = {};

fs.readdirSync(paths.seeders).filter((file) => file !== "index.js").forEach((file) => {
    seeders[file.split(".")[0]] = require(path.join(paths.seeders, file));
});

if (seedAll) {
    (async () => {
        console.log("Seeding database...");
        for (const seederName of Object.keys(seeders)) {
            console.log(`${seederName} seeder...`);
            await seeders[seederName].seed();
            console.log(`${seederName} seeder OK!`);
        }
        console.log("Seeding database OK!");
    })();
}
