const express = require("express");
const app = express();
const mongoosedb = require("./db/mongoosedb.js");
const cors = require("cors");
const authApi = require("./routes/auth.js");
const messagesApi = require("./routes/messages.js");
const followersApi = require("./routes/followers.js");
const likesApi = require("./routes/like.js");
const api = require("./routes/route.js");
const test = require("./routetest.js");
const { isAuth } = require("./verify-auth.js");

app.use(cors({
    methods: ['GET','POST','DELETE']
}));
app.use(isAuth);
app.use(express.static("public"));
app.use(express.json());
app.use("/api/auth", authApi);
app.use("/api/social/messages", messagesApi);
app.use("/api/social/followers", followersApi);
app.use("/api/social/like", likesApi);
app.use("/api", api);
app.use("/api/test", test);

app.listen(3000, () => {
    console.info("INFO: Server running");
    mongoosedb.connect();
    console.info("INFO: Connected to MongoDB");
});
