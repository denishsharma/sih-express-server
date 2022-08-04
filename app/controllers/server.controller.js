const { Server, Sequelize } = require("../sequelize");
const { isRequestEmpty } = require("../utils/requests.utils");
const { createServerToken } = require("../utils/jwt.utils");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Op = Sequelize.Op;

exports.index = (req, res) => {
    res.send("Server");
};

// Register new server
exports.register = async (req, res) => {
    if (isRequestEmpty(req)) {
        res.status(400).json({ message: "Empty request body" });
        return;
    }

    const { name, username, password } = req.body;

    if (await Server.findOne({ where: { username } })) {
        res.status(400).json({
            message: `Server with username ${username} is already registered`,
        });
        return;
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const apiKey = crypto.randomUUID();
    const serverAttributes = {
        name,
        username,
        password: hashPassword,
        apiKey,
    };

    try {
        const server = await Server.create(serverAttributes);
        const serverToken = createServerToken(server);
        res.json({
            data: {
                name,
                username,
                apiKey,
                serverToken,
            },
            message: "Server registered successfully.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:
                error.message || "Some error occurred while creating Server.",
        });
    }
};

// Authenticate server
exports.authenticate = async (req, res) => {
    if (isRequestEmpty(req)) {
        res.status(400).json({ message: "Empty request body" });
        return;
    }

    const { password, apiKey } = req.body;
    const server = await Server.findOne({ where: { apiKey } });

    if (!server) {
        res.status(400).json({
            message: `Server with api-key "${apiKey}" does not exists.`,
        });
        return;
    }

    const passwordMatch = await bcrypt.compare(password, server.password);
    if (!passwordMatch) {
        res.status(403).json({
            message: `Invalid api-key or password.`,
        });
        return;
    }

    const serverToken = createServerToken(server);
    res.json({
        data: {
            serverToken,
        },
        message: "Server authenticated successfully.",
    });
};
