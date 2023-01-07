const jwt = require("jsonwebtoken");

const SECRET_KEY_JWT = "will it work?";

const isAuth = async (req, res, next) => {
    const cookie = await req.cookies["jwtoken"];
    if (!cookie) {
        req.isAuth = false;
    } else {
        const decoded = jwt.verify(cookie, SECRET_KEY_JWT);
        req.id = decoded.id;
        req.username = decoded.username;
        req.isAuth = true;
    }
    return next();
};

module.exports = { isAuth };
