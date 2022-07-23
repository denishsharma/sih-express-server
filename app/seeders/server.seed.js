const { Server } = require("../sequelize");

exports.seed = async () => {
    await Server.bulkCreate([
        {
            name: "SIH Laravel",
            username: "sih-laravel",
            password: "$2b$10$urayr6iCFEYY7Ud.UAbXbObRio9cofXGmD92Gz6DrEGexqAbXARxK", // 12345678
            apiKey: "b9f8f8f8-f8f8-f8f8-f8f8-f8f8f8f8f8f8f",
        },
    ]);
};