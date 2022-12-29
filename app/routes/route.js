const express = require("express");
const router = express.Router();
const { User } = require("../db/models/user.js");
const { Message } = require("../db/models/message.js");
const { StatusCodes } = require("http-status-codes");
const { param, validationResult } = require("express-validator");

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
    if (req.isAuth) {
        const user = await User.findOne({ id: req.id });
        let numberOfMessages = req.query.q;
        if (numberOfMessages == null) {
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
                return res
                    .status(StatusCodes.CONFLICT)
                    .send("No following yet");
            }
        } else {
            return res.status(StatusCodes.NOT_FOUND).send("User not found");
        }
    } else {
        return res.status(StatusCodes.UNAUTHORIZED);
    }
});

router.get("/social/search?q=query", (req, res) => {});

router.get("/social/whoami", async (req, res) => {
    if (req.isAuth) {
        const userWithId = await User.findOne({ id: req.id });
        if (userWithId) {
            return res.status(StatusCodes.OK).send(userWithId);
        } else {
            return res.status(StatusCodes.NOT_FOUND).send("User not found");
        }
    } else {
        return res.status(StatusCodes.UNAUTHORIZED);
    }
});

module.exports = router;
