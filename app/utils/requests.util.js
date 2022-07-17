exports.isRequestEmpty = (req) => {
    return req.body.constructor === Object && Object.keys(req.body).length === 0;
}

exports.getBearerToken = (req) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        return bearer[1];
    }
    return false;
}