const express = require("express");
const socialNetwork = require("./route.js");
const app = express();
const mongoosedb = require("./db/mongoose-db.js");

app.use(express.static("public"));
app.use(express.json());
app.use("/api", socialNetwork);

app.listen(3000, async () => {
    console.log("INFO: Server running");
    mongoosedb.connect();
    console.log("INFO: Connected to MongoDB");
});
