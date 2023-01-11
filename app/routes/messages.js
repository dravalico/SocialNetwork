const express = require("express");
const router = express.Router();
const { Message } = require("../db/models/message.js");
const { StatusCodes } = require("http-status-codes");
const { param, body, validationResult } = require("express-validator");
const { getLastElementId } = require("../util.js");

router.get(
    "/:userId?",
    [
        param("userId")
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
                let messagesFromUser = await Message.find({
                    idCreator: req.params.userId,
                });
                if (messagesFromUser.length !== 0) {
                    // TODO delete _ids
                    return res
                        .status(StatusCodes.OK)
                        .json({ messages: messagesFromUser });
                } else {
                    return res
                        .status(StatusCodes.NOT_FOUND)
                        .json({ error: "No messages" });
                }
            } catch {
                return res
                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ error: "Server error" });
            }
        }
    }
);

router.get(
    "/:userId?/:idMsg?",
    [
        param("userId")
            .notEmpty()
            .withMessage("The user id must be not empty")
            .isNumeric()
            .withMessage("The user id must be a number"),
        param("idMsg")
            .notEmpty()
            .withMessage("The message id must be not empty")
            .isNumeric()
            .withMessage("The message id must be a number"),
    ],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: error.array() });
        } else {
            try {
                let message = await Message.findOne({
                    idCreator: req.params.userId,
                    id: req.params.idMsg,
                });
                if (message) {
                    delete message._id;
                    return res
                        .status(StatusCodes.OK)
                        .json({ message: message });
                } else {
                    return res
                        .status(StatusCodes.NOT_FOUND)
                        .json({ error: "No message" });
                }
            } catch {
                return res
                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ error: "Server error" });
            }
        }
    }
);

router.post(
    "",
    [
        body("text")
            .trim()
            .notEmpty()
            .withMessage("The message must be not empty")
            .isString()
            .withMessage("The message must be a string"),
    ],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: error.array() });
        } else {
            if (req.isAuth) {
                let idCreator = req.id;
                let messageToInsert = {};
                messageToInsert.id = (await getLastElementId(Message)) + 1;
                messageToInsert.idCreator = idCreator;
                messageToInsert.date = new Date().toISOString();
                messageToInsert.text = req.body.text;
                messageToInsert.likes = [];
                try {
                    const message = new Message({ ...messageToInsert });
                    let insertedMessage = await message.save();
                    delete insertedMessage._id;
                    return res
                        .status(StatusCodes.CREATED)
                        .json({ message: insertedMessage });
                } catch {
                    return res
                        .status(StatusCodes.INTERNAL_SERVER_ERROR)
                        .json({ error: "Server error" });
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
