const express = require("express");
const router = express.Router();
const { User } = require("../db/models/user.js");
const { Message } = require("../db/models/message.js");
const { StatusCodes } = require("http-status-codes");
const { param, validationResult } = require("express-validator");

router.post(
    "/:idMessage?",
    [
        param("idMessage")
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
            if (req.isAuth) {
                const id = req.id;
                const idToLike = req.params.idMessage;
                try {
                    const user = await User.findOne({ id: id });
                    let messageToLike = await Message.findOne({ id: idToLike });
                    if (user) {
                        if (messageToLike) {
                            if (!messageToLike.likes.includes(id)) {
                                messageToLike = await Message.findOneAndUpdate(
                                    { id: idToLike },
                                    { $push: { likes: id } }
                                );
                                messageToLike = await Message.findOne({
                                    id: idToLike,
                                });
                                delete messageToLike._id;
                                return res
                                    .status(StatusCodes.OK)
                                    .json({ message: messageToLike });
                            } else {
                                res.status(StatusCodes.CONFLICT);
                                return next("Already liked");
                            }
                        } else {
                            res.status(StatusCodes.NOT_FOUND);
                            return next("Message not found");
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

router.delete(
    "/:idMessage?",
    [
        param("idMessage")
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
            if (req.isAuth) {
                const id = req.id;
                const idToUnlike = req.params.idMessage;
                try {
                    const user = await User.findOne({ id: id });
                    let messageToUnlike = await Message.findOne({
                        id: idToUnlike,
                    });
                    if (user) {
                        if (messageToUnlike) {
                            if (messageToUnlike.likes.includes(id)) {
                                messageToUnlike =
                                    await Message.findOneAndUpdate(
                                        { id: idToUnlike },
                                        { $pull: { likes: id } }
                                    );
                                messageToUnlike = await Message.findOne({
                                    id: idToUnlike,
                                });
                                delete messageToUnlike._id;
                                return res
                                    .status(StatusCodes.OK)
                                    .json({ message: messageToUnlike });
                            } else {
                                res.status(StatusCodes.CONFLICT);
                                return next("Not liked yet");
                            }
                        } else {
                            res.status(StatusCodes.NOT_FOUND);
                            return next("Message not found");
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

module.exports = router;
