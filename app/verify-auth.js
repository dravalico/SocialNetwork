const jwt = require("jsonwebtoken");

const isAuth = async (req, res, next) => {
    const cookie = await req.cookies[process.env.JWT_COOKIE_NAME];
    if (!cookie) {
        req.isAuth = false;
    } else {
        try {
            const decoded = jwt.verify(cookie, process.env.JWT_PRIVATE_KEY);
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
