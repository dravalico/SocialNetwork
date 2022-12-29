const jwt = require("jsonwebtoken");

const SECRET_KEY_JWT = "will it work?";

const isAuth = async (req, res, next) => {
    const cookie = req.headers["jwtoken"];
    if (!cookie) {
        req.isAuth = false;
        return next();
    }
    const decoded = jwt.verify(cookie, SECRET_KEY_JWT);
    req.id = decoded.id;
    req.username = decoded.username;
    req.isAuth = true;
    return next();
};

module.exports = { isAuth };
