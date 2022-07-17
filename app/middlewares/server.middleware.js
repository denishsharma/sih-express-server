const { getBearerToken } = require("../utils/requests.util");
const { validateToken } = require("../utils/jwt.utils");

exports.validateServerToken = (req, res, next) => {
    const serverToken = getBearerToken(req);
    const validToken = validateToken(serverToken, (err) => {
        console.log(err.message);
        res.status(403).json({ message: "Server not authenticated" });
    });
    if (validToken) {
        res.authenticated = true;
        return next();
    }
};
