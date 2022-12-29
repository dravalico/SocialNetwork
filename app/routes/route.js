const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User } = require("../db/models/user.js");
const { Message } = require("../db/models/message.js");
const { StatusCodes } = require("http-status-codes");
const {
    param,
    query,
    cookies,
    header,
    body,
    validationResult,
} = require("express-validator");

const SECRET_KEY_JWT = "will it work?";

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

router.get(
    "/social/users/:id?",
    [
        param("id")
            .notEmpty()
            .withMessage("The id must be not empty")
            .isNumeric()
            .withMessage("The id must be a number"),
    ],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: error.array() });
        } else {
            const userWithId = await User.findOne(
                { id: req.params.id },
                "name surname username bio followers following"
            );
            if (userWithId) {
                return res.status(StatusCodes.OK).send(userWithId);
            } else {
                return res.status(StatusCodes.NOT_FOUND).send("User not found");
            }
        }
    }
);

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
                const userWithId = await User.findOne({ id: decodedToken.id });
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
        return res.status(StatusCodes.FORBIDDEN).send("No token provided");
    }
});

module.exports = router;
