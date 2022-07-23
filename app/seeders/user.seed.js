const { User } = require("../sequelize");

exports.seed = async () => {
    await User.bulkCreate([
        {
            userKey: "denish",
            address: "0xa5E01731c34090151a7e49414E66571798f7cfbA",
            secret: "U2FsdGVkX19rIBrRqyx2EYHMXLWZWodV0HRibM7PWBBW7CERIxem4/AnPgEXa/2bn4TkWR7Cfg/m1QGTiiFy0aBo8jMFo5zzbkzKuH1H0cgX5LpPTL90+jU1GTqo6suq",
        },
        {
            userKey: "john",
            address: "0xcC0D660D77844F8Eb55CD04b4069609ffb536B6D",
            secret: "U2FsdGVkX1+PQ3MHN+0pZi7QiCR8AR+kgXvV/xmNBWiMhL5DxN+0ia5o0ckyWPWJXRhLJTKKrZ76Z5W/4F4CtPVFHE4L79MBxiFzOIC3up3NCZeAczaScRkk/Q4xaUf0",
        },
        {
            userKey: "bob",
            address: "0x557e9cFDd45147DF24599DB5A1c04Df5AE1c1F66",
            secret: "U2FsdGVkX19AtJkcMVOGNtsVEVFOTqybd5GhQ5GQGLX5mYjKBc1OyecMgTRxuMbtHt8SQT0DkByfLPL1OvKdfrXqEHnnrJySLeIA84mY/6dX6kyISp4E0bNfwKmyRfTj",
        },
    ]);


};
