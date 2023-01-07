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
            const messagesFromUser = await Message.find({
                idCreator: req.params.userId,
            });
            if (messagesFromUser.length !== 0) {
                return res
                    .status(StatusCodes.OK)
                    .json({ messages: messagesFromUser });
            } else {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ error: "No messages" });
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
            const message = await Message.findOne({
                idCreator: req.params.userId,
                id: req.params.idMsg,
            });
            if (message) {
                return res.status(StatusCodes.OK).json({ message: message });
            } else {
                return res
                    .status(StatusCodes.NOT_FOUND)
                    .json({ error: "No message" });
            }
        }
    }
);

router.post(
    "",
    [
        body("text")
            .notEmpty()
            .withMessage("The message must be not empty")
            .isString()
            .withMessage("The message must be a string"),
    ],
    async (req, res) => {
        if (req.isAuth) {
            let idCreator = req.id;
            let messageToInsert = {};
            messageToInsert.id = (await getLastElementId(Message)) + 1;
            messageToInsert.idCreator = idCreator;
            messageToInsert.date = new Date().toISOString();
            messageToInsert.text = req.body.text;
            messageToInsert.likes = [];
            const message = new Message({ ...messageToInsert });
            const insertedMessage = await message.save().catch((err) => {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
            });
            return res
                .status(StatusCodes.CREATED)
                .json({ message: messageToInsert });
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorized" });;
        }
    }
);

module.exports = router;
