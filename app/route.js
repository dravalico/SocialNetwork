const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("./db/user-schema.js");
const { Message } = require("./db/message-schema.js");
const { StatusCodes } = require("http-status-codes");

const SECRET_KEY_JWT = "will it work?";

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
    userToInsert.followersId = [];
    userToInsert.followingId = [];
    const token = generateJWT(userToInsert.id, userToInsert.username);
    const insertedUser = await new User({ ...userToInsert })
        .save()
        .catch((err) => {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
        });
    return res
        .cookie("jwtoken", token, {
            maxAge: 1296000000,
            httpOnly: true,
        })
        .status(StatusCodes.OK)
        .send(userToInsert);
});

router.post("/auth/signin", async (req, res) => {
    const userToLogin = req.body;
    const user = await User.findOne({ username: userToLogin.username });
    if (user) {
        user.comparePassword(userToLogin.password, (err, match) => {
            if (match && !err) {
                const token = generateJWT(user.id, user.username);
                return res
                    .cookie("jwtoken", token, {
                        maxAge: 1296000000,
                        httpOnly: true,
                    })
                    .status(StatusCodes.OK)
                    .send(userToLogin);
            } else {
                return res
                    .status(StatusCodes.FORBIDDEN)
                    .send("Invalid credentials");
            }
        });
    } else {
        return res
            .status(StatusCodes.NOT_FOUND)
            .send("No user with those credentials");
    }
});

router.get("/social/users/:id", async (req, res) => {
    const userWithId = await User.findOne(
        { id: parseInt(req.params.id) },
        "name surname username bio followers following"
    );
    if (userWithId) {
        return res.status(StatusCodes.OK).send(userWithId);
    } else {
        return res.status(StatusCodes.NOT_FOUND).send("User not found");
    }
});

router.get("/social/messages/:userId", async (req, res) => {
    const userId = req.params.userId;
    const messagesFromUser = await Message.find({ idCreator: userId });
    if (messagesFromUser.length !== 0) {
        return res.status(StatusCodes.OK).send(messagesFromUser);
    } else {
        return res.status(StatusCodes.NOT_FOUND).send("No messages");
    }
});

router.get("/social/messages/:userId/:idMsg", async (req, res) => {
    const userId = req.params.userId;
    const idMsg = req.params.idMsg;
    const message = await Message.findOne({ idCreator: userId, id: idMsg });
    if (message) {
        return res.status(StatusCodes.OK).send(message);
    } else {
        return res.status(StatusCodes.NOT_FOUND).send("No message");
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
            return res.status(StatusCodes.UNAUTHORIZED).send("Invalid token");
        }
    } else {
        return res.status(StatusCodes.FORBIDDEN).send("No token provided");
    }
    let messageToInsert = {};
    messageToInsert.id = (await getLastElementId(Message)) + 1;
    messageToInsert.idCreator = idCreator;
    messageToInsert.date = new Date().toISOString().split("T")[0];
    messageToInsert.text = req.body.text;
    messageToInsert.likes = [];
    const message = new Message({ ...messageToInsert });
    const insertedMessage = await message.save().catch((err) => {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    });
    return res.status(StatusCodes.OK).send(insertedMessage);
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
        return res.status(StatusCodes.OK).send(followers);
    } else {
        return res.status(StatusCodes.NOT_FOUND).send("User not found");
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
            return res.status(StatusCodes.UNAUTHORIZED).send("Invalid token");
        }
    } else {
        return res.status(StatusCodes.FORBIDDEN).send("No token provided");
    }
    const idToFollow = parseInt(req.params.id);
    if (idToFollow === id) {
        return res.status(StatusCodes.CONFLICT).send("Cannot follow itself");
    }
    let user = await User.findOne({ id: id });
    let userToFollow = await User.findOne({ id: idToFollow });
    if (user && userToFollow) {
        if (!user.following.includes(idToFollow)) {
            user = await User.findOneAndUpdate(
                { id: id },
                { $push: { following: idToFollow } }
            );
            userToFollow = await User.findOneAndUpdate(
                { id: idToFollow },
                { $push: { followers: id } }
            );
            user = await User.findOne({ id: id });
            return res.status(StatusCodes.OK).send(user);
        } else {
            return res.status(StatusCodes.CONFLICT).send("Already following");
        }
    } else if (userToFollow === undefined) {
        return res.status(StatusCodes.NOT_FOUND).send("User not found");
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
            return res.status(StatusCodes.UNAUTHORIZED).send("Invalid token");
        }
    } else {
        return res.status(StatusCodes.FORBIDDEN).send("No token provided");
    }
    const idToUnfollow = req.params.id;
    let user = await User.findOne({ id: id });
    let userToUnfollow = await User.findOne({ id: idToUnfollow });
    if (user && userToUnfollow) {
        if (user.following.includes(idToUnfollow)) {
            user = await User.findOneAndUpdate(
                { id: id },
                { $pull: { following: idToUnfollow } }
            );
            userToUnfollow = await User.findOneAndUpdate(
                { id: idToUnfollow },
                { $pull: { followers: id } }
            );
            user = await User.findOne({ id: id });
            return res.status(StatusCodes.OK).send(user);
        } else {
            return res.status(StatusCodes.CONFLICT).send("Not following user");
        }
    } else {
        return res.status(StatusCodes.NOT_FOUND).send("User not found");
    }
});

router.get("/social/feed", async (req, res) => {
    const cookie = req.headers["jwtoken"];
    let id;
    if (cookie) {
        try {
            const decoded = jwt.verify(cookie, SECRET_KEY_JWT);
            id = decoded.id;
        } catch (err) {
            return res.status(StatusCodes.UNAUTHORIZED).send("Invalid token");
        }
    } else {
        return res.status(StatusCodes.FORBIDDEN).send("No token provided");
    }
    const user = await User.findOne({ id: id });
    let numberOfMessages = req.query.q;
    if (numberOfMessages === undefined) {
        numberOfMessages = 10;
    }
    if (user) {
        if (user.following.length !== 0) {
            const feed = await Message.find({
                idCreator: { $in: user.following },
            })
                .sort({ id: -1 })
                .limit(numberOfMessages);
            if (feed.length !== 0) {
                return res.status(StatusCodes.OK).send(feed);
            } else {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .send("No messages found");
            }
        } else {
            return res.status(StatusCodes.CONFLICT).send("No following yet");
        }
    } else {
        return res.status(StatusCodes.NOT_FOUND).send("User not found");
    }
});

router.post("/social/like/:idMessage", async (req, res) => {
    const cookie = req.headers["jwtoken"];
    let id;
    if (cookie) {
        try {
            const decoded = jwt.verify(cookie, SECRET_KEY_JWT);
            id = decoded.id;
        } catch (err) {
            return res.status(StatusCodes.UNAUTHORIZED).send("Invalid token");
        }
    } else {
        return res.status(StatusCodes.FORBIDDEN).send("No token provided");
    }
    const idToLike = req.params.idMessage;
    let user = await User.findOne({ id: id });
    let messageToLike = await Message.findOne({ id: idToLike });
    if (user) {
        if (messageToLike) {
            if (!messageToLike.likes.includes(id)) {
                messageToLike = await Message.findOneAndUpdate(
                    { id: idToLike },
                    { $push: { likes: id } }
                );
                messageToLike = await Message.findOne({ id: idToLike });
                return res.status(StatusCodes.OK).send(messageToLike);
            } else {
                return res.status(StatusCodes.CONFLICT).send("Already liked");
            }
        } else {
            return res.status(StatusCodes.NOT_FOUND).send("Message not found");
        }
    } else {
        return res.status(StatusCodes.NOT_FOUND).send("User not found");
    }
});

router.delete("/social/like/:idMessage", async (req, res) => {
    const cookie = req.headers["jwtoken"];
    let id;
    if (cookie) {
        try {
            const decoded = jwt.verify(cookie, SECRET_KEY_JWT);
            id = decoded.id;
        } catch (err) {
            return res.status(StatusCodes.UNAUTHORIZED).send("Invalid token");
        }
    } else {
        return res.status(StatusCodes.FORBIDDEN).send("No token provided");
    }
    const idToUnlike = req.params.idMessage;
    let user = await User.findOne({ id: id });
    let messageToUnlike = await Message.findOne({ id: idToUnlike });
    if (user) {
        if (messageToUnlike) {
            if (messageToUnlike.likes.includes(id)) {
                messageToUnlike = await Message.findOneAndUpdate(
                    { id: idToUnlike },
                    { $pull: { likes: id } }
                );
                messageToUnlike = await Message.findOne({ id: idToUnlike });
                return res.status(StatusCodes.OK).send(messageToUnlike);
            } else {
                return res.status(StatusCodes.CONFLICT).send("Not liked yet");
            }
        } else {
            return res.status(StatusCodes.NOT_FOUND).send("Message not found");
        }
    } else {
        return res.status(StatusCodes.NOT_FOUND).send("User not found");
    }
});

router.get("/social/search?q=query", (req, res) => {});

router.get("/social/whoami", (req, res) => {
    const cookie = req.headers["jwtoken"];
    if (cookie) {
        jwt.verify(cookie, SECRET_KEY_JWT, async function (err, decodedToken) {
            if (err) {
                return res
                    .status(StatusCodes.UNAUTHORIZED)
                    .send("Invalid token");
            } else {
                let id = decodedToken.id;
                const userWithId = await User.findOne({ id: parseInt(id) });
                if (userWithId) {
                    return res.status(StatusCodes.OK).send(userWithId);
                } else {
                    return res
                        .status(StatusCodes.NOT_FOUND)
                        .send("User not found");
                }
            }
        });
    } else {
        return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");
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
