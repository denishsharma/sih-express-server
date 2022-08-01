const { deployContract } = require("./utils/contract.utils");
const { config } = require("./configs/contracts.config");
const { migrateContracts } = require("./contracts/migrations/contracts.migration");
const { web3 } = require("./utils/web3.utils");
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const state = {
    migrateAll: args[0] === "migrate-all" || false,
    loadDeployed: args[0] === "load-deployed" || false,
    migrateSingle: args[0] === "migrate-single" || false,
    deployDiff: args[0] === "deploy-diff" || false,
};

let migrationMeta = {};
const migrationMetaPath = path.join(config.contractsRoot, "migrations", "contracts.migration.meta.json");
if (fs.existsSync(path.join(config.migrationsPath, "contracts.migration.meta.json"))) {
    migrationMeta = require(migrationMetaPath);
} else {
    migrationMeta = JSON.parse(fs.readFileSync(path.join(config.migrationsPath, "contracts.migration.meta.template.json"), "utf8"));
}

if (!fs.existsSync(path.join(config.contractsRoot, "deployed"))) {
    fs.mkdirSync(path.join(config.contractsRoot, "deployed"));
}

const deployDiff = async () => {
    const artifacts = fs.readdirSync(config.artifactsPath).filter(artifact => {
        const contractMeta = migrationMeta.contracts[artifact.split(".")[0]];
        if (contractMeta && migrateContracts.includes(contractMeta.name)) {
            return !contractMeta.deployed;
        }
        return migrateContracts.includes(artifact.split(".")[0]);
    }).map(artifact => artifact.split(".")[0]);

    if (artifacts.length > 0) {
        console.log("Migrating contracts:");
        for (const contractName of artifacts) {
            await migrateSingle(contractName);
        }
        console.log("Migrated contracts OK!");
    }
    console.log("All contracts are migrated!");
};

const loadDeployed = async () => {
    console.log("Loading deployed contracts...");

    const includeContracts = Object.keys(migrationMeta.contracts).filter(contractName => migrationMeta.contracts[contractName].include && migrationMeta.contracts[contractName].deployed);

    const networkId = await web3.eth.net.getId();
    const importStatements = ["const { web3 } = require('../utils/web3.utils');"];
    const assignStatements = ["const contracts = {};"];

    for (const contractName of includeContracts) {
        importStatements.push(`const ${contractName} = require("${migrationMeta.contracts[contractName].deployedContract}")(web3, ${networkId});`);
        assignStatements.push(`contracts.${contractName} = ${contractName};`);
    }

    assignStatements.push("module.exports = contracts;");

    const importStatementsString = importStatements.join("\n");
    const assignStatementsString = assignStatements.join("\n");
    const statements = importStatementsString + "\n" + assignStatementsString;

    fs.writeFileSync(config.contractsRoot + "/index.js", statements);

    console.log("Loaded deployed contracts OK!");
};

const migrateSingle = async (contractName) => {
    console.log(`Migrating ${contractName} contract...`);
    await deployContract(contractName, []);
    console.log(`Migrated ${contractName} contract!`);
};

const migrateAll = async () => {
    console.log("Migrating all contracts:");

    for (const contractName of migrateContracts) {
        await migrateSingle(contractName);
    }

    console.log("Migrated all contracts OK!");
    await loadDeployed();
};

(async (state) => {
    if (state.migrateAll) {
        await migrateAll();
    } else if (state.loadDeployed) {
        await loadDeployed();
    } else if (state.migrateSingle) {
        await migrateSingle(args[1]);
    } else if (state.deployDiff) {
        await deployDiff();
    }
    process.exit();
})(state);
