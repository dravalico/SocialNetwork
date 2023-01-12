const express = require("express");
const router = express.Router();
const { User } = require("../db/models/user.js");
const { Message } = require("../db/models/message.js");
const { StatusCodes } = require("http-status-codes");
const { query, param, validationResult } = require("express-validator");

router.get(
    "/users/:id?",
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
            try {
                let userWithId = await User.findOne({ id: req.params.id });
                if (userWithId) {
                    userWithId = userWithId.toObject();
                    delete userWithId._id;
                    delete userWithId.password;
                    return res
                        .status(StatusCodes.OK)
                        .json({ user: userWithId });
                } else {
                    return res
                        .status(StatusCodes.NOT_FOUND)
                        .json({ error: "User not found" });
                }
            } catch (err) {
                console.log("ERROR: " + err);
                return res
                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ error: "Server error" });
            }
        }
    }
);

router.get("/feed", async (req, res) => {
    if (req.isAuth) {
        try {
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
                        return res.status(StatusCodes.OK).json({ feed: feed });
                    } else {
                        return res
                            .status(StatusCodes.NOT_FOUND)
                            .json({ error: "No messages found" });
                    }
                } else {
                    return res
                        .status(StatusCodes.CONFLICT)
                        .json({ error: "No following yet" });
                }
            } else {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ error: "User not found" });
            }
        } catch (err) {
            console.log("ERROR: " + err);
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: "Server error" });
        }
    } else {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ error: "Unauthorized" });
    }
});

router.get(
    "/search",
    [
        query("q")
            .trim()
            .notEmpty()
            .withMessage("The query must be not empty")
            .isString()
            .withMessage("The query must be a string"),
    ],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: error.array() });
        } else {
            const query = req.query.q;
            try {
                const users = await User.find({
                    $or: [
                        { name: { $regex: query, $options: "i" } },
                        { surname: { $regex: query, $options: "i" } },
                        { username: { $regex: query, $options: "i" } },
                    ],
                }); // https://stackoverflow.com/questions/63770258/how-to-use-query-mongoose-using-a-like-operator-similar-to-that-of-sql
                if (users.length !== 0) {
                    // TODO delete _ids and passwords
                    return res.status(StatusCodes.OK).json({ users: users });
                } else {
                    return res
                        .status(StatusCodes.NOT_FOUND)
                        .json({ error: "No matches with query" });
                }
            } catch (err) {
                console.log("ERROR: " + err);
                return res
                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ error: "Server error" });
            }
        }
    }
);

router.get("/whoami", async (req, res) => {
    if (req.isAuth) {
        try {
            const userWithId = await User.findOne({ id: req.id });
            if (userWithId) {
                return res.status(StatusCodes.OK).json({ user: userWithId });
            } else {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ error: "User not found" });
            }
        } catch (err) {
            console.log("ERROR: " + err);
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: "Server error" });
        }
    } else {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ error: "Unauthorized" });
    }
});

module.exports = router;
