const express = require("express");
const db = require("./db.js");
const socialNetwork = require("./route.js");
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use("/api", socialNetwork);

app.listen(3000, async () => {
    console.log("Server running");
    await db.connect();
    console.log("Connected to MongoDB");
});
