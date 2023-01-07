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
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: error.array() });
        } else {
            if (req.isAuth) {
                let id = req.id;
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
                            messageToLike = await Message.findOne({
                                id: idToLike,
                            });
                            return res
                                .status(StatusCodes.OK)
                                .json({ message: messageToLike });
                        } else {
                            return res
                                .status(StatusCodes.CONFLICT)
                                .json({ error: "Already liked" });
                        }
                    } else {
                        return res
                            .status(StatusCodes.NOT_FOUND)
                            .json({ error: "Message not found" });
                    }
                } else {
                    return res
                        .status(StatusCodes.NOT_FOUND)
                        .json({ error: "User not found" });
                }
            } else {
                return res
                    .status(StatusCodes.UNAUTHORIZED)
                    .json({ error: "Unauthorized" });
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
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: error.array() });
        } else {
            if (req.isAuth) {
                let id = req.id;
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
                            messageToUnlike = await Message.findOne({
                                id: idToUnlike,
                            });
                            return res
                                .status(StatusCodes.OK)
                                .json({ message: messageToUnlike });
                        } else {
                            return res
                                .status(StatusCodes.CONFLICT)
                                .json({ error: "Not liked yet" });
                        }
                    } else {
                        return res
                            .status(StatusCodes.NOT_FOUND)
                            .json({ error: "Message not found" });
                    }
                } else {
                    return res
                        .status(StatusCodes.NOT_FOUND)
                        .json({ error: "User not found" });
                }
            } else {
                return res
                    .status(StatusCodes.UNAUTHORIZED)
                    .json({ error: "Unauthorized" });
            }
        }
    }
);

module.exports = router;
