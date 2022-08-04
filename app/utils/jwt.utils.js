require("dotenv").config();

const { sign, verify } = require("jsonwebtoken");
const { lockUserAddress, unlockUserAddress } = require("./secure.utils");

const JWTSecret = process.env.JWT_SECRET;

exports.createToken = (payload) => {
    return sign(payload, JWTSecret, undefined, undefined);
};

exports.validateToken = (token, err) => {
    try {
        const validToken = verify(token, JWTSecret, undefined, undefined);
        return !!validToken;
    } catch (error) {
        err(error);
    }
};

exports.decodeToken = (token, err) => {
    try {
        return verify(token, JWTSecret, undefined, undefined);
    } catch (error) {
        err(error);
    }
};

exports.createServerToken = (server) => {
    return this.createToken({ serverId: server.id, apiKey: server.apiKey });
};

exports.createUserToken = (user) => {
    return this.createToken({ userKey: user.userKey, address: user.address, secret: user.secret });
};