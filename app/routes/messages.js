const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
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
                return res.status(StatusCodes.OK).send(messagesFromUser);
            } else {
                return res.status(StatusCodes.NOT_FOUND).send("No messages");
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
                return res.status(StatusCodes.OK).send(message);
            } else {
                return res.status(StatusCodes.NOT_FOUND).send("No message");
            }
        }
    }
);

router.post("", async (req, res) => {
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

module.exports = router;