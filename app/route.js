const express = require("express");
const router = express.Router();
const db = require("./db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const DbCollectionsNames = {
    Users: "users",
    Messages: "messages",
};

const SECRET_KEY_JWT = "will it work?";

function generateJWT(username, hashedPassword) {
    return jwt.sign({ username, hashedPassword }, SECRET_KEY_JWT);
}

router.get("/all", async (req, res) => {
    const mongoDb = db.getDb();
    const users = await mongoDb
        .collection(DbCollectionsNames.Users)
        .find()
        .toArray();
    res.send(users);
});

router.delete("/dropuserdb", async (req, res) => {
    const mongoDb = db.getDb();
    await mongoDb.collection(DbCollectionsNames.Users).drop();
    res.send("ok");
});

router.post("/auth/signup", async (req, res) => {
    const mongoDb = db.getDb();
    const userToInsert = req.body;
    userToInsert.password = await bcrypt.hash(req.body.password, 10);
    userToInsert.followers = "";
    userToInsert.following = "";
    const usersCollectionElements = await mongoDb
        .collection(DbCollectionsNames.Users)
        .find()
        .toArray();
    let lastId = await getLastId(mongoDb);
    userToInsert.id = lastId + 1;

    const token = generateJWT(userToInsert.username, userToInsert.password);

    await mongoDb.collection(DbCollectionsNames.Users).insertOne(userToInsert);
    delete userToInsert._id;
    res.cookie("jwtoken", token, {
        maxAge: 1296000000,
        httpOnly: true,
    })
        .status(200)
        .json(userToInsert);
});

router.post("/auth/signin", async (req, res) => {
    const mongoDb = db.getDb();
    const userToLogin = req.body;
    const user = await mongoDb
        .collection(DbCollectionsNames.Users)
        .findOne({ username: userToLogin.username });
    console.log(userToLogin);
    if (user && (await bcrypt.hash(userToLogin.password, 10))) {
        const token = generateJWT(userToLogin.username, userToLogin.password);
        res.cookie("jwtoken", token, {
            maxAge: 1296000000,
            httpOnly: true,
        })
            .status(200)
            .json(userToLogin);
    } else {
        res.status(400).send("Invalid Credentials");
    }
});

router.get("/social/users/:id", async (req, res) => {
    const mongoDb = db.getDb();
    const userWithId = await mongoDb
        .collection(DbCollectionsNames.Users)
        .findOne({ id: parseInt(req.params.id) });
    if (userWithId) {
        res.status(200).json(userWithId);
    } else {
        res.status(400).send("User not found");
    }
});

router.get("/social/messages/:userId", (req, res) => {});

router.get("/social/messages/:userId/:idMsg", (req, res) => {});

router.post("/social/messages", (req, res) => {
    const mongoDb = db.getDb();
    const message = req.body;
    const date = new Date();
    // TODO add date
});

router.get("/social/followers/:id", (req, res) => {});

router.post("/social/followers/:id", (req, res) => {});

router.delete("/social/followers/:id", (req, res) => {});

router.get("/social/feed", (req, res) => {});

router.post("/social/like/:idMessage", (req, res) => {});

router.delete("/social/like/:idMessage", (req, res) => {});

router.get("/social/search?q=query", (req, res) => {});

router.get("/social/whoami", (req, res) => {});

async function getLastId(mongoDb) {
    const lastIdObject = await mongoDb
        .collection(DbCollectionsNames.Users)
        .find({})
        .sort({ _id: -1 })
        .limit(1)
        .toArray();
    if (lastIdObject.length === 0) {
        return 0;
    } else {
        return parseInt(lastIdObject[0].id);
    }
}

module.exports = router;
