const express = require("express");
const router = express.Router();
const db = require("./db.js");

const CollectionsNames = {
    Users: "users",
    Messages: "messages",
};

router.post("/auth/signup", async (req, res) => {
    const mongoDb = db.getDb();
    const userToInsert = req.body;
    const users = await mongoDb
        .collection(CollectionsNames.Users)
        .find()
        .toArray();
    isAlreadyInDb = false;
    if (typeof users !== "undefined") {
        for (let i = 0; i < users.length; i++) {
            if (users[i].username === userToInsert.username) {
                isAlreadyInDb = true;
                break;
            }
        }
    }
    if (isAlreadyInDb) {
        res.send("error");
    } else {
        await mongoDb
            .collection(CollectionsNames.Users)
            .insertOne(userToInsert);
        if (typeof users !== "undefined") {
            res.send(users);
        } else {
            res.send(userToInsert);
        }
    }
});

router.post("/auth/signin", (req, res) => {});

router.get("/social/users/:id", (req, res) => {});

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
