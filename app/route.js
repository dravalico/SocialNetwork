const { response } = require("express");
const express = require("express");
const router = express.Router();
const db = require("./db.js");

const DbCollectionsNames = {
    Users: "users",
    Messages: "messages",
};

router.delete("/dropuserdb", async (req, res) => {
    const mongoDb = db.getDb();
    await mongoDb.collection(DbCollectionsNames.Users).drop();
    res.send("ok");
});

router.post("/auth/signup", async (req, res) => {
    const mongoDb = db.getDb();
    const userToInsert = req.body;
    await mongoDb.collection(DbCollectionsNames.Users).insertOne(userToInsert);
    delete userToInsert._id;
    res.json(userToInsert);
});

router.post("/auth/signin", (req, res) => {});

router.get("/social/users/:id", async (req, res) => {
    const mongoDb = db.getDb();
    const userWithId = await mongoDb
        .collection(DbCollectionsNames.Users)
        .findOne({ id: parseInt(req.body.id) });
    res.json(userWithId);
});

router.get("/social/messages/:userId", (req, res) => {});

router.get("/social/messages/:userId/:idMsg", (req, res) => {});

router.post("/social/messages", (req, res) => {});

router.get("/social/followers/:id", (req, res) => {});

router.post("/social/followers/:id", (req, res) => {});

router.delete("/social/followers/:id", (req, res) => {});

router.get("/social/feed", (req, res) => {});

router.post("/social/like/:idMessage", (req, res) => {});

router.delete("/social/like/:idMessage", (req, res) => {});

router.get("/social/search?q=query", (req, res) => {});

router.get("/social/whoami", (req, res) => {});

module.exports = router;
