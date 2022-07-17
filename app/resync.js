const { sequelize } = require('./sequelize');

function sequelizeSync() {
    console.log('Syncing database...');
    sequelize.sync({ force: true }).then(() => {
        console.log('Sync database OK!');
    }).catch((e) => {
        console.log('Failed to sync database: ' + e.message);
    })
}

sequelizeSync();