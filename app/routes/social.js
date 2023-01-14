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
    async (req, res, next) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            res.status(StatusCodes.BAD_REQUEST);
            return next(error.array());
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
                    res.status(StatusCodes.NOT_FOUND);
                    return next("User not found");
                }
            } catch (err) {
                console.log("ERROR: " + err);
                next("Server error");
            }
        }
    }
);

router.get(
    "/feed",
    [
        query("page")
            .trim()
            .notEmpty()
            .withMessage("The query must be not empty")
            .isNumeric()
            .withMessage("The query must be a number"),
    ],
    async (req, res, next) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            res.status(StatusCodes.BAD_REQUEST);
            return next(error.array());
        } else {
            if (req.isAuth) {
                try {
                    const user = await User.findOne({ id: req.id });
                    let page = req.query.page;
                    if (user) {
                        if (user.following.length !== 0) {
                            const feed = await Message.find({
                                idCreator: { $in: user.following },
                            })
                                .sort({ id: -1 })
                                .skip(page * 6)
                                .limit(6);
                            if (feed.length !== 0) {
                                return res
                                    .status(StatusCodes.OK)
                                    .json({ feed: feed });
                            } else {
                                res.status(StatusCodes.NOT_FOUND);
                                return next("No messages found");
                            }
                        } else {
                            res.status(StatusCodes.CONFLICT);
                            return next("No following yet");
                        }
                    } else {
                        res.status(StatusCodes.NOT_FOUND);
                        return next("User not found");
                    }
                } catch (err) {
                    console.log("ERROR: " + err);
                    return next("Server error");
                }
            } else {
                res.status(StatusCodes.UNAUTHORIZED);
                next("Unauthorized");
            }
        }
    }
);

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
    async (req, res, next) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            res.status(StatusCodes.BAD_REQUEST);
            return next(error.array());
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
                    res.status(StatusCodes.NOT_FOUND);
                    return next("No matches with query");
                }
            } catch (err) {
                console.log("ERROR: " + err);
                next("Server error");
            }
        }
    }
);

router.get("/whoami", async (req, res, next) => {
    if (req.isAuth) {
        try {
            const userWithId = await User.findOne({ id: req.id });
            if (userWithId) {
                return res.status(StatusCodes.OK).json({ user: userWithId });
            } else {
                res.status(StatusCodes.NOT_FOUND);
                return next("User not found");
            }
        } catch (err) {
            console.log("ERROR: " + err);
            return next("Server error");
        }
    } else {
        res.status(StatusCodes.UNAUTHORIZED);
        next("Unauthorized");
    }
});

module.exports = router;
