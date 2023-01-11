const express = require("express");
const app = express();
const mongoosedb = require("./db/mongoosedb.js");
const authApi = require("./routes/auth.js");
const followersApi = require("./routes/followers.js");
const likesApi = require("./routes/like.js");
const messagesApi = require("./routes/messages.js");
const socialApi = require("./routes/social.js");
const test = require("./routetest.js");
const { isAuth } = require("./verify-auth.js");
var cookieParser = require("cookie-parser");
const { port } = require("./config.js");

app.use(cookieParser());
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

app.use(isAuth);
app.use(express.static("public"));
app.use(express.json());

app.use("/api/auth", authApi);
app.use("/api/social/messages", messagesApi);
app.use("/api/social/followers", followersApi);
app.use("/api/social/like", likesApi);
app.use("/api/social", socialApi);
app.use("/api/test", test);

app.listen(port, () => {
    console.info("INFO: Server running on port " + port);
    mongoosedb.connect();
    console.info("INFO: Connected to MongoDB");
});
