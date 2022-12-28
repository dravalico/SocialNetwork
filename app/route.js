const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("./db/user-schema.js");
const { Message } = require("./db/message-schema.js");

const SECRET_KEY_JWT = "will it work?";
const SALT = bcrypt.genSaltSync(10);

function generateJWT(id, username) {
    return jwt.sign({ id, username }, SECRET_KEY_JWT);
}

router.get("/allusr", async (req, res) => {
    const users = await User.find({});
    res.send(users);
});

router.get("/allmsg", async (req, res) => {
    const messages = await Message.find({});
    res.send(messages);
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
    userToInsert.password = await bcrypt.hash(req.body.password, SALT);
    userToInsert.followersId = [];
    userToInsert.followingId = [];
    const token = generateJWT(userToInsert.id, userToInsert.username);
    const insertedUser = await new User({ ...userToInsert })
        .save()
        .catch((err) => {
            return res.status(500);
        });
    return res
        .cookie("jwtoken", token, {
            maxAge: 1296000000,
            httpOnly: true,
        })
        .status(200)
        .send(insertedUser);
});

router.post("/auth/signin", async (req, res) => {
    const userToLogin = req.body;
    const user = await User.findOne({ username: userToLogin.username });
    const psw = await bcrypt.hash(userToLogin.password, SALT);
    console.log(psw);
    console.log(user.password);
    if (user && user.password === psw) {
        const token = generateJWT(user.id, user.username);
        return res
            .cookie("jwtoken", token, {
                maxAge: 1296000000,
                httpOnly: true,
            })
            .status(200)
            .send(userToLogin);
    } else {
        return res.status(403).send("Invalid credentials");
    }
});

router.get("/social/users/:id", async (req, res) => {
    const userWithId = await User.findOne(
        { id: parseInt(req.params.id) },
        "name surname username bio followers following"
    );
    if (userWithId) {
        return res.status(200).send(userWithId);
    } else {
        return res.status(404).send("User not found");
    }
});

router.get("/social/messages/:userId", async (req, res) => {
    const userId = req.params.userId;
    const messagesFromUser = await Message.find({ idCreator: userId });
    if (messagesFromUser.length !== 0) {
        return res.status(200).send(messagesFromUser);
    } else {
        return res.status(404).send("No messages");
    }
});

router.get("/social/messages/:userId/:idMsg", async (req, res) => {
    const userId = req.params.userId;
    const idMsg = req.params.idMsg;
    const message = await Message.findOne({ idCreator: userId, id: idMsg });
    if (message) {
        return res.status(200).send(message);
    } else {
        return res.status(404).send("No message");
    }
});

router.post("/social/messages", async (req, res) => {
    const cookie = req.headers["jwtoken"];
    let idCreator;
    if (cookie) {
        try {
            const decoded = jwt.verify(cookie, SECRET_KEY_JWT);
            idCreator = decoded.id;
        } catch (err) {
            return res.status(401).send("Invalid token");
        }
    } else {
        return res.status(403).send("No token provided");
    }
    let messageToInsert = {};
    messageToInsert.id = (await getLastElementId(Message)) + 1;
    messageToInsert.idCreator = idCreator;
    messageToInsert.date = new Date().toISOString().split("T")[0];
    messageToInsert.text = req.body.text;
    messageToInsert.likes = [];
    const message = new Message({ ...messageToInsert });
    const insertedMessage = await message.save().catch((err) => {
        return res.status(500);
    });
    return res.status(200).send(insertedMessage);
});

router.get("/social/followers/:id", async (req, res) => {
    const userWithId = await User.findOne({ id: req.params.id });
    if (userWithId) {
        const followersId = userWithId.followers;
        let followers = [];
        for (const followerId of followersId) {
            let follower = await User.findOne({ id: followerId });
            followers.push(follower.username);
        }
        return res.status(200).send(followers);
    } else {
        return res.status(404).send("User not found");
    }
});

router.post("/social/followers/:id", async (req, res) => {
    const cookie = req.headers["jwtoken"];
    let id;
    if (cookie) {
        try {
            const decoded = jwt.verify(cookie, SECRET_KEY_JWT);
            id = decoded.id;
        } catch (err) {
            return res.status(401).send("Invalid token");
        }
    } else {
        return res.status(403).send("No token provided");
    }
    const idToFollow = parseInt(req.params.id);
    if (idToFollow === id) {
        return res.status(409).send("Cannot follow itself");
    }
    let userToFollow = await User.findOne({ id: idToFollow });
    if (userToFollow) {
        if (!userToFollow.followers.includes(id)) {
            userToFollow = await User.findOneAndUpdate(
                { id: idToFollow },
                { $push: { followers: id } }
            );
            return res.status(200).send(userToFollow);
        } else {
            return res.status(409).send("Already following");
        }
    } else {
        return res.status(404).send("User not found");
    }
});

router.delete("/social/followers/:id", async (req, res) => {
    const cookie = req.headers["jwtoken"];
    let id;
    if (cookie) {
        try {
            const decoded = jwt.verify(cookie, SECRET_KEY_JWT);
            id = decoded.id;
        } catch (err) {
            return res.status(401).send("Invalid token");
        }
    } else {
        return res.status(403).send("No token provided");
    }
    const idToUnfollow = req.params.id;
    let user = await User.findOne({ id: id });
    if (user) {
        if (user.followers.includes(idToUnfollow)) {
            user = await User.findOneAndUpdate(
                { id: id },
                { $pop: { followers: idToUnfollow } }
            );
            return res.status(200).send(userToUnfollow);
        } else {
            return res.status(409).send("Not following user");
        }
    } else {
        return res.status(404).send("User not found");
    }
});

router.get("/social/feed", (req, res) => {});

router.post("/social/like/:idMessage", (req, res) => {});

router.delete("/social/like/:idMessage", (req, res) => {});

router.get("/social/search?q=query", (req, res) => {});

router.get("/social/whoami", (req, res) => {
    const cookie = req.headers["jwtoken"];
    if (cookie) {
        jwt.verify(cookie, SECRET_KEY_JWT, async function (err, decodedToken) {
            if (err) {
                return res.status(401).send("Invalid token");
            } else {
                let id = decodedToken.id;
                const userWithId = await User.findOne({ id: parseInt(id) });
                if (userWithId) {
                    return res.status(200).send(userWithId);
                } else {
                    return res.status(404).send("User not found");
                }
            }
        });
    } else {
        return res.status(401).send("Unauthorized");
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
