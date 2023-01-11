const jwt = require("jsonwebtoken");
const { jwtCookieName, privateKey } = require("./config.js");

const isAuth = async (req, res, next) => {
    const cookie = await req.cookies[jwtCookieName];
    if (!cookie) {
        req.isAuth = false;
    } else {
        try {
            const decoded = jwt.verify(cookie, privateKey);
            req.id = decoded.id;
            req.username = decoded.username;
            req.isAuth = true;
        } catch {
            req.isAuth = false;
        }
    }
    return next();
};

module.exports = { isAuth };
