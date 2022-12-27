const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("./db/user-schema.js");
const { Message } = require("./db/message-schema.js");

const SECRET_KEY_JWT = "will it work?";

function generateJWT(id, username) {
    return jwt.sign({ id, username }, SECRET_KEY_JWT);
}

router.get("/allusr", async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

router.get("/allmsg", async (req, res) => {
    const messages = await Message.find({});
    res.json(messages);
});

router.delete("/dropuserdb", async (req, res) => {
    await User.deleteMany({});
    res.send("ok");
});

router.delete("/dropmsgdb", async (req, res) => {
    await Message.deleteMany({});
    res.send("ok");
});

router.post("/auth/signup", async (req, res) => {
    const userToInsert = req.body;
    userToInsert.id = (await getLastElementId(User)) + 1;
    userToInsert.password = await bcrypt.hash(req.body.password, 10);
    userToInsert.followersId = [];
    userToInsert.followingId = [];
    const token = generateJWT(userToInsert.id, userToInsert.username);
    const user = new User({ ...userToInsert });
    const insertedUser = await user.save();
    res.cookie("jwtoken", token, {
        maxAge: 1296000000,
        httpOnly: true,
    })
        .status(200)
        .json(insertedUser);
});

router.post("/auth/signin", async (req, res) => {
    const userToLogin = req.body;
    const user = await User.findOne({ username: userToLogin.username });
    if (user && (await bcrypt.hash(userToLogin.password, 10))) {
        const token = generateJWT(user.id, user.username);
        res.cookie("jwtoken", token, {
            maxAge: 1296000000,
            httpOnly: true,
        })
            .status(200)
            .json(userToLogin);
    } else {
        res.status(400).send("Invalid credentials");
    }
});

router.get("/social/users/:id", async (req, res) => {
    const userWithId = await User.findOne({ id: parseInt(req.params.id) });
    if (userWithId) {
        res.status(200).json(userWithId);
    } else {
        res.status(400).send("User not found");
    }
});

router.get("/social/messages/:userId", (req, res) => {});

router.get("/social/messages/:userId/:idMsg", (req, res) => {});

router.post("/social/messages", async (req, res) => {
    const cookie = req.headers["jwtoken"];
    let idFound;
    if (cookie) {
        jwt.verify(cookie, SECRET_KEY_JWT, async function (err, decodedToken) {
            if (err) {
                res.status(401).send("Invalid token");
            } else {
                let id = decodedToken.id;
                const userWithId = await User.findOne({ id: parseInt(id) });
                if (userWithId) {
                    idFound = id;
                } else {
                    res.status(400).send("User not found");
                }
            }
        });
    } else {
        res.status(401).send("Unauthorized");
    }
    let messageToInsert = {};
    messageToInsert.id = (await getLastElementId(Message)) + 1;
    messageToInsert.idCreator = 0;
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;
    messageToInsert.date = new Date().toISOString().split("T")[0];
    console.log(messageToInsert.date);
    messageToInsert.text = req.body.text;
    messageToInsert.likes = [];
    console.log(messageToInsert);
    const message = new Message({ ...messageToInsert });
    const insertedMessage = await message.save();
    res.status(200).json(insertedMessage);
});

router.get("/social/followers/:id", (req, res) => {});

router.post("/social/followers/:id", (req, res) => {});

router.delete("/social/followers/:id", (req, res) => {});

router.get("/social/feed", (req, res) => {});

router.post("/social/like/:idMessage", (req, res) => {});

router.delete("/social/like/:idMessage", (req, res) => {});

router.get("/social/search?q=query", (req, res) => {});

router.get("/social/whoami", (req, res) => {
    const cookie = req.headers["jwtoken"];
    if (cookie) {
        jwt.verify(cookie, SECRET_KEY_JWT, async function (err, decodedToken) {
            if (err) {
                res.status(401).send("Invalid token");
            } else {
                let id = decodedToken.id;
                const userWithId = await User.findOne({ id: parseInt(id) });
                console.log(userWithId);
                if (userWithId) {
                    res.status(200).send(userWithId);
                } else {
                    res.status(400).send("User not found");
                }
            }
        });
    } else {
        res.status(401).send("Unauthorized");
    }
});

async function getLastElementId(Schema) {
    const lastIdObject = await Schema.find({}).sort({ _id: -1 }).limit(1);
    if (lastIdObject.length === 0) {
        return 0;
    } else {
        return parseInt(lastIdObject[0].id);
    }
}

module.exports = router;
