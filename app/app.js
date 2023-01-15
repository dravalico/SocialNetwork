const express = require("express");
const app = express();
const morgan = require("morgan");
var cookieParser = require("cookie-parser");
const mongoosedb = require("./db/mongoosedb.js");
const authApi = require("./routes/auth.js");
const followersApi = require("./routes/followers.js");
const likesApi = require("./routes/like.js");
const messagesApi = require("./routes/messages.js");
const socialApi = require("./routes/social.js");
const { isAuth } = require("./verify-auth.js");
const { logger } = require("./logger.js");
require("dotenv").config();

morgan.token("host", function (req, res) {
    return req.hostname;
});
app.use(morgan(":host :method :url :status in :response-time ms"));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "content-type");
    res.header("Access-Control-Allow-Credentials", true);
    if ("OPTIONS" === req.method) {
        res.status(200).send();
    } else {
        next();
    }
});

app.use(cookieParser());
app.use(isAuth);
app.use(express.static("public"));
app.use(express.json());

app.use("/api/auth", authApi);
app.use("/api/social/messages", messagesApi);
app.use("/api/social/followers", followersApi);
app.use("/api/social/like", likesApi);
app.use("/api/social", socialApi);
app.use((err, req, res, next) => {
    const statusCode = res.statusCode;
    res.status(statusCode === 200 ? 500 : statusCode).json({ error: err });
});

app.listen(process.env.PORT, () => {
    logger.info("server running on port " + process.env.PORT);
    mongoosedb.connect();
    logger.info("mongoDB running");
});
