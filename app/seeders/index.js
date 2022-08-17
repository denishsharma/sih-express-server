const { paths } = require("../configs/sequelize.config");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const seedAll = (args[0].toLowerCase() === "seed-all") || false;
const seedOne = (args[0].toLowerCase() === "seed-one") || false;

const seeders = {};

fs.readdirSync(paths.seeders).filter((file) => file !== "index.js").forEach((file) => {
    seeders[file.split(".")[0]] = require(path.join(paths.seeders, file));
});

if (seedAll) {
    (async () => {
        console.log("Seeding database...");
        for (const seederName of Object.keys(seeders)) {
            console.log(`${seederName} seeder...`);
            try {
                await seeders[seederName].seed();
            } catch (error) {
                console.log(`${seederName} seeder error: ${error.message}`);
                throw error;
            }
            console.log(`${seederName} seeder OK!`);
        }
        console.log("Seeding database OK!");
    })();
}

if (seedOne) {
    (async () => {
        const seeder = seeders[args[1]];
        if (seeder) {
            console.log(`Seeding ${args[1]} seeder...`);
            await seeder.seed();
            console.log(`Seeding ${args[1]} seeder OK!`);
        }
    })();
}
