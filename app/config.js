require("dotenv").config();
module.exports = {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    jwtCookieName: process.env.JWT_COOKIE_NAME,
    privateKey: process.env.JWT_KEY
};
